import type {ButtonProps as MuiButtonProps} from '@mui/material'
import type {AnchorHTMLAttributes, ElementType} from 'react'

type ConcreteMuiButtonProps<C extends ElementType> = MuiButtonProps<
  C,
  {component?: C}
>

type AnchorProps = Pick<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'target' | 'rel' | 'href'
>
type NoAnchorProps = {[K in keyof AnchorProps]?: undefined}

export type GenericButtonProps = {
  anchor?: false
  onClick?: ConcreteMuiButtonProps<'button'>['onClick']
} & NoAnchorProps

export type GenericAnchorProps = {
  anchor: true
  onClick?: ConcreteMuiButtonProps<'a'>['onClick']
  linkTo?: undefined
} & AnchorProps
