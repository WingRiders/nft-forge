'use client'

import {Divider, Stack} from '@mui/material'
import {omit} from 'lodash'
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
import {DeleteCollection} from '../DeleteCollection'
import {MintFlowNavigationRedirect} from '../MintFlowNavigationRedirect'
import {CollectionValidation} from './CollectionValidation'
import {NFTDataInput} from './NFTDataInput'
import type {NFTsDataInputs} from './types'

const NFTsDataPage = () => {
  const router = useRouter()

  const {nftsData, setNFTsData, deleteNFT} = useCollectionStore(
    useShallow(({nftsData, setNFTsData, deleteNFT}) => ({
      nftsData,
      setNFTsData,
      deleteNFT,
    })),
  )

  const {
    register,
    handleSubmit,
    formState: {isSubmitted},
    control,
    setError,
    clearErrors,
    setValue,
    getValues,
  } = useForm<NFTsDataInputs>({
    defaultValues: {
      nftsData,
    },
  })

  const onSubmit: SubmitHandler<NFTsDataInputs> = ({nftsData}) => {
    setNFTsData(nftsData)
    router.push('/mint')
  }

  const handleDeleteNFT = (id: string) => {
    // delete from the store
    deleteNFT(id)
    // delete from the form state
    setValue('nftsData', omit(getValues('nftsData'), id))
  }

  return (
    <Page>
      <MintStepper activeStep={MintStep.NFTS_DATA} sx={{mt: 3, mb: 5}} />
      <MintFlowNavigationRedirect activeStep={MintStep.NFTS_DATA} />

      <Paper title="NFTs data">
        <Stack>
          {nftsData &&
            Object.values(nftsData).map((nftData, index) => (
              <Fragment key={nftData.id}>
                {index > 0 && (
                  <Divider
                    sx={({palette}) => ({my: 6, bgcolor: palette.divider})}
                  />
                )}
                <NFTDataInput
                  id={nftData.id}
                  control={control}
                  register={register}
                  onDelete={() => handleDeleteNFT(nftData.id)}
                />
              </Fragment>
            ))}
        </Stack>

        <CollectionValidation
          control={control}
          setError={setError}
          clearErrors={clearErrors}
          isSubmitted={isSubmitted}
          sx={{my: 5}}
        />

        <Stack alignItems="flex-end" mt={5}>
          <Button onClick={handleSubmit(onSubmit)}>Continue</Button>
        </Stack>
      </Paper>

      <DeleteCollection />
    </Page>
  )
}

export default NFTsDataPage
