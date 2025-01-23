import { IIpfsProvider, IpfsPin, IpfsUploadResponse } from "./types";
import Hash from "ipfs-only-hash";

export class MockedIpfsProvider implements IIpfsProvider {
  private storedPins: IpfsPin[] = [];

  async upload(file: File): Promise<IpfsUploadResponse> {
    const cid = await Hash.of(new Uint8Array(await file.arrayBuffer()));

    const response: IpfsUploadResponse = {
      cid,
      name: file.name,
      size: file.size,
      allocations: [],
    };

    if (this.storedPins.find((pin) => pin.cid === response.cid) == null)
      this.storedPins.push({
        cid: response.cid,
        name: response.name,
        allocations: response.allocations,
        created: new Date().toISOString(),
        metadata: {},
        origins: [],
        peer_map: {},
      });

    return response;
  }

  async pins(): Promise<IpfsPin[]> {
    return Array.from(this.storedPins);
  }
}
