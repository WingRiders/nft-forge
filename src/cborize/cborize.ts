import {Tagged, encode} from 'borc'
import {CborDefiniteLengthArray} from './CborDefiniteLengthArray'
import {CborIndefiniteLengthArray} from './CborIndefiniteLengthArray'

export const cborizeMaybe = (value: any | undefined) => {
  return value == null
    ? new Tagged(122, new CborDefiniteLengthArray([]), null) // Nothing
    : new Tagged(121, new CborIndefiniteLengthArray([value]), null) // Just
}

export const encodeCbor = (cborHex: string) =>
  encode(Buffer.from(cborHex, 'hex')).toString('hex')
