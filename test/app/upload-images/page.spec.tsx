import axios from 'axios'
import {describe, expect, test, vi} from 'vitest'
import type {ApiIpfsUploadResponse} from '../../../src/api/types/ipfs'
import UploadImagesPage from '../../../src/app/upload-images/page'
import {MAX_FILE_SIZE_MB} from '../../../src/constants'
import {mbToBytes} from '../../../src/helpers/file'
import {fireEvent, render, screen} from '../../utils'

vi.mock('axios')
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

describe('UploadImagesPage', () => {
  test('should be able to upload images', async () => {
    vi.mocked(axios.post).mockImplementationOnce(() => {
      const mockedResponse: ApiIpfsUploadResponse = {
        cid: 'a',
        name: 'image.png',
        size: 100,
        mimeType: 'image/png',
      }
      return Promise.resolve({data: mockedResponse})
    })

    render(<UploadImagesPage />)

    const inputEl = document.querySelector('input[type="file"]')!
    expect(inputEl).toBeInTheDocument()

    expect(screen.queryByText('Upload')).toBeNull()

    fireEvent.change(inputEl, {
      target: {
        files: [new File([], 'image.png', {type: 'image/png'})],
      },
    })

    expect(await screen.findByText('image.png')).toBeInTheDocument()

    const uploadButton = screen.getByText('Upload')
    fireEvent.click(uploadButton)

    expect(
      await screen.findByText('Images uploaded successfully'),
    ).toBeInTheDocument()

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'https://ipfs.io/ipfs/a')
    expect(img).toHaveAttribute('alt', 'image')
    expect(screen.getByText('image')).toBeInTheDocument()
    expect(screen.queryByText('Upload')).toBeNull()
  })

  test('should display an error if the uploaded file is not an image', async () => {
    render(<UploadImagesPage />)

    const inputEl = document.querySelector('input[type="file"]')!
    expect(inputEl).toBeInTheDocument()

    fireEvent.change(inputEl, {
      target: {
        files: [new File([], 'image.txt', {type: 'text/plain'})],
      },
    })

    expect(
      await screen.findByText(
        'File type must be one of image/*, .png, .gif, .jpeg, .jpg',
      ),
    ).toBeInTheDocument()
  })

  test('should display an error if the uploaded image is too large', async () => {
    render(<UploadImagesPage />)

    const inputEl = document.querySelector('input[type="file"]')!
    expect(inputEl).toBeInTheDocument()

    fireEvent.change(inputEl, {
      target: {
        files: [
          new File(
            [new Blob([new Uint8Array(mbToBytes(MAX_FILE_SIZE_MB) + 1)])],
            'image.png',
            {
              type: 'image/png',
            },
          ),
        ],
      },
    })

    expect(
      await screen.findByText(
        `File is larger than ${mbToBytes(MAX_FILE_SIZE_MB)} bytes`,
      ),
    ).toBeInTheDocument()
  })
})
