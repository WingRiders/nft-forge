import Image from 'next/image'
import {
  type SupportedWalletType,
  supportedWalletsInfo,
} from '../app/connect-wallet/supportedWallets'

type SupportedWalletImageProps = {
  walletType: SupportedWalletType
  size: number
}

export const SupportedWalletImage = ({
  walletType,
  size,
}: SupportedWalletImageProps) => {
  return (
    <Image
      src={supportedWalletsInfo[walletType].icon}
      alt={supportedWalletsInfo[walletType].name}
      width={size}
      height={size}
    />
  )
}
