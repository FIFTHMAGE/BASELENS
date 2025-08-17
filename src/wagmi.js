import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// Debug logging
console.log('Wagmi config - Base chain ID:', base.id)
console.log('Wagmi config - Available connectors:', [injected()])

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [injected()],
  transports: {
    [base.id]: http('https://mainnet.base.org') // Use Base mainnet RPC
  },
})

console.log('Wagmi config created successfully')
