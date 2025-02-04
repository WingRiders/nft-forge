import {
  Box,
  type ButtonStatesColors,
  Button as MuiButton,
  type ButtonProps as MuiButtonProps,
  type SxProps,
  type Theme,
  styled,
} from '@mui/material'
import type {ReactNode} from 'react'

import {combineSx} from '../../theme'

import Link from 'next/link'
import {Spinner, type SpinnerProps} from '../Spinner'
import {AbsoluteFill} from '../utilities'
import {ButtonOutline} from './ButtonOutline'
import {getBorderPoints} from './helpers'
import type {GenericAnchorProps, GenericButtonProps} from './types'

type ColorVariant = 'primary' | 'secondary' | 'error'
type SizeVariant = 'extra-small' | 'small' | 'medium' | 'large'

const sxMap: {[variant in SizeVariant]: SxProps<Theme>} = {
  'extra-small': {
    fontSize: '0.75rem', // 12px
    lineHeight: '0.975rem', // 15.6px
  },
  small: {
    fontSize: '0.8125rem', // 13px
    lineHeight: '1.05625rem', // 16.9px
  },
  medium: {
    fontSize: '0.938rem', // 15px
    lineHeight: '1.219rem', // 19.5px
  },
  large: {
    fontSize: '1.125rem', // 18px
    lineHeight: '1.35rem', // 21.6px
  },
}

const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) =>
    !['backgroundVariant', 'colorVariant'].includes(prop as string),
})<{
  colorVariant: ColorVariant
  borderThickness?: number
}>(({colorVariant, theme, borderThickness = 1}) => {
  const colors: ButtonStatesColors = {
    primary: theme.palette.button.primary,
    secondary: theme.palette.button.secondary,
    error: theme.palette.button.error,
  }[colorVariant]

  return {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    position: 'relative',
    borderRadius: 0,
    transition: 'none',
    backgroundColor: colors.normal.background,
    //take only first 5 points, because we want to cut outside only.
    //Rest of points define cut of inside to make "transparent" effect
    clipPath: `polygon(${getBorderPoints({thickness: borderThickness}).slice(0, 6).join(', ')})`,
    border: 'none',
    color: colors.normal.content,
    '&:hover, &.Mui-focusVisible': {
      border: 'none',
      background: colors.hover.background,
      color: colors.hover.content,
      '& > div:first-of-type': {
        background: colors.hover.border,
      },
    },
    '&.Mui-disabled': {
      border: 'none',
      backgroundColor: colors.disabled.background,
      '& > div:first-of-type': {
        backgroundColor: colors.disabled.border,
      },
      '& > *': {
        color: colors.disabled.content,
      },
    },
    '& > div:first-of-type': {
      background: colors.normal.border,
    },
  }
})

export type CommonButtonProps = {
  borderThickness?: number
  color?: ColorVariant
  size?: SizeVariant
  icon?: ReactNode
  loading?: 'inline' | 'centered' | false
  spinnerVariant?: SpinnerProps['variant']
  linkTo?: string
  sx?: SxProps<Theme>
} & Pick<
  MuiButtonProps,
  'children' | 'disabled' | 'onClick' | 'fullWidth' | 'variant' | 'id'
>

export type ButtonProps = CommonButtonProps &
  (GenericButtonProps | GenericAnchorProps)

export const Button = (props: ButtonProps) => {
  const {
    children,
    color = 'primary',
    variant = 'outlined',
    borderThickness = 1,
    size = 'small',
    icon,
    loading,
    spinnerVariant,
    linkTo,
    anchor,
    sx,
    ...otherProps
  } = props

  const spinnerSize = {'extra-small': 16, small: 18, medium: 23, large: 28}[
    size
  ]
  const linkToProps = !anchor && linkTo ? {href: linkTo} : {}
  const componentProps = anchor
    ? {component: 'a'}
    : linkTo
      ? {component: Link}
      : {}

  return variant === 'text' ? (
    <MuiButton
      sx={combineSx(sxMap[size], sx)}
      {...componentProps}
      {...linkToProps}
      {...{children, variant, ...otherProps}}
    />
  ) : (
    <StyledButton
      colorVariant={color}
      variant={variant}
      sx={combineSx(
        {
          py: {'extra-small': 2.5, small: 3, medium: 3.5, large: 4}[size],
          px: 5,
        },
        sx,
      )}
      {...componentProps}
      {...linkToProps}
      {...otherProps}
    >
      <ButtonOutline thickness={borderThickness} />
      {loading === 'centered' && (
        <AbsoluteFill center>
          <Spinner size={spinnerSize} variant={spinnerVariant} />
        </AbsoluteFill>
      )}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          ...sxMap[size],
          visibility: loading === 'centered' ? 'hidden' : undefined,
        }}
      >
        {loading === 'inline' && (
          <Spinner size={spinnerSize} sx={{mr: 3}} variant={spinnerVariant} />
        )}
        <Box
          sx={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            maxHeight: 'fit-content',
            lineHeight: '100%',
          }}
        >
          {children}
        </Box>
        {icon && <Box ml={3}>{icon}</Box>}
      </Box>
    </StyledButton>
  )
}
