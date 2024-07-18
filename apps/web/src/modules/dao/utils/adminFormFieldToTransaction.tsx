import { encodeFunctionData, parseEther } from 'viem'

import { auctionAbi, governorAbi, metadataAbi, tokenAbi } from 'src/data/contract/abis'
import { AddressType } from 'src/typings'
import { toSeconds } from 'src/utils/helpers'
import { sanitizeStringForJSON } from 'src/utils/sanitize'

import { AdminFormValues } from '../components/AdminForm'
import { DaoContractAddresses } from '../stores'

type FormValuesTransactionMap = {
  [K in keyof AdminFormValues]: {
    functionSignature: string
    getTarget: (addresses: DaoContractAddresses) => AddressType | undefined
    constructCalldata: (value: AdminFormValues[K]) => string | undefined
  }
}

export const formValuesToTransactionMap: FormValuesTransactionMap = {
  /* metadata */
  daoAvatar: {
    functionSignature: 'updateContractImage',
    getTarget: (addresses) => addresses.metadata as AddressType,
    constructCalldata: (value) =>
      encodeFunctionData({
        abi: metadataAbi,
        functionName: 'updateContractImage',
        args: [value],
      }),
  },
  daoWebsite: {
    functionSignature: 'updateProjectURI',
    getTarget: (addresses) => addresses.metadata as AddressType,
    constructCalldata: (value) =>
      encodeFunctionData({
        abi: metadataAbi,
        functionName: 'updateProjectURI',
        args: [sanitizeStringForJSON(value)],
      }),
  },
  projectDescription: {
    functionSignature: 'updateDescription',
    getTarget: (addresses) => addresses.metadata as AddressType,
    constructCalldata: (value) =>
      encodeFunctionData({
        abi: metadataAbi,
        functionName: 'updateDescription',
        args: [sanitizeStringForJSON(value)],
      }),
  },
  rendererBase: {
    functionSignature: 'updateRendererBase',
    getTarget: (addresses) => addresses.metadata as AddressType,
    constructCalldata: (value) =>
      encodeFunctionData({
        abi: metadataAbi,
        functionName: 'updateRendererBase',
        args: [value],
      }),
  },

  /* auction */
  auctionDuration: {
    functionSignature: 'setDuration',
    getTarget: (addresses) => addresses.auction as AddressType,
    constructCalldata: (value) =>
      encodeFunctionData({
        abi: auctionAbi,
        functionName: 'setDuration',
        args: [BigInt(toSeconds(value))],
      }),
  },
  auctionReservePrice: {
    functionSignature: 'setReservePrice',
    getTarget: (addresses) => addresses.auction as AddressType,
    constructCalldata: (value) =>
      encodeFunctionData({
        abi: auctionAbi,
        functionName: 'setReservePrice',
        args: [parseEther(value.toString())],
      }),
  },

  /* governor */
  proposalThreshold: {
    functionSignature: 'updateProposalThresholdBps',
    getTarget: (addresses) => addresses.governor as AddressType,
    constructCalldata: (value) =>
      encodeFunctionData({
        abi: governorAbi,
        functionName: 'updateProposalThresholdBps',
        args: [BigInt(Number(value) * 100)],
      }),
  },
  quorumThreshold: {
    functionSignature: 'updateQuorumVotesBps',
    getTarget: (addresses) => addresses.governor as AddressType,
    constructCalldata: (value) =>
      encodeFunctionData({
        abi: governorAbi,
        functionName: 'updateQuorumThresholdBps',
        args: [BigInt(Number(value) * 100)],
      }),
  },
  votingPeriod: {
    functionSignature: 'updateVotingPeriod',
    getTarget: (addresses) => addresses.governor as AddressType,
    constructCalldata: (value) =>
      encodeFunctionData({
        abi: governorAbi,
        functionName: 'updateVotingPeriod',
        args: [BigInt(toSeconds(value))],
      }),
  },
  votingDelay: {
    functionSignature: 'updateVotingDelay',
    getTarget: (addresses) => addresses.governor as AddressType,
    constructCalldata: (value) =>
      encodeFunctionData({
        abi: governorAbi,
        functionName: 'updateVotingDelay',
        args: [BigInt(toSeconds(value))],
      }),
  },
  founderAllocation: {
    functionSignature: 'updateFounders',
    getTarget: (addresses) => addresses.token as AddressType,
    constructCalldata: (value) =>
      encodeFunctionData({
        abi: tokenAbi,
        functionName: 'updateFounders',
        args: [
          value.map((x) => ({
            wallet: x.founderAddress as AddressType,
            ownershipPct: BigInt(x.allocationPercentage),
            vestExpiry: BigInt(x.endDate),
          })),
        ],
      }),
  },
  vetoPower: {
    functionSignature: 'burnVetoer',
    getTarget: (addresses) => addresses.governor as AddressType,
    constructCalldata: (value) =>
      encodeFunctionData({
        abi: governorAbi,
        functionName: 'burnVetoer',
      }),
  },
  vetoer: {
    functionSignature: 'updateVetoer',
    getTarget: (addresses) => addresses.governor as AddressType,
    constructCalldata: (value) =>
      encodeFunctionData({
        abi: governorAbi,
        functionName: 'updateVetoer',
        args: [value as AddressType],
      }),
  },
}
