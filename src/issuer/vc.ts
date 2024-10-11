import { EthrDID, KeyPair } from 'ethr-did'
import { ethers, Wallet } from 'ethers'
import * as dotenv from 'dotenv'
dotenv.config()
const vcpayload = {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    "type": ["VerifiableCredential"],
    "issuer": "did:ethr:sepolia:0x145242286AE8184cA885E6B134E1A1bA73858BE8",
    "issuanceDate": "2024-10-11T04:53:12Z",
    "credentialSubject": {
      "id": "did:ethr:sepolia:0x4D044d473b590169467DD2B6291F4273e2951d58",
      "degree": {
        "type": "BachelorDegree",
        "name": "Bachelor of Science in Computer Science"
      }
    },
    "proof": {
      "type": "EcdsaSecp256k1Signature2019",
      "created": "2024-10-11T04:53:12Z",
      "proofPurpose": "assertionMethod",
      "verificationMethod": "did:ethr:sepolia:0x145242286AE8184cA885E6B134E1A1bA73858BE8#delegate-1",
    }
  }

  const register = (async() => {
    const alchemyApiKey = process.env.ALCHEMY_API_KEY!!;
    const privateKey = process.env.PRIVATE_KEY!!;
    const wallet = new Wallet(privateKey);
    const pubkey = wallet.signingKey.publicKey;
    const address = wallet.address
    
    const provider = new ethers.AlchemyProvider("sepolia", alchemyApiKey);
    const txSigner = new Wallet(privateKey, provider)
  
    const keypair: KeyPair = {
        privateKey,
        publicKey: pubkey,
        address,
        identifier: address,
    }
    // ユーザーのDID作成
    const ethrDid = new EthrDID({
        ...keypair,
        provider: provider,
        txSigner: txSigner, // こいつを渡さないと失敗する https://github.com/uport-project/ethr-did/issues/81#issuecomment-1030181286
        chainNameOrId: 'sepolia',
        registry: '0x03d5003bf0e79C5F5223588F347ebA39AfbC3818'
    })

    const jwt = await ethrDid.signJWT(vcpayload)
    console.log(jwt)
  })
register();