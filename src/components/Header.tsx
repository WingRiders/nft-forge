'use client'

import {AppBar, Stack, useScrollTrigger} from '@mui/material'
import {useShallow} from 'zustand/shallow'
import type {SupportedWalletType} from '../app/connect-wallet/supportedWallets'
import {shortLabel} from '../helpers/shortLabel'
import {useConnectedWalletStore} from '../store/connectedWallet'
import {Spinner} from './Spinner'
import {SupportedWalletImage} from './SupportedWalletImage'
import {Heading} from './Typography/Heading'
import {Paragraph} from './Typography/Paragraph'

export const Header = () => {
  const scrolled = useScrollTrigger({threshold: 20, disableHysteresis: true})
  const {connectedWallet, isWalletConnecting} = useConnectedWalletStore(
    useShallow(({connectedWallet, isWalletConnecting}) => ({
      connectedWallet,
      isWalletConnecting,
    })),
  )

  return (
    <AppBar
      position="sticky"
      sx={({palette}) => ({
        top: 0,
        left: 0,
        right: 0,
        margin: 0,
        boxShadow: 'none',
        py: 4,
        px: 12,
        borderBottom: 1,
        borderColor: palette.background.dark,
        transition: 'background-color 0.1s linear',
        backgroundColor: scrolled ? palette.background.body : undefined,
      })}
      color="transparent"
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        height="100%"
        minHeight={50}
      >
        <Heading variant="h3">NFT Forge</Heading>

        {connectedWallet && (
          <Stack position="relative">
            <Stack direction="row" spacing={2} alignItems="center">
              <Paragraph>
                {shortLabel(connectedWallet.address, 15, 8)}
              </Paragraph>
              <SupportedWalletImage
                walletType={
                  connectedWallet.wallet._walletName as SupportedWalletType
                }
                size={20}
              />
            </Stack>
            <Paragraph
              variant="small"
              sx={{
                position: 'absolute',
                bottom: -2,
                right: 0,
                transform: 'translate(0, 100%)',
              }}
            >
              {connectedWallet.network}
            </Paragraph>
          </Stack>
        )}
        {isWalletConnecting && <Spinner size={25} />}
      </Stack>
    </AppBar>
  )
}
