import {Step, StepLabel, Stepper, type StepperProps} from '@mui/material'
import Link from 'next/link'
import {useShallow} from 'zustand/shallow'
import {getLatestAvailableMintStep} from '../app/MintFlowNavigationRedirect'
import {useCollectionStore} from '../store/collection'
import {useConnectedWalletStore} from '../store/connectedWallet'
import {MintStep} from '../types'

type MintStepperProps = {
  activeStep: MintStep
} & Pick<StepperProps, 'sx'>

export const mintStepsInfo: Record<
  MintStep,
  {index: number; href: string; label: string}
> = {
  [MintStep.CONNECT_WALLET]: {
    index: 0,
    href: '/connect-wallet',
    label: 'Connect wallet',
  },
  [MintStep.COLLECTION_DATA]: {
    index: 1,
    href: '/collection-data',
    label: 'Collection data',
  },
  [MintStep.UPLOAD_IMAGES]: {
    index: 2,
    href: '/upload-images',
    label: 'Upload images',
  },
  [MintStep.NFTS_DATA]: {
    index: 3,
    href: '/nfts-data',
    label: 'NFTs data',
  },
  [MintStep.MINT]: {
    index: 4,
    href: '/mint',
    label: 'Mint',
  },
}

export const MintStepper = ({activeStep, sx}: MintStepperProps) => {
  const activeStepIndex = mintStepsInfo[activeStep].index

  const hasConnectedWallet = useConnectedWalletStore(
    useShallow(({connectedWalletType}) => connectedWalletType != null),
  )

  const {lastSubmittedStep: lastSubmittedCollectionStateStep} =
    useCollectionStore(
      useShallow(({lastSubmittedStep}) => ({
        lastSubmittedStep,
      })),
    )

  const latestAvailableMintStep = getLatestAvailableMintStep(
    lastSubmittedCollectionStateStep,
    hasConnectedWallet,
  )
  const latestAvailableMintStepIndex =
    mintStepsInfo[latestAvailableMintStep].index

  return (
    <Stepper
      activeStep={latestAvailableMintStepIndex}
      alternativeLabel
      nonLinear
      sx={sx}
    >
      {Object.values(mintStepsInfo)
        .toSorted((a, b) => a.index - b.index)
        .map(({label, index, href}) => {
          const isActive = index === activeStepIndex

          return (
            <Step
              key={index}
              {...(index <= latestAvailableMintStepIndex && !isActive
                ? {component: Link, href}
                : {})}
              completed={index < latestAvailableMintStepIndex}
            >
              <StepLabel
                sx={({palette}) => {
                  const color = isActive
                    ? palette.text.primary
                    : palette.text.secondary

                  return {
                    '& .MuiStepLabel-label.Mui-completed': {
                      color,
                    },
                    '& .MuiStepLabel-label.Mui-active': {
                      color,
                    },
                  }
                }}
              >
                {label}
              </StepLabel>
            </Step>
          )
        })}
    </Stepper>
  )
}
