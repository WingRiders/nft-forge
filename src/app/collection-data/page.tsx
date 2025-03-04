'use client'

import {deserializeAddress, resolveScriptHash} from '@meshsdk/core'
import {Box, FormControlLabel, Stack, Switch, Tab, Tabs} from '@mui/material'
import {DateTimePicker} from '@mui/x-date-pickers'
import {addMinutes, hoursToMinutes, isBefore, isPast} from 'date-fns'
import {useRouter} from 'next/navigation'
import pluralize from 'pluralize'
import {type ReactNode, useEffect, useState} from 'react'
import {Controller, type SubmitHandler, useForm} from 'react-hook-form'
import {useShallow} from 'zustand/shallow'
import {Button} from '../../components/Buttons/Button'
import {FormField} from '../../components/FormField'
import {InputField} from '../../components/InputField'
import {MintStepper} from '../../components/MintStepper'
import {Page} from '../../components/Page'
import {Paper} from '../../components/Paper'
import {Paragraph} from '../../components/Typography/Paragraph'
import {
  type CollectionIdFields,
  decodeCollectionId,
} from '../../helpers/collectionId'
import {formatDateTime} from '../../helpers/formatDate'
import {getErrorMessage} from '../../helpers/forms'
import {applyParamsToMinterScript} from '../../onChain/mint'
import {useCollectionStore} from '../../store/collection'
import {useConnectedWalletStore} from '../../store/connectedWallet'
import {MintStep} from '../../types'
import {MintFlowNavigationRedirect} from '../MintFlowNavigationRedirect'

const WEBSITE_URL_PATTERN =
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/

const DEFAULT_MINT_END_DATE_OFFSET_MINUTES = hoursToMinutes(2)
const MIN_ALLOWED_MINT_END_DATE_OFFSET_MINUTES = hoursToMinutes(1)

enum CollectionDataTab {
  NEW_COLLECTION = 0,
  EXISTING_COLLECTION = 1,
}

type CollectionDataInputs = {
  existingCollectionId?: string
  website: string
  mintEndDate: number | null
}

