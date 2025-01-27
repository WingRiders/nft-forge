import {
  type Theme,
  Typography,
  type TypographyProps,
  styled,
} from '@mui/material'
import {
  type SystemCssProperties,
  type SystemStyleObject,
  spacing,
} from '@mui/system'
import type {ReactNode} from 'react'

import {combineSx} from '../../theme'

type ParagraphVariant = 'small' | 'medium' | 'large' | 'long'

const getSx = (variant: ParagraphVariant) => (theme: Theme) => {
  const sxMap: {[variant in ParagraphVariant]: SystemStyleObject<Theme>} = {
    small: {
      fontSize: '0.8125rem', // 13px
      lineHeight: '0.975rem', // 15.6px
      [theme.breakpoints.down('md')]: {
        fontSize: '0.75rem', // 12px
        lineHeight: '0.9rem', // 14.4px
      },
    },
    medium: {
      fontSize: '0.9375rem', // 15px
      lineHeight: '1.125rem', // 18px
      [theme.breakpoints.down('md')]: {
        fontSize: '0.875rem', // 14px
        lineHeight: '1.05rem', // 16.8px
      },
    },
    large: {
      fontSize: '1.125rem', // 18px
      lineHeight: '1.35rem', // 21.6px
      [theme.breakpoints.down('md')]: {
        fontSize: '1rem', // 16px
        lineHeight: '1.2rem', // 19.2px
      },
    },
    long: {
      fontSize: '1.125rem', // 18px
      lineHeight: '1.4625rem', // 23.4px
      [theme.breakpoints.down('md')]: {
        fontSize: '1rem', // 16px
        lineHeight: '1.3rem', // 20.8px
      },
    },
  }
  return sxMap[variant]
}

export type ParagraphProps = {
  children: ReactNode
  variant?: ParagraphVariant
  component?: React.ElementType
} & Pick<SystemCssProperties<Theme>, 'lineBreak'> &
  Pick<TypographyProps, 'sx' | 'noWrap' | 'onClick' | 'id'>

export const Paragraph = styled(
  ({
    children,
    variant = 'medium',
    lineBreak,
    sx,
    ...otherProps
  }: ParagraphProps) => (
    <Typography
      variant="body1"
      sx={combineSx(
        ({palette}) => ({color: palette.text.secondary, lineBreak}),
        getSx(variant),
      )}
      {...otherProps}
    >
      {children}
    </Typography>
  ),
)(spacing)
