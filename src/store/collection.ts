import {keyBy, mapValues, omit, omitBy} from 'lodash'
import {v4 as uuidV4} from 'uuid'
import {create} from 'zustand'
import {persist} from 'zustand/middleware'

export enum CollectionStateStep {
  COLLECTION_DATA = 0,
  UPLOAD_IMAGES = 1,
  NFTS_DATA = 2,
}

export type NFTData = {
  id: string // only for React purposes
  imageIpfsCid: string
  imageMimeType: string
  name: string
  assetNameUtf8: string
  description?: string
  customFields?: {
    [customFieldName: string]: string | undefined
  }
}

export type CustomFieldDef = {
  name: string
  isRequired: boolean
}

export type CollectionState = {
  lastSubmittedStep?: CollectionStateStep
  existingCollectionId?: string
  uuid?: string
  website?: string
  mintEndDate?: number
  nftsData?: Record<string, NFTData>
  isRehydrated?: boolean
  customFieldsDefs?: CustomFieldDef[]

  setCollectionData: (data: {
    existingCollectionId?: string
    uuid?: string
    website?: string
    mintEndDate?: number
    customFieldsDefs?: CustomFieldDef[]
  }) => void
  addNewNFTsData: (nftsData: NFTData[]) => void
  setNFTsData: (data: Record<string, NFTData>) => void
  deleteNFT: (id: string) => void
  reset: () => void
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      setCollectionData: ({uuid: newUuid, customFieldsDefs, ...commonData}) => {
        const existingNFTsData = get().nftsData
        return set(
          ({
            uuid: existingUuid,
            lastSubmittedStep: existingLastSubmittedStep,
          }) => ({
            ...commonData,
            // if the uuid is already set, use it, otherwise generate a new one
            uuid: newUuid ?? existingUuid ?? uuidV4(),
            lastSubmittedStep: Math.max(
              existingLastSubmittedStep ?? 0,
              CollectionStateStep.COLLECTION_DATA,
            ),
            customFieldsDefs,
            nftsData: !existingNFTsData
              ? undefined
              : !customFieldsDefs
                ? existingNFTsData
                : mapValues(existingNFTsData, (nftData) => ({
                    ...nftData,
                    customFields: !nftData.customFields
                      ? undefined
                      : // remove custom fields from the NFT data that are not in the custom fields defs of the collection
                        omitBy(
                          nftData.customFields,
                          (_value, key) =>
                            !customFieldsDefs.some(
                              (field) => field.name === key,
                            ),
                        ),
                  })),
          }),
        )
      },
      addNewNFTsData: (nftsData) =>
        set(
          ({
            nftsData: existingNFTsData,
            lastSubmittedStep: existingLastSubmittedStep,
          }) => ({
            nftsData: {
              ...(existingNFTsData ?? {}),
              ...keyBy(nftsData, (nft) => nft.id),
            },
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
      deleteNFT: (id) =>
        set(({nftsData: existingNFTsData}) => {
          if (!existingNFTsData) return {}

          const newNftsData = omit(existingNFTsData, id)

          return {
            nftsData: newNftsData,
            ...(Object.keys(newNftsData).length === 0
              ? {
                  lastSubmittedStep: CollectionStateStep.COLLECTION_DATA,
                }
              : {}),
          }
        }),
      reset: () =>
        set({
          lastSubmittedStep: undefined,
          existingCollectionId: undefined,
          uuid: undefined,
          website: undefined,
          mintEndDate: undefined,
          nftsData: undefined,
          customFieldsDefs: undefined,
        }),
    }),
    {
      name: 'collection',
      onRehydrateStorage: () => {
        return (state) => {
          if (state) state.isRehydrated = true
        }
      },
      partialize: (state) => omit(state, 'isRehydrated'),
    },
  ),
)
