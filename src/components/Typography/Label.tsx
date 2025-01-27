import {
  type Theme,
  Typography,
  type TypographyProps,
  styled,
} from '@mui/material'
import {type SystemStyleObject, spacing} from '@mui/system'
import type {ElementType, ReactNode} from 'react'
import {combineSx} from '../../theme'

type LabelVariant = 'small' | 'medium' | 'large' | 'number'

const getSx = (variant: LabelVariant) => (theme: Theme) => {
  const sxMap: {[variant in LabelVariant]: SystemStyleObject<Theme>} = {
    small: {
      fontSize: '0.8125rem', // 13px
      lineHeight: '0.975rem', // 15.6px
      fontWeight: 'medium',
      [theme.breakpoints.down('md')]: {
        fontSize: '0.75rem', // 12px
        lineHeight: '0.9rem', // 14.4px
      },
    },
    medium: {
      fontSize: '0.875rem', // 14px
      lineHeight: '1.05rem', // 16.8px
      fontWeight: 'medium',
    },
    large: {
      fontSize: '1rem', // 16px
      lineHeight: '1.2rem', // 19.2px
      fontWeight: 'medium',
    },
    number: {
      fontSize: '2.25rem', // 36px
      lineHeight: '2.7rem', // 43.2px
      [theme.breakpoints.down('md')]: {
        fontSize: '1.75rem', // 28px
        lineHeight: '2.1rem', // 33.6px
      },
    },
  }
  return sxMap[variant]
}

export type LabelProps = {
  children: ReactNode
  variant?: LabelVariant
  component?: ElementType<any>
} & Pick<TypographyProps, 'sx' | 'id' | 'noWrap' | 'textTransform' | 'maxWidth'>

export const Label = styled(
  ({children, variant = 'medium', sx, ...otherProps}: LabelProps) => (
    <Typography
      variant="body1"
      sx={combineSx(
        ({palette}) => ({color: palette.text.primary}),
        getSx(variant),
      )}
      {...otherProps}
    >
      {children}
    </Typography>
  ),
)(spacing)
