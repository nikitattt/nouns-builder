import { Box, Flex, Text, vars } from '@zoralabs/zord'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useAccount } from 'wagmi'

import ExploreSortMenu from './ExploreSortMenu'

interface ExploreToolbarProps {
  title: string
  showSort?: boolean
}

const ExploreToolbar: React.FC<ExploreToolbarProps> = ({ title, showSort = false }) => {
  const router = useRouter()
  const { address } = useAccount()

  return (
    <Flex
      direction={'column'}
      w={'100%'}
      mb={address ? 'x0' : 'x5'}
      align={'center'}
      style={{ maxWidth: 912 }}
    >
      <Flex direction={'row'} w={'100%'} justify={'space-between'}>
        <Box fontSize={28} fontWeight={'heading'} mb={'x8'}>
          {title}
        </Box>
        {showSort && (
          <ExploreSortMenu choice={(router.query?.sortKey as string) || 'CREATED'} />
        )}
      </Flex>
      {address && (
        <>
          <Flex w={'100%'} justify={'center'}>
            <Link href={'/explore'} passHref>
              <Box
                h={'100%'}
                mb={'x4'}
                mx={'x4'}
                style={{
                  borderBottom:
                    router.pathname === '/explore' ? `2px solid black` : `0px`,
                }}
              >
                <Text variant="paragraph-md">Explore</Text>
              </Box>
            </Link>
            <Link href={'/mydaos'} passHref>
              <Box
                h={'100%'}
                mb={'x4'}
                mx={'x4'}
                style={{
                  borderBottom: router.pathname === '/mydaos' ? `2px solid black` : `0px`,
                }}
              >
                <Text variant="paragraph-md">My DAOs</Text>
              </Box>
            </Link>
          </Flex>

          <Box
            w={'100vw'}
            mb={'x5'}
            style={{ borderBottom: `2px solid ${vars.color.border}` }}
          />
        </>
      )}
    </Flex>
  )
}

export default ExploreToolbar
