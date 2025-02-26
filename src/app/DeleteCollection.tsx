import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material'
import {useState} from 'react'
import {Button} from '../components/Buttons/Button'
import {TextButton} from '../components/Buttons/TextButton'
import {Paragraph} from '../components/Typography/Paragraph'
import {useCollectionStore} from '../store/collection'

export const DeleteCollection = () => {
  const resetCollection = useCollectionStore((s) => s.reset)
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false)

  const handleDelete = () => {
    resetCollection()
    setIsDeleteConfirmModalOpen(false)
  }

  return (
    <>
      <Stack my={2} alignItems="flex-end">
        <TextButton
          onClick={() => setIsDeleteConfirmModalOpen(true)}
          sx={{px: 0}}
        >
          Delete Collection
        </TextButton>
      </Stack>

      <DeleteConfirmModal
        open={isDeleteConfirmModalOpen}
        onClose={() => setIsDeleteConfirmModalOpen(false)}
        onDelete={handleDelete}
      />
    </>
  )
}

type DeleteConfirmModalProps = {
  open: boolean
  onClose: () => void
  onDelete?: () => void
}

const DeleteConfirmModal = ({
  open,
  onClose,
  onDelete,
}: DeleteConfirmModalProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete NFT collection?</DialogTitle>
      <DialogContent>
        <Paragraph>All data in this collection will be lost.</Paragraph>
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
