import { Lesson } from '../../types/lesson';

/**
 * Advanced Lessons — Order 16-30
 *
 * Deep-dive mathematical internals, modern algorithm analysis,
 * real-world attack simulations, and cutting-edge cryptographic protocols.
 *
 * Prerequisite: complete beginner (1-8) and intermediate (9-18) tracks.
 *
 * Order:
 *   19. Caesar Cipher Deep Dive
 *   20. Atbash Cipher Deep Dive
 *   21. Vigenère Cipher & Kasiski Examination
 *   22. XOR & Stream Ciphers
 *   23. AES-GCM Internals
 *   24. RSA-OAEP Deep Dive
 *   25. Elliptic Curve Cryptography
 *   26. Post-Quantum Cryptography
 *   27. Side-Channel Attacks
 *   28. Length Extension Attacks
 *   29. Padding Oracle Attacks
 *   30. Quantum Cryptography (QKD)
 *   31. Zero-Knowledge Proofs
 *   32. Secure Multi-Party Computation
 *   33. Blockchain Cryptography
 *
 * Sources: see references.ts — all citations are drawn from
 * NIST, IETF RFC, peer-reviewed papers, and standard textbooks.
 */
export const ADVANCED_LESSONS: Lesson[] = [
  // ============================================================
  // LESSON 19 — CAESAR CIPHER DEEP DIVE
  // ============================================================
  {
    id: 'caesar-cipher-deep-dive',
    slug: 'caesar-cipher-deep-dive',
    order: 19,
    title: 'Caesar Cipher Deep Dive',
    category: 'foundations',
    description:
      "Go beyond the textbook Caesar cipher and analyze it mathematically — modular arithmetic, keyspace enumeration, and why even Rome's finest general was cryptographically doomed. This lesson formalizes the substitution cipher and reveals the recurring patterns that every future cipher inherits.",
    difficulty: 'advanced',
    estimatedMinutes: 12,
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
      {
        title: 'Introduction to Modern Cryptography (3rd Edition)',
        author: 'J. Katz, Y. Lindell',
        year: 2020,
        url: 'https://www.taylorfrancis.com/books/mono/10.1201/9781351133036/introduction-modern-cryptography-jonathan-katz-yehuda-lindell',
        type: 'book',
      },
    ],
    tags: ['classical', 'caesar', 'substitution', 'modular-arithmetic'],
    sections: [
      {
        id: 'introduction',
        title: 'Historical Context',
        content: `The Caesar cipher is one of the earliest known substitution ciphers, named after **Julius Caesar** (100–44 BC) who used it with a shift of 3 to protect military dispatches. According to Suetonius (The Twelve Caesars), Caesar replaced each letter with the one three positions further down the alphabet.

Despite its simplicity, the Caesar cipher introduces foundational concepts that underpin all modern cryptography: **transformation functions**, **keys**, **keyspace size**, and **modular arithmetic**. Mastering these concepts in the Caesar cipher gives you the vocabulary to analyze AES, RSA, and even post-quantum algorithms in later lessons.

This deep dive examines the Caesar cipher not as a curiosity, but as a **pedagogical foundation** — a mirror in which modern cryptographic principles appear in their simplest form.`,
        keyPoints: [
          'Monoalphabetic substitution cipher — each letter maps to exactly one other',
          'Keyspace is extremely small (only 25 meaningful shifts)',
          'Vulnerable to brute-force, frequency analysis, and known-plaintext attacks',
          'Introduces modular arithmetic — the mathematical backbone of all modern crypto',
        ],
      },
      {
        id: 'concept',
        title: 'Mathematical Formulation',
        content: `Assign each English letter a numeric value: A=0, B=1, ..., Z=25. Encryption of a plaintext character P with shift key K is:

**C = (P + K) mod 26**

Decryption reverses the operation:

**P = (C − K + 26) mod 26**

The "mod 26" ensures we wrap around from Z back to A. This is our first encounter with **modular arithmetic** in cryptography — the mathematical structure that underlies RSA (mod N), Diffie-Hellman (mod p), and elliptic curve cryptography (over finite fields).

**Key insight:** The Caesar cipher is a member of the **general affine cipher family** C = (a·P + b) mod 26 with a=1 and b=K. Affine ciphers allow a wider range of transformations (but still fall to frequency analysis).`,
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

An attacker with a modern laptop can test all 25 shifts in less than a millisecond. Even a human can do it by hand in a few minutes by scanning for recognizable English words.

**Historical note:** Julius Caesar reportedly used shift=3 not for security (which was already weak even in 50 BC) but for **convenience** — a literate enemy could still decode his messages. The real protection was the secrecy of the shift value, not the algorithm — foreshadowing Kerckhoffs's Principle (which would be formalized 1,900 years later).`,
        keyPoints: [
          'Keyspace size: 26 (or 25 effective)',
          'Brute-force time (modern): < 1 ms',
          'Brute-force time (human): a few minutes',
          'Historical protection came from key secrecy, not algorithm secrecy',
        ],
      },
      {
        id: 'visualization',
        title: 'Shift Visualization',
        content: `The Caesar cipher maps each letter to a fixed offset position, wrapping around at Z. The diagram below shows a shift of +3 applied to "HELLO WORLD":

| Plain  | H | E | L | L | O |   | W | O | R | L | D |
|--------|---|---|---|---|---|---|---|---|---|---|---|
| Cipher | K | H | O | O | R |   | Z | R | U | O | G |

Because the mapping is fixed, an attacker only needs to try 25 shifts. Frequency analysis on longer messages is even faster — the letter E (12.7% of English) will always appear as the most frequent ciphertext letter (shifted).`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Foundational lessons from the Caesar cipher:',
        keyPoints: [
          'Modular arithmetic (mod 26) is a core cryptographic building block.',
          'The keyspace must be large enough to resist brute-force.',
          'Monoalphabetic ciphers preserve frequency distributions — a fatal flaw.',
          'Caesar cipher is a member of the affine cipher family.',
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
  // LESSON 20 — ATBASH CIPHER DEEP DIVE
  // ============================================================
  {
    id: 'atbash-cipher-deep-dive',
    slug: 'atbash-cipher-deep-dive',
    order: 20,
    title: 'Atbash Cipher Deep Dive',
    category: 'foundations',
    description:
      "The ancient Hebrew mirror cipher that requires no key at all — a self-inverting substitution that maps A↔Z, B↔Y, and C↔X. Learn why involutory functions (f(f(x)) = x) appear throughout modern cryptography, from XOR to Feistel networks.",
    difficulty: 'advanced',
    estimatedMinutes: 10,
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
      {
        title: 'Introduction to Modern Cryptography (3rd Edition)',
        author: 'J. Katz, Y. Lindell',
        year: 2020,
        url: 'https://www.taylorfrancis.com/books/mono/10.1201/9781351133036/introduction-modern-cryptography-jonathan-katz-yehuda-lindell',
        type: 'book',
      },
    ],
    tags: ['classical', 'atbash', 'hebrew', 'involutory'],
    sections: [
      {
        id: 'introduction',
        title: 'Biblical Origins',
        content: `The Atbash cipher is a monoalphabetic substitution that predates the Common Era, used by Hebrew scribes to encode sacred texts. Its name is derived from the Hebrew alphabet: **Aleph** (א) → **Tav** (ת), **Bet** (ב) → **Shin** (ש) — the first letter maps to the last, the second to the second-to-last, and so on.

The cipher appears in several passages of the Hebrew Bible, including **Jeremiah 25:26** and **Jeremiah 51:41**, where "Babel" (Babylon) is written as "Sheshach" using Atbash. Its historical use was likely more **literary/cryptic** than military — a form of esoteric encoding rather than battlefield encryption.

**Why it matters today:** Atbash is the classic example of an **involution** — a function that is its own inverse. Modern cryptographic primitives like XOR, the Feistel network, and even certain lattice operations inherit this elegant mathematical property.`,
        keyPoints: [
          'Self-inverting (involutory): encryption and decryption are the same operation',
          'No key is required — the substitution is fixed by the alphabet',
          'Preserves letter frequency, making it trivially breakable',
          'Introduces the concept of involution — foundational to modern crypto',
        ],
      },
      {
        id: 'concept',
        title: 'Mathematical Formulation',
        content: `Assign letters numeric values A=0, B=1, ..., Z=25. Atbash applies the transformation:

**C = 25 − P** (for the English 26-letter alphabet)

Because subtraction is symmetric, applying Atbash twice returns the original character:

**Atbash(Atbash(P)) = 25 − (25 − P) = P**

This makes Atbash an example of an **involution** — a function that is its own inverse. Modern cryptographic involutions include the XOR operation and the Feistel network structure used in DES. The advantage of an involution is elegant: only one implementation is needed, and applying it twice is guaranteed to reverse itself.`,
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

Both are strictly educational and unsafe for any real-world use. The value of studying them is **conceptual**, not practical — they teach us about keyspace, frequency analysis, and mathematical structure.`,
      },
      {
        id: 'visualization',
        title: 'Mirror Mapping',
        content: `The Atbash cipher maps each letter to its mirror position in the alphabet:

| Plain  | A | B | C | D | E | F | ... | M | N | ... | X | Y | Z |
|--------|---|---|---|---|---|---|-----|---|---|-----|---|---|---|
| Cipher | Z | Y | X | W | V | U | ... | N | M | ... | C | B | A |

Notice the pattern: A↔Z, B↔Y, C↔X, M↔N. Applying Atbash twice returns the original letter (involution property).`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Foundational lessons from Atbash:',
        keyPoints: [
          'Involutory functions (f(f(x)) = x) appear throughout modern cryptography.',
          'Fixed-substitution ciphers provide zero confidentiality.',
          'Atbash preserves frequency statistics — vulnerable to analysis.',
          'Involutions (XOR, Feistel) are foundational primitives in modern crypto.',
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
  // LESSON 21 — VIGENÈRE CIPHER & KASISKI EXAMINATION
  // ============================================================
  {
    id: 'vigenere-cipher-analysis',
    slug: 'vigenere-cipher-analysis',
    order: 21,
    title: 'Vigenère Cipher & Kasiski Examination',
    category: 'mechanisms',
    description:
      'The polyalphabetic cipher once called "le chiffre indéchiffrable" — and how Babbage and Kasiski finally broke it after three centuries. Learn why key repetition leaks critical information, and how the ancestor of all modern cryptanalysis works.',
    difficulty: 'advanced',
    estimatedMinutes: 16,
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
      {
        title: 'Communication Theory of Secrecy Systems',
        author: 'C. E. Shannon',
        year: 1949,
        url: 'https://ieeexplore.ieee.org/document/6769090',
        type: 'paper',
      },
    ],
    tags: ['classical', 'vigenere', 'polyalphabetic', 'kasiski', 'cryptanalysis'],
    sections: [
      {
        id: 'introduction',
        title: 'Three Centuries of Invincibility',
        content: `The Vigenère cipher was first described by Giovan Battista Bellaso in 1553 (later misattributed to Blaise de Vigenère). It uses a **keyword** to apply a different Caesar shift to each letter of the plaintext, defeating the frequency analysis that broke simple monoalphabetic ciphers.

For nearly 300 years, the Vigenère cipher was considered unbreakable — nicknamed **"le chiffre indéchiffrable"** (the indecipherable cipher). It was finally broken independently by **Charles Babbage** (1854, unpublished) and **Friedrich Kasiski** (1863, published). Their technique — analyzing repeated sequences to deduce key length — remains the foundation of modern cryptanalysis.

**Why this lesson matters:** The Vigenère cipher shows that defeating frequency analysis is not enough. Even polyalphabetic ciphers leak statistical structure if the key repeats. Modern ciphers avoid this via **key whitening**, **round constants**, and **non-linear S-boxes** — concepts directly descended from the lessons learned here.`,
        keyPoints: [
          'Polyalphabetic substitution: each plaintext letter uses a different shift',
          'Keyword repeats cyclically, determining shifts',
          'Vulnerable to Kasiski examination and Friedman frequency analysis',
          'Introduces cryptanalysis — the science of breaking ciphers',
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

Because the keyword repeats every m letters, the cipher effectively consists of **m interleaved Caesar ciphers**. This structure is both its strength (defeating single-letter frequency) and its fatal weakness (leaking key length).`,
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

Once m is known, the ciphertext splits into m independent Caesar ciphers, each broken by standard frequency analysis. This **two-stage attack** (find key length, then break each Caesar) is the ancestor of modern divide-and-conquer cryptanalysis of block ciphers.`,
      },
      {
        id: 'visualization',
        title: 'Polyalphabetic Structure',
        content: `With keyword "KEY" (K=10, E=4, Y=24), each position uses a different Caesar shift. The table below shows the encryption of "HELLO WORLD":

| Position | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|----------|---|---|---|---|---|---|---|---|---|----|----|
| Plain    | H | E | L | L | O |   | W | O | R | L  | D  |
| Key      | K | E | Y | K | E |   | Y | K | E | Y  | K  |
| Shift    | 10| 4 | 24| 10| 4 |   | 24| 10| 4 | 24 | 10 |
| Cipher   | R | I | J | V | S |   | U | Y | V | J  | N  |

Each row uses a different Caesar shift, destroying single-letter frequency patterns within a 3-letter window. But because the keyword repeats every 3 letters, positions 1, 4, 7, 10 all use shift 10 — leaking the key length to a Kasiski examination.`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Lessons from Vigenère:',
        keyPoints: [
          'Polyalphabetic ciphers defeat simple frequency analysis.',
          'Repeating keywords leak the key length through Kasiski examination.',
          'If the key is truly random and as long as the message, the cipher becomes an unbreakable One-Time Pad.',
          'Divide-and-conquer cryptanalysis is born here — key length first, then break sub-ciphers.',
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
  // LESSON 22 — XOR & STREAM CIPHERS
  // ============================================================
  {
    id: 'xor-stream-ciphers',
    slug: 'xor-stream-ciphers',
    order: 22,
    title: 'XOR & Stream Ciphers',
    category: 'mechanisms',
    description:
      'The exclusive-OR operation — the bitwise primitive powering every modern cipher, from AES to ChaCha20. Discover why XOR is its own inverse, how the One-Time Pad achieves perfect secrecy, and how the Two-Time Pad catastrophe broke Soviet espionage.',
    difficulty: 'advanced',
    estimatedMinutes: 14,
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
      {
        title: 'Serious Cryptography: A Practical Introduction to Modern Encryption',
        author: 'J.-P. Aumasson',
        year: 2017,
        url: 'https://nostarch.com/seriouscrypto',
        type: 'book',
      },
    ],
    tags: ['xor', 'stream-cipher', 'vernam', 'one-time-pad', 'chacha20'],
    sections: [
      {
        id: 'introduction',
        title: 'The Humble XOR',
        content: `The exclusive-OR (XOR) operation is the most fundamental bitwise primitive in cryptography. Its truth table is deceptively simple:

| A | B | A XOR B |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

The critical property: **XOR is its own inverse**. For any bytes A and B: (A XOR B) XOR B = A. This means the same operation both encrypts and decrypts — no separate inverse function needed.

Almost every modern cipher uses XOR internally. AES XORs round keys with the state. ChaCha20 XORs a keystream with plaintext. SHA-256 XORs intermediate hash values. Even lattice-based post-quantum ciphers use XOR in their arithmetic. Mastering XOR is a prerequisite for understanding everything else.`,
        keyPoints: [
          'XOR is involutory: (A XOR B) XOR B = A',
          'Foundation of all modern stream ciphers (ChaCha20, RC4)',
          'Used internally by AES, SHA-256, and virtually every cipher',
          'The One-Time Pad — based on XOR — is the only provably perfect cipher',
        ],
      },
      {
        id: 'concept',
        title: 'The One-Time Pad (OTP)',
        content: `In 1917, Gilbert Vernam patented a cipher where each plaintext bit is XORed with a truly random key bit:

**Cᵢ = Pᵢ XOR Kᵢ**

Claude Shannon proved in 1949 that if K is:
1. **Truly random** (not pseudorandom)
2. **As long as the message**
3. **Never reused** (used only once)

...then the cipher is **information-theoretically secure** — even an adversary with infinite computing power cannot break it. This is the only cryptographic system proven to have **perfect secrecy**.

**The catch:** Distributing OTPs of the same length as every message is impractical. You would need to securely deliver gigabytes of random key material for gigabytes of data — a chicken-and-egg problem. Modern stream ciphers replace the truly random key with a **pseudorandom keystream** generated from a short seed (like ChaCha20 with a 256-bit key and 96-bit nonce).`,
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

const ciphertext = xorCipher(plaintext, key);
const recovered = xorCipher(ciphertext, key); // → "SECRET"`,
          caption: 'XOR is involutory — same function encrypts and decrypts',
        },
      },
      {
        id: 'example',
        title: 'The Two-Time Pad Catastrophe',
        content: `A common mistake: reusing the same XOR keystream for two different messages. Consider two ciphertexts:

C₁ = P₁ XOR K
C₂ = P₂ XOR K

XORing them cancels the key entirely:

C₁ XOR C₂ = P₁ XOR K XOR P₂ XOR K = P₁ XOR P₂

An attacker now has the XOR of the two plaintexts — often enough to recover both via **crib-dragging** (guessing common words). This attack famously broke the Soviet VENONA project in the 1940s. American cryptanalysts, using crib-dragging and statistical methods, decrypted thousands of Soviet intelligence messages — even though each individual message used a "secure" OTP. The flaw: the Soviets **reused key material** across multiple messages, turning OTP into Two-Time Pad.

**Modern implication:** This is exactly why AES-GCM forbids nonce reuse. Every encryption must have a fresh, unique nonce. One byte of reuse destroys the entire cipher's security.`,
      },
      {
        id: 'visualization',
        title: 'XOR in a Modern Stream Cipher',
        content: `A modern stream cipher (e.g., ChaCha20) works in four steps:

| Step | Operation | Result |
|---|---|---|
| 1 | Combine 256-bit key + 96-bit nonce + counter | Initial state |
| 2 | Apply 20 rounds of ARX (Add-Rotate-XOR) | 64-byte keystream block |
| 3 | XOR keystream with plaintext | Ciphertext |
| 4 | Destroy keystream + nonce | Forward secrecy |

The keystream is pseudorandom (not truly random like OTP), but indistinguishable from random for any feasible computation. The ARX structure (Add, Rotate, XOR) avoids data-dependent table lookups, making ChaCha20 immune to cache-timing attacks.`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'XOR essentials:',
        keyPoints: [
          'XOR is involutory — the same operation encrypts and decrypts.',
          'One-Time Pad is the only information-theoretically secure cipher.',
          'Never reuse a XOR keystream — Two-Time Pad attack reveals P₁ XOR P₂.',
          'ChaCha20 and AES-GCM use XOR with pseudorandom keystreams.',
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
      question: 'Given C₁ = P₁ XOR K and C₂ = P₂ XOR K, what does C₁ XOR C₂ equal?',
      instruction: 'Simplify using XOR properties.',
      inputType: 'choice',
      options: ['P₁ XOR P₂', 'K', 'P₁ XOR P₂ XOR K', '0'],
      correctAnswer: 'P₁ XOR P₂',
      hint: 'K XOR K = 0. So C₁ XOR C₂ = P₁ XOR K XOR P₂ XOR K = P₁ XOR P₂.',
      explanation:
        '(P₁ XOR K) XOR (P₂ XOR K) = P₁ XOR P₂ XOR (K XOR K) = P₁ XOR P₂ XOR 0 = P₁ XOR P₂. This is why key reuse is catastrophic.',
    },
  },

  // ============================================================
  // LESSON 23 — AES-GCM INTERNALS
  // ============================================================
  {
    id: 'aes-gcm-internals',
    slug: 'aes-gcm-internals',
    order: 23,
    title: 'AES-GCM Internals',
    category: 'mechanisms',
    description:
      "Inside the world's most deployed authenticated cipher: how AES-CTR and GHASH combine in a single pass to provide confidentiality and integrity. Understand why nonce reuse is catastrophic and how GF(2^128) multiplication authenticates every byte.",
    difficulty: 'advanced',
    estimatedMinutes: 20,
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
        content: `AES-GCM (Advanced Encryption Standard in Galois/Counter Mode) is defined in **NIST SP 800-38D** and is the most widely deployed AEAD (Authenticated Encryption with Associated Data) cipher in the world. It protects TLS 1.3, IPsec, SSH, and countless other protocols — including every HTTPS connection your browser makes.

GCM elegantly combines two cryptographic primitives into a single pass:

1. **AES-CTR** — for encryption (confidentiality)
2. **GHASH** — for authentication (integrity), using multiplication in the Galois field GF(2^128)

The result is a single cipher that produces both ciphertext and a **16-byte authentication tag**. If even one bit of the ciphertext is modified, decryption fails instantly — no need for a separate MAC algorithm.`,
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
- Start with a 96-bit nonce. Build counter blocks: J0 = nonce + 0x00000001
- For each plaintext block Pi: Ci = Pi XOR AES_K(J0 + i)
- The AES outputs form a **keystream** that is XORed with the plaintext

**3. GHASH Authentication:**
- GHASH operates in GF(2^128) — the Galois field with 2^128 elements
- It computes: H = AES_K(0^128) (the hash subkey)
- Then iteratively processes ciphertext blocks: Yi = (Yi-1 XOR Ci) * H in GF(2^128)
- Final tag: T = AES_K(J0) XOR GHASH(...)

**4. Output:** (ciphertext, 16-byte authentication tag)

The tag provides **integrity**: any single-bit modification to the ciphertext produces a completely different tag (avalanche effect in GF(2^128)). This is achieved in a single pass, making AES-GCM both fast and secure.`,
        codeSnippet: {
          language: 'plaintext',
          code: `GCM Authentication Tag Construction (Conceptual)

              Nonce (96 bits)              Key
                   |                        |
                   +--> J0 --------> AES_K -+
                   |                        |
   Plaintext -----> XOR <--- keystream ----+
        |            |
        |            v
        |       Ciphertext
        |            |
        +------------+--> GHASH (GF 2^128) --+
                     |                       |
        AAD ---------+                       XOR
                                             |
                                     AES_K(J0)
                                             |
                                             v
                                  Auth Tag (16 bytes)`,
          caption: 'AES-GCM: AES-CTR for encryption + GHASH for authentication',
        },
      },
      {
        id: 'example',
        title: 'Why Nonce Reuse is Catastrophic',
        content: `If the same (key, nonce) pair encrypts two different messages:

C₁ = P₁ XOR AES_K(J0)
C₂ = P₂ XOR AES_K(J0)

XORing reveals the plaintext XOR:

C₁ XOR C₂ = P₁ XOR P₂

Worse — in GCM, nonce reuse also leaks the GHASH subkey H, allowing an attacker to **forge arbitrary authentication tags** on any message. This is why every GCM implementation MUST generate a fresh random nonce for every encryption.

**Historical incident:** In 2016, the "Nonce-Disrespecting Adversaries" paper (Böck et al., USENIX WOOT) found **184 HTTPS servers** reusing GCM nonces, completely breaking their TLS security. The fix: always generate a fresh 12-byte nonce with crypto.getRandomValues().`,
        keyPoints: [
          'Nonce reuse in GCM = broken confidentiality AND integrity',
          'GHASH subkey H becomes recoverable → tag forgery becomes trivial',
          'Always use 12-byte random nonces via crypto.getRandomValues()',
        ],
      },
      {
        id: 'visualization',
        title: 'GCM Data Flow',
        content: `Encryption (single pass):

| Component | Input | Operation | Output |
|---|---|---|---|
| AES-CTR | Plaintext + keystream from AES_K(J0+i) | XOR | Ciphertext blocks |
| GHASH | Ciphertext + AAD | GF(2^128) multiply-accumulate | Intermediate hash |
| Final tag | GHASH result + AES_K(J0) | XOR | 16-byte authentication tag |

Decryption repeats the same GHASH computation and compares the computed tag with the received tag. Any mismatch → decryption fails immediately.`,
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
        'Confidentiality is broken (C1 XOR C2 = P1 XOR P2) AND the authentication key leaks, allowing tag forgery',
        'Only the authentication tag becomes invalid',
        'Nothing — GCM handles nonce reuse automatically',
        'Only performance degrades',
      ],
      correctAnswer:
        'Confidentiality is broken (C1 XOR C2 = P1 XOR P2) AND the authentication key leaks, allowing tag forgery',
      hint: 'Reusing (key, nonce) in GCM is one of the most catastrophic cryptographic mistakes possible.',
      explanation:
        'Nonce reuse in GCM breaks both confidentiality (keystream XORs cancel) and integrity (GHASH subkey H can be recovered, enabling forgery). This is why NIST SP 800-38D mandates unique nonces.',
    },
  },

  // ============================================================
  // LESSON 24 — RSA-OAEP DEEP DIVE
  // ============================================================
  {
    id: 'rsa-oaep-deep-dive',
    slug: 'rsa-oaep-deep-dive',
    order: 24,
    title: 'RSA-OAEP Deep Dive',
    category: 'mechanisms',
    description:
      'Why textbook RSA is completely broken, and how Optimal Asymmetric Encryption Padding (OAEP) rescues it. Learn the MGF1 mask generator, the random oracle proof, and how randomized padding achieves the gold-standard IND-CCA2 security.',
    difficulty: 'advanced',
    estimatedMinutes: 22,
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
        content: `Textbook RSA (raw modular exponentiation without padding) has been known since the 1980s to be **completely insecure** for direct encryption. It suffers from five fundamental flaws:

1. **Determinism** — same plaintext always produces the same ciphertext
2. **Malleability** — an attacker can compute C * 2^e mod N, which decrypts to 2 * M
3. **Small-message attacks** — if M^e < N, then C = M^e exactly (no modulo reduction), and M = C^(1/e)
4. **Common-modulus attacks** — same message encrypted under multiple keys with different exponents can be recovered via CRT
5. **Chosen-ciphertext attacks** — an adversary with a decryption oracle can recover arbitrary plaintexts

The solution: **optimal asymmetric encryption padding (OAEP)**, introduced by Bellare and Rogaway in 1994. OAEP adds randomized, hash-based padding that turns RSA into a provably secure IND-CCA2 encryption scheme under the random oracle model.`,
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
1. **Padding:** M is padded with a "label hash" and zero bytes to length (k - 2*hLen - 2)
   - DB = H(label) + zeros + 0x01 + M
2. **Random seed:** Generate a random hLen-byte seed r
3. **MGF (Mask Generation Function):** Use MGF1 (based on H) to expand r to the length of DB:
   - maskedDB = DB XOR MGF1(r)
   - maskedSeed = r XOR MGF1(maskedDB)
4. **Output:** EM = 0x00 + maskedSeed + maskedDB (length k)

**Then:** C = EM^e mod N

**Decoding** reverses the process, checks that the padding is well-formed, and rejects if not.

The **random seed** ensures that encrypting the same message twice gives different ciphertexts — the essential property for IND-CPA security. The **redundancy** in the padding makes it infeasible to forge valid ciphertexts, giving CCA security under the random oracle model.`,
        codeSnippet: {
          language: 'plaintext',
          code: `OAEP Encoding Pipeline

                           Message M
                               |
                               v
       +--------------------------------------------+
       |  DB = H(label) + zeros + 0x01 + M          |
       +--------------------------------------------+
                               |
   Random seed r --> MGF1 --> maskDB --> XOR --> maskedDB
                               |
       +-----------------------+
       |
       +--> MGF1(maskedDB) --> maskSeed --> XOR with r --> maskedSeed

   Final EM = 0x00 + maskedSeed + maskedDB
   Ciphertext C = EM^e mod N`,
          caption: 'OAEP: two-round Feistel-like padding with MGF1',
        },
      },
      {
        id: 'example',
        title: 'MGF1: Mask Generation Function',
        content: `MGF1 is a simple but effective mask generator based on a hash function. It converts a short random seed into a mask of arbitrary length by iteratively hashing (seed + counter):

**Algorithm (pseudocode):**

| Step | Operation |
|---|---|
| 1 | Initialize T as an empty string |
| 2 | Initialize counter = 0 |
| 3 | While length(T) < maskLen: T = T + H(seed + counter_bytes), counter = counter + 1 |
| 4 | Return first maskLen bytes of T |

MGF1 is essentially a hash-based pseudorandom generator: given a short random seed, it produces an arbitrarily long pseudorandom mask. OAEP uses MGF1 to "spread" the seed's randomness across the padded message.

**Security assumption:** MGF1 is modeled as a **random oracle** in the security proof — a theoretical construct where H behaves as a truly random function. Under this model, RSA-OAEP is proven IND-CCA2 secure. This proof is one of the crown jewels of modern cryptography.`,
        codeSnippet: {
          language: 'plaintext',
          code: `MGF1(seed, maskLen):
    T = empty string
    counter = 0
    while length(T) < maskLen:
        T = T + H(seed + counter_bytes)
        counter = counter + 1
    return T[0 : maskLen]`,
          caption: 'MGF1: hash-based mask generation for OAEP',
        },
      },
      {
        id: 'visualization',
        title: 'OAEP vs Textbook RSA',
        content: `Side-by-side comparison of the two approaches:

| Property | Textbook RSA | RSA-OAEP |
|---|---|---|
| Randomized? | No (deterministic) | Yes (random seed) |
| Same message → same ciphertext? | Yes | No |
| IND-CPA secure? | No | Yes |
| IND-CCA2 secure? | No | Yes (in ROM) |
| Padding overhead | 0 bytes | ~42 bytes (SHA-256) |
| Real-world use | Broken | RFC 8017 standard |

The trade-off: OAEP uses 42 bytes of overhead per ciphertext, but gains provable CCA security. Given RSA-2048 = 256 bytes, OAEP can encrypt up to ~214 bytes per block — enough for symmetric keys but not bulk data. This is why RSA-OAEP is used only for **key encapsulation** in hybrid encryption (TLS, PGP).`,
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
  // LESSON 25 — ELLIPTIC CURVE CRYPTOGRAPHY
  // ============================================================
  {
    id: 'elliptic-curve-crypto',
    slug: 'elliptic-curve-cryptography',
    order: 25,
    title: 'Elliptic Curve Cryptography',
    category: 'mechanisms',
    description:
      'Modern public-key cryptography on algebraic curves: 12x smaller keys than RSA, faster operations, and the Elliptic Curve Discrete Logarithm Problem. Discover why secp256k1 secures Bitcoin and Curve25519 powers Signal.',
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

A **256-bit ECC key** offers the same security as a **3072-bit RSA key** — a 12x reduction in size. This makes ECC ideal for constrained environments: smart cards, IoT devices, mobile phones, and TLS handshakes.

**Real-world deployments:** Bitcoin and Ethereum use secp256k1 for transaction signatures. Signal, WhatsApp, and Wire use X25519 (Curve25519) for key exchange. TLS 1.3 prefers ECDHE on P-256 or X25519 for forward secrecy.`,
        keyPoints: [
          'Same security with much smaller keys than RSA (12x reduction)',
          'Based on the Elliptic Curve Discrete Logarithm Problem (ECDLP)',
          'Standardized curves: NIST P-256/P-384/P-521, secp256k1 (Bitcoin), Curve25519',
          'Used in ECDSA (signatures) and ECDH (key exchange)',
        ],
      },
      {
        id: 'concept',
        title: 'Elliptic Curves over Finite Fields',
        content: `An elliptic curve over a prime field F_p is the set of points (x, y) satisfying:

**y^2 = x^3 + a*x + b (mod p)**

...plus a special "point at infinity" denoted O.

For NIST P-256, the parameters are:
- p = 2^256 - 2^224 + 2^192 + 2^96 - 1 (a 256-bit prime)
- a = -3
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
        title: 'ECDSA and the Sony PS3 Disaster',
        content: `ECDSA (standardized in FIPS 186) is the elliptic-curve analogue of DSA. The signing algorithm uses a per-signature random nonce k:

**Sign (private key d, message m):**
1. Compute hash e = H(m)
2. Pick random k in [1, n-1]
3. Compute point (x1, y1) = kG
4. Compute r = x1 mod n
5. Compute s = k^(-1) * (e + r*d) mod n
6. Signature = (r, s)

**Critical vulnerability:** if the random k is ever reused or predictable, the private key d can be recovered algebraically. This happened with the **Sony PlayStation 3 (2010)** — they used a **constant k** across all firmware signatures. Hackers recovered Sony's master signing key, enabling homebrew and piracy for the entire console generation.

**Modern mitigations:** RFC 6979 specifies **deterministic ECDSA**, where k is derived from the private key and message hash via HMAC — eliminating the RNG dependency. Ed25519 goes further with a misuse-resistant design.`,
      },
      {
        id: 'visualization',
        title: 'ECC vs RSA Security Equivalence',
        content: `Key size comparison at equivalent security levels:

| Security Bits | RSA Key Size | ECC Key Size | ECC Advantage |
|---|---|---|---|
| 80 | 1024 | 160 | 6.4x smaller |
| 112 | 2048 | 224 | 9.1x smaller |
| 128 | 3072 | 256 | 12x smaller |
| 192 | 7680 | 384 | 20x smaller |
| 256 | 15360 | 512 | 30x smaller |

As security requirements grow, ECC's advantage compounds. At 256-bit security (post-quantum-relevant for symmetric), ECC keys are 30x smaller than RSA — critical for constrained devices and bandwidth-limited protocols.`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'ECC fundamentals:',
        keyPoints: [
          'ECC = same security with ~12x smaller keys than RSA.',
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
  // LESSON 26 — POST-QUANTUM CRYPTOGRAPHY
  // ============================================================
  {
    id: 'post-quantum-crypto',
    slug: 'post-quantum-cryptography',
    order: 26,
    title: 'Post-Quantum Cryptography',
    category: 'modern',
    description:
      "Algorithms resistant to quantum computers: NIST PQC standards (ML-KEM/Kyber, ML-DSA/Dilithium, SLH-DSA/SPHINCS+) and the urgency of migration. Understand why Shor's algorithm breaks RSA/ECC and how lattice problems defend against quantum attacks.",
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

**Current threat assessment:** No existing quantum computer can break RSA-2048 or AES. But adversaries may be **harvesting encrypted data today** to decrypt it later (harvest-now, decrypt-later). Government agencies (NSA, BSI, ANSSI) have all issued migration mandates.`,
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
          language: 'plaintext',
          code: `NIST PQC Standards — Size Comparison

Algorithm       Type    Public Key   Ciphertext/Sig    Basis
-----------------------------------------------------------------
ML-KEM-768      KEM     1184 B       1088 B            Module-LWE
ML-DSA-65       Sig     1952 B       3309 B            Module-LWE+SIS
SLH-DSA-128s    Sig     32 B         7856 B            Hash only
FALCON-512      Sig     897 B        ~666 B            NTRU lattice

For reference (classical):
ECDH P-256      KEM     64 B         64 B
ECDSA P-256     Sig     64 B         64 B

Note: PQC keys/signatures are 10-100x larger than ECC.
This affects TLS handshake size, certificate chains, and
constrained-device deployments.`,
          caption:
            'PQC key/signature sizes are much larger than ECC — protocol design must adapt',
        },
      },
      {
        id: 'example',
        title: 'Learning With Errors (LWE)',
        content: `The security of ML-KEM and ML-DSA rests on the **Learning With Errors (LWE)** problem, introduced by Oded Regev in 2005:

**LWE Problem:** Given many samples (ai, bi) where bi = <ai, s> + ei mod q for a secret vector s and small noise ei, recover s.

Without the noise e, this is just linear algebra — solvable in polynomial time. With the noise, it becomes as hard as the worst-case **shortest vector problem** on lattices (proven by Regev, Peikert, and others).

**Module-LWE** is a structured variant that offers a good balance between security and key size. Kyber uses Module-LWE with dimension 256 and modulus q=3329.

**Why it resists quantum computers:** No known quantum algorithm solves LWE efficiently. Shor's algorithm exploits the **abelian group structure** of factoring/discrete-log; LWE has no such structure. This is why the entire PQC field coalesced around lattice-based cryptography.`,
      },
      {
        id: 'visualization',
        title: 'Migration Timeline',
        content: `Cryptographic migration is a multi-decade process:

| Year | Milestone |
|---|---|
| 2024 | NIST finalizes FIPS 203/204/205 |
| 2025 | Early adopters start PQC pilots (Chrome, OpenSSH, Cloudflare) |
| 2026-2027 | Wide deployment in TLS 1.3, SSH, code signing |
| 2028-2030 | Regulatory mandates likely (NIST, NSA CNSA 2.0) |
| ~2035 | Estimated "Q-Day" — cryptographically relevant quantum computers |
| 2035+ | Legacy RSA/ECC considered broken |

**Harvest-now-decrypt-later threat:** Data stolen today may be decrypted by future quantum computers. Any data with a sensitivity lifetime of 10+ years (medical records, state secrets, intellectual property) is already at risk.`,
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
  // LESSON 27 — SIDE-CHANNEL ATTACKS
  // ============================================================
  {
    id: 'side-channel-attacks',
    slug: 'side-channel-attacks',
    order: 27,
    title: 'Side-Channel Attacks',
    category: 'security',
    description:
      'When the implementation leaks the key: timing, power, cache, and electromagnetic side channels. Learn how a mathematically perfect cipher can still be broken by measuring microseconds, milliwatts, or cache-line hits — and how constant-time programming defends against this entire class of attacks.',
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

Side channels are often the easiest way to break real-world crypto — much easier than cryptanalysis of the algorithm itself. This is why **constant-time programming** is a mandatory discipline in any library that handles secrets.`,
        keyPoints: [
          'Exploits implementation, not algorithm design',
          'Common channels: timing, power, cache, EM, acoustic',
          'Countermeasure: constant-time code, blinding, masking',
          'Every cryptographic library must be side-channel resistant',
        ],
      },
      {
        id: 'concept',
        title: 'Timing Attacks',
        content: `Many naive implementations of crypto algorithms execute different amounts of work depending on the input — including the secret key. Consider a naive string comparison that exits early as soon as a byte mismatch is found. If the attacker knows the first i bytes are correct, the function runs slightly longer. By measuring millions of attempts, the attacker recovers byte-by-byte.

This is the mechanism behind the 2013 **Lucky Thirteen** attack on TLS (CVE-2013-0169).

**Constant-time defense:** always compare the full length without early exit. The loop runs the same number of iterations regardless of input — no timing signal. This is why every serious cryptographic library (OpenSSL, BoringSSL, libsodium) has a constant-time memory comparison function.

**Real-world incident:** In 2018, a researcher discovered a timing leak in Signal's message padding that could reveal message lengths. The fix required rebuilding the comparison function to be constant-time.`,
        codeSnippet: {
          language: 'plaintext',
          code: `VULNERABLE - Early Exit Leaks Timing:

  function insecureCompare(a, b):
      for i in range(len(a)):
          if a[i] != b[i]:
              return False     # early exit leaks how many bytes matched
      return True


SECURE - Constant-Time Comparison:

  function constantTimeCompare(a, b):
      if len(a) != len(b):
          return False
      result = 0
      for i in range(len(a)):
          result = result OR (a[i] XOR b[i])
      return result == 0        # always runs full length`,
          caption: 'Constant-time comparison eliminates the timing signal',
        },
      },
      {
        id: 'example',
        title: 'Cache-Timing Attacks',
        content: `Modern CPUs use multiple cache levels (L1/L2/L3) to speed up memory access. If AES lookups hit the cache for some key bytes but miss for others, the total execution time leaks information.

**AES S-box attack:** A naive AES implementation uses a 256-byte S-box table. Different key bytes lead to different cache line accesses. The attacker measures encryption time for thousands of chosen plaintexts, then uses statistical analysis to reveal which S-box entries were used. After enough measurements, key bytes can be recovered.

**Fix:** Implement AES with **bitslicing** (no table lookups) or use hardware AES-NI instructions. Modern CPUs also randomize cache behavior and use constant-time memory access primitives.

**Famous incident:** In 2016, a team broke a TLS server using cache-timing in the Cloudflare "Cloudbleed" family of vulnerabilities. The root cause: OpenSSL's AES implementation used S-box lookups that leaked through cache timing.`,
        keyPoints: [
          'Cache hits vs misses leak which memory addresses were accessed',
          'AES S-box lookups are a classic cache-timing vulnerability',
          'Defense: bitsliced implementations or hardware AES-NI',
        ],
      },
      {
        id: 'visualization',
        title: 'Side-Channel Attack Surface',
        content: `Every physical component of a cryptographic device can leak information:

| Channel | Signal Type | Typical Leak |
|---|---|---|
| Timing | Nanoseconds to milliseconds | Data-dependent execution time |
| Power | Milliwatts to watts | Data-dependent power consumption |
| Cache | L1/L2/L3 line hits | Data-dependent memory access |
| EM | Radio-frequency emissions | Data-dependent electromagnetic field |
| Acoustic | Sound from capacitors | Data-dependent vibration |
| Thermal | Chip temperature | Data-dependent power usage |

The defender's job is to ensure that **all** of these channels are uncorrelated with the secret. This is exponentially harder than just writing correct crypto code.`,
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
  // LESSON 28 — LENGTH EXTENSION ATTACKS
  // ============================================================
  {
    id: 'length-extension-attacks',
    slug: 'length-extension-attacks',
    order: 28,
    title: 'Length Extension Attacks',
    category: 'security',
    description:
      'Why SHA-256 and other Merkle-Damgard hashes are unsafe as MACs — and how HMAC fixes the problem. Learn how the internal state of a hash becomes the output, enabling an attacker to append data without knowing the secret.',
    difficulty: 'advanced',
    estimatedMinutes: 15,
    xpReward: 55,
    references: [
      {
        title:
          'Second Preimages on n-bit Hash Functions for Much Less than 2^n Work',
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
        title: 'The Merkle-Damgard Vulnerability',
        content: `Most cryptographic hash functions (MD5, SHA-1, SHA-256, SHA-512) use the **Merkle-Damgard** construction:

1. Pad the message to a multiple of the block size.
2. Split into blocks M1, M2, ..., Mn.
3. Process iteratively: Hi = f(Hi-1, Mi), starting from a fixed IV.
4. Output the final state Hn as the digest.

**The vulnerability:** the final hash IS the internal state after processing the last block. If an attacker knows H(M) and the length of M, they can compute H(M + padding + extra) — **without knowing M**.

This is a **length extension attack**, and it completely breaks the naive MAC construction MAC = H(key + message). The Kelsey-Schneier paper formalized this for the cryptographic community, showing that the Merkle-Damgard construction has a structural weakness that cannot be fixed by choosing a stronger hash function — only by changing the construction itself.`,
        keyPoints: [
          'Merkle-Damgard hashes expose their internal state as the output.',
          'Attack allows appending data to a hashed message without knowing it.',
          'Breaks naive MAC constructions like H(secret + message).',
          'HMAC is specifically designed to prevent this.',
        ],
      },
      {
        id: 'concept',
        title: 'The Attack in Detail',
        content: `Suppose a server authenticates messages as tag = SHA256(secret + message) and transmits (message, tag). An attacker who observes one valid pair can forge a new valid pair:

**Step 1:** The attacker guesses the length of secret (e.g., 8 bytes).

**Step 2:** Using the known tag as the starting state, they compute the SHA-256 padding that would have been appended to (secret + message). This padding is deterministic given the length.

**Step 3:** They append arbitrary attacker-controlled data: extra.

**Step 4:** They continue hashing from the known tag state through extra, producing a new digest tag'.

**Step 5:** They transmit (message + padding + extra, tag'). The server computes SHA256(secret + message + padding + extra) and gets tag' — a valid tag!

The attacker has forged a valid (message, tag) pair without ever knowing secret.

**Famous incident:** Flickr's API (2009) and several other web services were exploited via length extension because they used H(secret + message) as a MAC. The fix requires HMAC or secret-suffix hashing — not just a stronger hash function.`,
        codeSnippet: {
          language: 'plaintext',
          code: `VULNERABLE MAC CONSTRUCTION:

  tag = SHA256(secret + message)
  # Attacker can extend this without knowing secret!


SECURE MAC CONSTRUCTIONS:

  tag = HMAC-SHA256(secret, message)
  # Length extension does NOT apply to HMAC

  tag = SHA256(SHA256(secret + message))
  # Secret-suffix also prevents extension (defense in depth)`,
          caption: 'Use HMAC or secret-suffix hashing instead of secret-prefix',
        },
      },
      {
        id: 'example',
        title: 'HMAC — The Right Way',
        content: `HMAC (RFC 2104) constructs a MAC from any hash function H using two nested computations:

**HMAC(K, m) = H((K XOR opad) + H((K XOR ipad) + m))**

Where:
- ipad = 0x36 repeated to block size
- opad = 0x5C repeated to block size

**Why HMAC resists length extension:**
- The **inner hash** H((K XOR ipad) + m) produces a fixed-size intermediate value.
- The **outer hash** H((K XOR opad) + innerHash) processes this intermediate as the final block — no attacker-controlled continuation.
- Without knowing K, an attacker cannot compute the inner hash for a modified message.

HMAC is provably secure if the underlying hash is a **pseudorandom function** (PRF) — a weaker assumption than collision resistance. HMAC-SHA256 is the standard choice for API authentication, JWT signatures (HS256), AWS SigV4, and the TLS PRF.`,
      },
      {
        id: 'visualization',
        title: 'Length Extension Flow',
        content: `Attack progression from a single observed message-tag pair:

| Step | Attacker Action | Result |
|---|---|---|
| 1 | Observe (message, tag) and know length of secret | Baseline |
| 2 | Compute SHA-256 padding for (secret + message) | Padding determined |
| 3 | Initialize hash state with known tag | State resumed |
| 4 | Process extra data through SHA-256 compression | New hash computed |
| 5 | Send (message + padding + extra, tag') | Forgery complete |
| 6 | Server verifies SHA256(secret + message + padding + extra) | Match! |

The critical insight: SHA-256's internal state IS the output. There is no final transformation to prevent an attacker from continuing the computation.`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Length extension essentials:',
        keyPoints: [
          'Merkle-Damgard hashes (MD5, SHA-1, SHA-2) are vulnerable.',
          'Never use H(secret + message) as a MAC.',
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
        'SHA256(secret + message) — prefix MAC',
        'SHA256(message) — no secret involved',
        'SHA256(secret) + SHA256(message)',
      ],
      correctAnswer: 'HMAC-SHA256 (nested hashing with inner and outer keys)',
      hint: 'HMAC wraps the hash in two passes with derived keys ipad and opad.',
      explanation:
        'HMAC is specifically designed to resist length extension. The outer hash processes the intermediate inner-hash state as the final block, blocking any attacker-controlled continuation.',
    },
  },

  // ============================================================
  // LESSON 29 — PADDING ORACLE ATTACKS
  // ============================================================
  {
    id: 'padding-oracle-attacks',
    slug: 'padding-oracle-attacks',
    order: 29,
    title: 'Padding Oracle Attacks',
    category: 'security',
    description:
      'How a single error message can decrypt an entire CBC ciphertext byte-by-byte — and why AEAD ciphers matter. Learn the Vaudenay 2002 attack, the ASP.NET and POODLE breaches it caused, and the constant-error defense that eliminates the entire attack class.',
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
        title: 'Vaudenay 2002 Discovery',
        content: `In 2002, Serge Vaudenay discovered that block ciphers in **CBC mode** leak information through error messages. If a system distinguishes "invalid padding" from other errors, an attacker can use this **padding oracle** to decrypt arbitrary ciphertexts — without knowing the key.

**Famous real-world attacks:**
- **ASP.NET (2010):** Scott Guthrie disclosed a critical padding oracle in ASP.NET — thousands of sites compromised.
- **POODLE (2014):** Bodo Möller et al. broke SSL 3.0 via padding oracle in CBC mode.
- **Lucky Thirteen (2013):** Timing-based variant against TLS-CBC.
- **ROBOT (2017):** Reused padding oracle against many TLS stacks.

Padding oracles are one of the most practically devastating crypto vulnerabilities — because the fix requires **changing the error handling**, not just the cipher. This is why AEAD ciphers are now mandated for all new protocols.`,
        keyPoints: [
          'Requires CBC mode with PKCS#7-style padding',
          'Attacker needs only a binary "valid/invalid padding" signal',
          'Decrypts entire ciphertext byte-by-byte in ~128 x length queries',
          'Completely defeated by AEAD ciphers (AES-GCM, ChaCha20-Poly1305)',
        ],
      },
      {
        id: 'concept',
        title: 'CBC Padding and the Oracle',
        content: `**CBC mode recap:** Each plaintext block Pi is XORed with the previous ciphertext block Ci-1 before encryption:

**Ci = E_K(Pi XOR Ci-1)**

Decryption reverses this: **Pi = D_K(Ci) XOR Ci-1**

**PKCS#7 padding:** If the last plaintext block is L bytes short of the block size B, append (B - L) bytes each with value (B - L). For example, 5 bytes short of a 16-byte block means append 11 copies of 0x0B.

**The oracle:** When decrypting, the server checks if the padding is valid:
- Valid padding -> proceeds normally -> returns "OK" or generic error
- Invalid padding -> returns "Padding error"

This **tiny difference in error handling** is the entire oracle. The attacker submits crafted ciphertexts and observes which return "padding error" vs any other response.

**The attack:** For each target ciphertext block Ci, the attacker:
1. Crafts a modified previous block C'i-1 with guesses for the intermediate state.
2. Submits (C'i-1, Ci) to the oracle.
3. If padding validates, the intermediate state byte is recovered.
4. Iterates byte-by-byte — 256 attempts max per byte.

Total queries: ~128 x ciphertext length to recover the full plaintext.`,
        codeSnippet: {
          language: 'plaintext',
          code: `VULNERABLE - Different error messages leak padding validity:

  try:
      plaintext = decryptCBC(ciphertext, key, iv)
      return HTTP 200 with plaintext
  catch err:
      if err.message == "Invalid padding":
          return HTTP 400 "Padding error"     # ORACLE!
      else:
          return HTTP 500 "Internal error"


SECURE - Constant response, use AEAD:

  try:
      plaintext = aesGcmDecrypt(ciphertext, key)   # AEAD
      return HTTP 200 with plaintext
  catch err:
      return HTTP 400 "Decryption failed"          # same for all errors`,
          caption: 'Never reveal padding validity; prefer AEAD ciphers',
        },
      },
      {
        id: 'example',
        title: 'Byte-by-Byte Decryption (Conceptual)',
        content: `Suppose the target intermediate state is unknown: I = D_K(Ci).

For the **LAST byte** of the block (position 15, 0-indexed):

1. Attacker sets C'i-1[0..14] to random, C'i-1[15] = g (guess).
2. Submits (C'i-1, Ci).
3. Plaintext last byte = I[15] XOR g. If it equals 0x01 (valid PKCS#7 for 1 byte of padding), oracle returns "valid".
4. If oracle says valid, then I[15] = g XOR 0x01.
5. Attacker knows I[15]!

For the **SECOND-TO-LAST byte**:

1. Set C'i-1[15] = I[15] XOR 0x02 to force last byte to be 0x02.
2. Guess g for C'i-1[14].
3. When oracle validates (padding = 0x02 0x02), I[14] = g XOR 0x02.

Repeat for all 16 bytes. Then Pi = I XOR (original Ci-1).

**Amortized cost:** 256 x 16 = 4096 queries per block (worst case), or ~128 average if you stop at first valid guess. For a typical TLS record (16 KB), that's ~1 million requests — feasible in minutes over a fast connection.`,
      },
      {
        id: 'visualization',
        title: 'The Oracle Exploit',
        content: `Attack flow against CBC decryption:

| Step | Attacker | Server | Response |
|---|---|---|---|
| 1 | Sends (C'0, C1) with guessed byte | Decrypts P'1 = D_K(C1) XOR C'0 | "Pad OK" or "Pad Error" |
| 2 | Adjusts C'0[15] based on response | Repeats decryption | New response |
| 3 | After ~128 tries, learns I[15] | — | — |
| 4 | Sets C'0[15] = I[15] XOR 0x02 | — | Forces padding = 0x02 0x02 |
| 5 | Guesses C'0[14] | — | Learns I[14] |
| 6 | Repeats for all 16 bytes | — | Full intermediate state recovered |

After recovering I = D_K(C1), the attacker computes P1 = I XOR C0 (the original IV or previous ciphertext block). The entire plaintext block is now decrypted — without knowing the key.`,
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
  // LESSON 30 — QUANTUM CRYPTOGRAPHY (QKD)
  // ============================================================
  {
    id: 'quantum-cryptography',
    slug: 'quantum-cryptography',
    order: 30,
    title: 'Quantum Cryptography (QKD)',
    category: 'modern',
    description:
      "Not to be confused with post-quantum: quantum key distribution uses physics (not math) to detect eavesdroppers. Explore the BB84 protocol, the no-cloning theorem, and how China's Micius satellite distributed keys between Beijing and Vienna.",
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
      {
        title: 'Serious Cryptography: A Practical Introduction to Modern Encryption',
        author: 'J.-P. Aumasson',
        year: 2017,
        url: 'https://nostarch.com/seriouscrypto',
        type: 'book',
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

QKD does not replace encryption algorithms; it provides a **secure channel for distributing symmetric keys**. Once the key is distributed, classical encryption (e.g., AES) is used normally.

**The elegance of QKD:** security is guaranteed by the **no-cloning theorem** of quantum mechanics — an eavesdropper cannot copy an unknown quantum state without disturbing it. This is a physical guarantee, not a mathematical one.`,
        keyPoints: [
          'QKD relies on physical laws (no-cloning theorem, measurement disturbance).',
          'BB84 protocol (Bennett & Brassard, 1984) is the most famous QKD scheme.',
          'Detects eavesdropping — an attacker cannot listen silently.',
          'Practical range limited (~100-500 km via fiber, ~1000 km via satellite).',
        ],
      },
      {
        id: 'concept',
        title: 'The BB84 Protocol',
        content: `BB84 uses polarized photons in two non-orthogonal bases:

**Basis + (rectilinear):** vertical = 0, horizontal = 1
**Basis x (diagonal):** 45 degrees = 0, 135 degrees = 1

**Protocol:**
1. **Alice sends:** For each bit, Alice randomly chooses a bit (0/1) and a basis (+, x), then encodes the bit as a photon in that basis.
2. **Bob measures:** Bob randomly chooses a basis for each photon and measures.
3. **Sifting:** Alice and Bob publicly compare their basis choices (not the bit values). They keep only the bits where their bases matched — about 50% of transmitted photons.
4. **Error check:** They sacrifice a subset of the kept bits to estimate the error rate.
5. **Privacy amplification:** If error rate is below a threshold (~11%), they hash the remaining bits to eliminate any partial information leaked to an eavesdropper.
6. **Result:** Alice and Bob share a secret key with provable security.

**Why eavesdropping is detected:** The no-cloning theorem prevents Eve from copying photons. Any measurement she makes disturbs their quantum state, introducing detectable errors. If the error rate exceeds the threshold, Alice and Bob abort the protocol.`,
        codeSnippet: {
          language: 'plaintext',
          code: `BB84 Protocol - Quantum Transmission

  Step 1: Alice sends photons in random bases

    Bit:     0    1    0    0    1    1    0    1
    Basis:   +    x    +    x    x    +    +    x

  Step 2: Bob measures with random bases

    Basis:   +    x    x    +    x    +    x    x
    Match:   Y    Y    N    N    Y    Y    N    Y

  Step 3: Sifting - keep only matched bases

    Bit:     0    1    1    1    1   <- sifted key bits

  Step 4: Error check and privacy amplification

  Result:  shared secret key (e.g., 256 bits)`,
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

**Consensus:** QKD is valuable for specific high-value scenarios (government, banking backbone), but PQC is the more practical path for wide-scale deployment. The two approaches are complementary, not competing.`,
      },
      {
        id: 'visualization',
        title: 'QKD vs PQC',
        content: `Comparison of the two quantum-era approaches:

| Feature | Quantum Key Distribution | Post-Quantum Crypto |
|---|---|---|
| Runs on | Quantum hardware | Classical computers |
| Security from | Physics (no-cloning) | Math (LWE, lattices) |
| Eavesdrop detect? | YES (physical) | NO (mathematical only) |
| Distance | ~100-500 km fiber | Unlimited (network) |
| Cost | High (specialized HW) | Low (software only) |
| Standardization | Proprietary | NIST FIPS (2024) |
| Practical today | Niche (gov, banks) | Deploying widely |

Both approaches are being deployed in parallel — QKD for ultra-high-security point-to-point links, PQC for mass-market internet-scale cryptography.`,
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
        title: 'Checkpoint',
        content: 'Test your understanding of quantum cryptography.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content:
          'You understand quantum key distribution. Next: Zero-Knowledge Proofs — proving knowledge without revealing it.',
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

  // ============================================================
  // LESSON 31 — ZERO-KNOWLEDGE PROOFS
  // ============================================================
  {
    id: 'zero-knowledge-proofs',
    slug: 'zero-knowledge-proofs',
    order: 31,
    title: 'Zero-Knowledge Proofs',
    category: 'modern',
    description:
      'Prove you know a secret without revealing it. Explore the three properties of zero-knowledge proofs (completeness, soundness, zero-knowledge), the classic Ali Baba cave analogy, and how zk-SNARKs power privacy-preserving blockchains like Zcash.',
    difficulty: 'advanced',
    estimatedMinutes: 20,
    xpReward: 70,
    references: [
      {
        title:
          'The Knowledge Complexity of Interactive Proof Systems',
        author: 'S. Goldwasser, S. Micali, C. Rackoff',
        year: 1985,
        url: 'https://dl.acm.org/doi/10.1145/22145.22178',
        type: 'paper',
      },
      {
        title: 'A Graduate Course in Applied Cryptography',
        author: 'D. Boneh, V. Shoup',
        year: 2020,
        url: 'https://toc.cryptobook.us/',
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
    tags: ['zkp', 'zk-snark', 'zero-knowledge', 'interactive-proof', 'privacy'],
    sections: [
      {
        id: 'introduction',
        title: 'Proving Without Revealing',
        content: `A **Zero-Knowledge Proof (ZKP)** is a cryptographic protocol that allows a **prover** to convince a **verifier** that a statement is true, **without revealing why it is true** — and without revealing any information beyond the single bit "the statement is true."

The concept was introduced by **Goldwasser, Micali, and Rackoff in 1985** — a landmark paper that earned them the Turing Award. Before ZKPs, proofs were assumed to require revealing all underlying data. ZKPs shattered that assumption.

**Real-world applications:**
- **Zcash:** Shielded transactions that hide sender, receiver, and amount using zk-SNARKs.
- **Ethereum Layer 2 (zk-Rollups):** Bundle thousands of transactions into a single ZKP for scalability.
- **Privacy-preserving identity:** Prove you are over 18 without revealing your birthdate.
- **Authentication:** Prove you know a password without sending it (PAKE protocols).

**Why it matters:** ZKPs enable **privacy-preserving verification** — a fundamental building block for a digital society where you can prove facts about yourself without surrendering your data.`,
        keyPoints: [
          'Prove knowledge of a secret without revealing the secret itself',
          'Introduced by Goldwasser, Micali, Rackoff (1985) — Turing Award',
          'Enables privacy-preserving verification',
          'Powers Zcash, zk-Rollups, and modern privacy protocols',
        ],
      },
      {
        id: 'concept',
        title: 'The Three Properties of ZKPs',
        content: `A zero-knowledge proof must satisfy three properties:

**1. Completeness**
If the statement is true and both parties follow the protocol honestly, the verifier will be convinced. (The prover can always succeed when telling the truth.)

**2. Soundness**
If the statement is false, a cheating prover cannot convince the verifier (except with negligible probability). (A liar cannot succeed.)

**3. Zero-Knowledge**
If the statement is true, the verifier learns **nothing** beyond the fact that it is true. Formally: there exists a **simulator** that can produce a transcript indistinguishable from a real proof, without access to the prover's secret.

**Interactive vs Non-Interactive:**
- **Interactive ZKPs:** require back-and-forth between prover and verifier (e.g., the classic Ali Baba cave protocol).
- **Non-Interactive ZKPs (NIZKs):** the prover sends a single message; anyone can verify (e.g., zk-SNARKs). These use the **Fiat-Shamir heuristic** to convert interactive proofs into non-interactive ones.

**zk-SNARKs:** Zero-Knowledge Succinct Non-Interactive Argument of Knowledge. "Succinct" = proof size is tiny (a few hundred bytes) regardless of the statement's complexity.`,
        codeSnippet: {
          language: 'plaintext',
          code: `The Ali Baba Cave (Classic Interactive ZKP)

      A               B
      |               |
      |               |
      +------+--------+
             |
        [Entrance]
             |
      +------+--------+
      |               |
      |               |
    [Left]         [Right]
      |               |
      +-------+-------+
              |
        [Magic Door]   <- Only opens with secret word

  Protocol:
    1. Peggy (prover) enters the cave and randomly
       picks left or right path.
    2. Victor (verifier) waits outside, then shouts
       "Come out the LEFT" or "Come out the RIGHT"
       at random.
    3. Peggy must exit through the requested path.
       If she knows the secret word, she can always
       do this (she uses the magic door if needed).
       If she does NOT know the secret, she has a
       50% chance of being on the correct side.

  Repeat 20 times:
    * Honest Peggy: always succeeds (completeness)
    * Lying Peggy: success probability (1/2)^20 ~ 1e-6
      (soundness)
    * Victor learns NOTHING about the secret word
      (zero-knowledge)`,
          caption: 'Ali Baba cave: interactive ZKP with 50% soundness per round',
        },
      },
      {
        id: 'example',
        title: 'From Interactive to zk-SNARKs',
        content: `The Ali Baba cave protocol is **interactive** — Victor must challenge Peggy multiple times. This is impractical for blockchain use, where you want a single proof that anyone can verify offline.

**The Fiat-Shamir heuristic** converts interactive proofs into non-interactive ones by replacing the verifier's random challenges with the output of a hash function. The prover computes:

**challenge = H(commitment + statement)**

and uses that as the challenge. Because the hash is unpredictable, the prover cannot cheat — but no verifier needs to be online.

**zk-SNARKs** take this further:
- **Succinct:** proof size ~200 bytes regardless of computation size.
- **Non-interactive:** one proof, verifiable by anyone.
- **Argument of Knowledge:** the prover must actually know the witness (not just claim it).
- **Requires a trusted setup:** a one-time ceremony generates public parameters. If the setup is compromised, fake proofs can be created. (STARKs avoid this but have larger proofs.)

**Real-world scale:** A zk-SNARK can prove "this batch of 10,000 Ethereum transactions is valid" in a single ~200-byte proof. Verifying it takes milliseconds — enabling Ethereum Layer 2 scalability.`,
      },
      {
        id: 'visualization',
        title: 'ZKP Properties Comparison',
        content: `Comparison across proof systems:

| Property | Interactive ZKP | zk-SNARK | zk-STARK |
|---|---|---|---|
| Rounds | Many | 1 | 1 |
| Proof size | Large | ~200 bytes | ~50 KB |
| Verifier time | Linear | Constant | Logarithmic |
| Trusted setup? | No | Yes (usually) | No |
| Post-quantum? | Yes | No | Yes |
| Use case | Theory | Zcash, zk-Rollups | StarkNet |

Trade-offs: SNARKs are compact and fast but require trusted setup and rely on elliptic curves (broken by quantum computers). STARKs are quantum-resistant and setup-free but produce larger proofs.`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Zero-knowledge proof fundamentals:',
        keyPoints: [
          'ZKPs prove knowledge without revealing the secret.',
          'Three properties: completeness, soundness, zero-knowledge.',
          'Interactive ZKPs use challenges; non-interactive ones use Fiat-Shamir.',
          'zk-SNARKs enable blockchain privacy and scalability (Zcash, zk-Rollups).',
        ],
      },
      {
        id: 'exercise',
        title: 'Checkpoint',
        content: 'Test your understanding of zero-knowledge proofs.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content:
          'You understand zero-knowledge proofs and their role in modern privacy. Next: Secure Multi-Party Computation.',
      },
    ],
    interactiveExercise: {
      question:
        'Which property of a zero-knowledge proof ensures that a cheating prover cannot convince the verifier of a false statement?',
      instruction: 'Select the correct property.',
      inputType: 'choice',
      options: ['Soundness', 'Completeness', 'Zero-knowledge', 'Succinctness'],
      correctAnswer: 'Soundness',
      hint: 'Completeness = honest prover succeeds. Soundness = dishonest prover fails.',
      explanation:
        'Soundness guarantees that if the statement is false, no cheating prover can convince the verifier (except with negligible probability). Completeness is the opposite property: honest provers succeed. Zero-knowledge ensures no information leaks.',
    },
  },

  // ============================================================
  // LESSON 32 — SECURE MULTI-PARTY COMPUTATION
  // ============================================================
  {
    id: 'secure-mpc',
    slug: 'secure-multi-party-computation',
    order: 32,
    title: 'Secure Multi-Party Computation',
    category: 'modern',
    description:
      "Compute a joint function without revealing private inputs. Explore the Millionaires' Problem, garbled circuits, secret sharing, and how SMPC powers privacy-preserving auctions, medical research, and cryptographic voting.",
    difficulty: 'advanced',
    estimatedMinutes: 18,
    xpReward: 65,
    references: [
      {
        title: 'How to Play Any Mental Game (Goldreich-Micali-Wigderson)',
        author: 'O. Goldreich, S. Micali, A. Wigderson',
        year: 1987,
        url: 'https://dl.acm.org/doi/10.1145/28395.28420',
        type: 'paper',
      },
      {
        title: 'Protocols for Secure Computations (Yao, FOCS 1982)',
        author: 'A. C. Yao',
        year: 1982,
        url: 'https://ieeexplore.ieee.org/document/4568297',
        type: 'paper',
      },
      {
        title: 'A Graduate Course in Applied Cryptography',
        author: 'D. Boneh, V. Shoup',
        year: 2020,
        url: 'https://toc.cryptobook.us/',
        type: 'book',
      },
    ],
    tags: ['smpc', 'mpc', 'secret-sharing', 'garbled-circuits', 'privacy'],
    sections: [
      {
        id: 'introduction',
        title: 'The Millionaires Problem',
        content: `In 1982, Andrew Yao posed a famous thought experiment: **two millionaires want to know who is richer, but neither wants to reveal their actual wealth.** This is the **Millionaires' Problem** — the founding puzzle of Secure Multi-Party Computation (SMPC).

SMPC is a cryptographic protocol that allows multiple parties to **jointly compute a function** over their private inputs, revealing **only the output** — nothing else. Each party's input remains secret throughout.

**Real-world applications:**
- **Privacy-preserving auctions:** Bidders submit encrypted bids; only the winning bid is revealed.
- **Medical research:** Hospitals compute statistics across patient data without sharing records.
- **Cryptographic voting:** Voters submit encrypted ballots; only the tally is revealed.
- **Fraud detection:** Banks detect coordinated fraud across institutions without sharing customer lists.
- **Genomic privacy:** Individuals compare genetic markers without revealing their genomes.

**Why it matters:** SMPC is the cryptographic foundation for **privacy-preserving collaboration** — enabling useful computation without centralized data collection.`,
        keyPoints: [
          "Yao's Millionaires' Problem (1982) founded SMPC",
          'Multiple parties compute a function without revealing private inputs',
          'Only the output is revealed — nothing else leaks',
          'Enables privacy-preserving auctions, research, and voting',
        ],
      },
      {
        id: 'concept',
        title: 'Core Techniques: Secret Sharing and Garbled Circuits',
        content: `SMPC protocols use several core techniques:

**1. Secret Sharing (Shamir 1979)**
Split a secret into n shares such that any t shares can reconstruct it, but t-1 shares reveal nothing. This is **(t, n)-threshold secret sharing**.

For example, a (3, 5) scheme requires 3 of 5 shares to reconstruct. Each party holds one share; no single party (or two parties colluding) can learn the secret.

**2. Garbled Circuits (Yao 1986)**
For two-party computation: one party (the garbler) encrypts a boolean circuit, encrypting each wire with random keys. The other party (the evaluator) obliviously evaluates the circuit without learning intermediate values.

Garbled circuits can compute **any** function, but the circuit size grows with the function's complexity.

**3. Oblivious Transfer (OT)**
A fundamental primitive: the sender has multiple messages; the receiver chooses one to learn, but the sender doesn't learn which one. OT is used to feed private inputs into garbled circuits.

**4. Homomorphic Encryption**
Somewhat different: a single party computes on encrypted data without decrypting. Fully Homomorphic Encryption (FHE) allows arbitrary computations but is currently much slower than SMPC protocols.`,
        codeSnippet: {
          language: 'plaintext',
          code: `Shamir Secret Sharing (3, 5) - Example

  Secret S = 42
  Prime p = 97

  Step 1: Choose random polynomial of degree 2
          f(x) = 42 + 17x + 5x^2 mod 97

  Step 2: Generate 5 shares (one per party)
          Share 1: f(1) = 42 + 17 + 5    = 64
          Share 2: f(2) = 42 + 34 + 20   = 96
          Share 3: f(3) = 42 + 51 + 45   = 41
          Share 4: f(4) = 42 + 68 + 80   = 93
          Share 5: f(5) = 42 + 85 + 125  = 58

  Step 3: Any 3 shares can reconstruct via
          Lagrange interpolation. Any 2 reveal nothing.

  Security: With fewer than t shares, every possible
  secret is equally likely - perfect information-theoretic
  security.`,
          caption: 'Shamir Secret Sharing: any t shares reconstruct the secret',
        },
      },
      {
        id: 'example',
        title: 'SMPC in Practice: Privacy-Preserving Auction',
        content: `Consider a sealed-bid auction where bidders submit encrypted bids. The auctioneer should determine the winner without learning the losing bids.

**Protocol:**
1. Each bidder i encrypts their bid bi using a secret-sharing scheme.
2. Bidders jointly compute the maximum bid using SMPC — each comparison is a garbled circuit.
3. The protocol reveals:
   - The maximum bid value (or just the winner's identity).
   - Nothing about the losing bids.

**Real-world deployment (Danish Sugar Beet Auction, 2008):**
- 1,200 Danish sugar beet farmers participated.
- Each submitted encrypted bids for beet contracts.
- SMPC computed the market-clearing price.
- No farmer learned any other farmer's bid; even the auctioneer didn't.

**Modern platforms:**
- **Sharemind** (Estonia): Used by banks and governments.
- **MP-SPDZ** (open source): Research and prototyping.
- **Partisia Blockchain:** Integrates SMPC for private smart contracts.

**Performance:** Modern SMPC can compute millions of operations per second across 3-5 parties on a LAN. WAN performance depends heavily on network latency.`,
      },
      {
        id: 'visualization',
        title: 'SMPC vs Alternative Approaches',
        content: `How SMPC compares to related privacy techniques:

| Approach | Trust Model | Flexibility | Performance |
|---|---|---|---|
| SMPC | No trusted third party | Arbitrary functions | Moderate |
| Homomorphic Encryption | Single-party compute | Limited operations (FHE slow) | Slow |
| Trusted Execution Env (TEE) | Hardware trust (Intel SGX) | Full computation | Fast |
| Differential Privacy | Statistical noise | Aggregate queries | Very fast |
| Federated Learning | Model updates only | ML training | Moderate |

SMPC is the gold standard for **strong cryptographic privacy** — no trusted third party, no hardware assumptions, arbitrary functions. The trade-off is performance, which is improving rapidly with new protocols.`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'SMPC fundamentals:',
        keyPoints: [
          'SMPC lets multiple parties compute a function without revealing private inputs.',
          'Secret sharing and garbled circuits are foundational primitives.',
          'Real-world use cases: auctions, medical research, voting.',
          'SMPC is the gold standard for cryptographic privacy.',
        ],
      },
      {
        id: 'exercise',
        title: 'Checkpoint',
        content: 'Test your understanding of SMPC.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content:
          'You understand secure multi-party computation. Next: Blockchain Cryptography — the capstone lesson.',
      },
    ],
    interactiveExercise: {
      question:
        "What does Yao's Millionaires' Problem demonstrate in secure multi-party computation?",
      instruction: 'Select the correct answer.',
      inputType: 'choice',
      options: [
        'Two parties can jointly determine who is richer without revealing their actual wealth to each other',
        'Two parties can share their wealth to compute a total',
        'One party can prove their wealth using zero-knowledge proofs',
        'Two parties can encrypt their wealth with a shared key',
      ],
      correctAnswer:
        'Two parties can jointly determine who is richer without revealing their actual wealth to each other',
      hint: 'The problem asks: how to compare without revealing?',
      explanation:
        "Yao's Millionaires' Problem (1982) founded SMPC: two millionaires want to know who is richer without revealing their actual wealth. This is the canonical example of secure function evaluation over private inputs.",
    },
  },

  // ============================================================
  // LESSON 33 — BLOCKCHAIN CRYPTOGRAPHY
  // ============================================================
  {
    id: 'blockchain-cryptography',
    slug: 'blockchain-cryptography',
    order: 33,
    title: 'Blockchain Cryptography',
    category: 'modern',
    description:
      'The cryptographic backbone of Bitcoin and Ethereum: SHA-256 hash chains, ECDSA signatures on secp256k1, Merkle trees, and consensus. A capstone lesson integrating hashing, digital signatures, and public-key crypto into a decentralized trust system.',
    difficulty: 'advanced',
    estimatedMinutes: 22,
    xpReward: 80,
    references: [
      {
        title: 'Bitcoin: A Peer-to-Peer Electronic Cash System (Nakamoto, 2008)',
        author: 'S. Nakamoto',
        year: 2008,
        url: 'https://bitcoin.org/bitcoin.pdf',
        type: 'paper',
      },
      {
        title: 'A Certified Digital Signature (Merkle, CRYPTO 1989)',
        author: 'R. C. Merkle',
        year: 1989,
        url: 'https://link.springer.com/chapter/10.1007/0-387-34805-0_21',
        type: 'paper',
      },
      {
        title: 'NIST FIPS 180-4: Secure Hash Standard (SHS)',
        author: 'NIST',
        year: 2015,
        url: 'https://csrc.nist.gov/publications/detail/fips/180/4/final',
        type: 'standard',
      },
      {
        title:
          'NIST SP 800-186: Recommendations for Discrete Logarithm-based Cryptography: Elliptic Curve Domain Parameters',
        author: 'NIST',
        year: 2023,
        url: 'https://csrc.nist.gov/publications/detail/sp/800-186/final',
        type: 'standard',
      },
    ],
    tags: ['blockchain', 'bitcoin', 'merkle-tree', 'ecdsa', 'secp256k1', 'consensus'],
    sections: [
      {
        id: 'introduction',
        title: 'Decentralized Trust Through Cryptography',
        content: `A blockchain is a **cryptographically-linked append-only ledger** maintained by a decentralized network of nodes. It solves the **double-spending problem** without a central authority by combining several cryptographic primitives into a coherent trust system:

- **Cryptographic hashing (SHA-256):** Links blocks into an immutable chain.
- **Digital signatures (ECDSA):** Authorizes transactions.
- **Merkle trees:** Efficiently commits to thousands of transactions.
- **Proof-of-Work / Proof-of-Stake:** Sybil-resistant consensus mechanisms.
- **Public-key cryptography:** Enables pseudonymous identities (addresses).

**Bitcoin (2008)** was the first successful implementation, introduced in Satoshi Nakamoto's nine-page white paper. It launched an industry currently worth trillions and spawned an entire field of cryptographic research. This capstone lesson integrates everything you have learned — hashing, signatures, Merkle trees, and consensus.`,
        keyPoints: [
          'Blockchain = cryptographically-linked append-only ledger',
          'Solves double-spending without central authority',
          'Combines hashing, signatures, Merkle trees, consensus',
          'Bitcoin (2008) was the first successful implementation',
        ],
      },
      {
        id: 'concept',
        title: 'The Four Cryptographic Pillars',
        content: `A blockchain rests on four cryptographic pillars:

**1. Hash Chains**
Each block contains the SHA-256 hash of the previous block. Modifying any historical block invalidates all subsequent blocks — requiring an attacker to redo all the proof-of-work from that point forward.

**2. Merkle Trees**
A binary tree of hashes where each leaf is a transaction hash, and each internal node is H(left + right). The root hash commits to **all** transactions in a block. To prove a transaction is included, you only need O(log n) sibling hashes — called a **Merkle proof**.

**3. Digital Signatures (ECDSA on secp256k1)**
Each transaction is signed by the sender's private key. Anyone can verify with the sender's public key (= address). This proves **authorization** without revealing the private key.

**4. Proof-of-Work (or Proof-of-Stake)**
Miners (or validators) must expend resources (hashpower or stake) to append blocks. This makes attacking the network economically infeasible — an attacker would need >50% of the total resources.

**Key insight:** Blockchain is not a single cryptographic breakthrough — it is a **system integration** of pre-existing primitives (all from the 1970s-1990s) into a novel economic-consensus protocol.`,
        codeSnippet: {
          language: 'plaintext',
          code: `Blockchain Structure - Hash Chain

  Block N-1              Block N                Block N+1
  +----------------+     +----------------+     +----------------+
  | Prev Hash: 0x0 |     | Prev Hash: A7F |     | Prev Hash: B3C |
  | Merkle Root:.. |     | Merkle Root:.. |     | Merkle Root:.. |
  | Timestamp: ... |     | Timestamp: ... |     | Timestamp: ... |
  | Nonce:     ... |     | Nonce:     ... |     | Nonce:     ... |
  | Txns: [...]    |     | Txns: [...]    |     | Txns: [...]    |
  +----------------+     +----------------+     +----------------+
          |                      |                      |
          v                      v                      v
        Hash A7F              Hash B3C              Hash D1E
     (SHA-256)             (SHA-256)             (SHA-256)

  Modifying Block N-1 changes Hash A7F,
  invalidating Block N's Prev Hash,
  which invalidates Block N+1, ...

  To rewrite history, an attacker must redo ALL
  proof-of-work from Block N-1 to the present -
  economically infeasible on a large network.`,
          caption: 'Hash chain: each block commits to the previous block via SHA-256',
        },
      },
      {
        id: 'example',
        title: 'Merkle Trees and SPV',
        content: `A **Merkle tree** is a binary hash tree that allows efficient proof of transaction inclusion.

**Construction:**
1. Each transaction is hashed: h1 = SHA256(tx1), h2 = SHA256(tx2), ...
2. Adjacent hashes are combined: h12 = SHA256(h1 + h2), h34 = SHA256(h3 + h4), ...
3. This continues until a single **Merkle root** remains.

**Merkle Proof (SPV — Simplified Payment Verification):**
To prove that tx3 is included in a block with Merkle root R, you need only the **sibling hashes along the path** from tx3 to R. For a block with 4,000 transactions, that's just ~12 hashes (log2(4000) ~ 12) — a few hundred bytes.

**Why it matters:**
- **Light clients** (mobile wallets) can verify transactions without downloading the entire blockchain (which is now >500 GB for Bitcoin).
- **Fraud proofs** in Layer 2 rollups use Merkle proofs to challenge invalid state transitions.
- **Git** uses the same structure for commit history — every commit's hash commits to the entire tree.

**Merkle's 1989 paper** on certified digital signatures first formalized this tree structure, decades before blockchain existed. This is a beautiful example of how **foundational cryptographic research** enables future applications.`,
        keyPoints: [
          'Merkle tree = binary hash tree committing to all transactions',
          'Merkle proof requires only O(log n) hashes',
          'Enables SPV: mobile wallets verify without full blockchain',
          'Merkle (1989) predates blockchain by 19 years',
        ],
      },
      {
        id: 'visualization',
        title: 'Blockchain Cryptographic Stack',
        content: `The full cryptographic stack of a blockchain:

| Layer | Primitive | Purpose |
|---|---|---|
| Address generation | ECDSA (secp256k1) + SHA-256 + RIPEMD-160 | Public key -> address |
| Transaction signing | ECDSA with ephemeral k | Authorize transfers |
| Block linking | SHA-256 hash chain | Immutability |
| Transaction inclusion | Merkle tree | Efficient proof of membership |
| Consensus | Proof-of-Work (SHA-256) or Proof-of-Stake | Sybil resistance |
| Wallet security | BIP-39 seed phrases, HD wallets (BIP-32) | Key management |

Every layer is a cryptographic primitive you have studied in earlier lessons. Blockchain is not magic — it is cryptography, carefully composed.`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Blockchain cryptography — the capstone:',
        keyPoints: [
          'Blockchain integrates hashing, signatures, Merkle trees, and consensus.',
          'Hash chains make history tamper-evident; modifying a block invalidates all later blocks.',
          'ECDSA on secp256k1 authorizes transactions without revealing private keys.',
          'Merkle trees enable efficient proof of inclusion (SPV).',
          'No single cryptographic breakthrough — a novel composition of existing primitives.',
        ],
      },
      {
        id: 'exercise',
        title: 'Final Checkpoint',
        content: 'Answer the capstone question to complete the entire ChiperLab curriculum!',
      },
      {
        id: 'summary',
        title: 'Congratulations — You Completed ChiperLab!',
        content: `You have completed all **30 advanced lessons** and the entire ChiperLab curriculum:

**Beginner (1-8):** Foundations — what crypto is, history, daily life, plaintext/ciphertext, encryption, encoding vs encryption, threat models, CIA triad.

**Intermediate (9-18):** Mechanisms — symmetric/asymmetric, hashing, signatures, keys, IVs, HMAC, key exchange, PKI, password storage.

**Advanced (16-30):** Deep dives — classical cipher analysis, XOR, AES-GCM internals, RSA-OAEP, ECC, PQC, side channels, length extension, padding oracles, QKD, ZKPs, SMPC, and blockchain.

You now understand cryptography as a **layered discipline** — from mathematical primitives to system-level protocols, from ancient ciphers to post-quantum algorithms. The field continues to evolve, and you are now equipped to follow its frontier.

**Keep learning. Keep questioning. Keep breaking things (ethically).**`,
      },
    ],
    interactiveExercise: {
      question:
        'Which cryptographic structure allows a mobile wallet to verify a transaction without downloading the entire blockchain?',
      instruction: 'Select the correct structure.',
      inputType: 'choice',
      options: [
        'Merkle tree (via Merkle proofs / SPV)',
        'RSA-OAEP',
        'AES-GCM',
        'Diffie-Hellman key exchange',
      ],
      correctAnswer: 'Merkle tree (via Merkle proofs / SPV)',
      hint: 'It requires only O(log n) hashes to prove inclusion.',
      explanation:
        'Merkle trees allow Simplified Payment Verification (SPV): a light client downloads only block headers and uses Merkle proofs to verify that a specific transaction is included in a block — without downloading the full blockchain.',
    },
  },
];