import { NextApiRequest, NextApiResponse } from 'next'
import { Address } from 'viem'

import 'src/data/contract/server.config'
import { memberSnapshotRequest } from 'src/data/subgraph/requests/memberSnapshot'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { chainId, token } = req.query as {
      token: Address
      chainId: string
    }

    const snapshot = await memberSnapshotRequest(parseInt(chainId), token)

    res.status(200).send(snapshot)
  } catch (e) {
    res.status(500).send(e)
  }
}

export default handler
