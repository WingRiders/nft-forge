import {encode} from 'borc'
import {describe, expect, test} from 'vitest'
import {cborizeMaybe, encodeCbor} from '../../src/cborize/cborize'

describe('cborize', () => {
  describe('cborizeMaybe', () => {
    test('should encode correctly if value is provided', async () => {
      const res = encode(cborizeMaybe(100)).toString('hex')
      expect(res).toEqual('d8799f1864ff')
    })

    test('should encode correctly if value is not provided', async () => {
      const res = encode(cborizeMaybe(undefined)).toString('hex')
      expect(res).toEqual('d87a80')
    })
  })

  describe('encodeCbor', () => {
    test('should encode hex string correctly', async () => {
      const res = encodeCbor('18ff') // hex for CBOR-encoded 255
      expect(res).toEqual('4218ff') // 42 prefix indicates bytes in CBOR
    })

    test('should handle empty hex string', async () => {
      const res = encodeCbor('')
      expect(res).toEqual('40') // CBOR encoding for empty bytes
    })
  })
})
