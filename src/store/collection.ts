import {uniqBy} from 'lodash'
import {create} from 'zustand'

export type NFTData = {
  imageIpfsCid: string
  name: string
  description?: string
}

type CollectionState = {
  nftsData: NFTData[]
  setNFTsData: (data: NFTData[], append?: boolean) => void
}

export const useCollectionStore = create<CollectionState>()((set) => ({
  nftsData: [],
  setNFTsData: (nftsData, append = false) =>
    set((state) => ({
      nftsData: append
        ? uniqBy([...state.nftsData, ...nftsData], (i) => i.imageIpfsCid)
        : nftsData,
    })),
}))
