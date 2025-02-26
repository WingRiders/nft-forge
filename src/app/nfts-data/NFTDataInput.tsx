import {Stack} from '@mui/material'
import type {FieldErrors, UseFormRegister, UseFormWatch} from 'react-hook-form'
import {FormField} from '../../components/FormField'
import {InputField} from '../../components/InputField'
import {Paragraph} from '../../components/Typography/Paragraph'
import {getErrorMessage} from '../../helpers/forms'
import {ipfsCidToHttps} from '../../helpers/ipfs'
import type {NFTsDataInputs} from './types'

type NFTDataInputProps = {
  index: number
  register: UseFormRegister<NFTsDataInputs>
  watch: UseFormWatch<NFTsDataInputs>
  errors: FieldErrors<NFTsDataInputs>
}

export const NFTDataInput = ({
  index,
  register,
  watch,
  errors,
}: NFTDataInputProps) => {
  const name = watch(`nftsData.${index}.name`)
  const imageIpfsCid = watch(`nftsData.${index}.imageIpfsCid`)
  const imageMimeType = watch(`nftsData.${index}.imageMimeType`)

  return (
    <Stack direction="row" alignItems="center" spacing={5}>
      <img
        src={ipfsCidToHttps(imageIpfsCid)}
        alt={name}
        width={200}
        height={200}
      />

      <Stack flex={1} spacing={4}>
        <FormField
          label="NFT asset name"
          error={getErrorMessage(errors.nftsData?.[index]?.assetNameUtf8)}
          tooltip="This name will be used as the name of the NFT asset on the blockchain. Enter a name in a readable format, not in HEX."
        >
          <InputField
            {...register(`nftsData.${index}.assetNameUtf8`, {
              required: true,
            })}
          />
        </FormField>

        <FormField
          label="NFT name"
          error={getErrorMessage(errors.nftsData?.[index]?.name)}
        >
          <InputField
            {...register(`nftsData.${index}.name`, {
              required: true,
            })}
          />
        </FormField>

        <FormField label="NFT description" isOptional>
          <InputField {...register(`nftsData.${index}.description`)} />
        </FormField>

        <Stack direction="row" alignItems="center" spacing={4}>
          <FormField label="IPFS image" sx={{flex: 1}}>
            <Paragraph>{imageIpfsCid}</Paragraph>
          </FormField>
          <FormField label="Image type">
            <Paragraph>{imageMimeType}</Paragraph>
          </FormField>
        </Stack>
      </Stack>
    </Stack>
  )
}
