import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Stack,
} from '@mui/material'
import type {SetRequired} from 'type-fest'
import {TextButton} from '../../components/Buttons/TextButton'
import {Paragraph} from '../../components/Typography/Paragraph'
import {CardanoscanLinks} from '../../helpers/explorerLinks'
import type {SignAndSubmitTxResult} from '../../helpers/transaction'
import {useConnectedWalletStore} from '../../store/connectedWallet'
import type {BuildMintTxResult} from './buildTx'

type MintSuccessModalProps = {
  buildMintTxResult?: BuildMintTxResult
  signAndSubmitData?: SignAndSubmitTxResult
  onClose?: () => void
}

export const MintSuccessModal = ({
  buildMintTxResult,
  signAndSubmitData,
  onClose,
}: MintSuccessModalProps) => {
  return (
    <Dialog open={!!signAndSubmitData} onClose={onClose}>
      {signAndSubmitData && buildMintTxResult && (
        <>
          <DialogTitle>NFTs minted successfully</DialogTitle>
          <MintSuccessModalContent
            buildMintTxResult={buildMintTxResult}
            signAndSubmitData={signAndSubmitData}
            onClose={onClose}
          />
        </>
      )}
    </Dialog>
  )
}

const MintSuccessModalContent = ({
  buildMintTxResult,
  signAndSubmitData,
  onClose,
}: SetRequired<
  MintSuccessModalProps,
  'signAndSubmitData' | 'buildMintTxResult'
>) => {
  const network = useConnectedWalletStore((c) => c.connectedWallet?.network)
  if (!network) {
    throw new Error('Network not found')
  }
  const explorerLinks = new CardanoscanLinks(network)

  return (
    <>
      <DialogContent>
        <Stack spacing={2}>
          <Paragraph>
            Your NFTs were minted successfully in{' '}
            <Link
              href={explorerLinks.transaction(signAndSubmitData.txHash)}
              target="_blank"
              rel="noopener noreferrer"
            >
              this transaction
            </Link>
            .
          </Paragraph>
          <Paragraph>
            You can see your NFT collection{' '}
            <Link
              href={explorerLinks.policy(buildMintTxResult.policyId)}
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </Link>
            .
          </Paragraph>
        </Stack>
      </DialogContent>
      <DialogActions>
        <TextButton onClick={onClose}>Close</TextButton>
      </DialogActions>
    </>
  )
}
