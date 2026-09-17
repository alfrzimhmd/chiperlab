import { CryptoResult, TransformationStep } from '../../types/crypto';

export function vigenereCipher(
  text: string,
  key: string,
  mode: 'encrypt' | 'decrypt' = 'encrypt'
): CryptoResult {
  const startTime = performance.now();
  const cleanedKey = key.replace(/[^a-zA-Z]/g, '').toUpperCase();

  if (!cleanedKey) {
    return {
      output: text,
      steps: [],
      meta: {
        algorithm: 'Vigenère Cipher',
        mode,
        inputLength: text.length,
        outputLength: text.length,
        keyInfo: 'Key must contain at least one letter.',
      },
    };
  }

  const steps: TransformationStep[] = [];
  let result = '';
  let keyIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = char.charCodeAt(0);
    const isUpper = code >= 65 && code <= 90;
    const isLower = code >= 97 && code <= 122;

    if (isUpper || isLower) {
      const base = isUpper ? 65 : 97;
      const originalPos = code - base;

      const currentKeyChar = cleanedKey[keyIndex % cleanedKey.length];
      const keyShift = currentKeyChar.charCodeAt(0) - 65;

      const effectiveShift = mode === 'encrypt' ? keyShift : (26 - keyShift) % 26;
      const newPos = (originalPos + effectiveShift) % 26;
      const newChar = String.fromCharCode(base + newPos);

      result += newChar;

      steps.push({
        index: i,
        inputChar: char,
        outputChar: newChar,
        explanation: `${char} paired with key letter '${currentKeyChar}' (shift ${keyShift}) → ${newChar}`,
        substeps: [
          { label: 'Key Character', value: currentKeyChar },
          { label: 'Key Shift Value', value: keyShift },
          { label: 'Alphabet Position', value: originalPos },
          {
            label: 'Calculation',
            value: mode === 'encrypt'
              ? `(${originalPos} + ${keyShift}) % 26 = ${newPos}`
              : `(${originalPos} - ${keyShift} + 26) % 26 = ${newPos}`,
          },
          { label: 'Output Character', value: newChar },
        ],
      });

      keyIndex++;
    } else {
      result += char;
      steps.push({
        index: i,
        inputChar: char,
        outputChar: char,
        explanation: 'Non-alphabetic character preserved without shifting.',
      });
    }
  }

  const durationMs = performance.now() - startTime;

  return {
    output: result,
    steps,
    meta: {
      algorithm: 'Vigenère Cipher',
      mode,
      inputLength: text.length,
      outputLength: result.length,
      durationMs: Math.round(durationMs * 100) / 100,
      keyInfo: `Keyword: ${cleanedKey} (Length: ${cleanedKey.length})`,
    },
  };
}

export const vigenereEncrypt = (text: string, key: string) => vigenereCipher(text, key, 'encrypt');
export const vigenereDecrypt = (text: string, key: string) => vigenereCipher(text, key, 'decrypt');
