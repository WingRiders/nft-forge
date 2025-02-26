'use client'

import {useRouter} from 'next/navigation'
import {useEffect} from 'react'
import {useShallow} from 'zustand/shallow'
import {useConnectedWalletStore} from '../../store/connectedWallet'

export const ReconnectWallet = () => {
  const router = useRouter()

  const {
    connectedWalletType,
    connectedWallet,
    connectWallet,
    disconnectWallet,
    isWalletConnecting,
  } = useConnectedWalletStore(
    useShallow(
      ({
        connectedWalletType,
        connectedWallet,
        connectWallet,
        disconnectWallet,
        isWalletConnecting,
      }) => ({
        connectedWalletType,
        connectedWallet,
        connectWallet,
        disconnectWallet,
        isWalletConnecting,
      }),
    ),
  )

  useEffect(() => {
    const reconnectWallet = async () => {
      if (!connectedWallet && connectedWalletType && !isWalletConnecting) {
        try {
          await connectWallet(connectedWalletType)
        } catch (error) {
          disconnectWallet()
          router.push('/connect-wallet')
          throw error
        }
      }
    }

    reconnectWallet()
  }, [
    connectedWallet,
    connectedWalletType,
    connectWallet,
    disconnectWallet,
    isWalletConnecting,
    router,
  ])
  return <></>
}
