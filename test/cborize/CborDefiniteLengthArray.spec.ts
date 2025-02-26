import {encode} from 'borc'
import {describe, expect, test} from 'vitest'
import {CborDefiniteLengthArray} from '../../src/cborize/CborDefiniteLengthArray'

describe('CborDefiniteLengthArray', () => {
  test('should encode empty array correctly', async () => {
    const array = new CborDefiniteLengthArray([])
    const res = encode(array).toString('hex')
    expect(res).toEqual('80')
  })

  test('should encode array with single number correctly', async () => {
    const array = new CborDefiniteLengthArray([42])
    const res = encode(array).toString('hex')
    expect(res).toEqual('81182a')
  })

  test('should encode array with multiple elements correctly', async () => {
    const array = new CborDefiniteLengthArray([1, 'hello', true])
    const res = encode(array).toString('hex')
    expect(res).toEqual('83016568656c6c6ff5')
  })
})
