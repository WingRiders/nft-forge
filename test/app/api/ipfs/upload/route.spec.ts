import fs from 'node:fs'
import path from 'node:path'
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

const createMockFile = async (
  relativeFilePath: string,
  filename: string,
  type: string,
) => {
  const buffer = await fs.promises.readFile(
    path.resolve(__dirname, relativeFilePath),
  )
  return new File([buffer], filename, {type})
}

describe('/upload route', () => {
  test('should successfully upload a file', async () => {
    mockIpfsProviderUploadOnce(ipfsUploadResponse)

    const file = await createMockFile(
      '../../../../fixtures/files/img.png',
      'img.png',
      'image/png',
    )
    const formData = new FormData()
    formData.append('file', file)

    const req = new Request('http://localhost/upload', {
      method: 'POST',
      body: formData,
    })

    const expectedApiResponse: ApiIpfsUploadResponse = {
      name: ipfsUploadResponse.name,
      size: ipfsUploadResponse.size,
      cid: ipfsUploadResponse.cid,
      mimeType: 'image/png',
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
    formData.append('other-field', 'value')

    const req = new Request('http://localhost/upload', {
      method: 'POST',
      body: formData,
    })

    const response = await postUploadResolver(req)
    expect(response.status).toEqual(400)
    expect(await response.json()).toEqual({
      error: IPFS_UPLOAD_ERRORS.FILE_NOT_PROVIDED,
    })
  })

  test('should return an error if the provided file is not an image', async () => {
    const file = await createMockFile(
      '../../../../fixtures/files/text.txt',
      'text.txt',
      'text/plain',
    )
    const formData = new FormData()
    formData.append('file', file)

    const req = new Request('http://localhost/upload', {
      method: 'POST',
      body: formData,
    })

    const res = await postUploadResolver(req)
    expect(res.status).toEqual(400)
    expect(await res.json()).toEqual({
      error: IPFS_UPLOAD_ERRORS.INVALID_FILE_TYPE,
    })
  })

  test('should return an error if the provided file is too large', async () => {
    const smallFile = await createMockFile(
      '../../../../fixtures/files/img.png',
      'img.png',
      'image/png',
    )
    const bigFile = new File(
      [
        Buffer.concat([
          Buffer.from(await smallFile.arrayBuffer()),
          Buffer.alloc(mbToBytes(MAX_FILE_SIZE_MB)),
        ]),
      ],
      'img.png',
      {type: 'image/png'},
    )
    const formData = new FormData()
    formData.append('file', bigFile)

    const req = new Request('http://localhost/upload', {
      method: 'POST',
      body: formData,
    })

    const res = await postUploadResolver(req)
    expect(res.status).toEqual(400)
    expect(await res.json()).toEqual({
      error: IPFS_UPLOAD_ERRORS.FILE_SIZE_EXCEEDS_LIMIT(MAX_FILE_SIZE_MB),
    })
  })
})
