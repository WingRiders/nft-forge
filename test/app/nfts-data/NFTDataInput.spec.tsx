import type {Control, UseFormStateReturn} from 'react-hook-form'
import {useFormState} from 'react-hook-form'
import {afterEach, describe, expect, test, vi} from 'vitest'
import {NFTDataInput} from '../../../src/app/nfts-data/NFTDataInput'
import type {NFTsDataInputs} from '../../../src/app/nfts-data/types'
import {ipfsCidToHttps} from '../../../src/helpers/ipfs'
import {fireEvent, render, screen, waitFor} from '../../utils'

vi.mock('../../../src/helpers/ipfs', () => ({
  ipfsCidToHttps: vi.fn((cid) => `https://ipfs.io/ipfs/${cid}`),
}))

vi.mock('react-hook-form', async () => {
  const actual = await vi.importActual('react-hook-form')
  return {
    ...actual,
    useWatch: vi.fn().mockImplementation(({name}) => {
      const values = {
        'nftsData.1.name': 'Test NFT',
        'nftsData.1.imageIpfsCid': 'QmTest123',
        'nftsData.1.imageMimeType': 'image/png',
        'nftsData.1.assetNameUtf8': 'Test Asset',
        'nftsData.1.description': 'Test Description',
      }
      return values[name as keyof typeof values]
    }),
    useFormState: vi.fn().mockImplementation(() => ({
      errors: {
        nftsData: {
          '1': {},
        },
      },
    })),
  }
})

describe('NFTDataInput', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  const defaultProps = {
    id: '1',
    register: vi.fn(),
    control: vi.fn() as unknown as Control<NFTsDataInputs>,
    errors: {},
    onDelete: vi.fn(),
  }

  test('should render NFT data form with all fields', () => {
    render(<NFTDataInput {...defaultProps} />)

    expect(screen.getByText('NFT asset name')).toBeInTheDocument()
    expect(screen.getByText('NFT name')).toBeInTheDocument()
    expect(screen.getByText('NFT description')).toBeInTheDocument()
    expect(screen.getByText('IPFS image')).toBeInTheDocument()
    expect(screen.getByText('Image type')).toBeInTheDocument()
  })

  test('should display NFT image with correct src', () => {
    render(<NFTDataInput {...defaultProps} />)

    const image = screen.getByAltText('Test NFT') as HTMLImageElement
    expect(image).toBeInTheDocument()
    expect(image.src).toBe('https://ipfs.io/ipfs/QmTest123')
    expect(ipfsCidToHttps).toHaveBeenCalledWith('QmTest123')
  })

  test('should show error messages when form has errors', () => {
    vi.mocked(useFormState).mockImplementationOnce(
      () =>
        ({
          errors: {
            nftsData: {
              '1': {
                assetNameUtf8: {
                  type: 'required',
                },
              },
            },
          },
        }) as unknown as UseFormStateReturn<NFTsDataInputs>,
    )

    render(<NFTDataInput {...defaultProps} />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  test('should open delete confirmation modal when delete button is clicked', () => {
    render(<NFTDataInput {...defaultProps} />)

    fireEvent.click(screen.getByText('Delete'))

    expect(screen.getByText('Delete NFT?')).toBeInTheDocument()
    expect(
      screen.getByText('Are you sure you want to delete this NFT?'),
    ).toBeInTheDocument()
    expect(screen.getByText('Test NFT')).toBeInTheDocument()
  })

  test('should call onDelete when confirming deletion', () => {
    render(<NFTDataInput {...defaultProps} />)

    fireEvent.click(screen.getByText('Delete'))
    fireEvent.click(screen.getByText('Delete', {selector: 'div'})) // confirmation button

    expect(defaultProps.onDelete).toHaveBeenCalled()
  })

  test('should close modal without deleting when cancel is clicked', () => {
    render(<NFTDataInput {...defaultProps} />)

    fireEvent.click(screen.getByText('Delete'))
    fireEvent.click(screen.getByText('Cancel'))

    expect(defaultProps.onDelete).not.toHaveBeenCalled()
    waitFor(() => {
      expect(screen.queryByText('Delete NFT?')).not.toBeInTheDocument()
    })
  })
})
