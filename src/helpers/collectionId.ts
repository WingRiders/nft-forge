import {decode, encode} from 'borc'
import {compact} from 'lodash'

export type CollectionIdFields = {
  uuid: string
  mintEndDate?: number
}

export const encodeCollectionId = ({uuid, mintEndDate}: CollectionIdFields) => {
  return encode(compact([uuid, mintEndDate?.toString()])).toString('hex')
}

export const decodeCollectionId = (id: string): CollectionIdFields | null => {
  try {
    const decoded = decode(Buffer.from(id, 'hex'))
    if (decoded.length !== 2 && decoded.length !== 1) {
      return null
    }
    return {
      uuid: decoded[0].toString(),
      mintEndDate: decoded[1] ? Number.parseInt(decoded[1]) : undefined,
    }
  } catch {
    return null
  }
}
