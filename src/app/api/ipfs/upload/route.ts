import {ipfsProvider} from '../../../../config'
import {isFileImage} from '../../../../helpers/file'

export const POST = async (request: Request) => {
  let formData: FormData | undefined = undefined
  try {
    formData = await request.formData()
  } catch {}
  if (!formData)
    return Response.json({error: 'Invalid form data'}, {status: 400})

  const file = formData.get('file')
  if (!file) return Response.json({error: 'File not provided'}, {status: 400})

  const isFile = file instanceof File
  if (!isFile) return Response.json({error: 'Invalid file'}, {status: 400})

  const isImage = await isFileImage(file)
  if (!isImage)
    return Response.json(
      {error: 'Invalid file type (only images are supported)'},
      {status: 400},
    )

  try {
    const res = await ipfsProvider.upload(file)

    return Response.json({
      name: res.name,
      size: res.size,
      cid: res.cid,
    })
  } catch {
    return Response.json({error: 'Failed to upload file'}, {status: 500})
  }
}
