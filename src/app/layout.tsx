import type {Metadata, Viewport} from 'next'
import './globals.css'
import {ThemeProvider} from '@mui/material'
import {AppRouterCacheProvider} from '@mui/material-nextjs/v15-appRouter'
import {AppBackground} from '../components/AppBackground'
import {Header} from '../components/Header'
import {QueryProvider} from '../query/QueryProvider'
import {theme} from '../theme'
import {LocalizationProvider} from './LocalizationProvider'

export const metadata: Metadata = {
  title: 'NFT Forge',
  description: 'Full featured NFT minting platform',
}

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <QueryProvider>
            <ThemeProvider theme={theme}>
              <LocalizationProvider>
                <Header />
                {children}
                <AppBackground />
              </LocalizationProvider>
            </ThemeProvider>
          </QueryProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
