# NFT Forge automated tests

This repository contains tests for the core functionality of the project. Below is a brief description of the implemented tests.

Mocked data for all tests can be found [here](../test/fixtures).

## IPFS provider

### Pins

[Test definition](../test/ipfs/pins.spec.ts)

Mocks the `/pins` endpoint on the IPFS provider and verifies whether the returned data matches the mocked data.

### Upload

[Test definition](../test/ipfs/upload.spec.ts)

Mocks the `/upload` endpoint on the IPFS provider and verifies whether the returned data matches the mocked data.

## API endpoints

### Pins

[Test definition](../test/app/api/ipfs/pins/route.spec.ts)

Mocks the IPFS provider and verifies whether the endpoint resolver returns the expected mocked data.

### Upload

[Test definition](../test/app/api/ipfs/upload/route.spec.ts)

Mocks the IPFS provider and verifies whether the endpoint successfully uploads the file to the mocked IPFS. It tests the following scenarios:

- Successful upload
- Error when form data is missing
- Error when the file is missing
- Error when the provided file is not an image
- Error when the provided file is too large

## Helpers

### Is file image

[Test definition](../test/helpers/file.spec.ts)

Mocks the resolved value of the `fileTypeFromBlob` function and checks whether `isFileImage` returns the correct data.

## Frontend components

Frontend integration testing is performed using [`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro/). Components are rendered on a virtual screen, and tests verify whether the screen contains the expected elements.

### NFT image preview component

[Test definition](../test/mint/uploadFiles/NFTImagePreview.spec.tsx)

Tests the `NFTImagePreview` component, which renders the NFT image. The following scenarios are tested:

- Rendering an image by a URL
- Rendering an image from file content
- Rendering an image with a remove button

Each test case verifies the presence of a valid `<img />` tag with the correct `src` and `alt` attributes.

### IPFS upload component

[Test definition](../test/mint/uploadFiles/UploadImages.spec.tsx)

Mocks the backend API for IPFS upload and renders the file upload component. Then, it simulates user actions:

1. Uploading a file via the drag-and-drop area
2. Clicking the upload button
3. Verifying that `Images uploaded successfully` is displayed on the screen along with the uploaded image

The following scenarios are tested:

- Successful upload
- Error when the uploaded file is too large (expects an error message on the screen)
- Error when the uploaded file is not an image (expects an error message on the screen)
