import {Box, Paper as MuiPaper, Stack} from '@mui/material'

import {Heading} from './Typography/Heading'

type PaperProps = {
  children: React.ReactNode
  title?: React.ReactNode
  topRightButton?: React.ReactNode
  disableShadow?: boolean
}

export const Paper = ({
  title,
  topRightButton,
  disableShadow,
  children,
}: PaperProps) => (
  <MuiPaper
    sx={({palette, breakpoints}) => ({
      p: 6,
      pb: 10,
      borderRadius: 0,
      background: palette.background.pagePaper,
      border: `1px solid ${palette.border.container}`,
      boxShadow: disableShadow ? undefined : palette.shadow.pagePaper,
      transition: 'all 0.30s linear',
      [breakpoints.down('md')]: {
        px: 4,
        py: 6,
      },
      position: 'relative',
    })}
  >
    <Box
      sx={({palette}) => ({
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '1px',
        background: palette.gradient.success,
      })}
    />

    <Stack spacing={2}>
      {(title || topRightButton) && (
        <Stack
          direction="row"
          spacing={2}
          justifyContent={
            title && topRightButton
              ? 'space-between'
              : title
                ? 'flex-start'
                : 'flex-end'
          }
          flexWrap="wrap"
        >
          {title != null &&
          (typeof title === 'string' || typeof title === 'number') ? (
            <Heading variant="h1">{title}</Heading>
          ) : (
            title
          )}
          {topRightButton}
        </Stack>
      )}
      <Box>{children}</Box>
    </Stack>
  </MuiPaper>
)
