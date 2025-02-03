import {BrowserWallet} from '@meshsdk/core'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useConnectedWalletStore} from '../../store/connectedWallet'

export const useInstalledWalletsIdsQuery = () =>
  useQuery({
    queryKey: ['installed-wallets-ids'],
    queryFn: async () => {
      const wallets = await BrowserWallet.getAvailableWallets()
      return new Set(wallets.map((wallet) => wallet.id))
    },
  })

export const useConnectWalletMutation = () => {
  const connectWallet = useConnectedWalletStore((state) => state.connectWallet)

  return useMutation({
    mutationKey: ['connect-wallet'],
    mutationFn: async (walletId: string) => {
      const wallet = await BrowserWallet.enable(walletId)
      await connectWallet(wallet)
    },
  })
}
