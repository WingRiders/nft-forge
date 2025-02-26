import type {BrowserWallet} from '@meshsdk/core'
import {describe, expect, test} from 'vitest'
import {buildMintTx} from '../../../src/app/mint/buildTx'
import {
  adaAndTokenUtxo5,
  adaOnlyUtxo5,
  adaOnlyUtxo10,
  ownerAddress,
} from '../../fixtures/data/wallet'
import {buildMockedWallet} from '../../fixtures/helpers/wallet'

describe('buildMintTx', async () => {
  test('should build a minting transaction', async () => {
    const mockedWallet = buildMockedWallet({
      utxos: [adaOnlyUtxo5, adaOnlyUtxo10],
      changeAddress: ownerAddress,
    })

    const tx = await buildMintTx({
      collection: {
        uuid: 'c2088bb0-d404-40a4-a09b-0cd3f3e59f5a',
        mintEndDate: 1809363892637,
        website: 'https://example.com',
        nftsData: {
          '1': {
            id: '1',
            assetNameUtf8: 'asset-name-1',
            imageIpfsCid: 'ipfs://1',
            imageMimeType: 'image/png',
            name: 'name 1',
            description: 'description 1',
          },
        },
      },
      wallet: mockedWallet as unknown as BrowserWallet,
      now: new Date(1709363892637),
    })
    expect(tx.builtTx).toEqual(
      '84a90081825820b82027728c541c3e1e63ec7ce90c68ae82c92ce1a4e80714952584a082c77fd200018182583900755f9ebeb278d764c60f551c3bc8e270ab12421efdf8408a98cbb5e6c627c260b7c365bdac64c336c440188b2731c409ed122995e02720cf821a00491f08a1581c3751d954648d592d70ac26281337eb228a18cc89cd2c801e41307f72a14c61737365742d6e616d652d3101021a00032c38031a0333213c07582016ca2eb8f5de1e516b438b9d9cdbb366e886753a3c34bdd6c6a0ca85412dbe0209a1581c3751d954648d592d70ac26281337eb228a18cc89cd2c801e41307f72a14c61737365742d6e616d652d31010b58208d7f090f5b7b99670136804e3abde6bbbe0bac89a85260fc49ea09db2f7cc20f0d81825820b82027728c541c3e1e63ec7ce90c68ae82c92ce1a4e80714952584a082c77fd2000e81581c755f9ebeb278d764c60f551c3bc8e270ab12421efdf8408a98cbb5e6a2058184010080821981e61a00a425f107815901635901600101003333232323232322322322253330073232323232533300c3370e900018069baa00113232533300e3233001001375860266028602860286028602860286028602860226ea8018894ccc04c00452809991299980919b8f00200e14a22660080080026eb8c050004c0540044004528299980699b8748000c038dd500409919299980799b8748008c040dd5000899b88375a602660226ea800400858c048c040dd51809180998081baa301230133013301330133013301330133010375400a6eb4c044c03cdd50040a51375c6020601c6ea800458c03cc04000cc038008c034008c034004c024dd50008a4c26cac6eb8004dd7000ab9a5573aaae7955cfaba1574498126582463323038386262302d643430342d343061342d613039622d306364336633653539663561004c011e581c755f9ebeb278d764c60f551c3bc8e270ab12421efdf8408a98cbb5e6004c010dd8799f1b000001a5467df99dff0001f5a11902d1a178383337353164393534363438643539326437306163323632383133333765623232386131386363383963643263383031653431333037663732a17818363137333733363537343264366536313664363532643331a5646e616d65666e616d6520316b6465736372697074696f6e6d6465736372697074696f6e203167576562736974657368747470733a2f2f6578616d706c652e636f6d65696d6167656f697066733a2f2f697066733a2f2f31696d656469615479706569696d6167652f706e67',
    )
    expect(tx.policyId).toEqual(
      '3751d954648d592d70ac26281337eb228a18cc89cd2c801e41307f72',
    )
    expect(tx.txFee.toString()).toEqual('207928')
  })

  test('should throw an error if the minting end date is in the past', async () => {
    const mockedWallet = buildMockedWallet({
      utxos: [adaOnlyUtxo5, adaOnlyUtxo10],
      changeAddress: ownerAddress,
    })

    const txPromise = buildMintTx({
      collection: {
        uuid: 'c2088bb0-d404-40a4-a09b-0cd3f3e59f5a',
        mintEndDate: 1709363892637,
        website: 'https://example.com',
        nftsData: {
          '1': {
            id: '1',
            assetNameUtf8: 'asset-name-1',
            imageIpfsCid: 'ipfs://1',
            imageMimeType: 'image/png',
            name: 'name 1',
            description: 'description 1',
          },
        },
      },
      wallet: mockedWallet as unknown as BrowserWallet,
      now: new Date(1809363892637),
    })
    await expect(txPromise).rejects.toThrow(
      'Cannot mint NFTs after the mint end date',
    )
  })

  test('should throw an error if there are no NFTs to mint', async () => {
    const mockedWallet = buildMockedWallet({
      utxos: [adaOnlyUtxo5, adaOnlyUtxo10],
      changeAddress: ownerAddress,
    })

    const txPromise = buildMintTx({
      collection: {
        uuid: 'c2088bb0-d404-40a4-a09b-0cd3f3e59f5a',
        mintEndDate: 1809363892637,
        website: 'https://example.com',
        nftsData: {},
      },
      wallet: mockedWallet as unknown as BrowserWallet,
      now: new Date(1709363892637),
    })
    await expect(txPromise).rejects.toThrow('No NFTs to mint')
  })

  test('should throw an error if there is no suitable collateral UTxO', async () => {
    const mockedWallet = buildMockedWallet({
      utxos: [adaAndTokenUtxo5],
      changeAddress: ownerAddress,
    })

    const txPromise = buildMintTx({
      collection: {
        uuid: 'c2088bb0-d404-40a4-a09b-0cd3f3e59f5a',
        mintEndDate: 1809363892637,
        website: 'https://example.com',
        nftsData: {
          '1': {
            id: '1',
            assetNameUtf8: 'asset-name-1',
            imageIpfsCid: 'ipfs://1',
            imageMimeType: 'image/png',
            name: 'name 1',
            description: 'description 1',
          },
        },
      },
      wallet: mockedWallet as unknown as BrowserWallet,
      now: new Date(1709363892637),
    })
    await expect(txPromise).rejects.toThrow('No collateral UTxO found')
  })
})
