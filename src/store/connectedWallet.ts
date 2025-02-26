import type {BrowserWallet, Network} from '@meshsdk/core'
import {create} from 'zustand'
import {walletNetworkIdToNetwork} from '../helpers/wallet'

type ConnectedWallet = {
  wallet: BrowserWallet
  address: string
  network: Network
}

type ConnectedWalletState = {
  connectedWallet: ConnectedWallet | null
  connectWallet: (wallet: BrowserWallet) => Promise<void>
  disconnectWallet: () => void
}

export const useConnectedWalletStore = create<ConnectedWalletState>()(
  (set) => ({
    connectedWallet: null,
    connectWallet: async (wallet) => {
      const address = await wallet.getChangeAddress()
      const networkId = await wallet.getNetworkId()
      set({
        connectedWallet: {
          wallet,
          address,
          network: walletNetworkIdToNetwork(networkId),
        },
      })
    },
    disconnectWallet: () => set({connectedWallet: null}),
  }),
)
