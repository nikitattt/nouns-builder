import { Box, Stack } from '@zoralabs/zord'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

import { ContractButton } from 'src/components/ContractButton'
import { getDefaultLayout } from 'src/layouts/DefaultLayout'

import { whyCreateButton, whyTextStyle } from '../styles/why.css'
import { NextPageWithLayout } from './_app'

const AboutPage: NextPageWithLayout = () => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Nouns Builder | About</title>
      </Head>

      <Stack align={'center'}>
        <Stack
          pt={'x12'}
          fontSize={35}
          className={whyTextStyle}
          textAlign={'center'}
          gap={'x12'}
          width={'100%'}
          px={'x4'}
        >
          <img src={'/why.svg'} style={{ alignSelf: 'center' }} width={500} />

          <Box>
            Nouns Builder makes it easy for communities and collectives to create Nounish
            DAOs, fully equipped with onchain governance and membership auctions starting
            day one.
          </Box>
          <Box>
            This public good DAO tooling and the Nouns Builder Protocol are maintained and
            governed by &nbsp;
            <Link
              href="https://nouns.build/dao/base/0xe8af882f2f5c79580230710ac0e2344070099432"
              style={{ textDecoration: 'underline' }}
            >
              BuilderDAO
            </Link>
            . Learn more about the DAO's vision and mission &nbsp;
            <Link
              style={{ textDecoration: 'underline' }}
              href="https://nouns.build/dao/ethereum/0xdf9b7d26c8fc806b1ae6273684556761ff02d422/vote/66"
            >
              here
            </Link>
            .
          </Box>

          <ContractButton
            alignSelf={'center'}
            align={'center'}
            justify={'center'}
            borderRadius={'curved'}
            py={'x4'}
            px={'x6'}
            fontSize={18}
            style={{ background: '#000', color: '#fff' }}
            className={whyCreateButton}
            mb={'x12'}
            handleClick={() => {
              router.push('/create')
            }}
          >
            Create a DAO
          </ContractButton>
        </Stack>
      </Stack>
    </>
  )
}

AboutPage.getLayout = getDefaultLayout

export default AboutPage
