'use client'

import type {BrowserWallet} from '@meshsdk/core'
import {Alert, AlertTitle, Divider, Stack} from '@mui/material'
import {type QueryFunction, useQuery} from '@tanstack/react-query'
import {useRouter} from 'next/navigation'
import pluralize from 'pluralize'
import {Fragment, useState} from 'react'
import {useShallow} from 'zustand/shallow'
import {Button} from '../../components/Buttons/Button'
import {FormField} from '../../components/FormField'
import {MintStepper} from '../../components/MintStepper'
import {Page} from '../../components/Page'
import {Paper} from '../../components/Paper'
import {Heading} from '../../components/Typography/Heading'
import {Paragraph} from '../../components/Typography/Paragraph'
import {formatAdaQuantity} from '../../helpers/formatAssetQuantity'
import {formatDateTime} from '../../helpers/formatDate'
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

  const [hasMintingEnded, setHasMintingEnded] = useState(false)

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
    enabled: !hasMintingEnded,
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
    setHasMintingEnded(true)
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
          <Heading variant="h3">Collection data</Heading>
          <Stack spacing={2} mt={2}>
            <FormField label="Website">
              <Paragraph>{collection.website || <i>(Not set)</i>}</Paragraph>
            </FormField>
            <FormField label="Mint end date">
              <Paragraph>
                {collection.mintEndDate
                  ? `Minting of NFTs in this collection will be enabled until ${formatDateTime(
                      collection.mintEndDate,
                    )}`
                  : 'Mint end date not set. Minting of NFTs in this collection will be enabled indefinitely.'}
              </Paragraph>
            </FormField>
          </Stack>

          <Heading variant="h3" mt={8}>
            NFTs to be minted
          </Heading>
          <Stack spacing={4} mt={2}>
            {collection.nftsData &&
              Object.values(collection.nftsData).map((nftData, index) => (
                <Fragment key={nftData.id}>
                  {index > 0 && (
                    <Divider
                      sx={({palette}) => ({my: 6, bgcolor: palette.divider})}
                    />
                  )}
                  <NFTDisplay nftData={nftData} />
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
            {collection.nftsData && Object.keys(collection.nftsData).length > 0
              ? `Mint ${Object.keys(collection.nftsData).length} ${pluralize('NFT', Object.keys(collection.nftsData).length)}${
                  buildTxData
                    ? ` (${formatAdaQuantity(buildTxData.txFee)})`
                    : ''
                }`
              : 'Mint'}
          </Button>
        </Paper>
      </Page>

      <MintSuccessModal
        collection={collection}
        buildMintTxResult={buildTxData}
        signAndSubmitData={signAndSubmitTxData}
        onClose={handleSuccessModalClose}
      />
    </>
  )
}

export default MintPage
