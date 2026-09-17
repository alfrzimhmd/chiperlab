import { HashType } from '../../types/crypto';

export interface HashResult {
  algorithm: HashType;
  input: string;
  hex: string;
  output: string;
  bitLength: number;
  byteLength: number;
  inputByteLength: number;
  durationMs: number;
  executionDurationMs: number;
}

export async function computeHash(
  text: string,
  algorithm: HashType = 'SHA-256'
): Promise<HashResult> {
  const startTime = performance.now();
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  const durationMs = performance.now() - startTime;

  return {
    algorithm,
    input: text,
    hex,
    output: hex,
    bitLength: hashArray.length * 8,
    byteLength: hashArray.length,
    inputByteLength: data.length,
    durationMs: Math.round(durationMs * 100) / 100,
    executionDurationMs: Math.round(durationMs * 100) / 100,
  };
}

export async function computeSha256(text: string): Promise<HashResult> {
  return computeHash(text, 'SHA-256');
}

export async function computeSha512(text: string): Promise<HashResult> {
  return computeHash(text, 'SHA-512');
}

export interface AvalancheComparison {
  hashA: string;
  hashB: string;
  differentBits: number;
  totalBits: number;
  percentFlipped: number;
  differentChars: number;
  totalChars: number;
}

export async function compareHashes(
  inputA: string,
  inputB: string,
  algorithm: HashType = 'SHA-256'
): Promise<AvalancheComparison> {
  const [resA, resB] = await Promise.all([
    computeHash(inputA, algorithm),
    computeHash(inputB, algorithm),
  ]);

  const hexA = resA.hex;
  const hexB = resB.hex;
  const totalBits = resA.bitLength;

  // Count bit-level differences
  let differentBits = 0;
  for (let i = 0; i < hexA.length; i += 2) {
    const byteA = parseInt(hexA.substring(i, i + 2), 16) || 0;
    const byteB = parseInt(hexB.substring(i, i + 2), 16) || 0;
    let xor = byteA ^ byteB;
    while (xor > 0) {
      if (xor & 1) differentBits++;
      xor >>= 1;
    }
  }

  // Count character differences
  let differentChars = 0;
  for (let i = 0; i < hexA.length; i++) {
    if (hexA[i] !== hexB[i]) differentChars++;
  }

  const percentFlipped = Math.round((differentBits / totalBits) * 1000) / 10;

  return {
    hashA: hexA,
    hashB: hexB,
    differentBits,
    totalBits,
    percentFlipped,
    differentChars,
    totalChars: hexA.length,
  };
}
