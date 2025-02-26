import BigNumber from 'bignumber.js'
import {describe, expect, test} from 'vitest'
import {formatBigNumber} from '../../src/helpers/formatNumber'

describe('formatNumber', () => {
  describe('formatBigNumber', () => {
    test('should format number without options', () => {
      const number = new BigNumber('1234.5678')
      expect(formatBigNumber(number)).toBe('1\u00A0234.5678')
    })

    test('should format number with prefix and suffix', () => {
      const number = new BigNumber('1234.5678')
      expect(formatBigNumber(number, {prefix: '$', suffix: ' USD'})).toBe(
        '$1\u00A0234.5678 USD',
      )
    })

    test('should format number with minDecimals', () => {
      const number = new BigNumber('1234.5')
      expect(formatBigNumber(number, {minDecimals: 4})).toBe('1\u00A0234.5000')
    })

    test('should format number with maxDecimals', () => {
      const number = new BigNumber('1234.5678')
      expect(formatBigNumber(number, {maxDecimals: 2})).toBe('1\u00A0234.57')
    })

    test('should format number with fixed decimals', () => {
      const number = new BigNumber('1234.5')
      expect(
        formatBigNumber(number, {maxDecimals: 4, fixedDecimals: true}),
      ).toBe('1\u00A0234.5000')
    })

    test('should format number with both min and max decimals', () => {
      const number = new BigNumber('1234.5')
      expect(formatBigNumber(number, {minDecimals: 2, maxDecimals: 4})).toBe(
        '1\u00A0234.50',
      )
    })

    test('should handle infinity', () => {
      const number = new BigNumber('Infinity')
      expect(formatBigNumber(number)).toBe('Infinity')
    })

    test('should handle negative infinity', () => {
      const number = new BigNumber('-Infinity')
      expect(formatBigNumber(number)).toBe('-Infinity')
    })

    test('should handle zero with fixed decimals', () => {
      const number = new BigNumber('0')
      expect(
        formatBigNumber(number, {maxDecimals: 2, fixedDecimals: true}),
      ).toBe('0.00')
    })

    test('should handle very large numbers', () => {
      const number = new BigNumber('123456789.123456789')
      expect(formatBigNumber(number, {maxDecimals: 2})).toBe(
        '123\u00A0456\u00A0789.12',
      )
    })

    test('should handle negative numbers', () => {
      const number = new BigNumber('-1234.5678')
      expect(formatBigNumber(number, {maxDecimals: 2})).toBe('-1\u00A0234.57')
    })
  })
})
