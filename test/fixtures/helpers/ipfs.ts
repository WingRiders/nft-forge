import axios from 'axios'
import {vi} from 'vitest'
import type {IpfsPin, IpfsUploadResponse} from '../../../src/ipfs/types'

export const mockIpfsProviderPinsOnce = (mockedResponse: IpfsPin[]) => {
  vi.mocked(axios.get).mockImplementationOnce(() =>
    Promise.resolve({
      data: `${mockedResponse.map((pin) => JSON.stringify(pin)).join('\n')}\n`,
    }),
  )
}

export const mockIpfsProviderUploadOnce = (
  mockedResponse: IpfsUploadResponse,
) => {
  vi.mocked(axios.post).mockImplementationOnce(() =>
    Promise.resolve({data: mockedResponse}),
  )
}
