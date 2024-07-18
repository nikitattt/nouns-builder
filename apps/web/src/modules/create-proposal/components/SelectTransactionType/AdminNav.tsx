import { Flex, Stack, Text } from '@zoralabs/zord'
import { useRouter } from 'next/router'
import React from 'react'
import { useContractRead } from 'wagmi'

import { Icon } from 'src/components/Icon'
import { auctionAbi } from 'src/data/contract/abis'
import { useDaoStore } from 'src/modules/dao'
import { useChainStore } from 'src/stores/useChainStore'
import { unpackOptionalArray } from 'src/utils/helpers'

const AdminNav = () => {
  const router = useRouter()
  const addresses = useDaoStore((state) => state.addresses)
  const chain = useChainStore((state) => state.chain)

  const { data: auction } = useContractRead({
    abi: auctionAbi,
    address: addresses?.auction,
    chainId: chain.id,
    functionName: 'auction',
    enabled: !!addresses?.auction,
  })

  const [tokenId] = unpackOptionalArray(auction, 6)

  const handleNavigation = async () => {
    await router.push({
      pathname: `/dao/[network]/[token]/[tokenId]`,
      query: {
        network: router.query?.network,
        token: router.query?.token,
        tokenId: Number(tokenId),
        tab: 'admin',
      },
    })
  }

  return (
    <Flex
      w={'100%'}
      justify={'flex-start'}
      p={'x6'}
      borderWidth={'normal'}
      borderStyle={'solid'}
      borderColor={'ghostHover'}
      mt={'x3'}
      style={{ borderRadius: 12 }}
      gap={'x2'}
      cursor={'pointer'}
      onClick={() => handleNavigation()}
    >
      <Stack>
        <Text variant="label-lg" mb={'x1'}>
          Configure DAO Settings
        </Text>
        <Text variant="paragraph-md" color={'text3'}>
          Change all the main DAO settings in the Admin Tab
        </Text>
      </Stack>
      <Icon
        id={'external-16'}
        fill={'text4'}
        size={'sm'}
        alignSelf={'center'}
        ml={'auto'}
      />
    </Flex>
  )
}

export default AdminNav
