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

## Frontend components

Frontend integration testing is performed using [`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro/). Components are rendered on a virtual screen, and tests verify whether the screen contains the expected elements.

### NFT image preview component

[Test definition](../test/app/upload-images/NFTImagePreview.spec.tsx)

Tests the `NFTImagePreview` component, which renders the NFT image. The following scenarios are tested:

- Rendering an image by a URL
- Rendering an image from file content
- Rendering an image with a remove button

### NFT display component

[Test definition](../test/app/mint/NFTDisplay.spec.tsx)

Tests the `NFTDisplay` component, which shows NFT metadata. The following scenarios are tested:

- Rendering NFT image with correct attributes
- Displaying all NFT metadata fields (name, asset name, description)
- Handling empty description with placeholder
- Displaying correct field labels

### NFT data input component

[Test definition](../test/app/nfts-data/NFTDataInput.spec.tsx)

Tests the `NFTDataInput` component, which handles NFT metadata input. The following scenarios are tested:

- Rendering all form fields
- Displaying NFT image preview
- Showing validation errors
- Handling NFT deletion with confirmation

### Collection validation component

[Test definition](../test/app/nfts-data/CollectionValidation.spec.tsx)

Tests the validation of NFT collections, specifically:

- Detecting duplicate asset names
- Handling form submission states
- Empty collection validation

### Wallet connection

[Test definition](../test/app/connect-wallet/page.spec.tsx)

Tests the wallet connection page functionality:

- Displaying available wallets
- Handling wallet connection
- Displaying connected wallet info
- Error handling during connection

### Wallet reconnection

[Test definition](../test/app/connect-wallet/ReconnectWallet.spec.tsx)

Tests the automatic wallet reconnection logic:

- Attempting to reconnect existing wallet
- Handling connection errors
- State management during reconnection

### Upload images page

[Test definition](../test/app/upload-images/page.spec.tsx)

Tests the `UploadImagesPage` component, which handles file uploads to IPFS. The following scenarios are tested:

- Successful upload with image preview display
- Error when the uploaded file is too large
- Error when the uploaded file is not an image

### Mint page

[Test definition](../test/app/mint/page.spec.tsx)

Tests the NFT minting page functionality:

- Rendering collection data
- Displaying NFT information
- Handling transaction building
- Fee display

## Helpers

### File helpers

[Test definition](../test/helpers/file.spec.ts)

Tests file-related helper functions:

- Validating image MIME types
- File size calculations

### Number formatting

[Test definition](../test/helpers/formatNumber.spec.ts)

Tests number formatting utilities:

- Formatting with decimals
- Adding prefixes and suffixes
- Handling special cases (infinity, zero)

### Asset quantity formatting

[Test definition](../test/helpers/formatAssetQuantity.spec.ts)

Tests asset quantity formatting:

- Formatting with different decimal places
- Adding currency symbols and tickers
- Handling various formatting options

### Collection ID handling

[Test definition](../test/helpers/collectionId.spec.ts)

Tests collection ID encoding/decoding:

- Encoding with mint end date
- Encoding without mint end date
- Decoding collection IDs

### Short label generation

[Test definition](../test/helpers/shortLabel.spec.ts)

Tests the short label generation utility:

- Truncating long strings
- Handling edge cases
- Adding ellipsis

## Transaction building

### Mint transaction

[Test definition](../test/app/mint/buildTx.spec.ts)

Tests NFT minting transaction building:

- Building valid mint transactions
- Handling minting end dates
- Error cases for insufficient funds

### Set collateral transaction

[Test definition](../test/app/connect-wallet/buildSetCollateralTx.spec.ts)

Tests collateral setting transaction:

- Building and submitting transactions
- Handling insufficient funds
- Error cases

## CBOR encoding

### CBOR arrays

[Test definition for definite-length arrays](../test/cborize/CborDefiniteLengthArray.spec.ts)

[Test definition for indefinite-length arrays](../test/cborize/CborIndefiniteLengthArray.spec.ts)

Tests CBOR array encoding:

- Encoding empty arrays
- Encoding arrays with various data types
- Handling definite and indefinite length arrays

### CBOR utilities

[Test definition](../test/cborize/cborize.spec.ts)

Tests CBOR encoding utilities:

- Encoding optional values
- Encoding hex strings
- Handling edge cases
