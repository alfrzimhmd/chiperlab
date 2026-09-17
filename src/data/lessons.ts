import { Lesson } from '../types/lesson';

export const LESSONS: Lesson[] = [
  {
    id: 'intro-crypto',
    slug: 'what-is-cryptography',
    order: 1,
    title: 'What is Cryptography?',
    category: 'foundations',
    description: 'Explore the science of secure communication, its ancient military origins, and modern digital defense.',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    xpReward: 30,
    sections: [
      {
        id: 'introduction',
        title: 'The Art and Science of Secret Writing',
        content: `Cryptography originates from the Greek words *kryptos* (hidden or secret) and *graphein* (to write). At its core, cryptography is the practice and study of techniques for securing communication and protecting data from adversarial third parties.

Throughout human history—from Spartan generals sending encrypted parchment strips (scytales) to modern TLS/HTTPS sessions safeguarding online banking—the fundamental desire remains the same: ensure that only authorized entities can read or authenticate a transmission.`,
        keyPoints: [
          'Guarantees privacy across untrusted communication channels',
          'Transforms sensitive data into an unreadable form for eavesdroppers',
          'Enables modern digital trust across the open Internet',
        ],
      },
      {
        id: 'concept',
        title: 'Core Objectives of Modern Cryptography',
        content: `Modern cryptography is far more than scrambling text. Cryptographic protocols solve four foundational security requirements:

1. **Confidentiality:** Ensuring no eavesdropper can discern the meaning of transmitted or stored data.
2. **Integrity:** Ensuring that any unauthorized modification of data in transit or at rest will be detected immediately.
3. **Authentication:** Proving the genuine identity of communicating parties or data originators.
4. **Non-Repudiation:** Preventing an entity from falsely denying having performed an action or sent a message.`,
        codeSnippet: {
          language: 'text',
          code: `[Sender: Alice] ──(Insecure Internet)──> [Receiver: Bob]
        │                                      ▲
        ▼                                      │
[Plaintext Data] ──(Encrypt)──> [Ciphertext] ──(Decrypt)
                                       │
                                [Attacker: Eve]
                            (Sees only ciphertext)`,
          caption: 'Basic cryptographic communication model',
        },
      },
      {
        id: 'example',
        title: 'Real-World Application: HTTPS in Your Browser',
        content: `Every time you see the padlock icon in your browser address bar (HTTPS), an intricate suite of cryptographic primitives executes in milliseconds:
- **Asymmetric Encryption (RSA/ECDSA):** Verifies the server certificate and safely exchanges secret material.
- **Symmetric Encryption (AES-GCM):** Encrypts every packet of web traffic at gigabit speeds.
- **Hashing (SHA-256):** Guarantees that packet contents have not been tampered with by hostile intermediate routers.`,
      },
      {
        id: 'visualization',
        title: 'Conceptual Pipeline',
        content: `Notice how data flows: Information enters as readable Plaintext. A mathematical transformation powered by a secret Key turns it into unreadable Ciphertext. Only an entity possessing the complementary Key can invert the process back to Plaintext.`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: `Key points to remember from this lesson:`,
        keyPoints: [
          'Cryptography is the scientific discipline of secure information exchange.',
          'It delivers Confidentiality, Integrity, Authentication, and Non-repudiation.',
          'Kerckhoffs\'s Principle states that a system must remain secure even if everything about it (except the key) is public knowledge.',
        ],
      },
      {
        id: 'exercise',
        title: 'Check Your Knowledge',
        content: 'Solve the quick checkpoint question below to earn XP and complete this lesson.',
      },
      {
        id: 'summary',
        title: 'Lesson Summary',
        content: 'You have mastered the foundational purpose of cryptography and the core security goals (Confidentiality, Integrity, Authentication, Non-repudiation). Next, we dive into Plaintext and Ciphertext!',
      },
    ],
    interactiveExercise: {
      question: 'Which cryptographic goal ensures that an attacker cannot alter a message in transit without detection?',
      instruction: 'Select the correct foundational pillar of cryptography.',
      inputType: 'choice',
      options: ['Confidentiality', 'Integrity', 'Availability', 'Anonymity'],
      correctAnswer: 'Integrity',
      hint: 'Think of data integrity—making sure the contents are unchanged and untampered.',
      explanation: 'Integrity guarantees that unauthorized modifications (additions, deletions, alterations) are reliably detected.',
    },
  },
  {
    id: 'plaintext-ciphertext',
    slug: 'plaintext-and-ciphertext',
    order: 2,
    title: 'Plaintext & Ciphertext',
    category: 'foundations',
    description: 'Understand the fundamental states of information: clear unencrypted data versus protected cryptographic output.',
    difficulty: 'beginner',
    estimatedMinutes: 7,
    xpReward: 30,
    sections: [
      {
        id: 'introduction',
        title: 'The Two States of Information',
        content: `In cryptography, all textual and binary information exists in one of two states: **Plaintext** (human or machine readable format) and **Ciphertext** (the output of an encryption algorithm).`,
        keyPoints: [
          'Plaintext is vulnerable to inspection and interception',
          'Ciphertext looks like random noise to anyone without the decryption key',
          'The transformation from plaintext to ciphertext must be mathematically reversible only with the right key',
        ],
      },
      {
        id: 'concept',
        title: 'Notation and Mathematical Representation',
        content: `In mathematical literature:
- **P** or **M** denotes Plaintext (or Message).
- **C** denotes Ciphertext.
- **K** denotes the Key.
- **E** denotes the Encryption function: $C = E(K, P)$
- **D** denotes the Decryption function: $P = D(K, C)$`,
        codeSnippet: {
          language: 'typescript',
          code: `// Conceptual transformation
const plaintext = "TRANSFER $50,000 TO ACCOUNT #4092";
const key = "k7$9Fm#2pLq9v1X!";
const ciphertext = encrypt(plaintext, key);
// Result: "a7c810d93be4e8b3938b82c..." (apparent high entropy noise)`,
          caption: 'Encryption transforming readable text into pseudo-random byte string',
        },
      },
      {
        id: 'example',
        title: 'Entropy and Randomness',
        content: `A well-designed modern cipher produces ciphertext with maximum Shannon entropy: every bit has nearly equal 50% probability of being 0 or 1. Any discernible patterns or repetitive structures in the ciphertext are severe security flaws that cryptanalysts exploit.`,
      },
      {
        id: 'visualization',
        title: 'State Comparison',
        content: `Plaintext (low entropy, predictable syntax, vowels, spaces) → [Cipher Algorithm + Secret Key] → Ciphertext (high entropy, uniform distribution, zero syntax).`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Review these fundamental concepts:',
        keyPoints: [
          'Plaintext is unencrypted, intelligible data.',
          'Ciphertext is the encrypted, seemingly random result of a cipher.',
          'High entropy in ciphertext prevents pattern analysis.',
        ],
      },
      {
        id: 'exercise',
        title: 'Checkpoint Exercise',
        content: 'Complete the exercise below to test your understanding.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content: 'You now understand the distinction between Plaintext and Ciphertext, and how ciphers enforce high entropy output.',
      },
    ],
    interactiveExercise: {
      question: 'What is the standard cryptographic symbol used to represent Ciphertext in mathematical equations?',
      instruction: 'Type the single letter symbol (uppercase).',
      inputType: 'text',
      correctAnswer: 'C',
      hint: 'In C = E(K, P), what does C stand for?',
      explanation: 'In cryptographic literature, C standardly represents Ciphertext, while P represents Plaintext.',
    },
  },
  {
    id: 'enc-dec',
    slug: 'encryption-and-decryption',
    order: 3,
    title: 'Encryption & Decryption',
    category: 'mechanisms',
    description: 'Learn the two reversible phases of cryptographic transformation and how keys govern the process.',
    difficulty: 'beginner',
    estimatedMinutes: 9,
    xpReward: 30,
    sections: [
      {
        id: 'introduction',
        title: 'The Reversible Transformation',
        content: `Encryption is the process of converting plaintext into ciphertext using an algorithm (cipher) and a secret key. Decryption is the exact inverse process: reconstructing the original plaintext from the ciphertext using the authorized key.`,
        keyPoints: [
          'Without the key, decryption should be computationally infeasible',
          'Good algorithms rely on public math, not secret implementations (Kerckhoffs\'s principle)',
          'Loss of the key means permanent loss of access to the encrypted data',
        ],
      },
      {
        id: 'concept',
        title: 'Kerckhoffs\'s Principle and Shannon\'s Maxim',
        content: `Auguste Kerckhoffs formulated in 1883: *"A cryptographic system should be secure even if everything about the system, except the key, is public knowledge."*

Claude Shannon later rephrased this as **Shannon\'s Maxim**: *"The enemy knows the system!"*

Relying on keeping the algorithm secret is called **Security through Obscurity**—it invariably fails when the algorithm is reverse-engineered or leaked.`,
        codeSnippet: {
          language: 'typescript',
          code: `// Kerckhoffs's Principle in code:
// The algorithm implementation is completely open source:
import { aesGcmEncrypt, aesGcmDecrypt } from './webcrypto/aes';

// Security rests entirely on the confidentiality of 'secretKey':
const ciphertext = await aesGcmEncrypt(plaintext, secretKey);
const decrypted = await aesGcmDecrypt(ciphertext, secretKey);
console.log(decrypted === plaintext); // true`,
        },
      },
      {
        id: 'example',
        title: 'Symmetric vs Asymmetric Decryption',
        content: `In symmetric encryption, the exact same key that encrypted the message must be used to decrypt it. In asymmetric encryption, a mathematical pair is used: plaintext encrypted with the Public Key can only be inverted by the complementary Private Key.`,
      },
      {
        id: 'visualization',
        title: 'Transformation Cycle',
        content: `Plaintext ──[Encrypt with Key]──> Ciphertext ──[Decrypt with Key]──> Original Plaintext`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Core takeaways for encryption and decryption:',
        keyPoints: [
          'Encryption turns readable data into ciphertext; decryption reverses it.',
          'Never rely on secret algorithms (Security through Obscurity).',
          'Security must depend exclusively on the secrecy of the key.',
        ],
      },
      {
        id: 'exercise',
        title: 'Interactive Exercise',
        content: 'Confirm your understanding of Kerckhoffs\'s Principle.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content: 'You understand the dual nature of encryption/decryption and why modern cryptography embraces open algorithms with secret keys.',
      },
    ],
    interactiveExercise: {
      question: 'According to Kerckhoffs\'s Principle, which element of a cryptographic system must remain strictly secret?',
      instruction: 'Select the only component that must be kept confidential.',
      inputType: 'choice',
      options: ['The cipher algorithm', 'The secret key', 'The mathematical formula', 'The ciphertext format'],
      correctAnswer: 'The secret key',
      hint: 'The algorithm is public; the security rests entirely on this single parameter.',
      explanation: 'Kerckhoffs\'s principle states that the entire algorithm and architecture should be public; only the key must be secret.',
    },
  },
  {
    id: 'encoding-vs-encryption',
    slug: 'encoding-vs-encryption',
    order: 4,
    title: 'Encoding vs Encryption',
    category: 'foundations',
    description: 'A critical cybersecurity distinction: why Base64 or Hex is NOT encryption, and the danger of confusing them.',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    xpReward: 35,
    sections: [
      {
        id: 'introduction',
        title: 'The Dangerous Confusion',
        content: `One of the most common mistakes among software engineers and security novices is treating **Encoding** (such as Base64, URL Encoding, or Hexadecimal) as **Encryption**.

Encoding is NOT encryption. Encoding provides **zero confidentiality** and offers no security against any observer.`,
        keyPoints: [
          'Encoding aims for data usability and transmission compatibility, not secrecy',
          'Anyone can decode Base64 or Hex without a key in microseconds',
          'Encryption requires a secret key and cannot be reversed without it',
        ],
      },
      {
        id: 'concept',
        title: 'Direct Comparison: Encoding, Encryption, Hashing',
        content: `Let us compare the three distinct concepts:

| Attribute | Encoding (e.g. Base64) | Encryption (e.g. AES) | Hashing (e.g. SHA-256) |
|---|---|---|---|
| **Purpose** | Usability / Transmit binary | Confidentiality | Integrity verification |
| **Requires Key?** | NO | YES | NO |
| **Reversible?** | YES (trivial by anyone) | YES (with key only) | NO (One-way) |
| **Example** | \`SGVsbG8=\` | \`7b9e02f5a89...\` | \`185f8db32271fe...\` |`,
        codeSnippet: {
          language: 'bash',
          code: `# Base64 is instantly decoded with no secret:
$ echo "SGVsbG8gV29ybGQ=" | base64 --decode
Hello World

# AES cannot be decrypted without the secret key and IV!`,
          caption: 'Base64 decoding requires zero credentials',
        },
      },
      {
        id: 'example',
        title: 'Why Base64 Exists',
        content: `Base64 exists because legacy network protocols (like SMTP email or JSON REST APIs) were designed to transmit 7-bit ASCII text. When you need to send binary data (like images or encrypted byte arrays), Base64 encodes 3 binary bytes into 4 ASCII characters.`,
      },
      {
        id: 'visualization',
        title: 'Visual Representation',
        content: `Input → [Standard Public Algorithm, No Key] → Encoded String (Decodable by anyone)\nInput → [Algorithm + Secret Key] → Ciphertext (Secure)`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Remember the golden rule:',
        keyPoints: [
          'Never use Base64 to hide passwords, tokens, or personal identifiers.',
          'Encoding changes format for transmission; encryption protects confidentiality with keys.',
          'Hashing is irreversible; encryption is reversible with the correct key.',
        ],
      },
      {
        id: 'exercise',
        title: 'Checkpoint Exercise',
        content: 'Test your understanding of encoding vs encryption.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content: 'You can now confidently explain the difference between encoding, encryption, and hashing to colleagues and team members.',
      },
    ],
    interactiveExercise: {
      question: 'Is Base64 considered an encryption algorithm?',
      instruction: 'Answer Yes or No.',
      inputType: 'choice',
      options: ['No, it is an encoding scheme with no key and zero confidentiality', 'Yes, because the text looks scrambled'],
      correctAnswer: 'No, it is an encoding scheme with no key and zero confidentiality',
      hint: 'Does Base64 require a secret password or key to decode?',
      explanation: 'Base64 is strictly an encoding format designed for safe data transmission across text protocols. It requires no secret key and provides no security.',
    },
  },
  {
    id: 'symmetric-crypto',
    slug: 'symmetric-cryptography',
    order: 5,
    title: 'Symmetric Cryptography',
    category: 'mechanisms',
    description: 'Master shared-key encryption: high-throughput ciphers like AES, stream vs block ciphers, and key distribution.',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    xpReward: 40,
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
        content: 'You understand symmetric ciphers, AES blocks, and why hybrid cryptography combines symmetric speed with asymmetric key exchange.',
      },
    ],
    interactiveExercise: {
      question: 'Which of the following is the most widely adopted modern symmetric block cipher standard?',
      instruction: 'Select the correct algorithm name.',
      inputType: 'choice',
      options: ['AES (Advanced Encryption Standard)', 'RSA', 'Diffie-Hellman', 'SHA-256'],
      correctAnswer: 'AES (Advanced Encryption Standard)',
      hint: 'It was selected by NIST in 2001 to replace DES and uses 128, 192, or 256-bit keys.',
      explanation: 'AES (Advanced Encryption Standard), based on the Rijndael algorithm, is the worldwide benchmark for symmetric encryption.',
    },
  },
  {
    id: 'asymmetric-crypto',
    slug: 'asymmetric-cryptography',
    order: 6,
    title: 'Asymmetric Cryptography',
    category: 'mechanisms',
    description: 'Discover public-key cryptography: how mathematically linked key pairs allow strangers to communicate securely.',
    difficulty: 'intermediate',
    estimatedMinutes: 14,
    xpReward: 45,
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
        content: 'You have mastered asymmetric cryptography and understand how public/private keys enable worldwide secure commerce.',
      },
    ],
    interactiveExercise: {
      question: 'If Alice wants to send an encrypted message that ONLY Bob can read, whose key should she use to encrypt it?',
      instruction: 'Select the correct key.',
      inputType: 'choice',
      options: ["Bob's Public Key", "Alice's Private Key", "Bob's Private Key", "Alice's Public Key"],
      correctAnswer: "Bob's Public Key",
      hint: 'Only Bob holds the corresponding private key capable of inverting the encryption.',
      explanation: 'Alice must encrypt with Bob\'s Public Key. Bob is the only person in possession of Bob\'s corresponding Private Key needed to decrypt.',
    },
  },
  {
    id: 'hashing-foundations',
    slug: 'cryptographic-hashing',
    order: 7,
    title: 'Hashing & The Avalanche Effect',
    category: 'mechanisms',
    description: 'Explore one-way mathematical digests, collision resistance, and why a single flipped bit scrambles the entire hash.',
    difficulty: 'intermediate',
    estimatedMinutes: 11,
    xpReward: 40,
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
        content: 'You understand cryptographic digests, the avalanche effect, and collision resistance requirements.',
      },
    ],
    interactiveExercise: {
      question: 'What happens to the SHA-256 digest if you change a single punctuation mark in a 1,000-page document?',
      instruction: 'Select the behavior of the hash function.',
      inputType: 'choice',
      options: [
        'Approximately 50% of the output bits will change unpredictably (Avalanche effect)',
        'Only the last 2 characters of the hash will change',
        'Nothing, small changes are ignored by hashes',
        'The hash length decreases by 1 character',
      ],
      correctAnswer: 'Approximately 50% of the output bits will change unpredictably (Avalanche effect)',
      hint: 'Recall the avalanche effect demonstration with the dog/cog example.',
      explanation: 'The avalanche effect dictates that changing even a single bit in the input radically alters approximately half the bits in the resulting digest.',
    },
  },
  {
    id: 'digital-signature',
    slug: 'digital-signatures',
    order: 8,
    title: 'Digital Signatures',
    category: 'mechanisms',
    description: 'Understand how public-key cryptography and hashing combine to guarantee authenticity, integrity, and non-repudiation.',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    xpReward: 40,
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
          'Signing uses the sender\'s Private Key; verification uses the sender\'s Public Key.',
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
        content: 'You understand digital signature mechanics and how they safeguard modern software distribution and financial networks.',
      },
    ],
    interactiveExercise: {
      question: 'Which key is used to GENERATE a digital signature on a document?',
      instruction: 'Choose the signing key.',
      inputType: 'choice',
      options: ["The signer's Private Key", "The recipient's Public Key", "The recipient's Private Key", "A shared symmetric key"],
      correctAnswer: "The signer's Private Key",
      hint: 'Only the signer possesses this secret, proving the signature came from them alone.',
      explanation: 'The signer uses their own Private Key to sign. Anyone in the world can then verify the signature using the signer\'s Public Key.',
    },
  },
  {
    id: 'crypto-keys',
    slug: 'cryptographic-keys',
    order: 9,
    title: 'Cryptographic Keys & Entropy',
    category: 'security',
    description: 'Learn about key length, entropy, random number generation (CSPRNG), and brute-force complexity.',
    difficulty: 'intermediate',
    estimatedMinutes: 10,
    xpReward: 35,
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
          'AES-256 and RSA-2048/3072 provide strong quantum-resistant padding resilience.',
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
        content: 'You understand key entropy, keyspace scaling, and how to source secure random material in browser applications.',
      },
    ],
    interactiveExercise: {
      question: 'Which JavaScript API provides cryptographically secure random bytes suitable for keys?',
      instruction: 'Select the secure standard API.',
      inputType: 'choice',
      options: ['crypto.getRandomValues()', 'Math.random()', 'Date.now()', 'performance.now()'],
      correctAnswer: 'crypto.getRandomValues()',
      hint: 'It is part of the Web Crypto API standard.',
      explanation: 'crypto.getRandomValues() connects directly to the operating system\'s cryptographic entropy pool (/dev/urandom or Windows BCryptGenRandom).',
    },
  },
  {
    id: 'iv-nonce',
    slug: 'iv-and-nonce',
    order: 10,
    title: 'IV & Nonce',
    category: 'security',
    description: 'Learn why encrypting the same message twice must never produce the same ciphertext, and the critical role of Nonces.',
    difficulty: 'intermediate',
    estimatedMinutes: 11,
    xpReward: 35,
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
        content: 'You understand why nonces are essential to prevent pattern leakage and replay attacks in modern communications.',
      },
    ],
    interactiveExercise: {
      question: 'Must an Initialization Vector (IV) be kept secret from eavesdroppers like a private key?',
      instruction: 'Select True or False.',
      inputType: 'choice',
      options: [
        'False: IVs only need to be unique (unpredictable), not secret. They are sent openly with ciphertext.',
        'True: If an attacker sees the IV, all security is permanently lost.',
      ],
      correctAnswer: 'False: IVs only need to be unique (unpredictable), not secret. They are sent openly with ciphertext.',
      hint: 'Recall how AES-GCM bundles the IV with the ciphertext for transmission.',
      explanation: 'IVs do not require secrecy; they simply require uniqueness. Transmitting the IV in the clear alongside the ciphertext is standard practice.',
    },
  },
  {
    id: 'authentication-mac',
    slug: 'cryptographic-authentication',
    order: 11,
    title: 'Authentication & HMAC',
    category: 'security',
    description: 'Why encryption without authentication is vulnerable to tampering, and how HMAC and AEAD ciphers protect messages.',
    difficulty: 'intermediate',
    estimatedMinutes: 12,
    xpReward: 40,
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
        content: 'You understand why authenticated encryption (AEAD) is mandated in modern cryptographic engineering.',
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
      explanation: 'AEAD stands for Authenticated Encryption with Associated Data, modern ciphers like AES-GCM that provide both secrecy and tamper-proofing.',
    },
  },
  {
    id: 'cia-triad',
    slug: 'cia-triad-security',
    order: 12,
    title: 'Confidentiality, Integrity & Authenticity (CIA)',
    category: 'security',
    description: 'The capstone of cybersecurity fundamentals: synthesize the CIA triad and how cryptographic tools defend it.',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    xpReward: 40,
    sections: [
      {
        id: 'introduction',
        title: 'The Pillar Model of Information Security',
        content: `The **CIA Triad** (Confidentiality, Integrity, and Availability) is the foundational model guiding all information security policies and architecture. When coupled with Authenticity and Non-repudiation, it encompasses the complete spectrum of defensive engineering.`,
        keyPoints: [
          'Confidentiality: Protecting information from unauthorized viewing',
          'Integrity: Protecting information from unauthorized modification',
          'Availability: Ensuring authorized users have uninterrupted access to systems and data',
        ],
      },
      {
        id: 'concept',
        title: 'Mapping Cryptography to the Security Pillars',
        content: `Every cryptographic tool in ChiperLab directly serves one or more pillars:

| Pillar | Cryptographic Mechanism | Real-World Application |
|---|---|---|
| **Confidentiality** | Symmetric (AES) & Asymmetric (RSA) | TLS payload encryption, full disk encryption (BitLocker) |
| **Integrity** | Hash functions (SHA-256), HMAC | File checksums, git commits, blockchain |
| **Authenticity** | Digital Signatures (ECDSA/RSA), PKI | SSL/TLS certificates, code signing |
| **Non-Repudiation** | Asymmetric Digital Signatures | Legal contracts, banking wire confirmations |`,
        codeSnippet: {
          language: 'text',
          code: `         [ CONFIDENTIALITY ]
          (AES, RSA Ciphers)
                 /    \\
                /      \\
               /   CIA  \\
              /   TRIAD  \\
             /            \\
  [ INTEGRITY ] ───────── [ AVAILABILITY ]
  (SHA-256, HMAC)         (Redundancy, DoS Defense)`,
        },
      },
      {
        id: 'example',
        title: 'Case Study: Wire Transfer Defense',
        content: `When a customer sends a $10,000 wire transfer:
1. **Confidentiality:** AES-GCM hides the account numbers from network sniffers.
2. **Integrity:** The hash authentication tag ensures an attacker cannot change the amount to $1,000,000.
3. **Authenticity:** The customer's 2FA token and digital signature prove the request originated from the account owner.`,
      },
      {
        id: 'visualization',
        title: 'Comprehensive Defense',
        content: `Defense in Depth: Layering Confidentiality, Integrity, and Authenticity ensures complete security.`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Final review of fundamentals:',
        keyPoints: [
          'Security is a holistic triangle: Confidentiality, Integrity, and Availability.',
          'Never rely on a single defensive tool.',
          'Knowing which tool solves which threat is the hallmark of a cybersecurity professional.',
        ],
      },
      {
        id: 'exercise',
        title: 'Final Checkpoint',
        content: 'Answer the synthesis question to complete the Fundamentals track!',
      },
      {
        id: 'summary',
        title: 'Congratulations!',
        content: 'You have completed all 12 core cryptography fundamental lessons. You are now ready to explore algorithms and dive into hands-on playground experiments!',
      },
    ],
    interactiveExercise: {
      question: 'Which cryptographic mechanism directly guarantees Non-Repudiation (preventing a sender from denying they sent a message)?',
      instruction: 'Select the correct mechanism.',
      inputType: 'choice',
      options: [
        'Asymmetric Digital Signatures (using Private Key)',
        'Symmetric AES encryption',
        'Base64 encoding',
        'Unkeyed SHA-256 hash',
      ],
      correctAnswer: 'Asymmetric Digital Signatures (using Private Key)',
      hint: 'Because only one person holds the private key, only that person could have produced the signature.',
      explanation: 'Since only the owner possesses the private signing key, they cannot credibly claim someone else signed the document (non-repudiation).',
    },
  },
];
