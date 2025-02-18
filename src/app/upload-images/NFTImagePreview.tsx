import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import {Stack} from '@mui/material'
import {IconButton} from '../../components/Buttons/IconButton'
import {TextButton} from '../../components/Buttons/TextButton'
import {FileImagePreview} from '../../components/FileImagePreview'
import {Paragraph} from '../../components/Typography/Paragraph'
import {WithClipboard} from '../../helpers/clipboard'
import {shortLabel} from '../../helpers/shortLabel'

type NFTImagePreviewProps = {
  image: File | string
  name: string
  cid?: string
  showRemoveButton?: boolean
  onRemove?: () => void
}

export const NFTImagePreview = ({
  image,
  name,
  cid,
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
      {cid && (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Paragraph variant="large">CID: {shortLabel(cid, 10, 10)}</Paragraph>
          <WithClipboard text={cid}>
            {({copy}) => (
              <IconButton
                onClick={copy}
                icon={<ContentCopyIcon fontSize="inherit" />}
              />
            )}
          </WithClipboard>
        </Stack>
      )}
    </Stack>
  )
}
