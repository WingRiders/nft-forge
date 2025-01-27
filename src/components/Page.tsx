import {Container, Stack} from '@mui/material'
import type {ReactNode} from 'react'
import {Header} from './Header'

type PageProps = {
  showHeader?: boolean
  children?: ReactNode
}

export const Page = ({showHeader, children}: PageProps) => {
  return (
    <Stack>
      {showHeader && <Header />}
      <Container maxWidth="lg" sx={{pt: 5}}>
        {children}
      </Container>
    </Stack>
  )
}
