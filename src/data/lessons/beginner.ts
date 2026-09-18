import { Lesson } from '../../types/lesson';

/**
 * Beginner Lessons — Order 1, 2, 3, 4, 12
 *
 * Foundational concepts for newcomers to cryptography.
 * These lessons assume no prior mathematical or security background.
 */
export const BEGINNER_LESSONS: Lesson[] = [
  // ============================================================
  // LESSON 1 — WHAT IS CRYPTOGRAPHY?
  // ============================================================
  {
    id: 'intro-crypto',
    slug: 'what-is-cryptography',
    order: 1,
    title: 'What is Cryptography?',
    category: 'foundations',
    description:
      'Explore the science of secure communication, its ancient military origins, and modern digital defense.',
    difficulty: 'beginner',
    estimatedMinutes: 8,
    xpReward: 30,
    references: [
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
      {
        title: 'The Code Book: The Science of Secrecy from Ancient Egypt to Quantum Cryptography',
        author: 'S. Singh',
        year: 1999,
        url: 'https://simonsingh.net/books/the-code-book/',
        type: 'book',
      },
    ],
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
          "Kerckhoffs's Principle states that a system must remain secure even if everything about it (except the key) is public knowledge.",
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
      question:
        'Which cryptographic goal ensures that an attacker cannot alter a message in transit without detection?',
      instruction: 'Select the correct foundational pillar of cryptography.',
      inputType: 'choice',
      options: ['Confidentiality', 'Integrity', 'Availability', 'Anonymity'],
      correctAnswer: 'Integrity',
      hint: 'Think of data integrity—making sure the contents are unchanged and untampered.',
      explanation:
        'Integrity guarantees that unauthorized modifications (additions, deletions, alterations) are reliably detected.',
    },
  },

  // ============================================================
  // LESSON 2 — PLAINTEXT & CIPHERTEXT
  // ============================================================
  {
    id: 'plaintext-ciphertext',
    slug: 'plaintext-and-ciphertext',
    order: 2,
    title: 'Plaintext & Ciphertext',
    category: 'foundations',
    description:
      'Understand the fundamental states of information: clear unencrypted data versus protected cryptographic output.',
    difficulty: 'beginner',
    estimatedMinutes: 7,
    xpReward: 30,
    references: [
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
      question:
        'What is the standard cryptographic symbol used to represent Ciphertext in mathematical equations?',
      instruction: 'Type the single letter symbol (uppercase).',
      inputType: 'text',
      correctAnswer: 'C',
      hint: 'In C = E(K, P), what does C stand for?',
      explanation:
        'In cryptographic literature, C standardly represents Ciphertext, while P represents Plaintext.',
    },
  },

  // ============================================================
  // LESSON 3 — ENCRYPTION & DECRYPTION
  // ============================================================
  {
    id: 'enc-dec',
    slug: 'encryption-and-decryption',
    order: 3,
    title: 'Encryption & Decryption',
    category: 'mechanisms',
    description:
      'Learn the two reversible phases of cryptographic transformation and how keys govern the process.',
    difficulty: 'beginner',
    estimatedMinutes: 9,
    xpReward: 30,
    references: [
      {
        title: 'La Cryptographie Militaire (Kerckhoffs\'s Principle, 1883)',
        author: 'A. Kerckhoffs',
        year: 1883,
        url: 'https://en.wikipedia.org/wiki/Kerckhoffs%27s_principle',
        type: 'paper',
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
    sections: [
      {
        id: 'introduction',
        title: 'The Reversible Transformation',
        content: `Encryption is the process of converting plaintext into ciphertext using an algorithm (cipher) and a secret key. Decryption is the exact inverse process: reconstructing the original plaintext from the ciphertext using the authorized key.`,
        keyPoints: [
          'Without the key, decryption should be computationally infeasible',
          "Good algorithms rely on public math, not secret implementations (Kerckhoffs's principle)",
          'Loss of the key means permanent loss of access to the encrypted data',
        ],
      },
      {
        id: 'concept',
        title: "Kerckhoffs's Principle and Shannon's Maxim",
        content: `Auguste Kerckhoffs formulated in 1883: *"A cryptographic system should be secure even if everything about the system, except the key, is public knowledge."*

Claude Shannon later rephrased this as **Shannon's Maxim**: *"The enemy knows the system!"*

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
        content: "Confirm your understanding of Kerckhoffs's Principle.",
      },
      {
        id: 'summary',
        title: 'Summary',
        content:
          'You understand the dual nature of encryption/decryption and why modern cryptography embraces open algorithms with secret keys.',
      },
    ],
    interactiveExercise: {
      question:
        "According to Kerckhoffs's Principle, which element of a cryptographic system must remain strictly secret?",
      instruction: 'Select the only component that must be kept confidential.',
      inputType: 'choice',
      options: [
        'The cipher algorithm',
        'The secret key',
        'The mathematical formula',
        'The ciphertext format',
      ],
      correctAnswer: 'The secret key',
      hint: 'The algorithm is public; the security rests entirely on this single parameter.',
      explanation:
        "Kerckhoffs's principle states that the entire algorithm and architecture should be public; only the key must be secret.",
    },
  },

  // ============================================================
  // LESSON 4 — ENCODING VS ENCRYPTION
  // ============================================================
  {
    id: 'encoding-vs-encryption',
    slug: 'encoding-vs-encryption',
    order: 4,
    title: 'Encoding vs Encryption',
    category: 'foundations',
    description:
      'A critical cybersecurity distinction: why Base64 or Hex is NOT encryption, and the danger of confusing them.',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    xpReward: 35,
    references: [
      {
        title: 'RFC 4648: The Base16, Base32, and Base64 Data Encodings',
        author: 'S. Josefsson',
        year: 2006,
        url: 'https://datatracker.ietf.org/doc/html/rfc4648',
        type: 'standard',
      },
      {
        title: 'OWASP Cryptographic Storage Cheat Sheet',
        author: 'OWASP Foundation',
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html',
        type: 'documentation',
      },
    ],
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
        content:
          'You can now confidently explain the difference between encoding, encryption, and hashing to colleagues and team members.',
      },
    ],
    interactiveExercise: {
      question: 'Is Base64 considered an encryption algorithm?',
      instruction: 'Answer Yes or No.',
      inputType: 'choice',
      options: [
        'No, it is an encoding scheme with no key and zero confidentiality',
        'Yes, because the text looks scrambled',
      ],
      correctAnswer: 'No, it is an encoding scheme with no key and zero confidentiality',
      hint: 'Does Base64 require a secret password or key to decode?',
      explanation:
        'Base64 is strictly an encoding format designed for safe data transmission across text protocols. It requires no secret key and provides no security.',
    },
  },

  // ============================================================
  // LESSON 12 — CIA TRIAD
  // ============================================================
  {
    id: 'cia-triad',
    slug: 'cia-triad-security',
    order: 12,
    title: 'Confidentiality, Integrity & Authenticity (CIA)',
    category: 'security',
    description:
      'The capstone of cybersecurity fundamentals: synthesize the CIA triad and how cryptographic tools defend it.',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    xpReward: 40,
    references: [
      {
        title: 'NIST SP 800-12 Rev. 1: An Introduction to Information Security',
        author: 'NIST',
        year: 2017,
        url: 'https://csrc.nist.gov/publications/detail/sp/800-12/rev-1/final',
        type: 'standard',
      },
      {
        title: 'NIST FIPS 199: Standards for Security Categorization of Federal Information and Information Systems',
        author: 'NIST',
        year: 2004,
        url: 'https://csrc.nist.gov/publications/detail/fips/199/final',
        type: 'standard',
      },
    ],
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
        content:
          'You have completed all 12 core cryptography fundamental lessons. You are now ready to explore algorithms and dive into hands-on playground experiments!',
      },
    ],
    interactiveExercise: {
      question:
        'Which cryptographic mechanism directly guarantees Non-Repudiation (preventing a sender from denying they sent a message)?',
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
      explanation:
        'Since only the owner possesses the private signing key, they cannot credibly claim someone else signed the document (non-repudiation).',
    },
  },
];