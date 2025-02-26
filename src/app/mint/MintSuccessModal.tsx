import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Link,
  Stack,
} from '@mui/material'
import {useState} from 'react'
import type {SetRequired} from 'type-fest'
import {TextButton} from '../../components/Buttons/TextButton'
import {Label} from '../../components/Typography/Label'
import {Paragraph} from '../../components/Typography/Paragraph'
import {WithClipboard} from '../../helpers/clipboard'
import {encodeCollectionId} from '../../helpers/collectionId'
import {CardanoscanLinks} from '../../helpers/explorerLinks'
import type {SignAndSubmitTxResult} from '../../helpers/transaction'
import type {CollectionState} from '../../store/collection'
import {useConnectedWalletStore} from '../../store/connectedWallet'
import type {BuildMintTxResult} from './buildTx'

type MintSuccessModalProps = {
  collection: CollectionState
  buildMintTxResult?: BuildMintTxResult
  signAndSubmitData?: SignAndSubmitTxResult
  onClose?: () => void
}

export const MintSuccessModal = ({
  collection,
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
            collection={collection}
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
  collection,
  buildMintTxResult,
  signAndSubmitData,
  onClose,
}: SetRequired<
  MintSuccessModalProps,
  'signAndSubmitData' | 'buildMintTxResult'
>) => {
  const [hasSavedCollectionId, setHasSavedCollectionId] = useState(false)

  if (!collection.uuid) {
    throw new Error('Collection UUID not found')
  }
  const network = useConnectedWalletStore((c) => c.connectedWallet?.network)
  if (!network) {
    throw new Error('Network not found')
  }
  const explorerLinks = new CardanoscanLinks(network)

  const collectionId = encodeCollectionId({
    uuid: collection.uuid,
    mintEndDate: collection.mintEndDate,
  })

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

          <Stack>
            <Paragraph>ID of your collection is:</Paragraph>
            <Label my={1} sx={{wordBreak: 'break-word'}}>
              {collectionId}
            </Label>
            <WithClipboard text={collectionId}>
              {({copy, isCopied}) => (
                <TextButton
                  onClick={copy}
                  color="secondary"
                  p={0}
                  uppercase={false}
                >
                  {isCopied ? 'Copied' : 'Copy collection ID'}
                </TextButton>
              )}
            </WithClipboard>
            <Paragraph mt={2}>
              Make sure to save this ID, as it will be needed to mint additional
              NFTs in this collection.
            </Paragraph>
          </Stack>

          <FormControlLabel
            control={
              <Checkbox
                checked={hasSavedCollectionId}
                onChange={(_e, checked) => setHasSavedCollectionId(checked)}
                sx={{ml: -2}}
              />
            }
            label="I have saved the collection Id"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <TextButton disabled={!hasSavedCollectionId} onClick={onClose}>
          Close
        </TextButton>
      </DialogActions>
    </>
  )
}
