import { CLASSICAL_ALGORITHMS } from './algorithms/classical';
import { MODERN_ALGORITHMS } from './algorithms/modern';
import { HASHING_ALGORITHMS } from './algorithms/hashing';
import { ENCODING_ALGORITHMS } from './algorithms/encoding';

// Re-export shared types for consumers
export type {
  AlgorithmDetail,
  AlgorithmSection,
  AlgorithmReference,
} from './algorithms/_types';

import type { AlgorithmDetail } from './algorithms/_types';
import type { AlgorithmCategory } from '../types/crypto';

/**
 * Master catalog of all 14 cryptographic algorithms,
 * ordered by category: classical → modern → hashing → encoding.
 *
 * Categories:
 *   - Classical (1-4):   Historical ciphers — Caesar, Atbash, Vigenère, XOR
 *   - Modern (5-8):      Production ciphers — AES-GCM, RSA-OAEP, ChaCha20-Poly1305, HMAC-SHA256
 *   - Hashing (9-11):    One-way functions — SHA-256, SHA-512, MD5
 *   - Encoding (12-14):  Transport formats — Base64, Hex, ROT13
 *
 * Total: 14 algorithms across 4 families.
 */
export const ALGORITHMS: AlgorithmDetail[] = [
  ...CLASSICAL_ALGORITHMS,
  ...MODERN_ALGORITHMS,
  ...HASHING_ALGORITHMS,
  ...ENCODING_ALGORITHMS,
];

/**
 * Get all algorithms in a specific category.
 *
 * @example
 *   getAlgorithmsByCategory('modern')  // → [AES, RSA, ChaCha20, HMAC]
 */
export function getAlgorithmsByCategory(
  category: AlgorithmCategory
): AlgorithmDetail[] {
  return ALGORITHMS.filter(a => a.category === category);
}

/**
 * Look up a single algorithm by its ID.
 *
 * @example
 *   getAlgorithmById('caesar')  // → Caesar cipher entry
 *   getAlgorithmById('nonexistent')  // → undefined
 */
export function getAlgorithmById(id: string): AlgorithmDetail | undefined {
  return ALGORITHMS.find(a => a.id === id);
}

/**
 * Get the total count of algorithms in the catalog.
 */
export function getAlgorithmCount(): number {
  return ALGORITHMS.length;
}