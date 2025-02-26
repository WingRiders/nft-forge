import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import {useTheme} from '@mui/material'
import type {ReactNode} from 'react'

import type {TooltipProps} from './Tooltip'
import {TooltipIcon} from './TooltipIcon'

export type QuestionMarkTooltipProps = {
  title?: string | ReactNode
  tooltip?: ReactNode
  color?: string
  size?: number
} & Pick<TooltipProps, 'placement' | 'variant' | 'sx'>

export const QuestionMarkTooltip = ({
  title,
  tooltip,
  color,
  size = 14,
  ...otherProps
}: QuestionMarkTooltipProps) => {
  const {palette} = useTheme()

  return (
    <TooltipIcon
      title={title}
      tooltip={tooltip}
      icon={
        <HelpOutlineOutlinedIcon
          width={size}
          height={size}
          fontSize="inherit"
          fill={color || palette.text.secondary}
        />
      }
      {...otherProps}
    />
  )
}
