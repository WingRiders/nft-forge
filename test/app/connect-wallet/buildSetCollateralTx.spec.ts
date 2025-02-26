import type {BrowserWallet} from '@meshsdk/core'
import {describe, expect, test, vi} from 'vitest'
import {buildAndSubmitSetCollateralTx} from '../../../src/app/connect-wallet/buildSetCollateralTx'
import {
  adaOnlyUtxo5,
  adaOnlyUtxo10,
  ownerAddress,
} from '../../fixtures/data/wallet'
import {buildMockedWallet} from '../../fixtures/helpers/wallet'

describe('buildAndSubmitSetCollateralTx', async () => {
  test('should build and submit a set collateral transaction', async () => {
    const mockedWallet = buildMockedWallet({
      utxos: [adaOnlyUtxo5, adaOnlyUtxo10],
      changeAddress: ownerAddress,
    })

    const txHash = await buildAndSubmitSetCollateralTx(
      mockedWallet as unknown as BrowserWallet,
    )
    expect(txHash).toEqual(
      '68198527a63f2f4c0913e94963622ff8cccce2ce6496c9101b22c42cf6d31b01',
    )
  })

  test('should throw an error if there is not enough funds', async () => {
    const mockedWallet = buildMockedWallet({
      utxos: [adaOnlyUtxo5],
      changeAddress: ownerAddress,
    })

    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const txHashPromise = buildAndSubmitSetCollateralTx(
      mockedWallet as unknown as BrowserWallet,
    )
    await expect(txHashPromise).rejects.toThrow(
      'Not enough funds to satisfy outputs',
    )

    consoleWarn.mockRestore()
  })
})
