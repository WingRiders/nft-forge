import { ipfsAxios } from "./common";

type IpfsPin = {
  cid: string;
  name: string;
  allocations: string[];
  origins: string[];
  created: string;
  metadata: object;
  peer_map: object;
};

export const getAllIpfsPins = async (): Promise<IpfsPin[]> => {
  const res = await ipfsAxios.get("/pins");
  return JSON.parse(`[${res.data.split("\n").slice(0, -1).join(",")}]`);
};
