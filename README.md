# NFT Forge

NFT metadata editor and minting tool for Cardano, enabling bulk NFT creation, metadata customization & integrity checks and seamless IPFS image upload.

## Architecture

Architecture of the project can be found in the [architecture.md](./docs/architecture.md) document.

## Roadmap

- [x] Backend support for IPFS image upload
- [ ] Frontend application for minting NFTs
- [ ] Metadata verification

## Development

This project uses [Bun](https://bun.sh/). If you don't have Bun installed, you can follow the installation guide on their website.

### Environment variables

Make sure you have correct environment variables set in `.env` (all required values are in `.env.example`). If you want to run the application without the IPFS functionality, you can copy the example environment variables:

```
cp .env.example .env
```

For using the IPFS, you need to setup an IPFS provider and set connection to it in the environment variables.

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
bun run test
```
