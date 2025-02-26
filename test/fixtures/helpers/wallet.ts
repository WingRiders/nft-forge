import type {BrowserWallet, UTxO} from '@meshsdk/core'
import {blake2b} from 'blakejs'

type BuildMockedWalletArgs = {
  utxos: UTxO[]
  changeAddress: string
  networkId?: number
}
export const buildMockedWallet = ({
  utxos,
  changeAddress,
  networkId = 0,
}: BuildMockedWalletArgs): BrowserWallet => {
  const mockedWallet: Partial<BrowserWallet> = {
    getUtxos: () => Promise.resolve(utxos),
    getChangeAddress: () => Promise.resolve(changeAddress),
    getNetworkId: () => Promise.resolve(networkId),
    signTx: (unsignedTx: string) => Promise.resolve(unsignedTx), // returning the unsigned tx as signed
    submitTx: (tx: string) =>
      Promise.resolve(Buffer.from(blake2b(tx, undefined, 32)).toString('hex')), // this is not a correct implementation, but it's ok for the tests
  }

  return mockedWallet as unknown as BrowserWallet
}
