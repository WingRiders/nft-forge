# NFT Forge

NFT metadata editor and minting tool for Cardano, enabling bulk NFT creation, metadata customization & integrity checks and seamless IPFS image upload.

Smart contracts can be found in https://github.com/WingRiders/minter-aiken.

## Architecture

Architecture of the project can be found in the [architecture.md](./docs/architecture.md) document.

## Roadmap

- [x] Backend support for IPFS image upload
- [x] Frontend application for minting NFTs
- [x] Metadata verification

## Development

### Bun

This project uses [Bun](https://bun.sh/) as the package manager and as the runtime. If you don't have Bun installed, you can follow the installation guide on their website.

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

You can find more information about tests in [tests.md](./docs/tests.md).
