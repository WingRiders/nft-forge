export const isMimeTypeImage = async (mimeType: string) =>
  mimeType.startsWith('image')

export const isFile = (file: unknown): file is File =>
  file instanceof File ||
  (typeof file === 'object' && file != null && 'name' in file && 'size' in file)

export const mbToBytes = (mb: number) => mb * 1024 * 1024

export const reEncodeImage = async (file: File): Promise<Blob> => {
  const img = new Image()
  img.decoding = 'async'

  // Ensure correct orientation on iOS/Android by using a createImageBitmap if available
  const bitmap = await createImageBitmap(file).catch(() => null)

  return new Promise<Blob>((resolve, reject) => {
    if (bitmap) {
      const canvas = document.createElement('canvas')
      canvas.width = bitmap.width
      canvas.height = bitmap.height
      const ctx = canvas.getContext('2d', {alpha: true})
      if (!ctx) {
        throw new Error('Failed to get canvas context')
      }
      ctx.drawImage(bitmap, 0, 0)
      canvas.toBlob(async (blob) => {
        if (!blob) {
          reject(new Error('Failed to convert image to blob'))
          return
        }
        resolve(blob)
      })
      bitmap.close()
    } else {
      // Fallback path
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          throw new Error('Failed to get canvas context')
        }
        ctx.drawImage(img, 0, 0)
        canvas.toBlob(async (blob) => {
          if (!blob) {
            reject(new Error('Failed to convert image to blob'))
            return
          }
          resolve(blob)
        })
      }
      img.src = URL.createObjectURL(file)
    }
  })
}
