export const isMimeTypeImage = async (mimeType: string) =>
  mimeType.startsWith('image')

export const isFile = (file: unknown): file is File =>
  file instanceof File ||
  (typeof file === 'object' && file != null && 'name' in file && 'size' in file)

export const mbToBytes = (mb: number) => mb * 1024 * 1024
