import {
  type ButtonProps,
  type ButtonStatesColors,
  Button as MuiButton,
  styled,
} from '@mui/material'
import type {ReactNode} from 'react'

import Link from 'next/link'
import {ButtonOutline} from './ButtonOutline'
import {getBorderPoints} from './helpers'
import type {GenericAnchorProps, GenericButtonProps} from './types'

const BORDER_THICKNESS = 1
const BORDER_CORNER_DEPTH = 8

type SizeVariant = 'large' | 'medium' | 'fit-content'
type ColorVariant = 'default' | 'brand' | 'secondary' | 'plain'

type StyledProps = {
  hasFontIcon?: boolean
  sizeVariant: SizeVariant
  colorVariant: ColorVariant
  component?: string
}

const skipVariants = (prop: string) =>
  !['hasFontIcon', 'sizeVariant', 'colorVariant'].includes(prop as string)

const StyledButton = styled(MuiButton, {
  shouldForwardProp: skipVariants,
})<StyledProps>(({hasFontIcon, sizeVariant, colorVariant, theme}) => {
  const minSize = {
    large: '48px',
    medium: '36px',
    'fit-content': 'fit-content',
  }[sizeVariant]

  const colors: ButtonStatesColors = theme.palette.iconButton[colorVariant]

  return {
    minHeight: minSize,
    minWidth: minSize,
    borderRadius: 0,
    background: colors.normal.background,
    color: colors.normal.content,
    transition: 'none',
    //take only first 5 points, because we want to cut outside only.
    //Rest of points define cut of inside to make "transparent" effect
    clipPath: `polygon(${getBorderPoints({
      thickness: BORDER_THICKNESS,
      cornerDepth: BORDER_CORNER_DEPTH,
    })
      .slice(0, 6)
      .join(', ')})`,
    border: 'none',
    '&:hover': {
      background: colors.hover.background,
      color: colors.hover.content,
      '& > div:first-of-type': {
        background: colors.hover.border,
      },
      '& > *': {opacity: hasFontIcon ? 1 : 0.5},
    },
    '&:disabled': {
      color: colors.disabled.content,
      background: colors.disabled.background,
      '& > div:first-of-type': {
        background: colors.disabled.border,
      },
      '& > *': {
        opacity: hasFontIcon ? 1 : 0.3,
      },
    },
    '& > div:first-of-type': {
      background: colors.normal.border,
    },
  }
})

type CommonIconButtonProps = {
  icon: ReactNode
  sizeVariant?: SizeVariant
  colorVariant?: ColorVariant
  hasFontIcon?: boolean
} & Pick<ButtonProps, 'disabled' | 'onClick' | 'sx' | 'id'>

type TextButtonButtonProps = {
  linkTo?: string
} & GenericButtonProps

export type IconButtonProps = CommonIconButtonProps &
  (TextButtonButtonProps | GenericAnchorProps)

export const IconButton = (props: IconButtonProps) => {
  const {
    icon,
    sizeVariant = 'fit-content',
    colorVariant = 'plain',
    anchor,
    linkTo,
    ...otherProps
  } = props

  const linkToProps = !anchor && linkTo ? {href: linkTo} : {}

  return (
    <StyledButton
      // @ts-ignore
      component={anchor ? 'a' : linkTo ? Link : 'button'}
      sizeVariant={sizeVariant}
      colorVariant={colorVariant}
      {...linkToProps}
      {...otherProps}
    >
      {colorVariant === 'secondary' && (
        <ButtonOutline
          thickness={BORDER_THICKNESS}
          cornerDepth={BORDER_CORNER_DEPTH}
        />
      )}
      {icon}
    </StyledButton>
  )
}
