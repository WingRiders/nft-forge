import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import {
  InputAdornment,
  type InputProps,
  Stack,
  TextField,
  type TextFieldProps,
  styled,
} from '@mui/material'
import {type ReactNode, forwardRef} from 'react'

import {combineSx} from '../theme'
import {IconButton} from './Buttons/IconButton'

export type InputFieldVariant = 'medium' | 'large'
export type InputFieldColorVariant = 'default' | 'paper'

export type InputFieldProps = {
  startAdornment?: ReactNode
  endAdornment?: ReactNode
  inputVariant?: InputFieldVariant
  textAlign?: 'left' | 'right'
  enableClear?: boolean
  onClear?: () => void
  colorVariant?: InputFieldColorVariant
  muiVariant?: TextFieldProps['variant']
} & Pick<
  TextFieldProps,
  | 'variant'
  | 'value'
  | 'type'
  | 'placeholder'
  | 'onChange'
  | 'sx'
  | 'disabled'
  | 'autoFocus'
  | 'multiline'
  | 'rows'
  | 'onFocus'
  | 'label'
> &
  Pick<InputProps, 'inputComponent'>

const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) =>
    prop !== 'inputVariant' && prop !== 'textAlign' && prop !== 'colorVariant',
})<
  Pick<
    InputFieldProps,
    'inputVariant' | 'disabled' | 'textAlign' | 'colorVariant'
  >
>(
  ({
    theme,
    inputVariant = 'medium',
    disabled,
    textAlign,
    colorVariant = 'paper',
  }) => ({
    backgroundColor: {
      default: theme.palette.background.default,
      paper: theme.palette.background.paper,
    }[colorVariant],
    opacity: 0.6,
    '& .MuiInput-root': {
      padding: `${theme.spacing(4)} ${theme.spacing(6)}`,
      input: {
        padding: 0,
        ...theme.typography.body1,
        fontSize: inputVariant === 'large' ? '2.25rem' : undefined, // 36px
        lineHeight: inputVariant === 'large' ? '2.7rem' : undefined, // 43.2px
        textAlign: textAlign || (inputVariant === 'large' ? 'center' : 'left'),
      },
    },
    '& .MuiOutlinedInput-root': {
      fieldset: {
        borderRadius: 0,
        borderWidth: disabled ? 0 : '1px',
        borderColor: theme.palette.background.default,
      },
    },
    'input::-webkit-outer-spin-button,input::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
    // for firefox
    "input[type='number']": {
      MozAppearance: 'textfield',
    },
    '.MuiInputBase-input .Mui-disabled': {
      color: theme.palette.text.secondary,
      WebkitTextFillColor: theme.palette.text.primary,
    },
  }),
)

export const InputField = forwardRef(
  (
    {
      startAdornment,
      endAdornment,
      sx,
      inputComponent,
      enableClear,
      onClear,
      muiVariant,
      ...otherProps
    }: InputFieldProps,
    ref,
  ) => (
    <StyledTextField
      {...otherProps}
      inputRef={ref}
      fullWidth
      variant={muiVariant}
      InputProps={{
        startAdornment: startAdornment && (
          <InputAdornment position="start" sx={{mr: 4}}>
            {startAdornment}
          </InputAdornment>
        ),
        endAdornment: (endAdornment || enableClear) && (
          <Stack direction="row" alignItems="center" spacing={4} ml={2}>
            {endAdornment && (
              <InputAdornment position="end">{endAdornment}</InputAdornment>
            )}
            {enableClear && (
              <IconButton
                icon={<HighlightOffOutlinedIcon fontSize="small" />}
                hasFontIcon
                onClick={onClear}
                sx={({palette}) => ({p: 0, color: palette.text.secondary})}
              />
            )}
          </Stack>
        ),
        inputComponent,
      }}
      InputLabelProps={{shrink: false}}
      sx={combineSx(
        ({palette}) => ({
          opacity: 1,
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: palette.border.annotation,
            },
            fieldset: {
              borderRadius: 0,
              borderColor: palette.border.default,
            },
            '&.Mui-focused fieldset': {
              borderRadius: 0,
              borderWidth: '1px',
              borderColor: palette.border.annotation,
            },
          },
        }),
        sx,
      )}
    />
  ),
)
