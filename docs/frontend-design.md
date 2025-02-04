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

## Upload NFT images

The next step is to upload images for your NFTs. You can either drag and drop the files into the designated area or click to upload them manually using the file explorer.

The filenames will initially be used as the names of your NFTs, but you can override them later in the process.

![Upload images](./assets/design-sketches/upload-images.png)

After you add your images, the app will display them and you can click the `UPLOAD` button to upload them to the IPFS storage:

![Images to the uploaded](./assets/design-sketches/images-to-be-uploaded.png)

After the images are uploaded successfully, the app will display them:

![Images uploaded](./assets/design-sketches/images-uploaded.png)
