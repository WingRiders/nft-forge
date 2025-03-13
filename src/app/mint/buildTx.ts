import {
  type BrowserWallet,
  CIP68_100,
  CIP68_222,
  MeshTxBuilder,
  OfflineFetcher,
  deserializeAddress,
  metadataToCip68,
  resolveScriptHash,
  resolveSlotNo,
  serializePlutusScript,
  stringToHex,
} from '@meshsdk/core'

import type BigNumber from 'bignumber.js'
import {addMinutes, isBefore} from 'date-fns'
import {omitBy} from 'lodash'
import {isCollateralUtxo} from '../../helpers/collateral'
import {prepareMetadatumForTx} from '../../helpers/metadata'
import {getTxFee} from '../../helpers/transaction'
import {walletNetworkIdToNetwork} from '../../helpers/wallet'
import {applyParamsToMinterScript} from '../../onChain/mint'
import {CollectionStandard, type CollectionState} from '../../store/collection'

const VALIDITY_END_OFFSET_MINUTES = 30

type BuildMintTxArgs = {
  collection: Pick<
    CollectionState,
    'uuid' | 'website' | 'mintEndDate' | 'nftsData' | 'standard'
  >
  wallet: BrowserWallet
  now?: Date // if not provided, the current date will be used
}

export type BuildMintTxResult = {
  builtTx: string
  txFee: BigNumber
  policyId: string
}

export const buildMintTx = async ({
  collection,
  wallet,
  now = new Date(),
}: BuildMintTxArgs): Promise<BuildMintTxResult> => {
  if (!collection.nftsData || Object.keys(collection.nftsData).length === 0) {
    throw new Error('No NFTs to mint')
  }
  if (!collection.uuid) {
    throw new Error('Collection UUID is required')
  }

  if (collection.mintEndDate != null && isBefore(collection.mintEndDate, now)) {
    throw new Error('Cannot mint NFTs after the mint end date')
  }

  const utxos = await wallet.getUtxos()
  const collateralUtxo = utxos.find(isCollateralUtxo)
  if (!collateralUtxo) {
    throw new Error('No collateral UTxO found')
  }

  const standard = collection.standard ?? CollectionStandard.CIP_25
  const changeAddress = await wallet.getChangeAddress()
  const networkId = await wallet.getNetworkId()
  const network = walletNetworkIdToNetwork(networkId)
  let txValidityEndTime = addMinutes(now, VALIDITY_END_OFFSET_MINUTES).getTime()
  if (collection.mintEndDate) {
    txValidityEndTime = Math.min(txValidityEndTime, collection.mintEndDate)
  }
  const txValidityEndSlot = Number.parseInt(
    resolveSlotNo(network, txValidityEndTime),
    10,
  )

  const {pubKeyHash: authorityKeyHex} = deserializeAddress(changeAddress)

  const minterScript = await applyParamsToMinterScript({
    collectionIdHex: Buffer.from(collection.uuid, 'utf-8').toString('hex'),
    authorityKeyHex,
    endDate: collection.mintEndDate,
  })
  const policyId = resolveScriptHash(minterScript, 'V3')
  const scriptAddress = serializePlutusScript(
    {version: 'V3', code: minterScript},
    undefined,
    networkId,
  ).address

  const fetcher = new OfflineFetcher()
  fetcher.addUTxOs(utxos)
  const coreCsl = await import('@meshsdk/core-csl')
  const evaluator = new coreCsl.OfflineEvaluator(fetcher, network)

  const txBuilder = new MeshTxBuilder({
    evaluator: {
      evaluateTx: (tx) => evaluator.evaluateTx(tx, [], []),
    },
  })
  txBuilder
    .setNetwork(network)
    .selectUtxosFrom(utxos)
    .changeAddress(changeAddress)
    .requiredSignerHash(authorityKeyHex)
    .invalidHereafter(txValidityEndSlot)
    .txInCollateral(
      collateralUtxo.input.txHash,
      collateralUtxo.input.outputIndex,
      collateralUtxo.output.amount,
      collateralUtxo.output.address,
    )

  const metadata: Record<
    string,
    Record<
      string,
      {name: string; description?: string; image: string; mediaType: string}
    >
  > = {}

  metadata[policyId] = {}
  Object.values(collection.nftsData).forEach(
    ({
      name,
      description,
      imageIpfsCid,
      imageMimeType,
      assetNameUtf8,
      customFields,
    }) => {
      const assetNameHex = stringToHex(assetNameUtf8)
      metadata[policyId][assetNameHex] = {
        name,
        ...(description ? {description} : {}),
        ...(collection.website ? {Website: collection.website} : {}),
        image: `ipfs://${imageIpfsCid}`,
        mediaType: imageMimeType,
        ...omitBy(customFields, (value) => !value),
      }
    },
  )

  if (standard === CollectionStandard.CIP_25) {
    Object.values(collection.nftsData).forEach(({assetNameUtf8}) => {
      const assetNameHex = stringToHex(assetNameUtf8)
      txBuilder
        .mintPlutusScriptV3()
        .mint('1', policyId, assetNameHex)
        .mintingScript(minterScript)
        .mintRedeemerValue([])
    })

    txBuilder.metadataValue(721, prepareMetadatumForTx(metadata))
  } else {
    Object.values(collection.nftsData).forEach(({assetNameUtf8}) => {
      const assetNameHex = stringToHex(assetNameUtf8)
      const refNftAssetName = CIP68_100(assetNameHex)

      txBuilder
        // mint the reference NFT
        .mintPlutusScriptV3()
        .mint('1', policyId, refNftAssetName)
        .mintingScript(minterScript)
        .mintRedeemerValue([])
        // mint the actual NFT, it is automatically sent to the change address
        .mintPlutusScriptV3()
        .mint('1', policyId, CIP68_222(assetNameHex))
        .mintingScript(minterScript)
        .mintRedeemerValue([])
        // send the reference NFT to the script address
        .txOut(scriptAddress, [
          {unit: `${policyId}${refNftAssetName}`, quantity: '1'},
        ])
        .txOutInlineDatumValue(
          metadataToCip68(metadata[policyId][assetNameHex]),
        )
    })
  }

  const builtTx = await txBuilder.complete()
  const txFee = await getTxFee(builtTx)

  return {builtTx, txFee, policyId}
}
