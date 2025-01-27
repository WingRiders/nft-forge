import axios from 'axios'
import {describe, expect, test, vi} from 'vitest'
import type {IpfsPin} from '../../src/ipfs/types'
import {ipfsProvider} from './mocks'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    create: vi.fn().mockReturnThis(),
  },
}))

describe('IPFS pins', () => {
  test('Get all pins', async () => {
    const mockedPins: IpfsPin[] = [
      {
        cid: 'cid a',
        name: 'name a',
        allocations: [],
        origins: [],
        created: 'created a',
        metadata: {},
        peer_map: {},
      },
      {
        cid: 'cid b',
        name: 'name b',
        allocations: [],
        origins: [],
        created: 'created b',
        metadata: {},
        peer_map: {},
      },
      {
        cid: 'cid c',
        name: 'name c',
        allocations: [],
        origins: [],
        created: 'created c',
        metadata: {},
        peer_map: {},
      },
    ]
    vi.mocked(axios.get).mockImplementationOnce(() =>
      Promise.resolve({
        data: `${mockedPins.map((pin) => JSON.stringify(pin)).join('\n')}\n`,
      }),
    )
    const pins = await ipfsProvider.pins()
    expect(pins).toEqual(mockedPins)
  })
})
