import { EthrDID, KeyPair } from 'ethr-did'
import { ethers, Wallet } from 'ethers'
import * as dotenv from 'dotenv'
dotenv.config()
// 署名用の公開鍵の設定
// ここが唯一ブロックチェーンを使用している処理
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
        identifier: pubkey,
    }
    // ユーザーのDID作成
    const ethrDid = new EthrDID({
        ...keypair,
        provider: provider,
        txSigner: txSigner, // こいつを渡さないと失敗する https://github.com/uport-project/ethr-did/issues/81#issuecomment-1030181286
        chainNameOrId: 'sepolia',
        registry: '0x03d5003bf0e79C5F5223588F347ebA39AfbC3818'
    })
    // DID登録
    await ethrDid.setAttribute('did/pub/Secp256k1/sigAuth/hex', pubkey, 31104000)
})
register()