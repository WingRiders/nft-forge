import {describe, expect, test, vi} from 'vitest'
import {ipfsProvider, ipfsUploadResponse} from '../fixtures/data/ipfs'
import {mockIpfsProviderUploadOnce} from '../fixtures/helpers/ipfs'

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    create: vi.fn().mockReturnThis(),
  },
}))

describe('IPFS provider - upload', () => {
  test('should successfully upload a file to the IPFS provider', async () => {
    mockIpfsProviderUploadOnce(ipfsUploadResponse)
    const response = await ipfsProvider.upload({} as File)
    expect(response).toEqual(ipfsUploadResponse)
  })
})
