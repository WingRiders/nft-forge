import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material'
import {useState} from 'react'
import type {FieldErrors, UseFormRegister, UseFormWatch} from 'react-hook-form'
import {Button} from '../../components/Buttons/Button'
import {TextButton} from '../../components/Buttons/TextButton'
import {FormField} from '../../components/FormField'
import {InputField} from '../../components/InputField'
import {Label} from '../../components/Typography/Label'
import {Paragraph} from '../../components/Typography/Paragraph'
import {getErrorMessage} from '../../helpers/forms'
import {ipfsCidToHttps} from '../../helpers/ipfs'
import type {NFTsDataInputs} from './types'

type NFTDataInputProps = {
  id: string
  register: UseFormRegister<NFTsDataInputs>
  watch: UseFormWatch<NFTsDataInputs>
  errors: FieldErrors<NFTsDataInputs>
  onDelete?: () => void
}

export const NFTDataInput = ({
  id,
  register,
  watch,
  errors,
  onDelete,
}: NFTDataInputProps) => {
  const name = watch(`nftsData.${id}.name`)
  const imageIpfsCid = watch(`nftsData.${id}.imageIpfsCid`)
  const imageMimeType = watch(`nftsData.${id}.imageMimeType`)

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

          <TextButton onClick={() => setIsDeleteConfirmModalOpen(true)}>
            Delete
          </TextButton>
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
              })}
            />
          </FormField>

          <FormField
            label="NFT name"
            error={getErrorMessage(errors.nftsData?.[id]?.name)}
          >
            <InputField
              {...register(`nftsData.${id}.name`, {
                required: true,
              })}
            />
          </FormField>

          <FormField label="NFT description" isOptional>
            <InputField {...register(`nftsData.${id}.description`)} />
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
