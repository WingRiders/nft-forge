'use client'

import {Divider, Stack} from '@mui/material'
import {useRouter} from 'next/navigation'
import {Fragment} from 'react'
import {type SubmitHandler, useForm} from 'react-hook-form'
import {useShallow} from 'zustand/shallow'
import {Button} from '../../components/Buttons/Button'
import {MintStepper} from '../../components/MintStepper'
import {Page} from '../../components/Page'
import {Paper} from '../../components/Paper'
import {useCollectionStore} from '../../store/collection'
import {MintStep} from '../../types'
import {CollectionValidation} from './CollectionValidation'
import {NFTDataInput} from './NFTDataInput'
import type {NFTsDataInputs} from './types'

const NFTsDataPage = () => {
  const router = useRouter()

  const {nftsData, setNFTsData} = useCollectionStore(
    useShallow(({nftsData, setNFTsData}) => ({nftsData, setNFTsData})),
  )

  const {
    register,
    handleSubmit,
    watch,
    formState: {errors, isSubmitted},
    control,
  } = useForm<NFTsDataInputs>({
    defaultValues: {
      nftsData,
    },
  })

  const onSubmit: SubmitHandler<NFTsDataInputs> = ({nftsData}) => {
    setNFTsData(nftsData)
    router.push('/mint')
  }

  return (
    <Page>
      <MintStepper step={MintStep.NFTS_DATA} sx={{mt: 3, mb: 5}} />

      <Paper title="NFTs data">
        <Stack>
          {nftsData.map((_nftData, index) => (
            <Fragment key={index}>
              {index > 0 && (
                <Divider
                  sx={({palette}) => ({my: 6, bgcolor: palette.divider})}
                />
              )}
              <NFTDataInput
                index={index}
                register={register}
                watch={watch}
                errors={errors}
              />
            </Fragment>
          ))}
        </Stack>

        <CollectionValidation
          control={control}
          isSubmitted={isSubmitted}
          sx={{my: 5}}
        />

        <Stack alignItems="flex-end" mt={5}>
          <Button onClick={handleSubmit(onSubmit)}>Continue</Button>
        </Stack>
      </Paper>
    </Page>
  )
}

export default NFTsDataPage
