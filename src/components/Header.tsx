'use client'

import {AppBar, Stack, useScrollTrigger} from '@mui/material'
import {Heading} from './Typography/Heading'

export const Header = () => {
  const scrolled = useScrollTrigger({threshold: 20, disableHysteresis: true})

  return (
    <AppBar
      position="sticky"
      sx={({palette}) => ({
        top: 0,
        left: 0,
        right: 0,
        margin: 0,
        boxShadow: 'none',
        py: 4,
        px: 12,
        borderBottom: 1,
        borderColor: palette.background.dark,
        transition: 'background-color 0.1s linear',
        backgroundColor: scrolled ? palette.background.body : undefined,
      })}
      color="transparent"
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        height="100%"
        minHeight={50}
      >
        <Heading variant="h3">NFT Forge</Heading>
      </Stack>
    </AppBar>
  )
}
