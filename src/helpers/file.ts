import { fileTypeFromBlob } from "file-type";

export const isFileImage = async (file: File) => {
  const fileType = await fileTypeFromBlob(file);
  return !!fileType?.mime.startsWith("image");
};
