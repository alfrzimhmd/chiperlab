import { CryptoResult, TransformationStep } from '../../types/crypto';

export function atbashCipher(
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
      const reversedPos = 25 - originalPos;
      const newChar = String.fromCharCode(65 + reversedPos);
      result += newChar;

      steps.push({
        index: i,
        inputChar: char,
        outputChar: newChar,
        explanation: `${char} (pos ${originalPos}) mirrored to ${newChar} (pos ${reversedPos})`,
        substeps: [
          { label: 'Alphabet Index', value: originalPos },
          { label: 'Inversion Formula', value: `25 - ${originalPos} = ${reversedPos}` },
          { label: 'Mirrored Letter', value: newChar },
        ],
      });
    } else if (code >= 97 && code <= 122) {
      // Lowercase a-z
      const originalPos = code - 97;
      const reversedPos = 25 - originalPos;
      const newChar = String.fromCharCode(97 + reversedPos);
      result += newChar;

      steps.push({
        index: i,
        inputChar: char,
        outputChar: newChar,
        explanation: `${char} (pos ${originalPos}) mirrored to ${newChar} (pos ${reversedPos})`,
        substeps: [
          { label: 'Alphabet Index', value: originalPos },
          { label: 'Inversion Formula', value: `25 - ${originalPos} = ${reversedPos}` },
          { label: 'Mirrored Letter', value: newChar },
        ],
      });
    } else {
      result += char;
      steps.push({
        index: i,
        inputChar: char,
        outputChar: char,
        explanation: 'Preserved without inversion.',
      });
    }
  }

  const durationMs = performance.now() - startTime;

  return {
    output: result,
    steps,
    meta: {
      algorithm: 'Atbash Cipher',
      mode,
      inputLength: text.length,
      outputLength: result.length,
      durationMs: Math.round(durationMs * 100) / 100,
      keyInfo: 'Fixed alphabet inversion: A ↔ Z, B ↔ Y',
    },
  };
}

export const atbashEncrypt = (text: string) => atbashCipher(text, 'encrypt');
export const atbashDecrypt = (text: string) => atbashCipher(text, 'decrypt');
