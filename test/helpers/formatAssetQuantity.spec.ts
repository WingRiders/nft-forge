import BigNumber from 'bignumber.js'
import {describe, expect, test} from 'vitest'
import {getAssetQuantityFormatter} from '../../src/helpers/formatAssetQuantity'

describe('formatAssetQuantity', () => {
  const testSubject =
    '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef54455354'

  test('should format quantity with default options', () => {
    const formatter = getAssetQuantityFormatter({
      subject: testSubject,
      description: 'A test token',
      name: 'TEST',
      ticker: 'TEST',
      decimals: 2,
    })

    const result = formatter(new BigNumber('1234'))
    expect(result).toBe('12.34 TEST')
  })

  test('should format quantity without ticker', () => {
    const formatter = getAssetQuantityFormatter({
      subject: testSubject,
      description: 'A test token',
      name: 'TEST',
      ticker: 'TEST',
      decimals: 2,
    })

    const result = formatter(new BigNumber('1234'), {showTicker: false})
    expect(result).toBe('12.34')
  })

  test('should format quantity with symbol', () => {
    const formatter = getAssetQuantityFormatter({
      subject: testSubject,
      description: 'A test token',
      name: 'TEST',
      ticker: 'TEST',
      symbol: '₳',
      decimals: 2,
    })

    const result = formatter(new BigNumber('1234'), {showSymbol: true})
    expect(result).toBe('12.34 TEST ₳')
  })

  test('should format quantity with fixed decimals', () => {
    const formatter = getAssetQuantityFormatter({
      subject: testSubject,
      description: 'A test token',
      name: 'TEST',
      ticker: 'TEST',
      decimals: 2,
    })

    const result = formatter(new BigNumber('1200'), {fixedDecimals: true})
    expect(result).toBe('12.00 TEST')
  })

  test('should format quantity with max decimals', () => {
    const formatter = getAssetQuantityFormatter({
      subject: testSubject,
      description: 'A test token',
      name: 'TEST',
      ticker: 'TEST',
      decimals: 6,
    })

    const result = formatter(new BigNumber('1234567'), {maxDecimals: 2})
    expect(result).toBe('1.23 TEST')
  })

  test('should format quantity with non-breaking space', () => {
    const formatter = getAssetQuantityFormatter({
      subject: testSubject,
      description: 'A test token',
      name: 'TEST',
      ticker: 'TEST',
      decimals: 2,
    })

    const result = formatter(new BigNumber('1234'), {useNonBreakingSpace: true})
    expect(result).toBe('12.34\xa0TEST')
  })

  test('should use name as ticker when ticker is not provided', () => {
    const formatter = getAssetQuantityFormatter({
      subject: testSubject,
      description: 'A test token',
      name: 'TOKEN',
      decimals: 2,
    })

    const result = formatter(new BigNumber('1234'))
    expect(result).toBe('12.34 TOKEN')
  })

  test('should handle zero decimals', () => {
    const formatter = getAssetQuantityFormatter({
      subject: testSubject,
      description: 'A test token',
      name: 'TEST',
      ticker: 'TEST',
      decimals: 0,
    })

    const result = formatter(new BigNumber('1234'))
    expect(result).toBe('1\u00A0234 TEST')
  })
})
