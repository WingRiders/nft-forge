import {describe, expect, test, vi} from 'vitest'
import {ipfsPinsResponse, ipfsProvider} from '../fixtures/data/ipfs'
import {mockIpfsProviderPinsOnce} from '../fixtures/helpers/ipfs'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    create: vi.fn().mockReturnThis(),
  },
}))

describe('IPFS provider - pins', () => {
  test('should return all pins from the IPFS provider ', async () => {
    mockIpfsProviderPinsOnce(ipfsPinsResponse)
    const pins = await ipfsProvider.pins()
    expect(pins).toEqual(ipfsPinsResponse)
  })
})
