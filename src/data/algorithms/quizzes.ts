import type { AlgorithmQuiz } from './_types';

/**
 * Quiz bank for all 14 cryptographic algorithms.
 *
 * Keyed by algorithm.id so lookup is O(1):
 *   ALGORITHM_QUIZZES['caesar']  → [quiz1, quiz2, quiz3]
 *
 * Each algorithm has 2-3 quizzes covering:
 *   - Historical fact (origin, inventor, era)
 *   - Mechanics (how it works, formula, size)
 *   - Security (weakness, attack, best practice)
 *
 * Sources: NIST, IETF RFC, and peer-reviewed literature
 * (see individual algorithm reference lists).
 */
export const ALGORITHM_QUIZZES: Record<string, AlgorithmQuiz[]> = {
  // ============================================================
  // 1 — CAESAR CIPHER
  // ============================================================
  caesar: [
    {
      question:
        'If the Caesar cipher uses shift key K=17, what is the ciphertext of the plaintext "CAT"?',
      instruction: 'Encrypt each letter using mod 26 arithmetic.',
      inputType: 'text',
      correctAnswer: 'TRK',
      hint: 'C(2) + 17 = 19 → T. A(0) + 17 = 17 → R. T(19) + 17 = 36 mod 26 = 10 → K.',
      explanation:
        'C(2)+17=19→T, A(0)+17=17→R, T(19)+17=36 mod 26=10→K. The ciphertext is "TRK".',
    },
    {
      question:
        'How many **meaningful** keys does the Caesar cipher have (shifts that actually change the plaintext)?',
      instruction: 'Enter a single number.',
      inputType: 'number',
      correctAnswer: '25',
      hint: 'The alphabet has 26 letters, but one shift leaves the text unchanged.',
      explanation:
        'The Caesar cipher has 26 possible shifts (0–25), but shift 0 leaves the plaintext unchanged. Only **25 meaningful keys** exist, making it trivially brute-forceable.',
    },
    {
      question:
        'Which cryptanalytic technique is **most effective** at breaking a Caesar cipher without brute-forcing all 25 keys?',
      instruction: 'Select the best answer.',
      inputType: 'choice',
      options: [
        'Frequency analysis of ciphertext letters',
        'Quantum computing with Shor\'s algorithm',
        'Chosen-ciphertext attack with a padding oracle',
        'Side-channel timing analysis',
      ],
      correctAnswer: 'Frequency analysis of ciphertext letters',
      hint: 'The Caesar cipher preserves the frequency distribution of letters — just shifted.',
      explanation:
        'Because the Caesar cipher is **monoalphabetic**, letter frequencies are preserved (E is still the most common, just shifted). Frequency analysis instantly reveals the shift by matching the ciphertext\'s most common letter to "E" (12.7% of English).',
    },
  ],

  // ============================================================
  // 2 — ATBASH CIPHER
  // ============================================================
  atbash: [
    {
      question: 'What is the Atbash ciphertext of the plaintext "KRYPTO"?',
      instruction: 'Map each letter to its mirror counterpart (A↔Z, B↔Y, ...).',
      inputType: 'text',
      correctAnswer: 'PIBKGL',
      hint: 'K(10) → 25−10 = 15 → P. R(17) → 8 → I. Y(24) → 1 → B. P(15) → 10 → K. T(19) → 6 → G. O(14) → 11 → L.',
      explanation:
        'K→P, R→I, Y→B, P→K, T→G, O→L. Result: "PIBKGL".',
    },
    {
      question: 'What is the mathematical formula for the Atbash cipher?',
      instruction: 'Select the correct formula.',
      inputType: 'choice',
      options: [
        'C = (P + 13) mod 26',
        'C = 25 − P',
        'C = P XOR 0x0F',
        'C = P^e mod N',
      ],
      correctAnswer: 'C = 25 − P',
      hint: 'The alphabet is mirrored around its midpoint — the transformation subtracts from 25.',
      explanation:
        'Atbash maps letter index P (0–25) to **25 − P**. Because 25 − (25 − P) = P, this is an **involution** — the same operation encrypts and decrypts.',
    },
    {
      question:
        'Why is Atbash considered an **involution**?',
      instruction: 'Select the best description.',
      inputType: 'choice',
      options: [
        'Because it uses a large random key',
        'Because applying it twice returns the original: f(f(x)) = x',
        'Because it uses modular exponentiation',
        'Because it has a keyspace of 2^256',
      ],
      correctAnswer: 'Because applying it twice returns the original: f(f(x)) = x',
      hint: 'The same function serves as both encryption and decryption.',
      explanation:
        'An **involution** is a function that is its own inverse: f(f(x)) = x. Atbash, ROT13, XOR, and Feistel rounds are all involutions. This elegant property means encryption and decryption use the **exact same code**.',
    },
  ],

  // ============================================================
  // 3 — VIGENÈRE CIPHER
  // ============================================================
  vigenere: [
    {
      question:
        'If a Vigenère ciphertext contains the repeated sequence "ABC" at positions 10, 25, and 55, what is the most likely keyword length?',
      instruction: 'Use Kasiski examination: compute distances, find the GCD.',
      inputType: 'choice',
      options: ['5', '15', '30', 'Cannot be determined'],
      correctAnswer: '15',
      hint: 'Distances are 15 (25−10) and 30 (55−25). The GCD is 15.',
      explanation:
        'Distances between repeated "ABC" occurrences are 15 and 30. Their GCD is 15. The keyword length is most likely **15** (or a divisor of 15, like 3 or 5).',
    },
    {
      question: 'What type of cipher is Vigenère?',
      instruction: 'Select the correct classification.',
      inputType: 'choice',
      options: [
        'Monoalphabetic substitution',
        'Polyalphabetic substitution',
        'Transposition cipher',
        'Block cipher',
      ],
      correctAnswer: 'Polyalphabetic substitution',
      hint: 'It uses a keyword to apply multiple different Caesar shifts.',
      explanation:
        'Vigenère is **polyalphabetic**: each plaintext letter uses a different Caesar shift determined by the keyword. This defeats simple frequency analysis — at least until Kasiski examination reveals the key length.',
    },
    {
      question:
        'If the Vigenère keyword is truly random, **as long as the message**, and **never reused**, the cipher becomes what?',
      instruction: 'Select the correct answer.',
      inputType: 'choice',
      options: [
        'Still weak to Kasiski examination',
        'A One-Time Pad — information-theoretically secure',
        'Equivalent to AES-256',
        'A hash function',
      ],
      correctAnswer: 'A One-Time Pad — information-theoretically secure',
      hint: 'Shannon proved this construction has perfect secrecy.',
      explanation:
        'When the Vigenère keyword is truly random, as long as the message, and never reused, it becomes a **One-Time Pad** — the only cipher proven to have **perfect secrecy** (Shannon, 1949). The challenge is distributing such a key securely.',
    },
  ],

  // ============================================================
  // 4 — XOR CIPHER
  // ============================================================
  xor: [
    {
      question:
        'Given C₁ = P₁ XOR K and C₂ = P₂ XOR K, what does C₁ XOR C₂ equal?',
      instruction: 'Simplify using XOR properties.',
      inputType: 'choice',
      options: ['P₁ XOR P₂', 'K', 'P₁ XOR P₂ XOR K', '0'],
      correctAnswer: 'P₁ XOR P₂',
      hint: 'K XOR K = 0. So C₁ XOR C₂ = P₁ XOR K XOR P₂ XOR K = P₁ XOR P₂.',
      explanation:
        '(P₁ XOR K) XOR (P₂ XOR K) = P₁ XOR P₂ XOR (K XOR K) = P₁ XOR P₂ XOR 0 = **P₁ XOR P₂**. This is why key reuse is catastrophic (the Two-Time Pad attack).',
    },
    {
      question: 'What is the result of A XOR A for any value A?',
      instruction: 'Enter a single number.',
      inputType: 'number',
      correctAnswer: '0',
      hint: 'XOR returns 1 only when bits differ. Two identical bits always differ... never.',
      explanation:
        'A XOR A = 0 for any A. This is why XOR is **involutory**: (A XOR B) XOR B = A XOR (B XOR B) = A XOR 0 = A. This property makes XOR the perfect primitive for stream ciphers.',
    },
    {
      question:
        'What cryptographic property does the One-Time Pad (XOR with a truly random key) provide?',
      instruction: 'Select the strongest correct answer.',
      inputType: 'choice',
      options: [
        'Collision resistance',
        'Perfect secrecy (information-theoretic security)',
        'Non-repudiation',
        'Quantum resistance',
      ],
      correctAnswer: 'Perfect secrecy (information-theoretic security)',
      hint: 'Shannon proved this in 1949 — even infinite computing power cannot break it.',
      explanation:
        'The One-Time Pad provides **perfect secrecy** — Shannon\'s strongest notion of security. Even an adversary with **infinite computing power** learns nothing about the plaintext. The catch: the key must be truly random, as long as the message, and never reused.',
    },
  ],

  // ============================================================
  // 5 — AES-GCM
  // ============================================================
  aes: [
    {
      question:
        'In AES-GCM, what happens if the same **(key, nonce)** pair is used to encrypt two different messages?',
      instruction: 'Select the correct impact.',
      inputType: 'choice',
      options: [
        'Nothing — GCM handles nonce reuse automatically',
        'Only the ciphertext becomes longer',
        'Confidentiality is broken AND authentication can be forged',
        'Only performance degrades',
      ],
      correctAnswer: 'Confidentiality is broken AND authentication can be forged',
      hint: 'Nonce reuse cancels the keystream, revealing P₁ XOR P₂, and leaks the GHASH subkey H.',
      explanation:
        'Nonce reuse in AES-GCM is **catastrophic**: (1) the keystream cancels, so C₁ XOR C₂ = P₁ XOR P₂; (2) the GHASH subkey H can be recovered algebraically, allowing **forgery of arbitrary authentication tags**. NIST SP 800-38D mandates unique nonces for this reason.',
    },
    {
      question: 'How large is the authentication tag in AES-GCM?',
      instruction: 'Select the correct size.',
      inputType: 'choice',
      options: ['8 bytes (64 bits)', '12 bytes (96 bits)', '16 bytes (128 bits)', '32 bytes (256 bits)'],
      correctAnswer: '16 bytes (128 bits)',
      hint: 'The tag is the same size as the AES block.',
      explanation:
        'AES-GCM produces a **16-byte (128-bit)** authentication tag. NIST recommends **at least 96 bits** for all but the most constrained environments. Any tampering with the ciphertext causes the tag to differ, and decryption fails.',
    },
    {
      question:
        'What **two** components does AES-GCM combine?',
      instruction: 'Select the correct pair.',
      inputType: 'choice',
      options: [
        'AES-CTR (encryption) + GHASH (authentication)',
        'AES-CBC (encryption) + HMAC-SHA1 (authentication)',
        'RSA + SHA-256',
        'Diffie-Hellman + AES',
      ],
      correctAnswer: 'AES-CTR (encryption) + GHASH (authentication)',
      hint: 'CTR = counter mode for encryption. GHASH = Galois field hash for authentication.',
      explanation:
        'AES-GCM = **AES-CTR** for encryption + **GHASH** for authentication. GHASH operates in the Galois field GF(2¹²⁸), producing a 16-byte tag in a single pass. This is why AES-GCM is called an **AEAD** cipher (Authenticated Encryption with Associated Data).',
    },
  ],

  // ============================================================
  // 6 — RSA-OAEP
  // ============================================================
  rsa: [
    {
      question: 'Why is **textbook RSA** (raw RSA without padding) considered insecure?',
      instruction: 'Select the most complete answer.',
      inputType: 'choice',
      options: [
        'It uses too few rounds',
        'It is deterministic and malleable',
        'It requires a quantum computer to run',
        'It only works with 512-bit keys',
      ],
      correctAnswer: 'It is deterministic and malleable',
      hint: 'Same plaintext → same ciphertext. And C × kᵉ mod N decrypts to M × k.',
      explanation:
        'Textbook RSA is **deterministic** (same input → same output, breaking semantic security) and **malleable** (multiplying ciphertext by kᵉ multiplies plaintext by k). It is also vulnerable to small-message attacks. **OAEP padding** fixes all of these by adding randomized, hash-based padding.',
    },
    {
      question: 'What is the minimum recommended RSA key size in 2024?',
      instruction: 'Select the modern recommendation.',
      inputType: 'choice',
      options: ['1024 bits', '2048 bits', '4096 bits', '8192 bits'],
      correctAnswer: '2048 bits',
      hint: 'NIST SP 800-57 provides guidance — 1024-bit RSA is broken.',
      explanation:
        'NIST recommends **2048-bit** RSA as the minimum for current security, with **3072-bit** for data that must remain secure for 20+ years. 1024-bit RSA is considered broken by modern factoring techniques.',
    },
    {
      question:
        'Which mathematical problem must be hard for RSA to remain secure?',
      instruction: 'Select the correct hardness assumption.',
      inputType: 'choice',
      options: [
        'Discrete logarithm problem',
        'Integer factorization problem',
        'Elliptic curve discrete logarithm problem',
        'Learning with errors problem',
      ],
      correctAnswer: 'Integer factorization problem',
      hint: 'RSA security rests on the difficulty of factoring N = p × q.',
      explanation:
        'RSA security relies on the **integer factorization problem** — given a large composite N, finding its prime factors p and q. If factoring becomes easy (e.g., via **Shor\'s algorithm** on a quantum computer), RSA is broken. This is the driving force behind post-quantum cryptography.',
    },
  ],

  // ============================================================
  // 7 — CHACHA20-POLY1305
  // ============================================================
  chacha20: [
    {
      question:
        'Why is ChaCha20-Poly1305 considered **immune to cache-timing attacks**?',
      instruction: 'Select the correct reason.',
      inputType: 'choice',
      options: [
        'It uses AES-NI hardware acceleration',
        'It uses only Add-Rotate-XOR (ARX) operations — no S-box table lookups',
        'It runs only on GPUs',
        'It uses a 1024-bit key',
      ],
      correctAnswer: 'It uses only Add-Rotate-XOR (ARX) operations — no S-box table lookups',
      hint: 'AES uses a 256-byte S-box table. ChaCha20 does not — it uses only constant-time arithmetic.',
      explanation:
        'ChaCha20 uses only **Add-Rotate-XOR (ARX)** operations — no data-dependent branches, no table lookups. This makes it **constant-time by design**. AES relies on S-box lookups (256-byte table), which can leak through cache timing. This is why ChaCha20 is preferred on hardware without AES-NI.',
    },
    {
      question: 'In which year was ChaCha20 designed, and by whom?',
      instruction: 'Select the correct answer.',
      inputType: 'choice',
      options: [
        '1994, by Rivest, Shamir, and Adleman',
        '2008, by Daniel J. Bernstein',
        '1976, by Diffie and Hellman',
        '2015, by NIST',
      ],
      correctAnswer: '2008, by Daniel J. Bernstein',
      hint: 'It is a variant of Salsa20 by the same author.',
      explanation:
        'ChaCha20 was designed by **Daniel J. Bernstein in 2008**, as an improvement to his earlier Salsa20 cipher (2005). It was standardized in RFC 7539 (2015) and RFC 8439 (2018), and is now mandatory in TLS 1.3 alongside AES-GCM.',
    },
    {
      question: 'What happens if the same (key, nonce) pair is reused in ChaCha20-Poly1305?',
      instruction: 'Select the correct impact.',
      inputType: 'choice',
      options: [
        'Nothing — it is safe to reuse',
        'Only the tag length changes',
        'Same as AES-GCM: confidentiality AND integrity are broken',
        'Only decryption becomes slower',
      ],
      correctAnswer: 'Same as AES-GCM: confidentiality AND integrity are broken',
      hint: 'Nonce reuse is catastrophic for ALL AEAD ciphers.',
      explanation:
        'Nonce reuse in ChaCha20-Poly1305 is **just as catastrophic as in AES-GCM**. The keystream cancels (revealing P₁ XOR P₂), and the Poly1305 key can be recovered, allowing **tag forgery**. Always generate a fresh random 96-bit nonce for every encryption.',
    },
  ],

  // ============================================================
  // 8 — HMAC-SHA256
  // ============================================================
  hmac: [
    {
      question:
        'What is the difference between HMAC-SHA256 and plain SHA-256?',
      instruction: 'Select the most accurate answer.',
      inputType: 'choice',
      options: [
        'HMAC is faster than SHA-256',
        'HMAC uses a secret key and provides authenticity, while SHA-256 provides only integrity',
        'HMAC produces a longer digest',
        'They are completely identical',
      ],
      correctAnswer:
        'HMAC uses a secret key and provides authenticity, while SHA-256 provides only integrity',
      hint: 'A plain hash can be recomputed by anyone. An HMAC requires the key.',
      explanation:
        'A plain SHA-256 hash proves **integrity** — but anyone can recompute it. HMAC-SHA256 adds a **secret key**, proving both integrity AND **authenticity** (the sender holds the key). This is why HMAC powers JWT (HS256), AWS SigV4, and Stripe webhooks.',
    },
    {
      question:
        'Which cryptographic vulnerability does HMAC specifically prevent?',
      instruction: 'Select the correct attack.',
      inputType: 'choice',
      options: [
        'Length extension attack',
        'Brute-force on AES',
        'Quantum Shor\'s algorithm',
        'Differential power analysis',
      ],
      correctAnswer: 'Length extension attack',
      hint: 'The nested construction (inner hash + outer hash) defeats extension.',
      explanation:
        'HMAC specifically prevents **length extension attacks** that break naive MACs like H(secret || message). By using **nested hashing** — H((K ⊕ opad) || H((K ⊕ ipad) || m)) — the attacker cannot extend a known HMAC to a new valid message without knowing the secret.',
    },
    {
      question:
        'What type of cryptographic primitive is HMAC-SHA256?',
      instruction: 'Select the correct classification.',
      inputType: 'choice',
      options: [
        'Hash function',
        'Message Authentication Code (MAC)',
        'Public-key signature',
        'Stream cipher',
      ],
      correctAnswer: 'Message Authentication Code (MAC)',
      hint: 'It requires a shared symmetric key between both parties.',
      explanation:
        'HMAC-SHA256 is a **MAC** (Message Authentication Code). Unlike digital signatures (which use public/private keys), a MAC is **symmetric** — both sender and receiver share the same secret. This makes it fast but unsuitable for public verification.',
    },
  ],

  // ============================================================
  // 9 — SHA-256
  // ============================================================
  sha256: [
    {
      question: 'What is the output size of SHA-256?',
      instruction: 'Select the correct size.',
      inputType: 'choice',
      options: ['128 bits (32 hex chars)', '256 bits (64 hex chars)', '512 bits (128 hex chars)', 'Variable'],
      correctAnswer: '256 bits (64 hex chars)',
      hint: 'The "256" in SHA-256 tells you the answer.',
      explanation:
        'SHA-256 always produces a **256-bit** digest, displayed as **64 hexadecimal characters**, regardless of input size. This fixed-output property is what makes hashing useful for compact integrity verification.',
    },
    {
      question:
        'If you change **one bit** in a SHA-256 input, approximately how many output bits will change?',
      instruction: 'Enter a number (0-256).',
      inputType: 'number',
      correctAnswer: '128',
      hint: 'Avalanche effect: on average ~50% of bits flip.',
      explanation:
        'Due to the **avalanche effect**, changing one input bit flips approximately **50% of output bits** — for SHA-256, that is about **128 bits**. This is why hashes are a strong integrity primitive: even a tiny change produces a completely different digest.',
    },
    {
      question:
        'What is SHA-256\'s approximate **collision resistance** (in bits)?',
      instruction: 'Select the correct security level.',
      inputType: 'choice',
      options: ['64 bits', '128 bits', '256 bits', '512 bits'],
      correctAnswer: '128 bits',
      hint: 'Due to the Birthday Paradox, collision resistance is half the output size.',
      explanation:
        'The **Birthday Paradox** says that finding a collision requires only ~2^(n/2) work, not 2^n. For SHA-256 (256-bit output), collision resistance is therefore **128 bits** — still astronomically infeasible with classical computers.',
    },
  ],

  // ============================================================
  // 10 — SHA-512
  // ============================================================
  sha512: [
    {
      question: 'What is the output size of SHA-512?',
      instruction: 'Select the correct size.',
      inputType: 'choice',
      options: ['256 bits (64 hex chars)', '384 bits (96 hex chars)', '512 bits (128 hex chars)', '1024 bits (256 hex chars)'],
      correctAnswer: '512 bits (128 hex chars)',
      hint: 'The "512" in the name tells you the answer.',
      explanation:
        'SHA-512 produces a **512-bit** digest, displayed as **128 hex characters** — exactly twice the length of SHA-256. It uses 64-bit words (instead of 32) and 80 rounds (instead of 64).',
    },
    {
      question:
        'Why is SHA-512 often **faster** than SHA-256 on modern CPUs, despite producing a larger output?',
      instruction: 'Select the correct reason.',
      inputType: 'choice',
      options: [
        'It uses fewer rounds',
        'It uses 64-bit words that match modern CPU registers',
        'It uses hardware acceleration',
        'It has a smaller internal state',
      ],
      correctAnswer: 'It uses 64-bit words that match modern CPU registers',
      hint: 'SHA-256 uses 32-bit words, wasting half of each 64-bit register.',
      explanation:
        'SHA-256 uses 32-bit words — on a 64-bit CPU, half of each register is wasted. SHA-512 uses **64-bit words**, fully utilizing modern CPU registers. Despite more rounds (80 vs 64), it processes data faster on 64-bit hardware.',
    },
    {
      question:
        'How many bits of collision resistance does SHA-512 provide against a **quantum** adversary (using Grover\'s algorithm)?',
      instruction: 'Enter a number.',
      inputType: 'number',
      correctAnswer: '256',
      hint: 'Grover halves the effective security. SHA-512 gives 512 bits classical, so quantum...',
      explanation:
        'Grover\'s algorithm halves the effective security of hash functions. SHA-512\'s 512-bit classical collision resistance becomes **256 bits** post-quantum — a very comfortable margin. This is why SHA-512 is preferred for long-term, high-assurance systems.',
    },
  ],

  // ============================================================
  // 11 — MD5
  // ============================================================
  md5: [
    {
      question: 'In what year was MD5 shown to be cryptographically broken?',
      instruction: 'Enter a year (4 digits).',
      inputType: 'number',
      correctAnswer: '2004',
      hint: 'Wang et al. published a practical collision attack at CRYPTO that year.',
      explanation:
        'In **2004**, Xiaoyun Wang and colleagues published a practical collision attack on MD5, generating two different messages with the same hash in hours. This effectively broke MD5 for all security purposes.',
    },
    {
      question:
        'Which of the following is a **safe** use of MD5 in 2024?',
      instruction: 'Select the only safe use case.',
      inputType: 'choice',
      options: [
        'Signing digital certificates',
        'Storing user passwords',
        'Verifying file integrity against attackers',
        'Non-adversarial cache keys (e.g., HTTP caching)',
      ],
      correctAnswer: 'Non-adversarial cache keys (e.g., HTTP caching)',
      hint: 'MD5 is broken for anything security-related, but collisions in a cache just cause cache misses.',
      explanation:
        'The ONLY safe use of MD5 in 2024 is **non-adversarial, non-security** contexts like cache keys or deduplication — where a collision causes a minor functional problem (cache miss), not a security breach. **Never** use MD5 for signatures, passwords, or integrity against attackers.',
    },
    {
      question:
        'What cryptographic property did MD5 lose in 2004?',
      instruction: 'Select the correct property.',
      inputType: 'choice',
      options: [
        'Preimage resistance',
        'Collision resistance',
        'Deterministic output',
        'One-way property',
      ],
      correctAnswer: 'Collision resistance',
      hint: 'Two different messages can now be crafted to produce the same hash.',
      explanation:
        'MD5 lost **collision resistance** in 2004 — attackers can find two different messages with the same MD5 hash. This allowed real attacks: the 2008 rogue CA certificate and the 2012 Flame malware. Preimage resistance still holds theoretically, but collisions are enough to break digital signatures.',
    },
  ],

  // ============================================================
  // 12 — BASE64
  // ============================================================
  base64: [
    {
      question: 'Is Base64 an encryption scheme?',
      instruction: 'Select the correct answer.',
      inputType: 'choice',
      options: [
        'Yes, it uses a symmetric key',
        'No, it is a binary-to-text encoding with no key',
        'Yes, but only with a 256-bit key',
        'It depends on the implementation',
      ],
      correctAnswer: 'No, it is a binary-to-text encoding with no key',
      hint: 'Anyone can decode Base64 with a single line of code — no credentials required.',
      explanation:
        'Base64 is **NOT encryption** — it is a binary-to-text **encoding** scheme with **no key**. Anyone can decode it instantly with `atob()` in JavaScript or `base64 -d` in a terminal. It provides **zero confidentiality** and is used only for safe transport across text-only protocols.',
    },
    {
      question: 'What is the Base64 encoding of the string "Hi"?',
      instruction: 'Enter the Base64 string (including any padding).',
      inputType: 'text',
      correctAnswer: 'SGk=',
      hint: '"H" = 0x48, "i" = 0x69. Group of 2 bytes → 3 chars + 1 padding.',
      explanation:
        '"Hi" is 2 bytes: 0x48, 0x69. Split into 6-bit groups: `010010 000110 100100 00` padded → produces "SGk" + "=" padding. Result: **SGk=**.',
    },
  ],

  // ============================================================
  // 13 — HEX
  // ============================================================
  hex: [
    {
      question: 'How many hexadecimal characters are needed to represent **one byte** (8 bits)?',
      instruction: 'Enter a number.',
      inputType: 'number',
      correctAnswer: '2',
      hint: 'One hex character = 4 bits. One byte = 8 bits.',
      explanation:
        'Each hex character represents **4 bits** (a nibble). One byte = 8 bits = **2 hex characters**. This is why hex is byte-aligned: every 2 chars = exactly 1 byte. Example: 0x48 = "H".',
    },
    {
      question: 'What is the hexadecimal encoding of the ASCII string "Hi"?',
      instruction: 'Enter the hex string without spaces or prefix.',
      inputType: 'text',
      correctAnswer: '4869',
      hint: '"H" = 72 = 0x48. "i" = 105 = 0x69.',
      explanation:
        '"H" = 72 decimal = **0x48**. "i" = 105 decimal = **0x69**. Concatenated: **4869**. Verify with `echo -n "Hi" | xxd -p` → 4869.',
    },
  ],

  // ============================================================
  // 14 — ROT13
  // ============================================================
  rot13: [
    {
      question: 'What is the result of applying ROT13 **twice** to any input?',
      instruction: 'Select the correct answer.',
      inputType: 'choice',
      options: [
        'The input is doubled',
        'The output is completely different',
        'The original input (ROT13 is its own inverse)',
        'The input shifted by 26 positions',
      ],
      correctAnswer: 'The original input (ROT13 is its own inverse)',
      hint: '13 + 13 = 26 = the length of the alphabet.',
      explanation:
        'Because 13 + 13 = 26 (the alphabet length), applying ROT13 twice returns the original: **ROT13(ROT13(x)) = x**. This is the **involution** property. It makes ROT13 uniquely suited for voluntary obfuscation — one operation does both encryption and decryption.',
    },
    {
      question: 'What is the ROT13 encoding of the word "HELLO"?',
      instruction: 'Enter the ROT13 result (uppercase).',
      inputType: 'text',
      correctAnswer: 'URYYB',
      hint: 'H(7)+13=20→U. E(4)+13=17→R. L(11)+13=24→Y. Y(24)+13=11→L... wait, L(11)+13=24→Y.',
      explanation:
        'H(7)+13=20→**U**. E(4)+13=17→**R**. L(11)+13=24→**Y**. L(11)+13=24→**Y**. O(14)+13=27 mod 26=1→**B**. Result: **URYYB**. Apply ROT13 again to recover "HELLO".',
    },
  ],
};