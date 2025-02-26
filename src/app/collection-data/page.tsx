'use client'

import {FormControlLabel, Stack, Switch} from '@mui/material'
import {DateTimePicker} from '@mui/x-date-pickers'
import {addMinutes, hoursToMinutes, isBefore} from 'date-fns'
import {useRouter} from 'next/navigation'
import pluralize from 'pluralize'
import {Controller, type SubmitHandler, useForm} from 'react-hook-form'
import {useShallow} from 'zustand/shallow'
import {Button} from '../../components/Buttons/Button'
import {FormField} from '../../components/FormField'
import {InputField} from '../../components/InputField'
import {MintStepper} from '../../components/MintStepper'
import {Page} from '../../components/Page'
import {Paper} from '../../components/Paper'
import {Paragraph} from '../../components/Typography/Paragraph'
import {getErrorMessage} from '../../helpers/forms'
import {useCollectionStore} from '../../store/collection'
import {MintStep} from '../../types'
import {MintFlowNavigationRedirect} from '../MintFlowNavigationRedirect'

const WEBSITE_URL_PATTERN =
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/

const DEFAULT_MINT_END_DATE_OFFSET_MINUTES = hoursToMinutes(2)
const MIN_ALLOWED_MINT_END_DATE_OFFSET_MINUTES = hoursToMinutes(1)

type CollectionDataInputs = {
  website: string
  mintEndDate: number | null
}

const CollectionDataPage = () => {
  const router = useRouter()

  const {
    setCollectionData,
    website: websiteInStore,
    mintEndDate: mintEndDateInStore,
  } = useCollectionStore(
    useShallow(({setCollectionData, website, mintEndDate}) => ({
      setCollectionData,
      website,
      mintEndDate,
    })),
  )

  const {
    register,
    handleSubmit,
    formState: {errors},
    watch,
    setValue,
    control,
    setError,
  } = useForm<CollectionDataInputs>({
    defaultValues: {
      website: websiteInStore,
      mintEndDate: mintEndDateInStore,
    },
  })

  const onSubmit: SubmitHandler<CollectionDataInputs> = ({
    website,
    mintEndDate,
  }) => {
    setCollectionData({website, mintEndDate: mintEndDate ?? undefined})
    router.push('/upload-images')
  }

  const mintEndDate = watch('mintEndDate')

  return (
    <Page>
      <MintStepper activeStep={MintStep.COLLECTION_DATA} sx={{mt: 3, mb: 5}} />
      <MintFlowNavigationRedirect activeStep={MintStep.COLLECTION_DATA} />

      <Paper title="Collection data">
        <Stack spacing={5}>
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

          <Stack spacing={2} sx={{width: 'fit-content'}}>
            <FormField error={getErrorMessage(errors.mintEndDate)}>
              <Stack
                direction="row"
                spacing={5}
                alignItems="center"
                sx={{minHeight: 55}}
                justifyContent="space-between"
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!mintEndDate}
                      onChange={(_e, checked) => {
                        if (checked) {
                          if (!mintEndDate)
                            setValue(
                              'mintEndDate',
                              addMinutes(
                                new Date(),
                                DEFAULT_MINT_END_DATE_OFFSET_MINUTES,
                              ).getTime(),
                            )
                        } else {
                          setValue('mintEndDate', null)
                        }
                        setError('mintEndDate', {})
                      }}
                      sx={{ml: -2}}
                    />
                  }
                  label="Set mint end date"
                />

                {mintEndDate != null && (
                  <Controller
                    control={control}
                    name="mintEndDate"
                    render={({field}) => (
                      <DateTimePicker
                        value={new Date(field.value!)}
                        onChange={(value) => field.onChange(value?.getTime())}
                        ampm={false}
                      />
                    )}
                    rules={{
                      validate: (value) => {
                        if (!value) return true

                        if (
                          isBefore(
                            value,
                            addMinutes(
                              new Date(),
                              MIN_ALLOWED_MINT_END_DATE_OFFSET_MINUTES,
                            ),
                          )
                        ) {
                          return `Mint end date must be at least ${MIN_ALLOWED_MINT_END_DATE_OFFSET_MINUTES} ${pluralize(
                            'minute',
                            MIN_ALLOWED_MINT_END_DATE_OFFSET_MINUTES,
                          )} from now.`
                        }
                        return true
                      },
                    }}
                  />
                )}
              </Stack>
            </FormField>
            <Stack spacing={1} width="fit-content">
              <Paragraph>
                {mintEndDate != null
                  ? 'Minting of NFTs in this collection will be enabled until the end date you set above.'
                  : 'By not setting the mint end date, minting of NFTs in this collection will be enabled indefinitely.'}
              </Paragraph>
              <Paragraph>
                Additional minting will be possible only with the wallet that
                you are currently connected with.
              </Paragraph>
            </Stack>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={5}>
          <Button onClick={handleSubmit(onSubmit)}>Continue</Button>
        </Stack>
      </Paper>
    </Page>
  )
}

export default CollectionDataPage
