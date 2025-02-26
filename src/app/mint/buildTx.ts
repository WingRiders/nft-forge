import {
  type BrowserWallet,
  MeshTxBuilder,
  OfflineFetcher,
  deserializeAddress,
  resolveScriptHash,
  resolveSlotNo,
  stringToHex,
} from '@meshsdk/core'

import type BigNumber from 'bignumber.js'
import {addMinutes, isBefore} from 'date-fns'
import {isCollateralUtxo} from '../../helpers/collateral'
import {getTxFee} from '../../helpers/transaction'
import {walletNetworkIdToNetwork} from '../../helpers/wallet'
import {applyParamsToMinterScript} from '../../onChain/mint'
import type {CollectionState} from '../../store/collection'

const VALIDITY_END_OFFSET_MINUTES = 30

type BuildMintTxArgs = {
  collection: Pick<
    CollectionState,
    'uuid' | 'website' | 'mintEndDate' | 'nftsData'
  >
  wallet: BrowserWallet
}

export type BuildMintTxResult = {
  builtTx: string
  txFee: BigNumber
  policyId: string
}

export const buildMintTx = async ({
  collection,
  wallet,
}: BuildMintTxArgs): Promise<BuildMintTxResult> => {
  if (!collection.nftsData || collection.nftsData.length === 0) {
    throw new Error('No NFTs to mint')
  }
  if (!collection.uuid) {
    throw new Error('Collection UUID is required')
  }
  const now = new Date()

  if (collection.mintEndDate != null && isBefore(collection.mintEndDate, now)) {
    throw new Error('Cannot mint NFTs after the mint end date')
  }

  const utxos = await wallet.getUtxos()
  const collateralUtxo = utxos.find(isCollateralUtxo)
  if (!collateralUtxo) {
    throw new Error('No collateral UTxO found')
  }

  const changeAddress = await wallet.getChangeAddress()
  const network = walletNetworkIdToNetwork(await wallet.getNetworkId())
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
  collection.nftsData.forEach(
    ({name, description, imageIpfsCid, imageMimeType, assetNameUtf8}) => {
      const assetNameHex = stringToHex(assetNameUtf8)
      metadata[policyId][assetNameHex] = {
        name,
        ...(description ? {description} : {}),
        ...(collection.website ? {Website: collection.website} : {}),
        image: `ipfs://${imageIpfsCid}`,
        mediaType: imageMimeType,
      }

      txBuilder
        .mintPlutusScriptV3()
        .mint('1', policyId, assetNameHex)
        .mintingScript(minterScript)
        .mintRedeemerValue([])
    },
  )

  txBuilder.metadataValue(721, metadata)

  const builtTx = await txBuilder.complete()
  const txFee = await getTxFee(builtTx)

  return {builtTx, txFee, policyId}
}
