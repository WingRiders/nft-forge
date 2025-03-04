import {describe, expect, test} from 'vitest'
import {
  METADATA_MAX_STR_LENGTH,
  prepareMetadatumForTx,
  splitMetadatumString,
} from '../../src/helpers/metadata'

describe('metadata', () => {
  describe('splitMetadatumString', () => {
    test('should return the original string if shorter than max length', () => {
      const shortString = 'Short string'
      expect(splitMetadatumString(shortString)).toBe(shortString)
    })

    test('should split string into chunks of max length', () => {
      // Create a string that's exactly 2.5 times the max length
      const longString = 'abc'.repeat(METADATA_MAX_STR_LENGTH * 3)
      const result = splitMetadatumString(longString)

      expect(Array.isArray(result)).toBe(true)
      expect((result as string[]).length).toBe(9)
      expect((result as string[])[0]).toBe(
        'abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabca',
      )
      expect((result as string[])[1]).toBe(
        'bcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcab',
      )
      expect((result as string[])[2]).toBe(
        'cabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabc',
      )
    })

    test('should handle edge cases', () => {
      // String exactly at max length
      const exactString = 'a'.repeat(METADATA_MAX_STR_LENGTH)
      expect(splitMetadatumString(exactString)).toBe(exactString)

      // String just over max length
      const justOverString = 'a'.repeat(METADATA_MAX_STR_LENGTH + 1)
      const result = splitMetadatumString(justOverString)
      expect(Array.isArray(result)).toBe(true)
      expect((result as string[]).length).toBe(2)
      expect((result as string[])[0].length).toBe(METADATA_MAX_STR_LENGTH)
      expect((result as string[])[1].length).toBe(1)
    })
  })

  describe('prepareMetadatumForTx', () => {
    test('should handle flat objects with string values', () => {
      const metadata = {
        key1: 'Short string',
        key2: 'a'.repeat(METADATA_MAX_STR_LENGTH * 2),
        key3: 123,
      }

      const result = prepareMetadatumForTx(metadata) as Record<string, any>

      expect(result.key1).toBe('Short string')
      expect(Array.isArray(result.key2)).toBe(true)
      expect(result.key2.length).toBe(2)
      expect(result.key3).toBe(123)
    })

    test('should handle arrays of strings', () => {
      const metadata = {
        key1: ['Short string', 'a'.repeat(METADATA_MAX_STR_LENGTH * 1.5)],
      }

      const result = prepareMetadatumForTx(metadata) as Record<string, any>

      expect(Array.isArray(result.key1)).toBe(true)
      expect(result.key1[0]).toBe('Short string')
      expect(Array.isArray(result.key1[1])).toBe(true)
      expect(result.key1[1].length).toBe(2)
    })

    test('should handle nested objects', () => {
      const metadata = {
        key1: {
          nestedKey1: 'Short string',
          nestedKey2: 'a'.repeat(METADATA_MAX_STR_LENGTH * 1.5),
        },
      }

      const result = prepareMetadatumForTx(metadata) as Record<string, any>

      expect(typeof result.key1).toBe('object')
      expect(result.key1.nestedKey1).toBe('Short string')
      expect(Array.isArray(result.key1.nestedKey2)).toBe(true)
      expect(result.key1.nestedKey2.length).toBe(2)
    })

    test('should handle complex nested structures', () => {
      const metadata = {
        key1: {
          nestedKey1: [
            'Short string',
            'a'.repeat(METADATA_MAX_STR_LENGTH * 1.5),
          ],
          nestedKey2: {
            deeplyNestedKey: 'a'.repeat(METADATA_MAX_STR_LENGTH * 2),
          },
        },
        key2: [
          {arrayObjectKey: 'a'.repeat(METADATA_MAX_STR_LENGTH * 1.2)},
          'a'.repeat(METADATA_MAX_STR_LENGTH * 1.3),
        ],
      }

      const result = prepareMetadatumForTx(metadata) as Record<string, any>

      // Check nested object with array
      expect(typeof result.key1).toBe('object')
      expect(Array.isArray(result.key1.nestedKey1)).toBe(true)
      expect(result.key1.nestedKey1[0]).toBe('Short string')
      expect(Array.isArray(result.key1.nestedKey1[1])).toBe(true)

      // Check deeply nested object
      expect(typeof result.key1.nestedKey2).toBe('object')
      expect(Array.isArray(result.key1.nestedKey2.deeplyNestedKey)).toBe(true)
      expect(result.key1.nestedKey2.deeplyNestedKey.length).toBe(2)

      // Check array with object and string
      expect(Array.isArray(result.key2)).toBe(true)
      expect(typeof result.key2[0]).toBe('object')
      expect(Array.isArray(result.key2[0].arrayObjectKey)).toBe(true)
      expect(Array.isArray(result.key2[1])).toBe(true)
    })
  })
})
