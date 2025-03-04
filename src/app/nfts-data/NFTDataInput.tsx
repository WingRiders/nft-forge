import {stringToHex} from '@meshsdk/core'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material'
import {useState} from 'react'
import {
  type Control,
  type UseFormRegister,
  useFormState,
  useWatch,
} from 'react-hook-form'
import {Button} from '../../components/Buttons/Button'
import {TextButton} from '../../components/Buttons/TextButton'
import {FormField} from '../../components/FormField'
import {InputField} from '../../components/InputField'
import {Label} from '../../components/Typography/Label'
import {Paragraph} from '../../components/Typography/Paragraph'
import {getErrorMessage} from '../../helpers/forms'
import {ipfsCidToHttps} from '../../helpers/ipfs'
import type {NFTsDataInputs} from './types'

const MAX_ASSET_NAME_HEX_LENGTH = 64

type NFTDataInputProps = {
  id: string
  control: Control<NFTsDataInputs>
  register: UseFormRegister<NFTsDataInputs>
  onDelete?: () => void
  onDuplicate?: () => void
}

export const NFTDataInput = ({
  id,
  control,
  register,
  onDelete,
  onDuplicate,
}: NFTDataInputProps) => {
  const name = useWatch({control, name: `nftsData.${id}.name`})
  const imageIpfsCid = useWatch({control, name: `nftsData.${id}.imageIpfsCid`})
  const imageMimeType = useWatch({
    control,
    name: `nftsData.${id}.imageMimeType`,
  })

  const {errors} = useFormState({control, name: `nftsData.${id}`})

  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false)

  const handleDelete = () => {
    setIsDeleteConfirmModalOpen(false)
    onDelete?.()
  }

  return (
    <>
      <Stack direction="row" spacing={5}>
        <Stack justifyContent="space-between">
          <img
            src={ipfsCidToHttps(imageIpfsCid)}
            alt={name}
            width={200}
            height={200}
          />

          <Stack direction="row" spacing={0.5} alignItems="center">
            <TextButton onClick={() => setIsDeleteConfirmModalOpen(true)}>
              Delete
            </TextButton>
            <TextButton onClick={onDuplicate}>Duplicate</TextButton>
          </Stack>
        </Stack>

        <Stack flex={1} spacing={4}>
          <FormField
            label="NFT asset name"
            error={getErrorMessage(errors.nftsData?.[id]?.assetNameUtf8)}
            tooltip="This name will be used as the name of the NFT asset on the blockchain. Enter a name in a readable format, not in HEX."
          >
            <InputField
              {...register(`nftsData.${id}.assetNameUtf8`, {
                required: true,
                validate: (value) => {
                  if (stringToHex(value).length > MAX_ASSET_NAME_HEX_LENGTH) {
                    return `Asset name is too long. When converted to a HEX string, it cannot be longer than ${MAX_ASSET_NAME_HEX_LENGTH} characters`
                  }
                  return true
                },
              })}
            />
          </FormField>

          <FormField
            label="NFT name"
            error={getErrorMessage(errors.nftsData?.[id]?.name)}
            tooltip="Enter the name of your NFT which will be encoded in the NFT metadata."
          >
            <InputField
              {...register(`nftsData.${id}.name`, {
                required: true,
              })}
            />
          </FormField>

          <FormField
            label="NFT description"
            isOptional
            tooltip="Enter the description of your NFT which will be encoded in the NFT metadata."
          >
            <InputField {...register(`nftsData.${id}.description`)} />
          </FormField>

          <Stack direction="row" alignItems="center" spacing={4}>
            <FormField
              label="IPFS image"
              sx={{flex: 1}}
              tooltip="Hash of the IPFS image"
            >
              <Paragraph>{imageIpfsCid}</Paragraph>
            </FormField>
            <FormField label="Image type" tooltip="MIME type of the IPFS image">
              <Paragraph>{imageMimeType}</Paragraph>
            </FormField>
          </Stack>
        </Stack>
      </Stack>

      <DeleteConfirmModal
        open={isDeleteConfirmModalOpen}
        nftName={name}
        onClose={() => setIsDeleteConfirmModalOpen(false)}
        onDelete={handleDelete}
      />
    </>
  )
}

type DeleteConfirmModalProps = {
  open: boolean
  nftName: string
  onClose: () => void
  onDelete?: () => void
}

const DeleteConfirmModal = ({
  open,
  nftName,
  onClose,
  onDelete,
}: DeleteConfirmModalProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete NFT?</DialogTitle>
      <DialogContent>
        <Paragraph>Are you sure you want to delete this NFT?</Paragraph>
        <Label variant="large" mt={2}>
          {nftName}
        </Label>
      </DialogContent>
      <DialogActions>
        <TextButton onClick={onClose}>Cancel</TextButton>
        <Button color="error" onClick={onDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
