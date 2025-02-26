import {encode} from 'borc'
import {describe, expect, test} from 'vitest'
import {cborizeMaybe} from '../../src/cborize/cborize'

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
})
