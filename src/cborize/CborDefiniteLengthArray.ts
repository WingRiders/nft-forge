import {encode} from 'borc'

export class CborDefiniteLengthArray {
  elements: Array<any>

  constructor(elements: any) {
    this.elements = elements
  }

  encodeCBOR(encoder: any) {
    return encoder.push(
      Buffer.concat([
        new Uint8Array([0x80 + this.elements.length]),
        ...this.elements.map((e) => new Uint8Array(encode(e))),
      ]),
    )
  }
}
