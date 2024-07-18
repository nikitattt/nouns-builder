import { Box, Flex, Grid, Text } from '@zoralabs/zord'
import React from 'react'
import useSWR from 'swr'
import { formatEther } from 'viem'
import { useBalance } from 'wagmi'

import SWR_KEYS from 'src/constants/swrKeys'
import { SDK } from 'src/data/subgraph/client'
import { useChainStore } from 'src/stores/useChainStore'
import { statisticContent } from 'src/styles/About.css'
import { treasuryWrapper } from 'src/styles/Proposals.css'
import { formatCryptoVal, numberFormatter } from 'src/utils/numbers'

import { useDaoStore } from '../../stores'

export const Treasury = () => {
  const { addresses } = useDaoStore()
  const chain = useChainStore((x) => x.chain)

  const { data: balance } = useBalance({
    address: addresses?.treasury as `0x${string}`,
    chainId: chain.id,
  })

  const { data: ethUsd } = useSWR(SWR_KEYS.ETH_USD, async () => {
    const response = await fetch(
      'https://api.coinbase.com/v2/exchange-rates?currency=ETH'
    )
    const json = await response.json()
    return json.data.rates.USD
  })

  const { data: earnings } = useSWR(
    chain && [SWR_KEYS.TREASURY_SALES, chain.id, addresses.token],
    (_, chainId) =>
      SDK.connect(chainId)
        .totalAuctionSales({ tokenAddress: addresses.token?.toLowerCase() as string })
        .then((x) =>
          x.dao?.totalAuctionSales ? formatEther(x.dao.totalAuctionSales) : 0
        )
  )

  const formattedEarnings = earnings && formatCryptoVal(earnings)

  const ethToUsd = React.useMemo(() => {
    if (!balance) return 0
    const wei = balance.value
    const eth = formatEther(wei)
    const usd = ((eth as any) * ethUsd).toFixed(2)
    const usdFormatted = numberFormatter(usd)
    return usdFormatted
  }, [balance, ethUsd])

  const treasuryBalance = React.useMemo(() => {
    return balance?.formatted ? formatCryptoVal(balance?.formatted) : null
  }, [balance])

  return (
    <Box>
      <Flex width={'100%'} justify={'space-between'} align={'center'}>
        <Text fontSize={28} fontWeight={'display'}>
          Treasury
        </Text>
      </Flex>

      <Grid
        className={treasuryWrapper}
        display={'grid'}
        px={{ '@initial': 'x0', '@768': 'x13' }}
        py={{ '@initial': 'x0', '@768': 'x8' }}
        borderColor={'border'}
        borderStyle={'solid'}
        borderRadius={'curved'}
        borderWidth={'normal'}
        mt={'x4'}
        mb={'x8'}
      >
        <Flex
          direction={'column'}
          p={'x3'}
          mx={'x1'}
          width={'100%'}
          justify={'space-between'}
          align={{ '@initial': 'start', '@768': 'center' }}
        >
          <Text className={statisticContent} fontWeight={'display'}>
            {earnings ? formattedEarnings : 0} ETH
          </Text>
          <Text
            variant="paragraph-md"
            mt={{ '@initial': 'x0', '@768': 'x2' }}
            color={'tertiary'}
          >
            Total Auction Sales
          </Text>
        </Flex>

        <Flex
          direction={'column'}
          p={'x3'}
          mx={'x1'}
          width={'100%'}
          align={{ '@initial': 'start', '@768': 'center' }}
        >
          <Text className={statisticContent} fontWeight={'display'}>
            {treasuryBalance} ETH
          </Text>
          <Text
            variant="paragraph-md"
            color={'tertiary'}
            mt={{ '@initial': 'x0', '@768': 'x2' }}
          >
            Treasury Balance
          </Text>
        </Flex>

        <Flex
          direction={'column'}
          p={'x3'}
          mx={'x1'}
          width={'100%'}
          align={{ '@initial': 'start', '@768': 'center' }}
        >
          {ethToUsd && (
            <Text className={statisticContent} fontWeight={'display'}>
              ${ethToUsd ? ethToUsd : ' '}
            </Text>
          )}
          <Text
            variant="paragraph-md"
            color={'tertiary'}
            mt={{ '@initial': 'x0', '@768': 'x2' }}
          >
            Treasury Balance in USD
          </Text>
        </Flex>
      </Grid>
    </Box>
  )
}

export default Treasury
