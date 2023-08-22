import { Flex, Text } from '@zoralabs/zord'
import { useRouter } from 'next/router'
import React from 'react'
import useSWR from 'swr'

import AnimatedModal from 'src/components/Modal/AnimatedModal'
import { SuccessModalContent } from 'src/components/Modal/SuccessModalContent'
import Pagination from 'src/components/Pagination'
import SWR_KEYS from 'src/constants/swrKeys'
import {
  ProposalsResponse,
  getProposals,
} from 'src/data/subgraph/requests/proposalsQuery'
import { usePagination } from 'src/hooks/usePagination'
import { ProposalCard } from 'src/modules/proposal'
import { useChainStore } from 'src/stores/useChainStore'
import { sectionWrapperStyle } from 'src/styles/dao.css'
import { walletSnippet } from 'src/utils/helpers'

import { useDelegate } from '../../hooks'
import { useDaoStore } from '../../stores'
import { CurrentDelegate } from './CurrentDelegate'
import { DelegateForm } from './DelegateForm'
import { Treasury } from './Treasury'

export const Activity: React.FC = () => {
  const addresses = useDaoStore((state) => state.addresses)
  const { query, isReady } = useRouter()
  const chain = useChainStore((x) => x.chain)
  const LIMIT = 20

  const { token } = addresses

  const { data, error } = useSWR<ProposalsResponse>(
    isReady ? [SWR_KEYS.PROPOSALS, chain.id, query.token, query.page] : null,
    (_, chainId, token, page) => getProposals(chainId, token, LIMIT, Number(page))
  )

  const { handlePageBack, handlePageForward } = usePagination(data?.pageInfo?.hasNextPage)

  const [
    { viewCurrentDelegate, viewDelegateForm, viewSuccessfulDelegate, newDelegate },
    { view, edit, update, close },
  ] = useDelegate({
    viewCurrentDelegate: false,
    viewDelegateForm: false,
    viewSuccessfulDelegate: false,
  })

  if (!data && !error) {
    return null
  }

  return (
    <>
      <Flex direction={'column'} className={sectionWrapperStyle['proposals']} mx={'auto'}>
        <Treasury />

        <Flex direction={'column'} mt={'x6'}>
          {data?.proposals?.length ? (
            data?.proposals?.map((proposal, index: number) => (
              <ProposalCard
                key={index}
                collection={token}
                proposalId={proposal.proposalId}
                proposalNumber={proposal.proposalNumber}
                title={proposal.title || ''}
                state={proposal.state}
                timeCreated={proposal.timeCreated}
                voteEnd={proposal.voteEnd}
                voteStart={proposal.voteStart}
                expiresAt={proposal.expiresAt}
              />
            ))
          ) : (
            <Flex
              width={'100%'}
              mt={'x4'}
              p={'x4'}
              justify={'center'}
              borderColor={'border'}
              borderStyle={'solid'}
              borderRadius={'curved'}
              borderWidth={'normal'}
            >
              <Text>No proposals yet.</Text>
            </Flex>
          )}

          <Pagination
            onNext={handlePageForward}
            onPrev={handlePageBack}
            isLast={!data?.pageInfo?.hasNextPage}
            isFirst={!query.page}
          />
        </Flex>
      </Flex>

      <AnimatedModal open={viewCurrentDelegate} size={'auto'} close={close}>
        <CurrentDelegate toggleIsEditing={edit} />
      </AnimatedModal>

      <AnimatedModal open={viewDelegateForm} size={'auto'} close={close}>
        <DelegateForm handleBack={view} handleUpdate={update} />
      </AnimatedModal>

      <AnimatedModal open={viewSuccessfulDelegate} close={close}>
        <SuccessModalContent
          success
          title="Delegate updated"
          subtitle="Your votes have been successfully delegated to"
          content={walletSnippet(newDelegate)}
        />
      </AnimatedModal>
    </>
  )
}
