import { getAllIpfsPins } from "../../../../ipfs/pins";

export const GET = async () => {
  const pins = await getAllIpfsPins();
  return Response.json(pins.map((pin) => pin.cid).sort());
};
