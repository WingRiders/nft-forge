import {Stack, type SxProps, type Theme} from '@mui/material'
import type {ReactNode} from 'react'

import type {InputFieldProps} from './InputField'
import {QuestionMarkTooltip} from './Tooltips/QuestionMarkTooltip'
import {Label} from './Typography/Label'
import {Paragraph} from './Typography/Paragraph'

type FormFieldProps = InputFieldProps & {
  label?: string | ReactNode
  tooltip?: string
  error?: string
  children: ReactNode
  isOptional?: boolean
  sx?: SxProps<Theme>
}

export const FormField = ({
  label,
  error,
  tooltip,
  children,
  isOptional,
  sx,
}: FormFieldProps) => {
  return (
    <Stack sx={sx}>
      {(label || tooltip) && (
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          {label &&
            (typeof label === 'string' ? (
              <Label variant="large">{label}</Label>
            ) : (
              label
            ))}
          {tooltip && <QuestionMarkTooltip title={tooltip} />}
          {isOptional && <Paragraph>(Optional)</Paragraph>}
        </Stack>
      )}
      {children}
      {error && (
        <Paragraph mt={0.5} sx={({palette}) => ({color: palette.error.main})}>
          {error}
        </Paragraph>
      )}
    </Stack>
  )
}
