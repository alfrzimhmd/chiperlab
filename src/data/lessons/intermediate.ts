import { Lesson } from '../../types/lesson';

/**
 * Intermediate Lessons — Order 9-18
 *
 * Covers mechanism internals, key management, and security primitives.
 * Prerequisite: complete the beginner track (order 1-8).
 *
 * Order:
 *   9.  Symmetric Cryptography
 *   10. Asymmetric Cryptography
 *   11. Hashing & The Avalanche Effect
 *   12. Digital Signatures
 *   13. Cryptographic Keys & Entropy
 *   14. IV & Nonce
 *   15. Authentication & HMAC
 *   16. Key Exchange Protocols (DH, ECDH)
 *   17. Digital Certificates & PKI
 *   18. Password Storage & Slow Hashing
 */
export const INTERMEDIATE_LESSONS: Lesson[] = [
  // ============================================================
  // LESSON 9 — SYMMETRIC CRYPTOGRAPHY
  // ============================================================
  {
    id: 'symmetric-crypto',
    slug: 'symmetric-cryptography',
    order: 9,
    title: 'Symmetric Cryptography',
    category: 'mechanisms',
    description:
      'Master shared-key encryption: how AES processes 128-bit blocks at gigabyte-per-second speed, why stream ciphers power secure messaging, and the key distribution problem that led to public-key cryptography.',
    difficulty: 'intermediate',
    estimatedMinutes: 14,
    xpReward: 40,
    references: [
      {
        title: 'NIST FIPS 197: Advanced Encryption Standard (AES)',
        author: 'NIST',
        year: 2001,
        url: 'https://csrc.nist.gov/publications/detail/fips/197/final',
        type: 'standard',
      },
      {
        title: 'NIST SP 800-38A: Recommendation for Block Cipher Modes of Operation',
        author: 'NIST',
        year: 2001,
        url: 'https://csrc.nist.gov/publications/detail/sp/800-38a/final',
        type: 'standard',
      },
      {
        title: 'Introduction to Modern Cryptography (3rd Edition)',
        author: 'J. Katz, Y. Lindell',
        year: 2020,
        url: 'https://www.taylorfrancis.com/books/mono/10.1201/9781351133036/introduction-modern-cryptography-jonathan-katz-yehuda-lindell',
        type: 'book',
      },
    ],
    sections: [
      {
        id: 'introduction',
        title: 'Single Shared Key Encryption',
        content: `In symmetric cryptography, both the sender and receiver share the **exact same secret key** for both encryption and decryption. If Alice wants to send a secret message to Bob, both Alice and Bob must possess a copy of the identical secret key K.

Think of it like a physical lockbox with two identical keys: Alice locks the box with her key, ships it, and Bob unlocks it with his identical key. The security of the entire system depends on keeping those keys out of the wrong hands.

Symmetric cryptography is the **workhorse of modern security** — it protects HTTPS traffic, encrypted disks, VPN tunnels, and secure messaging. Its simplicity makes it fast enough to handle billions of bytes per second.`,
        keyPoints: [
          'One key used for both encryption and decryption',
          'Extremely fast and hardware-accelerated (AES-NI gives ~1-5 GB/s)',
          'Standard for bulk data encryption (files, streams, disks)',
          'Suffers from the key distribution problem: how do parties share the key?',
        ],
      },
      {
        id: 'concept',
        title: 'Block Ciphers vs Stream Ciphers',
        content: `Symmetric ciphers fall into two structural paradigms:

**1. Block Ciphers** — process plaintext in fixed-size chunks:

| Aspect | Details |
|---|---|
| Block size | Fixed (AES: 128 bits = 16 bytes) |
| Operations | Rounds of substitution, permutation, key mixing (SPN) |
| Examples | AES, DES (deprecated), Blowfish |
| Use case | File encryption, disk encryption, TLS payload |
| Padding | Required if plaintext not a multiple of block size |

**2. Stream Ciphers** — process plaintext one bit/byte at a time:

| Aspect | Details |
|---|---|
| Block size | None — continuous keystream |
| Operations | XOR with pseudorandom keystream |
| Examples | ChaCha20, RC4 (broken), Salsa20 |
| Use case | Streaming data, low-latency communication, mobile |
| Padding | Not required — can process byte-by-byte |

Both paradigms rely on the same core primitive: **XOR** combined with key-dependent transformations. Modern AES-GCM combines both — CTR mode (stream-like) + GHASH (authentication).`,
        codeSnippet: {
          language: 'typescript',
          code: `// Symmetric encryption with AES-GCM (Web Crypto API)
const key = await crypto.subtle.generateKey(
  { name: 'AES-GCM', length: 256 },
  true,
  ['encrypt', 'decrypt']
);

const iv = crypto.getRandomValues(new Uint8Array(12)); // Fresh nonce
const ciphertext = await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv },
  key,
  new TextEncoder().encode("Secret message")
);

// Decrypt with the SAME key
const plaintext = await crypto.subtle.decrypt(
  { name: 'AES-GCM', iv },
  key,
  ciphertext
);`,
          caption: 'AES-GCM: authenticated symmetric encryption',
        },
      },
      {
        id: 'example',
        title: 'The Key Distribution Dilemma',
        content: `If N people in an organization all need to communicate securely with each other using symmetric encryption, the number of distinct keys required grows **quadratically**:

Keys = N(N - 1) / 2

**Real-world scaling:**

| Users (N) | Keys Required |
|---|---|
| 2 | 1 |
| 10 | 45 |
| 100 | 4,950 |
| 1,000 | 499,500 |
| 10,000 | 49,995,000 |

For 10,000 employees, that's nearly **50 million secret keys** to generate, distribute, store, and rotate — an impossible operational challenge.

**The solution:** hybrid cryptography. Use asymmetric key exchange (like ECDH) to establish a temporary session key, then use that session key for symmetric bulk encryption. This is exactly what TLS 1.3 does in every HTTPS connection.`,
      },
      {
        id: 'visualization',
        title: 'Symmetric Flow',
        content: `Both parties share one key — encryption and decryption are mathematically linked by it:

| Step | Actor | Operation | Data |
|---|---|---|---|
| 1 | Alice | Encrypt with shared Key K | Plaintext → Ciphertext |
| 2 | Network | Transport ciphertext | Unreadable to eavesdroppers |
| 3 | Bob | Decrypt with same Key K | Ciphertext → Plaintext |`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Review symmetric strengths and challenges:',
        keyPoints: [
          'Symmetric ciphers use the same key for encryption and decryption.',
          'AES-256 is the global gold standard for symmetric bulk encryption.',
          'Block ciphers (AES) vs stream ciphers (ChaCha20) have different trade-offs.',
          'Very fast, but requires a secure channel to share the key beforehand.',
          'The key distribution problem motivated the invention of asymmetric crypto.',
        ],
      },
      {
        id: 'exercise',
        title: 'Checkpoint Question',
        content: 'Answer the question regarding symmetric key scaling.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You understand symmetric ciphers, the difference between block and stream ciphers, and why hybrid cryptography combines symmetric speed with asymmetric key exchange.

**Next lesson:** Asymmetric Cryptography — how public/private keys solve the distribution problem.`,
      },
    ],
    interactiveExercise: {
      question:
        'Which of the following is the most widely adopted modern symmetric block cipher standard?',
      instruction: 'Select the correct algorithm name.',
      inputType: 'choice',
      options: ['AES (Advanced Encryption Standard)', 'RSA', 'Diffie-Hellman', 'SHA-256'],
      correctAnswer: 'AES (Advanced Encryption Standard)',
      hint: 'It was selected by NIST in 2001 to replace DES and uses 128, 192, or 256-bit keys.',
      explanation:
        'AES (Advanced Encryption Standard), based on the Rijndael algorithm, is the worldwide benchmark for symmetric encryption.',
    },
  },

  // ============================================================
  // LESSON 10 — ASYMMETRIC CRYPTOGRAPHY
  // ============================================================
  {
    id: 'asymmetric-crypto',
    slug: 'asymmetric-cryptography',
    order: 10,
    title: 'Asymmetric Cryptography',
    category: 'mechanisms',
    description:
      'Discover the public-key revolution: how mathematically linked key pairs let two strangers establish secure communication over an open network. Learn RSA, elliptic curves, and why asymmetric crypto is 1000× slower but indispensable.',
    difficulty: 'intermediate',
    estimatedMinutes: 16,
    xpReward: 45,
    references: [
      {
        title: 'A Method for Obtaining Digital Signatures and Public-Key Cryptosystems',
        author: 'R. Rivest, A. Shamir, L. Adleman',
        year: 1978,
        url: 'https://dl.acm.org/doi/10.1145/359340.359342',
        type: 'paper',
      },
      {
        title: 'New Directions in Cryptography',
        author: 'W. Diffie, M. Hellman',
        year: 1976,
        url: 'https://ieeexplore.ieee.org/document/1055638',
        type: 'paper',
      },
      {
        title: 'RFC 8017: PKCS #1 — RSA Cryptography Specifications Version 2.2',
        author: 'K. Moriarty, B. Kaliski, J. Jonsson, A. Rusch',
        year: 2016,
        url: 'https://datatracker.ietf.org/doc/html/rfc8017',
        type: 'standard',
      },
    ],
    sections: [
      {
        id: 'introduction',
        title: 'The Public-Key Revolution',
        content: `Invented in the 1970s by Whitfield Diffie, Martin Hellman, and Ralph Merkle (along with Ron Rivest, Adi Shamir, and Leonard Adleman), asymmetric cryptography solved the key distribution problem — and made secure communication across the open internet possible.

Instead of a single shared secret, every participant has a **Key Pair**:

- **Public Key** — freely published to the world. Anyone can use it to encrypt messages intended for you.
- **Private Key** — kept strictly secret by you. Only this key can decrypt messages encrypted with your Public Key.

The two keys are mathematically linked: what one does, only the other can undo. This elegant asymmetry is what makes global secure communication possible — without prior contact or shared secrets.`,
        keyPoints: [
          'Two keys: Public (shared) and Private (secret)',
          'What is encrypted with Public Key can only be decrypted with Private Key',
          'Solves the key distribution problem without prior shared secrets',
          'Slower than symmetric (~1000×), used for key exchange and signatures',
        ],
      },
      {
        id: 'concept',
        title: 'Mathematical Foundations: Trapdoor Functions',
        content: `Asymmetric cryptography relies on **trapdoor functions** — math operations that are:

- **Easy to compute in one direction** (e.g., multiplying two large primes)
- **Hard to reverse** without a specific secret (the "trapdoor")

| Algorithm | Hard Math Problem | Approx. Security |
|---|---|---|
| RSA | Integer factorization (N = p × q) | 2048-4096 bit keys |
| ECC | Elliptic Curve Discrete Logarithm | 256-521 bit keys |
| DH | Discrete Logarithm over finite fields | 2048+ bit keys |

**Why are these hard?**

Factoring a 2048-bit RSA modulus (a 617-digit number) would require more computing power than all computers on Earth combined, running for millions of years. This asymmetry between "easy forward" and "hard backward" is what makes public-key crypto secure.

**Quantum threat:** Shor's algorithm (1994) would break RSA and ECC in polynomial time on a sufficiently large quantum computer — driving the migration to post-quantum cryptography.`,
        codeSnippet: {
          language: 'text',
          code: `Alice wants to send a secret to Bob:

  1. Alice obtains Bob's PUBLIC key (from a website, DNS, or directory)
  2. Alice encrypts:  C = Encrypt(Bob_Public_Key, Message)
  3. Alice transmits C over the open internet
  4. Bob decrypts:    Message = Decrypt(Bob_Private_Key, C)

  * Eve sees C but cannot decrypt it — she lacks Bob's Private Key.`,
          caption: 'Public-key encryption flow: only Bob can decrypt',
        },
      },
      {
        id: 'example',
        title: 'Hybrid Cryptography: The Best of Both Worlds',
        content: `Asymmetric ciphers are roughly **1,000× slower** than symmetric ciphers. Encrypting a 1 GB file with RSA would take hours; with AES-GCM it takes less than a second.

Real-world protocols (TLS, SSH, Signal) use **hybrid cryptography**:

| Phase | Cryptographic Tool | Speed | Purpose |
|---|---|---|---|
| Handshake | RSA-OAEP or ECDH | Slow (~ms) | Agree on a random session key |
| Bulk transfer | AES-256-GCM or ChaCha20-Poly1305 | Fast (~GB/s) | Encrypt the actual data |
| Integrity | SHA-256 or HMAC | Fast | Verify no tampering |

The asymmetric phase is used only for the initial key exchange. Once both parties share a session key, they switch to fast symmetric encryption. This is why HTTPS pages load in under 100 ms despite using "slow" public-key crypto.`,
      },
      {
        id: 'visualization',
        title: 'Public Key Encryption Flow',
        content: `Encryption and decryption use complementary keys:

| Step | Actor | Key Used | Operation |
|---|---|---|---|
| 1 | Alice | Bob's Public Key | C = Encrypt(M) |
| 2 | Network | (none) | Transport C |
| 3 | Bob | Bob's Private Key | M = Decrypt(C) |

Only Bob holds the Private Key, so only Bob can read the message.`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Core takeaways for public-key cryptography:',
        keyPoints: [
          'Every participant has a Public Key (shared) and a Private Key (secret).',
          'What is encrypted with the Public Key can only be decrypted by the Private Key.',
          'Relies on hard math problems: factoring (RSA) or discrete log (ECC).',
          'Slower than symmetric — used for key exchange and signatures.',
          'Real protocols use hybrid crypto: asymmetric for handshake, symmetric for data.',
        ],
      },
      {
        id: 'exercise',
        title: 'Interactive Exercise',
        content: 'Check your understanding of public-key operations.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You have mastered asymmetric cryptography — how public/private key pairs allow strangers to communicate securely over an open network, and why real protocols combine both asymmetric and symmetric crypto.

**Next lesson:** Hashing & The Avalanche Effect — the one-way functions behind integrity verification.`,
      },
    ],
    interactiveExercise: {
      question:
        'If Alice wants to send an encrypted message that ONLY Bob can read, whose key should she use to encrypt it?',
      instruction: 'Select the correct key.',
      inputType: 'choice',
      options: [
        "Bob's Public Key",
        "Alice's Private Key",
        "Bob's Private Key",
        "Alice's Public Key",
      ],
      correctAnswer: "Bob's Public Key",
      hint: 'Only Bob holds the corresponding private key capable of inverting the encryption.',
      explanation:
        "Alice must encrypt with Bob's Public Key. Bob is the only person in possession of Bob's corresponding Private Key needed to decrypt.",
    },
  },

  // ============================================================
  // LESSON 11 — HASHING FOUNDATIONS
  // ============================================================
  {
    id: 'hashing-foundations',
    slug: 'cryptographic-hashing',
    order: 11,
    title: 'Hashing & The Avalanche Effect',
    category: 'mechanisms',
    description:
      'Explore cryptographic hash functions — the one-way mathematical fingerprints that verify file integrity, secure passwords, and power blockchains. Learn why a single flipped bit scrambles half the hash.',
    difficulty: 'intermediate',
    estimatedMinutes: 13,
    xpReward: 40,
    references: [
      {
        title: 'NIST FIPS 180-4: Secure Hash Standard (SHS)',
        author: 'NIST',
        year: 2015,
        url: 'https://csrc.nist.gov/publications/detail/fips/180/4/final',
        type: 'standard',
      },
      {
        title: 'NIST SP 800-107 Rev. 1: Recommendation for Applications Using Approved Hash Algorithms',
        author: 'NIST',
        year: 2012,
        url: 'https://csrc.nist.gov/publications/detail/sp/800-107/rev-1/final',
        type: 'standard',
      },
      {
        title: 'Introduction to Modern Cryptography (3rd Edition)',
        author: 'J. Katz, Y. Lindell',
        year: 2020,
        url: 'https://www.taylorfrancis.com/books/mono/10.1201/9781351133036/introduction-modern-cryptography-jonathan-katz-yehuda-lindell',
        type: 'book',
      },
    ],
    sections: [
      {
        id: 'introduction',
        title: 'The Digital Fingerprint',
        content: `A cryptographic hash function takes an input of **any length** and produces a fixed-size output called a **hash**, **digest**, or **fingerprint**.

Key properties:
- **Deterministic** — same input always produces the same output
- **Fixed length** — SHA-256 always outputs 256 bits (64 hex chars)
- **One-way** — no key, no decryption, no way to reverse it
- **Fast** — billions of hashes per second on modern hardware

Think of it like a fingerprint for data: two identical files produce identical hashes; change one byte, and the hash changes completely. This is why hashes are used to verify downloads, git commits, and blockchain integrity.`,
        keyPoints: [
          'Deterministic: same input → same output, always',
          'Fixed output length: 1 word or 50 GB → same-sized hash',
          'One-way: cannot be inverted or decrypted',
          'Used for integrity verification, not confidentiality',
        ],
      },
      {
        id: 'concept',
        title: 'Properties of Secure Hash Functions',
        content: `To be cryptographically secure, a hash function must satisfy three properties:

**1. Pre-image Resistance (One-Way)**
Given a hash H, it is computationally infeasible to find any message m such that hash(m) = H. This is what makes hashing "one-way".

**2. Second Pre-image Resistance (Weak Collision)**
Given an input m1, it is infeasible to find a different input m2 such that hash(m1) = hash(m2). You cannot forge a different document that hashes to the same value.

**3. Collision Resistance (Strong Collision)**
It is infeasible to find **any two arbitrary distinct inputs** m1 ≠ m2 that produce the same hash. This requires ~2^(n/2) operations (birthday paradox). For SHA-256, that's ~2^128 — astronomically infeasible.

**Note:** These properties are related but not equivalent. Collision resistance is the strongest requirement.`,
        codeSnippet: {
          language: 'bash',
          code: `# The Avalanche Effect in SHA-256:
$ echo -n "The quick brown fox jumps over the lazy dog" | sha256sum
d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592

# Change a single character (dog -> cog):
$ echo -n "The quick brown fox jumps over the lazy cog" | sha256sum
e4c4dcf0a43f535d90e99dadbc58b45a981c4e66024f31ac016436d60d3d0bcb

# Compare bit-by-bit: over 50% of bits flipped!`,
          caption: 'Avalanche effect: 1 character change → 50% of hash bits change',
        },
      },
      {
        id: 'example',
        title: 'Common Cryptographic Hash Algorithms',
        content: `Different hash algorithms have different security levels and output sizes:

| Algorithm | Output Size | Status | Use Case |
|---|---|---|---|
| MD5 | 128 bits | Broken (2004) | Checksums only (non-security) |
| SHA-1 | 160 bits | Broken (2017) | Deprecated |
| SHA-256 | 256 bits | Secure | Bitcoin, TLS, git, general use |
| SHA-512 | 512 bits | Secure | 64-bit CPUs, HMAC |
| SHA-3 | 224-512 bits | Secure | Modern replacement, sponge construction |
| BLAKE3 | Variable | Secure | High-performance, modern |

**Rule of thumb:** Never use MD5 or SHA-1 for security. Prefer SHA-256 or SHA-512 for general use. SHA-3 is a newer alternative based on a different design (sponge construction) — immune to length extension attacks.`,
      },
      {
        id: 'visualization',
        title: 'Hashing Pipeline',
        content: `Regardless of input length, the output is always the same fixed size:

| Input | Length | Hash Output |
|---|---|---|
| "Hello" | 5 bytes | 256-bit digest |
| A 1-page document | ~3 KB | 256-bit digest |
| A 4 GB video file | 4 GB | 256-bit digest |

The avalanche effect guarantees that a 1-bit change in input causes ~50% of output bits to change unpredictably.`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Key concepts to remember:',
        keyPoints: [
          'Hashing is strictly one-way and cannot be inverted or decrypted.',
          'The avalanche effect ensures small input changes cause massive output shifts.',
          'Three properties: pre-image resistance, second pre-image resistance, collision resistance.',
          'Never use broken algorithms (MD5, SHA-1) for security.',
          'Hash functions provide integrity, not confidentiality.',
        ],
      },
      {
        id: 'exercise',
        title: 'Checkpoint Question',
        content: 'Answer the question regarding hash function characteristics.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You understand cryptographic digests, the avalanche effect, and collision resistance requirements.

**Next lesson:** Digital Signatures — combining public-key crypto and hashing for authenticity and non-repudiation.`,
      },
    ],
    interactiveExercise: {
      question:
        'What happens to the SHA-256 digest if you change a single punctuation mark in a 1,000-page document?',
      instruction: 'Select the behavior of the hash function.',
      inputType: 'choice',
      options: [
        'Approximately 50% of the output bits will change unpredictably (Avalanche effect)',
        'Only the last 2 characters of the hash will change',
        'Nothing, small changes are ignored by hashes',
        'The hash length decreases by 1 character',
      ],
      correctAnswer:
        'Approximately 50% of the output bits will change unpredictably (Avalanche effect)',
      hint: 'Recall the avalanche effect demonstration with the dog/cog example.',
      explanation:
        'The avalanche effect dictates that changing even a single bit in the input radically alters approximately half the bits in the resulting digest.',
    },
  },

  // ============================================================
  // LESSON 12 — DIGITAL SIGNATURES
  // ============================================================
  {
    id: 'digital-signature',
    slug: 'digital-signatures',
    order: 12,
    title: 'Digital Signatures',
    category: 'mechanisms',
    description:
      'Understand how public-key cryptography and hashing combine to guarantee authenticity, integrity, and non-repudiation. Learn why signed commits, signed updates, and legal e-signatures are cryptographically enforceable.',
    difficulty: 'intermediate',
    estimatedMinutes: 14,
    xpReward: 40,
    references: [
      {
        title: 'NIST FIPS 186-5: Digital Signature Standard (DSS)',
        author: 'NIST',
        year: 2023,
        url: 'https://csrc.nist.gov/publications/detail/fips/186/5/final',
        type: 'standard',
      },
      {
        title: 'RFC 8017: PKCS #1 — RSA Cryptography Specifications Version 2.2',
        author: 'K. Moriarty, B. Kaliski, J. Jonsson, A. Rusch',
        year: 2016,
        url: 'https://datatracker.ietf.org/doc/html/rfc8017',
        type: 'standard',
      },
      {
        title: 'A Method for Obtaining Digital Signatures and Public-Key Cryptosystems',
        author: 'R. Rivest, A. Shamir, L. Adleman',
        year: 1978,
        url: 'https://dl.acm.org/doi/10.1145/359340.359342',
        type: 'paper',
      },
    ],
    sections: [
      {
        id: 'introduction',
        title: 'The Digital Handshake',
        content: `In the physical world, handwritten signatures and wax seals have been used for millennia to ratify contracts. In the digital world, a **digital signature** provides mathematical proof of:

1. **Authenticity** — the message originated from the claimed sender.
2. **Integrity** — the message has not been altered in transit.
3. **Non-repudiation** — the signer cannot later deny having signed the message.

Unlike encryption, which hides content, a digital signature **proves authorship**. Anyone can verify it, but only the signer could have created it.`,
        keyPoints: [
          'Guarantees authenticity, integrity, and non-repudiation',
          "Signature is created with the signer's Private Key",
          "Verification uses the signer's Public Key",
          'Anyone can verify, but only the signer could have created the signature',
        ],
      },
      {
        id: 'concept',
        title: 'How Digital Signatures Work',
        content: `A digital signature inverts the key roles of public-key encryption:

**Signing (Sender - Alice):**
1. Alice computes the cryptographic hash of the document: H = SHA-256(Doc).
2. Alice encrypts (signs) the hash using her **Private Key**: Sig = Sign(Alice_PrivKey, H).
3. Alice attaches the signature Sig to the document.

**Verification (Receiver - Bob):**
1. Bob receives the document and signature.
2. Bob computes H_computed = SHA-256(Doc).
3. Bob verifies the signature using Alice's **Public Key**: H_extracted = Verify(Alice_PubKey, Sig).
4. If H_computed = H_extracted, the signature is valid.

**Why hash first?** Signing the full document would be slow (~1000× slower for large files). Signing the hash is fast and equally secure — the hash uniquely identifies the document.

**Common algorithms:** RSA-PSS, ECDSA, Ed25519 (Edwards-curve DSA).`,
        codeSnippet: {
          language: 'typescript',
          code: `// Digital signature verification (conceptual):
const messageHash = await sha256(message);
const signatureValid = await verify(
  alicePublicKey,
  signature,
  messageHash
);

if (signatureValid) {
  console.log("Document is authentic and untampered!");
}`,
          caption: "Verifying a digital signature with the signer's public key",
        },
      },
      {
        id: 'example',
        title: 'Everyday Use Cases',
        content: `Digital signatures are everywhere:

| Use Case | What's Signed | Who Verifies |
|---|---|---|
| OS Updates | Windows/macOS/Linux packages | The OS installer |
| TLS Certificates | Server public keys | Browsers, clients |
| Git Commits | Commit object hash | Other developers |
| Cryptocurrency | Transaction payload | The entire network |
| Legal e-Signatures | Contract documents | Courts, counterparties |
| Email (S/MIME, PGP) | Message content | Recipients |

**Real-world incident:** In 2016, attackers compromised the Linux Mint website and served a malicious ISO. Because the ISO was not properly signed, many users installed malware. Proper code signing would have rejected the tampered image.

**Best practice:** Always verify signatures before trusting downloaded software. This is why 'gpg --verify' and 'codesign --verify' matter.`,
      },
      {
        id: 'visualization',
        title: 'Signing & Verification Cycle',
        content: `Two-step process using complementary keys:

| Phase | Input | Key Used | Output |
|---|---|---|---|
| Signing | Document + Private Key | Signer's Private Key | Signature |
| Distribution | Document + Signature | (none) | Both sent to receiver |
| Verification | Document + Signature + Public Key | Signer's Public Key | Valid / Invalid |`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Review digital signature principles:',
        keyPoints: [
          "Signing uses the sender's Private Key; verification uses the sender's Public Key.",
          'Signatures operate on the hash of the data, not the whole file directly.',
          'Provides authenticity, integrity, and non-repudiation.',
          'Common algorithms: RSA-PSS, ECDSA, Ed25519.',
          'Always verify signatures before trusting downloaded software.',
        ],
      },
      {
        id: 'exercise',
        title: 'Checkpoint Question',
        content: 'Answer the question regarding which key creates the signature.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You understand digital signature mechanics and how they safeguard modern software distribution, financial networks, and legal agreements.

**Next lesson:** Cryptographic Keys & Entropy — the foundation of all cryptographic security.`,
      },
    ],
    interactiveExercise: {
      question: 'Which key is used to GENERATE a digital signature on a document?',
      instruction: 'Choose the signing key.',
      inputType: 'choice',
      options: [
        "The signer's Private Key",
        "The recipient's Public Key",
        "The recipient's Private Key",
        'A shared symmetric key',
      ],
      correctAnswer: "The signer's Private Key",
      hint: 'Only the signer possesses this secret, proving the signature came from them alone.',
      explanation:
        "The signer uses their own Private Key to sign. Anyone in the world can then verify the signature using the signer's Public Key.",
    },
  },

  // ============================================================
  // LESSON 13 — CRYPTOGRAPHIC KEYS & ENTROPY
  // ============================================================
  {
    id: 'crypto-keys',
    slug: 'cryptographic-keys',
    order: 13,
    title: 'Cryptographic Keys & Entropy',
    category: 'security',
    description:
      'Learn why key length and true randomness determine the strength of every cipher. Explore CSPRNGs, entropy pools, brute-force complexity, and the catastrophic consequences of predictable keys.',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    xpReward: 35,
    references: [
      {
        title:
          'NIST SP 800-90A Rev. 1: Recommendation for Random Number Generation Using Deterministic Random Bit Generators',
        author: 'NIST',
        year: 2015,
        url: 'https://csrc.nist.gov/publications/detail/sp/800-90a/rev-1/final',
        type: 'standard',
      },
      {
        title: 'NIST SP 800-57 Part 1 Rev. 5: Recommendation for Key Management',
        author: 'NIST',
        year: 2020,
        url: 'https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final',
        type: 'standard',
      },
      {
        title: 'MDN Web Docs — Crypto.getRandomValues()',
        author: 'Mozilla',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues',
        type: 'documentation',
      },
    ],
    sections: [
      {
        id: 'introduction',
        title: 'The Foundation of Security',
        content: `A cipher is only as strong as its key. Even the most mathematically robust algorithm is useless if the key is predictable, short, or generated from poor randomness.

**Two fundamental properties of keys:**
1. **Length (bits)** — how many possible keys exist (2^N keyspace)
2. **Entropy** — how unpredictable the key generation process is

A 256-bit key with only 40 bits of entropy is effectively a 40-bit key — an attacker can search the smaller effective space. This is why "key size" alone does not determine security; **entropy is what matters**.`,
        keyPoints: [
          'Key size dictates the key space (2^N possible keys)',
          'Entropy measures true unpredictability',
          'Modern ciphers require Cryptographically Secure PRNGs (CSPRNG)',
          'Never use Math.random() for cryptographic keys or tokens',
        ],
      },
      {
        id: 'concept',
        title: 'Key Space and Brute-Force Feasibility',
        content: `A brute-force attack tries every possible key until the correct one is found. Feasibility depends entirely on key size:

| Key Size | Total Keys | Time to Brute-Force (Modern) |
|---|---|---|
| 56-bit (DES) | 2^56 ≈ 7.2 × 10^16 | Hours (in 1999); minutes today |
| 80-bit | 2^80 ≈ 1.2 × 10^24 | Years |
| 128-bit (AES) | 2^128 ≈ 3.4 × 10^38 | Billions of years |
| 256-bit (AES) | 2^256 ≈ 1.15 × 10^77 | Physically impossible |

**Fun comparison:** 2^256 is roughly the number of atoms in the observable universe (~10^80). Even a computer running on all the energy in the universe could not exhaust this keyspace.

**But:** this assumes the key has full entropy. If your "256-bit key" is actually derived from a weak password, the effective keyspace is much smaller.`,
        codeSnippet: {
          language: 'typescript',
          code: `// ❌ WRONG — Insecure PRNG (predictable state)
const badKey = Math.random().toString(36); // NEVER for security

// ✅ CORRECT — Cryptographically Secure PRNG
const secureBytes = crypto.getRandomValues(new Uint8Array(32));
// 32 bytes = 256 bits of true entropy from OS entropy pool`,
          caption: 'Always use crypto.getRandomValues() for cryptographic material',
        },
      },
      {
        id: 'example',
        title: 'Entropy: The Real Measure of Unpredictability',
        content: `Entropy measures how many "bits of surprise" a value contains. It depends on **how** the value is generated, not just its length.

| Source | Length | Real Entropy | Comment |
|---|---|---|---|
| Random 32 bytes from OS | 256 bits | 256 bits | Full entropy |
| Password "Tr0ub4dor" | ~11 chars | ~28 bits | Dictionary word + pattern |
| Diceware passphrase (5 words) | ~25 chars | ~64 bits | Each word ~12.9 bits |
| User's birthday (MM/DD/YYYY) | 10 chars | ~15 bits | Predictable range |
| Coin flips (256 flips) | 256 bits | 256 bits | True random |

**Real-world consequence:** In 2012, a bug in Debian's OpenSSL caused RSA keys to be generated with only 15 bits of entropy — reducing an "impossible to break" key to one crackable in minutes. Thousands of servers were compromised.

**Rule of thumb:** If it comes from a human or a non-cryptographic PRNG, assume it has far less entropy than its length suggests.`,
      },
      {
        id: 'visualization',
        title: 'Keyspace Visualization',
        content: `Adding a single bit doubles the keyspace:

| Bits | Keyspace | Doubling Effect |
|---|---|---|
| 1 | 2 | — |
| 10 | 1,024 | ×512 |
| 20 | 1,048,576 | ×1,024 |
| 40 | ~10¹² | ×1,000,000,000,000 |
| 128 | ~10³⁸ | (unfathomable) |
| 256 | ~10⁷⁷ | (more than atoms in the universe) |`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Essential key generation rules:',
        keyPoints: [
          'Key space doubles with every additional bit of length.',
          'Entropy is what matters — a long key with low entropy is weak.',
          'Always use a CSPRNG like crypto.getRandomValues().',
          'Never use Math.random() for security-critical values.',
          'Modern recommendations: AES-256, RSA-2048+, ECC-P256+.',
        ],
      },
      {
        id: 'exercise',
        title: 'Checkpoint Question',
        content: 'Test your understanding of random number generators.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You understand key entropy, keyspace scaling, and how to source secure random material in browser applications.

**Next lesson:** IV & Nonce — why encrypting the same message twice must produce different ciphertexts.`,
      },
    ],
    interactiveExercise: {
      question:
        'Which JavaScript API provides cryptographically secure random bytes suitable for keys?',
      instruction: 'Select the secure standard API.',
      inputType: 'choice',
      options: [
        'crypto.getRandomValues()',
        'Math.random()',
        'Date.now()',
        'performance.now()',
      ],
      correctAnswer: 'crypto.getRandomValues()',
      hint: 'It is part of the Web Crypto API standard.',
      explanation:
        "crypto.getRandomValues() connects directly to the operating system's cryptographic entropy pool (/dev/urandom or Windows BCryptGenRandom).",
    },
  },

  // ============================================================
  // LESSON 14 — IV & NONCE
  // ============================================================
  {
    id: 'iv-nonce',
    slug: 'iv-and-nonce',
    order: 14,
    title: 'IV & Nonce',
    category: 'security',
    description:
      'Learn why encrypting the same message twice must never produce the same ciphertext, and why reusing an IV in AES-GCM is catastrophic. Understand the critical role of unique random values in modern encryption.',
    difficulty: 'intermediate',
    estimatedMinutes: 13,
    xpReward: 35,
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
        title: 'Nonce-Disrespecting Adversaries: Practical Forgery Attacks on GCM in TLS',
        author: 'H. Böck, A. Zauner, S. Devlin, J. Somorovsky, P. Jovanovic',
        year: 2016,
        url: 'https://www.usenix.org/conference/woot16/workshop-program/presentation/bock',
        type: 'paper',
      },
    ],
    sections: [
      {
        id: 'introduction',
        title: 'The Danger of Deterministic Encryption',
        content: `Imagine an encryption algorithm that always encrypts the word "YES" into the same ciphertext "X9#f". An eavesdropper watching your traffic would not need to crack the key — they would simply notice the pattern and know when you voted "YES".

This is called **deterministic encryption**, and it is a serious security flaw. Modern ciphers prevent it by requiring an **Initialization Vector (IV)** or **Nonce** (Number used Once).

**Key properties:**
- **Public:** the IV is sent alongside the ciphertext (it doesn't need to be secret)
- **Unique:** each encryption with the same key MUST use a different IV
- **Random or Counter-Based:** random for CBC/CTR, strictly incremental for some protocols

The IV ensures that identical plaintexts encrypt to completely different ciphertexts — protecting against pattern analysis.`,
        keyPoints: [
          'IVs prevent pattern leakage in encryption',
          'IV does NOT need to be secret — but must be unique per encryption',
          'Reusing an IV with the same key breaks confidentiality',
          'In AES-GCM, IV reuse also enables authentication forgery',
        ],
      },
      {
        id: 'concept',
        title: 'The Catastrophic GCM Nonce Reuse Vulnerability',
        content: `In AES-GCM, IV reuse with the same key is one of the most catastrophic cryptographic mistakes possible. It breaks **both** confidentiality and integrity:

**1. Confidentiality Break (Keystream Cancel)**
Given two ciphertexts encrypted with the same key and IV:
- C1 = P1 ⊕ K_stream
- C2 = P2 ⊕ K_stream

XORing them cancels the keystream: C1 ⊕ C2 = P1 ⊕ P2. The attacker now has the XOR of both plaintexts — often enough to recover both via statistical techniques.

**2. Integrity Break (Authentication Forgery)**
GCM's authentication tag uses a secret subkey H derived from the AES key. If two ciphertexts share the same nonce, an attacker can recover H algebraically. Once H is known, they can **forge valid authentication tags for arbitrary messages** — completely defeating GCM's integrity guarantees.

**Real-world incident:** In 2016, the "Nonce-Disrespecting Adversaries" paper found 184 HTTPS servers reusing GCM nonces, completely breaking their TLS security. The fix: always generate a fresh 12-byte IV with crypto.getRandomValues().`,
        codeSnippet: {
          language: 'typescript',
          code: `// ✅ CORRECT AES-GCM pattern:
// 1. Generate a fresh, unique 12-byte IV for EVERY message:
const iv = crypto.getRandomValues(new Uint8Array(12));

// 2. Encrypt with key + unique IV:
const encrypted = await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv, tagLength: 128 },
  key,
  data
);

// 3. Prepend IV to ciphertext (safe to send in the clear):
const transmission = new Uint8Array(iv.length + encrypted.byteLength);
transmission.set(iv, 0);
transmission.set(new Uint8Array(encrypted), iv.length);`,
          caption: 'Every encryption must use a fresh random IV',
        },
      },
      {
        id: 'example',
        title: 'Real-World Analogy',
        content: `Think of an IV like **salting food**: even if two chefs use the exact same base soup recipe (plaintext and key), adding a pinch of salt (unique IV) ensures each pot tastes subtly distinct. A food critic (eavesdropper) cannot tell if two bowls came from the same recipe.

Or think of it like a **postage stamp**: two identical letters sent on different days have different postmarks. The stamp itself doesn't need to be secret — it just needs to be different for each mailing.`,
      },
      {
        id: 'visualization',
        title: 'Fresh Nonce Each Time',
        content: `Same plaintext + same key + different IVs → completely different ciphertexts:

| Scenario | Input | IV | Output |
|---|---|---|---|
| Encryption 1 | "HELLO" | IV_1 | 9a8f2b1c... |
| Encryption 2 | "HELLO" | IV_2 | 3e7c04df... |
| Encryption 3 | "HELLO" | IV_3 | f1b927a5... |

Every ciphertext is distinct. An eavesdropper cannot tell they encode the same message.`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Review IV and Nonce essentials:',
        keyPoints: [
          'An IV ensures identical plaintexts encrypt to distinct ciphertexts.',
          'IVs do not need to be secret, but MUST be unique per encryption.',
          'Never reuse an IV with the same key in AES-GCM or ChaCha20.',
          'GCM nonce reuse breaks BOTH confidentiality and authentication.',
          'Always generate fresh IVs using crypto.getRandomValues().',
        ],
      },
      {
        id: 'exercise',
        title: 'Checkpoint Question',
        content: 'Confirm the confidentiality status of an IV.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You understand why nonces are essential to prevent pattern leakage and why IV reuse in GCM is catastrophic.

**Next lesson:** Authentication & HMAC — protecting ciphertext against tampering.`,
      },
    ],
    interactiveExercise: {
      question:
        'Must an Initialization Vector (IV) be kept secret from eavesdroppers like a private key?',
      instruction: 'Select True or False.',
      inputType: 'choice',
      options: [
        'False: IVs only need to be unique (unpredictable), not secret. They are sent openly with ciphertext.',
        'True: If an attacker sees the IV, all security is permanently lost.',
      ],
      correctAnswer:
        'False: IVs only need to be unique (unpredictable), not secret. They are sent openly with ciphertext.',
      hint: 'Recall how AES-GCM bundles the IV with the ciphertext for transmission.',
      explanation:
        'IVs do not require secrecy; they simply require uniqueness. Transmitting the IV in the clear alongside the ciphertext is standard practice.',
    },
  },

  // ============================================================
  // LESSON 15 — AUTHENTICATION & HMAC
  // ============================================================
  {
    id: 'authentication-mac',
    slug: 'cryptographic-authentication',
    order: 15,
    title: 'Authentication & HMAC',
    category: 'security',
    description:
      'Why encryption without authentication is dangerous, and how HMAC and AEAD ciphers prevent tampering. Learn the mechanism behind signed JWTs, AWS request signatures, and TLS payload integrity.',
    difficulty: 'intermediate',
    estimatedMinutes: 14,
    xpReward: 40,
    references: [
      {
        title: 'RFC 2104: HMAC — Keyed-Hashing for Message Authentication',
        author: 'H. Krawczyk, M. Bellare, R. Canetti',
        year: 1997,
        url: 'https://datatracker.ietf.org/doc/html/rfc2104',
        type: 'standard',
      },
      {
        title:
          'NIST SP 800-38D: Recommendation for Block Cipher Modes of Operation: GCM and GMAC',
        author: 'NIST',
        year: 2007,
        url: 'https://csrc.nist.gov/publications/detail/sp/800-38d/final',
        type: 'standard',
      },
      {
        title: 'Keying Hash Functions for Message Authentication',
        author: 'M. Bellare, R. Canetti, H. Krawczyk',
        year: 1996,
        url: 'https://cseweb.ucsd.edu/~mihir/papers/hmac.html',
        type: 'paper',
      },
    ],
    sections: [
      {
        id: 'introduction',
        title: 'The Myth of Encryption-Only Security',
        content: `A widespread misconception is that encrypting data automatically prevents attackers from modifying it. This is false. Pure unauthenticated ciphers (like AES-CBC without a MAC) are vulnerable to **bit-flipping attacks** and **padding oracle attacks**.

An attacker who cannot decrypt a message may still **tamper** with it. If the ciphertext is encrypted but not authenticated, the modified message decrypts to garbage — but the modification itself might still be meaningful (e.g., flipping a bit in an encrypted "amount" field).

**The solution:** authenticated encryption. Every message should be encrypted **and** authenticated.`,
        keyPoints: [
          'Encryption provides confidentiality; authentication provides integrity',
          'Never rely on encryption alone — always authenticate',
          'HMAC binds a shared secret to a message via hashing',
          'AEAD ciphers (like AES-GCM) combine encryption + authentication',
        ],
      },
      {
        id: 'concept',
        title: 'HMAC and AEAD',
        content: `Two modern approaches to authentication:

**1. HMAC (RFC 2104)** — Hash-based Message Authentication Code

Combines a secret key with a hash function through nested hashing:

HMAC(K, m) = Hash((K ⊕ opad) ∥ Hash((K ⊕ ipad) ∥ m))

- **Fast:** only uses hash functions
- **Secure:** provably secure if the underlying hash is a PRF
- **Widely used:** JWT (HS256), AWS SigV4, TLS PRF

**2. AEAD (Authenticated Encryption with Associated Data)** — e.g., AES-GCM, ChaCha20-Poly1305

Integrates encryption and authentication in a single pass:

- Produces **ciphertext + 16-byte authentication tag**
- If even 1 bit of ciphertext is modified, decryption fails **instantly**
- Modern standard for TLS 1.3, IPsec, SSH

**Rule of thumb:** For new applications, always use AEAD ciphers. For legacy systems or when you need a MAC over unencrypted data, use HMAC.`,
        codeSnippet: {
          language: 'text',
          code: `[Sender] Plaintext ──(AES-GCM Key)──> [Ciphertext + Auth Tag]
                                                │
                                         [Attacker modifies 1 bit]
                                                │
[Receiver] ──(Decrypt Attempt)──> ERROR: "OperationError: integrity check failed"
                                  (Decryption rejected — tampering detected)`,
          caption: 'AEAD detects tampering automatically on decryption',
        },
      },
      {
        id: 'example',
        title: 'Web Tokens (JWT) and API Signatures',
        content: `HMAC powers most modern authentication systems:

| System | Algorithm | What It Protects |
|---|---|---|
| JWT (HS256) | HMAC-SHA256 | Session tokens |
| AWS SigV4 | HMAC-SHA256 | API request authentication |
| TLS PRF | HMAC-SHA256/384 | Session key derivation |
| Stripe Webhooks | HMAC-SHA256 | Webhook payload integrity |
| GitHub Webhooks | HMAC-SHA256 | CI/CD event verification |

**Example: JWT signing flow**
1. Server creates JWT with header + payload
2. Computes HMAC-SHA256(secret_key, header + "." + payload)
3. Sends header.payload.signature to the client
4. On next request, server recomputes HMAC and compares
5. If a hacker tampers with the payload (e.g., changes user ID), the HMAC fails → request rejected

**Critical detail:** Always use **constant-time comparison** when checking HMACs to prevent timing attacks.`,
      },
      {
        id: 'visualization',
        title: 'AEAD Pipeline',
        content: `Authentication tag guarantees integrity:

| Step | Input | Output |
|---|---|---|
| Encryption | Plaintext + Key + IV | Ciphertext + Auth Tag (16 bytes) |
| Transmission | Ciphertext + Auth Tag | (sent together) |
| Decryption | Ciphertext + Auth Tag + Key + IV | Plaintext (only if tag validates) |
| Tampering | Modified ciphertext + Tag | ERROR — decryption rejected |`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Review authentication fundamentals:',
        keyPoints: [
          'Encryption without authentication is dangerous — always authenticate.',
          'Always use AEAD ciphers (AES-GCM or ChaCha20-Poly1305).',
          'HMAC provides message authenticity using a shared symmetric key.',
          'Use constant-time comparison for HMAC verification (avoid timing attacks).',
          'Real systems (JWT, AWS, TLS, Stripe) rely on HMAC for authentication.',
        ],
      },
      {
        id: 'exercise',
        title: 'Checkpoint Question',
        content: 'Confirm the acronym meaning of AEAD.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You understand why authenticated encryption (AEAD) is mandated in modern cryptographic engineering.

**Next lesson:** Key Exchange Protocols — how Diffie-Hellman lets two strangers agree on a shared secret.`,
      },
    ],
    interactiveExercise: {
      question: 'What does the acronym AEAD stand for in modern cryptography?',
      instruction: 'Select the correct definition.',
      inputType: 'choice',
      options: [
        'Authenticated Encryption with Associated Data',
        'Asymmetric Encryption Algorithm Design',
        'Automated Entropy Authentication Digest',
        'Advanced Encoding for Application Data',
      ],
      correctAnswer: 'Authenticated Encryption with Associated Data',
      hint: 'It describes ciphers that simultaneously encrypt and authenticate.',
      explanation:
        'AEAD stands for Authenticated Encryption with Associated Data, modern ciphers like AES-GCM that provide both secrecy and tamper-proofing.',
    },
  },

  // ============================================================
  // LESSON 16 — KEY EXCHANGE PROTOCOLS
  // ============================================================
  {
    id: 'key-exchange',
    slug: 'key-exchange-protocols',
    order: 16,
    title: 'Key Exchange Protocols (DH, ECDH)',
    category: 'mechanisms',
    description:
      'Discover how two parties who have never met can agree on a shared secret key over an open, untrusted network. Learn the Diffie-Hellman protocol, its elliptic curve variant (ECDH), and why forward secrecy matters.',
    difficulty: 'intermediate',
    estimatedMinutes: 15,
    xpReward: 50,
    references: [
      {
        title: 'New Directions in Cryptography (Diffie-Hellman, 1976)',
        author: 'W. Diffie, M. Hellman',
        year: 1976,
        url: 'https://ieeexplore.ieee.org/document/1055638',
        type: 'paper',
      },
      {
        title: 'NIST SP 800-56A Rev. 3: Recommendation for Pair-Wise Key-Establishment Schemes Using Discrete Logarithm Cryptography',
        author: 'NIST',
        year: 2018,
        url: 'https://csrc.nist.gov/publications/detail/sp/800-56a/rev-3/final',
        type: 'standard',
      },
      {
        title: 'RFC 7748: Elliptic Curves for Security (X25519, X448)',
        author: 'A. Langley, M. Hamburg, S. Turner',
        year: 2016,
        url: 'https://datatracker.ietf.org/doc/html/rfc7748',
        type: 'standard',
      },
    ],
    sections: [
      {
        id: 'introduction',
        title: 'The Stranger Problem',
        content: `Consider this problem: Alice and Bob have never met. They want to agree on a secret encryption key. Eve can see every message they exchange. **How do they agree on a secret without ever sending it?**

Before 1976, this was considered impossible. You needed a secure channel (in-person meeting, trusted courier) to exchange keys. The Diffie-Hellman protocol (published in 1976) solved it — and changed the world.

**Key insight:** Alice and Bob can exchange values publicly, and from those public values each can compute a shared secret that Eve cannot derive — even though she saw everything.`,
        keyPoints: [
          'Diffie-Hellman solves secure key agreement over an open channel',
          'Two parties compute the same shared secret independently',
          'An eavesdropper who sees all messages cannot derive the secret',
          'Foundation of every secure HTTPS, SSH, and VPN connection today',
        ],
      },
      {
        id: 'concept',
        title: 'The Diffie-Hellman Protocol',
        content: `The protocol uses modular exponentiation in a finite field:

**Public parameters:**
- Large prime p
- Generator g (a primitive root modulo p)

**Protocol:**
1. Alice picks a random private key a, computes public value A = g^a mod p
2. Bob picks a random private key b, computes public value B = g^b mod p
3. They exchange A and B publicly
4. Alice computes: K = B^a mod p = (g^b)^a = g^ab mod p
5. Bob computes: K = A^b mod p = (g^a)^b = g^ab mod p

Both arrive at the **same shared secret** K = g^ab mod p. Eve sees p, g, A = g^a, B = g^b — but computing g^ab from these requires solving the **Discrete Logarithm Problem**, which is computationally infeasible for well-chosen parameters.

**Elliptic Curve Diffie-Hellman (ECDH)** replaces modular exponentiation with scalar multiplication on an elliptic curve — same idea, but 12× smaller keys and much faster.`,
        codeSnippet: {
          language: 'typescript',
          code: `// ECDH key exchange using P-256 (Web Crypto API)
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

// Alice derives the shared secret with her private key + Bob's public key
const aliceSecret = await crypto.subtle.deriveBits(
  { name: 'ECDH', public: bobKeyPair.publicKey },
  aliceKeyPair.privateKey,
  256
);

// Bob derives the SAME shared secret with his private key + Alice's public key
const bobSecret = await crypto.subtle.deriveBits(
  { name: 'ECDH', public: aliceKeyPair.publicKey },
  bobKeyPair.privateKey,
  256
);
// aliceSecret === bobSecret — now use as an AES key!`,
          caption: 'ECDH: both parties independently compute the same shared secret',
        },
      },
      {
        id: 'example',
        title: 'Forward Secrecy and Modern TLS 1.3',
        content: `Early TLS versions used RSA key exchange: the client encrypted a session key with the server's RSA public key. This had a fatal flaw — if the server's long-term private key was ever stolen, all past recorded sessions could be decrypted.

**Modern TLS 1.3 mandates ephemeral key exchange** (ECDHE — Ephemeral ECDH). Here's why it matters:

| Aspect | RSA Key Exchange (Deprecated) | ECDHE (Modern) |
|---|---|---|
| Server private key stolen | All past sessions compromised | Past sessions remain secure |
| Session key source | Encrypted with RSA | Derived via ephemeral ECDH |
| Forward secrecy | ❌ No | ✅ Yes |
| Session key storage | Server may cache | Destroyed after use |

**Forward secrecy** means: even if the server's long-term key is compromised tomorrow, session keys from yesterday are already destroyed and cannot be recovered.

**Real-world impact:** HTTPS sites that support TLS 1.3 use ECDHE by default. Signalling servers like Signal, WhatsApp, and Wire all use ECDHE-based ratchets for messaging forward secrecy.`,
      },
      {
        id: 'visualization',
        title: 'Diffie-Hellman Exchange',
        content: `Public exchange, private computation:

| Step | Alice | Public | Bob |
|---|---|---|---|
| 1 | Picks private a | — | Picks private b |
| 2 | Computes A = g^a | → sends A → | Receives A |
| 3 | Receives B | ← sends B ← | Computes B = g^b |
| 4 | Computes K = B^a = g^ab | — | Computes K = A^b = g^ab |

Both end up with the same secret K — but Eve cannot compute it from A, B, g, p alone.`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Key exchange fundamentals:',
        keyPoints: [
          'Diffie-Hellman lets two strangers agree on a secret key over an open network.',
          'Security relies on the Discrete Logarithm Problem.',
          'ECDH uses elliptic curves — 12× smaller keys, much faster.',
          'Modern TLS 1.3 mandates ephemeral ECDHE for forward secrecy.',
          'Forward secrecy protects past sessions even if long-term keys leak.',
        ],
      },
      {
        id: 'exercise',
        title: 'Checkpoint',
        content: 'Test your understanding of key exchange.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You understand how Diffie-Hellman and ECDH solve the key distribution problem — the foundation of every secure internet connection.

**Next lesson:** Digital Certificates & PKI — how browsers know they're really talking to your bank.`,
      },
    ],
    interactiveExercise: {
      question:
        'What critical security property does modern TLS 1.3 gain by using ephemeral ECDHE key exchange instead of static RSA?',
      instruction: 'Select the correct property.',
      inputType: 'choice',
      options: [
        'Forward secrecy — past sessions stay secure even if the long-term key leaks',
        'Faster encryption of bulk data',
        'Smaller TLS certificate sizes',
        'Better compatibility with old browsers',
      ],
      correctAnswer:
        'Forward secrecy — past sessions stay secure even if the long-term key leaks',
      hint: 'Ephemeral keys are destroyed after each session.',
      explanation:
        "Ephemeral ECDHE generates a fresh key pair per session and destroys it afterward. This provides forward secrecy: compromising the server's long-term key tomorrow does not expose today's session keys.",
    },
  },

  // ============================================================
  // LESSON 17 — DIGITAL CERTIFICATES & PKI
  // ============================================================
  {
    id: 'certificates-pki',
    slug: 'certificates-and-pki',
    order: 17,
    title: 'Digital Certificates & PKI',
    category: 'mechanisms',
    description:
      'How does your browser know it is really talking to your bank, and not an attacker? Discover X.509 certificates, Certificate Authorities, the chain of trust, and how TLS establishes trust across the open internet.',
    difficulty: 'intermediate',
    estimatedMinutes: 14,
    xpReward: 45,
    references: [
      {
        title: 'RFC 5280: Internet X.509 Public Key Infrastructure Certificate',
        author: 'D. Cooper, S. Santesson, S. Farrell, S. Boeyen, R. Housley, W. Polk',
        year: 2008,
        url: 'https://datatracker.ietf.org/doc/html/rfc5280',
        type: 'standard',
      },
      {
        title: 'NIST SP 800-32: Introduction to Public Key Technology and the Federal PKI Infrastructure',
        author: 'NIST',
        year: 2001,
        url: 'https://csrc.nist.gov/publications/detail/sp/800-32/final',
        type: 'standard',
      },
    ],
    sections: [
      {
        id: 'introduction',
        title: 'Trust in an Untrusted Network',
        content: `When you visit your bank's website, your browser performs a cryptographic handshake. But how does it know the server on the other end is really your bank — and not an attacker who intercepted your DNS request?

**The answer: digital certificates and Public Key Infrastructure (PKI).**

A digital certificate is a cryptographically signed document that binds a public key to an identity. When your browser sees a certificate for bank.com, it verifies that the certificate was signed by a trusted **Certificate Authority (CA)** — like Let's Encrypt, DigiCert, or GlobalSign. If the signature is valid, the browser knows the public key truly belongs to bank.com.

Without PKI, encrypted HTTPS would be useless — you would have no way to verify who you were talking to.`,
        keyPoints: [
          'Certificates bind public keys to identities (domain names)',
          'Signed by trusted Certificate Authorities (CAs)',
          'Browsers ship with a built-in list of trusted CA root certificates',
          'Solves the "man-in-the-middle" problem for public-key crypto',
        ],
      },
      {
        id: 'concept',
        title: 'The Chain of Trust',
        content: `Trust in TLS is hierarchical, anchored by CAs:

**Three levels of certificates:**

1. **Root Certificate** (offline, trusted implicitly)
   - Owned by the CA (DigiCert, Let's Encrypt)
   - Pre-installed in your browser/OS trust store
   - Never used directly to sign end-user certificates

2. **Intermediate Certificate** (online, signed by root)
   - Issued by the root CA to a subsidiary
   - Signs the actual server certificates
   - Provides defense-in-depth (if intermediate is compromised, root can revoke it)

3. **Leaf / End-Entity Certificate** (the website's certificate)
   - Issued to a specific domain (e.g., bank.com)
   - Contains the website's public key
   - Used by the TLS handshake

**How verification works:**
- Browser receives leaf cert + intermediate cert
- Verifies leaf is signed by intermediate
- Verifies intermediate is signed by a trusted root (in trust store)
- If chain verifies and domain matches, connection proceeds

If any link is broken (expired, revoked, invalid signature), the browser rejects the connection with a warning.`,
        codeSnippet: {
          language: 'text',
          code: `Certificate Chain for bank.com:

  ┌─────────────────────────────┐
  │ Root CA (DigiCert Global)   │  ← Pre-installed in browser
  │ Self-signed, offline        │
  └─────────────┬───────────────┘
                │ signs
  ┌─────────────▼───────────────┐
  │ Intermediate CA             │  ← Sent by server during handshake
  │ DigiCert TLS RSA SHA256     │
  └─────────────┬───────────────┘
                │ signs
  ┌─────────────▼───────────────┐
  │ Leaf Cert for bank.com      │  ← Contains bank.com's public key
  │ Valid: 2024-01-01 to 2025-01-01 │
  └─────────────────────────────┘

  Browser verifies each signature up the chain.`,
          caption: 'Chain of trust: root → intermediate → leaf',
        },
      },
      {
        id: 'example',
        title: 'What Browsers Actually Check',
        content: `When a TLS connection is established, browsers perform rigorous validation:

| Check | What's Verified |
|---|---|
| Signature chain | Each cert is signed by the next one up |
| Root trust | Top of chain is in browser's trust store |
| Domain match | Certificate's CN or SAN contains the requested domain |
| Expiry | Current date is within valid range |
| Revocation | Certificate not revoked (via CRL or OCSP) |
| Key usage | Certificate allowed for TLS server authentication |
| Algorithm strength | No weak hashes (MD5, SHA-1) or small keys |

**Real-world failures:**
- In 2011, DigiNotar (a Dutch CA) was compromised, and attackers issued fake certificates for *.google.com. Aftermath: DigiNotar went bankrupt, browsers removed their root.
- In 2017, Symantec issued improper certificates — browsers distrusted their entire root, forcing Google to spin up a new CA.

PKI is a **socio-technical system** — not just crypto. Trust ultimately rests on CAs being responsible.`,
      },
      {
        id: 'visualization',
        title: 'TLS Certificate Validation Flow',
        content: `From browser request to trusted connection:

| Step | Action | Result |
|---|---|---|
| 1 | Browser connects to bank.com | Server presents leaf + intermediate certs |
| 2 | Browser validates signature chain | Leaf signed by intermediate, intermediate by root |
| 3 | Browser checks root trust | Root CA in browser's trust store |
| 4 | Browser checks domain + expiry | Cert covers bank.com, not expired |
| 5 | Browser checks revocation | Cert not revoked |
| 6 | Connection established | Encrypted channel with authenticated server |`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'PKI essentials:',
        keyPoints: [
          'Certificates bind public keys to real-world identities.',
          'Trust is anchored by Certificate Authorities (CAs).',
          'Verification uses a chain of trust (root → intermediate → leaf).',
          'Browsers ship with a pre-installed trust store of CA roots.',
          'PKI solves the man-in-the-middle problem for public-key crypto.',
        ],
      },
      {
        id: 'exercise',
        title: 'Checkpoint',
        content: 'Test your understanding of certificate trust.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You understand how X.509 certificates and PKI establish trust across the open internet — the mechanism behind the padlock icon.

**Next lesson:** Password Storage & Slow Hashing — the critical difference between SHA-256 and bcrypt.`,
      },
    ],
    interactiveExercise: {
      question:
        'What ultimately anchors the trust of an X.509 certificate in your browser?',
      instruction: 'Select the correct trust anchor.',
      inputType: 'choice',
      options: [
        "A pre-installed root CA certificate in the browser's trust store",
        "The website's own self-signed certificate",
        "The length of the server's RSA key",
        'The TLS version used during the handshake',
      ],
      correctAnswer:
        "A pre-installed root CA certificate in the browser's trust store",
      hint: 'The trust chain must terminate at a CA the browser already trusts.',
      explanation:
        'X.509 trust is hierarchical: the leaf certificate chains up through intermediate certificates to a root CA certificate that ships pre-installed in your browser or OS trust store.',
    },
  },

  // ============================================================
  // LESSON 18 — PASSWORD STORAGE & SLOW HASHING
  // ============================================================
  {
    id: 'password-storage',
    slug: 'password-storage',
    order: 18,
    title: 'Password Storage & Slow Hashing',
    category: 'security',
    description:
      'Why SHA-256 is the WRONG tool for storing passwords, and how bcrypt, scrypt, and Argon2 make brute-force attacks infeasibly expensive. Learn the critical role of salting and password hashing functions.',
    difficulty: 'intermediate',
    estimatedMinutes: 13,
    xpReward: 45,
    references: [
      {
        title: 'OWASP Password Storage Cheat Sheet',
        author: 'OWASP Foundation',
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html',
        type: 'documentation',
      },
      {
        title: 'RFC 9106: Argon2 Memory-Hard Function for Password Hashing',
        author: 'A. Biryukov, D. Dinu, D. Khovratovich, S. Josefsson',
        year: 2021,
        url: 'https://datatracker.ietf.org/doc/html/rfc9106',
        type: 'standard',
      },
      {
        title: 'NIST SP 800-63B: Digital Identity Guidelines — Authentication and Lifecycle Management',
        author: 'NIST',
        year: 2017,
        url: 'https://pages.nist.gov/800-63-3/sp800-63b.html',
        type: 'standard',
      },
    ],
    sections: [
      {
        id: 'introduction',
        title: 'Why Passwords Need Special Hashing',
        content: `When a website stores your password, it should never store the plaintext. It should store a **hash** of the password — so that even if the database is stolen, attackers cannot immediately recover the original password.

But not all hashes are equal. General-purpose hashes like **SHA-256** are designed to be **fast** — billions of hashes per second on modern GPUs. This makes them **terrible for password storage**:

- A modern GPU can try **billions of SHA-256 guesses per second**.
- An 8-character password could be cracked in minutes.
- A leaked database with millions of SHA-256 password hashes would fall in hours.

**The solution:** password hashing functions (PHFs) specifically designed to be **slow and resource-intensive** — like bcrypt, scrypt, and Argon2.`,
        keyPoints: [
          'Never store plaintext passwords — always hash them.',
          'General-purpose hashes (SHA-256) are too fast for passwords.',
          'Use dedicated password hashing functions: bcrypt, scrypt, Argon2.',
          'Always add a per-user random salt.',
        ],
      },
      {
        id: 'concept',
        title: 'Password Hashing Functions (PHFs)',
        content: `PHFs are deliberately designed to be computationally expensive. They make each brute-force guess cost significantly more time or memory:

| Function | Year | Approach | Strength |
|---|---|---|---|
| PBKDF2 | 2000 | Iterated HMAC | Weak — GPU-friendly |
| bcrypt | 1999 | Blowfish-based, tunable cost | Strong — moderate memory |
| scrypt | 2009 | Memory-hard | Very strong |
| Argon2id | 2015 | Memory + time + parallelism | Best in class |

**Key parameters:**

| Parameter | Purpose |
|---|---|
| **Cost / Iterations** | How many times to repeat the computation |
| **Memory** | How much RAM the function requires |
| **Parallelism** | How many threads can run in parallel |

**Argon2id** is the current recommendation (winner of the 2015 Password Hashing Competition). It combines memory-hard and time-hard properties, making GPU and ASIC attacks expensive.

**Modern parameters (2024):**
- Argon2id: 64 MB memory, 3 iterations, parallelism 4
- bcrypt: cost factor 12+ (2^12 = 4096 iterations)
- scrypt: N=2^17, r=8, p=1

**Salting:** Every password hash must use a unique random salt. This prevents:
- Rainbow table attacks (precomputed hash lookup)
- Attacking multiple users at once (each hash requires separate computation)`,
        codeSnippet: {
          language: 'typescript',
          code: `// ❌ WRONG — SHA-256 is too fast for passwords:
const badHash = await crypto.subtle.digest(
  'SHA-256',
  new TextEncoder().encode(password)
);
// GPU can test billions of these per second.

// ✅ CORRECT — Use a dedicated PHF (Argon2id via a library):
import argon2 from 'argon2';

// Hash with automatic salt generation + tuned parameters:
const hash = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 65536,   // 64 MB
  timeCost: 3,         // 3 iterations
  parallelism: 4,
});

// Verify (constant-time comparison internally):
const valid = await argon2.verify(hash, password);`,
          caption: 'Use Argon2id, not SHA-256, for password storage',
        },
      },
      {
        id: 'example',
        title: 'The 2012 LinkedIn Breach — A Cautionary Tale',
        content: `In 2012, LinkedIn suffered a breach that exposed **6.5 million unsalted SHA-1 password hashes**. The consequences were severe:

- **SHA-1 was already broken** (theoretical collisions, GPU-friendly)
- **No salting** — identical passwords produced identical hashes
- Attackers could attack all 6.5 million passwords simultaneously
- Within hours, 60%+ of the passwords were recovered

**What went wrong:**
1. Used SHA-1, not a password hashing function
2. No salt — rainbow table attacks were trivial
3. No cost factor — billions of guesses per second

**What they should have done:**
1. Use bcrypt (available since 1999) or Argon2 (available since 2015)
2. Salt every hash uniquely
3. Tune cost factor so each hash takes ~250ms

**Modern incident (2023):** 23andMe was breached. Credential-stuffing attacks exploited password reuse. Had the site used strong PHFs and enforced MFA, the impact would have been much smaller.

**Key lesson:** Password hashing is not a place for speed. Slow is a feature.`,
      },
      {
        id: 'visualization',
        title: 'Hash Speed Comparison',
        content: `Time to compute a single hash (approximate, modern GPU):

| Algorithm | Time per Hash | Hashes per Second | Year to Crack 8-char |
|---|---|---|---|
| MD5 | 0.1 ns | ~10 billion/s | Seconds |
| SHA-256 | 1 ns | ~1 billion/s | Minutes |
| bcrypt (cost 12) | 250 ms | 4 / second | Centuries |
| scrypt (N=2^17) | 500 ms | 2 / second | Millennia |
| Argon2id (64MB) | 300 ms | 3 / second | Millennia |

The **slower** the hash function, the more expensive each brute-force attempt becomes for the attacker.`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Password storage essentials:',
        keyPoints: [
          'Never store plaintext passwords — always hash.',
          'SHA-256 is TOO FAST for password storage — use bcrypt, scrypt, or Argon2.',
          'Always salt each password with a unique random value.',
          'Tune cost parameters so each hash takes ~250 ms.',
          'Argon2id is the current industry recommendation.',
        ],
      },
      {
        id: 'exercise',
        title: 'Final Checkpoint',
        content: 'Test your understanding of password hashing.',
      },
      {
        id: 'summary',
        title: 'Congratulations!',
        content: `You have completed the **intermediate track** (10 lessons). You now understand:

- Symmetric & asymmetric cryptography mechanics
- Hash functions and their properties
- Digital signatures and non-repudiation
- Cryptographic key generation and entropy
- IVs, Nonces, and why uniqueness matters
- Authentication, HMAC, and AEAD
- Key exchange protocols (DH, ECDH) and forward secrecy
- X.509 certificates and Public Key Infrastructure
- Password storage and slow hashing functions

You are now ready for the **advanced track** — deep dives into specific algorithms, cryptographic attacks, and post-quantum cryptography.`,
      },
    ],
    interactiveExercise: {
      question:
        'Why should a dedicated password hashing function like Argon2id be used instead of SHA-256 for storing passwords?',
      instruction: 'Select the correct reason.',
      inputType: 'choice',
      options: [
        'Argon2id is deliberately slow and memory-hard, making brute-force attacks impractical',
        'Argon2id produces shorter hashes that save storage space',
        'SHA-256 is vulnerable to quantum computers but Argon2id is not',
        'SHA-256 cannot handle non-ASCII characters',
      ],
      correctAnswer:
        'Argon2id is deliberately slow and memory-hard, making brute-force attacks impractical',
      hint: 'General-purpose hashes are optimized for speed; password hashes are optimized for slowness.',
      explanation:
        'SHA-256 is optimized for speed (billions of hashes/second on GPUs), which is terrible for passwords. Argon2id is deliberately slow and memory-hard, making each guess cost ~250ms — turning a brute-force attack from hours into centuries.',
    },
  },
];