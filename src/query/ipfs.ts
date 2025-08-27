import axios from 'axios'
import type {
  ApiIpfsPinsResponse,
  ApiIpfsUploadResponse,
} from '../api/types/ipfs'
import {reEncodeImage} from '../helpers/file'

export const fetchPins = async () => {
  const res = await axios.get('/api/ipfs/pins')
  return res.data as Promise<ApiIpfsPinsResponse>
}

export const uploadFile = async (file: File) => {
  const formData = new FormData()
  // strip metadata from the image
  const reEncodedImage = await reEncodeImage(file)
  formData.append('file', reEncodedImage)

  const res = await axios.post('/api/ipfs/upload', formData)
  return res.data as Promise<ApiIpfsUploadResponse>
}

export const uploadFiles = async (files: File[]) =>
  Promise.all(files.map(uploadFile))
