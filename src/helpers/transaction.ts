import type {BrowserWallet} from '@meshsdk/core'
import {useMutation} from '@tanstack/react-query'
import BigNumber from 'bignumber.js'

export const getTxFee = async (tx: string) => {
  const coreCsl = await import('@meshsdk/core-csl')
  const fee = coreCsl.csl.Transaction.from_hex(tx).body().fee().to_str()
  return new BigNumber(fee)
}

type SignAndSubmitTxArgs = {
  tx: string
  wallet: BrowserWallet
  partialSign?: boolean
}

export type SignAndSubmitTxResult = {
  txHash: string
}

export const signAndSubmitTx = async ({
  tx,
  wallet,
  partialSign,
}: SignAndSubmitTxArgs): Promise<SignAndSubmitTxResult> => {
  const signedTx = await wallet.signTx(tx, partialSign)
  const txHash = await wallet.submitTx(signedTx)
  return {txHash}
}

export const useSignAndSubmitTxMutation = () => {
  return useMutation({
    mutationKey: ['sign-and-submit-tx'],
    mutationFn: signAndSubmitTx,
  })
}
