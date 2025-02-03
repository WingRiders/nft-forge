import type {StaticImageData} from 'next/image'
import eternlIcon from './walletIcons/eternl.png'
import laceIcon from './walletIcons/lace.svg'
import nufiIcon from './walletIcons/nufi.svg'
import typhonIcon from './walletIcons/typhon.svg'

export enum SupportedWalletType {
  ETERNL = 'eternl',
  NUFI = 'nufi',
  LACE = 'lace',
  TYPHON = 'typhon',
}

type WalletInfo = {
  name: string
  icon: StaticImageData
  id: string // matches the ID in MeshJS and the CIP-30 API field name in window.cardano
}

export const supportedWalletsInfo: Record<SupportedWalletType, WalletInfo> = {
  [SupportedWalletType.ETERNL]: {
    name: 'Eternl',
    icon: eternlIcon,
    id: 'eternl',
  },
  [SupportedWalletType.NUFI]: {
    name: 'Nufi',
    icon: nufiIcon,
    id: 'nufi',
  },
  [SupportedWalletType.LACE]: {
    name: 'Lace',
    icon: laceIcon,
    id: 'lace',
  },
  [SupportedWalletType.TYPHON]: {
    name: 'Typhon',
    icon: typhonIcon,
    id: 'typhoncip30',
  },
}
