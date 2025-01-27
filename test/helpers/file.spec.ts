import {type FileExtension, type MimeType, fileTypeFromBlob} from 'file-type'
import {describe, expect, test, vi} from 'vitest'
import {isFileImage} from '../../src/helpers/file'

vi.mock('file-type', () => ({
  fileTypeFromBlob: vi.fn(),
}))

describe('file', () => {
  describe('isFileImage ', () => {
    const testCases: [mime: MimeType, expected: boolean][] = [
      ['image/png', true],
      ['image/jpeg', true],
      ['image/gif', true],
      ['application/pdf', false],
      ['text/calendar', false],
    ]

    test.each(testCases)(
      'If file mime is %s, isFileImage should return %s',
      async (mime, expected) => {
        vi.mocked(fileTypeFromBlob).mockResolvedValueOnce({
          mime,
          ext: '' as FileExtension,
        })

        expect(await isFileImage({} as File)).toBe(expected)
      },
    )
  })
})
