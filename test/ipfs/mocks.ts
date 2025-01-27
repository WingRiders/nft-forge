import {config} from '../../src/config'
import {MockedIpfsProvider} from '../../src/ipfs/mockedProvider'
import {IpfsProvider} from '../../src/ipfs/provider'

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
