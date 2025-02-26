import {render, screen} from '@testing-library/react'
import type {Control} from 'react-hook-form'
import {useWatch} from 'react-hook-form'
import {describe, expect, test, vi} from 'vitest'
import {CollectionValidation} from '../../../src/app/nfts-data/CollectionValidation'
import type {NFTsDataInputs} from '../../../src/app/nfts-data/types'

vi.mock('react-hook-form', () => ({
  useWatch: vi.fn(),
}))

const mockedUseWatch = vi.mocked(useWatch)

describe('CollectionValidation', () => {
  const mockControl = {} as Control<NFTsDataInputs>

  test('should render nothing when there are no duplicates', () => {
    mockedUseWatch.mockReturnValue({
      nft1: {assetNameUtf8: 'asset1'},
      nft2: {assetNameUtf8: 'asset2'},
    })

    const {container} = render(
      <CollectionValidation control={mockControl} isSubmitted={true} />,
    )
    expect(container.firstChild).toBeNull()
  })

  test('should render nothing when not submitted, even with duplicates', () => {
    mockedUseWatch.mockReturnValue({
      nft1: {assetNameUtf8: 'asset1'},
      nft2: {assetNameUtf8: 'asset1'},
    })

    const {container} = render(
      <CollectionValidation control={mockControl} isSubmitted={false} />,
    )
    expect(container.firstChild).toBeNull()
  })

  test('should render error alert when there are duplicates and form is submitted', () => {
    mockedUseWatch.mockReturnValue({
      nft1: {assetNameUtf8: 'asset1'},
      nft2: {assetNameUtf8: 'asset1'},
    })

    render(<CollectionValidation control={mockControl} isSubmitted={true} />)

    expect(
      screen.getByText(
        'Each NFT in the collection must have a unique asset name.',
      ),
    ).toBeInTheDocument()
  })

  test('should handle empty nftsData', () => {
    mockedUseWatch.mockReturnValue({})

    const {container} = render(
      <CollectionValidation control={mockControl} isSubmitted={true} />,
    )
    expect(container.firstChild).toBeNull()
  })
})
