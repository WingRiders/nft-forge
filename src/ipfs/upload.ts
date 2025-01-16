import { ipfsAxios } from "./common";

type IpfsUploadResponse = {
  name: string;
  cid: string;
  size: number;
  allocations: string[];
};

export const uploadFileToIpfs = async (
  file: File
): Promise<IpfsUploadResponse> => {
  const formData = new FormData();
  formData.append("fileupload", file);

  const res = await ipfsAxios.post("/add", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
