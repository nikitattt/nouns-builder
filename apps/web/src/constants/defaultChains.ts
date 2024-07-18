import {
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
  zora,
  zoraSepolia,
} from 'wagmi/chains'

import { CHAIN_ID, Chain } from 'src/typings'

const MAINNET_CHAINS: Chain[] = [
  { ...mainnet, id: CHAIN_ID.ETHEREUM, slug: 'ethereum', icon: '/chains/ethereum.svg' },
  { ...zora, id: CHAIN_ID.ZORA, slug: 'zora', icon: '/chains/zora.png' },
  { ...base, id: CHAIN_ID.BASE, slug: 'base', icon: '/chains/base.svg' },
  {
    ...optimism,
    id: CHAIN_ID.OPTIMISM,
    slug: 'optimism',
    icon: '/chains/optimism.svg',
  },
]

const TESTNET_CHAINS: Chain[] = [
  { ...sepolia, id: CHAIN_ID.SEPOLIA, slug: 'sepolia', icon: '/chains/ethereum.svg' },
  {
    ...optimismSepolia,
    id: CHAIN_ID.OPTIMISM_SEPOLIA,
    slug: 'op-sepolia',
    icon: '/chains/optimism.svg',
  },
  {
    ...baseSepolia,
    id: CHAIN_ID.BASE_SEPOLIA,
    slug: 'base-sepolia',
    icon: '/chains/base.svg',
  },
  {
    ...zoraSepolia,
    id: CHAIN_ID.ZORA_SEPOLIA,
    slug: 'zora-sepolia',
    icon: '/chains/zora.png',
  },
]

export const PUBLIC_IS_TESTNET = process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'

export const PUBLIC_ALL_CHAINS = [...MAINNET_CHAINS, ...TESTNET_CHAINS]

export const PUBLIC_DEFAULT_CHAINS = PUBLIC_IS_TESTNET ? TESTNET_CHAINS : MAINNET_CHAINS
