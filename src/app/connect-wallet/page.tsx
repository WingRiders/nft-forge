'use client'

import CheckIcon from '@mui/icons-material/Check'
import {Alert, Grid2, Stack} from '@mui/material'
import {useShallow} from 'zustand/shallow'
import {Button} from '../../components/Buttons/Button'
import {CssSpinner} from '../../components/CssSpinner'
import {Page} from '../../components/Page'
import {Paper} from '../../components/Paper'
import {SupportedWalletImage} from '../../components/SupportedWalletImage'
import {Heading} from '../../components/Typography/Heading'
import {Label} from '../../components/Typography/Label'
import {Paragraph} from '../../components/Typography/Paragraph'
import {Center} from '../../components/utilities'
import {useConnectedWalletStore} from '../../store/connectedWallet'
import {WalletItem} from './WalletItem'
import {useConnectWalletMutation, useInstalledWalletsIdsQuery} from './queries'
import {
  type SupportedWalletType,
  supportedWalletsInfo,
} from './supportedWallets'

const ConnectWalletPage = () => {
  const {connectedWallet, disconnectWallet} = useConnectedWalletStore(
    useShallow(({connectedWallet, disconnectWallet}) => ({
      connectedWallet,
      disconnectWallet,
    })),
  )

  const {data: installedWalletsIds, isLoading: isLoadingInstalledWalletsIds} =
    useInstalledWalletsIdsQuery()

  const {
    mutate: connectWallet,
    isPending: isConnectingWallet,
    error: connectWalletError,
  } = useConnectWalletMutation()

  return (
    <Page>
      <Paper title="Connect wallet">
        {isLoadingInstalledWalletsIds ? (
          <Center minHeight={200}>
            <CssSpinner />
          </Center>
        ) : (
          <>
            {connectedWallet ? (
              <Stack spacing={5} mt={3}>
                <Stack
                  bgcolor={({palette}) => palette.background.paper}
                  p={4}
                  width="fit-content"
                  alignSelf="center"
                  spacing={3}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      color={({palette}) => palette.success.main}
                    >
                      <Heading variant="h4" sx={{color: 'inherit'}}>
                        Connected
                      </Heading>
                      <CheckIcon />
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Label variant="large">
                        {connectedWallet.wallet._walletName}
                      </Label>
                      <SupportedWalletImage
                        walletType={
                          connectedWallet.wallet
                            ._walletName as SupportedWalletType
                        }
                        size={20}
                      />
                    </Stack>
                  </Stack>

                  <Paragraph sx={{wordBreak: 'break-word'}}>
                    {connectedWallet.address}
                  </Paragraph>
                  <Button color="secondary" onClick={disconnectWallet}>
                    Disconnect
                  </Button>
                </Stack>

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button>Continue</Button>
                </Stack>
              </Stack>
            ) : (
              <Stack spacing={5} mt={3}>
                <Grid2 container spacing={2} mt={4}>
                  {Object.values(supportedWalletsInfo).map(
                    ({name, icon, id}) => (
                      <Grid2 key={id} size={6}>
                        <WalletItem
                          name={name}
                          icon={icon}
                          isInstalled={installedWalletsIds?.has(id) ?? false}
                          disabled={isConnectingWallet}
                          onClick={() => connectWallet(id)}
                        />
                      </Grid2>
                    ),
                  )}
                </Grid2>
                {connectWalletError && (
                  <Alert severity="error">
                    Error while connecting to wallet:{' '}
                    {connectWalletError instanceof Error
                      ? connectWalletError.message
                      : 'Unknown error'}
                  </Alert>
                )}
              </Stack>
            )}
          </>
        )}
      </Paper>
    </Page>
  )
}

export default ConnectWalletPage
