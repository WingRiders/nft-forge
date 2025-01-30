import {ipfsProvider} from '../../../../config'
import {isFile, isFileImage, mbToBytes} from '../../../../helpers/file'
import {MAX_FILE_SIZE_MB} from '../../../../mint/constants'
import type {ApiIpfsUploadResponse} from '../../../../types/api/ipfs'

export const POST = async (request: Request) => {
  let formData: FormData | undefined = undefined
  try {
    formData = await request.formData()
  } catch {}
  if (!formData)
    return Response.json({error: 'Invalid form data'}, {status: 400})

  const file = formData.get('file')
  if (!file) return Response.json({error: 'File not provided'}, {status: 400})

  if (!isFile(file))
    return Response.json({error: 'Invalid file'}, {status: 400})

  if (file.size > mbToBytes(MAX_FILE_SIZE_MB))
    return Response.json(
      {error: `File size exceeds ${MAX_FILE_SIZE_MB} MB limit`},
      {status: 400},
    )

  const isImage = await isFileImage(file)
  if (!isImage)
    return Response.json(
      {error: 'Invalid file type (only images are supported)'},
      {status: 400},
    )

  try {
    const res = await ipfsProvider.upload(file)

    const response: ApiIpfsUploadResponse = {
      name: res.name,
      size: res.size,
      cid: res.cid,
    }
    return Response.json(response)
  } catch {
    return Response.json({error: 'Failed to upload file'}, {status: 500})
  }
}
