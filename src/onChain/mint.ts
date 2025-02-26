import {encode} from 'borc'
import {cborizeMaybe, encodeCbor} from '../cborize/cborize'

const UNAPPLIED_MINTER_SCRIPT =
  '5901010101003232323232322322322253330073232323232533300c3370e900018069baa00113232533300e3233001001375860266028602860286028602860286028602860226ea8018894ccc04c00452809991299980919b8f00200e14a22660080080026eb8c050004c0540044004528299980699b8748000c038dd500409919299980799b8748008c040dd5000899b88375a602660226ea800400858c048c040dd51809180998081baa301230133013301330133013301330133010375400a6eb4c044c03cdd50040a51375c6020601c6ea800458c03cc04000cc038008c034008c034004c024dd50008a4c26cac6eb8004dd7000ab9a5573aaae7955cfaba15745'

export type MinterScriptParams = {
  collectionIdHex: string
  authorityKeyHex: string
  endDate?: number
}

export const applyParamsToMinterScript = async ({
  collectionIdHex,
  authorityKeyHex,
  endDate,
}: MinterScriptParams) => {
  const paramsEncoded = encode([
    Buffer.from(collectionIdHex, 'hex'),
    Buffer.from(authorityKeyHex, 'hex'),
    cborizeMaybe(endDate),
  ])

  const {applyParamsToScript} = await import(
    '@wingriders/apply-params-to-script'
  )
  const appliedScript = await applyParamsToScript(
    paramsEncoded,
    Buffer.from(UNAPPLIED_MINTER_SCRIPT, 'hex'),
  )

  return encodeCbor(Buffer.from(appliedScript).toString('hex'))
}
