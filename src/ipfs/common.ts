import axios from "axios";
import { config } from "../config";

export const ipfsAxios = axios.create({
  baseURL: `${config.IPFS_PROTOCOL}://${config.IPFS_HOST}:${config.IPFS_PORT}`,
  headers: {
    "Content-Type": "application/json",
  },
  auth: config.IPFS_AUTH,
});
