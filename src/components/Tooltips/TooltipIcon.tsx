import type {SxProps, Theme} from '@mui/material'
import type {ReactNode} from 'react'

import {combineSx} from '../../theme'

import {Center} from '../utilities'
import {Tooltip, type TooltipProps} from './Tooltip'

type TooltipIconProps = {
  title?: ReactNode
  tooltip?: ReactNode
  icon: ReactNode
  sx?: SxProps<Theme>
} & Pick<TooltipProps, 'placement' | 'variant'>

export const TooltipIcon = ({
  title,
  tooltip,
  icon,
  sx,
  ...otherProps
}: TooltipIconProps) => {
  return (
    <Tooltip title={title} text={tooltip} variant="gray" {...otherProps}>
      <Center sx={combineSx({cursor: 'pointer'}, sx)}>{icon}</Center>
    </Tooltip>
  )
}
