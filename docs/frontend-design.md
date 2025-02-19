## Frontend UI/UX design

This document presents the design of the NFT Forge web application in it current state.

## Connect wallet

The first screen in the minting process will prompt users to connect their wallet. Currently, users can connected these Cardano wallets:

- Eternl
- NuFi
- Lace
- Typhon

More wallet options will be implemented in the future.

![Connect wallet](./assets/design-sketches/connect-wallet.png)

After you successfully connect your wallet, the app will display your address and a `CONTINUE` button:

![Wallet connected](./assets/design-sketches/wallet-connected.png)

If there is an error while connecting to the selected wallet, the app will display it:

![Connect wallet error](assets/design-sketches/connect-wallet-error.png)

## Upload NFT images

The next step is to upload images for your NFTs. You can either drag and drop the files into the designated area or click to upload them manually using the file explorer.

The filenames will initially be used as the names of your NFTs, but you can override them later in the process.

![Upload images](./assets/design-sketches/upload-images.png)

After you add your images, the app will display them and you can click the `UPLOAD` button to upload them to the IPFS storage:

![Images to the uploaded](./assets/design-sketches/images-to-be-uploaded.png)

After the images are uploaded successfully, the app will display them:

![Images uploaded](./assets/design-sketches/images-uploaded.png)

### Error handling

There are multiple different errors that can happen during file upload. The application will handle them and display a meaningful error message to the user.

- Error if the uploaded file is not an image:
  ![Not an image](assets/design-sketches/image-upload-not-an-image-error.png)
- Error during backend validation. If the user changes the file extension to e.g. `.png`, but the file is not an image, the backend validation will fail:
  ![Not an image](assets/design-sketches/image-upload-not-an-image-backend-error.png)
- Error if the uploaded file is too large:
  ![Image too large](assets/design-sketches/image-upload-too-large-error.png)
