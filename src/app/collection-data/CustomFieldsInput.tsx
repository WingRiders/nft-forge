import {stringToHex} from '@meshsdk/core'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import {Box, Button, FormControlLabel, Stack, Switch} from '@mui/material'
import {
  type Control,
  type UseFormRegister,
  useFieldArray,
  useFormState,
} from 'react-hook-form'
import {IconButton} from '../../components/Buttons/IconButton'
import {FormField} from '../../components/FormField'
import {InputField} from '../../components/InputField'
import {Paragraph} from '../../components/Typography/Paragraph'
import {getErrorMessage} from '../../helpers/forms'
import type {CollectionDataInputs} from './page'

const RESERVED_FIELDS_NAMES = [
  'name',
  'description',
  'Website',
  'image',
  'mediaType',
]

const FIELD_NAME_REGEX = /^[a-zA-Z0-9 _:-]+$/

const MAX_FIELD_NAME_HEX_LENGTH = 64

type CustomFieldsInputProps = {
  control: Control<CollectionDataInputs>
  register: UseFormRegister<CollectionDataInputs>
}

export const CustomFieldsInput = ({
  control,
  register,
}: CustomFieldsInputProps) => {
  const {errors} = useFormState({control, name: 'customFieldsDefs'})
  const {fields, append, remove} = useFieldArray({
    control,
    name: 'customFieldsDefs',
    rules: {
      validate: (value) => {
        if (new Set(value.map((field) => field.name)).size !== value.length) {
          return 'Field names must be unique.'
        }
        return undefined
      },
    },
  })

  const handleAddCustomField = () => {
    append({name: '', isRequired: false})
  }

  return (
    <Box>
      <FormField
        label="Custom metadata fields"
        tooltip="Add names of the custom fields that you want to add to your NFTs metadata. You will fill values for these fields later."
        error={getErrorMessage(errors.customFieldsDefs?.root)}
        isOptional
      >
        <Stack spacing={2}>
          {fields.length > 0 ? (
            fields.map((field, index) => (
              <Stack
                key={field.id}
                spacing={1}
                bgcolor={({palette}) => palette.background.dark}
                p={3}
              >
                <FormField
                  label="Field name"
                  error={getErrorMessage(
                    errors?.customFieldsDefs?.[index]?.name,
                  )}
                  tooltip="Enter the name of your field."
                >
                  <InputField
                    {...register(`customFieldsDefs.${index}.name`, {
                      required: true,
                      validate: (value) => {
                        if (RESERVED_FIELDS_NAMES.includes(value)) {
                          return 'This field name is reserved, please choose another name.'
                        }
                        if (
                          stringToHex(value).length > MAX_FIELD_NAME_HEX_LENGTH
                        ) {
                          return `Field name is too long. When converted to a HEX string, it cannot be longer than ${MAX_FIELD_NAME_HEX_LENGTH} characters.`
                        }
                        if (!FIELD_NAME_REGEX.test(value)) {
                          return 'Field name can only contain letters, numbers, underscores, hyphens, colons, and spaces.'
                        }
                        return true
                      },
                    })}
                    placeholder="Enter field name"
                  />
                </FormField>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        {...register(`customFieldsDefs.${index}.isRequired`)}
                      />
                    }
                    label="This field will be required for each NFT"
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    onClick={() => remove(index)}
                  />
                </Stack>
              </Stack>
            ))
          ) : (
            <Paragraph>
              <i>No custom fields</i>
            </Paragraph>
          )}
        </Stack>
      </FormField>
      <Button
        size="small"
        onClick={handleAddCustomField}
        sx={{mt: 1}}
        startIcon={<AddIcon />}
      >
        Add new custom field
      </Button>
    </Box>
  )
}
