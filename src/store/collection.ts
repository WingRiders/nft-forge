import {uniqBy} from 'lodash'
import {v4 as uuidV4} from 'uuid'
import {create} from 'zustand'
import {persist} from 'zustand/middleware'

export enum CollectionStateStep {
  COLLECTION_DATA = 0,
  UPLOAD_IMAGES = 1,
  NFTS_DATA = 2,
}

export type NFTData = {
  imageIpfsCid: string
  imageMimeType: string
  name: string
  assetNameUtf8: string
  description?: string
}

export type CollectionState = {
  lastSubmittedStep?: CollectionStateStep
  uuid?: string
  website?: string
  mintEndDate?: number
  nftsData?: NFTData[]
  isRehydrated?: boolean

  setCollectionData: (data: {website: string; mintEndDate?: number}) => void
  addNewNFTsData: (nftsData: NFTData[]) => void
  setNFTsData: (data: NFTData[]) => void
  reset: () => void
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set) => ({
      setCollectionData: (commonData) => {
        return set(
          ({
            uuid: existingUuid,
            lastSubmittedStep: existingLastSubmittedStep,
          }) => ({
            ...commonData,
            // if the uuid is already set, use it, otherwise generate a new one
            uuid: existingUuid ?? uuidV4(),
            lastSubmittedStep: Math.max(
              existingLastSubmittedStep ?? 0,
              CollectionStateStep.COLLECTION_DATA,
            ),
          }),
        )
      },
      addNewNFTsData: (nftsData) =>
        set(
          ({
            nftsData: existingNFTsData,
            lastSubmittedStep: existingLastSubmittedStep,
          }) => ({
            nftsData: uniqBy(
              [...(existingNFTsData ?? []), ...nftsData],
              (i) => i.imageIpfsCid,
            ),
            lastSubmittedStep: Math.max(
              existingLastSubmittedStep ?? 0,
              CollectionStateStep.UPLOAD_IMAGES,
            ),
          }),
        ),
      setNFTsData: (nftsData) =>
        set(({lastSubmittedStep: existingLastSubmittedStep}) => ({
          nftsData: nftsData,
          lastSubmittedStep: Math.max(
            existingLastSubmittedStep ?? 0,
            CollectionStateStep.NFTS_DATA,
          ),
        })),
      reset: () =>
        set({
          lastSubmittedStep: undefined,
          uuid: undefined,
          website: undefined,
          mintEndDate: undefined,
          nftsData: [],
        }),
    }),
    {
      name: 'collection',
      onRehydrateStorage: () => {
        return (state) => {
          if (state) state.isRehydrated = true
        }
      },
    },
  ),
)
