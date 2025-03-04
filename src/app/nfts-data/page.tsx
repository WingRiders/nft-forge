'use client'

import {Divider, Stack} from '@mui/material'
import {omit} from 'lodash'
import {useRouter} from 'next/navigation'
import {Fragment, useEffect, useState} from 'react'
import {type SubmitHandler, useForm} from 'react-hook-form'
import {v4 as uuidV4} from 'uuid'
import {useShallow} from 'zustand/shallow'
import {Button} from '../../components/Buttons/Button'
import {MintStepper} from '../../components/MintStepper'
import {Page} from '../../components/Page'
import {Paper} from '../../components/Paper'
import {type NFTData, useCollectionStore} from '../../store/collection'
import {MintStep} from '../../types'
import {DeleteCollection} from '../DeleteCollection'
import {MintFlowNavigationRedirect} from '../MintFlowNavigationRedirect'
import {CollectionValidation} from './CollectionValidation'
import {NFTDataInput} from './NFTDataInput'
import type {NFTsDataInputs} from './types'

const NFTsDataPage = () => {
  const router = useRouter()

  const {nftsData, addNewNFTsData, setNFTsData, deleteNFT} = useCollectionStore(
    useShallow(({nftsData, addNewNFTsData, setNFTsData, deleteNFT}) => ({
      nftsData,
      addNewNFTsData,
      setNFTsData,
      deleteNFT,
    })),
  )

  const [isFormInitialized, setIsFormInitialized] = useState(false)

  const {
    register,
    handleSubmit,
    formState: {isSubmitted},
    control,
    setError,
    clearErrors,
    setValue,
    getValues,
  } = useForm<NFTsDataInputs>()

  const onSubmit: SubmitHandler<NFTsDataInputs> = ({nftsData}) => {
    setNFTsData(nftsData)
    router.push('/mint')
  }

  // It takes some time before the nftsData in the store is rehydrated from the local storage.
  // This effect is used to initialize the form state with the nftsData from the store.
  useEffect(() => {
    if (nftsData && getValues('nftsData') == null) {
      setValue('nftsData', nftsData)
      setIsFormInitialized(true)
    }
  }, [nftsData, getValues, setValue])

  const handleDeleteNFT = (id: string) => {
    // delete from the store
    deleteNFT(id)
    // delete from the form state
    setValue('nftsData', omit(getValues('nftsData'), id))
  }

  const handleDuplicateNFT = (id: string) => {
    const existingNftsData = getValues('nftsData')
    const existingNftData = existingNftsData[id]
    if (!existingNftData) return

    const newNftData: NFTData = {
      id: uuidV4(),
      assetNameUtf8: `${existingNftData.assetNameUtf8}-copy`,
      name: `${existingNftData.name} (copy)`,
      description: existingNftData.description,
      imageIpfsCid: existingNftData.imageIpfsCid,
      imageMimeType: existingNftData.imageMimeType,
    }

    // duplicate in the store
    addNewNFTsData([newNftData])
    // duplicate in the form state
    setValue('nftsData', {...existingNftsData, [newNftData.id]: newNftData})
  }

  return (
    <Page>
      <MintStepper activeStep={MintStep.NFTS_DATA} sx={{mt: 3, mb: 5}} />
      <MintFlowNavigationRedirect activeStep={MintStep.NFTS_DATA} />

      <Paper title="NFTs data">
        <Stack>
          {nftsData &&
            isFormInitialized &&
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
                  onDuplicate={() => handleDuplicateNFT(nftData.id)}
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
