'use client'

import {Stack} from '@mui/material'
import {useRouter} from 'next/navigation'
import {type SubmitHandler, useForm} from 'react-hook-form'
import {useShallow} from 'zustand/shallow'
import {Button} from '../../components/Buttons/Button'
import {FormField} from '../../components/FormField'
import {InputField} from '../../components/InputField'
import {MintStepper} from '../../components/MintStepper'
import {Page} from '../../components/Page'
import {Paper} from '../../components/Paper'
import {getErrorMessage} from '../../helpers/forms'
import {useCollectionStore} from '../../store/collection'
import {MintStep} from '../../types'

const WEBSITE_URL_PATTERN =
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/

type CollectionDataInputs = {
  website: string
}

const CollectionDataPage = () => {
  const router = useRouter()

  const {submitCommonData, website: websiteInStore} = useCollectionStore(
    useShallow(({submitCommonData, website}) => ({
      submitCommonData,
      website,
    })),
  )

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<CollectionDataInputs>({
    defaultValues: {
      website: websiteInStore,
    },
  })

  const onSubmit: SubmitHandler<CollectionDataInputs> = ({website}) => {
    submitCommonData({website})
    router.push('/upload-images')
  }

  return (
    <Page>
      <MintStepper step={MintStep.COLLECTION_DATA} sx={{mt: 3, mb: 5}} />

      <Paper title="Collection data">
        <Stack>
          <FormField
            label="Website"
            error={getErrorMessage(errors.website)}
            isOptional
          >
            <InputField
              {...register('website', {
                pattern: {
                  value: WEBSITE_URL_PATTERN,
                  message: 'Invalid website URL',
                },
              })}
              type="url"
              placeholder="Enter link to your website"
            />
          </FormField>
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={5}>
          <Button onClick={handleSubmit(onSubmit)}>Continue</Button>
        </Stack>
      </Paper>
    </Page>
  )
}

export default CollectionDataPage
