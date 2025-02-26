import {uniqBy} from 'lodash'
import {v4 as uuidV4} from 'uuid'
import {create} from 'zustand'

export type NFTData = {
  imageIpfsCid: string
  imageMimeType: string
  name: string
  assetNameUtf8: string
  description?: string
}

export type CollectionState = {
  uuid?: string
  website?: string
  nftsData: NFTData[]
  submitCommonData: (data: {website: string}) => void
  setNFTsData: (data: NFTData[], append?: boolean) => void
  reset: () => void
}

export const useCollectionStore = create<CollectionState>()((set, get) => ({
  nftsData: [],
  submitCommonData: (commonData) => {
    const {uuid: existingUuid} = get()
    return set({
      ...commonData,
      // if the uuid is already set, use it, otherwise generate a new one
      uuid: existingUuid ?? uuidV4(),
    })
  },
  setNFTsData: (nftsData, append = false) =>
    set((state) => ({
      nftsData: append
        ? uniqBy([...state.nftsData, ...nftsData], (i) => i.imageIpfsCid)
        : nftsData,
    })),
  reset: () => set({nftsData: [], uuid: undefined, website: undefined}),
}))
