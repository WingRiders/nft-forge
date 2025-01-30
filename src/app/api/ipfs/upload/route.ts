import {IPFS_UPLOAD_ERRORS} from '../../../../api/errors'
import type {ApiIpfsUploadResponse} from '../../../../api/types/ipfs'
import {ipfsProvider} from '../../../../config'
import {isFile, isFileImage, mbToBytes} from '../../../../helpers/file'
import {MAX_FILE_SIZE_MB} from '../../../../mint/constants'

export const POST = async (request: Request) => {
  let formData: FormData | undefined = undefined
  try {
    formData = await request.formData()
  } catch {}
  if (!formData)
    return Response.json(
      {error: IPFS_UPLOAD_ERRORS.INVALID_FORM_DATA},
      {status: 400},
    )

  const file = formData.get('file')
  if (!file)
    return Response.json(
      {error: IPFS_UPLOAD_ERRORS.FILE_NOT_PROVIDED},
      {status: 400},
    )

  if (!isFile(file))
    return Response.json(
      {error: IPFS_UPLOAD_ERRORS.INVALID_FILE},
      {status: 400},
    )

  if (file.size > mbToBytes(MAX_FILE_SIZE_MB))
    return Response.json(
      {error: IPFS_UPLOAD_ERRORS.FILE_SIZE_EXCEEDS_LIMIT(MAX_FILE_SIZE_MB)},
      {status: 400},
    )

  const isImage = await isFileImage(file)
  if (!isImage)
    return Response.json(
      {error: IPFS_UPLOAD_ERRORS.INVALID_FILE_TYPE},
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
    return Response.json(
      {error: IPFS_UPLOAD_ERRORS.FAILED_TO_UPLOAD_FILE},
      {status: 500},
    )
  }
}
