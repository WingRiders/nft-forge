import {Alert, type SxProps, type Theme} from '@mui/material'
import {useEffect} from 'react'
import {
  type Control,
  type UseFormClearErrors,
  type UseFormSetError,
  useFormState,
  useWatch,
} from 'react-hook-form'
import type {NFTsDataInputs} from './types'

type CollectionValidationProps = {
  control: Control<NFTsDataInputs>
  setError: UseFormSetError<NFTsDataInputs>
  clearErrors: UseFormClearErrors<NFTsDataInputs>
  isSubmitted: boolean
  sx?: SxProps<Theme>
}

export const CollectionValidation = ({
  control,
  setError,
  clearErrors,
  isSubmitted,
  sx,
}: CollectionValidationProps) => {
  const nftsData = useWatch({control, name: 'nftsData'})
  const {
    errors: {nftsData: nftsDataError},
  } = useFormState({control, name: 'nftsData'})

  useEffect(() => {
    const assetNames = Object.values(nftsData ?? {}).map(
      ({assetNameUtf8}) => assetNameUtf8,
    )
    const assetNamesCounts = assetNames.reduce(
      (acc, name) => {
        acc[name] = (acc[name] ?? 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    const duplicates = Object.entries(assetNamesCounts).filter(
      ([, count]) => count > 1,
    )

    if (duplicates.length > 0) {
      setError('nftsData', {
        message: `Each NFT in the collection must have a unique asset name. Duplicate asset names: ${duplicates.map(([name]) => name).join(', ')}`,
      })
    } else {
      clearErrors('nftsData')
    }
  }, [nftsData, clearErrors, setError])

  if (!nftsDataError || !isSubmitted) return null

  const errorMessage =
    'message' in nftsDataError && typeof nftsDataError.message === 'string'
      ? nftsDataError.message
      : undefined

  if (!errorMessage) return null

  return (
    <Alert severity="error" sx={sx}>
      {errorMessage}
    </Alert>
  )
}
