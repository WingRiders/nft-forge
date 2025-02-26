import type BigNumber from 'bignumber.js'
import {ADA_METADATA} from '../metadata/constants'
import type {AssetMetadata} from '../metadata/types'
import {formatBigNumber} from './formatNumber'

export type FormatAssetQuantityOptions = {
  showTicker?: boolean
  showSymbol?: boolean // show symbol if available
  extraDecimals?: number // additional decimals to show while formatting
  fixedDecimals?: true
  maxDecimals?: number
  useNonBreakingSpace?: boolean
}

export const getAssetQuantityFormatter = (metadata: AssetMetadata) => {
  const ticker = metadata.ticker ?? metadata.name
  const symbol = metadata.symbol ?? ticker
  const decimals = metadata.decimals ?? 0

  return (
    quantity: BigNumber,
    {
      showTicker = true,
      showSymbol,
      extraDecimals = 0,
      useNonBreakingSpace,
      fixedDecimals,
      maxDecimals,
    }: FormatAssetQuantityOptions = {},
  ) => {
    const realQuantity = quantity
      .shiftedBy(-decimals)
      .decimalPlaces(decimals + extraDecimals)
    const space = useNonBreakingSpace ? '\xa0' : ' '

    return `${formatBigNumber(realQuantity, {
      maxDecimals: maxDecimals ?? decimals + extraDecimals,
      fixedDecimals,
    })}${showTicker && ticker ? `${space}${ticker}` : ''}${showSymbol && symbol ? `${space}${symbol}` : ''}`
  }
}

export const formatAdaQuantity = getAssetQuantityFormatter(ADA_METADATA)
