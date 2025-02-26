import {BrowserWallet, type Network} from '@meshsdk/core'
import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import {
  type SupportedWalletType,
  supportedWalletsInfo,
} from '../app/connect-wallet/supportedWallets'
import {walletNetworkIdToNetwork} from '../helpers/wallet'

type ConnectedWallet = {
  wallet: BrowserWallet
  address: string
  network: Network
}

type ConnectedWalletState = {
  connectedWalletType: SupportedWalletType | null
  connectedWallet: ConnectedWallet | null
  isWalletConnecting: boolean
  connectWallet: (walletType: SupportedWalletType) => Promise<void>
  disconnectWallet: () => void
}

export const useConnectedWalletStore = create<ConnectedWalletState>()(
  persist(
    (set) => ({
      connectedWalletType: null,
      connectedWallet: null,
      isWalletConnecting: false,
      connectWallet: async (walletType) => {
        set({isWalletConnecting: true})
        try {
          const walletId = supportedWalletsInfo[walletType].id
          const wallet = await BrowserWallet.enable(walletId)
          const address = await wallet.getChangeAddress()
          const networkId = await wallet.getNetworkId()
          set({
            connectedWallet: {
              wallet,
              address,
              network: walletNetworkIdToNetwork(networkId),
            },
            connectedWalletType: walletType,
            isWalletConnecting: false,
          })
        } catch (error) {
          set({isWalletConnecting: false})
          throw error
        }
      },
      disconnectWallet: () =>
        set({connectedWalletType: null, connectedWallet: null}),
    }),
    {
      name: 'connected-wallet',
      partialize: (state) => ({
        connectedWalletType: state.connectedWalletType,
      }),
    },
  ),
)
