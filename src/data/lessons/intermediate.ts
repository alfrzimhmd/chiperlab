import { Lesson } from '../../types/lesson';

/**
 * Intermediate Lessons — Order 5, 6, 7, 8, 9, 10, 11
 *
 * Covers mechanism internals, key management, and security primitives.
 * Prerequisite: complete the beginner track first.
 */
export const INTERMEDIATE_LESSONS: Lesson[] = [
  // ============================================================
  // LESSON 5 — SYMMETRIC CRYPTOGRAPHY
  // ============================================================
  {
    id: 'symmetric-crypto',
    slug: 'symmetric-cryptography',
    order: 5,
    title: 'Symmetric Cryptography',
    category: 'mechanisms',
    description:
      'Master shared-key encryption: high-throughput ciphers like AES, stream vs block ciphers, and key distribution.',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
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
        content: `In symmetric cryptography, both the sender and receiver share the **exact same secret key** for both encryption and decryption. If Alice wants to send a secret message to Bob, both Alice and Bob must possess copy of the identical secret key $K$.`,
        keyPoints: [
          'Extremely fast and computationally efficient (hardware accelerated on modern CPUs)',
          'Standard choice for bulk data encryption (hard drives, TLS packet payload, VPN tunnels)',
          'Suffers from the Key Distribution Problem: how do parties share the key initially?',
        ],
      },
      {
        id: 'concept',
        title: 'Block Ciphers vs Stream Ciphers',
        content: `Symmetric ciphers fall into two broad structural paradigms:

1. **Block Ciphers:** Group plaintext into fixed-size chunks (e.g. AES uses 128-bit blocks = 16 bytes). Blocks are repeatedly processed through rounds of substitution, permutation, and key mixing (SPN - Substitution-Permutation Network).
2. **Stream Ciphers:** Generate a continuous pseudorandom keystream combined bit-by-bit with the plaintext using XOR (e.g. ChaCha20).`,
        codeSnippet: {
          language: 'text',
          code: `Block Cipher Processing (AES-GCM):
Plaintext Block (128 bits) ─┐
                           ├─> [Rounds of SubBytes, ShiftRows, MixColumns] ─> Ciphertext (128 bits)
Secret Key (256 bits)    ──┘`,
        },
      },
      {
        id: 'example',
        title: 'The Key Distribution Dilemma',
        content: `If $N$ people in an organization all need to communicate securely with each other using symmetric encryption, the number of distinct keys required grows quadratically:
$$\\text{Keys} = \\frac{N(N - 1)}{2}$$
For 1,000 users, that requires 499,500 unique secret keys! This dilemma inspired the invention of asymmetric public-key cryptography.`,
      },
      {
        id: 'visualization',
        title: 'Symmetric Flow',
        content: `Alice [Key K] ──Encrypt──> Ciphertext ──Network──> Ciphertext ──Decrypt──> Bob [Same Key K]`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Review symmetric strengths and challenges:',
        keyPoints: [
          'Symmetric ciphers use the same key for encryption and decryption.',
          'AES-256 is the global gold standard for symmetric bulk encryption.',
          'Very fast, but requires a secure channel to share the secret key beforehand.',
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
        content:
          'You understand symmetric ciphers, AES blocks, and why hybrid cryptography combines symmetric speed with asymmetric key exchange.',
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
  // LESSON 6 — ASYMMETRIC CRYPTOGRAPHY
  // ============================================================
  {
    id: 'asymmetric-crypto',
    slug: 'asymmetric-cryptography',
    order: 6,
    title: 'Asymmetric Cryptography',
    category: 'mechanisms',
    description:
      'Discover public-key cryptography: how mathematically linked key pairs allow strangers to communicate securely.',
    difficulty: 'intermediate',
    estimatedMinutes: 14,
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
        content: `Invented in the 1970s by Whitfield Diffie, Martin Hellman, and Ralph Merkle (along with Ron Rivest, Adi Shamir, and Leonard Adleman), Asymmetric Cryptography solved the key distribution problem forever.

Instead of a single shared secret, every participant has a **Key Pair**:
1. **Public Key:** Freely published to the world. Anyone can use it to encrypt messages intended for you.
2. **Private Key:** Kept strictly secret by you alone. Only this key can decrypt messages encrypted with your Public Key.`,
        keyPoints: [
          'Allows two entities who have never met to establish secure communication over an open network',
          'Relies on computationally "hard" one-way mathematical problems (integer factorization, discrete logarithms, elliptic curves)',
          'Slower than symmetric encryption; typically used to negotiate session keys or sign messages',
        ],
      },
      {
        id: 'concept',
        title: 'Mathematical Foundations: Trapdoor Functions',
        content: `Asymmetric encryption relies on **Trapdoor Functions**: mathematical operations that are straightforward to compute in one direction, but practically impossible to reverse without a specific piece of secret information (the trapdoor).
- **RSA:** Relies on the difficulty of factoring the product of two huge prime numbers ($N = p \\times q$).
- **ECC (Elliptic Curve Cryptography):** Relies on the discrete logarithm problem on elliptic curves, providing equal security to RSA with drastically smaller keys.`,
        codeSnippet: {
          language: 'text',
          code: `Alice wants to send a secret to Bob:
1. Alice obtains Bob's Public Key (from DNS, website, or directory)
2. Alice encrypts: C = Encrypt(Bob_Public_Key, Message)
3. Alice transmits C across the open internet
4. Bob decrypts: Message = Decrypt(Bob_Private_Key, C)
* Eve cannot decrypt because she does NOT possess Bob's Private Key!`,
        },
      },
      {
        id: 'example',
        title: 'Hybrid Cryptography: The Best of Both Worlds',
        content: `Because asymmetric ciphers are roughly 1,000x slower than symmetric ciphers, real protocols (like TLS and SSH) use **Hybrid Cryptography**:
1. Use Asymmetric Cryptography (e.g. RSA or ECDH) for the handshake to safely agree on a random temporary session key.
2. Switch immediately to Symmetric Cryptography (AES-GCM) for the bulk data transfer using that session key.`,
      },
      {
        id: 'visualization',
        title: 'Public Key Encryption Flow',
        content: `Sender ──[Encrypt with Bob's PUBLIC Key]──> Ciphertext ──[Decrypt with Bob's PRIVATE Key]──> Bob`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Core takeaways for public-key cryptography:',
        keyPoints: [
          'Every participant has a Public Key (distributed openly) and a Private Key (kept secret).',
          'What is encrypted with the Public Key can only be decrypted by the Private Key.',
          'Enables secure communication without prior shared secrets.',
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
        content:
          'You have mastered asymmetric cryptography and understand how public/private keys enable worldwide secure commerce.',
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
  // LESSON 7 — HASHING FOUNDATIONS
  // ============================================================
  {
    id: 'hashing-foundations',
    slug: 'cryptographic-hashing',
    order: 7,
    title: 'Hashing & The Avalanche Effect',
    category: 'mechanisms',
    description:
      'Explore one-way mathematical digests, collision resistance, and why a single flipped bit scrambles the entire hash.',
    difficulty: 'intermediate',
    estimatedMinutes: 11,
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
        content: `A cryptographic hash function is a mathematical algorithm that takes an arbitrary-length block of input data and produces a fixed-size string of bytes (called a **hash**, **digest**, or **fingerprint**).

Crucially, hashing is strictly **ONE-WAY**: there is no secret key and no decryption function. You cannot "un-hash" a digest back to its input.`,
        keyPoints: [
          'Deterministic: The exact same input will always yield the exact same hash output',
          'Fixed output length: A 1-word input and a 50GB file both produce a 256-bit hash in SHA-256',
          'Irreversible: Computationally impossible to deduce input from output',
        ],
      },
      {
        id: 'concept',
        title: 'Properties of Secure Hash Functions',
        content: `To be deemed cryptographically secure, a hash function must satisfy three essential properties:

1. **Pre-image Resistance (One-Way):** Given a hash $H$, it should be computationally infeasible to find any message $m$ such that $\\text{hash}(m) = H$.
2. **Second Pre-image Resistance (Weak Collision Resistance):** Given an input $m_1$, it should be infeasible to find a different input $m_2$ such that $\\text{hash}(m_1) = \\text{hash}(m_2)$.
3. **Collision Resistance (Strong Collision Resistance):** It should be infeasible to find *any* two arbitrary distinct inputs $m_1 \\neq m_2$ that produce identical hashes.`,
        codeSnippet: {
          language: 'bash',
          code: `# The Avalanche Effect in SHA-256:
$ echo -n "The quick brown fox jumps over the lazy dog" | sha256sum
d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592

# Change a single character (dog -> cog):
$ echo -n "The quick brown fox jumps over the lazy cog" | sha256sum
e4c4dcf0a43f535d90e99dadbc58b45a981c4e66024f31ac016436d60d3d0bcb
# Over 50% of bits completely flipped!`,
          caption: 'Changing 1 letter flips half the hash bits due to the avalanche effect',
        },
      },
      {
        id: 'example',
        title: 'Common Cryptographic Hash Algorithms',
        content: `- **SHA-256 / SHA-512 (SHA-2 Family):** Standard everywhere; used in Bitcoin, TLS certificates, software verification.
- **SHA-3 (Keccak):** Newer sponge-construction standard.
- **Deprecated / Broken:** MD5 and SHA-1 (practical collision attacks demonstrated in 2004 and 2017 respectively; DO NOT USE for security).`,
      },
      {
        id: 'visualization',
        title: 'Hashing Pipeline',
        content: `Any Length Input (1 byte to Gigabytes) ──[One-Way Hash Engine]──> Fixed 256-bit Hex Digest`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Key concepts to remember:',
        keyPoints: [
          'Hashing is strictly one-way and cannot be inverted or decrypted.',
          'The avalanche effect ensures small input changes cause massive output shifts.',
          'Never use broken algorithms like MD5 or SHA-1 for security.',
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
        content:
          'You understand cryptographic digests, the avalanche effect, and collision resistance requirements.',
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
  // LESSON 8 — DIGITAL SIGNATURES
  // ============================================================
  {
    id: 'digital-signature',
    slug: 'digital-signatures',
    order: 8,
    title: 'Digital Signatures',
    category: 'mechanisms',
    description:
      'Understand how public-key cryptography and hashing combine to guarantee authenticity, integrity, and non-repudiation.',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
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
        content: `In the physical world, handwritten signatures and wax seals have been used for millennia to ratify contracts. In the digital world, a **Digital Signature** provides mathematical proof of authenticity, message integrity, and non-repudiation that cannot be forged.`,
        keyPoints: [
          'Guarantees the message originated from the claimed sender',
          'Guarantees the message has not been altered in transit',
          'The signer cannot later deny having signed the message (non-repudiation)',
        ],
      },
      {
        id: 'concept',
        title: 'How Digital Signatures Work',
        content: `A digital signature inverts the key roles of public-key encryption:

1. **Signing (Sender - Alice):**
   - Alice computes the cryptographic hash of the document: $H = \\text{SHA-256}(\\text{Doc})$.
   - Alice encrypts the hash using her **PRIVATE Key**: $\\text{Sig} = \\text{Encrypt}(\\text{Alice\\_PrivKey}, H)$.
   - Alice attaches the signature $\\text{Sig}$ to the document.

2. **Verification (Receiver - Bob):**
   - Bob receives the document and signature.
   - Bob computes $H_{\\text{computed}} = \\text{SHA-256}(\\text{Doc})$.
   - Bob decrypts the signature using Alice's **PUBLIC Key**: $H_{\\text{extracted}} = \\text{Decrypt}(\\text{Alice\\_PubKey}, \\text{Sig})$.
   - If $H_{\\text{computed}} === H_{\\text{extracted}}$, the signature is valid!`,
        codeSnippet: {
          language: 'typescript',
          code: `// Verification logic:
const messageHash = await sha256(message);
const signatureValid = await verify(alicePublicKey, signature, messageHash);

if (signatureValid) {
  console.log("Document is 100% authentic and untampered!");
}`,
        },
      },
      {
        id: 'example',
        title: 'Everyday Use Cases',
        content: `- **Operating System Updates:** Windows, macOS, and Linux packages are digitally signed so malicious updates are rejected.
- **Git Commits:** Developers sign commits with GPG or SSH keys.
- **Cryptocurrency:** Bitcoin and Ethereum transactions are digital signatures authorising balance transfers.`,
      },
      {
        id: 'visualization',
        title: 'Signing & Verification Cycle',
        content: `Document → Hash → [Encrypt with Signer's PRIVATE Key] → Signature\nSignature → [Decrypt with Signer's PUBLIC Key] → Extracted Hash === Computed Document Hash`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Review digital signature principles:',
        keyPoints: [
          "Signing uses the sender's Private Key; verification uses the sender's Public Key.",
          'Signatures operate on the hash of the data, not the whole file directly.',
          'Provides both integrity and non-repudiation.',
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
        content:
          'You understand digital signature mechanics and how they safeguard modern software distribution and financial networks.',
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
  // LESSON 9 — CRYPTOGRAPHIC KEYS & ENTROPY
  // ============================================================
  {
    id: 'crypto-keys',
    slug: 'cryptographic-keys',
    order: 9,
    title: 'Cryptographic Keys & Entropy',
    category: 'security',
    description:
      'Learn about key length, entropy, random number generation (CSPRNG), and brute-force complexity.',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
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
        content: `A cipher is only as strong as its key. Even the most mathematically robust encryption algorithm is useless if the key is predictable, short, or generated from poor randomness.`,
        keyPoints: [
          'Key size dictates the key space ($2^N$ possible keys)',
          'Modern ciphers require Cryptographically Secure Pseudorandom Number Generators (CSPRNG)',
          'Never use Math.random() for cryptographic keys or tokens',
        ],
      },
      {
        id: 'concept',
        title: 'Key Space and Brute-Force Feasibility',
        content: `The brute-force attack involves guessing every possible key until the correct one is discovered:
- **56-bit DES:** $2^{56} \\approx 7.2 \\times 10^{16}$ keys. In 1999, the EFF "Deep Crack" machine cracked DES in 22 hours. Today, cracked in minutes.
- **128-bit AES:** $2^{128} \\approx 3.4 \\times 10^{38}$ keys. Even with all the supercomputers on Earth running until the death of the universe, breaking AES-128 is physically impossible under known laws of physics.
- **256-bit AES:** $2^{256} \\approx 1.15 \\times 10^{77}$ keys (roughly the total number of atoms in the observable universe).`,
        codeSnippet: {
          language: 'typescript',
          code: `// WRONG: Insecure PRNG (predictable state)
const badKey = Math.random().toString(36); // NEVER DO THIS FOR SECURITY

// CORRECT: Cryptographically Secure PRNG
const secureBytes = crypto.getRandomValues(new Uint8Array(32)); // 256 bits of true entropy`,
          caption: 'Always use crypto.getRandomValues() in Web applications',
        },
      },
      {
        id: 'example',
        title: 'Entropy: Measure of Unpredictability',
        content: `Entropy is the quantitative measure of disorder or randomness in a data source. If a key has 128 bits of entropy, an adversary must make an average of $2^{127}$ guesses to find it. If you generate a password from a human dictionary, the real entropy is dramatically lower than the key length suggests.`,
      },
      {
        id: 'visualization',
        title: 'Keyspace Visualization',
        content: `Keyspace size grows exponentially with each additional bit: 2^128 is 340 undecillion combinations!`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Essential key generation rules:',
        keyPoints: [
          'Key space doubles with every single bit added.',
          'Always use a CSPRNG like crypto.getRandomValues().',
          'AES-256 and RSA-2048/3072 provide strong padding resilience.',
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
        content:
          'You understand key entropy, keyspace scaling, and how to source secure random material in browser applications.',
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
  // LESSON 10 — IV & NONCE
  // ============================================================
  {
    id: 'iv-nonce',
    slug: 'iv-and-nonce',
    order: 10,
    title: 'IV & Nonce',
    category: 'security',
    description:
      'Learn why encrypting the same message twice must never produce the same ciphertext, and the critical role of Nonces.',
    difficulty: 'intermediate',
    estimatedMinutes: 11,
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
        content: `If an encryption algorithm always turns the word "YES" into the exact same ciphertext "X9#f", an eavesdropper does not need to crack the key to know when you vote "YES"!

To prevent this pattern leakage, modern ciphers require an **Initialization Vector (IV)** or **Nonce** (Number used Once).`,
        keyPoints: [
          'Ensures identical plaintexts produce completely different ciphertexts each time',
          'An IV does NOT need to be secret; it is transmitted openly alongside the ciphertext',
          'Crucial rule: A Nonce/IV must NEVER be reused with the same secret key in GCM or stream modes',
        ],
      },
      {
        id: 'concept',
        title: 'The Catastrophic GCM Nonce Reuse Vulnerability',
        content: `In AES-GCM (Galois/Counter Mode), reusing an IV with the same key breaks both confidentiality and authentication:
1. Two ciphertexts encrypted with the same key and IV can be XORed together to completely cancel out the keystream: $C_1 \\oplus C_2 = P_1 \\oplus P_2$.
2. In GCM, reusing a nonce exposes the internal GHASH authentication key, allowing attackers to forge arbitrary messages!`,
        codeSnippet: {
          language: 'typescript',
          code: `// Proper AES-GCM encryption pattern:
// 1. Generate a fresh, unique 12-byte IV for EVERY single message:
const iv = crypto.getRandomValues(new Uint8Array(12));

// 2. Encrypt with key and unique IV:
const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);

// 3. Prepend IV to ciphertext (safe to send in the clear):
const transmission = iv + ciphertext;`,
        },
      },
      {
        id: 'example',
        title: 'Real-World Analogy',
        content: `Think of an IV like salting food: even if two chefs use the exact same base soup recipe (plaintext and key), adding a pinch of salt (unique IV) ensures each pot tastes subtly distinct.`,
      },
      {
        id: 'visualization',
        title: 'Fresh Nonce Each Time',
        content: `"HELLO" + Key + IV_1 ──> 9a8f2b1c...\n"HELLO" + Key + IV_2 ──> 3e7c04df... (Completely different!)`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Review IV and Nonce essentials:',
        keyPoints: [
          'An IV ensures identical plaintexts encrypt to distinct ciphertexts.',
          'IVs do not need to be secret, but must be unique.',
          'Never reuse an IV with the same key in AES-GCM or ChaCha20.',
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
        content:
          'You understand why nonces are essential to prevent pattern leakage and replay attacks in modern communications.',
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
  // LESSON 11 — AUTHENTICATION & HMAC
  // ============================================================
  {
    id: 'authentication-mac',
    slug: 'cryptographic-authentication',
    order: 11,
    title: 'Authentication & HMAC',
    category: 'security',
    description:
      'Why encryption without authentication is vulnerable to tampering, and how HMAC and AEAD ciphers protect messages.',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
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
        content: `A widespread misconception is that encrypting data automatically prevents attackers from modifying it. In reality, pure unauthenticated ciphers (like AES-CBC without a MAC) are vulnerable to **Bit-Flipping Attacks** and **Padding Oracle Attacks**.

An attacker can alter bits in the ciphertext, causing predictable alterations in the decrypted plaintext without knowing the key!`,
        keyPoints: [
          'Encryption provides Confidentiality; Authentication provides Integrity and Origin proof',
          'HMAC (Hash-based Message Authentication Code) binds a shared secret with a hash',
          'Modern systems mandate AEAD (Authenticated Encryption with Associated Data) like AES-GCM',
        ],
      },
      {
        id: 'concept',
        title: 'HMAC and AEAD',
        content: `1. **HMAC (RFC 2104):** Combines a secret key with a hash function (e.g. HMAC-SHA256) through nested hashing:
$$\\text{HMAC}(K, m) = \\text{Hash}((K \\oplus \\text{opad}) \\parallel \\text{Hash}((K \\oplus \\text{ipad}) \\parallel m))$$

2. **AEAD (e.g. AES-GCM):** Integrates encryption and authentication in a single efficient pass. It produces both ciphertext and an **Authentication Tag** (16 bytes). If even 1 bit of ciphertext is modified in transit, decryption fails instantly and completely.`,
        codeSnippet: {
          language: 'text',
          code: `[Sender] Plaintext ──(AES-GCM Key)──> [Ciphertext + Auth Tag]
                                                │
                                         [Attacker modifies 1 bit]
                                                │
[Receiver] ──(Decrypt Attempt)──> ERROR: "OperationError: The operation failed for an operation-specific reason"
                                  (Integrity verification failed!)`,
        },
      },
      {
        id: 'example',
        title: 'Web Tokens (JWT) and API Signatures',
        content: `When you authenticate with an API using HMAC (such as AWS SigV4 or JSON Web Tokens with HS256), the server verifies the signature before processing the request body. If a hacker tampers with their user ID in the payload, the HMAC check fails and the request is rejected.`,
      },
      {
        id: 'visualization',
        title: 'AEAD Pipeline',
        content: `Plaintext + Key + IV ──> Ciphertext + Tag (16 bytes). Both must be valid for decryption to succeed.`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Review authentication fundamentals:',
        keyPoints: [
          'Encryption without authentication is dangerous and vulnerable to tampering.',
          'Always use AEAD ciphers (such as AES-GCM or ChaCha20-Poly1305).',
          'HMAC provides message authenticity using a shared symmetric key.',
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
        content:
          'You understand why authenticated encryption (AEAD) is mandated in modern cryptographic engineering.',
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
];