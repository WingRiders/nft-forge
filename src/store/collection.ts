import {uniqBy} from 'lodash'
import {create} from 'zustand'

export type NFTData = {
  imageIpfsCid: string
  imageMimeType: string
  name: string
  assetNameUtf8: string
  description?: string
}

type CollectionState = {
  website?: string
  nftsData: NFTData[]
  submitCommonData: (data: {website: string}) => void
  setNFTsData: (data: NFTData[], append?: boolean) => void
}

export const useCollectionStore = create<CollectionState>()((set) => ({
  website: undefined,
  nftsData: [],
  submitCommonData: (commonData) => set(commonData),
  setNFTsData: (nftsData, append = false) =>
    set((state) => ({
      nftsData: append
        ? uniqBy([...state.nftsData, ...nftsData], (i) => i.imageIpfsCid)
        : nftsData,
    })),
}))
