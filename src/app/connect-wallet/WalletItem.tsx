import {Stack} from '@mui/material'
import Image, {type StaticImageData} from 'next/image'
import {Label} from '../../components/Typography/Label'
import {Paragraph} from '../../components/Typography/Paragraph'

type WalletItemProps = {
  name: string
  icon: StaticImageData
  isInstalled: boolean
  disabled?: boolean
  onClick?: () => void
}

export const WalletItem = ({
  name,
  icon,
  isInstalled,
  disabled,
  onClick,
}: WalletItemProps) => {
  const isDisabled = disabled || !isInstalled

  return (
    <Stack
      sx={({palette}) => ({
        bgcolor: palette.background.paper,
        cursor: isDisabled ? undefined : 'pointer',
        '&:hover': {
          bgcolor: isDisabled ? undefined : palette.action.hover,
        },
        opacity: isDisabled ? 0.7 : 1,
      })}
      width="100%"
      direction="row"
      border="none"
      alignItems="center"
      p={4}
      spacing={5}
      component="button"
      onClick={onClick}
      disabled={isDisabled}
    >
      <Image src={icon} alt={name} width={50} height={50} />
      <Label variant="large">{name}</Label>

      {!isInstalled && (
        <Stack flex={1} alignItems="flex-end">
          <Paragraph>Not installed</Paragraph>
        </Stack>
      )}
    </Stack>
  )
}
