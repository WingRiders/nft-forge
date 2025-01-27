'use client'

import {Box, Grid2, Stack} from '@mui/material'

import {useMutation} from '@tanstack/react-query'
import {uniqBy} from 'lodash'
import {useState} from 'react'
import Dropzone, {type DropzoneProps, type FileRejection} from 'react-dropzone'
import {Button} from '../../components/Buttons/Button'
import {Page} from '../../components/Page'
import {Paper} from '../../components/Paper'
import {Label} from '../../components/Typography/Label'
import {Paragraph} from '../../components/Typography/Paragraph'
import {ipfsCidToHttps} from '../../helpers/ipfs'
import {uploadFiles} from '../../query/ipfs'
import {NFTImagePreview} from './NFTImagePreview'

const MAX_FILE_SIZE_MB = 5

export const UploadFiles = () => {
  const [filesToUpload, setFilesToUpload] = useState<File[]>([])
  const [dropErrors, setDropErrors] = useState<FileRejection[]>([])

  const {
    mutateAsync: upload,
    data: uploadedFiles,
    isPending: isLoadingUpload,
    reset: resetUploadMutation,
  } = useMutation({mutationFn: uploadFiles})

  const handleFilesDrop: DropzoneProps['onDrop'] = (
    acceptedFiles,
    fileRejection,
  ) => {
    setDropErrors(fileRejection)
    setFilesToUpload((existingFiles) =>
      uniqBy([...existingFiles, ...acceptedFiles], (file) => file.name),
    )
    resetUploadMutation()
  }

  const handleFilesUpload = async () => {
    await upload(filesToUpload)
    setFilesToUpload([])
  }

  return (
    <Page>
      <Paper title="Upload Files">
        <Paragraph variant="long">
          Upload images for your NFTs. Each image has to have a unique name.
          <br />
          Names of the images will be used as the names of the minted NFTs (you
          can override them later).
          <br />
          Maximum size of one image is {MAX_FILE_SIZE_MB}MB.
        </Paragraph>

        <Box mt={5}>
          <Dropzone
            onDrop={handleFilesDrop}
            accept={{
              'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
            }}
            maxSize={MAX_FILE_SIZE_MB * 1024 * 1024}
          >
            {({getRootProps, getInputProps, isDragActive}) => (
              <Box
                {...getRootProps()}
                width="100%"
                sx={({palette}) => ({
                  bgcolor: palette.background.paper,
                  cursor: 'pointer',
                  border: `5px dashed ${isDragActive ? palette.border.faint : palette.border.glass}`,
                  boxSizing: 'border-box',
                })}
                px={2}
                py={1}
                minHeight={150}
                display="flex"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
              >
                <input {...getInputProps()} />
                <Label variant="large">
                  {isDragActive
                    ? 'Release to drop files'
                    : 'Drag and drop files here, or click to select files'}
                </Label>
              </Box>
            )}
          </Dropzone>

          {dropErrors.length > 0 && (
            <Stack
              mt={3}
              spacing={4}
              bgcolor={({palette}) => palette.background.paper}
              p={4}
            >
              <Label variant="large">Errors:</Label>
              {dropErrors.map((error) => (
                <Stack key={error.file.name} spacing={1}>
                  <Label variant="large">{error.file.name}:</Label>
                  <ul>
                    {error.errors.map((error) => (
                      <Label
                        key={error.code}
                        sx={({palette}) => ({color: palette.error.main})}
                        variant="large"
                        component="li"
                      >
                        {error.message}
                      </Label>
                    ))}
                  </ul>
                </Stack>
              ))}
            </Stack>
          )}

          {filesToUpload.length > 0 && (
            <Stack
              mt={3}
              spacing={2}
              bgcolor={({palette}) => palette.background.paper}
              p={4}
            >
              <Label variant="large">Files to be uploaded:</Label>
              <Grid2 container spacing={4}>
                {filesToUpload.map((file) => (
                  <Grid2 key={file.name} size={4}>
                    <NFTImagePreview
                      image={file}
                      name={file.name}
                      showRemoveButton
                      onRemove={() =>
                        setFilesToUpload((existingFiles) =>
                          existingFiles.filter((f) => f.name !== file.name),
                        )
                      }
                    />
                  </Grid2>
                ))}
              </Grid2>
            </Stack>
          )}
        </Box>

        {filesToUpload.length > 0 && (
          <Button
            onClick={handleFilesUpload}
            fullWidth
            sx={{mt: 5}}
            disabled={isLoadingUpload}
            loading={isLoadingUpload && 'inline'}
          >
            Upload
          </Button>
        )}

        {uploadedFiles && uploadedFiles.length > 0 && (
          <Stack
            mt={3}
            spacing={2}
            bgcolor={({palette}) => palette.background.paper}
            p={4}
          >
            <Label variant="large">Uploaded files:</Label>
            <Grid2 container spacing={4}>
              {uploadedFiles.map(({cid, name}) => (
                <Grid2 key={cid} size={4}>
                  <NFTImagePreview image={ipfsCidToHttps(cid)} name={name} />
                </Grid2>
              ))}
            </Grid2>
          </Stack>
        )}
      </Paper>
    </Page>
  )
}
