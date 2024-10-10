import React, { useState } from 'react';
import { Buffer } from 'buffer';
import { generateKeyPair, exportJWK, SignJWT, jwtVerify } from 'jose';
import { encode } from 'base64-url';

const App = () => {
  const [pin, setPin] = useState('');
  const [ticket, setTicket] = useState(null);
  const [verificationPin, setVerificationPin] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [publicJWK, setPublicJWK] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);  // 秘密鍵はエクスポートしない

  // 鍵ペアを生成する関数
  const generateKeys = async () => {
    try {
      // P-256 曲線を使って鍵ペアを生成
      const { publicKey, privateKey } = await generateKeyPair('ES256');

      // 公開鍵をJWK形式にエクスポート
      const publicJWK = await exportJWK(publicKey);
      setPublicJWK(publicJWK);
      setPrivateKey(privateKey);  // 秘密鍵を保持

      console.log('Public JWK:', publicJWK);
    } catch (error) {
      console.error('Error generating JWK:', error);
    }
  };

  // チケット（JWT）を生成する関数
  const createTicket = async () => {
    if (!privateKey) {
      alert('まず鍵を生成してください');
      return;
    }

    try {
      // 秘密鍵を使ってJWTを署名
      const url = Buffer.from(JSON.stringify(publicJWK)).toString();
      const base64url = btoa(url).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

      const jwt = await new SignJWT({ pin })
        .setProtectedHeader({ alg: 'ES256' })
        .setIssuer(`did:jwk:${base64url}`) // DID発行者
        .setExpirationTime('2h')
        .sign(privateKey);  // 署名に秘密鍵を使用

      setTicket(jwt);
      console.log('Generated JWT:', jwt);
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  // チケットの検証関数
  const verifyTicket = async () => {
    if (!ticket || !publicJWK) {
      alert('チケットがないか、鍵が生成されていません');
      return;
    }

    try {
      // 公開鍵を使ってJWTの署名を検証
      const { payload } = await jwtVerify(ticket, publicJWK);

      if (payload.pin === verificationPin) {
        setVerificationStatus('PIN verified, ticket valid!');
      } else {
        setVerificationStatus('Invalid PIN or ticket.');
      }
    } catch (error) {
      console.error('Error verifying ticket:', error);
      setVerificationStatus('Error verifying ticket.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>DID JWK Ticket Demo</h1>

      {/* 鍵ペアの生成 */}
      <button onClick={generateKeys}>鍵ペアを生成</button>

      {/* PIN入力とチケット生成 */}
      <div>
        <h2>チケットの発行</h2>
        <input
          type="text"
          placeholder="PINを入力"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <button onClick={createTicket}>チケットを発行</button>
      </div>

      {/* 生成されたJWTの表示 */}
      {ticket && (
        <div>
          <h3>生成されたチケット（JWT）:</h3>
          <textarea readOnly value={ticket} rows={4} cols={50} />
        </div>
      )}

      {/* PINの検証とチケットの確認 */}
      <div>
        <h2>チケットの検証</h2>
        <input
          type="text"
          placeholder="PINを入力して検証"
          value={verificationPin}
          onChange={(e) => setVerificationPin(e.target.value)}
        />
        <button onClick={verifyTicket}>チケットを検証</button>

        {/* 検証結果の表示 */}
        {verificationStatus && <p>{verificationStatus}</p>}
      </div>
    </div>
  );
};

export default App;
