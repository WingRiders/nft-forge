import {config} from '../../../src/config'
import {MockedIpfsProvider} from '../../../src/ipfs/mockedProvider'
import {IpfsProvider} from '../../../src/ipfs/provider'
import type {IpfsPin, IpfsUploadResponse} from '../../../src/ipfs/types'

export const ipfsProvider =
  config.IPFS_PROTOCOL &&
  config.IPFS_HOST &&
  config.IPFS_PORT &&
  config.IPFS_AUTH
    ? new IpfsProvider({
        connection: {
          protocol: config.IPFS_PROTOCOL,
          host: config.IPFS_HOST,
          port: config.IPFS_PORT,
          auth: config.IPFS_AUTH,
        },
      })
    : new MockedIpfsProvider()

export const ipfsUploadResponse: IpfsUploadResponse = {
  name: 'name a',
  cid: 'aaa',
  size: 10,
  allocations: [],
}

export const ipfsPinsResponse: IpfsPin[] = [
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
