import {encode} from 'borc'
import {describe, expect, test} from 'vitest'
import {CborIndefiniteLengthArray} from '../../src/cborize/CborIndefiniteLengthArray'

describe('CborIndefiniteLengthArray', () => {
  test('should encode empty array correctly', async () => {
    const array = new CborIndefiniteLengthArray([])
    const res = encode(array).toString('hex')
    expect(res).toEqual('9fff')
  })

  test('should encode array with single number correctly', async () => {
    const array = new CborIndefiniteLengthArray([42])
    const res = encode(array).toString('hex')
    expect(res).toEqual('9f182aff')
  })

  test('should encode array with multiple elements correctly', async () => {
    const array = new CborIndefiniteLengthArray([1, 'hello', true])
    const res = encode(array).toString('hex')
    expect(res).toEqual('9f016568656c6c6ff5ff')
  })
})
