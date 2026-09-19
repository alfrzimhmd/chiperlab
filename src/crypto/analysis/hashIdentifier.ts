// ============================================================
// Hash Identifier
// Deteksi tipe hash berdasarkan panjang + format.
// ============================================================

export interface HashMatch {
  name: string;
  confidence: 'high' | 'medium' | 'low';
  security: 'broken' | 'weak' | 'ok' | 'strong';
  description: string;
  notes: string[];
}

export interface HashIdentifierResult {
  input: string;
  length: number;
  charset: 'hex' | 'base64' | 'bcrypt' | 'argon2' | 'unknown';
  matches: HashMatch[];
  warning?: string;
}

const HEX_RE = /^[0-9a-fA-F]+$/;
const BASE64_RE = /^[A-Za-z0-9+/=]+$/;

export function identifyHash(input: string): HashIdentifierResult {
  const trimmed = input.trim();
  const length = trimmed.length;

  const isHex = HEX_RE.test(trimmed);
  const isBase64 = !isHex && BASE64_RE.test(trimmed) && length % 4 === 0;
  const isBcrypt = /^\$2[aby]?\$\d{2}\$/.test(trimmed);
  const isArgon2 = /^\$argon2(id|i|d)\$/.test(trimmed);
  const isSHA512Crypt = /^\$6\$/.test(trimmed);
  const isSHA256Crypt = /^\$5\$/.test(trimmed);
  const isMD5Crypt = /^\$1\$/.test(trimmed);

  let charset: HashIdentifierResult['charset'] = 'unknown';
  if (isBcrypt) charset = 'bcrypt';
  else if (isArgon2) charset = 'argon2';
  else if (isHex) charset = 'hex';
  else if (isBase64) charset = 'base64';

  const matches: HashMatch[] = [];
  let warning: string | undefined;

  // ===== Bcrypt =====
  if (isBcrypt) {
    matches.push({
      name: 'bcrypt',
      confidence: 'high',
      security: 'strong',
      description: 'Adaptive password hashing function based on Blowfish.',
      notes: [
        'Designed for password storage — intentionally slow',
        'Cost factor (10–12) makes brute-force expensive',
        'Format: $2a$ / $2b$ / $2y$ + cost + 22-char salt + 31-char hash',
      ],
    });
  }

  // ===== Argon2 =====
  if (isArgon2) {
    matches.push({
      name: 'Argon2',
      confidence: 'high',
      security: 'strong',
      description: 'Winner of the 2015 Password Hashing Competition.',
      notes: [
        'Memory-hard — resists GPU/ASIC attacks',
        'Variants: Argon2id (recommended), Argon2i, Argon2d',
        'OWASP recommends Argon2id for new applications',
      ],
    });
  }

  // ===== SHA-512 Crypt =====
  if (isSHA512Crypt) {
    matches.push({
      name: 'SHA-512 Crypt',
      confidence: 'high',
      security: 'ok',
      description: 'Unix SHA-512 crypt format ($6$).',
      notes: [
        'Used in /etc/shadow on modern Linux',
        'Iterated SHA-512 with salt',
        'Not as strong as bcrypt/Argon2 for passwords',
      ],
    });
  }

  // ===== SHA-256 Crypt =====
  if (isSHA256Crypt) {
    matches.push({
      name: 'SHA-256 Crypt',
      confidence: 'high',
      security: 'ok',
      description: 'Unix SHA-256 crypt format ($5$).',
      notes: ['Used in /etc/shadow on older Linux'],
    });
  }

  // ===== MD5 Crypt =====
  if (isMD5Crypt) {
    matches.push({
      name: 'MD5 Crypt',
      confidence: 'high',
      security: 'broken',
      description: 'Unix MD5 crypt format ($1$).',
      notes: [
        'Deprecated — MD5 collisions are trivial',
        'Do NOT use for new systems',
        'Still seen in legacy /etc/shadow',
      ],
    });
  }

  // ===== Hex-based hashes =====
  if (isHex) {
    if (length === 8) {
      matches.push({
        name: 'CRC-32 / FNV-32',
        confidence: 'low',
        security: 'broken',
        description: '32-bit checksum — NOT cryptographic.',
        notes: ['Used for data integrity, not security'],
      });
    }
    if (length === 32) {
      matches.push({
        name: 'MD5',
        confidence: 'high',
        security: 'broken',
        description: '128-bit cryptographic hash (RFC 1321).',
        notes: [
          'Collisions found in 2004 — trivial to forge',
          'Do NOT use for signatures or passwords',
        ],
      });
      matches.push({
        name: 'NTLM',
        confidence: 'medium',
        security: 'weak',
        description: 'Microsoft Windows password hash (MD4-based).',
        notes: ['Vulnerable to rainbow tables', 'Superseded by Kerberos'],
      });
    }
    if (length === 40) {
      matches.push({
        name: 'SHA-1',
        confidence: 'high',
        security: 'broken',
        description: '160-bit cryptographic hash (RFC 3174).',
        notes: [
          'Chosen-prefix collision demonstrated in 2017',
          'Deprecated by NIST since 2011',
        ],
      });
      matches.push({
        name: 'RIPEMD-160',
        confidence: 'low',
        security: 'ok',
        description: '160-bit hash used in Bitcoin addresses.',
        notes: ['Used in Bitcoin P2PKH address derivation'],
      });
    }
    if (length === 56) {
      matches.push({
        name: 'SHA-224',
        confidence: 'high',
        security: 'strong',
        description: '224-bit truncated SHA-2 variant.',
        notes: ['Rarely used; SHA-256 is preferred'],
      });
    }
    if (length === 64) {
      matches.push({
        name: 'SHA-256',
        confidence: 'high',
        security: 'strong',
        description: '256-bit cryptographic hash (FIPS 180-4).',
        notes: [
          'Industry standard for integrity',
          'No practical collisions known',
          'Used in Bitcoin, TLS, JWT (HS256)',
        ],
      });
      matches.push({
        name: 'SHA3-256 / Keccak-256',
        confidence: 'medium',
        security: 'strong',
        description: '256-bit SHA-3 or Ethereum Keccak.',
        notes: ['Same length as SHA-256 — cannot distinguish without context'],
      });
      matches.push({
        name: 'BLAKE2s-256',
        confidence: 'low',
        security: 'strong',
        description: 'Modern 256-bit hash — faster than SHA-256.',
        notes: ['Used in Argon2, WireGuard'],
      });
    }
    if (length === 96) {
      matches.push({
        name: 'SHA-384',
        confidence: 'high',
        security: 'strong',
        description: '384-bit truncated SHA-512 variant.',
        notes: ['Used in TLS certificates'],
      });
    }
    if (length === 128) {
      matches.push({
        name: 'SHA-512',
        confidence: 'high',
        security: 'strong',
        description: '512-bit cryptographic hash (FIPS 180-4).',
        notes: ['Used in TLS, Ed25519 signatures'],
      });
      matches.push({
        name: 'SHA3-512 / Whirlpool',
        confidence: 'medium',
        security: 'strong',
        description: '512-bit SHA-3 or Whirlpool.',
        notes: ['Same length as SHA-512 — context needed'],
      });
    }
  }

  // ===== Base64-based =====
  if (isBase64) {
    if (length === 44) {
      matches.push({
        name: 'SHA-256 (Base64)',
        confidence: 'medium',
        security: 'strong',
        description: 'SHA-256 hash, base64-encoded (32 bytes → 44 chars).',
        notes: ['Base64 variant of SHA-256'],
      });
    }
    if (length === 24) {
      matches.push({
        name: 'MD5 (Base64)',
        confidence: 'medium',
        security: 'broken',
        description: 'MD5 hash, base64-encoded (16 bytes → 24 chars).',
        notes: ['Legacy format, still seen in Java apps'],
      });
    }
  }

  // Warning kalau panjang tidak match pattern apa pun
  if (matches.length === 0) {
    if (length === 0) {
      warning = 'Input is empty.';
    } else if (!isHex && !isBase64 && !isBcrypt && !isArgon2) {
      warning =
        'Input is not a recognized hash format (hex/base64/bcrypt/Argon2).';
    } else {
      warning = `No common hash algorithm has length ${length}. It may be a non-standard hash or a truncated/encoded value.`;
    }
  }

  return {
    input: trimmed,
    length,
    charset,
    matches,
    warning,
  };
}