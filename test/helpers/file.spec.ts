import {describe, expect, test} from 'vitest'
import {isMimeTypeImage} from '../../src/helpers/file'

describe('file', () => {
  describe('isMimeTypeImage ', () => {
    const testCases: [mime: string, expected: boolean][] = [
      ['image/png', true],
      ['image/jpeg', true],
      ['image/gif', true],
      ['application/pdf', false],
      ['text/calendar', false],
    ]

    test.each(testCases)(
      'If file mime is %s, isFileImage should return %s',
      async (mime, expected) => {
        expect(await isMimeTypeImage(mime)).toBe(expected)
      },
    )
  })
})
