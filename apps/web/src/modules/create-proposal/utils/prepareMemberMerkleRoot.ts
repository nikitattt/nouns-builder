import { createTree } from 'lanyard'
import { Address, encodeAbiParameters } from 'viem'

import { DaoMember } from 'src/data/subgraph/requests/memberSnapshot'

export const prepareMemberMerkleRoot = async (
  members: DaoMember[]
): Promise<`0x${string}`> => {
  const leaves = members
    .map((member) =>
      member.tokens.map((tokenId) =>
        encodeAbiParameters(
          [
            { name: 'owner', type: 'address' },
            { name: 'tokenId', type: 'uint256' },
          ],
          [member.address as Address, BigInt(tokenId)]
        )
      )
    )
    .flat()

  return await createTree({
    unhashedLeaves: leaves,
  }).then((x) => x.merkleRoot as `0x${string}`)
}
