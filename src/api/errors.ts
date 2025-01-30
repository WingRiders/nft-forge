export const IPFS_UPLOAD_ERRORS = {
  INVALID_FORM_DATA: 'Invalid form data',
  FILE_NOT_PROVIDED: 'File not provided',
  INVALID_FILE: 'Invalid file',
  FILE_SIZE_EXCEEDS_LIMIT: (limit: number) =>
    `File size exceeds ${limit} MB limit`,
  INVALID_FILE_TYPE: 'Invalid file type (only images are supported)',
  FAILED_TO_UPLOAD_FILE: 'Failed to upload file',
}
