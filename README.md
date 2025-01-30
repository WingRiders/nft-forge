# NFT Forge

NFT metadata editor and minting tool for Cardano, enabling bulk NFT creation, metadata customization & integrity checks and seamless IPFS image upload.

## Architecture

Architecture of the project can be found in the [architecture.md](./docs/architecture.md) document.

## Roadmap

- [x] Backend support for IPFS image upload
- [ ] Frontend application for minting NFTs
- [ ] Metadata verification

## Development

### Bun

This project uses [Bun](https://bun.sh/) as the package manager and as the runtime (expect for running tests). If you don't have Bun installed, you can follow the installation guide on their website.

### Node.js

This project uses [Node.js](https://nodejs.org/) as the runtime for tests. Bun cannot be used as the test runtime due to issues with constructing mocked HTTP requests containing form data and using them to test endpoints.

We recommend using [`nvm` (Node Version Manager)](https://github.com/nvm-sh/nvm) to manage your Node.js versions efficiently.

Version of Node.js that this repository uses is in `.nvmrc` file. Run:

```sh
nvm install
nvm use
```

### Environment variables

Make sure you have correct environment variables set in `.env` (all required values are in `.env.example`). If you want to run the application with mocked IPFS service provider, you can copy the example environment variables:

```
cp .env.example .env
```

For using your own IPFS, you need to setup an IPFS provider and set connection to it in the environment variables. You can find more information about the configuration of the IPFS service provider in [Connecting to the IPFS service provider](./docs/architecture.md#connecting-to-the-ipfs-service-provider).

### Installing dependencies

```
bun install
```

### Running the application

```
bun run dev
```

### Running tests

```
npm run test
```
