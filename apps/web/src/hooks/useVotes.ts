import isNil from 'lodash/isNil'
import { useContractReads } from 'wagmi'

import { governorAbi, tokenAbi } from 'src/data/contract/abis'
import { AddressType, CHAIN_ID } from 'src/typings'

export const useVotes = ({
  chainId,
  collectionAddress,
  governorAddress,
  signerAddress,
}: {
  chainId: CHAIN_ID
  collectionAddress?: AddressType
  governorAddress?: AddressType
  signerAddress?: AddressType
}) => {
  const { data, isLoading } = useContractReads({
    enabled: !!collectionAddress && !!governorAddress && !!signerAddress,
    allowFailure: false,
    keepPreviousData: true,
    contracts: [
      {
        address: collectionAddress as AddressType,
        abi: tokenAbi,
        functionName: 'getVotes',
        args: [signerAddress as AddressType],
        chainId,
      },
      {
        address: collectionAddress as AddressType,
        abi: tokenAbi,
        functionName: 'delegates',
        args: [signerAddress as AddressType],
        chainId,
      },
      {
        address: governorAddress as AddressType,
        abi: governorAbi,
        functionName: 'proposalThreshold',
        chainId,
      },
    ] as const,
  })

  if (!data || isLoading || data.some(isNil)) {
    return {
      isLoading,
      isOwner: false,
      hasThreshold: false,
    }
  }

  const [votes, delegates, proposalThreshold] = data

  return {
    isLoading,
    isDelegating: delegates !== signerAddress,
    isOwner: votes > 0,
    hasThreshold: votes > proposalThreshold,
    proposalVotesRequired: proposalThreshold + BigInt(1),
  }
}
