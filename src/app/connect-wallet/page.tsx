'use client'

import CheckIcon from '@mui/icons-material/Check'
import {Alert, Grid2, Stack} from '@mui/material'
import {useState} from 'react'
import {useShallow} from 'zustand/shallow'
import {Button} from '../../components/Buttons/Button'
import {CssSpinner} from '../../components/CssSpinner'
import {FormField} from '../../components/FormField'
import {MintStepper} from '../../components/MintStepper'
import {Page} from '../../components/Page'
import {Paper} from '../../components/Paper'
import {Spinner} from '../../components/Spinner'
import {SupportedWalletImage} from '../../components/SupportedWalletImage'
import {Heading} from '../../components/Typography/Heading'
import {Label} from '../../components/Typography/Label'
import {Paragraph} from '../../components/Typography/Paragraph'
import {Center} from '../../components/utilities'
import {useConnectedWalletStore} from '../../store/connectedWallet'
import {MintStep} from '../../types'
import {MintFlowNavigationRedirect} from '../MintFlowNavigationRedirect'
import {WalletItem} from './WalletItem'
import {useInstalledWalletsIdsQuery} from './queries'
import {
  type SupportedWalletType,
  supportedWalletsInfo,
} from './supportedWallets'

const ConnectWalletPage = () => {
  const [connectWalletError, setConnectWalletError] = useState<Error | null>(
    null,
  )

  const {connectedWallet, disconnectWallet, connectWallet, isWalletConnecting} =
    useConnectedWalletStore(
      useShallow(
        ({
          connectedWallet,
          disconnectWallet,
          connectWallet,
          isWalletConnecting,
        }) => ({
          connectedWallet,
          disconnectWallet,
          connectWallet,
          isWalletConnecting,
        }),
      ),
    )

  const {data: installedWalletsIds, isLoading: isLoadingInstalledWalletsIds} =
    useInstalledWalletsIdsQuery()

  const handleConnectWalletClick = async (walletType: SupportedWalletType) => {
    try {
      setConnectWalletError(null)
      await connectWallet(walletType)
    } catch (error) {
      setConnectWalletError(error as Error)
    }
  }

  return (
    <Page>
      <MintStepper activeStep={MintStep.CONNECT_WALLET} sx={{mt: 3, mb: 5}} />
      <MintFlowNavigationRedirect activeStep={MintStep.CONNECT_WALLET} />

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

                  <FormField label="Address">
                    <Paragraph sx={{wordBreak: 'break-word'}}>
                      {connectedWallet.address}
                    </Paragraph>
                  </FormField>
                  <FormField label="Network">
                    <Paragraph>{connectedWallet.network}</Paragraph>
                  </FormField>
                  <Button color="secondary" onClick={disconnectWallet}>
                    Disconnect
                  </Button>
                </Stack>

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button linkTo="/collection-data">Continue</Button>
                </Stack>
              </Stack>
            ) : (
              <Stack spacing={5} mt={3}>
                <Grid2 container spacing={2} mt={4} position="relative">
                  {Object.entries(supportedWalletsInfo).map(
                    ([walletType, {name, icon, id}]) => (
                      <Grid2 key={id} size={6}>
                        <WalletItem
                          name={name}
                          icon={icon}
                          isInstalled={installedWalletsIds?.has(id) ?? false}
                          disabled={isWalletConnecting}
                          onClick={() =>
                            handleConnectWalletClick(
                              walletType as SupportedWalletType,
                            )
                          }
                        />
                      </Grid2>
                    ),
                  )}

                  {isWalletConnecting && (
                    <Center
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                      }}
                    >
                      <Spinner size={30} />
                    </Center>
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
