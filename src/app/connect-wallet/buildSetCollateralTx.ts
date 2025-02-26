import {type BrowserWallet, MeshTxBuilder} from '@meshsdk/core'
import {walletNetworkIdToNetwork} from '../../helpers/wallet'

const COLLATERAL_LOVELACE_AMOUNT = 5_000_000

export const buildAndSubmitSetCollateralTx = async (wallet: BrowserWallet) => {
  const changeAddress = await wallet.getChangeAddress()
  const utxos = await wallet.getUtxos()
  const network = walletNetworkIdToNetwork(await wallet.getNetworkId())

  const txBuilder = new MeshTxBuilder({})
  txBuilder
    .setNetwork(network)
    .selectUtxosFrom(utxos)
    .changeAddress(changeAddress)
    .txOut(changeAddress, [
      {unit: 'lovelace', quantity: COLLATERAL_LOVELACE_AMOUNT.toString()},
    ])

  const tx = await txBuilder.complete()
  const signedTx = await wallet.signTx(tx)
  return wallet.submitTx(signedTx)
}
