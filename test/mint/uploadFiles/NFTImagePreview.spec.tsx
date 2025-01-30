import {describe, expect, test} from 'vitest'
import {NFTImagePreview} from '../../../src/mint/uploadFiles/NFTImagePreview'
import {render, screen} from '../../utils'

describe('NFTImagePreview', () => {
  test('should render NFT preview for a URL image', () => {
    render(<NFTImagePreview image="nft-image.png" name="NFT image" />)

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'nft-image.png')
    expect(img).toHaveAttribute('alt', 'NFT image')
  })

  test('should render NFT preview for a file image', async () => {
    render(
      <NFTImagePreview
        image={new File([], 'file-name.png')}
        name="NFT image"
      />,
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    expect(await screen.findByRole('img')).toBeInTheDocument()

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'data:application/octet-stream;base64,')
    expect(img).toHaveAttribute('alt', 'file-name.png')

    expect(screen.queryByText('Loading...')).toBeNull()
  })

  test('should render NFT preview with the remove button', () => {
    render(
      <NFTImagePreview
        image="nft-image.png"
        name="NFT image"
        showRemoveButton
      />,
    )

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'nft-image.png')
    expect(img).toHaveAttribute('alt', 'NFT image')

    const removeButton = screen.getByText('Remove')
    expect(removeButton).toHaveTextContent('Remove')
  })
})
