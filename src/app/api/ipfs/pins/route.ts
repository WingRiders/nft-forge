import {ipfsProvider} from '../../../../config'
import type {ApiIpfsPinsResponse} from '../../../../types/api/ipfs'

export const GET = async () => {
  const pins = await ipfsProvider.pins()
  const response: ApiIpfsPinsResponse = pins.map((pin) => pin.cid).sort()
  return Response.json(response)
}
