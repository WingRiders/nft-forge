import {Box, type Theme, styled} from '@mui/material'
import MuiTooltip, {
  tooltipClasses,
  type TooltipProps as MuiTooltipProps,
} from '@mui/material/Tooltip'
import type {ReactNode} from 'react'

import {Label} from '../Typography/Label'
import {Paragraph} from '../Typography/Paragraph'

type TooltipVariant = 'black' | 'gray' | 'brand' | 'warning'

const styles = ({
  variant = 'brand',
  theme,
}: {variant?: TooltipVariant; theme: Theme}) => {
  const backgroundColor = theme.palette.tooltip[variant].background

  return {
    [`& .${tooltipClasses.arrow}`]: {
      color: backgroundColor,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor,
      borderRadius: 0,
      maxWidth: 310,
      padding: theme.spacing(variant === 'brand' ? 2 : 3),
      boxShadow: '0px 15px 40px -2px rgba(255, 255, 255, 0.06)',
    },
  }
}

export type TooltipProps = {
  title?: ReactNode
  text?: ReactNode
  variant?: TooltipVariant
} & Pick<
  MuiTooltipProps,
  'placement' | 'children' | 'className' | 'enterDelay' | 'leaveDelay' | 'sx'
>

export const Tooltip = styled(
  ({
    title,
    text,
    variant = 'brand',
    className,
    children,
    ...props
  }: TooltipProps) =>
    title ? (
      <MuiTooltip
        enterTouchDelay={0}
        title={
          <Box>
            <Label
              variant="small"
              sx={({palette}) => ({color: palette.tooltip[variant].title})}
              component="span"
            >
              {title}
            </Label>
            {text && (
              <Paragraph
                variant="small"
                mt={2}
                component="div"
                sx={({breakpoints, palette}) => ({
                  color: palette.tooltip[variant].text,
                  whiteSpace: 'pre-line',
                  lineHeight: '1.0563rem', // 16.9px
                  [breakpoints.down('md')]: {
                    lineHeight: '0.975rem', // 15.6px
                  },
                })}
              >
                {text}
              </Paragraph>
            )}
          </Box>
        }
        arrow
        {...props}
        classes={{popper: className}}
      >
        {children}
      </MuiTooltip>
    ) : (
      children
    ),
)(styles)
