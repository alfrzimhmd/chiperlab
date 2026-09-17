import { CryptoResult } from '../../types/crypto';
import { bytesToHex, hexToBytes } from './aes';

export interface RsaKeyPair {
  publicKeyPem: string;
  privateKeyPem: string;
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

// Convert binary ArrayBuffer to PEM format
function arrayBufferToPem(buffer: ArrayBuffer, label: string): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  const formatted = base64.match(/.{1,64}/g)?.join('\n') || base64;
  return `-----BEGIN ${label}-----\n${formatted}\n-----END ${label}-----`;
}

// Convert PEM string to ArrayBuffer
function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN [A-Z ]+-----/, '')
    .replace(/-----END [A-Z ]+-----/, '')
    .replace(/\s+/g, '');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Generate an RSA-OAEP key pair
export async function generateRsaKeyPair(modulusLength: number = 2048): Promise<RsaKeyPair> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength,
      publicExponent: new Uint8Array([1, 0, 1]), // 65537
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  );

  const exportedPublic = await crypto.subtle.exportKey('spki', keyPair.publicKey);
  const exportedPrivate = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

  const publicKeyPem = arrayBufferToPem(exportedPublic, 'PUBLIC KEY');
  const privateKeyPem = arrayBufferToPem(exportedPrivate, 'RSA PRIVATE KEY');

  return {
    publicKeyPem,
    privateKeyPem,
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
  };
}

export async function rsaEncrypt(
  plaintext: string,
  publicKeyPem: string
): Promise<CryptoResult> {
  const startTime = performance.now();
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  const keyBuffer = pemToArrayBuffer(publicKeyPem);
  const publicKey = await crypto.subtle.importKey(
    'spki',
    keyBuffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false,
    ['encrypt']
  );

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    data
  );

  const hex = bytesToHex(new Uint8Array(encryptedBuffer));
  const durationMs = performance.now() - startTime;

  return {
    output: hex,
    meta: {
      algorithm: 'RSA-OAEP (2048-bit, SHA-256)',
      mode: 'encrypt',
      inputLength: plaintext.length,
      outputLength: hex.length,
      durationMs: Math.round(durationMs * 100) / 100,
      keyInfo: 'Encrypted with 2048-bit RSA Public Key using Optimal Asymmetric Encryption Padding (OAEP)',
    },
  };
}

export async function rsaDecrypt(
  ciphertextHex: string,
  privateKeyPem: string
): Promise<CryptoResult> {
  const startTime = performance.now();
  const cipherBytes = hexToBytes(ciphertextHex.trim());

  const keyBuffer = pemToArrayBuffer(privateKeyPem);
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    keyBuffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false,
    ['decrypt']
  );

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    cipherBytes
  );

  const decoder = new TextDecoder();
  const plaintext = decoder.decode(decryptedBuffer);
  const durationMs = performance.now() - startTime;

  return {
    output: plaintext,
    meta: {
      algorithm: 'RSA-OAEP (2048-bit, SHA-256)',
      mode: 'decrypt',
      inputLength: ciphertextHex.length,
      outputLength: plaintext.length,
      durationMs: Math.round(durationMs * 100) / 100,
      keyInfo: 'Decrypted with 2048-bit RSA Private Key',
    },
  };
}
