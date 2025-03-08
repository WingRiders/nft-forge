import {Stack} from '@mui/material'
import {FormField} from '../../components/FormField'
import {Paragraph} from '../../components/Typography/Paragraph'
import {ipfsCidToHttps} from '../../helpers/ipfs'
import type {NFTData} from '../../store/collection'

type NFTDisplayProps = {
  nftData: NFTData
}

export const NFTDisplay = ({
  nftData: {
    imageIpfsCid,
    imageMimeType,
    name,
    assetNameUtf8,
    description,
    customFields,
  },
}: NFTDisplayProps) => {
  return (
    <Stack direction="row" alignItems="center" spacing={5}>
      <img
        src={ipfsCidToHttps(imageIpfsCid)}
        alt={name}
        width={200}
        height={200}
      />

      <Stack flex={1} spacing={4}>
        <FormField
          label="NFT asset name"
          tooltip="This name will be used as the name of the NFT asset on the blockchain."
        >
          <Paragraph>{assetNameUtf8}</Paragraph>
        </FormField>

        <FormField label="NFT name">
          <Paragraph>{name}</Paragraph>
        </FormField>

        <FormField label="NFT description">
          <Paragraph>{description || <i>(No description)</i>}</Paragraph>
        </FormField>

        {customFields &&
          Object.entries(customFields).map(([name, value]) => (
            <FormField key={name} label={name}>
              <Paragraph>{value || <i>(No value)</i>}</Paragraph>
            </FormField>
          ))}

        <Stack direction="row" alignItems="center" spacing={4}>
          <FormField label="IPFS image" sx={{flex: 1}}>
            <Paragraph>{imageIpfsCid}</Paragraph>
          </FormField>
          <FormField label="Image type">
            <Paragraph>{imageMimeType}</Paragraph>
          </FormField>
        </Stack>
      </Stack>
    </Stack>
  )
}
