import { NextApiRequest, NextApiResponse } from 'next'
import { readContract } from 'wagmi/actions'

import { L2_MIGRATION_DEPLOYER, NULL_ADDRESS } from 'src/constants/addresses'
import { L2DeployerABI } from 'src/data/contract/abis/L2MigrationDeployer'
import { L2_CHAINS } from 'src/data/contract/chains'
import 'src/data/contract/server.config'
import { AddressType, CHAIN_ID } from 'src/typings'
import { unpackOptionalArray } from 'src/utils/helpers'

export interface L2MigratedResponse {
  migrated:
    | {
        l2TokenAddress: AddressType
        chainId: CHAIN_ID
      }
    | undefined
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { l1Treasury } = req.query

  const data = await Promise.all(
    L2_CHAINS.map((chainId) => {
      const deployer = L2_MIGRATION_DEPLOYER[chainId]

      if (deployer === NULL_ADDRESS) return []
      return readContract({
        address: deployer,
        chainId: chainId,
        abi: L2DeployerABI,
        functionName: 'crossDomainDeployerToMigration',
        args: [l1Treasury as AddressType],
      })
    })
  )

  const migrated = data
    .map((x, i) => {
      const [token] = unpackOptionalArray(x, 3)
      return {
        l2TokenAddress: token,
        chainId: L2_CHAINS[i],
      }
    })
    .find((x) => {
      return x.l2TokenAddress !== NULL_ADDRESS && x.l2TokenAddress !== undefined
    })

  if (!migrated) {
    return res.status(200).send({ migrated: null })
  }

  res.status(200).send({
    migrated,
  } as L2MigratedResponse)
}

export default handler
