import { CryptoResult, TransformationStep } from '../../types/crypto';

/**
 * ROT13 — Self-inverse letter rotation.
 *
 * A Caesar cipher with a fixed shift of 13. Because 13 + 13 = 26,
 * applying ROT13 twice returns the original text. It provides
 * ZERO cryptographic security and is used for obfuscation only.
 *
 * Note: Although technically a cipher, ROT13 is grouped with
 * encoding in ChiperLab because it has no key and serves a
 * non-security purpose (hiding spoilers, puzzle answers).
 */

export function rot13Cipher(
  text: string,
  mode: 'encrypt' | 'decrypt' = 'encrypt'
): CryptoResult {
  const startTime = performance.now();
  const steps: TransformationStep[] = [];
  let result = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = char.charCodeAt(0);

    if (code >= 65 && code <= 90) {
      // Uppercase A-Z
      const originalPos = code - 65;
      const newPos = (originalPos + 13) % 26;
      const newChar = String.fromCharCode(65 + newPos);
      result += newChar;

      steps.push({
        index: i,
        inputChar: char,
        outputChar: newChar,
        explanation: `${char} (pos ${originalPos}) + 13 mod 26 = ${newChar} (pos ${newPos})`,
        substeps: [
          { label: 'Alphabet Index', value: originalPos },
          { label: 'Formula', value: `(${originalPos} + 13) % 26 = ${newPos}` },
          { label: 'Output', value: newChar },
        ],
      });
    } else if (code >= 97 && code <= 122) {
      // Lowercase a-z
      const originalPos = code - 97;
      const newPos = (originalPos + 13) % 26;
      const newChar = String.fromCharCode(97 + newPos);
      result += newChar;

      steps.push({
        index: i,
        inputChar: char,
        outputChar: newChar,
        explanation: `${char} (pos ${originalPos}) + 13 mod 26 = ${newChar} (pos ${newPos})`,
        substeps: [
          { label: 'Alphabet Index', value: originalPos },
          { label: 'Formula', value: `(${originalPos} + 13) % 26 = ${newPos}` },
          { label: 'Output', value: newChar },
        ],
      });
    } else {
      result += char;
      steps.push({
        index: i,
        inputChar: char,
        outputChar: char,
        explanation: 'Non-alphabetic character preserved unchanged.',
      });
    }
  }

  const durationMs = performance.now() - startTime;

  return {
    output: result,
    steps,
    meta: {
      algorithm: 'ROT13',
      mode,
      inputLength: text.length,
      outputLength: result.length,
      durationMs: Math.round(durationMs * 100) / 100,
      keyInfo:
        'Fixed shift of 13 — self-inverse (ROT13 of ROT13 = original). NOT encryption.',
    },
  };
}

// Same function for both directions (involution)
export const rot13Encrypt = (text: string) => rot13Cipher(text, 'encrypt');
export const rot13Decrypt = (text: string) => rot13Cipher(text, 'decrypt');