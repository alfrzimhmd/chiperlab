import { CryptoResult, TransformationStep } from '../../types/crypto';

export function xorCipher(
  text: string,
  key: string,
  mode: 'encrypt' | 'decrypt' = 'encrypt',
  outputFormat: 'hex' | 'raw' = 'hex'
): CryptoResult {
  const startTime = performance.now();

  if (!key) {
    return {
      output: text,
      steps: [],
      meta: {
        algorithm: 'XOR Cipher',
        mode,
        inputLength: text.length,
        outputLength: text.length,
        keyInfo: 'Key is required for XOR operation.',
      },
    };
  }

  const steps: TransformationStep[] = [];
  let processedInput = text;

  // If decrypting from hex, convert hex pairs to characters first
  if (mode === 'decrypt' && outputFormat === 'hex' && /^[0-9A-Fa-f\s]+$/.test(text)) {
    const cleanHex = text.replace(/\s+/g, '');
    let decoded = '';
    for (let i = 0; i < cleanHex.length; i += 2) {
      decoded += String.fromCharCode(parseInt(cleanHex.substring(i, i + 2), 16));
    }
    processedInput = decoded;
  }

  let rawOutput = '';
  const hexParts: string[] = [];

  for (let i = 0; i < processedInput.length; i++) {
    const charCode = processedInput.charCodeAt(i);
    const keyChar = key[i % key.length];
    const keyCode = keyChar.charCodeAt(0);
    const xorCode = charCode ^ keyCode;
    const outChar = String.fromCharCode(xorCode);

    rawOutput += outChar;
    const hex = xorCode.toString(16).padStart(2, '0').toUpperCase();
    hexParts.push(hex);

    const inputBin = charCode.toString(2).padStart(8, '0');
    const keyBin = keyCode.toString(2).padStart(8, '0');
    const outBin = xorCode.toString(2).padStart(8, '0');

    steps.push({
      index: i,
      inputChar: processedInput[i],
      outputChar: mode === 'encrypt' ? hex : (outChar.charCodeAt(0) < 32 ? `\\x${hex}` : outChar),
      explanation: `'${processedInput[i]}' (0x${charCode.toString(16).padStart(2, '0')}) XOR '${keyChar}' (0x${keyCode.toString(16).padStart(2, '0')}) = 0x${hex}`,
      substeps: [
        { label: 'Input Byte', value: `${inputBin} (dec ${charCode})` },
        { label: 'Key Byte', value: `${keyBin} ('${keyChar}')` },
        { label: 'Bitwise XOR', value: `${outBin} (hex 0x${hex})` },
      ],
    });
  }

  const finalOutput = (mode === 'encrypt' && outputFormat === 'hex')
    ? hexParts.join(' ')
    : rawOutput;

  const durationMs = performance.now() - startTime;

  return {
    output: finalOutput,
    steps,
    meta: {
      algorithm: 'XOR Cipher',
      mode,
      inputLength: text.length,
      outputLength: finalOutput.length,
      durationMs: Math.round(durationMs * 100) / 100,
      keyInfo: `Key: "${key}" | Reversible bitwise XOR logic`,
    },
  };
}

export const xorEncrypt = (text: string, key: string, format: 'hex' | 'raw' = 'hex') =>
  xorCipher(text, key, 'encrypt', format);
export const xorDecrypt = (text: string, key: string, format: 'hex' | 'raw' = 'hex') =>
  xorCipher(text, key, 'decrypt', format);
