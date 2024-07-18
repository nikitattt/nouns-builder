import { NextApiRequest, NextApiResponse } from 'next'
import { Address } from 'viem'

import { getMetadataAttributes } from 'src/data/contract/requests/getMetadataAttributes'
import 'src/data/contract/server.config'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { metadata, chainId, finalTokenId } = req.query as {
      metadata: Address
      chainId: string
      finalTokenId: string
    }

    const attribtues = await getMetadataAttributes(
      metadata as Address,
      BigInt(finalTokenId),
      parseInt(chainId)
    )

    res.status(200).send(attribtues)
  } catch (e) {
    res.status(500).send(e)
  }
}

export default handler
