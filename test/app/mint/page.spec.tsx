import BigNumber from 'bignumber.js'
import {beforeEach, describe, expect, test, vi} from 'vitest'
import {buildMintTx} from '../../../src/app/mint/buildTx'
import MintPage from '../../../src/app/mint/page'
import {formatAdaQuantity} from '../../../src/helpers/formatAssetQuantity'
import {useCollectionStore} from '../../../src/store/collection'
import {useConnectedWalletStore} from '../../../src/store/connectedWallet'
import {ownerAddress} from '../../fixtures/data/wallet'
import {buildMockedWallet} from '../../fixtures/helpers/wallet'
import {render, screen, waitFor} from '../../utils'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

vi.mock('../../../src/app/mint/buildTx', () => ({
  buildMintTx: vi.fn(),
}))

describe('MintPage', () => {
  const mockWallet = buildMockedWallet({
    utxos: [],
    changeAddress: ownerAddress,
    networkId: 0,
  })

  const mockNFTData = {
    id: '1',
    name: 'Test NFT',
    description: 'Test Description',
    imageIpfsCid: 'test-cid',
    imageMimeType: 'image/png',
    assetNameUtf8: 'Test NFT asset name',
  }

  const txFee = new BigNumber(1000000)

  beforeEach(() => {
    useCollectionStore.setState({
      website: 'https://test.com',
      uuid: '1',
      mintEndDate: new Date('2025-01-01').getTime(),
      nftsData: {
        '1': mockNFTData,
      },
      reset: () =>
        useCollectionStore.setState({
          website: '',
          uuid: '',
          mintEndDate: undefined,
          nftsData: {},
        }),
    })

    useConnectedWalletStore.setState({
      connectedWallet: {
        wallet: mockWallet,
        network: 'preprod',
        address: ownerAddress,
      },
    })

    vi.mocked(buildMintTx).mockResolvedValue({
      builtTx: 'mock-tx',
      txFee,
      policyId: 'test-policy-id',
    })
  })

  test('should render collection data and NFT information', async () => {
    render(<MintPage />)

    expect(
      screen.getByText('Collection data', {selector: 'h3'}),
    ).toBeInTheDocument()
    expect(screen.getByText('https://test.com')).toBeInTheDocument()
    expect(
      screen.getByText(
        /Minting of NFTs in this collection will be enabled until/,
      ),
    ).toBeInTheDocument()

    expect(screen.getByText('NFTs to be minted')).toBeInTheDocument()
    expect(screen.getByText('Test NFT')).toBeInTheDocument()
    expect(screen.getByText('Test NFT asset name')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  test('should display mint button with correct text and fee', async () => {
    render(<MintPage />)

    await waitFor(() => {
      const mintButton = screen.getByText(
        `Mint 1 NFT (${formatAdaQuantity(txFee)})`,
      )
      expect(mintButton).toBeInTheDocument()
    })
  })

  test('should handle transaction build error', async () => {
    const errorMessage = 'Failed to build transaction'
    vi.mocked(buildMintTx).mockRejectedValueOnce(new Error(errorMessage))

    render(<MintPage />)

    await waitFor(() => {
      expect(
        screen.getByText('Error while building the transaction'),
      ).toBeInTheDocument()
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  test('should render mint button with correct text when no NFTs are present', () => {
    useCollectionStore.setState({
      nftsData: {},
    })

    render(<MintPage />)

    expect(screen.getByText('Mint', {selector: 'div'})).toBeInTheDocument()
  })

  test('should display not set message when website is not provided', () => {
    useCollectionStore.setState({
      website: '',
    })

    render(<MintPage />)

    expect(screen.getByText('(Not set)')).toBeInTheDocument()
  })

  test('should display correct message when mint end date is not set', () => {
    useCollectionStore.setState({
      mintEndDate: undefined,
    })

    render(<MintPage />)

    expect(
      screen.getByText(
        'Mint end date not set. Minting of NFTs in this collection will be enabled indefinitely.',
      ),
    ).toBeInTheDocument()
  })
})
