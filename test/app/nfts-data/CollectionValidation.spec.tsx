import {render, screen} from '@testing-library/react'
import type {Control, UseFormStateReturn} from 'react-hook-form'
import {useFormState, useWatch} from 'react-hook-form'
import {beforeEach, describe, expect, test, vi} from 'vitest'
import {CollectionValidation} from '../../../src/app/nfts-data/CollectionValidation'
import type {NFTsDataInputs} from '../../../src/app/nfts-data/types'

vi.mock('react-hook-form', () => ({
  useWatch: vi.fn(),
  useFormState: vi.fn(),
}))

const mockedUseWatch = vi.mocked(useWatch)
const mockedUseFormState = vi.mocked(useFormState<NFTsDataInputs>)

describe('CollectionValidation', () => {
  const mockControl = {} as Control<NFTsDataInputs>
  const mockSetError = vi.fn()
  const mockClearErrors = vi.fn()

  beforeEach(() => {
    mockSetError.mockClear()
    mockClearErrors.mockClear()
    mockedUseFormState.mockReturnValue({
      errors: {},
    } as UseFormStateReturn<NFTsDataInputs>)
  })

  test('should render nothing when there are no duplicates', () => {
    mockedUseWatch.mockReturnValue({
      nft1: {assetNameUtf8: 'asset1'},
      nft2: {assetNameUtf8: 'asset2'},
    })

    const {container} = render(
      <CollectionValidation
        control={mockControl}
        isSubmitted={true}
        setError={mockSetError}
        clearErrors={mockClearErrors}
      />,
    )
    expect(container.firstChild).toBeNull()
  })

  test('should render nothing when not submitted, even with duplicates', () => {
    mockedUseWatch.mockReturnValue({
      nft1: {assetNameUtf8: 'asset1'},
      nft2: {assetNameUtf8: 'asset1'},
    })

    const {container} = render(
      <CollectionValidation
        control={mockControl}
        isSubmitted={false}
        setError={mockSetError}
        clearErrors={mockClearErrors}
      />,
    )
    expect(container.firstChild).toBeNull()
  })

  test('should render error alert when there are duplicates and form is submitted', () => {
    mockedUseWatch.mockReturnValue({
      nft1: {assetNameUtf8: 'asset1'},
      nft2: {assetNameUtf8: 'asset1'},
    })

    mockedUseFormState.mockReturnValue({
      errors: {
        nftsData: {
          // @ts-ignore
          message:
            'Each NFT in the collection must have a unique asset name. Duplicate asset names: asset1',
        },
      },
    })

    render(
      <CollectionValidation
        control={mockControl}
        isSubmitted={true}
        setError={mockSetError}
        clearErrors={mockClearErrors}
      />,
    )

    expect(
      screen.getByText(
        'Each NFT in the collection must have a unique asset name. Duplicate asset names: asset1',
      ),
    ).toBeInTheDocument()
  })

  test('should handle empty nftsData', () => {
    mockedUseWatch.mockReturnValue({})

    const {container} = render(
      <CollectionValidation
        control={mockControl}
        isSubmitted={true}
        setError={mockSetError}
        clearErrors={mockClearErrors}
      />,
    )
    expect(container.firstChild).toBeNull()
  })
})
