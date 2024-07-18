import { Box, Flex, Stack, Text, atoms } from '@zoralabs/zord'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { useAccount } from 'wagmi'

import { Icon } from 'src/components/Icon'
import { CACHE_TIMES } from 'src/constants/cacheTimes'
import { PUBLIC_DEFAULT_CHAINS } from 'src/constants/defaultChains'
import getDAOAddresses from 'src/data/contract/requests/getDAOAddresses'
import { useVotes } from 'src/hooks'
import { useDelayedGovernance } from 'src/hooks/useDelayedGovernance'
import { getDaoLayout } from 'src/layouts/DaoLayout'
import {
  CreateProposalHeading,
  ReviewProposalForm,
  useProposalStore,
} from 'src/modules/create-proposal'
import { useDaoStore } from 'src/modules/dao'
import { NextPageWithLayout } from 'src/pages/_app'
import { useLayoutStore } from 'src/stores'
import { useChainStore } from 'src/stores/useChainStore'
import { notFoundWrap } from 'src/styles/404.css'
import { AddressType } from 'src/typings'

const ReviewProposalPage: NextPageWithLayout = () => {
  const { isMobile } = useLayoutStore()
  const router = useRouter()
  const chain = useChainStore((x) => x.chain)
  const { query } = router

  const { addresses } = useDaoStore()
  const { address } = useAccount()

  const { isLoading, hasThreshold } = useVotes({
    chainId: chain.id,
    governorAddress: addresses?.governor,
    signerAddress: address,
    collectionAddress: query?.token as AddressType,
  })

  const { isGovernanceDelayed } = useDelayedGovernance({
    chainId: chain.id,
    tokenAddress: addresses?.token,
    governorAddress: addresses?.governor,
  })

  const transactions = useProposalStore((state) => state.transactions)
  const disabled = useProposalStore((state) => state.disabled)
  const title = useProposalStore((state) => state.title)
  const summary = useProposalStore((state) => state.summary)

  if (isLoading) return null

  if (!hasThreshold || isGovernanceDelayed) {
    return <Flex className={notFoundWrap}>403 - Access Denied</Flex>
  }

  return (
    <Stack mb={'x20'} w={'100%'} px={'x3'} style={{ maxWidth: 1060 }} mx="auto">
      <CreateProposalHeading title={'Review and Submit Proposal'} align={'center'} />
      <Box mx="auto">
        <a href="/guidelines" target="_blank" rel="noreferrer noopener">
          <Flex align={'center'} mb={'x10'} color="text1">
            <Text
              as="a"
              fontSize={isMobile ? 14 : 18}
              fontWeight={'paragraph'}
              className={atoms({ textDecoration: 'underline' })}
            >
              Tips on how to write great proposals
            </Text>
            <Icon fill="text1" size="sm" ml="x1" id="external-16" />
          </Flex>
        </a>
      </Box>
      <Stack w={'100%'} px={'x3'} style={{ maxWidth: 680 }} mx="auto">
        <ReviewProposalForm
          disabled={disabled}
          transactions={transactions}
          title={title}
          summary={summary}
        />
      </Stack>
    </Stack>
  )
}

ReviewProposalPage.getLayout = getDaoLayout

export default ReviewProposalPage

export const getServerSideProps: GetServerSideProps = async ({ res, params }) => {
  const { maxAge, swr } = CACHE_TIMES.DAO_PROPOSAL
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${maxAge}, stale-while-revalidate=${swr}`
  )

  const collection = params?.token as AddressType
  const network = params?.network as string

  const chain = PUBLIC_DEFAULT_CHAINS.find((x) => x.slug === network)

  if (!chain)
    return {
      notFound: true,
    }

  const addresses = await getDAOAddresses(chain.id, collection)

  if (!addresses) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      addresses,
    },
  }
}
