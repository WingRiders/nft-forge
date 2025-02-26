'use client'

import {useRouter} from 'next/navigation'
import {useEffect} from 'react'
import {useShallow} from 'zustand/shallow'
import {mintStepsInfo} from '../components/MintStepper'
import {CollectionStateStep, useCollectionStore} from '../store/collection'
import {useConnectedWalletStore} from '../store/connectedWallet'
import {MintStep} from '../types'

type MintFlowNavigationRedirectProps = {
  activeStep: MintStep
}
/**
 * Redirects user to the latest available step in the mint flow.
 * Useful when the user visits a step that is not available yet.
 */
export const MintFlowNavigationRedirect = ({
  activeStep,
}: MintFlowNavigationRedirectProps) => {
  const router = useRouter()

  const hasConnectedWallet = useConnectedWalletStore(
    useShallow(({connectedWalletType}) => connectedWalletType != null),
  )
  const {
    lastSubmittedStep: lastSubmittedCollectionStateStep,
    isRehydrated: isCollectionStoreRehydrated,
  } = useCollectionStore(
    useShallow(({lastSubmittedStep, isRehydrated}) => ({
      lastSubmittedStep,
      isRehydrated,
    })),
  )

  useEffect(() => {
    // skip the navigation when the store hasn't been hydrated from local storage yet
    if (!isCollectionStoreRehydrated) return

    const requestedMintStepIndex = mintStepsInfo[activeStep].index
    // if the requested page is not in the mint flow, do nothing
    if (requestedMintStepIndex == null) return

    const latestAvailableMintStep = getLatestAvailableMintStep(
      lastSubmittedCollectionStateStep,
      hasConnectedWallet,
    )
    const latestAvailableMintStepIndex =
      mintStepsInfo[latestAvailableMintStep].index

    if (requestedMintStepIndex > latestAvailableMintStepIndex) {
      router.push(mintStepsInfo[latestAvailableMintStep].href)
    }
  }, [
    activeStep,
    hasConnectedWallet,
    lastSubmittedCollectionStateStep,
    router,
    isCollectionStoreRehydrated,
  ])

  return <></>
}

export const getLatestAvailableMintStep = (
  lastSubmittedCollectionStateStep: CollectionStateStep | undefined,
  hasConnectedWallet: boolean,
): MintStep => {
  switch (lastSubmittedCollectionStateStep) {
    case undefined:
      return hasConnectedWallet
        ? MintStep.COLLECTION_DATA
        : MintStep.CONNECT_WALLET
    case CollectionStateStep.COLLECTION_DATA:
      return MintStep.UPLOAD_IMAGES
    case CollectionStateStep.UPLOAD_IMAGES:
      return MintStep.NFTS_DATA
    case CollectionStateStep.NFTS_DATA:
      return MintStep.MINT
  }
}
