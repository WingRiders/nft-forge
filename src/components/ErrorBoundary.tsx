'use client'

import {Stack} from '@mui/material'
import {Component, type ReactNode} from 'react'
import {Button} from './Buttons/Button'
import {Heading} from './Typography/Heading'

export class ErrorBoundary extends Component<{children: ReactNode}> {
  state = {hasError: false}

  static getDerivedStateFromError() {
    return {hasError: true}
  }

  render() {
    return this.state.hasError ? <ErrorScreen /> : this.props.children
  }
}

const ErrorScreen = () => {
  return (
    <Stack alignItems="center" pt="10%" spacing={5}>
      <Heading variant="h1">Oops, there has been an unexpected error!</Heading>
      <Button onClick={() => window.location.reload()}>Refresh page</Button>
    </Stack>
  )
}
