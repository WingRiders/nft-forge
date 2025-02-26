import {describe, expect, test} from 'vitest'
import {
  decodeCollectionId,
  encodeCollectionId,
} from '../../src/helpers/collectionId'

describe('collectionId', () => {
  test('should encode and decode collection id with mint end date', () => {
    const uuid = 'c2088bb0-d404-40a4-a09b-0cd3f3e59f5a'
    const mintEndDate = 1809363892637
    const expectedEncodedId =
      '82782463323038386262302d643430342d343061342d613039622d3063643366336535396635616d31383039333633383932363337'

    const encodedId = encodeCollectionId({
      uuid,
      mintEndDate,
    })
    expect(encodedId).toBe(expectedEncodedId)

    const decoded = decodeCollectionId(encodedId)
    expect(decoded).toStrictEqual({
      uuid,
      mintEndDate,
    })
  })

  test('should encode and decode collection id without mint end date', () => {
    const uuid = 'c2088bb0-d404-40a4-a09b-0cd3f3e59f5a'
    const expectedEncodedId =
      '81782463323038386262302d643430342d343061342d613039622d306364336633653539663561'

    const encodedId = encodeCollectionId({
      uuid,
    })
    expect(encodedId).toBe(expectedEncodedId)

    const decoded = decodeCollectionId(encodedId)
    expect(decoded).toStrictEqual({
      uuid,
      mintEndDate: undefined,
    })
  })
})
