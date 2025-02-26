import type {UTxO} from '@meshsdk/core'

export const ownerAddress =
  'addr_test1qp64l847kfudwexxpa23cw7gufc2kyjzrm7lssy2nr9mtekxylpxpd7rvk76cexrxmzyqxytyucugz0dzg5etcp8yr8shrsx6k'

export const adaOnlyUtxo5: UTxO = {
  input: {
    outputIndex: 0,
    txHash: 'b82027728c541c3e1e63ec7ce90c68ae82c92ce1a4e80714952584a082c77fd2',
  },
  output: {
    address: ownerAddress,
    amount: [{unit: 'lovelace', quantity: '5000000'}],
  },
}

export const adaOnlyUtxo10: UTxO = {
  input: {
    outputIndex: 0,
    txHash: 'b82027728c541c3e1e63ec7ce90c68ae82c92ce1a4e80714952584a082c77fd2',
  },
  output: {
    address: ownerAddress,
    amount: [{unit: 'lovelace', quantity: '10000000'}],
  },
}

export const adaAndTokenUtxo5: UTxO = {
  input: {
    outputIndex: 0,
    txHash: 'b82027728c541c3e1e63ec7ce90c68ae82c92ce1a4e80714952584a082c77fd2',
  },
  output: {
    address: ownerAddress,
    amount: [
      {unit: 'lovelace', quantity: '5000000'},
      {unit: 'wrt', quantity: '1000000'},
    ],
  },
}
