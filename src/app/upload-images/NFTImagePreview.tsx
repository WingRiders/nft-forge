import {Stack} from '@mui/material'
import {TextButton} from '../../components/Buttons/TextButton'
import {FileImagePreview} from '../../components/FileImagePreview'
import {Paragraph} from '../../components/Typography/Paragraph'

type NFTImagePreviewProps = {
  image: File | string
  name: string
  showRemoveButton?: boolean
  onRemove?: () => void
}

export const NFTImagePreview = ({
  image,
  name,
  showRemoveButton,
  onRemove,
}: NFTImagePreviewProps) => {
  return (
    <Stack
      alignItems="center"
      bgcolor={({palette}) => palette.background.default}
      spacing={4}
      p={4}
    >
      <Paragraph variant="large">{name}</Paragraph>
      {typeof image === 'string' ? (
        <img src={image} alt={name} width={200} height={200} />
      ) : (
        <FileImagePreview file={image} />
      )}
      {showRemoveButton && (
        <Stack direction="row" justifyContent="flex-end" width="100%">
          <TextButton size="small" sx={{px: 0}} onClick={onRemove}>
            Remove
          </TextButton>
        </Stack>
      )}
    </Stack>
  )
}
