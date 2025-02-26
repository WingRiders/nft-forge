'use client'

import {Alert, Box, Grid2, Stack} from '@mui/material'
import {useMutation} from '@tanstack/react-query'
import {AxiosError} from 'axios'
import {uniqBy} from 'lodash'
import {useState} from 'react'
import Dropzone, {type DropzoneProps, type FileRejection} from 'react-dropzone'
import {useShallow} from 'zustand/shallow'
import {Button} from '../../components/Buttons/Button'
import {MintStepper} from '../../components/MintStepper'
import {Page} from '../../components/Page'
import {Paper} from '../../components/Paper'
import {Label} from '../../components/Typography/Label'
import {Paragraph} from '../../components/Typography/Paragraph'
import {MAX_FILE_SIZE_MB} from '../../constants'
import {mbToBytes} from '../../helpers/file'
import {ipfsCidToHttps} from '../../helpers/ipfs'
import {uploadFiles} from '../../query/ipfs'
import {useCollectionStore} from '../../store/collection'
import {MintStep} from '../../types'
import {NFTImagePreview} from './NFTImagePreview'

const UploadImagesPage = () => {
  const {nftsData, setNFTsData} = useCollectionStore(
    useShallow(({nftsData, setNFTsData}) => ({nftsData, setNFTsData})),
  )

  const [imagesToUpload, setImagesToUpload] = useState<File[]>([])
  const [dropErrors, setDropErrors] = useState<FileRejection[]>([])

  const {
    mutateAsync: uploadImages,
    error: uploadError,
    isPending: isUploading,
    reset: resetUploadMutation,
  } = useMutation({mutationFn: uploadFiles})

  const handleFilesDrop: DropzoneProps['onDrop'] = (
    acceptedFiles,
    fileRejection,
  ) => {
    setDropErrors(fileRejection)
    setImagesToUpload((existingFiles) =>
      uniqBy([...existingFiles, ...acceptedFiles], (file) => file.name),
    )
    resetUploadMutation()
  }

  const handleUploadClick = async () => {
    const uploadedImages = await uploadImages(imagesToUpload)
    setImagesToUpload([])

    setNFTsData(
      uploadedImages.map(({cid, name, mimeType}) => {
        const nameWithoutExtension = name.split('.').slice(0, -1).join('.')
        return {
          imageIpfsCid: cid,
          imageMimeType: mimeType,
          name: nameWithoutExtension,
          assetNameUtf8: nameWithoutExtension,
        }
      }),
      true,
    )
  }

  return (
    <Page>
      <MintStepper step={MintStep.UPLOAD_IMAGES} sx={{mt: 3, mb: 5}} />

      <Paper title="Upload images">
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
            maxSize={mbToBytes(MAX_FILE_SIZE_MB)}
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
                    ? 'Release to drop images'
                    : 'Drag and drop images here, or click to select files'}
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

          {imagesToUpload.length > 0 && (
            <Stack
              mt={3}
              spacing={2}
              bgcolor={({palette}) => palette.background.paper}
              p={4}
            >
              <Label variant="large">Images to be uploaded:</Label>
              <Grid2 container spacing={4}>
                {imagesToUpload.map((file) => (
                  <Grid2 key={file.name} size={4}>
                    <NFTImagePreview
                      image={file}
                      name={file.name}
                      showRemoveButton
                      onRemove={() =>
                        setImagesToUpload((existingFiles) =>
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

        {uploadError && (
          <Alert severity="error" sx={{mt: 5}}>
            Error while uploading images:{' '}
            {uploadError instanceof AxiosError
              ? uploadError.response?.data.error
              : uploadError.message}
          </Alert>
        )}

        {imagesToUpload.length > 0 && (
          <Button
            onClick={handleUploadClick}
            fullWidth
            sx={{mt: 5}}
            disabled={isUploading}
            loading={isUploading && 'inline'}
          >
            Upload
          </Button>
        )}

        {nftsData.length > 0 && (
          <Stack mt={3}>
            <Stack
              spacing={2}
              bgcolor={({palette}) => palette.background.paper}
              p={4}
            >
              <Label
                variant="large"
                sx={({palette}) => ({color: palette.success.main})}
              >
                Images uploaded successfully
              </Label>
              <Grid2 container spacing={4}>
                {nftsData.map(({imageIpfsCid, name}) => (
                  <Grid2 key={imageIpfsCid} size={4}>
                    <NFTImagePreview
                      image={ipfsCidToHttps(imageIpfsCid)}
                      cid={imageIpfsCid}
                      name={name}
                    />
                  </Grid2>
                ))}
              </Grid2>
            </Stack>

            {imagesToUpload.length === 0 && (
              <Stack alignItems="flex-end" mt={5}>
                <Button linkTo="/nfts-data">Continue</Button>
              </Stack>
            )}
          </Stack>
        )}
      </Paper>
    </Page>
  )
}

export default UploadImagesPage
