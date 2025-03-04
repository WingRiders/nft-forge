import {chunk, mapValues} from 'lodash'

type Metadatum =
  | number
  | string
  | Uint8Array
  | {[key: string]: Metadatum}
  | Metadatum[]

export const METADATA_MAX_STR_LENGTH = 64

export const splitMetadatumString = (str: string): string | string[] => {
  if (str.length <= METADATA_MAX_STR_LENGTH) {
    return str
  }

  return chunk(str.split(''), METADATA_MAX_STR_LENGTH).map((charArray) =>
    charArray.join(''),
  )
}

export const prepareMetadatumForTx = (metadatum: Metadatum): Metadatum => {
  if (typeof metadatum === 'string') return splitMetadatumString(metadatum)

  if (Array.isArray(metadatum))
    return metadatum.map((item) => prepareMetadatumForTx(item))

  if (typeof metadatum === 'object')
    return mapValues(metadatum, (value) =>
      prepareMetadatumForTx(value as Metadatum),
    )

  return metadatum
}
