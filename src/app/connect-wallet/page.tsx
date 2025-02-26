'use client'

import type {BrowserWallet} from '@meshsdk/core'
import CheckIcon from '@mui/icons-material/Check'
import {Alert, AlertTitle, Box, Grid2, Stack} from '@mui/material'
import {type QueryFunction, useMutation, useQuery} from '@tanstack/react-query'
import {useState} from 'react'
import {useShallow} from 'zustand/shallow'
import {Button} from '../../components/Buttons/Button'
import {CssSpinner} from '../../components/CssSpinner'
import {FormField} from '../../components/FormField'
import {MintStepper} from '../../components/MintStepper'
import {Page} from '../../components/Page'
import {Paper} from '../../components/Paper'
import {Skeleton} from '../../components/Skeleton'
import {Spinner} from '../../components/Spinner'
import {SupportedWalletImage} from '../../components/SupportedWalletImage'
import {Tooltip} from '../../components/Tooltips/Tooltip'
import {Heading} from '../../components/Typography/Heading'
import {Label} from '../../components/Typography/Label'
import {Paragraph} from '../../components/Typography/Paragraph'
import {Center} from '../../components/utilities'
import {useConnectedWalletStore} from '../../store/connectedWallet'
import {MintStep} from '../../types'
import {MintFlowNavigationRedirect} from '../MintFlowNavigationRedirect'
import {WalletItem} from './WalletItem'
import {buildAndSubmitSetCollateralTx} from './buildSetCollateralTx'
import {useInstalledWalletsIdsQuery} from './queries'
import {
  type SupportedWalletType,
  supportedWalletsInfo,
} from './supportedWallets'

const getHasCollateralQueryFn: QueryFunction<
  boolean,
  [string, BrowserWallet | undefined]
> = async ({queryKey}) => {
  const [, wallet] = queryKey

  if (!wallet) {
    throw new Error('Wallet not connected')
  }

  const c = await wallet.getCollateral()
  return c.length > 0
}

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

  const {
    data: hasCollateral,
    isLoading: isLoadingHasCollateral,
    error: hasCollateralError,
  } = useQuery({
    queryKey: ['has-collateral', connectedWallet?.wallet],
    queryFn: getHasCollateralQueryFn,
    enabled: !!connectedWallet,
    refetchOnMount: true,
  })

  const {
    mutate: setCollateral,
    isPending: isSettingCollateral,
    error: setCollateralError,
    data: setCollateralData,
  } = useMutation({
    mutationFn: buildAndSubmitSetCollateralTx,
  })

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

  const handleSetCollateralClick = () => {
    if (!connectedWallet) return
    setCollateral(connectedWallet.wallet)
  }

  const hasSetCollateral = !!hasCollateral || !!setCollateralData

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
                  <FormField
                    label="Collateral"
                    tooltip="To submit a smart contract transaction on the Cardano blockchain, you need to have a collateral set in your wallet. Collateral is typically a 5 ADA UTxO on your address that is returned when the transaction is successfully submitted to the blockchain."
                  >
                    <Skeleton if={isLoadingHasCollateral} fullWidth>
                      <Stack>
                        {hasCollateralError ? (
                          <Paragraph
                            sx={({palette}) => ({color: palette.error.main})}
                          >
                            Error while checking collateral
                          </Paragraph>
                        ) : hasSetCollateral ? (
                          <Paragraph
                            sx={({palette}) => ({color: palette.success.main})}
                          >
                            Collateral set
                          </Paragraph>
                        ) : (
                          <Stack
                            direction="row"
                            spacing={5}
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Paragraph
                              sx={({palette}) => ({
                                color: palette.warning.main,
                              })}
                            >
                              Collateral not set
                            </Paragraph>
                            <Button
                              color="secondary"
                              size="extra-small"
                              disabled={isSettingCollateral}
                              loading={isSettingCollateral && 'inline'}
                              onClick={handleSetCollateralClick}
                            >
                              Set collateral
                            </Button>
                          </Stack>
                        )}
                      </Stack>
                    </Skeleton>
                  </FormField>

                  {setCollateralError && (
                    <Alert severity="error" sx={{mt: 4}}>
                      <AlertTitle>Error while setting collateral</AlertTitle>
                      {setCollateralError.message ||
                        ('info' in setCollateralError &&
                        typeof setCollateralError.info === 'string'
                          ? setCollateralError.info
                          : undefined) ||
                        'Unknown error'}
                    </Alert>
                  )}

                  <Button color="secondary" onClick={disconnectWallet}>
                    Disconnect
                  </Button>
                </Stack>

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Tooltip
                    title={
                      !hasSetCollateral && !isLoadingHasCollateral
                        ? 'Set collateral to continue'
                        : undefined
                    }
                  >
                    <Box>
                      <Button
                        linkTo="/collection-data"
                        disabled={!hasSetCollateral}
                      >
                        Continue
                      </Button>
                    </Box>
                  </Tooltip>
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
