import { CryptoResult, TransformationStep } from '../../types/crypto';

export function caesarCipher(
  text: string,
  shift: number,
  mode: 'encrypt' | 'decrypt' = 'encrypt'
): CryptoResult {
  const startTime = performance.now();
  const normalizedShift = ((shift % 26) + 26) % 26;
  const effectiveShift = mode === 'encrypt' ? normalizedShift : (26 - normalizedShift) % 26;

  const steps: TransformationStep[] = [];
  let result = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = char.charCodeAt(0);

    if (code >= 65 && code <= 90) {
      // Uppercase A-Z
      const originalPos = code - 65;
      const newPos = (originalPos + effectiveShift) % 26;
      const newChar = String.fromCharCode(65 + newPos);
      result += newChar;

      steps.push({
        index: i,
        inputChar: char,
        outputChar: newChar,
        explanation: `${char} (pos ${originalPos}) + shift ${effectiveShift} mod 26 = ${newChar} (pos ${newPos})`,
        substeps: [
          { label: 'Alphabet Index', value: originalPos },
          { label: 'Shift Applied', value: mode === 'encrypt' ? `+${shift}` : `-${shift}` },
          { label: 'Formula Result', value: `(${originalPos} + ${effectiveShift}) % 26 = ${newPos}` },
          { label: 'Output Character', value: newChar },
        ],
      });
    } else if (code >= 97 && code <= 122) {
      // Lowercase a-z
      const originalPos = code - 97;
      const newPos = (originalPos + effectiveShift) % 26;
      const newChar = String.fromCharCode(97 + newPos);
      result += newChar;

      steps.push({
        index: i,
        inputChar: char,
        outputChar: newChar,
        explanation: `${char} (pos ${originalPos}) + shift ${effectiveShift} mod 26 = ${newChar} (pos ${newPos})`,
        substeps: [
          { label: 'Alphabet Index', value: originalPos },
          { label: 'Shift Applied', value: mode === 'encrypt' ? `+${shift}` : `-${shift}` },
          { label: 'Formula Result', value: `(${originalPos} + ${effectiveShift}) % 26 = ${newPos}` },
          { label: 'Output Character', value: newChar },
        ],
      });
    } else {
      // Non-alphabet characters remain unchanged
      result += char;
      steps.push({
        index: i,
        inputChar: char,
        outputChar: char,
        explanation: `Non-alphabetic character preserved without shifting.`,
      });
    }
  }

  const durationMs = performance.now() - startTime;

  return {
    output: result,
    steps,
    meta: {
      algorithm: 'Caesar Cipher',
      mode,
      inputLength: text.length,
      outputLength: result.length,
      durationMs: Math.round(durationMs * 100) / 100,
      keyInfo: `Shift = ${normalizedShift} (Effective ${mode}: ${effectiveShift})`,
    },
  };
}

export const caesarEncrypt = (text: string, shift: number) => caesarCipher(text, shift, 'encrypt');
export const caesarDecrypt = (text: string, shift: number) => caesarCipher(text, shift, 'decrypt');
