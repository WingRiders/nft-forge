'use client'

import {LocalizationProvider as MuiLocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFnsV3'

export const LocalizationProvider = ({
  children,
}: {children: React.ReactNode}) => {
  return (
    <MuiLocalizationProvider dateAdapter={AdapterDateFns}>
      {children}
    </MuiLocalizationProvider>
  )
}
