import fs from 'node:fs'
import path from 'node:path'
import FormData from 'form-data'
import {describe, expect, test, vi} from 'vitest'
import {IPFS_UPLOAD_ERRORS} from '../../../../../src/api/errors'
import type {ApiIpfsUploadResponse} from '../../../../../src/api/types/ipfs'
import {POST as postUploadResolver} from '../../../../../src/app/api/ipfs/upload/route'
import {MAX_FILE_SIZE_MB} from '../../../../../src/constants'
import {mbToBytes} from '../../../../../src/helpers/file'
import {ipfsUploadResponse} from '../../../../fixtures/data/ipfs'
import {mockIpfsProviderUploadOnce} from '../../../../fixtures/helpers/ipfs'

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    create: vi.fn().mockReturnThis(),
  },
}))

describe('/upload route', () => {
  test('should successfully upload a file', async () => {
    mockIpfsProviderUploadOnce(ipfsUploadResponse)

    const fileBuffer = fs.readFileSync(
      path.join(__dirname, '../../../../fixtures/files/img.png'),
    )
    const formData = new FormData()
    formData.append('file', fileBuffer, {filename: 'img.png'})

    const req = new Request('http://localhost/upload', {
      method: 'POST',
      body: formData.getBuffer(),
      headers: formData.getHeaders(),
    })

    const expectedApiResponse: ApiIpfsUploadResponse = {
      name: ipfsUploadResponse.name,
      size: ipfsUploadResponse.size,
      cid: ipfsUploadResponse.cid,
    }
    const response = await postUploadResolver(req)
    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual(expectedApiResponse)
  })

  test('should return an error if form data is missing', async () => {
    const req = new Request('http://localhost/upload', {
      method: 'POST',
    })

    const response = await postUploadResolver(req)
    expect(response.status).toEqual(400)
    expect(await response.json()).toEqual({
      error: IPFS_UPLOAD_ERRORS.INVALID_FORM_DATA,
    })
  })

  test('should return an error if form data is present but the file is missing', async () => {
    const formData = new FormData()

    const req = new Request('http://localhost/upload', {
      method: 'POST',
      body: formData.getBuffer(),
      headers: formData.getHeaders(),
    })

    const response = await postUploadResolver(req)
    expect(response.status).toEqual(400)
    expect(await response.json()).toEqual({
      error: IPFS_UPLOAD_ERRORS.FILE_NOT_PROVIDED,
    })
  })

  test('should return an error if the provided file is not an image', async () => {
    const fileBuffer = fs.readFileSync(
      path.join(__dirname, '../../../../fixtures/files/text.txt'),
    )
    const formData = new FormData()
    formData.append('file', fileBuffer, {filename: 'text.txt'})

    const req = new Request('http://localhost/upload', {
      method: 'POST',
      body: formData.getBuffer(),
      headers: formData.getHeaders(),
    })

    const res = await postUploadResolver(req)
    expect(res.status).toEqual(400)
    expect(await res.json()).toEqual({
      error: IPFS_UPLOAD_ERRORS.INVALID_FILE_TYPE,
    })
  })

  test('should return an error if the provided file is too large', async () => {
    const smallFileBuffer = fs.readFileSync(
      path.join(__dirname, '../../../../fixtures/files/img.png'),
    )

    const bigFileBuffer = Buffer.concat([
      smallFileBuffer, // the beginning of the file needs to be a valid image, otherwise it will fail the isFileImage check
      Buffer.alloc(mbToBytes(MAX_FILE_SIZE_MB)),
    ])
    const formData = new FormData()
    formData.append('file', bigFileBuffer, {filename: 'img.png'})

    const req = new Request('http://localhost/upload', {
      method: 'POST',
      body: formData.getBuffer(),
      headers: formData.getHeaders(),
    })

    const res = await postUploadResolver(req)
    expect(res.status).toEqual(400)
    expect(await res.json()).toEqual({
      error: IPFS_UPLOAD_ERRORS.FILE_SIZE_EXCEEDS_LIMIT(MAX_FILE_SIZE_MB),
    })
  })
})
