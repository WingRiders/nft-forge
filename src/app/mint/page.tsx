'use client'

import type {BrowserWallet} from '@meshsdk/core'
import {Alert, AlertTitle, Divider, Stack} from '@mui/material'
import {type QueryFunction, useQuery} from '@tanstack/react-query'
import {useRouter} from 'next/navigation'
import pluralize from 'pluralize'
import {Fragment} from 'react'
import {useShallow} from 'zustand/shallow'
import {Button} from '../../components/Buttons/Button'
import {MintStepper} from '../../components/MintStepper'
import {Page} from '../../components/Page'
import {Paper} from '../../components/Paper'
import {formatAdaQuantity} from '../../helpers/formatAssetQuantity'
import {useSignAndSubmitTxMutation} from '../../helpers/transaction'
import {type CollectionState, useCollectionStore} from '../../store/collection'
import {useConnectedWalletStore} from '../../store/connectedWallet'
import {MintStep} from '../../types'
import {MintFlowNavigationRedirect} from '../MintFlowNavigationRedirect'
import {MintSuccessModal} from './MintSuccessModal'
import {NFTDisplay} from './NFTDisplay'
import {buildMintTx} from './buildTx'

const buildMintTxQueryFn: QueryFunction<
  Awaited<ReturnType<typeof buildMintTx>>,
  [string, CollectionState, BrowserWallet | undefined]
> = ({queryKey}) => {
  const [, collection, wallet] = queryKey

  if (!wallet) {
    throw new Error('Wallet not connected')
  }

  return buildMintTx({collection, wallet})
}

const MintPage = () => {
  const router = useRouter()

  const {wallet} = useConnectedWalletStore(
    useShallow(({connectedWallet}) => ({wallet: connectedWallet?.wallet})),
  )

  const collection = useCollectionStore((c) => c)

  const {
    data: buildTxData,
    isLoading: isLoadingBuildTx,
    error: buildTxError,
  } = useQuery({
    queryKey: ['build-mint-tx', collection, wallet],
    queryFn: buildMintTxQueryFn,
    retry: false,
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: true,
  })

  const {
    mutate: signAndSubmitTx,
    isPending: isSigningAndSubmittingTx,
    data: signAndSubmitTxData,
    error: signAndSubmitTxError,
    reset: resetSignAndSubmitTx,
  } = useSignAndSubmitTxMutation()

  const handleMint = async () => {
    if (!wallet || !buildTxData) {
      throw new Error('Wallet or mintTxData not found')
    }

    signAndSubmitTx({tx: buildTxData.builtTx, wallet, partialSign: true})
  }

  const handleSuccessModalClose = () => {
    collection.reset()
    resetSignAndSubmitTx()
    router.push('/')
  }

  const isLoading = isLoadingBuildTx || isSigningAndSubmittingTx

  return (
    <>
      <Page>
        <MintStepper activeStep={MintStep.MINT} sx={{mt: 3, mb: 5}} />
        <MintFlowNavigationRedirect activeStep={MintStep.MINT} />

        <Paper title="Mint">
          <Stack spacing={4}>
            {collection.nftsData?.map((nftData, index) => (
              <Fragment key={index}>
                {index > 0 && (
                  <Divider
                    sx={({palette}) => ({my: 6, bgcolor: palette.divider})}
                  />
                )}
                <NFTDisplay key={index} nftData={nftData} />
              </Fragment>
            ))}
          </Stack>

          {buildTxError && (
            <Alert severity="error" sx={{mt: 4}}>
              <AlertTitle>Error while building the transaction</AlertTitle>
              {buildTxError.message || 'Unknown error'}
            </Alert>
          )}

          {signAndSubmitTxError && (
            <Alert severity="error" sx={{mt: 4}}>
              <AlertTitle>Error while submitting the transaction</AlertTitle>
              {signAndSubmitTxError.message ||
                ('info' in signAndSubmitTxError &&
                typeof signAndSubmitTxError.info === 'string'
                  ? signAndSubmitTxError.info
                  : undefined) ||
                'Unknown error'}
            </Alert>
          )}

          <Button
            onClick={handleMint}
            disabled={isLoading || !!buildTxError}
            loading={isLoading && 'centered'}
            sx={{mt: 4, textTransform: 'none'}}
            fullWidth
            size="large"
          >
            {collection.nftsData && collection.nftsData.length > 0
              ? `Mint ${collection.nftsData.length} ${pluralize('NFT', collection.nftsData.length)}${
                  buildTxData
                    ? ` (${formatAdaQuantity(buildTxData.txFee)})`
                    : ''
                }`
              : 'Mint'}
          </Button>
        </Paper>
      </Page>

      <MintSuccessModal
        buildMintTxResult={buildTxData}
        signAndSubmitData={signAndSubmitTxData}
        onClose={handleSuccessModalClose}
      />
    </>
  )
}

export default MintPage
