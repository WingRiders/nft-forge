import {Step, StepLabel, Stepper, type StepperProps} from '@mui/material'
import Link from 'next/link'
import {MintStep} from '../types'

type MintStepperProps = {
  step: MintStep
} & Pick<StepperProps, 'sx'>

const mintStepsInfo: Record<
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

export const MintStepper = ({step, sx}: MintStepperProps) => {
  const activeStepIndex = mintStepsInfo[step].index

  return (
    <Stepper activeStep={activeStepIndex} alternativeLabel sx={sx}>
      {Object.values(mintStepsInfo)
        .toSorted((a, b) => a.index - b.index)
        .map(({label, index, href}) => (
          <Step
            key={index}
            {...(index < activeStepIndex ? {component: Link, href} : {})}
          >
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
    </Stepper>
  )
}
