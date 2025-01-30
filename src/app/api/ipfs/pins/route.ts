import type {ApiIpfsPinsResponse} from '../../../../api/types/ipfs'
import {ipfsProvider} from '../../../../config'

export const GET = async () => {
  const pins = await ipfsProvider.pins()
  const response: ApiIpfsPinsResponse = pins.map((pin) => pin.cid).sort()
  return Response.json(response)
}
