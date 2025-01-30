import {fileTypeFromBlob} from 'file-type'

export const isFileImage = async (file: File) => {
  const fileType = await fileTypeFromBlob(file)
  return !!fileType?.mime.startsWith('image')
}

export const isFile = (file: unknown): file is File =>
  file instanceof File ||
  (typeof file === 'object' && file != null && 'name' in file && 'size' in file)

export const mbToBytes = (mb: number) => mb * 1024 * 1024
