import {
  type Theme,
  Typography,
  type TypographyProps,
  styled,
} from '@mui/material'
import {type SystemStyleObject, spacing} from '@mui/system'
import type {ReactNode} from 'react'
import {combineSx} from '../../theme'

type HeadingVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5'

const getSx = (variant: HeadingVariant) => (theme: Theme) => {
  const sxMap: {[variant in HeadingVariant]: SystemStyleObject<Theme>} = {
    h1: {
      fontSize: '2.25rem', // 36px
      lineHeight: '2.7rem', // 43.2px
      fontWeight: 'normal',
      [theme.breakpoints.down('md')]: {
        fontSize: '1.5rem', // 24px
        lineHeight: '1.8rem', // 28.8px
      },
    },
    h2: {
      fontSize: '1.75rem', // 28px
      lineHeight: '2.1rem', // 33.6px
      fontWeight: 'normal',
      [theme.breakpoints.down('md')]: {
        fontSize: '1.375rem', // 22px
        lineHeight: '1.65rem', // 26.4px
      },
    },
    h3: {
      fontSize: '1.5rem', // 24px
      lineHeight: '1.8rem', // 28.8px
      fontWeight: 'medium',
      [theme.breakpoints.down('md')]: {
        fontSize: '1.25rem', // 20px
        lineHeight: '1.5rem', // 24px
      },
    },
    h4: {
      fontSize: '1.25rem', // 20px
      lineHeight: '1.5rem', // 24px
      fontWeight: 'medium',
      [theme.breakpoints.down('md')]: {
        fontSize: '1.125rem', // 18px
        lineHeight: '1.35rem', // 21.6px
      },
    },
    h5: {
      fontSize: '1.125rem', // 18px
      lineHeight: '1.35rem', // 21.6px
      fontWeight: 'medium',
      [theme.breakpoints.down('md')]: {
        fontSize: '1rem', // 16px
        lineHeight: '1.2rem', // 19.2px
      },
    },
  }
  return sxMap[variant]
}

type HeadingProps = {
  children: ReactNode
  variant: HeadingVariant
} & Pick<TypographyProps, 'sx'>

export const Heading = styled(
  ({children, variant, sx, ...otherProps}: HeadingProps) => (
    <Typography
      fontFamily="DM Sans"
      sx={combineSx(
        ({palette}) => ({color: palette.text.primary}),
        getSx(variant),
      )}
      variant={variant}
      {...otherProps}
    >
      {children}
    </Typography>
  ),
)(spacing)
