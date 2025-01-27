import {
  Box,
  type ButtonStatesColors,
  Button as MuiButton,
  type ButtonProps as MuiButtonProps,
  Stack,
  type StackProps,
  styled,
} from '@mui/material'
import {type AllSystemCSSProperties, spacing} from '@mui/system'
import type {ReactNode} from 'react'

import Link from 'next/link'
import {Spinner} from '../Spinner'
import {Label, type LabelProps} from '../Typography/Label'
import type {GenericAnchorProps, GenericButtonProps} from './types'

type ColorVariant = 'primary' | 'secondary' | 'brand'

type CommonTextButtonProps = {
  color?: ColorVariant
  size?: 'small' | 'medium' | 'large'
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  containerProps?: StackProps
  uppercase?: boolean
  loading?: boolean
  whiteSpace?: AllSystemCSSProperties['whiteSpace']
  labelDisplay?: AllSystemCSSProperties['display']
  underline?: boolean
  labelComponent?: LabelProps['component']
} & Pick<MuiButtonProps, 'children' | 'disabled' | 'fullWidth' | 'sx' | 'id'>

type TextButtonButtonProps = {
  linkTo?: string
} & GenericButtonProps

export type TextButtonProps = CommonTextButtonProps &
  (TextButtonButtonProps | GenericAnchorProps)

const TextButton = (props: TextButtonProps) => {
  const {
    children,
    color: _color,
    disabled,
    size = 'large',
    icon,
    iconPosition = 'left',
    containerProps = {},
    loading = false,
    uppercase = true,
    anchor,
    linkTo,
    whiteSpace = 'nowrap',
    labelDisplay,
    underline,
    labelComponent,
    ...otherProps
  } = props

  const linkToProps = !anchor && linkTo ? {to: linkTo} : {}

  return (
    <MuiButton
      component={anchor ? 'a' : props.linkTo ? Link : 'button'}
      disabled={disabled || loading}
      {...linkToProps}
      {...otherProps}
    >
      <Stack
        display="inline-flex"
        width="100%"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        direction="row"
        {...containerProps}
      >
        {((icon && iconPosition === 'left') || loading) && (
          <Box display="inline-flex" alignItems="center" fontSize="1rem">
            {loading ? <Spinner /> : icon}
          </Box>
        )}
        <Label
          variant={size}
          sx={{
            color: 'inherit',
            display: labelDisplay,
            textOverflow: 'ellipsis',
            whiteSpace,
            overflow: 'hidden',
            maxHeight: 'fit-content',
            textTransform: uppercase ? 'uppercase' : 'none',
            textDecoration: underline ? 'underline' : 'none',
          }}
          component={labelComponent}
        >
          {children}
        </Label>
        {icon && iconPosition === 'right' && (
          <Box display="inline-flex" alignItems="center" fontSize="1rem">
            {icon}
          </Box>
        )}
      </Stack>
    </MuiButton>
  )
}

const StyledTextButton = styled(TextButton)(({theme, color = 'primary'}) => {
  const colors: ButtonStatesColors = theme.palette.textButton[color]

  return {
    width: 'fit-content',
    padding: theme.spacing(2, 3),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    position: 'relative',
    borderRadius: 0,
    transition: 'none',
    border: 'none',
    color: colors.normal.content,
    '&:hover, &.Mui-focusVisible': {
      color: colors.hover.content,
      backgroundColor: 'transparent',
    },
    '&:disabled': {
      '& > *': {
        color: colors.disabled.content,
      },
    },
  }
}, spacing)

export {StyledTextButton as TextButton}
