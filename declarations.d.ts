declare module "ipfs-only-hash" {
  interface IpfsOnlyHashOptions {
    cidVersion?: 0 | 1;
    hashAlg?: string;
    rawLeaves?: boolean;
  }

  export function of(
    data: string | Buffer | Uint8Array | ArrayBuffer,
    options?: IpfsOnlyHashOptions
  ): Promise<string>;
}
