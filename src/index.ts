import { Resolver } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver'
import { ethers } from 'ethers';
import * as dotenv from 'dotenv'
dotenv.config()
const hoge =(async () => {
  const providerConfig = {
    // While experimenting, you can set a rpc endpoint to be used by the web3 provider
      rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    // You can also set the address for your own ethr-did-registry (ERC1056) contract
      registry: '0x03d5003bf0e79C5F5223588F347ebA39AfbC3818',
      name: 'sepolia' // this becomes did:ethr:development:0x...
    }

    const provider = new ethers.AlchemyProvider(providerConfig.name, providerConfig.rpcUrl);

    
    // It's recommended to use the multi-network configuration when using this in production
    // since that allows you to resolve on multiple public and private networks at the same time.
    
    // getResolver will return an object with a key/value pair of { "ethr": resolver } where resolver is a function used by the generic did resolver.
    const ethrDidResolver = getResolver(providerConfig)
    const didResolver = new Resolver(ethrDidResolver)

    
    didResolver
      .resolve('did:ethr:sepolia:0x4D044d473b590169467DD2B6291F4273e2951d58')
      .then((result) => console.dir(result, { depth: 3 }))
      .catch((error) => console.error(error))
    
})

hoge()