import {ipfsProvider} from '../../../../config'

export const GET = async () => {
  const pins = await ipfsProvider.pins()
  return Response.json(pins.map((pin) => pin.cid).sort())
}
