import {describe, expect, test} from 'vitest'
import {isCollateralUtxo} from '../../src/helpers/collateral'
import {
  adaAndTokenUtxo5,
  adaOnlyUtxo5,
  adaOnlyUtxo10,
} from '../fixtures/data/wallet'

describe('collateral', () => {
  describe('isCollateralUtxo', () => {
    test('should return true for UTxO with exactly 5 ADA', () => {
      expect(isCollateralUtxo(adaOnlyUtxo5)).toBe(true)
    })

    test('should return false for UTxO with more than 5 ADA', () => {
      expect(isCollateralUtxo(adaOnlyUtxo10)).toBe(false)
    })

    test('should return false for UTxO containing tokens besides ADA', () => {
      expect(isCollateralUtxo(adaAndTokenUtxo5)).toBe(false)
    })
  })
})
