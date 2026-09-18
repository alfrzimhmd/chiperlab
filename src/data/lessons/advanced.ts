import { Lesson } from '../../types/lesson';

/**
 * Advanced Lessons — Order 13-24
 *
 * Deep-dive mathematical internals, modern algorithm analysis,
 * and real-world attack simulations.
 *
 * Sources:
 * - NIST FIPS 197 (AES)
 * - NIST SP 800-38D (GCM)
 * - NIST FIPS 186-5 (Digital Signature Standard)
 * - NIST SP 800-186 (Elliptic Curve Standards)
 * - NIST FIPS 203/204/205 (Post-Quantum Standards, 2024)
 * - RFC 8017 (PKCS #1: RSA Cryptography Specs)
 * - RFC 2104 (HMAC)
 * - Katz & Lindell, "Introduction to Modern Cryptography" (3rd ed.)
 * - Boneh & Shoup, "A Graduate Course in Applied Cryptography"
 * - Vaudenay, "Security Flaws Induced by CBC Padding" (EUROCRYPT 2002)
 * - Kelsey & Schneier, "Second Preimages on n-bit Hash Functions" (2005)
 * - Kocher, "Timing Attacks on Implementations of Diffie-Hellman, RSA, DSS" (1996)
 */
export const ADVANCED_LESSONS: Lesson[] = [
  // ============================================================
  // LESSON 13 — CAESAR CIPHER DEEP DIVE
  // ============================================================
  {
    id: 'caesar-cipher-deep-dive',
    slug: 'caesar-cipher-deep-dive',
    order: 13,
    title: 'Caesar Cipher Deep Dive',
    category: 'foundations',
    description:
      'Mathematical foundations of the Caesar cipher: modular arithmetic, keyspace analysis, and why it fails against brute-force.',
    difficulty: 'advanced',
    estimatedMinutes: 10,
    xpReward: 35,
    references: [
      {
        title: 'The Code Book: The Science of Secrecy from Ancient Egypt to Quantum Cryptography',
        author: 'S. Singh',
        year: 1999,
        url: 'https://simonsingh.net/books/the-code-book/',
        type: 'book',
      },
      {
        title: 'The Twelve Caesars (Divus Iulius, Chapter 56)',
        author: 'Suetonius',
        year: 121,
        url: 'http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.02.0132',
        type: 'article',
      },
    ],
    tags: ['classical', 'caesar', 'substitution', 'modular-arithmetic'],
    sections: [
      {
        id: 'introduction',
        title: 'Historical Context',
        content: `The Caesar cipher is one of the earliest known substitution ciphers, named after Julius Caesar (100–44 BC) who used it with a shift of 3 to protect military dispatches. According to Suetonius (The Twelve Caesars), Caesar replaced each letter with the one three positions further down the alphabet.

Despite its simplicity, the Caesar cipher introduces foundational concepts that underpin all modern cryptography: **transformation functions**, **keys**, and **modular arithmetic**.`,
        keyPoints: [
          'Monoalphabetic substitution cipher — each letter maps to exactly one other',
          'Keyspace is extremely small (only 25 meaningful shifts)',
          'Vulnerable to brute-force, frequency analysis, and known-plaintext attacks',
        ],
      },
      {
        id: 'concept',
        title: 'Mathematical Formulation',
        content: `Assign each English letter a numeric value: A=0, B=1, ..., Z=25. Encryption of a plaintext character P with shift key K is:

**C = (P + K) mod 26**

Decryption reverses the operation:

**P = (C − K + 26) mod 26**

The "mod 26" ensures we wrap around from Z back to A. This is our first encounter with **modular arithmetic** in cryptography — the mathematical structure that underlies RSA, Diffie-Hellman, and elliptic curve cryptography.`,
        codeSnippet: {
          language: 'typescript',
          code: `// Caesar encryption using modular arithmetic
function caesarEncrypt(plaintext: string, shift: number): string {
  return plaintext
    .toUpperCase()
    .split('')
    .map(ch => {
      const code = ch.charCodeAt(0);
      // Only shift A-Z, preserve other characters
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + shift) % 26) + 65);
      }
      return ch;
    })
    .join('');
}

// Example: shift = 3
caesarEncrypt("HELLO WORLD", 3);
// → "KHOOR ZRUOG"`,
          caption: 'Caesar cipher implementation using modulo 26',
        },
      },
      {
        id: 'example',
        title: 'Keyspace Analysis',
        content: `The Caesar cipher has only 26 possible keys (shifts 0–25), but shift 0 leaves the plaintext unchanged — so only **25 meaningful keys** exist.

An attacker with a modern laptop can test all 25 shifts in less than a millisecond. Even a human can do it by hand in a few minutes by scanning for recognizable English words. This tiny keyspace is why the Caesar cipher is **strictly educational**.

Historical note: Julius Caesar reportedly used shift=3 not for security (which was already weak even in 50 BC) but for **convenience** — a literate enemy could still decode his messages.`,
        keyPoints: [
          'Keyspace size: 26 (or 25 effective)',
          'Brute-force time (modern): < 1 ms',
          'Brute-force time (human): a few minutes',
        ],
      },
      {
        id: 'visualization',
        title: 'Shift Visualization',
        content: `Original:  A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
Shift +3:  D E F G H I J K L M N O P Q R S T U V W X Y Z A B C

Plaintext:  H E L L O   W O R L D
Ciphertext: K H O O R   Z R U O G`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Foundational lessons from the Caesar cipher:',
        keyPoints: [
          'Modular arithmetic (mod 26) is a core cryptographic building block.',
          'The keyspace must be large enough to resist brute-force.',
          'Monoalphabetic ciphers preserve frequency distributions — a fatal flaw.',
        ],
      },
      {
        id: 'exercise',
        title: 'Check Your Knowledge',
        content: 'Test your understanding of the Caesar cipher.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content:
          'You have mastered the mathematical and historical foundations of the Caesar cipher. Next: the Atbash cipher, an even older Hebrew substitution technique.',
      },
    ],
    interactiveExercise: {
      question:
        'If the Caesar cipher uses shift key K=17, what is the ciphertext of the plaintext "CAT"?',
      instruction: 'Encrypt each letter: C→?, A→?, T→? (use mod 26)',
      inputType: 'text',
      correctAnswer: 'TRK',
      hint: 'C(2) + 17 = 19 → T. A(0) + 17 = 17 → R. T(19) + 17 = 36 mod 26 = 10 → K.',
      explanation:
        'C(2)+17=19→T, A(0)+17=17→R, T(19)+17=36 mod 26=10→K. The ciphertext is "TRK".',
    },
  },

  // ============================================================
  // LESSON 14 — ATBASH CIPHER DEEP DIVE
  // ============================================================
  {
    id: 'atbash-cipher-deep-dive',
    slug: 'atbash-cipher-deep-dive',
    order: 14,
    title: 'Atbash Cipher Deep Dive',
    category: 'foundations',
    description:
      'The ancient Hebrew mirror cipher: an involutory substitution that maps A↔Z, B↔Y, C↔X with no key required.',
    difficulty: 'advanced',
    estimatedMinutes: 8,
    xpReward: 30,
    references: [
      {
        title: 'The Code Book: The Science of Secrecy from Ancient Egypt to Quantum Cryptography',
        author: 'S. Singh',
        year: 1999,
        url: 'https://simonsingh.net/books/the-code-book/',
        type: 'book',
      },
      {
        title: 'Jewish Encyclopedia — Atbash',
        author: 'Jewish Encyclopedia Contributors',
        year: 1906,
        url: 'https://www.jewishencyclopedia.com/articles/2060-atbash',
        type: 'article',
      },
    ],
    tags: ['classical', 'atbash', 'hebrew', 'involutory'],
    sections: [
      {
        id: 'introduction',
        title: 'Biblical Origins',
        content: `The Atbash cipher is a monoalphabetic substitution that predates the Common Era, used by Hebrew scribes to encode sacred texts. Its name is derived from the Hebrew alphabet: **Aleph** (א) → **Tav** (ת), **Bet** (ב) → **Shin** (ש) — the first letter maps to the last, the second to the second-to-last, and so on.

The cipher appears in several passages of the Hebrew Bible, including Jeremiah 25:26 and 51:41, where "Babel" (Babylon) is written as "Sheshach" using Atbash.`,
        keyPoints: [
          'Self-inverting (involutory): encryption and decryption are the same operation',
          'No key is required — the substitution is fixed by the alphabet',
          'Preserves letter frequency, making it trivially breakable',
        ],
      },
      {
        id: 'concept',
        title: 'Mathematical Formulation',
        content: `Assign letters numeric values A=0, B=1, ..., Z=25. Atbash applies the transformation:

**C = 25 − P** (for the English 26-letter alphabet)

Because subtraction is symmetric, applying Atbash twice returns the original character:

**Atbash(Atbash(P)) = 25 − (25 − P) = P**

This makes Atbash an example of an **involution** — a function that is its own inverse. Modern cryptographic involutions include the XOR operation and the Feistel network structure used in DES.`,
        codeSnippet: {
          language: 'typescript',
          code: `// Atbash cipher — the same function encrypts and decrypts
function atbash(text: string): string {
  return text
    .toUpperCase()
    .split('')
    .map(ch => {
      const code = ch.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(90 - (code - 65));
      }
      return ch;
    })
    .join('');
}

atbash("HELLO");       // → "SVOOL"
atbash("SVOOL");       // → "HELLO" (same function!)`,
          caption: 'Atbash: involution means f(f(x)) = x',
        },
      },
      {
        id: 'example',
        title: 'Comparison with Caesar',
        content: `Both Atbash and Caesar are monoalphabetic substitutions, but differ in fundamental ways:

| Aspect | Atbash | Caesar |
|---|---|---|
| Key required? | No — fixed inversion | Yes — shift key |
| Involutory? | Yes (self-inverting) | No (needs reverse shift) |
| Frequency leak? | Yes (E still most common) | Yes (shifted) |
| Security | Zero | Zero (brute-forced) |

Both are strictly educational and unsafe for any real-world use.`,
      },
      {
        id: 'visualization',
        title: 'Mirror Mapping',
        content: `Alphabet:  A B C D E F G H I J K L M
Reverse:   Z Y X W V U T S R Q P O N

Alphabet:  N O P Q R S T U V W X Y Z
Reverse:   M L K J I H G F E D C B A

Encryption: A → Z, B → Y, C → X, ..., M → N
Decryption: Z → A, Y → B, X → C, ..., N → M`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Foundational lessons from Atbash:',
        keyPoints: [
          'Involutory functions (f(f(x)) = x) appear throughout modern cryptography.',
          'Fixed-substitution ciphers provide zero confidentiality.',
          'Atbash preserves frequency statistics — vulnerable to analysis.',
        ],
      },
      {
        id: 'exercise',
        title: 'Checkpoint',
        content: 'Test your understanding of Atbash.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content:
          'You understand the mathematical structure of involutory ciphers. Next: the Vigenère cipher, which defeated cryptanalysts for three centuries.',
      },
    ],
    interactiveExercise: {
      question: 'What is the Atbash ciphertext of the plaintext "KRYPTO"?',
      instruction: 'Map each letter to its mirror: K→?, R→?, etc.',
      inputType: 'text',
      correctAnswer: 'PIBKGL',
      hint: 'K(10)→25-10=15→P, R(17)→8→I, Y(24)→1→B, P(15)→10→K, T(19)→6→G, O(14)→11→L',
      explanation:
        'K(10)→P, R(17)→I, Y(24)→B, P(15)→K, T(19)→G, O(14)→L. Result: "PIBKGL".',
    },
  },

  // ============================================================
  // LESSON 15 — VIGENÈRE CIPHER & KASISKI EXAMINATION
  // ============================================================
  {
    id: 'vigenere-cipher-analysis',
    slug: 'vigenere-cipher-analysis',
    order: 15,
    title: 'Vigenère Cipher & Kasiski Examination',
    category: 'mechanisms',
    description:
      'The polyalphabetic cipher once called "le chiffre indéchiffrable" — and how Kasiski and Babbage finally broke it.',
    difficulty: 'advanced',
    estimatedMinutes: 14,
    xpReward: 45,
    references: [
      {
        title: 'The Code Book: The Science of Secrecy from Ancient Egypt to Quantum Cryptography',
        author: 'S. Singh',
        year: 1999,
        url: 'https://simonsingh.net/books/the-code-book/',
        type: 'book',
      },
      {
        title: 'Introduction to Modern Cryptography (3rd Edition)',
        author: 'J. Katz, Y. Lindell',
        year: 2020,
        url: 'https://www.taylorfrancis.com/books/mono/10.1201/9781351133036/introduction-modern-cryptography-jonathan-katz-yehuda-lindell',
        type: 'book',
      },
    ],
    tags: ['classical', 'vigenere', 'polyalphabetic', 'kasiski', 'cryptanalysis'],
    sections: [
      {
        id: 'introduction',
        title: 'Three Centuries of Invincibility',
        content: `The Vigenère cipher was first described by Giovan Battista Bellaso in 1553 (later misattributed to Blaise de Vigenère). It uses a **keyword** to apply a different Caesar shift to each letter of the plaintext, defeating the frequency analysis that broke simple monoalphabetic ciphers.

For nearly 300 years, the Vigenère cipher was considered unbreakable — nicknamed **"le chiffre indéchiffrable"** (the indecipherable cipher). It was finally broken independently by Charles Babbage (1854) and Friedrich Kasiski (1863).`,
        keyPoints: [
          'Polyalphabetic substitution: each plaintext letter uses a different shift',
          'Keyword repeats cyclically, determining shifts',
          'Vulnerable to Kasiski examination and Friedman frequency analysis',
        ],
      },
      {
        id: 'concept',
        title: 'Mathematical Formulation',
        content: `Let the plaintext be P₁P₂...Pₙ and the keyword be K₁K₂...Kₘ (repeated cyclically). Each character is encrypted using Caesar shift equal to the keyword letter's value (A=0, B=1, ..., Z=25):

**Cᵢ = (Pᵢ + K_{(i mod m)}) mod 26**

For example, with keyword "KEY":
- K=10, E=4, Y=24
- Plaintext "HELLO" → H(7)+10=17→R, E(4)+4=8→I, L(11)+24=35 mod 26=9→J, L(11)+10=21→V, O(14)+4=18→S
- Ciphertext: "RIJVS"

Because the keyword repeats every m letters, the cipher effectively consists of m interleaved Caesar ciphers.`,
        codeSnippet: {
          language: 'typescript',
          code: `function vigenereEncrypt(plaintext: string, keyword: string): string {
  const key = keyword.toUpperCase().replace(/[^A-Z]/g, '');
  let result = '';
  let keyIndex = 0;

  for (const ch of plaintext.toUpperCase()) {
    const code = ch.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      const shift = key.charCodeAt(keyIndex % key.length) - 65;
      result += String.fromCharCode(((code - 65 + shift) % 26) + 65);
      keyIndex++;
    } else {
      result += ch;
    }
  }
  return result;
}

vigenereEncrypt("HELLO WORLD", "KEY");
// → "RIJVS UYVJN"`,
          caption: 'Vigenère encryption with repeating keyword',
        },
      },
      {
        id: 'example',
        title: 'Kasiski Examination',
        content: `Friedrich Kasiski observed that **repeated sequences** in the ciphertext occur at intervals that are multiples of the keyword length. This gives an attacker a way to deduce m:

1. Find all repeated 3+ character sequences in the ciphertext.
2. Compute the distances between them.
3. Find the **greatest common divisor** of these distances.
4. The GCD is likely a multiple of the keyword length.

**Example:** If "WKR" appears at positions 8, 23, and 38, distances are 15 and 30 — GCD = 15, so keyword length is likely 3, 5, or 15.

Once m is known, the ciphertext splits into m independent Caesar ciphers, each broken by standard frequency analysis.`,
      },
      {
        id: 'visualization',
        title: 'Polyalphabetic Structure',
        content: `Plaintext:  H E L L O   W O R L D
Keyword:    K E Y K E   Y K E Y K
Shifts:    10 4 24 10 4  24 10 4 24 10
Ciphertext: R I J V S   U Y V J N

Each position uses a DIFFERENT Caesar shift, destroying
single-letter frequency patterns within a 3-letter window.`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Lessons from Vigenère:',
        keyPoints: [
          'Polyalphabetic ciphers defeat simple frequency analysis.',
          'Repeating keywords leak the key length through Kasiski examination.',
          'If the key is truly random and as long as the message, the cipher becomes an unbreakable One-Time Pad.',
        ],
      },
      {
        id: 'exercise',
        title: 'Checkpoint',
        content: 'Test your understanding of Vigenère and Kasiski.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content:
          'You understand polyalphabetic ciphers and how they were broken. Next: XOR, the bitwise primitive of all modern cryptography.',
      },
    ],
    interactiveExercise: {
      question:
        'If a Vigenère ciphertext contains the repeated sequence "ABC" at positions 10, 25, and 55, what is the most likely keyword length?',
      instruction: 'Use Kasiski examination: compute distances, find GCD.',
      inputType: 'choice',
      options: ['15', '30', '5', 'Cannot be determined'],
      correctAnswer: '15',
      hint: 'Distances are 15 and 30. The GCD of {15, 30} is 15. But 5 is also a divisor — the most likely key length is 15 (or a divisor like 5, 3).',
      explanation:
        'Distances between repeated "ABC" occurrences are 15 (25-10) and 30 (55-25). The GCD is 15. The keyword length is most likely 15 (or a divisor of 15).',
    },
  },

  // ============================================================
  // LESSON 16 — XOR & STREAM CIPHERS
  // ============================================================
  {
    id: 'xor-stream-ciphers',
    slug: 'xor-stream-ciphers',
    order: 16,
    title: 'XOR & Stream Ciphers',
    category: 'mechanisms',
    description:
      'The exclusive-OR operation — the bitwise primitive that powers every modern cipher, from AES to ChaCha20.',
    difficulty: 'advanced',
    estimatedMinutes: 12,
    xpReward: 40,
    references: [
      {
        title: 'Communication Theory of Secrecy Systems',
        author: 'C. E. Shannon',
        year: 1949,
        url: 'https://ieeexplore.ieee.org/document/6769090',
        type: 'paper',
      },
      {
        title: 'RFC 8439: ChaCha20 and Poly1305 for IETF Protocols',
        author: 'Y. Nir, A. Langley',
        year: 2018,
        url: 'https://datatracker.ietf.org/doc/html/rfc8439',
        type: 'standard',
      },
    ],
    tags: ['xor', 'stream-cipher', 'vernam', 'one-time-pad', 'chacha20'],
    sections: [
      {
        id: 'introduction',
        title: 'The Humble XOR',
        content: `The exclusive-OR (XOR) operation is the most fundamental bitwise primitive in cryptography. Its truth table is deceptively simple:

| A | B | A ⊕ B |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

The critical property: **XOR is its own inverse**. For any bytes A and B: (A ⊕ B) ⊕ B = A. This means the same operation both encrypts and decrypts — no separate inverse function needed.`,
        keyPoints: [
          'XOR is involutory: (A ⊕ B) ⊕ B = A',
          'Foundation of all modern stream ciphers (ChaCha20, RC4)',
          'Used internally by AES, SHA-256, and virtually every cipher',
        ],
      },
      {
        id: 'concept',
        title: 'The One-Time Pad (OTP)',
        content: `In 1917, Gilbert Vernam patented a cipher where each plaintext bit is XORed with a truly random key bit:

**Cᵢ = Pᵢ ⊕ Kᵢ**

Claude Shannon proved in 1949 that if K is:
1. **Truly random** (not pseudorandom)
2. **As long as the message**
3. **Never reused** (used only once)

...then the cipher is **information-theoretically secure** — even an adversary with infinite computing power cannot break it.

**The catch:** Distributing OTPs of the same length as every message is impractical. Modern stream ciphers replace the truly random key with a pseudorandom keystream generated from a short seed.`,
        codeSnippet: {
          language: 'typescript',
          code: `// XOR stream cipher (educational)
function xorCipher(data: Uint8Array, key: Uint8Array): Uint8Array {
  const out = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    out[i] = data[i] ^ key[i % key.length];
  }
  return out;
}

// Encrypt then decrypt with the SAME function:
const plaintext = new TextEncoder().encode("SECRET");
const key = new Uint8Array([0x58]); // 1-byte key

const ciphertext = xorCipher(plaintext, key); // → [0x0B, 0x14, 0x1A, 0x0B, 0x15, 0x1F]
const recovered = xorCipher(ciphertext, key); // → "SECRET"`,
          caption: 'XOR is involutory — same function encrypts and decrypts',
        },
      },
      {
        id: 'example',
        title: 'The Two-Time Pad Catastrophe',
        content: `A common mistake: reusing the same XOR keystream for two different messages. Consider two ciphertexts:

C₁ = P₁ ⊕ K
C₂ = P₂ ⊕ K

XORing them cancels the key entirely:

C₁ ⊕ C₂ = P₁ ⊕ K ⊕ P₂ ⊕ K = P₁ ⊕ P₂

An attacker now has the XOR of the two plaintexts — often enough to recover both via **crib-dragging** (guessing common words). This attack famously broke the Soviet VENONA project in the 1940s.`,
      },
      {
        id: 'visualization',
        title: 'XOR in a Modern Stream Cipher',
        content: `Modern stream cipher (ChaCha20):
1. Start with 256-bit key + 96-bit nonce + counter
2. Apply 20 rounds of ARX (Add-Rotate-XOR) operations
3. Get a 64-byte pseudorandom keystream block
4. XOR keystream ⊕ plaintext = ciphertext

The keystream is pseudorandom, NOT truly random — but
indistinguishable from random for any feasible computation.`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'XOR essentials:',
        keyPoints: [
          'XOR is involutory — the same operation encrypts and decrypts.',
          'One-Time Pad is the only information-theoretically secure cipher.',
          'Never reuse a XOR keystream — Two-Time Pad attack reveals P₁ ⊕ P₂.',
        ],
      },
      {
        id: 'exercise',
        title: 'Checkpoint',
        content: 'Test your understanding of XOR.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content:
          'You understand XOR and stream ciphers. Next: AES-GCM, the modern authenticated encryption standard.',
      },
    ],
    interactiveExercise: {
      question: 'Given C₁ = P₁ ⊕ K and C₂ = P₂ ⊕ K, what does C₁ ⊕ C₂ equal?',
      instruction: 'Simplify using XOR properties.',
      inputType: 'choice',
      options: ['P₁ ⊕ P₂', 'K', 'P₁ ⊕ P₂ ⊕ K', '0'],
      correctAnswer: 'P₁ ⊕ P₂',
      hint: 'K ⊕ K = 0. So C₁ ⊕ C₂ = P₁ ⊕ K ⊕ P₂ ⊕ K = P₁ ⊕ P₂.',
      explanation:
        '(P₁ ⊕ K) ⊕ (P₂ ⊕ K) = P₁ ⊕ P₂ ⊕ (K ⊕ K) = P₁ ⊕ P₂ ⊕ 0 = P₁ ⊕ P₂. This is why key reuse is catastrophic.',
    },
  },

  // ============================================================
  // LESSON 17 — AES-GCM INTERNALS
  // ============================================================
  {
    id: 'aes-gcm-internals',
    slug: 'aes-gcm-internals',
    order: 17,
    title: 'AES-GCM Internals',
    category: 'mechanisms',
    description:
      "Inside the world's most deployed authenticated cipher: how AES-CTR and GHASH combine to provide confidentiality and integrity.",
    difficulty: 'advanced',
    estimatedMinutes: 18,
    xpReward: 60,
    references: [
      {
        title:
          'NIST SP 800-38D: Recommendation for Block Cipher Modes of Operation: GCM and GMAC',
        author: 'NIST',
        year: 2007,
        url: 'https://csrc.nist.gov/publications/detail/sp/800-38d/final',
        type: 'standard',
      },
      {
        title: 'The Galois/Counter Mode of Operation (GCM)',
        author: 'D. McGrew, J. Viega',
        year: 2004,
        url: 'https://csrc.nist.gov/CSRC/media/Publications/sp/800-38d/archive/2007-11-19/documents/gcm-spec.pdf',
        type: 'paper',
      },
      {
        title: 'NIST FIPS 197: Advanced Encryption Standard (AES)',
        author: 'NIST',
        year: 2001,
        url: 'https://csrc.nist.gov/publications/detail/fips/197/final',
        type: 'standard',
      },
    ],
    tags: ['aes', 'gcm', 'aead', 'ghash', 'nist', 'sp800-38d'],
    sections: [
      {
        id: 'introduction',
        title: 'The Standard for Authenticated Encryption',
        content: `AES-GCM (Advanced Encryption Standard in Galois/Counter Mode) is defined in **NIST SP 800-38D** and is the most widely deployed AEAD (Authenticated Encryption with Associated Data) cipher in the world. It protects TLS 1.3, IPsec, SSH, and countless other protocols.

GCM combines two components:
1. **AES-CTR** — for encryption (confidentiality)
2. **GHASH** — for authentication (integrity)

The result is a single cipher that produces both ciphertext and a 16-byte authentication tag.`,
        keyPoints: [
          'Standardized in NIST SP 800-38D (2007)',
          'Combines counter-mode encryption with universal hashing (GHASH)',
          'Produces ciphertext + authentication tag in one pass',
          'Nonce reuse is catastrophic — leaks the authentication key',
        ],
      },
      {
        id: 'concept',
        title: 'The GCM Construction',
        content: `GCM encryption proceeds in four steps:

**1. Key Expansion:** The 128/256-bit AES key is expanded into round keys via the AES key schedule.

**2. Counter Mode Encryption:**
- Start with a 96-bit nonce. Build counter blocks: J₀ = nonce || 0x00000001
- For each plaintext block Pᵢ: Cᵢ = Pᵢ ⊕ AES_K(J₀ + i)
- The AES outputs form a **keystream** that is XORed with the plaintext

**3. GHASH Authentication:**
- GHASH operates in GF(2¹²⁸) — the Galois field with 2¹²⁸ elements
- It computes: H = AES_K(0¹²⁸) (the hash subkey)
- Then iteratively processes ciphertext blocks: Yᵢ = (Yᵢ₋₁ ⊕ Cᵢ) · H in GF(2¹²⁸)
- Final tag: T = AES_K(J₀) ⊕ GHASH(...)

**4. Output:** (ciphertext, 16-byte authentication tag)

The tag provides **integrity**: any single-bit modification to the ciphertext produces a completely different tag (avalanche effect in GF(2¹²⁸)).`,
        codeSnippet: {
          language: 'typescript',
          code: `// AES-GCM via Web Crypto API (NIST-compliant)
const key = await crypto.subtle.generateKey(
  { name: 'AES-GCM', length: 256 },
  true,
  ['encrypt', 'decrypt']
);

// CRITICAL: 96-bit (12-byte) nonce, unique per encryption
const nonce = crypto.getRandomValues(new Uint8Array(12));

const ciphertext = await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv: nonce, tagLength: 128 },
  key,
  new TextEncoder().encode("Secret message")
);
// ciphertext = encryptedData || 16-byte authTag

// To decrypt, both ciphertext AND tag must be valid:
const plaintext = await crypto.subtle.decrypt(
  { name: 'AES-GCM', iv: nonce, tagLength: 128 },
  key,
  ciphertext
);`,
          caption: 'AES-GCM in Web Crypto — nonce is 12 bytes, tag is 16 bytes',
        },
      },
      {
        id: 'example',
        title: 'Why Nonce Reuse is Catastrophic',
        content: `If the same (key, nonce) pair encrypts two different messages:

C₁ = P₁ ⊕ AES_K(J₀)
C₂ = P₂ ⊕ AES_K(J₀)

XORing reveals the plaintext XOR:

C₁ ⊕ C₂ = P₁ ⊕ P₂

Worse — in GCM, nonce reuse also leaks the GHASH subkey H, allowing an attacker to **forge arbitrary authentication tags** on any message. This is why every GCM implementation MUST generate a fresh random nonce for every encryption.

**Historical incident:** In 2016, the "Nonce-Disrespecting Adversaries" paper found 184 HTTPS servers reusing GCM nonces, completely breaking their TLS security.`,
      },
      {
        id: 'visualization',
        title: 'GCM Block Diagram',
        content: `       Nonce (96 bits)      Key
            │                 │
            ├─→ J₀ ────→ AES_K ──→ ┐
            │                       │
Plaintext ──→ XOR ←── keystream ─┘
     │         │
     │         ↓
     │     Ciphertext
     │         │
     └─────────┼──→ GHASH (GF 2^128) ──→ ⊕ AES_K(J₀) ──→ Auth Tag (16 bytes)
               │
       AAD ────┘`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'AES-GCM fundamentals:',
        keyPoints: [
          'GCM = AES-CTR (encryption) + GHASH (authentication) in a single pass.',
          'The 16-byte tag detects any tampering (AEAD property).',
          'Nonce MUST be unique per (key, message) — reuse is catastrophic.',
          'Hardware-accelerated on modern CPUs (AES-NI + PCLMULQDQ).',
        ],
      },
      {
        id: 'exercise',
        title: 'Checkpoint',
        content: 'Test your understanding of AES-GCM.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content:
          "You now understand the internals of the world's most deployed AEAD cipher. Next: RSA-OAEP.",
      },
    ],
    interactiveExercise: {
      question:
        'In AES-GCM, what happens if the same (key, nonce) pair is used to encrypt two different messages?',
      instruction: 'Select the correct impact.',
      inputType: 'choice',
      options: [
        'Confidentiality is broken (C₁ ⊕ C₂ = P₁ ⊕ P₂) AND the authentication key leaks, allowing tag forgery',
        'Only the authentication tag becomes invalid',
        'Nothing — GCM handles nonce reuse automatically',
        'Only performance degrades',
      ],
      correctAnswer:
        'Confidentiality is broken (C₁ ⊕ C₂ = P₁ ⊕ P₂) AND the authentication key leaks, allowing tag forgery',
      hint: 'Reusing (key, nonce) in GCM is one of the most catastrophic cryptographic mistakes possible.',
      explanation:
        'Nonce reuse in GCM breaks both confidentiality (keystream XORs cancel) and integrity (GHASH subkey H can be recovered, enabling forgery). This is why NIST SP 800-38D mandates unique nonces.',
    },
  },

  // ============================================================
  // LESSON 18 — RSA-OAEP DEEP DIVE
  // ============================================================
  {
    id: 'rsa-oaep-deep-dive',
    slug: 'rsa-oaep-deep-dive',
    order: 18,
    title: 'RSA-OAEP Deep Dive',
    category: 'mechanisms',
    description:
      'Optimal Asymmetric Encryption Padding: how RSA became CCA-secure through randomized padding and provable reduction.',
    difficulty: 'advanced',
    estimatedMinutes: 20,
    xpReward: 65,
    references: [
      {
        title: 'RFC 8017: PKCS #1 — RSA Cryptography Specifications Version 2.2',
        author: 'K. Moriarty, B. Kaliski, J. Jonsson, A. Rusch',
        year: 2016,
        url: 'https://datatracker.ietf.org/doc/html/rfc8017',
        type: 'standard',
      },
      {
        title: 'Optimal Asymmetric Encryption — How to Encrypt with RSA',
        author: 'M. Bellare, P. Rogaway',
        year: 1994,
        url: 'https://link.springer.com/chapter/10.1007/BFb0053428',
        type: 'paper',
      },
      {
        title: 'A Method for Obtaining Digital Signatures and Public-Key Cryptosystems',
        author: 'R. Rivest, A. Shamir, L. Adleman',
        year: 1978,
        url: 'https://dl.acm.org/doi/10.1145/359340.359342',
        type: 'paper',
      },
    ],
    tags: ['rsa', 'oaep', 'pkcs1', 'rfc8017', 'public-key', 'cca-security'],
    sections: [
      {
        id: 'introduction',
        title: 'Why Textbook RSA is Broken',
        content: `Textbook RSA (raw modular exponentiation without padding) has been known since the 1980s to be **completely insecure** for direct encryption. It suffers from:

1. **Determinism** — same plaintext always produces the same ciphertext
2. **Malleability** — an attacker can compute C × 2ᵉ mod N, which decrypts to 2 × M
3. **Small-message attacks** — if Mᵉ < N, then C = Mᵉ exactly (no modulo reduction), and M = C^(1/e)
4. **Common-modulus attacks** — same message encrypted under multiple keys with different exponents can be recovered
5. **Chosen-ciphertext attacks** — an adversary with a decryption oracle can recover arbitrary plaintexts

The solution: **optimal asymmetric encryption padding (OAEP)**, introduced by Bellare and Rogaway in 1994.`,
        keyPoints: [
          'Textbook RSA is NOT IND-CPA secure, let alone IND-CCA',
          'OAEP adds randomized padding to achieve CCA security',
          'Standardized in PKCS#1 v2.0+ (RFC 8017)',
          'Requires a hash function (SHA-256 recommended) and a random seed',
        ],
      },
      {
        id: 'concept',
        title: 'OAEP Construction',
        content: `Given plaintext message M, hash function H (e.g. SHA-256), and message length k bytes for the modulus:

**Encoding:**
1. **Padding:** M is padded with a "label hash" and zero bytes to length (k − 2hLen − 2)
   - DB = H(label) || 0x00...00 || 0x01 || M
2. **Random seed:** Generate a random hLen-byte seed r
3. **MGF (Mask Generation Function):** Use MGF1 (based on H) to expand r to the length of DB:
   - maskedDB = DB ⊕ MGF1(r)
   - maskedSeed = r ⊕ MGF1(maskedDB)
4. **Output:** EM = 0x00 || maskedSeed || maskedDB (length k)

**Then:** C = EMᵉ mod N

**Decoding** reverses the process, checks that the padding is well-formed, and rejects if not.

The **random seed** ensures that encrypting the same message twice gives different ciphertexts — the essential property for IND-CPA security. The **redundancy** in the padding makes it infeasible to forge valid ciphertexts, giving CCA security under the random oracle model.`,
        codeSnippet: {
          language: 'typescript',
          code: `// RSA-OAEP via Web Crypto (RFC 8017 compliant)
const keyPair = await crypto.subtle.generateKey(
  {
    name: 'RSA-OAEP',
    modulusLength: 2048,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
    hash: 'SHA-256',
  },
  true,
  ['encrypt', 'decrypt']
);

const ciphertext = await crypto.subtle.encrypt(
  { name: 'RSA-OAEP' }, // OAEP padding automatically applied
  keyPair.publicKey,
  new TextEncoder().encode("Secret message")
);

const plaintext = await crypto.subtle.decrypt(
  { name: 'RSA-OAEP' },
  keyPair.privateKey,
  ciphertext
);`,
          caption: 'Web Crypto API handles OAEP padding internally',
        },
      },
      {
        id: 'example',
        title: 'MGF1: Mask Generation Function',
        content: `MGF1 is a simple but effective mask generator based on a hash function:

**MGF1(seed, maskLen):**
\`\`\`
T = ""
counter = 0
while len(T) < maskLen:
    T = T || H(seed || counter_bytes)
    counter++
return T[0 : maskLen]
\`\`\`

MGF1 is essentially a hash-based pseudorandom generator: given a short random seed, it produces an arbitrarily long pseudorandom mask. OAEP uses MGF1 to "spread" the seed's randomness across the padded message.

**Security assumption:** MGF1 is modeled as a **random oracle** in the security proof — a theoretical construct where H behaves as a truly random function. Under this model, RSA-OAEP is proven IND-CCA2 secure.`,
      },
      {
        id: 'visualization',
        title: 'OAEP Encoding Pipeline',
        content: `                       Message M
                          │
                          ▼
       ┌──────────────────────────────────────┐
       │  DB = H(label) || 0...0 || 0x01 || M │
       └──────────────────────────────────────┘
                          │
Random seed r ──→ MGF1 ──→ maskDB ──→ ⊕ ──→ maskedDB
                          │
       ┌──────────────────┘
       │
       └──→ MGF1(maskedDB) ──→ maskSeed ──→ ⊕ r ──→ maskedSeed

Final EM = 0x00 || maskedSeed || maskedDB
Ciphertext C = EM^e mod N`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'RSA-OAEP essentials:',
        keyPoints: [
          'Textbook RSA is broken — OAEP is mandatory for real encryption.',
          'OAEP achieves IND-CCA2 security under the random oracle model.',
          'Random seed ensures semantic security (different ciphertext each time).',
          '2048-bit RSA is the minimum today; 3072-bit recommended for long-term.',
        ],
      },
      {
        id: 'exercise',
        title: 'Checkpoint',
        content: 'Test your understanding of RSA-OAEP.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content:
          'You understand OAEP padding and why it makes RSA secure. Next: elliptic curve cryptography.',
      },
    ],
    interactiveExercise: {
      question: 'What is the primary role of the random seed in RSA-OAEP?',
      instruction: 'Select the correct purpose.',
      inputType: 'choice',
      options: [
        'To randomize the encoding so identical plaintexts produce different ciphertexts (semantic security)',
        'To increase the RSA key size',
        'To replace the private key during encryption',
        'To compress the message',
      ],
      correctAnswer:
        'To randomize the encoding so identical plaintexts produce different ciphertexts (semantic security)',
      hint: 'Without the seed, OAEP would be deterministic and lose IND-CPA security.',
      explanation:
        'The random seed ensures semantic security — encrypting the same message twice produces different ciphertexts. This is essential for IND-CPA (indistinguishability under chosen-plaintext attack).',
    },
  },

  // ============================================================
  // LESSON 19 — ELLIPTIC CURVE CRYPTOGRAPHY
  // ============================================================
  {
    id: 'elliptic-curve-crypto',
    slug: 'elliptic-curve-cryptography',
    order: 19,
    title: 'Elliptic Curve Cryptography',
    category: 'mechanisms',
    description:
      'Modern public-key cryptography on algebraic curves: smaller keys, faster operations, and the discrete log problem.',
    difficulty: 'advanced',
    estimatedMinutes: 20,
    xpReward: 70,
    references: [
      {
        title:
          'NIST SP 800-186: Recommendations for Discrete Logarithm-based Cryptography: Elliptic Curve Domain Parameters',
        author: 'NIST',
        year: 2023,
        url: 'https://csrc.nist.gov/publications/detail/sp/800-186/final',
        type: 'standard',
      },
      {
        title: 'NIST FIPS 186-5: Digital Signature Standard (DSS)',
        author: 'NIST',
        year: 2023,
        url: 'https://csrc.nist.gov/publications/detail/fips/186/5/final',
        type: 'standard',
      },
      {
        title: 'A Graduate Course in Applied Cryptography',
        author: 'D. Boneh, V. Shoup',
        year: 2020,
        url: 'https://toc.cryptobook.us/',
        type: 'book',
      },
    ],
    tags: ['ecc', 'ecdsa', 'ecdh', 'secp256k1', 'nist-p256', 'public-key'],
    sections: [
      {
        id: 'introduction',
        title: 'The Next Generation of Public-Key Crypto',
        content: `Elliptic Curve Cryptography (ECC) was independently proposed by Neal Koblitz and Victor Miller in 1985. It provides the same security as RSA with **dramatically smaller keys**:

| Security Level | RSA Key Size | ECC Key Size |
|---|---|---|
| 80 bits | 1024 bits | 160 bits |
| 112 bits | 2048 bits | 224 bits |
| 128 bits | 3072 bits | 256 bits |
| 256 bits | 15360 bits | 512 bits |

A **256-bit ECC key** offers the same security as a **3072-bit RSA key** — a 12× reduction in size. This makes ECC ideal for constrained environments: smart cards, IoT devices, mobile phones, and TLS handshakes.`,
        keyPoints: [
          'Same security with much smaller keys than RSA',
          'Based on the Elliptic Curve Discrete Logarithm Problem (ECDLP)',
          'Standardized curves: NIST P-256/P-384/P-521, secp256k1 (Bitcoin), Curve25519',
          'Used in ECDSA (signatures) and ECDH (key exchange)',
        ],
      },
      {
        id: 'concept',
        title: 'Elliptic Curves over Finite Fields',
        content: `An elliptic curve over a prime field 𝔽ₚ is the set of points (x, y) satisfying:

**y² ≡ x³ + ax + b (mod p)**

...plus a special "point at infinity" denoted 𝒪.

For NIST P-256, the parameters are:
- p = 2²⁵⁶ − 2²²⁴ + 2¹⁹² + 2⁹⁶ − 1 (a 256-bit prime)
- a = −3
- b = a specific constant

**Point addition:** Given two points P and Q on the curve, there is a geometric construction to compute P + Q — draw a line through P and Q, find the third intersection point, reflect it across the x-axis. This operation forms a **group**.

**Scalar multiplication:** kP = P + P + ... + P (k times). This is easy to compute (using double-and-add) but **hard to invert** — given kP and P, finding k is the **Elliptic Curve Discrete Logarithm Problem (ECDLP)**.`,
        codeSnippet: {
          language: 'typescript',
          code: `// ECDH key exchange using P-256
const aliceKeyPair = await crypto.subtle.generateKey(
  { name: 'ECDH', namedCurve: 'P-256' },
  true,
  ['deriveBits']
);

const bobKeyPair = await crypto.subtle.generateKey(
  { name: 'ECDH', namedCurve: 'P-256' },
  true,
  ['deriveBits']
);

// Alice derives shared secret using her private key + Bob's public key
const aliceSecret = await crypto.subtle.deriveBits(
  { name: 'ECDH', public: bobKeyPair.publicKey },
  aliceKeyPair.privateKey,
  256
);

// Bob derives the SAME shared secret
const bobSecret = await crypto.subtle.deriveBits(
  { name: 'ECDH', public: aliceKeyPair.publicKey },
  bobKeyPair.privateKey,
  256
);
// aliceSecret === bobSecret — now use as AES key!`,
          caption: 'ECDH: both parties derive the same shared secret',
        },
      },
      {
        id: 'example',
        title: 'ECDSA: Elliptic Curve Digital Signature Algorithm',
        content: `ECDSA (standardized in FIPS 186) is the elliptic-curve analogue of DSA. The signing algorithm:

**Sign (private key d, message m):**
1. Compute hash e = H(m)
2. Pick random k ∈ [1, n−1]
3. Compute point (x₁, y₁) = kG
4. Compute r = x₁ mod n
5. Compute s = k⁻¹(e + r·d) mod n
6. Signature = (r, s)

**Verify (public key Q = dG, signature (r, s), message m):**
1. Compute e = H(m)
2. Compute w = s⁻¹ mod n
3. Compute u₁ = e·w mod n, u₂ = r·w mod n
4. Compute (x₁, y₁) = u₁G + u₂Q
5. Signature is valid iff x₁ mod n = r

**Critical vulnerability:** if the random k is ever reused or predictable, the private key d can be recovered. This happened with the Sony PlayStation 3 (2010) — they used a constant k, and hackers recovered the signing key.`,
      },
      {
        id: 'visualization',
        title: 'Elliptic Curve Point Addition',
        content: `      y
      │
      │       P        Q
      │        ╲      ╱
      │         ╲    ╱
      │          ╲  ╱
      │           ╳  ← third intersection
      │          ╱ ╲
      │         ╱   ╲
      │        ╱     ╲
      │       P+Q     ╲
      │                ╲
      └───────────────────── x

Geometric law: P + Q is the reflection of the third
intersection point across the x-axis.`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'ECC fundamentals:',
        keyPoints: [
          'ECC = same security with ~12× smaller keys than RSA.',
          'Security rests on the Elliptic Curve Discrete Log Problem.',
          'ECDSA requires a unique random k per signature — reuse leaks the private key.',
          'Curve25519 and Ed25519 are modern, faster, misuse-resistant alternatives.',
        ],
      },
      {
        id: 'exercise',
        title: 'Checkpoint',
        content: 'Test your understanding of ECC.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content:
          'You understand elliptic curve cryptography. Next: the post-quantum era.',
      },
    ],
    interactiveExercise: {
      question:
        'Approximately how large must an RSA key be to match the security of a 256-bit ECC key?',
      instruction: 'Select the closest RSA equivalent.',
      inputType: 'choice',
      options: ['3072 bits', '512 bits', '2048 bits', '1024 bits'],
      correctAnswer: '3072 bits',
      hint: 'NIST SP 800-57 provides equivalent security tables.',
      explanation:
        'Per NIST SP 800-57, a 256-bit ECC key provides ~128 bits of security, equivalent to a 3072-bit RSA key.',
    },
  },

  // ============================================================
  // LESSON 20 — POST-QUANTUM CRYPTOGRAPHY
  // ============================================================
  {
    id: 'post-quantum-crypto',
    slug: 'post-quantum-cryptography',
    order: 20,
    title: 'Post-Quantum Cryptography',
    category: 'modern',
    description:
      'Algorithms resistant to quantum computers: NIST PQC standards (Kyber, Dilithium, SPHINCS+) and the migration urgency.',
    difficulty: 'advanced',
    estimatedMinutes: 22,
    xpReward: 75,
    references: [
      {
        title:
          'NIST FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism Standard (ML-KEM)',
        author: 'NIST',
        year: 2024,
        url: 'https://csrc.nist.gov/pubs/fips/203/final',
        type: 'standard',
      },
      {
        title:
          'NIST FIPS 204: Module-Lattice-Based Digital Signature Standard (ML-DSA)',
        author: 'NIST',
        year: 2024,
        url: 'https://csrc.nist.gov/pubs/fips/204/final',
        type: 'standard',
      },
      {
        title:
          'NIST FIPS 205: Stateless Hash-Based Digital Signature Standard (SLH-DSA)',
        author: 'NIST',
        year: 2024,
        url: 'https://csrc.nist.gov/pubs/fips/205/final',
        type: 'standard',
      },
      {
        title:
          'On Lattices, Learning with Errors, Random Linear Codes, and Cryptography',
        author: 'O. Regev',
        year: 2005,
        url: 'https://cims.nyu.edu/~regev/papers/qcrypto.pdf',
        type: 'paper',
      },
    ],
    tags: ['pqc', 'quantum', 'kyber', 'dilithium', 'nist', 'fips-203', 'fips-204', 'fips-205'],
    sections: [
      {
        id: 'introduction',
        title: 'Why Current Crypto Will Break',
        content: `In 1994, Peter Shor published a quantum algorithm that factors large integers and computes discrete logarithms in **polynomial time**. On a sufficiently powerful quantum computer, this would break:

- **RSA** (factoring problem)
- **Diffie-Hellman** (discrete log problem)
- **ECDH/ECDSA** (elliptic curve discrete log problem)

**Grover's algorithm** (1996) provides a quadratic speedup for brute-force search, effectively halving symmetric key security:
- AES-128 → 64-bit effective security (still secure in practice for now)
- AES-256 → 128-bit effective security (fully secure)

**Current threat assessment:** No existing quantum computer can break RSA-2048 or AES. But adversaries may be **harvesting encrypted data today** to decrypt it later (harvest-now, decrypt-later).`,
        keyPoints: [
          "Shor's algorithm breaks RSA, DH, ECDSA on quantum computers",
          "Grover's algorithm halves symmetric key security (AES-256 remains safe)",
          'NIST finalized the first PQC standards in August 2024',
          'Migration should start now, not when quantum computers arrive',
        ],
      },
      {
        id: 'concept',
        title: 'NIST Post-Quantum Standards (2024)',
        content: `After a 6-year public competition (2017–2022) and 3 years of standardization, NIST finalized its first post-quantum standards in August 2024:

**FIPS 203 — ML-KEM (Module-Lattice Key Encapsulation Mechanism)**
- Formerly "CRYSTALS-Kyber"
- Based on **Module-LWE** (Learning With Errors)
- Used for **key exchange** (replaces ECDH/RSA key transport)
- Public key ~1.2 KB, ciphertext ~1.1 KB (at NIST Level 3)

**FIPS 204 — ML-DSA (Module-Lattice Digital Signature Algorithm)**
- Formerly "CRYSTALS-Dilithium"
- Also based on **Module-LWE** + **Module-SIS**
- Used for **digital signatures** (replaces ECDSA/RSA-PSS)
- Signature ~2.4 KB (at Level 3)

**FIPS 205 — SLH-DSA (Stateless Hash-Based DSA)**
- Formerly "SPHINCS+"
- Based on **hash function security only** (no lattice assumptions)
- Larger signatures (~17–50 KB) but ultra-conservative security
- Preferred when lattice-based crypto is untrusted

**FN-DSA (FALCON)** — a fourth standard, still in development, offers smaller signatures than ML-DSA.`,
        codeSnippet: {
          language: 'text',
          code: `Comparison Table (NIST PQC Standards):

Algorithm     | Type    | Public Key | Ciphertext/Signature | Basis
──────────────┼─────────┼────────────┼──────────────────────┼─────────
ML-KEM-768    | KEM     | 1184 B     | 1088 B               | MLWE
ML-DSA-65     | Sig     | 1952 B     | 3309 B               | MLWE+MSIS
SLH-DSA-128s  | Sig     | 32 B       | 7856 B               | Hash only
FALCON-512    | Sig     | 897 B      | ~666 B               | NTRU lattice

For reference:
ECDH P-256    | KEM     | 64 B       | 64 B
ECDSA P-256   | Sig     | 64 B       | 64 B`,
          caption:
            'PQC key/signature sizes are much larger than ECC — this matters for protocols',
        },
      },
      {
        id: 'example',
        title: 'Learning With Errors (LWE)',
        content: `The security of ML-KEM and ML-DSA rests on the **Learning With Errors (LWE)** problem, introduced by Oded Regev in 2005:

**LWE Problem:** Given many samples (aᵢ, bᵢ) where bᵢ = ⟨aᵢ, s⟩ + eᵢ mod q for a secret vector s and small noise eᵢ, recover s.

Without the noise e, this is just linear algebra — solvable in polynomial time. With the noise, it becomes as hard as the worst-case **shortest vector problem** on lattices (proven by Regev, Peikert, and others).

**Module-LWE** is a structured variant that offers a good balance between security and key size. Kyber uses Module-LWE with dimension 256 and modulus q=3329.

**Why it resists quantum computers:** No known quantum algorithm solves LWE efficiently. Shor's algorithm exploits the **abelian group structure** of factoring/discrete-log; LWE has no such structure.`,
      },
      {
        id: 'visualization',
        title: 'Migration Timeline',
        content: `2024 ─── NIST finalizes FIPS 203/204/205
  │
2025 ─── Early adopters start PQC pilots (Chrome, OpenSSH, Cloudflare)
  │
2026-2027 ─── Wide deployment in TLS 1.3, SSH, code signing
  │
2028-2030 ─── Regulatory mandates likely (NIST, NSA CNSA 2.0)
  │
~2035 ─── Estimated "Q-Day" — cryptographically relevant quantum computers
  │
2035+ ─── Legacy RSA/ECC considered broken

⚠  Harvest-now-decrypt-later: data stolen TODAY may be
   decrypted by future quantum computers.`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Post-quantum fundamentals:',
        keyPoints: [
          "Shor's algorithm breaks RSA/ECC on quantum computers.",
          'NIST standardized ML-KEM (Kyber), ML-DSA (Dilithium), SLH-DSA (SPHINCS+) in 2024.',
          'Migration should begin now to protect against harvest-now-decrypt-later.',
          'PQC keys/signatures are larger — protocol design must adapt.',
        ],
      },
      {
        id: 'exercise',
        title: 'Checkpoint',
        content: 'Test your understanding of PQC.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content:
          'You understand the post-quantum landscape. Next: side-channel attacks.',
      },
    ],
    interactiveExercise: {
      question:
        'Which NIST standard (FIPS 203) defines the post-quantum key encapsulation mechanism based on Module-LWE?',
      instruction: 'Select the correct standard.',
      inputType: 'choice',
      options: ['ML-KEM (Kyber)', 'ML-DSA (Dilithium)', 'SLH-DSA (SPHINCS+)', 'FALCON'],
      correctAnswer: 'ML-KEM (Kyber)',
      hint: 'FIPS 203 specifies the KEM (key encapsulation mechanism).',
      explanation:
        'FIPS 203 standardizes ML-KEM (Module-Lattice Key Encapsulation Mechanism), formerly known as CRYSTALS-Kyber, for post-quantum key exchange.',
    },
  },

  // ============================================================
  // LESSON 21 — SIDE-CHANNEL ATTACKS
  // ============================================================
  {
    id: 'side-channel-attacks',
    slug: 'side-channel-attacks',
    order: 21,
    title: 'Side-Channel Attacks',
    category: 'security',
    description:
      'When the implementation leaks the key: timing, power, cache, and electromagnetic side channels.',
    difficulty: 'advanced',
    estimatedMinutes: 18,
    xpReward: 65,
    references: [
      {
        title:
          'Timing Attacks on Implementations of Diffie-Hellman, RSA, DSS, and Other Systems',
        author: 'P. Kocher',
        year: 1996,
        url: 'https://link.springer.com/chapter/10.1007/3-540-68697-5_9',
        type: 'paper',
      },
      {
        title: 'Differential Power Analysis',
        author: 'P. Kocher, J. Jaffe, B. Jun',
        year: 1999,
        url: 'https://link.springer.com/chapter/10.1007/3-540-48405-1_25',
        type: 'paper',
      },
      {
        title: 'Cache-Timing Attacks on AES',
        author: 'D. J. Bernstein',
        year: 2005,
        url: 'https://cr.yp.to/antiforgery/cachetiming-20050414.pdf',
        type: 'paper',
      },
    ],
    tags: ['side-channel', 'timing', 'power-analysis', 'cache', 'constant-time'],
    sections: [
      {
        id: 'introduction',
        title: 'Leaking Secrets Through Physics',
        content: `A **side-channel attack** exploits information leaked by the physical implementation of a cryptographic system, rather than weaknesses in the algorithm itself. Even a mathematically perfect cipher can be broken if its implementation leaks timing, power, electromagnetic emissions, or cache behaviour.

**Historical milestones:**
- **1996:** Paul Kocher introduces timing attacks on RSA and Diffie-Hellman.
- **1998:** Kocher, Jaffe, and Jun introduce **Differential Power Analysis (DPA)**.
- **2005:** Bernstein breaks AES on OpenSSL via cache-timing.
- **2018:** **Spectre** and **Meltdown** exploit speculative execution side channels.

Side channels are often the easiest way to break real-world crypto — much easier than cryptanalysis of the algorithm itself.`,
        keyPoints: [
          'Exploits implementation, not algorithm design',
          'Common channels: timing, power, cache, EM, acoustic',
          'Countermeasure: constant-time code, blinding, masking',
        ],
      },
      {
        id: 'concept',
        title: 'Timing Attacks',
        content: `Many naive implementations of crypto algorithms execute different amounts of work depending on the input — including the secret key. Consider a naive string comparison:

\`\`\`
function insecureCompare(a, b):
    for i in range(len(a)):
        if a[i] != b[i]:
            return False   // Early exit!
    return True
\`\`\`

If the attacker knows the first i bytes are correct, the function runs slightly longer. By measuring millions of attempts, the attacker recovers byte-by-byte. This is the mechanism behind the 2013 **Lucky Thirteen** attack on TLS (CVE-2013-0169).

**Constant-time defense:** always compare the full length:

\`\`\`
function constantTimeCompare(a, b):
    if len(a) != len(b):
        return False
    result = 0
    for i in range(len(a)):
        result |= a[i] ^ b[i]
    return result == 0
\`\`\`

The loop runs the same number of iterations regardless of input — no timing signal.`,
      },
      {
        id: 'example',
        title: 'Cache-Timing Attacks',
        content: `Modern CPUs use multiple cache levels (L1/L2/L3) to speed up memory access. If AES lookups hit the cache for some key bytes but miss for others, the total execution time leaks information.

**AES S-box attack:** A naive AES implementation uses a 256-byte S-box table. Different key bytes lead to different cache line accesses:
- Attacker measures encryption time for thousands of chosen plaintexts.
- Statistical analysis reveals which S-box entries were used.
- After enough measurements, key bytes can be recovered.

**Fix:** Implement AES with **bitslicing** (no table lookups) or use hardware AES-NI instructions. Modern CPUs also randomize cache behavior and use constant-time memory access primitives.

**Famous incident:** In 2016, a team broke a TLS server using cache-timing in the Cloudflare "Cloudbleed" family of vulnerabilities.`,
      },
      {
        id: 'visualization',
        title: 'Side-Channel Attack Surface',
        content: `┌────────────────────────────────────────────┐
│           Cryptographic Device             │
│   ┌───────────┐  ┌───────────┐  ┌───────┐ │
│   │   CPU     │  │  Memory   │  │  Bus  │ │
│   └─────┬─────┘  └─────┬─────┘  └───┬───┘ │
└─────────┼───────────────┼───────────┼─────┘
          │               │           │
          ▼               ▼           ▼
      Timing          Cache        Power/EM
     (µs–ms)      (line hits)     (mW–W)

    Acoustic        Temperature
    (µPa)           (thermal)`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Side-channel fundamentals:',
        keyPoints: [
          'Side channels leak secret data through physical measurements.',
          'Timing attacks exploit data-dependent execution time.',
          'Constant-time code is mandatory for any comparison involving secrets.',
          'Hardware AES-NI avoids cache-timing vulnerabilities.',
        ],
      },
      {
        id: 'exercise',
        title: 'Checkpoint',
        content: 'Test your understanding of side-channel attacks.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content:
          'You understand side-channel threats and how to defend against them. Next: length extension attacks.',
      },
    ],
    interactiveExercise: {
      question:
        'Which of the following is the correct defense against timing attacks in password comparison?',
      instruction: 'Select the most robust mitigation.',
      inputType: 'choice',
      options: [
        'Constant-time comparison that always processes the full input length',
        'Adding a sleep() after the comparison',
        'Hashing the password before comparison',
        'Using a longer random salt',
      ],
      correctAnswer:
        'Constant-time comparison that always processes the full input length',
      hint: 'Constant-time code eliminates data-dependent execution-time differences.',
      explanation:
        'Constant-time comparison runs the same number of operations regardless of input — removing the timing signal that leaks byte-by-byte match progress. Sleeps and salts do not eliminate timing differences.',
    },
  },

  // ============================================================
  // LESSON 22 — LENGTH EXTENSION ATTACKS
  // ============================================================
  {
    id: 'length-extension-attacks',
    slug: 'length-extension-attacks',
    order: 22,
    title: 'Length Extension Attacks',
    category: 'security',
    description:
      'Why SHA-256 and other Merkle-Damgård hashes are unsafe as MACs — and how HMAC fixes the problem.',
    difficulty: 'advanced',
    estimatedMinutes: 15,
    xpReward: 55,
    references: [
      {
        title:
          'Second Preimages on n-bit Hash Functions for Much Less than 2ⁿ Work',
        author: 'J. Kelsey, B. Schneier',
        year: 2005,
        url: 'https://link.springer.com/chapter/10.1007/11426639_28',
        type: 'paper',
      },
      {
        title: 'RFC 2104: HMAC — Keyed-Hashing for Message Authentication',
        author: 'H. Krawczyk, M. Bellare, R. Canetti',
        year: 1997,
        url: 'https://datatracker.ietf.org/doc/html/rfc2104',
        type: 'standard',
      },
    ],
    tags: ['hash', 'hmac', 'merkle-damgard', 'sha256', 'length-extension'],
    sections: [
      {
        id: 'introduction',
        title: 'The Merkle-Damgård Vulnerability',
        content: `Most cryptographic hash functions (MD5, SHA-1, SHA-256, SHA-512) use the **Merkle-Damgård** construction:

1. Pad the message to a multiple of the block size.
2. Split into blocks M₁, M₂, ..., Mₙ.
3. Process iteratively: Hᵢ = f(Hᵢ₋₁, Mᵢ), starting from a fixed IV.
4. Output the final state Hₙ as the digest.

**The vulnerability:** the final hash IS the internal state after processing the last block. If an attacker knows H(M) and the length of M, they can compute H(M || padding || extra) — **without knowing M**.

This is a **length extension attack**, and it completely breaks the naive MAC construction \`MAC = H(key || message)\`.`,
        keyPoints: [
          'Merkle-Damgård hashes expose their internal state as the output.',
          'Attack allows appending data to a hashed message without knowing it.',
          'Breaks HMAC-naive constructions like H(secret || message).',
          'HMAC is specifically designed to prevent this.',
        ],
      },
      {
        id: 'concept',
        title: 'The Attack in Detail',
        content: `Suppose a server authenticates messages as \`tag = SHA256(secret || message)\` and transmits (message, tag). An attacker who observes one valid pair can forge a new valid pair:

**Step 1:** The attacker guesses the length of \`secret\` (e.g. 8 bytes).

**Step 2:** Using the known \`tag\` as the starting state, they compute the SHA-256 padding that would have been appended to \`secret || message\`. This padding is deterministic given the length.

**Step 3:** They append arbitrary attacker-controlled data: \`extra\`.

**Step 4:** They continue hashing from the known \`tag\` state through \`extra\`, producing a new digest \`tag'\`.

**Step 5:** They transmit (message || padding || extra, tag'). The server computes \`SHA256(secret || message || padding || extra)\` and gets \`tag'\` — a valid tag!

The attacker has forged a valid (message, tag) pair without ever knowing \`secret\`.

**Famous incident:** Flickr's API (2009) and the SHA-1 in Merkle trees were exploited via length extension in practice.`,
        codeSnippet: {
          language: 'typescript',
          code: `// VULNERABLE: naive MAC construction
const tag = await sha256(secret + message);
// ← Attackers can extend this!

// SECURE: HMAC — the correct construction
const tag = await hmacSha256(secret, message);
// ← Length extension does NOT apply to HMAC

// SECURE alternative: hash the tag (defense in depth)
const tag = await sha256(await sha256(secret + message));
// ← This construction (secret-suffix) also prevents extension`,
          caption: 'Use HMAC or secret-suffix hashing instead of secret-prefix',
        },
      },
      {
        id: 'example',
        title: 'HMAC — The Right Way',
        content: `HMAC (RFC 2104) constructs a MAC from any hash function H using two nested computations:

**HMAC(K, m) = H((K ⊕ opad) || H((K ⊕ ipad) || m))**

Where:
- ipad = 0x36 repeated to block size
- opad = 0x5C repeated to block size

**Why HMAC resists length extension:**
- The **inner hash** H((K ⊕ ipad) || m) produces a fixed-size intermediate value.
- The **outer hash** H((K ⊕ opad) || innerHash) processes this intermediate as the final block — no attacker-controlled continuation.
- Without knowing K, an attacker cannot compute the inner hash for a modified message.

HMAC is provably secure if the underlying hash is a **pseudorandom function** (PRF) — a weaker assumption than collision resistance. HMAC-SHA256 is the standard choice for API authentication, JWT signatures, and TLS PRF.`,
      },
      {
        id: 'visualization',
        title: 'Length Extension Flow',
        content: `Original:  H(secret || message) = tag
           │
           ▼
Attacker knows: (message, tag, len(secret))
Attacker does NOT know: secret
           │
           ▼
Padding = SHA256_pad(len(secret) + len(message))
           │
           ▼
New state = tag ⊕ extra_blocks (using SHA256 compression)
           │
           ▼
Forged:   H(secret || message || padding || extra) = tag'
           │
           ▼
Server accepts (message || padding || extra, tag') — attack succeeded!`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Length extension essentials:',
        keyPoints: [
          'Merkle-Damgård hashes (MD5, SHA-1, SHA-2) are vulnerable.',
          'Never use H(secret || message) as a MAC.',
          'HMAC is the standardized, proven-safe construction.',
          'SHA-3/Keccak uses a sponge construction — immune to length extension.',
        ],
      },
      {
        id: 'exercise',
        title: 'Checkpoint',
        content: 'Test your understanding of length extension.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content:
          'You understand length extension and how HMAC prevents it. Next: padding oracle attacks.',
      },
    ],
    interactiveExercise: {
      question:
        'Which of the following hash constructions is IMMUNE to length extension attacks?',
      instruction: 'Select the correct construction.',
      inputType: 'choice',
      options: [
        'HMAC-SHA256 (nested hashing with inner and outer keys)',
        'SHA256(secret || message) — prefix MAC',
        'SHA256(message) — no secret involved',
        'SHA256(secret) || SHA256(message)',
      ],
      correctAnswer: 'HMAC-SHA256 (nested hashing with inner and outer keys)',
      hint: 'HMAC wraps the hash in two passes with derived keys ipad and opad.',
      explanation:
        'HMAC is specifically designed to resist length extension. The outer hash processes the intermediate inner-hash state as the final block, blocking any attacker-controlled continuation.',
    },
  },

  // ============================================================
  // LESSON 23 — PADDING ORACLE ATTACKS
  // ============================================================
  {
    id: 'padding-oracle-attacks',
    slug: 'padding-oracle-attacks',
    order: 23,
    title: 'Padding Oracle Attacks',
    category: 'security',
    description:
      'How a single error message can decrypt an entire CBC ciphertext byte-by-byte — and why AEAD ciphers matter.',
    difficulty: 'advanced',
    estimatedMinutes: 16,
    xpReward: 60,
    references: [
      {
        title:
          'Security Flaws Induced by CBC Padding — Applications to SSL, IPSEC, WTLS',
        author: 'S. Vaudenay',
        year: 2002,
        url: 'https://link.springer.com/chapter/10.1007/3-540-46035-7_35',
        type: 'paper',
      },
      {
        title: 'This POODLE Bites: Exploiting the SSL 3.0 Fallback',
        author: 'B. Möller, T. Duong, K. Kotowicz',
        year: 2014,
        url: 'https://www.openssl.org/~bodo/ssl-poodle.pdf',
        type: 'paper',
      },
      {
        title:
          'NIST SP 800-38D: Recommendation for Block Cipher Modes of Operation: GCM and GMAC',
        author: 'NIST',
        year: 2007,
        url: 'https://csrc.nist.gov/publications/detail/sp/800-38d/final',
        type: 'standard',
      },
    ],
    tags: ['padding-oracle', 'cbc', 'vaudenay', 'lucky13', 'aead'],
    sections: [
      {
        id: 'introduction',
        title: "Vaudenay's 2002 Discovery",
        content: `In 2002, Serge Vaudenay discovered that block ciphers in **CBC mode** leak information through error messages. If a system distinguishes "invalid padding" from other errors, an attacker can use this **padding oracle** to decrypt arbitrary ciphertexts — without knowing the key.

**Famous real-world attacks:**
- **ASP.NET (2010):** Scott Guthrie disclosed a critical padding oracle in ASP.NET — thousands of sites compromised.
- **POODLE (2014):** Bodo Möller et al. broke SSL 3.0 via padding oracle in CBC mode.
- **Lucky Thirteen (2013):** Timing-based variant against TLS-CBC.
- **ROBOT (2017):** Reused padding oracle against many TLS stacks.

Padding oracles are one of the most practically devastating crypto vulnerabilities.`,
        keyPoints: [
          'Requires CBC mode with PKCS#7-style padding',
          'Attacker needs only a binary "valid/invalid padding" signal',
          'Decrypts entire ciphertext byte-by-byte in ~128 × length queries',
          'Completely defeated by AEAD ciphers (AES-GCM, ChaCha20-Poly1305)',
        ],
      },
      {
        id: 'concept',
        title: 'CBC Padding and the Oracle',
        content: `**CBC mode recap:** Each plaintext block Pᵢ is XORed with the previous ciphertext block Cᵢ₋₁ before encryption:

**Cᵢ = E_K(Pᵢ ⊕ Cᵢ₋₁)**

Decryption reverses this: **Pᵢ = D_K(Cᵢ) ⊕ Cᵢ₋₁**

**PKCS#7 padding:** If the last plaintext block is L bytes short of the block size B, append (B − L) bytes each with value (B − L). For example, 5 bytes short of 16-byte block → append 11 × 0x0B.

**The oracle:** When decrypting, the server checks if the padding is valid:
- Valid padding → proceeds normally → returns "OK" or generic error
- Invalid padding → returns "Padding error"

This **tiny difference in error handling** is the entire oracle. The attacker submits crafted ciphertexts and observes which return "padding error" vs any other response.

**The attack:** For each target ciphertext block Cᵢ, the attacker:
1. Crafts a modified previous block C'ᵢ₋₁ with guesses for the intermediate state.
2. Submits (C'ᵢ₋₁, Cᵢ) to the oracle.
3. If padding validates, the intermediate state byte is recovered.
4. Iterates byte-by-byte — 256 attempts max per byte.

Total queries: ~128 × ciphertext length to recover the full plaintext.`,
        codeSnippet: {
          language: 'typescript',
          code: `// VULNERABLE: Different error messages leak padding validity
try {
  const plaintext = decryptCBC(ciphertext, key, iv);
  res.status(200).json({ ok: true, plaintext });
} catch (err) {
  if (err.message === 'Invalid padding') {
    res.status(400).json({ error: 'Padding error' }); // ← ORACLE!
  } else {
    res.status(500).json({ error: 'Internal error' });
  }
}

// SECURE: Constant response, use AEAD
try {
  const plaintext = await aesGcmDecrypt(ciphertext, key); // AEAD
  res.status(200).json({ ok: true, plaintext });
} catch (err) {
  res.status(400).json({ error: 'Decryption failed' }); // ← same for all errors
}`,
          caption: 'Never reveal padding validity; prefer AEAD ciphers',
        },
      },
      {
        id: 'example',
        title: 'Byte-by-Byte Decryption (Conceptual)',
        content: `Suppose the target intermediate state is unknown: I = D_K(Cᵢ).

For the LAST byte of the block (position 15, 0-indexed):

1. Attacker sets C'ᵢ₋₁[0..14] to random, C'ᵢ₋₁[15] = g (guess).
2. Submits (C'ᵢ₋₁, Cᵢ).
3. Plaintext last byte = I[15] ⊕ g. If it equals 0x01 (valid PKCS#7 for 1 byte of padding), oracle returns "valid".
4. If oracle says valid, then I[15] = g ⊕ 0x01.
5. Attacker knows I[15]!

For the SECOND-TO-LAST byte:

1. Set C'ᵢ₋₁[15] = I[15] ⊕ 0x02 to force last byte to be 0x02.
2. Guess g for C'ᵢ₋₁[14].
3. When oracle validates (padding = 0x02 0x02), I[14] = g ⊕ 0x02.

Repeat for all 16 bytes. Then Pᵢ = I ⊕ Cᵢ₋₁_original.

**Amortized cost:** 256 × 16 = 4096 queries per block (worst case), or ~128 average if you stop at first valid guess.`,
      },
      {
        id: 'visualization',
        title: 'The Oracle Exploit',
        content: `Attacker: knows C₀, C₁ (ciphertext)
            wants P₁ = D_K(C₁) ⊕ C₀
            knows NOTHING about D_K

         ┌─────────────────────┐
         │   Attacker sends    │
         │   (C₀' , C₁)  ────► │
         └─────────────────────┘
                  │
                  ▼
         ┌─────────────────────┐
         │   Server decrypts   │
         │   P₁' = D_K(C₁) ⊕ C₀'
         │   Checks padding    │
         └─────────────────────┘
                  │
                  ▼
         ┌─────────────────────┐
         │  Response "Pad OK"  │
         │  or "Pad Error"  ◄──┼── ORACLE
         └─────────────────────┘
                  │
                  ▼
         Attacker adjusts C₀' and repeats
         → recovers D_K(C₁) byte-by-byte`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Padding oracle essentials:',
        keyPoints: [
          'Any error distinction that reveals padding validity is a fatal oracle.',
          'CBC without authentication is dangerous in production.',
          'AEAD ciphers (AES-GCM, ChaCha20-Poly1305) eliminate this entire class.',
          'Constant-time error handling is mandatory for all decryption failures.',
        ],
      },
      {
        id: 'exercise',
        title: 'Checkpoint',
        content: 'Test your understanding of padding oracles.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content:
          'You understand padding oracle attacks and the AEAD defense. Next: quantum cryptography (different from post-quantum!).',
      },
    ],
    interactiveExercise: {
      question: 'What is the primary defense against padding oracle attacks?',
      instruction: 'Select the most robust mitigation.',
      inputType: 'choice',
      options: [
        'Use AEAD ciphers (AES-GCM) that produce a tag and return one constant error on any failure',
        'Use a longer IV',
        'Increase the block size',
        'Use a bigger key',
      ],
      correctAnswer:
        'Use AEAD ciphers (AES-GCM) that produce a tag and return one constant error on any failure',
      hint: 'AEAD ciphers integrate authentication so any tampering is detected uniformly.',
      explanation:
        'AEAD ciphers like AES-GCM produce a single authentication tag and return a single error on any failure (tamper OR padding), eliminating the oracle. Larger IVs/keys/blocks do not help.',
    },
  },

  // ============================================================
  // LESSON 24 — QUANTUM CRYPTOGRAPHY (QKD)
  // ============================================================
  {
    id: 'quantum-cryptography',
    slug: 'quantum-cryptography',
    order: 24,
    title: 'Quantum Cryptography (QKD)',
    category: 'modern',
    description:
      'Not to be confused with post-quantum: quantum key distribution uses physics (not math) to detect eavesdroppers.',
    difficulty: 'advanced',
    estimatedMinutes: 16,
    xpReward: 60,
    references: [
      {
        title:
          'Quantum Cryptography: Public Key Distribution and Coin Tossing (BB84)',
        author: 'C. H. Bennett, G. Brassard',
        year: 1984,
        url: 'https://www.sciencedirect.com/science/article/pii/S0304397585800357',
        type: 'paper',
      },
      {
        title:
          'Satellite-to-ground quantum key distribution (Micius)',
        author: 'S.-K. Liao et al.',
        year: 2017,
        url: 'https://www.nature.com/articles/nature23675',
        type: 'paper',
      },
    ],
    tags: ['qkd', 'bb84', 'quantum', 'physics', 'eavesdropping'],
    sections: [
      {
        id: 'introduction',
        title: 'Cryptography from Physics',
        content: `**Post-quantum cryptography (PQC)** and **quantum cryptography** are often confused — they are entirely different fields:

- **PQC:** classical algorithms (running on classical computers) designed to resist quantum attacks. Example: ML-KEM.
- **Quantum cryptography:** uses quantum mechanics to achieve cryptographic goals — most famously **Quantum Key Distribution (QKD)**, which detects any eavesdropping through physics.

QKD does not replace encryption algorithms; it provides a **secure channel for distributing symmetric keys**. Once the key is distributed, classical encryption (e.g. AES) is used normally.`,
        keyPoints: [
          'QKD relies on physical laws (no-cloning theorem, measurement disturbance).',
          'BB84 protocol (Bennett & Brassard, 1984) is the most famous QKD scheme.',
          'Detects eavesdropping — an attacker cannot listen silently.',
          'Practical range limited (~100–500 km via fiber, ~1000 km via satellite).',
        ],
      },
      {
        id: 'concept',
        title: 'The BB84 Protocol',
        content: `BB84 uses polarized photons in two non-orthogonal bases:

**Basis ⊕ (rectilinear):** | (0°) = 0, — (90°) = 1
**Basis ⊗ (diagonal):** ╱ (45°) = 0, ╲ (135°) = 1

**Protocol:**
1. **Alice sends:** For each bit, Alice randomly chooses a bit (0/1) and a basis (⊕ or ⊗), then encodes the bit as a photon in that basis.
2. **Bob measures:** Bob randomly chooses a basis for each photon and measures.
3. **Sifting:** Alice and Bob publicly compare their basis choices (not the bit values). They keep only the bits where their bases matched — about 50% of transmitted photons.
4. **Error check:** They sacrifice a subset of the kept bits to estimate the error rate.
5. **Privacy amplification:** If error rate is below a threshold (~11%), they hash the remaining bits to eliminate any partial information leaked to an eavesdropper.
6. **Result:** Alice and Bob share a secret key with provable security.

**Why eavesdropping is detected:** The no-cloning theorem prevents Eve from copying photons. Any measurement she makes disturbs their quantum state, introducing detectable errors.`,
        codeSnippet: {
          language: 'text',
          code: `Step 1 — Quantum Transmission:
Alice sends photons in random bases

  Bit:   0   1   0   0   1   1   0   1
  Basis: ⊕   ⊗   ⊕   ⊗   ⊗   ⊕   ⊕   ⊗

Step 2 — Bob Measures (random basis):
  Basis: ⊕   ⊗   ⊗   ⊕   ⊗   ⊕   ⊗   ⊗
  Match: ✓   ✓   ✗   ✗   ✓   ✓   ✗   ✓

Step 3 — Sifting (keep only matches):
  Bit:   0   1   1   1   1   ← sifted key bits (must match)

Step 4 — Error Check & Privacy Amplification

Result: shared secret key, e.g. 256 bits`,
          caption: 'BB84 sifting: only ~50% of photons survive, plus error check',
        },
      },
      {
        id: 'example',
        title: 'Real-World QKD Systems',
        content: `**Commercial QKD:**
- **ID Quantique (Swiss):** Clavis2 and Cerberis systems used in banking and government networks.
- **Toshiba QKD:** Long-distance fiber QKD, up to 600+ km with trusted nodes.
- **China's Micius satellite (2016):** Demonstrated QKD from ground to satellite over 1200 km; distributed keys between Beijing and Vienna in 2017.

**Limitations:**
- **Distance-limited:** Signal loss over fiber means trusted nodes or satellite links are needed for long-distance.
- **Rate-limited:** Current systems produce keys at Kbps to Mbps rates — much slower than classical key exchange.
- **Hardware cost:** Requires specialized single-photon detectors (often cooled to very low temperatures).
- **Authentication bottleneck:** QKD requires a pre-shared authenticated classical channel to prevent MITM — a chicken-and-egg problem.

**Consensus:** QKD is valuable for specific high-value scenarios (government, banking backbone), but PQC is the more practical path for wide-scale deployment.`,
      },
      {
        id: 'visualization',
        title: 'QKD vs PQC',
        content: `┌────────────────────┬──────────────────────────┬──────────────────────────┐
│ Feature            │ Quantum Key Distribution │ Post-Quantum Crypto      │
├────────────────────┼──────────────────────────┼──────────────────────────┤
│ Runs on            │ Quantum hardware          │ Classical computers      │
│ Security from      │ Physics (no-cloning)      │ Math (LWE, lattices)     │
│ Eavesdrop detect?  │ YES (physical)            │ NO (mathematical only)   │
│ Distance           │ ~100–500 km fiber         │ Unlimited (network)      │
│ Cost               │ High (specialized HW)     │ Low (software only)      │
│ Standardization    │ Proprietary               │ NIST FIPS (2024)         │
│ Practical today    │ Niche (gov, banks)        │ Deploying widely         │
└────────────────────┴──────────────────────────┴──────────────────────────┘`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Quantum cryptography essentials:',
        keyPoints: [
          'QKD uses physics (not math) to detect eavesdroppers.',
          'BB84 is the most widely implemented QKD protocol.',
          'Practical range is limited; requires specialized hardware.',
          'PQC is preferred for wide-scale deployment; QKD for niche high-value links.',
        ],
      },
      {
        id: 'exercise',
        title: 'Final Checkpoint',
        content: 'Test your understanding of quantum cryptography.',
      },
      {
        id: 'summary',
        title: 'Congratulations!',
        content:
          'You have completed all 24 cryptography lessons — from ancient Caesar shifts to modern post-quantum and quantum key distribution. You now have a comprehensive understanding of cryptography across all eras!',
      },
    ],
    interactiveExercise: {
      question:
        'What makes BB84 (Quantum Key Distribution) fundamentally different from classical key exchange?',
      instruction: 'Select the key distinguishing property.',
      inputType: 'choice',
      options: [
        'Eavesdropping is physically detectable due to quantum measurement disturbance',
        'It uses larger keys',
        'It runs faster than AES',
        'It does not require a shared secret',
      ],
      correctAnswer:
        'Eavesdropping is physically detectable due to quantum measurement disturbance',
      hint: 'The no-cloning theorem prevents Eve from copying photons without disturbing them.',
      explanation:
        'BB84 relies on quantum mechanics: any measurement of a photon by an eavesdropper disturbs its state, introducing errors that Alice and Bob can detect. This is a physical, not mathematical, guarantee.',
    },
  },
];