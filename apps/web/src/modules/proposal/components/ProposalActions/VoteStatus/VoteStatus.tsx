import { Button, Flex, Text } from '@zoralabs/zord'
import React, { Fragment, useEffect, useState } from 'react'
import { getAddress } from 'viem'
import { useAccount, useContractEvent } from 'wagmi'

import { governorAbi } from 'src/data/contract/abis'
import { ProposalState } from 'src/data/contract/requests/getProposalState'
import {
  ProposalVoteFragment as ProposalVote,
  ProposalVoteSupport as Support,
} from 'src/data/subgraph/sdk.generated'
import { useDaoStore } from 'src/modules/dao'
import { proposalActionButtonVariants } from 'src/styles/Proposals.css'

import Pending from './Pending'
import Vote from './Vote'
import VoteModal from './VoteModal'

type SupportValue = 0 | 1 | 2

const valueToSupport: Record<SupportValue, Support> = {
  0: Support.Against,
  1: Support.For,
  2: Support.Abstain,
}
interface VoteStatusProps {
  votesAvailable: number
  proposalId: string
  voteStart: number
  state: ProposalState
  title: string
  daoName?: string
  signerVote?: ProposalVote
}

export const VoteStatus: React.FC<VoteStatusProps> = ({
  signerVote,
  votesAvailable,
  proposalId,
  voteStart,
  state,
  daoName,
  title,
}) => {
  const { address: userAddress } = useAccount()
  const { governor } = useDaoStore((state) => state.addresses)
  const [showVoteModal, setShowVoteModal] = useState<boolean>(false)
  const [vote, setVote] = useState<ProposalVote | undefined>(signerVote)

  useEffect(() => {
    if (!userAddress) {
      return
    }

    const storedVote = sessionStorage.getItem(`vote-${proposalId}-${userAddress}`)

    if (storedVote) {
      if (!signerVote) {
        setVote(JSON.parse(storedVote))
      } else {
        // We don't need to store the signer vote anymore as the BE indexer has caught up
        sessionStorage.removeItem(`vote-${proposalId}-${userAddress}`)
      }
    }
  }, [userAddress, signerVote, proposalId])

  const shouldListen = !signerVote && !!userAddress && state === ProposalState.Active

  useContractEvent({
    address: shouldListen ? governor : undefined,
    abi: governorAbi,
    eventName: 'VoteCast',
    listener: async (logs) => {
      const { voter, proposalId: id, support, weight, reason } = logs[0].args
      if (id === proposalId && voter && getAddress(voter) === getAddress(userAddress!)) {
        const eventVote: ProposalVote = {
          voter,
          support: valueToSupport[Number(support) as SupportValue],
          weight: Number(weight),
          reason,
        }

        setVote(eventVote)
        sessionStorage.setItem(
          `vote-${proposalId}-${userAddress}`,
          JSON.stringify(eventVote)
        )
      }
    },
  })

  return (
    <Flex
      direction={{ '@initial': 'column', '@768': 'row' }}
      w={{ '@initial': '100%', '@768': 'auto' }}
      justify={'flex-start'}
      align={'center'}
    >
      {/* Voting for proposal has not yet started (proposal is Pending) */}
      {state === ProposalState.Pending ? (
        <Pending voteStart={voteStart} proposalId={proposalId} />
      ) : null}

      {/* Proposal is open but user cannot vote */}
      {state === ProposalState.Active && !votesAvailable && !vote ? (
        <Flex
          direction={{ '@initial': 'column', '@768': 'row' }}
          align={'center'}
          gap={'x3'}
          textAlign={{ '@initial': 'center', '@768': 'left' }}
        >
          <Flex
            className={proposalActionButtonVariants['voteDisabled']}
            w={{ '@initial': '100%', '@768': 'auto' }}
          >
            Submit Vote
          </Flex>
          <Text color={'text3'}>
            You must hold at least one {daoName} token to vote on proposals
          </Text>
        </Flex>
      ) : null}

      {/* Proposal is open and user can vote */}
      {state === ProposalState.Active && votesAvailable && !vote ? (
        <Fragment>
          <Flex
            direction={'row'}
            w={{ '@initial': '100%', '@768': 'auto' }}
            pb={{ '@initial': 'x2', '@768': 'x0' }}
            align={'center'}
          >
            <Button
              onClick={() => setShowVoteModal(true)}
              className={proposalActionButtonVariants['vote']}
              w={{ '@initial': '100%', '@768': 'auto' }}
              pr={{ '@initial': 'x2', '@768': 'x0' }}
            >
              {votesAvailable === 1 ? 'Submit Vote' : 'Submit Votes'}
            </Button>
          </Flex>
          <Text color={'text3'} pl={'x3'} mt={{ '@initial': 'x1', '@768': 'x0' }}>
            You have{' '}
            <strong style={{ color: '#000000' }}>
              {votesAvailable} {votesAvailable === 1 ? 'vote' : 'votes'}
            </strong>{' '}
            available for {daoName}
          </Text>
        </Fragment>
      ) : null}

      {/* User has voted */}
      {vote ? <Vote support={vote.support} weight={vote.weight} /> : null}

      {/* Proposal ended and the user did not vote */}
      {state !== ProposalState.Active && state !== ProposalState.Pending && !vote ? (
        <Flex direction={'row'} align={'center'}>
          <Text color={'text3'} ml={'x3'}>
            You did not participate in voting on this proposal
          </Text>
        </Flex>
      ) : null}

      <VoteModal
        title={title}
        proposalId={proposalId}
        votesAvailable={votesAvailable}
        showVoteModal={showVoteModal}
        setShowVoteModal={setShowVoteModal}
      />
    </Flex>
  )
}
