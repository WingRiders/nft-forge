import {Alert, type SxProps, type Theme} from '@mui/material'
import {useMemo} from 'react'
import {type Control, useWatch} from 'react-hook-form'
import type {NFTsDataInputs} from './types'

type CollectionValidationProps = {
  control: Control<NFTsDataInputs>
  isSubmitted: boolean
  sx?: SxProps<Theme>
}

export const CollectionValidation = ({
  control,
  isSubmitted,
  sx,
}: CollectionValidationProps) => {
  const nftsData = useWatch({control, name: 'nftsData'})

  const hasDuplicates = useMemo(() => {
    const assetNames = nftsData.map((nft) => nft.assetNameUtf8)
    return new Set(assetNames).size !== assetNames.length
  }, [nftsData])

  if (!hasDuplicates || !isSubmitted) return null

  return (
    <Alert severity="error" sx={sx}>
      Each NFT in the collection must have a unique asset name.
    </Alert>
  )
}
