import {render} from '@testing-library/react'
import {useRouter} from 'next/navigation'
import {beforeEach, describe, expect, test, vi} from 'vitest'
import {ReconnectWallet} from '../../../src/app/connect-wallet/ReconnectWallet'
import {SupportedWalletType} from '../../../src/app/connect-wallet/supportedWallets'
import {useConnectedWalletStore} from '../../../src/store/connectedWallet'
import type {ConnectedWalletState} from '../../../src/store/connectedWallet'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

vi.mock('../../../src/store/connectedWallet', () => ({
  useConnectedWalletStore: vi.fn(),
}))

describe('ReconnectWallet', () => {
  const mockRouter = {push: vi.fn()}
  const mockConnectWallet = vi.fn()
  const mockDisconnectWallet = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockImplementation(() => mockRouter as any)
  })

  test('should attempt to reconnect wallet if wallet type exists but not connected', async () => {
    vi.mocked(useConnectedWalletStore).mockImplementation(
      (selector: (state: ConnectedWalletState) => any) =>
        selector({
          connectedWalletType: SupportedWalletType.LACE,
          connectedWallet: null,
          connectWallet: mockConnectWallet,
          disconnectWallet: mockDisconnectWallet,
          isWalletConnecting: false,
        }),
    )

    render(<ReconnectWallet />)

    expect(mockConnectWallet).toHaveBeenCalledWith(SupportedWalletType.LACE)
  })

  test('should not attempt to reconnect if wallet is already connected', () => {
    vi.mocked(useConnectedWalletStore).mockImplementation(
      (selector: (state: ConnectedWalletState) => any) =>
        selector({
          connectedWalletType: SupportedWalletType.LACE,
          connectedWallet: {address: 'addr1'} as any,
          connectWallet: mockConnectWallet,
          disconnectWallet: mockDisconnectWallet,
          isWalletConnecting: false,
        }),
    )

    render(<ReconnectWallet />)

    expect(mockConnectWallet).not.toHaveBeenCalled()
  })

  test('should not attempt to reconnect if already connecting', () => {
    vi.mocked(useConnectedWalletStore).mockImplementation(
      (selector: (state: ConnectedWalletState) => any) =>
        selector({
          connectedWalletType: SupportedWalletType.LACE,
          connectedWallet: null,
          connectWallet: mockConnectWallet,
          disconnectWallet: mockDisconnectWallet,
          isWalletConnecting: true,
        }),
    )

    render(<ReconnectWallet />)

    expect(mockConnectWallet).not.toHaveBeenCalled()
  })

  test('should handle connection error by disconnecting and redirecting', async () => {
    mockConnectWallet.mockRejectedValueOnce(new Error('Connection failed'))

    vi.mocked(useConnectedWalletStore).mockImplementation(
      (selector: (state: ConnectedWalletState) => any) =>
        selector({
          connectedWalletType: SupportedWalletType.LACE,
          connectedWallet: null,
          connectWallet: mockConnectWallet,
          disconnectWallet: mockDisconnectWallet,
          isWalletConnecting: false,
        }),
    )

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<ReconnectWallet />)

    await vi.waitFor(() => {
      expect(mockDisconnectWallet).toHaveBeenCalled()
      expect(mockRouter.push).toHaveBeenCalledWith('/connect-wallet')
    })

    expect(consoleError).toHaveBeenCalled()
    consoleError.mockRestore()
  })

  test('should not attempt to reconnect if no wallet type exists', () => {
    vi.mocked(useConnectedWalletStore).mockImplementation(
      (selector: (state: ConnectedWalletState) => any) =>
        selector({
          connectedWalletType: null,
          connectedWallet: null,
          connectWallet: mockConnectWallet,
          disconnectWallet: mockDisconnectWallet,
          isWalletConnecting: false,
        }),
    )

    render(<ReconnectWallet />)

    expect(mockConnectWallet).not.toHaveBeenCalled()
  })
})
