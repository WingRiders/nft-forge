import {describe, expect, test} from 'vitest'
import {NFTDisplay} from '../../../src/app/mint/NFTDisplay'
import {ipfsCidToHttps} from '../../../src/helpers/ipfs'
import {render, screen} from '../../utils'

describe('NFTDisplay', () => {
  const mockNftData = {
    id: 'test-id',
    imageIpfsCid: 'QmTest123',
    imageMimeType: 'image/png',
    name: 'Test NFT',
    assetNameUtf8: 'TEST_NFT_001',
    description: 'This is a test NFT description',
  }

  test('should render NFT image with correct attributes', () => {
    render(<NFTDisplay nftData={mockNftData} />)

    const image = screen.getByRole('img')
    expect(image).toHaveAttribute(
      'src',
      ipfsCidToHttps(mockNftData.imageIpfsCid),
    )
    expect(image).toHaveAttribute('alt', mockNftData.name)
    expect(image).toHaveAttribute('width', '200')
    expect(image).toHaveAttribute('height', '200')
  })

  test('should display all NFT metadata fields', () => {
    render(<NFTDisplay nftData={mockNftData} />)

    expect(screen.getByText(mockNftData.assetNameUtf8)).toBeInTheDocument()
    expect(screen.getByText(mockNftData.name)).toBeInTheDocument()
    expect(screen.getByText(mockNftData.description)).toBeInTheDocument()
    expect(screen.getByText(mockNftData.imageIpfsCid)).toBeInTheDocument()
    expect(screen.getByText(mockNftData.imageMimeType)).toBeInTheDocument()
  })

  test('should display placeholder when description is empty', () => {
    const nftDataWithoutDescription = {
      ...mockNftData,
      description: '',
    }

    render(<NFTDisplay nftData={nftDataWithoutDescription} />)

    expect(screen.getByText('(No description)')).toBeInTheDocument()
  })

  test('should display correct field labels', () => {
    render(<NFTDisplay nftData={mockNftData} />)

    expect(screen.getByText('NFT asset name')).toBeInTheDocument()
    expect(screen.getByText('NFT name')).toBeInTheDocument()
    expect(screen.getByText('NFT description')).toBeInTheDocument()
    expect(screen.getByText('IPFS image')).toBeInTheDocument()
    expect(screen.getByText('Image type')).toBeInTheDocument()
  })
})
