import axios from 'axios'
import type {
  ApiIpfsPinsResponse,
  ApiIpfsUploadResponse,
} from '../types/api/ipfs'

export const fetchPins = async () => {
  const res = await axios.get('/api/ipfs/pins')
  return res.data as Promise<ApiIpfsPinsResponse>
}

export const uploadFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const res = await axios.post('/api/ipfs/upload', formData)
  return res.data as Promise<ApiIpfsUploadResponse>
}

export const uploadFiles = async (files: File[]) =>
  Promise.all(files.map(uploadFile))
