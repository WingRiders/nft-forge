import {describe, expect, test} from 'vitest'
import {ELLIPSIS} from '../../src/constants'
import {shortLabel} from '../../src/helpers/shortLabel'

describe('shortLabel', () => {
  test('should return full label when length is less than start + end', () => {
    const result = shortLabel('hello', 3, 3)
    expect(result).toBe('hello')
  })

  test('should return shortened label with ellipsis when length exceeds start + end', () => {
    const result = shortLabel('hello world', 2, 3)
    expect(result).toBe(`he${ELLIPSIS}rld`)
  })

  test('should handle empty string', () => {
    const result = shortLabel('', 2, 2)
    expect(result).toBe('')
  })

  test('should handle exact length equal to start + end', () => {
    const result = shortLabel('12345', 2, 2)
    expect(result).toBe('12345')
  })

  test('should handle large start length', () => {
    const result = shortLabel('abcdefghijklmnopqrstuvwxyz', 8, 2)
    expect(result).toBe(`abcdefgh${ELLIPSIS}yz`)
  })

  test('should handle large end length', () => {
    const result = shortLabel('abcdefghijklmnopqrstuvwxyz', 2, 8)
    expect(result).toBe(`ab${ELLIPSIS}stuvwxyz`)
  })
})
