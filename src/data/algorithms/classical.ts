import { AlgorithmDetail } from './_types';

/**
 * Classical Algorithms — Order 1-4
 *
 * Historical ciphers spanning 2,500 years of cryptographic
 * evolution — from Roman military dispatches to the bitwise
 * XOR primitive that powers every modern cipher.
 *
 * Order:
 *   1. Caesar Cipher
 *   2. Atbash Cipher
 *   3. Vigenère Cipher
 *   4. XOR Cipher
 *
 * Sources:
 *   - Suetonius, "The Twelve Caesars" (121 AD)
 *   - S. Singh, "The Code Book" (1999)
 *   - C. E. Shannon, "Communication Theory of Secrecy Systems" (1949)
 *   - J. Katz & Y. Lindell, "Introduction to Modern Cryptography" (3rd ed.)
 *   - J.-P. Aumasson, "Serious Cryptography" (2017)
 *   - RFC 8439: ChaCha20 and Poly1305 for IETF Protocols
 */
export const CLASSICAL_ALGORITHMS: AlgorithmDetail[] = [
  // ============================================================
  // 1 — CAESAR CIPHER
  // ============================================================
  {
    id: 'caesar',
    name: 'Caesar Cipher',
    category: 'classical',
    difficulty: 'beginner',
    tagline: 'The ancient monoalphabetic shift cipher used by Julius Caesar',
    description:
      'A substitution cipher where each letter in the plaintext is shifted by a fixed number of positions down the alphabet. The oldest documented cipher with a formal key, and the foundation of all modular arithmetic in cryptography.',
    estimatedMinutes: 8,
    references: [
      {
        title: 'The Twelve Caesars (Divus Iulius, Chapter 56)',
        author: 'Suetonius',
        year: 121,
        url: 'http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.02.0132',
        type: 'article',
      },
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
    keyTakeaways: [
      'The Caesar cipher introduces **modular arithmetic** (mod 26) — the mathematical backbone of all modern cryptography.',
      'Its keyspace has only **25 meaningful shifts**, making it trivially brute-forceable in milliseconds.',
      'It is **monoalphabetic**: identical plaintext letters always map to identical ciphertext letters, preserving frequency patterns.',
      'Named after Julius Caesar (100–44 BC), who reportedly used a shift of 3 during the Gallic Wars.',
    ],
    sections: [
      {
        id: 'introduction',
        title: 'What is the Caesar Cipher?',
        content: `The Caesar cipher is one of the **oldest and simplest** documented encryption techniques in human history. It is a **monoalphabetic substitution cipher** — meaning each letter of the plaintext is replaced by another letter at a fixed offset, and the same substitution rule applies to every occurrence of that letter.

For example, with shift **k = 3**:
- **A** becomes **D**
- **B** becomes **E**
- **C** becomes **F**
- ...and so on, wrapping **Z** back to **A**.

The cipher is *not* about secrecy through complex mathematics. Its historical role was **convenience** — allowing Caesar to write dispatches that a casual reader could not immediately understand, without requiring any tools beyond a shifted alphabet.

**Why study it?** Because every cryptographic concept you will meet later — keys, keyspace, brute-force resistance, frequency analysis, modular arithmetic — appears in the Caesar cipher in its **simplest form**. Mastering these concepts here gives you the vocabulary to understand AES, RSA, and even post-quantum cryptography.`,
        keyPoints: [
          'Monoalphabetic substitution — one fixed substitution rule for all letters',
          'Shift key k ∈ [1, 25] — total keyspace of only 25 meaningful shifts',
          'Encryption is a **bijective function** — decryption always recovers the plaintext',
          'Named after Julius Caesar (100–44 BC) — reportedly used with shift 3',
        ],
        callout: {
          type: 'info',
          title: 'Historical Note',
          content: `Suetonius records in **The Twelve Caesars** that Caesar used shift 3 to protect his military dispatches. But the cipher was likely **never intended as a strong defense** — the real protection came from the secrecy of the shift value, not the algorithm. This foreshadows **Kerckhoffs's Principle** (1883), which states that a cipher should be secure even if everything except the key is public.`,
        },
      },
      {
        id: 'history',
        title: 'Historical Origin',
        content: `The Caesar cipher is named after **Gaius Julius Caesar** (100–44 BC), the Roman general and statesman who reportedly used it during the **Gallic Wars** (58–50 BC) to communicate confidentially with his generals.

According to **Suetonius** (*The Twelve Caesars*, Divus Iulius §56), Caesar used a **shift of 3** — "D" for "A", "E" for "B", and so on. This is one of the earliest documented instances of **systematic substitution** in Western history.

**Why the shift of 3?** Historians speculate:
1. It was easy to remember under battlefield conditions.
2. It provided *enough* obfuscation to defeat a quickly-scanning enemy.
3. It did **not** need a written key — Caesar and his generals memorized it.

**What Caesar likely did not know**: even in 50 BC, the cipher was already weak against anyone who understood **letter frequency**. A literate enemy could easily notice that "E" — the most common Latin letter — always appeared as "H" in the ciphertext.

Later variants — the **Augustus cipher** (shift 1) — were used by Caesar's successor. The cipher remained in scattered use through the Middle Ages and Renaissance, though it was largely replaced by polyalphabetic ciphers like Vigenère from the 16th century onwards.`,
        keyPoints: [
          'Used by Julius Caesar during the Gallic Wars (58–50 BC)',
          'Shift of 3 was memorized, not written — no key material needed',
          'Documented by Suetonius in **The Twelve Caesars**',
          'Later Roman emperors used similar shift variants',
        ],
      },
      {
        id: 'how-it-works',
        title: 'How It Works',
        content: `The Caesar cipher operates in three simple steps:

**Step 1 — Assign numeric positions**
Each letter of the alphabet is assigned an integer from 0 to 25:

| Letter | A | B | C | D | E | F | ... | Z |
|---|---|---|---|---|---|---|---|---|
| Value | 0 | 1 | 2 | 3 | 4 | 5 | ... | 25 |

**Step 2 — Apply the shift**
For each plaintext letter with position P and shift key k, the ciphertext position is:

**C = (P + k) mod 26**

The **mod 26** operation ensures we wrap around — after Z (25), the next value comes back to A (0).

**Step 3 — Convert back to letters**
The resulting numeric value is mapped back to its corresponding letter.

**Decryption** is identical but subtracts the key:

**P = (C − k + 26) mod 26**

We add 26 before applying mod to handle negative results gracefully — the mathematics works the same either way, but adding 26 keeps everything in the non-negative range.

**Non-alphabetic characters** (spaces, punctuation, digits) are typically **preserved unchanged** — they are not part of the alphabet and thus not part of the transformation.`,
        keyPoints: [
          'Modular arithmetic **mod 26** wraps Z back to A',
          'Encryption and decryption use the same formula with opposite sign',
          'Only alphabetic characters are transformed; punctuation is preserved',
          'Case is typically preserved: uppercase stays uppercase, lowercase stays lowercase',
        ],
        codeSnippet: {
          language: 'typescript',
          code: `// Caesar cipher implementation (TypeScript)
function caesarCipher(
  text: string,
  shift: number,
  mode: 'encrypt' | 'decrypt' = 'encrypt'
): string {
  // Normalize shift into [0, 25]
  const k = ((shift % 26) + 26) % 26;
  const effectiveShift = mode === 'encrypt' ? k : (26 - k) % 26;

  return text
    .split('')
    .map(ch => {
      const code = ch.charCodeAt(0);
      // Uppercase A-Z
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + effectiveShift) % 26) + 65);
      }
      // Lowercase a-z
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + effectiveShift) % 26) + 97);
      }
      // Preserve other characters
      return ch;
    })
    .join('');
}

// Example usage:
caesarCipher("HELLO WORLD", 3);           // "KHOOR ZRUOG"
caesarCipher("KHOOR ZRUOG", 3, 'decrypt'); // "HELLO WORLD"`,
          caption: 'TypeScript implementation with case preservation',
        },
      },
      {
        id: 'formula',
        title: 'Mathematical Formulation',
        content: `The Caesar cipher is a member of the **general affine cipher family**, which has the form **E(x) = (a·x + b) mod 26**. The Caesar cipher is the special case where **a = 1** and **b = k**.

**Encryption formula:**
**E(x) = (x + k) mod 26**

**Decryption formula:**
**D(x) = (x − k + 26) mod 26**

Where:
- **x** = numeric position of the plaintext character (0–25)
- **k** = shift key (1–25)
- **mod 26** = ensures wrapping within the 26-letter alphabet

**Why "mod 26"?**
Modular arithmetic maps every integer to a value in the range [0, 25]. For example:
- 27 mod 26 = 1 (wraps from beyond Z back to B)
- 30 mod 26 = 4 (wraps back to E)
- −3 mod 26 = 23 (wraps negative values into range)

**Generalization — Affine Cipher:**
If we allow **a ≠ 1**, we get the affine cipher: **E(x) = (a·x + b) mod 26**, where **a** must be **coprime to 26** (i.e., gcd(a, 26) = 1) for the cipher to be invertible. The valid values for **a** are: 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25. This expands the keyspace to 12 × 26 = **312 possible keys** — still trivially brute-forced, but a step forward.`,
        keyPoints: [
          'Caesar is a special case of affine cipher with a = 1',
          'Affine cipher needs **a** to be coprime with 26 for invertibility',
          'Modular arithmetic prevents overflow and wraps the alphabet cyclically',
          'The complete keyspace is only **25** — instant brute-force',
        ],
      },
      {
        id: 'example',
        title: 'Worked Example',
        content: `Let us encrypt the message **"HELLO WORLD"** with shift **k = 3**.

**Step 1 — Assign positions:**

| Plain | H | E | L | L | O | ␣ | W | O | R | L | D |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Index | 7 | 4 | 11 | 11 | 14 | — | 22 | 14 | 17 | 11 | 3 |

**Step 2 — Apply (index + 3) mod 26:**

| Plain | Index | +3 | Mod 26 | Cipher |
|---|---|---|---|---|
| H | 7 | 10 | 10 | K |
| E | 4 | 7 | 7 | H |
| L | 11 | 14 | 14 | O |
| L | 11 | 14 | 14 | O |
| O | 14 | 17 | 17 | R |
| ␣ | — | — | — | ␣ |
| W | 22 | 25 | 25 | Z |
| O | 14 | 17 | 17 | R |
| R | 17 | 20 | 20 | U |
| L | 11 | 14 | 14 | O |
| D | 3 | 6 | 6 | G |

**Ciphertext:** **"KHOOR ZRUOG"**

**Decryption** applies the inverse: **C − 3 mod 26**. For example, **K** (10) − 3 = **H** (7), and **O** (14) − 3 = **L** (11). The full message is recovered perfectly.`,
        example: `Walkthrough (character by character):

'H' (7)  + 3 = 10  → 'K'
'E' (4)  + 3 = 7   → 'H'
'L' (11) + 3 = 14  → 'O'
'L' (11) + 3 = 14  → 'O'
'O' (14) + 3 = 17  → 'R'
' ' (—)  preserved → ' '
'W' (22) + 3 = 25  → 'Z'
'O' (14) + 3 = 17  → 'R'
'R' (17) + 3 = 20  → 'U'
'L' (11) + 3 = 14  → 'O'
'D' (3)  + 3 = 6   → 'G'

Result: "KHOOR ZRUOG"`,
      },
      {
        id: 'security',
        title: 'Security Analysis',
        content: `The Caesar cipher provides **zero practical security** in any modern context. It is broken by every standard cryptanalytic technique:

**1. Brute-force attack**
With only **25 meaningful keys** (shift 0 leaves the text unchanged), an attacker can try every possibility in less than a millisecond. Even a human can scan all 25 outputs manually in a few minutes and spot the one that reads as English.

**2. Frequency analysis**
The cipher is **monoalphabetic** — every occurrence of "E" in the plaintext maps to the same ciphertext letter (say, "H"). In a sufficiently long message, the frequency distribution of letters is **exactly preserved**, just shifted. Since **"E" accounts for ~12.7% of English letters**, the most common ciphertext letter is almost certainly the shifted version of "E".

| Letter | English Frequency |
|---|---|
| E | 12.70% |
| T | 9.06% |
| A | 8.17% |
| O | 7.51% |
| I | 6.97% |
| N | 6.75% |

**3. Known-plaintext attack**
If an attacker knows even a single plaintext–ciphertext pair (e.g., a common greeting), the shift is immediately revealed: **k = (C − P) mod 26**.

**4. Chosen-plaintext attack**
The attacker encrypts "A" and observes the output — the shift is revealed instantly.`,
        keyPoints: [
          '**Brute-force**: 25 keys, trivially exhaustible',
          '**Frequency analysis**: preserves letter distribution exactly',
          '**Known-plaintext**: a single pair reveals the shift',
          '**Chosen-plaintext**: encrypt "A" to learn the shift directly',
        ],
        callout: {
          type: 'warning',
          title: 'Never Use for Security',
          content: `The Caesar cipher is **strictly educational**. It provides no confidentiality in any realistic threat model. Even in Caesar's time, it was likely a convenience mechanism rather than a real defense. Use it to **understand cryptographic principles**, never to protect real data.`,
        },
      },
      {
        id: 'comparison',
        title: 'Comparison with Modern Ciphers',
        content: `How does the Caesar cipher compare to modern encryption?

| Property | Caesar Cipher | AES-256-GCM |
|---|---|---|
| Keyspace | 25 | 2²⁵⁶ (astronomically large) |
| Alphabet | 26 letters | 256 byte values |
| Block size | 1 letter | 128 bits (16 bytes) |
| Rounds | 1 | 14 |
| Security basis | Obscurity | Mathematical hardness |
| Attack resistance | None | Indistinguishable under chosen-ciphertext |
| Status | Historical | Industry standard |

**Key insight:** The Caesar cipher is broken by **every** modern attack model — brute-force, frequency, known-plaintext, chosen-plaintext. Modern ciphers are designed to resist **all** of these, plus advanced attacks (chosen-ciphertext, side-channel, algebraic).

This gap is exactly why cryptography evolved: from simple substitutions to **round-based confusion and diffusion** (Shannon's principles), where a single bit flip in the key changes half of the output.`,
      },
      {
        id: 'lab',
        title: 'Try It Yourself',
        content: `Use the mini-lab below to encrypt and decrypt with the Caesar cipher. Try different shift values (1–25) and watch how the transformation changes. Notice how — with shift 13 — the encryption and decryption become the same operation (that is **ROT13**, a special case).`,
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You have mastered the Caesar cipher — the oldest formal cipher with a key.

**Core concepts learned:**
- **Modular arithmetic** (mod 26) — the mathematical backbone of all ciphers
- **Monoalphabetic substitution** — same letter always maps to same letter
- **Keyspace** — only 25 possibilities, trivially broken
- **Frequency analysis** — the first cryptanalytic technique in history
- **Affine cipher family** — Caesar is the special case a = 1

**Next algorithm:** the Atbash cipher — an even older Hebrew substitution with no key at all.`,
      },
    ],
    playgroundRoute: '/playground/encrypt?algo=caesar',
    defaultDemoKey: '3',
    defaultDemoInput: 'DEFEND THE EAST WALL',
    labEnabled: true,
  },

  // ============================================================
  // 2 — ATBASH CIPHER
  // ============================================================
  {
    id: 'atbash',
    name: 'Atbash Cipher',
    category: 'classical',
    difficulty: 'beginner',
    tagline: 'Ancient Hebrew monoalphabetic mirror substitution',
    description:
      'An involution cipher that maps each letter to its mirror counterpart in the alphabet (A becomes Z, B becomes Y). No key is required — the transformation is its own inverse, making encryption and decryption identical operations.',
    estimatedMinutes: 7,
    references: [
      {
        title: 'Jewish Encyclopedia — Atbash',
        author: 'Jewish Encyclopedia Contributors',
        year: 1906,
        url: 'https://www.jewishencyclopedia.com/articles/2060-atbash',
        type: 'article',
      },
      {
        title: 'The Code Book: The Science of Secrecy from Ancient Egypt to Quantum Cryptography',
        author: 'S. Singh',
        year: 1999,
        url: 'https://simonsingh.net/books/the-code-book/',
        type: 'book',
      },
    ],
    keyTakeaways: [
      'Atbash is an **involution** — its own inverse: f(f(x)) = x.',
      'No key is required: the mapping is completely fixed by the alphabet.',
      'It preserves **letter frequency** perfectly, making it trivially breakable.',
      'The concept of involution appears in XOR, Feistel networks, and ROT13.',
    ],
    sections: [
      {
        id: 'introduction',
        title: 'What is the Atbash Cipher?',
        content: `The Atbash cipher is a **monoalphabetic substitution** that maps each letter to its **mirror counterpart** in the alphabet. The first letter maps to the last, the second to the second-to-last, and so on:

| Plain  | A | B | C | ... | M | N | ... | X | Y | Z |
|--------|---|---|---|-----|---|---|-----|---|---|---|
| Cipher | Z | Y | X | ... | N | M | ... | C | B | A |

**The name** comes from the Hebrew alphabet: **Aleph** (א) → **Tav** (ת), **Bet** (ב) → **Shin** (ש). The first letter maps to the last, the second to the second-to-last — the same principle applied to the 22-letter Hebrew alphabet.

**Two remarkable properties:**
1. **No key** — the transformation is completely fixed.
2. **Self-inverse (involution)** — applying Atbash twice returns the original text. Encryption and decryption are literally the **same operation**.

**Why it matters today:** Atbash introduces the concept of an **involution** — a function that is its own inverse. This elegant mathematical structure recurs throughout modern cryptography:
- **XOR** operation: A ⊕ B ⊕ B = A
- **ROT13**: shift of 13 is self-inverse on a 26-letter alphabet
- **Feistel networks** (used in DES, Blowfish): each round is its own inverse

Understanding involution in Atbash prepares you for these advanced constructions.`,
        keyPoints: [
          'Mirror substitution — first ↔ last, second ↔ second-to-last',
          'No key required — the mapping is entirely determined by the alphabet',
          'Involution — applying twice returns the original: f(f(x)) = x',
          'Encryption and decryption use the **same function**',
        ],
      },
      {
        id: 'history',
        title: 'Historical Origin',
        content: `Atbash is one of the **oldest recorded ciphers in history**, dating back to at least the **6th century BC**. It was used by Hebrew scribes to encode sacred texts — but not for military secrecy.

**Biblical usage:**
The most famous biblical example is in the **Book of Jeremiah** (25:26 and 51:41), where the name **"Babel"** (Babylon) is written as **"Sheshach"** using Atbash. Similarly, in Jeremiah 51:1, "the Chaldeans" appears encoded as **"Lev Kamai"** ("heart of my adversaries").

**Purpose — not secrecy but:**
1. **Literary style** — a cryptic flavor for prophetic texts
2. **Esoteric encoding** — hiding meaning from the uninitiated
3. **Mnemonic device** — memorizing sacred names in a different form

**Why study it?**
Atbash is the classic example of an **involution cipher**. The mathematical beauty of a self-inverse transformation — one function serves both encryption and decryption — is elegant and recurs throughout modern cryptography. It is not a "step backward" from Caesar, but a **parallel development**: Caesar introduces the key, Atbash introduces the involution.`,
        keyPoints: [
          'Pre-Common Era origin — used by Hebrew scribes',
          'Found in **Jeremiah 25:26** and **51:41** (Babylon → Sheshach)',
          'Purpose was literary/esoteric, not military secrecy',
          'Introduces the **involution** concept to cryptographic history',
        ],
      },
      {
        id: 'how-it-works',
        title: 'How It Works',
        content: `Atbash uses a single, fixed transformation — no key, no parameters:

**For each letter with index x (A=0, B=1, ..., Z=25):**

**C = 25 − x**

Applying the same formula twice returns the original:

**Atbash(Atbash(x)) = 25 − (25 − x) = x**

**Example:**
- A (0) → 25 → Z
- B (1) → 24 → Y
- C (2) → 23 → X
- M (12) → 13 → N
- N (13) → 12 → M
- Z (25) → 0 → A

**Handling non-alphabetic characters:**
Digits, spaces, punctuation, and non-Latin scripts are typically **preserved unchanged** — they are not part of the substitution.

**Case handling:**
Uppercase letters stay uppercase (using the range 65–90), lowercase letters stay lowercase (using 97–122). The transformation is applied symmetrically within each range.`,
        keyPoints: [
          'Single formula: **C = 25 − x**',
          'Self-inverse — no separate decryption algorithm needed',
          'Non-alphabetic characters preserved unchanged',
          'Case-preserving: uppercase stays uppercase, lowercase stays lowercase',
        ],
        codeSnippet: {
          language: 'typescript',
          code: `// Atbash cipher — the same function encrypts and decrypts
function atbash(text: string): string {
  return text
    .split('')
    .map(ch => {
      const code = ch.charCodeAt(0);
      // Uppercase A-Z
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(90 - (code - 65));
      }
      // Lowercase a-z
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(122 - (code - 97));
      }
      return ch;
    })
    .join('');
}

atbash("HELLO");       // → "SVOOL"
atbash("SVOOL");       // → "HELLO" (same function!)
atbash("SECURITY");    // → "HVXFIRGB"`,
          caption: 'TypeScript: one function handles both directions',
        },
      },
      {
        id: 'formula',
        title: 'Mathematical Formulation',
        content: `For the English 26-letter alphabet with index x ∈ [0, 25]:

**Encryption:** E(x) = 25 − x
**Decryption:** D(x) = 25 − x

Note that **E = D** — this is the defining property of an **involution**.

**Generalized involutions in modern cryptography:**

| Construction | Formula | Use Case |
|---|---|---|
| **Atbash** | E(x) = 25 − x | Classical cipher |
| **ROT13** | E(x) = (x + 13) mod 26 | Forum spoiler obfuscation |
| **XOR** | E(x) = x ⊕ k | Bitwise primitive in all modern ciphers |
| **Feistel round** | (L, R) → (R, L ⊕ f(R)) | Block cipher construction (DES, Blowfish) |

**Why involutions matter:**
- **Single implementation**: only one function needed — simpler code, fewer bugs
- **Symmetric protocols**: both sides of a communication use identical logic
- **Elegant security proofs**: hard to prove something about both E and D — trivial if they are the same

The Feistel network, in particular, relies on this: each round function is designed to be its own inverse, which allows the same hardware circuit to perform both encryption and decryption. This is why **DES** — a cipher from 1977 — is still studied today.`,
        keyPoints: [
          'E(x) = D(x) = 25 − x — self-inverse by definition',
          'The **involution** concept appears in ROT13, XOR, and Feistel networks',
          'Feistel networks use involutions to enable single-circuit encryption/decryption',
          'Elegant mathematics yields elegant engineering',
        ],
      },
      {
        id: 'example',
        title: 'Worked Example',
        content: `Let us encrypt **"SECURITY"** using Atbash.

**Step 1 — Assign positions (A=0, ..., Z=25):**

| Plain | S | E | C | U | R | I | T | Y |
|---|---|---|---|---|---|---|---|---|
| Index | 18 | 4 | 2 | 20 | 17 | 8 | 19 | 24 |

**Step 2 — Apply 25 − x:**

| Plain | Index | 25 − x | Cipher |
|---|---|---|---|
| S | 18 | 7 | H |
| E | 4 | 21 | V |
| C | 2 | 23 | X |
| U | 20 | 5 | F |
| R | 17 | 8 | I |
| I | 8 | 17 | R |
| T | 19 | 6 | G |
| Y | 24 | 1 | B |

**Ciphertext:** **"HVXFIRGB"**

**Decryption** applies the same function:

- H (7) → 25 − 7 = 18 → S
- V (21) → 25 − 21 = 4 → E
- ...and so on, recovering "SECURITY" exactly.

No key, no parameters, no secrecy of algorithm — just a fixed, self-inverting substitution.`,
        example: `Walkthrough (character by character):

'S' (18) → 25 - 18 = 7  → 'H'
'E' (4)  → 25 - 4  = 21 → 'V'
'C' (2)  → 25 - 2  = 23 → 'X'
'U' (20) → 25 - 20 = 5  → 'F'
'R' (17) → 25 - 17 = 8  → 'I'
'I' (8)  → 25 - 8  = 17 → 'R'
'T' (19) → 25 - 19 = 6  → 'G'
'Y' (24) → 25 - 24 = 1  → 'B'

Result: "HVXFIRGB"
Apply atbash again to recover "SECURITY".`,
      },
      {
        id: 'security',
        title: 'Security Analysis',
        content: `Atbash provides **zero cryptographic security** — even less than the Caesar cipher, because there is **no key at all**.

**1. No key, no keyspace**
Anyone who knows the algorithm can invert the text instantly. There is nothing to brute-force because there is nothing secret.

**2. Frequency analysis is trivially effective**
Atbash preserves letter frequency **exactly**, just with a mirrored alphabet. In an English message, "E" (12.7%) still appears most often — but as "V" (25 − 4 = 21). An attacker who knows this can map every letter by frequency alone.

**3. Known-plaintext attack**
A single plaintext–ciphertext pair fully reveals the mapping — but there was nothing to hide anyway, since the mapping is fixed and public.

**4. No protection against any threat model**
Atbash is not designed to resist **any** attacker. It is purely a historical and pedagogical example.`,
        keyPoints: [
          '**Zero confidentiality**: no key, fixed substitution, fully public algorithm',
          '**Frequency analysis**: preserves letter distribution exactly',
          '**No keyspace**: nothing to protect — the mapping is fixed',
          'Strictly educational — never use for real security',
        ],
        callout: {
          type: 'warning',
          title: 'Zero Confidentiality',
          content: `Atbash is not just weak — it provides **literally zero confidentiality**. Anyone with a basic understanding of the alphabet can invert it mentally. Its value is **pedagogical**: introducing the concept of involution, which is central to XOR, Feistel networks, and modern cipher design.`,
        },
      },
      {
        id: 'comparison',
        title: 'Atbash vs Caesar',
        content: `Both Atbash and Caesar are monoalphabetic substitutions, but differ in fundamental ways:

| Aspect | Atbash | Caesar |
|---|---|---|
| Key required? | **No** — fixed inversion | **Yes** — shift key (1–25) |
| Involutory? | **Yes** — self-inverting | **No** — needs reverse shift |
| Keyspace | 1 (no key) | 25 |
| Frequency leak? | Preserved exactly | Shifted by k |
| Cryptographic purpose | Esoteric encoding | Military dispatch obfuscation |
| Introduces | **Involution** | **Modular arithmetic & keys** |

**Why study both?**
- **Caesar** teaches **keys** and **modular arithmetic**.
- **Atbash** teaches **involution** — a concept that recurs in every modern cipher.
- Together, they cover the two fundamental design patterns of classical substitution.`,
      },
      {
        id: 'lab',
        title: 'Try It Yourself',
        content: `Use the mini-lab below to encrypt and decrypt with Atbash. Notice that — because Atbash is an involution — the **encrypt** and **decrypt** buttons perform the **exact same** operation. This is a defining property of self-inverse ciphers.`,
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You have mastered the Atbash cipher — the classic involution cipher.

**Core concepts learned:**
- **Involution**: f(f(x)) = x — a function that is its own inverse
- **Fixed substitution**: no key, mapping is entirely alphabet-dependent
- **Frequency preservation**: Atbash does not mask letter patterns at all
- **Historical context**: 2,500 years old, used by Hebrew scribes
- **Recurrence of involutions**: XOR, ROT13, Feistel networks all use the same principle

**Next algorithm:** Vigenère — the polyalphabetic cipher that defeated cryptanalysts for 300 years.`,
      },
    ],
    playgroundRoute: '/playground/encrypt?algo=atbash',
    defaultDemoKey: '',
    defaultDemoInput: 'ATTACK AT DAWN',
    labEnabled: true,
  },

  // ============================================================
  // 3 — VIGENÈRE CIPHER
  // ============================================================
  {
    id: 'vigenere',
    name: 'Vigenère Cipher',
    category: 'classical',
    difficulty: 'intermediate',
    tagline: 'The polyalphabetic cipher once hailed as le chiffre indéchiffrable',
    description:
      'A polyalphabetic substitution cipher that applies a different Caesar shift to each letter using a repeating keyword. It resisted cryptanalysis for 300 years until Kasiski and Babbage independently broke it.',
    estimatedMinutes: 12,
    references: [
      {
        title: 'The Code Book: The Science of Secrecy from Ancient Egypt to Quantum Cryptography',
        author: 'S. Singh',
        year: 1999,
        url: 'https://simonsingh.net/books/the-code-book/',
        type: 'book',
      },
      {
        title: 'Communication Theory of Secrecy Systems',
        author: 'C. E. Shannon',
        year: 1949,
        url: 'https://ieeexplore.ieee.org/document/6769090',
        type: 'paper',
      },
      {
        title: 'Introduction to Modern Cryptography (3rd Edition)',
        author: 'J. Katz, Y. Lindell',
        year: 2020,
        url: 'https://www.taylorfrancis.com/books/mono/10.1201/9781351133036/introduction-modern-cryptography-jonathan-katz-yehuda-lindell',
        type: 'book',
      },
    ],
    keyTakeaways: [
      '**Polyalphabetic**: each letter uses a different Caesar shift based on the keyword.',
      'Defeats simple frequency analysis — at least, for a while.',
      'Broken by **Kasiski examination** when the keyword repeats.',
      'An OTP is a Vigenère cipher with a truly random key as long as the message.',
    ],
    sections: [
      {
        id: 'introduction',
        title: 'What is the Vigenère Cipher?',
        content: `The Vigenère cipher is a **polyalphabetic substitution cipher** — a significant evolution from the monoalphabetic ciphers (Caesar, Atbash) that dominated earlier cryptography.

**Key idea:** Instead of using a single shift for all letters, the Vigenère cipher uses a **keyword** to apply a **different Caesar shift** to each letter of the plaintext. If the keyword is **KEY** (shifts 10, 4, 24), then:
- Letter 1 shifts by 10 (K)
- Letter 2 shifts by 4 (E)
- Letter 3 shifts by 24 (Y)
- Letter 4 shifts by 10 (K) again — the keyword repeats

This **interleaving of shifts** defeats the simple frequency analysis that broke monoalphabetic ciphers. Each letter of the plaintext is "scrambled" by a different amount, so the ciphertext does not preserve the plaintext's letter frequency — **at first glance**.

**Why this matters:**
- For nearly **300 years**, the Vigenère cipher was considered **unbreakable**.
- It was nicknamed *"le chiffre indéchiffrable"* (the indecipherable cipher).
- It was finally broken by **Charles Babbage (1854)** and **Friedrich Kasiski (1863)** — independently.
- The method they used — **finding the key length first, then breaking each Caesar sub-cipher** — remains a model for modern cryptanalysis.`,
        keyPoints: [
          'Polyalphabetic: multiple Caesar shifts, one per letter',
          'Keyword repeats cyclically to determine each shift',
          'Defeats simple frequency analysis — for a while',
          'The foundation for modern polyalphabetic thinking (and OTP)',
        ],
        callout: {
          type: 'info',
          title: 'Historical Status',
          content: `For nearly 300 years — from its publication in 1553 until Kasiski's 1863 attack — the Vigenère cipher was considered **unbreakable**. This 300-year reign is one of the longest in cryptographic history and illustrates how **perceived** complexity can vastly exceed **actual** cryptographic strength.`,
        },
      },
      {
        id: 'history',
        title: 'Historical Origin',
        content: `The Vigenère cipher was **first described by Giovan Battista Bellaso in 1553**, in his book *La cifra del. Sig. Giovan Battista Bellaso*. Bellaso's method used a keyword to shift letters — exactly the modern Vigenère technique.

**The misattribution:**
The cipher was **later misattributed to Blaise de Vigenère** (1523–1596), a French diplomat and cryptographer, who published a related but distinct autokey cipher in 1586. The confusion arose in the 19th century when historians mistakenly credited Vigenère with the Bellaso design. By then, the name had stuck.

**Three centuries of perceived security:**
- **1553–1854**: Vigenère considered unbreakable by most cryptanalysts.
- **1854**: **Charles Babbage** breaks it privately (but never publishes).
- **1863**: **Friedrich Kasiski**, a Prussian infantry officer, independently discovers and publishes the same technique.

**The Kasiski method** — finding repeated sequences in the ciphertext to deduce the keyword length — is one of the foundational techniques of cryptanalysis. It works because when a **common substring** appears in the plaintext at positions separated by a multiple of the keyword length, the resulting ciphertext substrings are **identical**. The distances between these repeats are multiples of the key length.`,
        keyPoints: [
          'Described by **Bellaso in 1553** — later misattributed to Vigenère',
          'Blaise de Vigenère published a **different** (autokey) variant in 1586',
          'Considered unbreakable for **300 years**',
          'Broken by **Babbage (1854, unpublished)** and **Kasiski (1863, published)**',
        ],
      },
      {
        id: 'how-it-works',
        title: 'How It Works',
        content: `The Vigenère cipher operates in four steps:

**Step 1 — Choose a keyword**
The keyword can be any alphabetic string, e.g., **"KEY"**. It is converted to numeric shifts: K=10, E=4, Y=24.

**Step 2 — Repeat the keyword**
The keyword is repeated to match the length of the plaintext:

\`\`\`
Plain:    HELLOWORLD
Keyword:  KEYKEYKEYK  (repeated)
\`\`\`

**Step 3 — Apply each shift**
Each plaintext letter is shifted by its corresponding keyword letter:

**Cᵢ = (Pᵢ + Kᵢ) mod 26**

For "HELLO" with keyword "KEY":
- H (7) + K (10) = 17 → R
- E (4) + E (4) = 8 → I
- L (11) + Y (24) = 35 mod 26 = 9 → J
- L (11) + K (10) = 21 → V
- O (14) + E (4) = 18 → S

**Ciphertext:** "RIJVS"

**Step 4 — Decryption**
Same process, but **subtract** the keyword shifts:

**Pᵢ = (Cᵢ − Kᵢ + 26) mod 26**

**Non-alphabetic characters** (spaces, digits, punctuation) are preserved and **do not advance the keyword index** — an important implementation detail.`,
        keyPoints: [
          'Keyword repeats cyclically to cover the full plaintext',
          'Each letter gets a different shift — this is what breaks frequency analysis',
          'Decryption uses the same algorithm with subtraction',
          'Non-alphabetic characters are typically preserved and skipped',
        ],
        codeSnippet: {
          language: 'typescript',
          code: `function vigenereCipher(
  text: string,
  key: string,
  mode: 'encrypt' | 'decrypt' = 'encrypt'
): string {
  const cleanKey = key.replace(/[^a-zA-Z]/g, '').toUpperCase();
  if (!cleanKey) return text;

  let result = '';
  let keyIndex = 0;

  for (const ch of text) {
    const code = ch.charCodeAt(0);
    const isUpper = code >= 65 && code <= 90;
    const isLower = code >= 97 && code <= 122;

    if (isUpper || isLower) {
      const base = isUpper ? 65 : 97;
      const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
      const effective = mode === 'encrypt' ? shift : (26 - shift) % 26;
      result += String.fromCharCode(
        ((code - base + effective) % 26) + base
      );
      keyIndex++;
    } else {
      result += ch;
    }
  }
  return result;
}

vigenereCipher("HELLO WORLD", "KEY");
// → "RIJVS UYVJN"`,
          caption: 'Vigenère: keyword-driven shifts with case preservation',
        },
      },
      {
        id: 'formula',
        title: 'Mathematical Formulation',
        content: `Let the plaintext be P₁P₂...Pₙ and the keyword K₁K₂...Kₘ (repeated cyclically). Each character uses the keyword letter's numeric value (A=0, ..., Z=25):

**Encryption:**
**Cᵢ = (Pᵢ + K_(i mod m)) mod 26**

**Decryption:**
**Pᵢ = (Cᵢ − K_(i mod m) + 26) mod 26**

**Where m is the keyword length.**

**Extending to the One-Time Pad:**
If the keyword is:
1. **Truly random** (not a repeated word)
2. **As long as the message** (never repeats)
3. **Used only once**

...then the Vigenère cipher becomes a **One-Time Pad** — proven by Claude Shannon in 1949 to be **information-theoretically secure** (perfect secrecy). This is the only cipher for which an adversary with **infinite computing power** cannot decrypt the message.

**The catch:** distributing a truly random key as long as every message is impractical, requiring a secure channel to share keys — a chicken-and-egg problem. Modern stream ciphers (ChaCha20, AES-CTR) simulate an OTP using a short key + a pseudorandom keystream generator.`,
        keyPoints: [
          'Vigenère generalizes to **One-Time Pad** with a truly random, non-repeating key',
          'OTP is the **only** cipher with perfect information-theoretic secrecy',
          'Kasiski attack exploits the **repeating keyword** — the fatal weakness',
          'Modern stream ciphers emulate OTP using pseudorandom keystreams',
        ],
      },
      {
        id: 'example',
        title: 'Worked Example',
        content: `Let us encrypt **"CYBERSECURITY"** with keyword **"LOCK"**.

**Step 1 — Convert keyword to shifts:**
- L = 11
- O = 14
- C = 2
- K = 10
- (repeats: L, O, C, K, L, O, ...)

**Step 2 — Apply shifts:**

| Pos | Plain | Index | Key | Shift | (P+K) mod 26 | Cipher |
|---|---|---|---|---|---|---|
| 1 | C | 2 | L | 11 | 13 | N |
| 2 | Y | 24 | O | 14 | 38 mod 26 = 12 | M |
| 3 | B | 1 | C | 2 | 3 | D |
| 4 | E | 4 | K | 10 | 14 | O |
| 5 | R | 17 | L | 11 | 28 mod 26 = 2 | C |
| 6 | S | 18 | O | 14 | 32 mod 26 = 6 | G |
| 7 | E | 4 | C | 2 | 6 | G |
| 8 | C | 2 | K | 10 | 12 | M |
| 9 | U | 20 | L | 11 | 31 mod 26 = 5 | F |
| 10 | R | 17 | O | 14 | 31 mod 26 = 5 | F |
| 11 | I | 8 | C | 2 | 10 | K |
| 12 | T | 19 | K | 10 | 29 mod 26 = 3 | D |
| 13 | Y | 24 | L | 11 | 35 mod 26 = 9 | J |

**Ciphertext:** **"NMDOCGGMFFKDJ"**

**Notice:** the plaintext has **two C's** (positions 1 and 8). They encrypt to **N** and **M** — different ciphertext letters for the same plaintext letter. This is what makes Vigenère resistant to naive frequency analysis.`,
        example: `Walkthrough (character by character):

'C' (2)  + L (11) = 13 → 'N'
'Y' (24) + O (14) = 38 → 12 → 'M'
'B' (1)  + C (2)  = 3  → 'D'
'E' (4)  + K (10) = 14 → 'O'
'R' (17) + L (11) = 28 → 2  → 'C'
'S' (18) + O (14) = 32 → 6  → 'G'
'E' (4)  + C (2)  = 6  → 'G'
'C' (2)  + K (10) = 12 → 'M'
'U' (20) + L (11) = 31 → 5  → 'F'
'R' (17) + O (14) = 31 → 5  → 'F'
'I' (8)  + C (2)  = 10 → 'K'
'T' (19) + K (10) = 29 → 3  → 'D'
'Y' (24) + L (11) = 35 → 9  → 'J'

Result: "NMDOCGGMFFKDJ"

Note: two 'C's encrypted to 'N' and 'M' — different
ciphertext letters for the same plaintext letter.`,
      },
      {
        id: 'security',
        title: 'Security Analysis',
        content: `The Vigenère cipher was **invincible for 300 years** — but only because cryptanalysts did not know the right technique. Once Kasiski and Babbage discovered it, Vigenère fell as thoroughly as Caesar.

**1. Kasiski examination — finding the key length**
If a common substring appears twice in the plaintext at positions separated by a **multiple of the keyword length**, the resulting ciphertext substrings are **identical**. The distances between repeats are multiples of the key length.

**Example:**
If "THE" appears in the plaintext at positions 5 and 25, and the keyword is length 5, then both "THE"s are encrypted with the same keyword shifts, producing the same ciphertext "XYZ". The attacker notes the distance (20 = 4 × 5) and deduces that the keyword length is likely a **divisor of 20**.

**2. Splitting into m Caesar ciphers**
Once the key length m is known, the ciphertext splits into **m independent Caesar ciphers**:
- Characters at positions 1, 1+m, 1+2m, ... form a Caesar cipher with shift K₁
- Characters at positions 2, 2+m, 2+2m, ... form a Caesar cipher with shift K₂

Each sub-cipher is broken by **standard frequency analysis** — because within a single sub-cipher, the distribution **does** reflect plaintext frequencies.

**3. Modern attack — Friedman's Index of Coincidence**
William F. Friedman (1920s) formalized a statistical measure called the **Index of Coincidence (IC)** that estimates key length without needing repeated substrings. For English text:
- IC ≈ 0.0667 for monoalphabetic text
- IC ≈ 0.0385 for uniform (polyalphabetic) text

By testing different assumed key lengths and computing IC, an attacker can find the correct m with high confidence.`,
        keyPoints: [
          '**Kasiski examination**: repeat distances reveal key length',
          '**Splitting**: once m is known, the cipher reduces to m Caesar ciphers',
          '**Friedman IC**: statistical estimation of key length',
          '**Only truly safe** if the key is random, long, and never reused (OTP)',
        ],
        callout: {
          type: 'warning',
          title: 'Never Use for Real Security',
          content: `The Vigenère cipher is **broken** — the only question is how much ciphertext an attacker needs. In the 16th century, it offered **real protection against casual opponents**. In the 21st century, modern cryptanalysis reduces it to a textbook exercise. Use it to understand polyalphabetic principles — never to protect real data.`,
        },
      },
      {
        id: 'comparison',
        title: 'Vigenère vs Caesar',
        content: `The step from Caesar to Vigenère is one of the most important in cryptographic history:

| Aspect | Caesar | Vigenère |
|---|---|---|
| Substitution | Monoalphabetic | Polyalphabetic |
| Key type | Single integer (1–25) | Keyword (arbitrary length) |
| Keyspace | 25 | 26^m (m = keyword length) |
| Frequency leak | Directly preserved | Hidden within each sub-cipher |
| Broken by | Brute-force, frequency | Kasiski examination, IC analysis |
| Held for | Days | ~300 years |
| Security status | Broken | Broken |

**Why Vigenère is a leap forward:**
- **Keyspace growth**: from 25 to **exponential** in the keyword length. A 10-letter keyword has 26¹⁰ ≈ 1.4 × 10¹⁴ possibilities.
- **Frequency obscuring**: identical plaintext letters encrypt to different ciphertext letters at different positions.
- **Historic influence**: Vigenère directly inspired the **One-Time Pad** — the only theoretically unbreakable cipher.

**Why both are broken anyway:**
- Caesar: keyspace far too small.
- Vigenère: keyword **repeats**, leaking structure that Kasiski exploits.

The lesson: **increasing keyspace is not enough** — the *structure* of a cipher matters. Modern ciphers use **non-linear S-boxes**, **round constants**, and **key whitening** to eliminate all statistical structure.`,
      },
      {
        id: 'lab',
        title: 'Try It Yourself',
        content: `Use the mini-lab below to explore the Vigenère cipher. Try different keywords — notice how longer, non-repeating keywords produce ciphertext with **less obvious structure**. But remember: no matter how long the keyword, if it **repeats**, Kasiski examination will eventually break it.`,
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You have mastered the Vigenère cipher — the polyalphabetic cipher that held for 300 years.

**Core concepts learned:**
- **Polyalphabetic substitution**: multiple Caesar shifts, one per letter
- **Keyword-based encryption**: repeats cyclically to determine shifts
- **Kasiski examination**: repeats in ciphertext reveal the key length
- **Index of Coincidence**: statistical estimation of key length (Friedman)
- **One-Time Pad**: the theoretical limit of Vigenère — unbreakable if the key is random, long, and used once

**Next algorithm:** XOR — the bitwise primitive powering every modern cipher.`,
      },
    ],
    playgroundRoute: '/playground/encrypt?algo=vigenere',
    defaultDemoKey: 'CIPHER',
    defaultDemoInput: 'CRYPTOGRAPHY IS BEAUTIFUL',
    labEnabled: true,
  },

  // ============================================================
  // 4 — XOR CIPHER
  // ============================================================
  {
    id: 'xor',
    name: 'XOR Cipher',
    category: 'classical',
    difficulty: 'beginner',
    tagline: 'The foundational bitwise building block of all modern digital ciphers',
    description:
      'Combines plaintext bytes with key bytes using the binary exclusive-OR operator. XOR is involutory, self-inverting, and used internally by AES, ChaCha20, and SHA-256. It is the atomic primitive of digital cryptography.',
    estimatedMinutes: 10,
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
    keyTakeaways: [
      'XOR is **involutory**: (A ⊕ B) ⊕ B = A — the same operation encrypts and decrypts.',
      'It is the **atomic primitive** of every modern cipher: AES, ChaCha20, SHA-256.',
      'Reusing an XOR key across multiple messages is **catastrophic** (Two-Time Pad).',
      'The **One-Time Pad** — XOR with a truly random key — is information-theoretically secure.',
    ],
    sections: [
      {
        id: 'introduction',
        title: 'What is the XOR Cipher?',
        content: `The **XOR cipher** (exclusive-OR cipher) is the most fundamental **bitwise** encryption primitive in cryptography. Unlike Caesar and Vigenère — which work on **letters** — XOR works directly on **bits and bytes**.

**The XOR operation:**
XOR takes two bits and outputs 1 if they differ, 0 if they are the same:

| A | B | A ⊕ B |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

**Why it is special:**
XOR is **involutory**: applying it twice with the same key recovers the original data.

**(A ⊕ B) ⊕ B = A**

This single property makes XOR the **perfect encryption operation**:
- Same function for encryption and decryption
- Every bit of output depends on both plaintext and key
- No information is lost
- Fast — a single CPU instruction

**Where XOR lives today:**
- **AES**: XORs round keys with the state in every round
- **ChaCha20**: XORs the keystream with the plaintext
- **SHA-256**: XORs intermediate hash values
- **Every stream cipher**: combines pseudorandom keystream with plaintext

XOR is not just *a* cipher — it is **the atomic primitive** from which modern cryptography is built.`,
        keyPoints: [
          'Works on **bits**, not letters — operates at the byte level',
          '**Involutory**: the same function both encrypts and decrypts',
          'Used internally by every modern cipher (AES, ChaCha20, SHA-256)',
          'Foundation of stream ciphers and the One-Time Pad',
        ],
      },
      {
        id: 'history',
        title: 'Historical Origin',
        content: `XOR was formalized as a cryptographic primitive by **Gilbert Vernam** in 1917, who patented a teleprinter cipher that XORed a paper-tape key with the message stream. Vernam's invention became the foundation of the **One-Time Pad (OTP)** — the only cipher proven to have **perfect secrecy** (Shannon, 1949).

**Historical milestones:**
- **1917**: Vernam patents the XOR teleprinter cipher.
- **1949**: **Claude Shannon** proves the One-Time Pad is information-theoretically secure.
- **1977**: DES becomes the first major cipher to use XOR in its Feistel rounds.
- **2001**: AES adopts XOR in every round (AddRoundKey).
- **2008**: ChaCha20 uses XOR to combine keystream with plaintext.
- **Today**: XOR executes **billions of times per second** in every secure connection on the internet.

**The VENONA project (1940s):**
American cryptanalysts broke Soviet intelligence traffic by exploiting a fatal XOR mistake — the Soviets **reused key material** across multiple messages. This is the **Two-Time Pad** attack, and it remains one of the most important lessons in cryptographic history: **never reuse a stream cipher key**.`,
        keyPoints: [
          'Formalized by **Vernam (1917)** for teleprinter cryptography',
          '**Shannon (1949)** proved OTP has perfect secrecy',
          'Soviet **key reuse** broke VENONA — the Two-Time Pad attack',
          'Used today in every modern cipher (AES, ChaCha20, SHA-256)',
        ],
      },
      {
        id: 'how-it-works',
        title: 'How It Works',
        content: `The XOR cipher operates on **bytes** (8-bit groups). Here is the process:

**Step 1 — Convert plaintext to bytes**
Each character becomes an 8-bit ASCII/UTF-8 byte. For example, "H" = 72 = \`01001000\`.

**Step 2 — Align key with plaintext**
The key is repeated cyclically to match the plaintext length. If the key is "KEY" (3 bytes) and the plaintext is 10 bytes, the key becomes "KEYKEYKEYK".

**Step 3 — XOR each byte**
For each byte position i:

**Cᵢ = Pᵢ ⊕ K_(i mod m)**

**Step 4 — Decryption**
The same operation decrypts:

**Pᵢ = Cᵢ ⊕ K_(i mod m)**

**Numeric example:**
Plaintext "H" (72 = \`01001000\`) XOR key "K" (75 = \`01001011\`):

\`\`\`
  01001000  ('H' = 72)
⊕ 01001011  ('K' = 75)
─────────
  00000011  (0x03)
\`\`\`

XORing back with "K":
\`\`\`
  00000011  (0x03)
⊕ 01001011  ('K' = 75)
─────────
  01001000  ('H' = 72) ✓
\`\`\`

**Non-ASCII data**: since XOR works at the byte level, it can encrypt **any** binary data — text, images, audio, executables. This is a major advantage over letter-based ciphers (Caesar, Vigenère), which only handle alphabetic characters.`,
        keyPoints: [
          'Operates on **bytes**, not letters — works on any binary data',
          'Key is repeated cyclically to match plaintext length',
          'Encryption and decryption are the **same operation**',
          'The output is typically displayed in **hexadecimal** (since it is binary)',
        ],
        codeSnippet: {
          language: 'typescript',
          code: `// XOR stream cipher (byte-level)
function xorCipher(
  data: Uint8Array,
  key: Uint8Array
): Uint8Array {
  const out = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    out[i] = data[i] ^ key[i % key.length];
  }
  return out;
}

// Encrypt then decrypt with the SAME function:
const plaintext = new TextEncoder().encode("SECRET");
const key = new TextEncoder().encode("KEY");

const ciphertext = xorCipher(plaintext, key);
const recovered = xorCipher(ciphertext, key); // "SECRET"

// Note: because XOR is involutory, no separate
// decrypt function is required.`,
          caption: 'XOR: involution means no separate decrypt function',
        },
      },
      {
        id: 'formula',
        title: 'Mathematical Formulation',
        content: `For bytes Pᵢ (plaintext) and Kᵢ (key) with the key repeated cyclically:

**Encryption:**
**Cᵢ = Pᵢ ⊕ K_(i mod m)**

**Decryption:**
**Pᵢ = Cᵢ ⊕ K_(i mod m)**

**Where m is the key length.**

**The XOR identity — proof of involutory property:**

(Cᵢ) ⊕ Kᵢ = (Pᵢ ⊕ Kᵢ) ⊕ Kᵢ

Using associativity of XOR:

= Pᵢ ⊕ (Kᵢ ⊕ Kᵢ)

Any value XORed with itself is 0:

= Pᵢ ⊕ 0

Any value XORed with 0 is itself:

= Pᵢ ✓

**The One-Time Pad condition:**
If K is:
1. **Truly random** (not pseudorandom)
2. **As long as the message** (never repeats)
3. **Used only once** (never reused)

...then the cipher achieves **perfect secrecy** — Shannon's strongest notion of security.

**Algebraic interpretation:**
XOR is the addition operation in **GF(2)** — the finite field with two elements (0 and 1). This connects the XOR cipher to a much larger mathematical framework that underlies AES, Reed-Solomon codes, and error-correcting codes.`,
        keyPoints: [
          'Cᵢ = Pᵢ ⊕ Kᵢ and Pᵢ = Cᵢ ⊕ Kᵢ — the same formula',
          '**Proof of involutory**: (P ⊕ K) ⊕ K = P',
          '**OTP**: XOR with a truly random, non-repeating key of message length',
          'XOR is addition in **GF(2)** — a foundational algebraic operation',
        ],
      },
      {
        id: 'example',
        title: 'Worked Example',
        content: `Let us encrypt **"FLAG"** with key **"KEY"** (repeated).

**Step 1 — Convert to bytes:**

| Char | ASCII | Binary |
|---|---|---|
| F | 70 | \`01000110\` |
| L | 76 | \`01001100\` |
| A | 65 | \`01000001\` |
| G | 71 | \`01000111\` |

**Key bytes:**

| Char | ASCII | Binary |
|---|---|---|
| K | 75 | \`01001011\` |
| E | 69 | \`01000101\` |
| Y | 89 | \`01011001\` |
| K | 75 | \`01001011\` |

**Step 2 — XOR each byte:**

| Plain | Key | XOR Binary | Hex |
|---|---|---|---|
| F | K | \`01000110 ⊕ 01001011 = 00001101\` | 0D |
| L | E | \`01001100 ⊕ 01000101 = 00001001\` | 09 |
| A | Y | \`01000001 ⊕ 01011001 = 00011000\` | 18 |
| G | K | \`01000111 ⊕ 01001011 = 00001100\` | 0C |

**Ciphertext (hex):** **\`0D 09 18 0C\`**

**Step 3 — Decrypt (XOR with same key):**

| Cipher | Key | XOR Binary | Char |
|---|---|---|---|
| 0D | K | \`00001101 ⊕ 01001011 = 01000110\` | F |
| 09 | E | \`00001001 ⊕ 01000101 = 01001100\` | L |
| 18 | Y | \`00011000 ⊕ 01011001 = 01000001\` | A |
| 0C | K | \`00001100 ⊕ 01001011 = 01000111\` | G |

**Recovered:** **"FLAG"** ✓`,
        example: `Walkthrough (bit level):

'F' (0x46) ⊕ 'K' (0x4B):
  01000110
⊕ 01001011
─────────
  00001101  (0x0D)

'L' (0x4C) ⊕ 'E' (0x45):
  01001100
⊕ 01000101
─────────
  00001001  (0x09)

'A' (0x41) ⊕ 'Y' (0x59):
  01000001
⊕ 01011001
─────────
  00011000  (0x18)

'G' (0x47) ⊕ 'K' (0x4B):
  01000111
⊕ 01001011
─────────
  00001100  (0x0C)

Ciphertext: 0D 09 18 0C`,
      },
      {
        id: 'security',
        title: 'Security Analysis',
        content: `XOR is a **primitive**, not a complete cipher. Its security depends entirely on **how the key is generated and managed**.

**Secure use — One-Time Pad:**
- Key is **truly random** (from a CSPRNG or hardware entropy source)
- Key is **as long as the message** (no repetition)
- Key is **never reused**
- Key is **shared** over a secure channel

Under these conditions, XOR achieves **perfect secrecy** — no attacker, even with infinite computing power, can extract any information about the plaintext.

**Insecure use — Repeating key:**
If the key is shorter than the message and repeats, the cipher becomes a **polyalphabetic substitution** (like Vigenère) and is vulnerable to:

1. **Frequency analysis** — repeating keys preserve patterns
2. **Crib-dragging** — guessing common words (e.g., "the", "and") in the plaintext
3. **Two-Time Pad** — reusing the same key across multiple messages reveals P₁ ⊕ P₂

**The Two-Time Pad attack:**
Given two ciphertexts C₁ and C₂ encrypted with the same key:
- C₁ = P₁ ⊕ K
- C₂ = P₂ ⊕ K
- C₁ ⊕ C₂ = P₁ ⊕ P₂ (the key cancels out!)

This reveals the **XOR of the plaintexts** — often enough to recover both via statistical analysis. This attack famously broke the Soviet **VENONA** traffic in the 1940s.`,
        keyPoints: [
          'XOR alone is **not secure** with a repeating key',
          'OTP conditions: random, as long as message, never reused',
          '**Two-Time Pad**: C₁ ⊕ C₂ = P₁ ⊕ P₂ — catastrophic key reuse',
          'Real ciphers (AES-CTR, ChaCha20) use **pseudorandom keystreams** instead of repeating keys',
        ],
        callout: {
          type: 'warning',
          title: 'Never Reuse a Stream Cipher Key',
          content: `Reusing an XOR keystream across multiple messages is **catastrophic**. The same vulnerability that broke Soviet VENONA in the 1940s is exactly why **AES-GCM forbids nonce reuse today**. A single replayed nonce destroys both confidentiality and integrity.`,
        },
      },
      {
        id: 'comparison',
        title: 'XOR vs Letter-Based Ciphers',
        content: `XOR operates on a fundamentally different level than Caesar or Vigenère:

| Aspect | Letter-Based (Caesar/Vigenère) | XOR |
|---|---|---|
| Unit | 1 letter (26 values) | 1 byte (256 values) |
| Handles binary? | No — only A-Z | Yes — any data (image, audio, files) |
| Encryption = Decryption? | No (Vigenère), Yes (Atbash) | Yes (involution) |
| Speed | Slow (character loop) | Extremely fast (CPU instruction) |
| Key space | 26 or 26^m | 2^(8 × key length) |
| Foundation of | Historical ciphers | All modern ciphers |

**Why XOR is the foundation of modern crypto:**
- **Universal**: any data can be represented as bytes
- **Fast**: a single CPU instruction per byte
- **Involutory**: eliminates the need for a separate decryption function
- **Proven**: the One-Time Pad is the only cipher with information-theoretic security

Every modern cipher — AES, ChaCha20, SHA-256 — ultimately uses XOR as its combining operation. Understanding XOR is understanding the atomic primitive of digital cryptography.`,
      },
      {
        id: 'lab',
        title: 'Try It Yourself',
        content: `Use the mini-lab below to experiment with XOR. Notice how:
- The **same operation** both encrypts and decrypts (involution).
- Different keys produce different ciphertexts — but identical keys always produce identical ciphertexts for the same plaintext.
- If the key is short and repeats, patterns may become visible in long messages — this is the vulnerability of repeating-key XOR.`,
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You have mastered XOR — the atomic primitive of modern cryptography.

**Core concepts learned:**
- **Bitwise operation**: works on bytes, not letters
- **Involution**: (A ⊕ B) ⊕ B = A — one function for both directions
- **One-Time Pad**: XOR with a random, non-repeating key of message length
- **Two-Time Pad attack**: reusing a key reveals P₁ ⊕ P₂
- **Foundation of all ciphers**: AES, ChaCha20, SHA-256 all rely on XOR

**Next algorithm:** AES-GCM — the authenticated symmetric cipher powering TLS 1.3.`,
      },
    ],
    playgroundRoute: '/playground/encrypt?algo=xor',
    defaultDemoKey: 'SECRETKEY',
    defaultDemoInput: 'Confidential message payload',
    labEnabled: true,
  },
];