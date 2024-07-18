import { Stack } from '@zoralabs/zord'
import axios from 'axios'
import useSWR from 'swr'
import { useContractRead } from 'wagmi'

import SWR_KEYS from 'src/constants/swrKeys'
import { auctionAbi } from 'src/data/contract/abis'
import { useDaoStore } from 'src/modules/dao/stores/useDaoStore'
import { L2MigratedResponse } from 'src/pages/api/migrated'
import { useChainStore } from 'src/stores/useChainStore'
import { AddressType } from 'src/typings'

import { BridgeTreasuryForm } from './BirdgeTreasuryForm'
import { MigrateDAOForm } from './MigrateDAOForm'
import { MigrationTracker } from './MigrationTracker'
import { PauseAuctionsForm } from './PauseAuctionsForm'

export enum DAOMigrationProgress {
  DEFAULT = 0,
  PAUSED = 1,
  DEPLOYED = 2,
}

export const Migration: React.FC = () => {
  const chain = useChainStore((x) => x.chain)
  const {
    addresses: { treasury, auction },
  } = useDaoStore()

  const { data: paused } = useContractRead({
    abi: auctionAbi,
    address: auction as AddressType,
    functionName: 'paused',
    chainId: chain.id,
  })

  const { data: migratedRes } = useSWR(
    treasury ? [SWR_KEYS.DAO_MIGRATED, treasury] : null,
    (_, treasury) =>
      axios
        .get<L2MigratedResponse>(`/api/migrated?l1Treasury=${treasury}`)
        .then((x) => x.data)
  )

  const deployed = !!migratedRes?.migrated

  let daoProgress = DAOMigrationProgress.DEPLOYED
  if (!paused) daoProgress = DAOMigrationProgress.DEFAULT
  else if (!deployed) daoProgress = DAOMigrationProgress.PAUSED

  const formComponents = [
    <PauseAuctionsForm />,
    <MigrateDAOForm />,
    <BridgeTreasuryForm migratedToChainId={migratedRes?.migrated?.chainId} />,
  ]

  return (
    <Stack>
      <MigrationTracker checkpoint={daoProgress} />
      {formComponents[daoProgress]}
    </Stack>
  )
}
