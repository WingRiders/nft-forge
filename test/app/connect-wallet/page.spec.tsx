import type {BrowserWallet} from '@meshsdk/core'
import {afterEach, beforeEach, describe, expect, test, vi} from 'vitest'
import ConnectWalletPage from '../../../src/app/connect-wallet/page'
import {useInstalledWalletsIdsQuery} from '../../../src/app/connect-wallet/queries'
import {useConnectedWalletStore} from '../../../src/store/connectedWallet'
import {fireEvent, render, screen, waitFor} from '../../utils'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

const mockConnectWallet = vi.fn()
const mockDisconnectWallet = vi.fn()
vi.mock('../../../src/store/connectedWallet', () => ({
  useConnectedWalletStore: vi.fn(),
}))

vi.mock('../../../src/app/connect-wallet/queries', () => ({
  useInstalledWalletsIdsQuery: vi.fn(() => ({
    data: new Set(['eternl']),
    isLoading: false,
  })),
}))

const mockedWallet = {
  _walletName: 'eternl',
} as unknown as BrowserWallet

describe('ConnectWalletPage', () => {
  beforeEach(() => {
    vi.mocked(useConnectedWalletStore).mockImplementation(() => ({
      connectedWallet: null,
      disconnectWallet: mockDisconnectWallet,
      connectWallet: mockConnectWallet,
      isWalletConnecting: false,
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should display available wallets when not connected', () => {
    render(<ConnectWalletPage />)

    expect(screen.getByText('Eternl')).toBeInTheDocument()
    expect(screen.getByText('NuFi')).toBeInTheDocument()
    expect(screen.getByText('Lace')).toBeInTheDocument()
    expect(screen.getByText('Typhon')).toBeInTheDocument()
  })

  test('should be able to connect wallet', async () => {
    mockConnectWallet.mockResolvedValue({
      wallet: mockedWallet,
      address: 'addr123',
      network: 'preprod',
    })

    render(<ConnectWalletPage />)

    const eternlButton = screen.getByText('Eternl')
    fireEvent.click(eternlButton)

    await waitFor(() => {
      expect(mockConnectWallet).toHaveBeenCalledWith('eternl')
    })
  })

  test('should display connected wallet info when wallet is connected', () => {
    vi.mocked(useConnectedWalletStore).mockImplementation(() => ({
      connectedWallet: {
        wallet: mockedWallet,
        address: 'addr123',
        network: 'preprod',
      },
      disconnectWallet: mockDisconnectWallet,
      connectWallet: mockConnectWallet,
      isWalletConnecting: false,
    }))

    render(<ConnectWalletPage />)

    expect(screen.getByText('Connected')).toBeInTheDocument()
    expect(screen.getByText('addr123')).toBeInTheDocument()
    expect(screen.getByText('preprod')).toBeInTheDocument()
  })

  test('should display error when wallet connection fails', async () => {
    mockConnectWallet.mockRejectedValue(new Error('Connection failed'))

    render(<ConnectWalletPage />)

    const eternlButton = screen.getByText('Eternl')
    fireEvent.click(eternlButton)

    expect(
      await screen.findByText(
        'Error while connecting to wallet: Connection failed',
      ),
    ).toBeInTheDocument()
  })

  test('should be able to disconnect wallet', async () => {
    vi.mocked(useConnectedWalletStore).mockImplementation(() => ({
      connectedWallet: {
        wallet: mockedWallet,
        address: 'addr123',
        network: 'Preprod',
      },
      disconnectWallet: mockDisconnectWallet,
      connectWallet: mockConnectWallet,
      isWalletConnecting: false,
    }))

    render(<ConnectWalletPage />)

    const disconnectButton = screen.getByText('Disconnect')
    fireEvent.click(disconnectButton)

    expect(mockDisconnectWallet).toHaveBeenCalled()
  })

  test('should show loading state while checking installed wallets', () => {
    vi.mocked(useInstalledWalletsIdsQuery).mockImplementation(
      () =>
        ({
          data: undefined,
          isLoading: true,
        }) as any,
    )

    render(<ConnectWalletPage />)

    expect(document.querySelector('.spinner')).toBeInTheDocument()
  })

  test('continue button should be disabled when collateral is not set', () => {
    vi.mocked(useConnectedWalletStore).mockImplementation(() => ({
      connectedWallet: {
        wallet: mockedWallet,
        address: 'addr123',
        network: 'preprod',
      },
      disconnectWallet: mockDisconnectWallet,
      connectWallet: mockConnectWallet,
      isWalletConnecting: false,
    }))

    render(<ConnectWalletPage />)

    const buttonContainer = screen.getByText('Continue')?.closest('a')

    expect(buttonContainer).toHaveAttribute('aria-disabled', 'true')
  })
})
