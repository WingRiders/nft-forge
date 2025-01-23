export interface IIpfsProvider {
  upload(file: File): Promise<IpfsUploadResponse>;
  pins(): Promise<IpfsPin[]>;
}

export type IpfsPin = {
  cid: string;
  name: string;
  allocations: string[];
  origins: string[];
  created: string;
  metadata: object;
  peer_map: object;
};

export type IpfsUploadResponse = {
  name: string;
  cid: string;
  size: number;
  allocations: string[];
};
