import {encode} from 'borc'

export class CborIndefiniteLengthArray {
  elements: Array<any>

  constructor(elements: any) {
    this.elements = elements
  }

  encodeCBOR(encoder: any) {
    return encoder.push(
      Buffer.concat([
        new Uint8Array([0x9f]), // indefinite array prefix
        ...this.elements.map((e) => new Uint8Array(encode(e))),
        new Uint8Array([0xff]), // end of array
      ]),
    )
  }
}
