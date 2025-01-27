import axios from 'axios'
import {describe, expect, test, vi} from 'vitest'
import type {IpfsUploadResponse} from '../../src/ipfs/types'
import {ipfsProvider} from './mocks'

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    create: vi.fn().mockReturnThis(),
  },
}))

describe('IPFS upload', () => {
  test('Upload a file', async () => {
    const mockedResponse: IpfsUploadResponse = {
      name: 'name a',
      cid: 'aaa',
      size: 10,
      allocations: [],
    }
    vi.mocked(axios.post).mockImplementationOnce(() =>
      Promise.resolve({data: mockedResponse}),
    )
    const response = await ipfsProvider.upload({} as File)
    expect(response).toEqual(mockedResponse)
  })
})
