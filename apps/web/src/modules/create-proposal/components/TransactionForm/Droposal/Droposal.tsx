import { Stack } from '@zoralabs/zord'
import { FormikHelpers } from 'formik'
import { encodeFunctionData, parseEther } from 'viem'

import { PUBLIC_ZORA_NFT_CREATOR } from 'src/constants/addresses'
import { zoraNFTCreatorAbi } from 'src/data/contract/abis/ZoraNFTCreator'
import { TransactionType } from 'src/modules/create-proposal/constants'
import { useProposalStore } from 'src/modules/create-proposal/stores'
import { useChainStore } from 'src/stores/useChainStore'
import { AddressType } from 'src/typings'

import { DroposalForm } from './DroposalForm'
import { DroposalFormValues } from './DroposalForm.schema'

const UINT_64_MAX = BigInt('18446744073709551615')
const UINT_32_MAX = BigInt('4294967295')
const HASH_ZERO =
  '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`

export const Droposal: React.FC = () => {
  const addTransaction = useProposalStore((state) => state.addTransaction)
  const chain = useChainStore((x) => x.chain)

  const handleDroposalTransaction = (
    values: DroposalFormValues,
    actions: FormikHelpers<DroposalFormValues>
  ) => {
    if (!chain) return
    const {
      name,
      symbol,
      maxSupply: editionSize,
      royaltyPercentage,
      fundsRecipient,
      defaultAdmin,
      pricePerMint: publicSalePrice,
      maxPerAddress: maxSalePurchasePerAddress,
      publicSaleStart,
      publicSaleEnd,
      description,
      mediaUrl,
      mediaType,
      coverUrl,
    } = values

    const royaltyBPS = royaltyPercentage * 100
    const salesConfig = {
      publicSalePrice: parseEther((publicSalePrice || 0).toString()),
      maxSalePurchasePerAddress: maxSalePurchasePerAddress
        ? maxSalePurchasePerAddress
        : Number(UINT_32_MAX),
      publicSaleStart: BigInt(Math.floor(new Date(publicSaleStart).getTime() / 1000)),
      publicSaleEnd: BigInt(Math.floor(new Date(publicSaleEnd).getTime() / 1000)),
      presaleStart: BigInt(0), // presaleStart
      presaleEnd: BigInt(0), // presaleEnd
      presaleMerkleRoot: HASH_ZERO, // presaleMerkleRoot
    }
    const animationUri = mediaType?.startsWith('image') ? '' : mediaUrl
    const imageUri = mediaType?.startsWith('image') ? mediaUrl : coverUrl

    const createEdition = {
      target: PUBLIC_ZORA_NFT_CREATOR[chain.id] as AddressType,
      functionSignature: 'createEdition()',
      calldata: encodeFunctionData({
        abi: zoraNFTCreatorAbi,
        functionName: 'createEdition',
        args: [
          name,
          symbol,
          BigInt(editionSize) || UINT_64_MAX,
          royaltyBPS,
          fundsRecipient as AddressType,
          defaultAdmin as AddressType,
          salesConfig,
          description,
          animationUri,
          imageUri,
        ],
      }),
      value: '',
    }

    addTransaction({
      type: TransactionType.DROPOSAL,
      summary: 'Create a droposal',
      transactions: [createEdition],
    })

    actions.resetForm()
  }

  return (
    <Stack>
      <DroposalForm onSubmit={handleDroposalTransaction} />
    </Stack>
  )
}