const CollectionDataPage = () => {
  const router = useRouter()

  const walletAddress = useConnectedWalletStore(
    (s) => s.connectedWallet?.address,
  )

  const walletPubKeyHash = walletAddress
    ? deserializeAddress(walletAddress).pubKeyHash
    : undefined

  const [decodedExistingCollectionId, setDecodedExistingCollectionId] =
    useState<{fields: CollectionIdFields; policyId: string} | null>(null)

  const {
    setCollectionData,
    existingCollectionId: existingCollectionIdInStore,
    website: websiteInStore,
    mintEndDate: mintEndDateInStore,
  } = useCollectionStore(
    useShallow(
      ({setCollectionData, existingCollectionId, website, mintEndDate}) => ({
        setCollectionData,
        existingCollectionId,
        website,
        mintEndDate,
      }),
    ),
  )

  const [currentTab, setCurrentTab] = useState<CollectionDataTab>(
    existingCollectionIdInStore
      ? CollectionDataTab.EXISTING_COLLECTION
      : CollectionDataTab.NEW_COLLECTION,
  )

  const {
    register,
    handleSubmit,
    formState: {errors},
    watch,
    setValue,
    control,
    setError,
    trigger,
  } = useForm<CollectionDataInputs>({
    defaultValues: {
      existingCollectionId: existingCollectionIdInStore,
      website: websiteInStore,
      mintEndDate: mintEndDateInStore,
    },
  })

  useEffect(() => {
    setValue('existingCollectionId', existingCollectionIdInStore, {
      shouldValidate: true,
    })
    setCurrentTab(
      existingCollectionIdInStore
        ? CollectionDataTab.EXISTING_COLLECTION
        : CollectionDataTab.NEW_COLLECTION,
    )
  }, [existingCollectionIdInStore, setValue])

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    trigger('existingCollectionId')
  }, [walletPubKeyHash, trigger])

  const onSubmit: SubmitHandler<CollectionDataInputs> = ({
    existingCollectionId,
    website,
    mintEndDate,
  }) => {
    if (existingCollectionId) {
      if (!decodedExistingCollectionId) return

      setCollectionData({
        existingCollectionId,
        website,
        uuid: decodedExistingCollectionId.fields.uuid,
        mintEndDate:
          mintEndDate ?? decodedExistingCollectionId.fields.mintEndDate,
      })
    } else {
      setCollectionData({website, mintEndDate: mintEndDate ?? undefined})
    }
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
            tooltip="Enter the link to your website. It will be encoded in the metadata for each NFT."
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

          <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
            <Tabs
              value={currentTab}
              onChange={(_e, value) => setCurrentTab(value)}
              variant="fullWidth"
            >
              <Tab
                label="Create a new NFT collection"
                {...getTabProps(CollectionDataTab.NEW_COLLECTION)}
              />
              <Tab
                label="Mint additional NFTs to an existing collection"
                {...getTabProps(CollectionDataTab.EXISTING_COLLECTION)}
              />
            </Tabs>
          </Box>
          <TabPanel value={currentTab} index={CollectionDataTab.NEW_COLLECTION}>
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
          </TabPanel>

          <TabPanel
            value={currentTab}
            index={CollectionDataTab.EXISTING_COLLECTION}
          >
            <Stack spacing={2}>
              <FormField
                label="Collection ID"
                error={getErrorMessage(errors.existingCollectionId)}
              >
                <InputField
                  {...register('existingCollectionId', {
                    required:
                      currentTab === CollectionDataTab.EXISTING_COLLECTION,
                    validate: async (value) => {
                      setDecodedExistingCollectionId(null)
                      if (!value) return undefined
                      if (!walletPubKeyHash) return 'Please connect your wallet'
                      const decodedId = decodeCollectionId(value)
                      if (decodedId == null) return 'Invalid collection ID'

                      const mintEndDate =
                        decodedId.mintEndDate != null
                          ? new Date(decodedId.mintEndDate)
                          : null

                      if (mintEndDate != null && isPast(mintEndDate)) {
                        return 'Minting of NFTs in this collection has already ended.'
                      }

                      try {
                        const minterScript = await applyParamsToMinterScript({
                          authorityKeyHex: walletPubKeyHash,
                          collectionIdHex: Buffer.from(
                            decodedId.uuid,
                            'utf-8',
                          ).toString('hex'),
                          endDate: decodedId.mintEndDate,
                        })
                        const policyId = resolveScriptHash(minterScript, 'V3')
                        setDecodedExistingCollectionId({
                          fields: decodedId,
                          policyId,
                        })
                      } catch {
                        return 'Invalid collection ID'
                      }

                      return undefined
                    },
                    onChange: () => {
                      trigger('existingCollectionId')
                    },
                  })}
                  placeholder="Enter collection ID"
                />
              </FormField>

              {decodedExistingCollectionId && (
                <Stack>
                  <Paragraph>
                    Mint end date:{' '}
                    {decodedExistingCollectionId.fields.mintEndDate
                      ? formatDateTime(
                          new Date(
                            decodedExistingCollectionId.fields.mintEndDate,
                          ),
                        )
                      : 'not set'}
                  </Paragraph>
                  <Paragraph>
                    Policy ID: {decodedExistingCollectionId.policyId}
                  </Paragraph>
                </Stack>
              )}
            </Stack>
          </TabPanel>
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={5}>
          <Button onClick={handleSubmit(onSubmit)}>Continue</Button>
        </Stack>
      </Paper>
    </Page>
  )
}

type TabPanelProps = {
  children?: ReactNode
  index: number
  value: number
}

const TabPanel = (props: TabPanelProps) => {
  const {children, value, index, ...other} = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`collection-data-tabpanel-${index}`}
      aria-labelledby={`collection-data-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{p: 3}}>{children}</Box>}
    </div>
  )
}

const getTabProps = (index: number) => ({
  id: `collection-data-tab-${index}`,
  'aria-controls': `collection-data-tabpanel-${index}`,
})

export default CollectionDataPage
