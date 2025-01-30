import {describe, expect, test, vi} from 'vitest'
import {GET as getPinsResolver} from '../../../../../src/app/api/ipfs/pins/route'
import {ipfsPinsResponse} from '../../../../fixtures/data/ipfs'
import {mockIpfsProviderPinsOnce} from '../../../../fixtures/helpers/ipfs'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    create: vi.fn().mockReturnThis(),
  },
}))

describe('/pins route', () => {
  test('should return CIDs of all pinned files', async () => {
    mockIpfsProviderPinsOnce(ipfsPinsResponse)
    const response = await getPinsResolver()
    expect(await response.json()).toStrictEqual(
      ipfsPinsResponse.map((pin) => pin.cid),
    )
  })
})
