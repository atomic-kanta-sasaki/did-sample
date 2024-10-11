import { Resolver } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver'
import { verifyCredential } from 'did-jwt-vc';
import * as dotenv from 'dotenv'
dotenv.config()
const verify = (async() => {
    const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE3Mjg2MzkwNzgsIkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiXSwiaXNzdWVyIjoiZGlkOmV0aHI6c2Vwb2xpYToweDE0NTI0MjI4NkFFODE4NGNBODg1RTZCMTM0RTFBMWJBNzM4NThCRTgiLCJpc3N1YW5jZURhdGUiOiIyMDI0LTEwLTExVDA0OjUzOjEyWiIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmV0aHI6c2Vwb2xpYToweDREMDQ0ZDQ3M2I1OTAxNjk0NjdERDJCNjI5MUY0MjczZTI5NTFkNTgiLCJkZWdyZWUiOnsidHlwZSI6IkJhY2hlbG9yRGVncmVlIiwibmFtZSI6IkJhY2hlbG9yIG9mIFNjaWVuY2UgaW4gQ29tcHV0ZXIgU2NpZW5jZSJ9fSwicHJvb2YiOnsidHlwZSI6IkVjZHNhU2VjcDI1NmsxU2lnbmF0dXJlMjAxOSIsImNyZWF0ZWQiOiIyMDI0LTEwLTExVDA0OjUzOjEyWiIsInByb29mUHVycG9zZSI6ImFzc2VydGlvbk1ldGhvZCIsInZlcmlmaWNhdGlvbk1ldGhvZCI6ImRpZDpldGhyOnNlcG9saWE6MHgxNDUyNDIyODZBRTgxODRjQTg4NUU2QjEzNEUxQTFiQTczODU4QkU4I2RlbGVnYXRlLTEifSwiaXNzIjoiZGlkOmV0aHI6c2Vwb2xpYToweDE0NTI0MjI4NkFFODE4NGNBODg1RTZCMTM0RTFBMWJBNzM4NThCRTgifQ.5rF6nU09Sv89UTTezaCp9YpHBJ9G_7a_cEtQWTWxi7UHlnPFPScy4iwzYb3_PCJ6QKwTr5JYrlXH1TqW6a0E7QA"
    console.log(jwt);
    
    const providerConfig = {
        // While experimenting, you can set a rpc endpoint to be used by the web3 provider
        rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
        // You can also set the address for your own ethr-did-registry (ERC1056) contract
          registry: '0x03d5003bf0e79C5F5223588F347ebA39AfbC3818',
          name: 'sepolia' // this becomes did:ethr:development:0x...
        }
    
        // It's recommended to use the multi-network configuration when using this in production
        // since that allows you to resolve on multiple public and private networks at the same time.
        
        // getResolver will return an object with a key/value pair of { "ethr": resolver } where resolver is a function used by the generic did resolver.
        const ethrDidResolver = getResolver(providerConfig)
        const didResolver = new Resolver(ethrDidResolver)
    const result = await verifyCredential(jwt, didResolver);
    console.log(result);
});

verify();