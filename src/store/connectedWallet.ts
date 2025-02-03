import type {BrowserWallet} from '@meshsdk/core'
import {create} from 'zustand'

type ConnectedWallet = {
  wallet: BrowserWallet
  address: string
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
      set({connectedWallet: {wallet, address}})
    },
    disconnectWallet: () => set({connectedWallet: null}),
  }),
)
