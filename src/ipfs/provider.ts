import axios, { AxiosInstance } from "axios";
import { IIpfsProvider, IpfsPin, IpfsUploadResponse } from "./types";

type IpfsProviderInitArgs = {
  connection: {
    protocol: string;
    host: string;
    port: number;
    auth: {
      username: string;
      password: string;
    };
  };
};

export class IpfsProvider implements IIpfsProvider {
  axiosInstance: AxiosInstance;

  constructor({ connection }: IpfsProviderInitArgs) {
    this.axiosInstance = axios.create({
      baseURL: `${connection.protocol}://${connection.host}:${connection.port}`,
      headers: {
        "Content-Type": "application/json",
      },
      auth: connection.auth,
    });
  }

  async upload(file: File): Promise<IpfsUploadResponse> {
    const formData = new FormData();
    formData.append("fileupload", file);

    const res = await this.axiosInstance.post("/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }
  async pins(): Promise<IpfsPin[]> {
    const res = await this.axiosInstance.get("/pins");
    return JSON.parse(`[${res.data.split("\n").slice(0, -1).join(",")}]`);
  }
}
