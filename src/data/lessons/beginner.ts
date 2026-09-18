import { Lesson } from '../../types/lesson';

/**
 * Beginner Lessons — Order 1-8
 *
 * Foundational concepts for newcomers to cryptography.
 *
 * Order (Opsi A — Context → Theory):
 *   1. Intro to Cryptography
 *   2. Brief History
 *   3. Crypto in Daily Life
 *   4. Plaintext & Ciphertext
 *   5. Encryption & Decryption
 *   6. Encoding vs Encryption
 *   7. Threat Models
 *   8. CIA Triad
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
      'Explore the science of secure communication — from ancient military ciphers to modern TLS/HTTPS. Learn what cryptography actually solves, why it matters in daily life, and the four core security goals it delivers.',
    difficulty: 'beginner',
    estimatedMinutes: 10,
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
        content: `Cryptography comes from two Greek words: **kryptos** (hidden or secret) and **graphein** (to write). Together, they describe the practice of transforming readable information into a form that only authorized parties can interpret.

Cryptography is not a modern invention. It is a discipline that has evolved for over 2,000 years — from Spartan military scytales and Julius Caesar's letter shifts, to the Enigma machines of World War II, to the AES-GCM cipher protecting your online banking session right now.

At its heart, cryptography answers a single question: **How can two parties communicate securely when an untrusted third party can observe every message they exchange?**

Whether you are sending a WhatsApp message, entering a password on a website, or making a contactless payment, cryptography is silently working in the background to protect your data.`,
        keyPoints: [
          'Cryptography protects data confidentiality, integrity, and authenticity',
          'It is 2,000+ years old — from ancient Sparta to modern TLS',
          'The core question: how to communicate securely over an untrusted channel?',
          'Every HTTPS session, message app, and payment system relies on it',
        ],
      },
      {
        id: 'concept',
        title: 'The Four Pillars of Modern Cryptography',
        content: `Modern cryptography is far more than scrambling text. It solves four foundational security requirements:

1. **Confidentiality** — Ensuring that no eavesdropper can understand the content of a message or file. Achieved through encryption.
2. **Integrity** — Ensuring that any unauthorized modification of data is detected immediately. Achieved through hashing and message authentication codes.
3. **Authentication** — Proving the genuine identity of a communicating party or the origin of a message. Achieved through digital signatures and certificates.
4. **Non-Repudiation** — Preventing an entity from falsely denying that they performed an action (like signing a contract). Achieved through digital signatures.`,
        codeSnippet: {
          language: 'text',
          code: `[Sender: Alice]  ──(Insecure Internet)──>  [Receiver: Bob]
       │                                         ▲
       │                                         │
       ▼                                         │
   [Plaintext] ──(Encrypt with Key)──> [Ciphertext] ──(Decrypt with Key)──> [Plaintext]
                                              │
                                              │
                                     [Attacker: Eve]
                                  (Only sees ciphertext — no key)`,
          caption: 'Basic cryptographic communication model: Alice → Bob',
        },
        keyPoints: [
          'Confidentiality: nobody can read the content (encryption)',
          'Integrity: nobody can modify data undetected (hashing, MAC)',
          'Authentication: verify who sent the data (digital signatures)',
          'Non-Repudiation: sender cannot deny sending (public-key signatures)',
        ],
      },
      {
        id: 'example',
        title: 'Real-World Application: HTTPS in Your Browser',
        content: `Every time you visit a website with the padlock icon in your browser (HTTPS), a complex suite of cryptographic primitives executes in milliseconds:

| Layer | Cryptographic Mechanism | Purpose |
|---|---|---|
| Certificate Verification | Asymmetric (RSA/ECDSA) + Digital Signatures | Verify the server's identity |
| Key Exchange | Diffie-Hellman (ECDHE) or RSA-OAEP | Agree on a shared session key |
| Bulk Encryption | Symmetric (AES-256-GCM) | Encrypt every packet of traffic |
| Integrity Check | Authentication Tag (part of AES-GCM) | Detect tampering by routers |
| Log Integrity | Hashing (SHA-256) | Cert transparency logs, CT |

All of this happens without you noticing — normally in under 100 milliseconds. The next time you see the padlock, remember: **cryptography just authenticated the server, agreed on a key, and encrypted your traffic — securely, silently, and in real time.**`,
        keyPoints: [
          'HTTPS combines asymmetric, symmetric, and hashing primitives',
          'Each cryptographic tool solves a specific security goal',
          'The full handshake happens in under 100 ms',
        ],
      },
      {
        id: 'visualization',
        title: 'The Cryptographic Pipeline',
        content: `Data flows through three distinct states:

| State | Description | Who Can Read It? |
|---|---|---|
| Plaintext | Original readable data | Anyone |
| Key | Secret parameter controlling transformation | Only authorized parties |
| Ciphertext | Transformed unreadable output | Only holder of the correct key |

Only the entity that possesses the correct **key** can invert the process and recover the original plaintext. Without it, the ciphertext is indistinguishable from random noise.`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'What to remember from this lesson:',
        keyPoints: [
          'Cryptography is the scientific discipline of secure information exchange.',
          'It delivers four core security goals: Confidentiality, Integrity, Authentication, Non-Repudiation.',
          "Kerckhoffs's Principle: a system must remain secure even if everything (except the key) is public.",
          'Modern HTTPS combines multiple cryptographic primitives seamlessly.',
          'You use cryptography every day — often without realizing it.',
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
        content: `You have mastered the foundational purpose of cryptography and its four core security goals. You also saw how HTTPS combines asymmetric encryption, symmetric encryption, and hashing — all executing silently in your browser.

**Next lesson:** A Brief History of Cryptography — journey through 2,000 years of secret communication.`,
      },
    ],
    interactiveExercise: {
      question:
        'Which cryptographic goal ensures that an attacker cannot alter a message in transit without detection?',
      instruction: 'Select the correct foundational pillar of cryptography.',
      inputType: 'choice',
      options: ['Confidentiality', 'Integrity', 'Availability', 'Anonymity'],
      correctAnswer: 'Integrity',
      hint: 'Think of data integrity — making sure the contents are unchanged and untampered.',
      explanation:
        'Integrity guarantees that unauthorized modifications (additions, deletions, alterations) are reliably detected. Confidentiality hides the content; Integrity verifies it was not modified.',
    },
  },

  // ============================================================
  // LESSON 2 — A BRIEF HISTORY OF CRYPTOGRAPHY
  // ============================================================
  {
    id: 'crypto-history',
    slug: 'history-of-cryptography',
    order: 2,
    title: 'A Brief History of Cryptography',
    category: 'foundations',
    description:
      'Journey through 2,000+ years of cryptography — from Spartan scytales and Caesar shifts to Enigma, DES, and modern post-quantum standards. Understand how each era shaped modern security thinking.',
    difficulty: 'beginner',
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
        title: 'The Codebreakers: The Comprehensive History of Secret Communication',
        author: 'D. Kahn',
        year: 1996,
        url: 'https://en.wikipedia.org/wiki/The_Codebreakers',
        type: 'book',
      },
    ],
    sections: [
      {
        id: 'introduction',
        title: 'From Sparta to Silicon',
        content: `Cryptography is not a modern invention — it is one of the oldest disciplines in information warfare, evolving continuously for over 2,000 years.

Each era introduced new techniques, new attacks, and new defenses. Understanding this history helps you recognize **recurring patterns**: every generation of ciphers was eventually broken by a smarter generation of cryptanalysts. This is why modern cryptography relies on rigorous mathematical proofs rather than clever tricks.`,
        keyPoints: [
          'Cryptography has evolved for 2,000+ years',
          'Every major cipher was eventually broken',
          'Modern crypto uses math proofs, not clever tricks',
        ],
      },
      {
        id: 'concept',
        title: 'The Five Eras of Cryptography',
        content: `Cryptography evolved through five distinct eras, each marked by major breakthroughs:

| Era | Time Period | Key Innovations | Landmark Ciphers |
|---|---|---|---|
| Classical | 500 BC – 1500 AD | Substitution, transposition | Scytale, Caesar, Atbash |
| Renaissance | 1500 – 1800 | Polyalphabetic ciphers | Vigenère, Gronsfeld |
| Mechanical | 1800 – 1950 | Rotor machines, automation | Enigma, Lorenz, Purple |
| Computer | 1950 – 2000 | Digital algorithms, DES | DES, RSA, Diffie-Hellman |
| Modern | 2000 – Present | AEAD, post-quantum | AES-GCM, Kyber, Dilithium |

Each transition was triggered by a **cryptanalytic breakthrough** that broke the previous era's ciphers.`,
      },
      {
        id: 'example',
        title: 'The Enigma Story — A Turning Point',
        content: `The breaking of the German Enigma machine in World War II is arguably the most impactful cryptanalytic event in history.

**The setup:** Enigma was a rotor-based cipher with ~10²³ possible daily key settings — seemingly unbreakable.

**The break:** Polish mathematicians (Rejewski, Różycki, Zygalski) first reverse-engineered the machine in 1932. They shared their work with Britain and France in 1939. At Bletchley Park, **Alan Turing** and team built the "Bombe" — an electromechanical device that tested Enigma settings at high speed.

**The impact:** Historians estimate that breaking Enigma shortened WWII by 2+ years and saved millions of lives. It also accelerated the invention of modern computing.

**Lesson:** Even astronomically large keyspaces can be broken if the cipher has **structural flaws** (like Enigma's never-encrypt-a-letter-to-itself property).`,
      },
      {
        id: 'visualization',
        title: 'Evolution of Keyspace',
        content: `Keyspace size grew exponentially across eras:

| Cipher | Era | Approximate Keyspace | Time to Brute-Force (Modern) |
|---|---|---|---|
| Caesar | 50 BC | 26 | < 1 ms |
| Vigenère (key=6) | 1553 | 26⁶ ≈ 3 × 10⁸ | Seconds |
| DES (56-bit) | 1977 | 2⁵⁶ ≈ 7 × 10¹⁶ | Hours (with dedicated HW) |
| AES-128 | 2001 | 2¹²⁸ ≈ 3 × 10³⁸ | Billions of years |
| AES-256 | 2001 | 2²⁵⁶ ≈ 10⁷⁷ | Physically impossible |`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Historical lessons:',
        keyPoints: [
          'Cryptography evolved through 5 distinct eras.',
          'Every era ended when cryptanalysts broke the previous ciphers.',
          'The Enigma break changed WWII — and modern computing.',
          'Keyspace alone is not enough; structure matters.',
          'Modern crypto uses mathematical proofs, not obscurity.',
        ],
      },
      {
        id: 'exercise',
        title: 'Checkpoint',
        content: 'Test your understanding of cryptographic history.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You have seen how cryptography evolved over 2,000 years — from Spartan scytales to modern AES and post-quantum algorithms. The recurring lesson: **every cipher eventually falls to a smarter cryptanalyst**, which is why modern crypto relies on rigorous math and open peer review.

**Next lesson:** Cryptography in Daily Life — see where crypto protects you every single day.`,
      },
    ],
    interactiveExercise: {
      question:
        'Which cryptanalyst is credited with breaking the German Enigma cipher during World War II?',
      instruction: 'Select the correct name.',
      inputType: 'choice',
      options: ['Alan Turing', 'Julius Caesar', 'Blaise de Vigenère', 'Whitfield Diffie'],
      correctAnswer: 'Alan Turing',
      hint: 'He worked at Bletchley Park and later pioneered theoretical computer science.',
      explanation:
        'Alan Turing led the Bletchley Park effort that broke Enigma, building the "Bombe" machine that accelerated cryptanalysis enormously.',
    },
  },

  // ============================================================
  // LESSON 3 — CRYPTOGRAPHY IN DAILY LIFE
  // ============================================================
  {
    id: 'crypto-in-daily-life',
    slug: 'crypto-in-daily-life',
    order: 3,
    title: 'Cryptography in Daily Life',
    category: 'foundations',
    description:
      'Discover how cryptography silently protects you every single day — from the moment you unlock your phone to the moment you send a chat message. See the invisible infrastructure behind modern digital trust.',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    xpReward: 35,
    references: [
      {
        title: 'Serious Cryptography: A Practical Introduction to Modern Encryption',
        author: 'J.-P. Aumasson',
        year: 2017,
        url: 'https://nostarch.com/seriouscrypto',
        type: 'book',
      },
      {
        title: 'Bulletproof SSL and TLS',
        author: 'I. Ristić',
        year: 2014,
        url: 'https://www.feistyduck.com/books/bulletproof-ssl-and-tls/',
        type: 'book',
      },
    ],
    sections: [
      {
        id: 'introduction',
        title: 'The Invisible Shield',
        content: `You interact with cryptography dozens of times per day — often without realizing it. Every time you:

- Unlock your phone with a fingerprint or PIN
- Send a WhatsApp or Signal message
- Make a contactless payment
- Log into your bank or email
- Visit a website with HTTPS
- Use a password manager
- Sign a PDF with an e-signature

...you are relying on cryptographic primitives that execute in milliseconds. This lesson maps those daily interactions to the underlying cryptographic tools.`,
        keyPoints: [
          'Cryptography protects you dozens of times daily',
          'Most users never see the underlying mechanisms',
          'Understanding these tools helps you make better security choices',
        ],
      },
      {
        id: 'concept',
        title: 'Daily Crypto Interactions',
        content: `Here is a map of common daily activities and the cryptography behind them:

| Activity | Cryptographic Tool | Purpose |
|---|---|---|
| HTTPS website visit | TLS: ECDHE + AES-GCM + X.509 | Encrypt + authenticate |
| WhatsApp message | Signal Protocol: X25519 + AES-CBC + HMAC | End-to-end encryption |
| Fingerprint unlock | Local secure enclave + cryptographic matching | Biometric authentication |
| Contactless payment | EMV: RSA/ECC + session keys | Secure transaction |
| Software update | Code signing: ECDSA/RSA + SHA-256 | Verify authenticity |
| Password manager | Argon2 / PBKDF2 + AES-256 | Protect password vault |
| E-signature | Digital signature: RSA-PSS or ECDSA | Legal non-repudiation |
| Blockchain transaction | ECDSA + SHA-256 + Merkle trees | Verify + prevent tampering |

**The pattern:** every activity uses the *right tool for the right job*. HTTPS uses AES-GCM for bulk encryption. Password managers use slow hashing (Argon2). E-signatures use asymmetric signing.`,
      },
      {
        id: 'example',
        title: 'A Day in the Life (Cryptographically Speaking)',
        content: `Walk through a typical morning:

**7:00 AM — Unlock phone with fingerprint**
Your fingerprint template is stored in a secure enclave (Apple Secure Enclave / Android Titan M), protected by AES-256. The fingerprint itself is never stored — only a cryptographic hash.

**7:15 AM — Check email**
Gmail / Outlook connects via TLS 1.3: ECDHE negotiates a session key, AES-GCM encrypts the traffic, X.509 certs authenticate Google's servers.

**7:30 AM — Pay for coffee with phone**
NFC payment uses EMV cryptography: a per-transaction cryptographic token (not your real card number) is generated, signed with your bank's private key, and verified by the payment terminal.

**8:00 AM — Send WhatsApp message**
WhatsApp uses the Signal Protocol: X25519 for key agreement, AES-CBC + HMAC-SHA256 for message encryption, and a Double Ratchet for forward secrecy.

**8:30 AM — Install software update**
Your OS verifies the update's ECDSA signature against Apple/Microsoft's root certificate, then hashes the package with SHA-256 to detect corruption.

**Every step involves cryptography — silently, correctly, in milliseconds.**`,
      },
      {
        id: 'visualization',
        title: 'Cryptography Everywhere',
        content: `The invisible crypto infrastructure:

| Layer | Cryptographic Protection |
|---|---|
| Physical device | Secure enclave, encrypted storage (AES-256) |
| Network | TLS (AES-GCM + ECDHE), IPsec VPN |
| Application | End-to-end encryption (Signal), signed updates |
| Cloud | Encrypted at rest (AES-256), in transit (TLS) |
| Identity | Digital certificates, OAuth tokens (signed JWTs) |
| Legal | Digital signatures for contracts |`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Daily-life cryptography essentials:',
        keyPoints: [
          'Cryptography protects you dozens of times a day.',
          'Every application uses the right tool for the right job.',
          'HTTPS, messaging, payments, and software updates all rely on crypto.',
          'Understanding these tools helps you evaluate security claims.',
          'Modern crypto is designed to work silently and correctly.',
        ],
      },
      {
        id: 'exercise',
        title: 'Final Checkpoint',
        content: 'Test your understanding of daily cryptography.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You have seen how cryptography protects you every day — from phone unlocks to banking transactions. Now that you know the "why", it's time to learn the **theory**.

**Next lesson:** Plaintext & Ciphertext — the two fundamental states of every cryptographic system.`,
      },
    ],
    interactiveExercise: {
      question:
        'Which cryptographic protocol is used by WhatsApp and Signal to provide end-to-end encrypted messaging?',
      instruction: 'Select the correct protocol.',
      inputType: 'choice',
      options: ['Signal Protocol', 'HTTPS / TLS', 'SSH', 'Kerberos'],
      correctAnswer: 'Signal Protocol',
      hint: 'It uses X25519, AES-CBC, HMAC-SHA256, and a Double Ratchet for forward secrecy.',
      explanation:
        'The Signal Protocol (also used by WhatsApp) combines X25519 key agreement, AES-CBC + HMAC for encryption, and a Double Ratchet for forward secrecy.',
    },
  },

  // ============================================================
  // LESSON 4 — PLAINTEXT & CIPHERTEXT
  // ============================================================
  {
    id: 'plaintext-ciphertext',
    slug: 'plaintext-and-ciphertext',
    order: 4,
    title: 'Plaintext & Ciphertext',
    category: 'foundations',
    description:
      'Understand the two fundamental states of information in cryptography — readable plaintext vs. unreadable ciphertext. Learn the mathematical notation used in cryptographic literature and why entropy matters.',
    difficulty: 'beginner',
    estimatedMinutes: 9,
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
        content: `In cryptography, every piece of information exists in one of two states:

- **Plaintext** — the original, readable form. It could be a message ("Meet me at 5 PM"), a file (a PDF report), a password, or a stream of bytes from a sensor.
- **Ciphertext** — the transformed, unreadable form produced by an encryption algorithm using a secret key.

Think of it like a sealed envelope: the letter inside is the plaintext, and the sealed envelope (which only the recipient can open) represents the ciphertext. An observer can hold the envelope, weigh it, even tear it — but they cannot read the content without breaking the seal (which requires the correct key).`,
        keyPoints: [
          'Plaintext = original readable data',
          'Ciphertext = transformed unreadable data',
          'Transformation is reversible only with the correct key',
          'Ciphertext looks like random noise to unauthorized observers',
        ],
      },
      {
        id: 'concept',
        title: 'Mathematical Notation',
        content: `Cryptographic literature uses standard notation to describe transformations:

| Symbol | Meaning |
|---|---|
| P or M | Plaintext (or Message) |
| C | Ciphertext |
| K | Secret Key |
| E | Encryption function: C = E(K, P) |
| D | Decryption function: P = D(K, C) |

For a correctly designed cipher, decryption with the correct key always recovers the original plaintext: **D(K, E(K, P)) = P**.

If an attacker without the key tries to decrypt, the result is either an error or gibberish — never the original message.`,
        codeSnippet: {
          language: 'typescript',
          code: `// Conceptual transformation
const plaintext  = "TRANSFER $50,000 TO ACCOUNT #4092";
const key        = "k7$9Fm#2pLq9v1X!";
const ciphertext = encrypt(plaintext, key);
// ciphertext: "a7c810d93be4e8b3938b82c..."  ← high-entropy noise

// Reversibility check:
const recovered  = decrypt(ciphertext, key);
console.log(recovered === plaintext);  // true`,
          caption: 'Encryption transforms readable text into high-entropy ciphertext',
        },
      },
      {
        id: 'example',
        title: 'Entropy and Randomness',
        content: `A well-designed modern cipher produces ciphertext with **maximum Shannon entropy** — every bit has approximately a 50% probability of being 0 or 1. This means:

- **No patterns**: no repeated letters, no recognizable words, no structural hints.
- **No bias**: not more zeros than ones (or vice versa).
- **Statistical indistinguishability**: the ciphertext looks the same as truly random bytes.

Any discernible pattern in ciphertext is a **security flaw** that cryptanalysts exploit. Historical ciphers (like Caesar) leaked structure; modern ciphers (like AES-GCM) do not.

**Example entropy comparison:**

| Data Type | Entropy Level | Detectable Pattern? |
|---|---|---|
| English text | Low | Yes — letter frequencies |
| Base64 string | Medium | Yes — limited alphabet |
| AES-GCM ciphertext | High (≈ 8 bits/byte) | No — indistinguishable from random |
| Random bytes | Maximum (8 bits/byte) | Not applicable |`,
      },
      {
        id: 'visualization',
        title: 'State Comparison',
        content: `How plaintext and ciphertext differ across key properties:

| Property | Plaintext | Ciphertext |
|---|---|---|
| Readability | Human-readable | Appears random |
| Entropy | Low (predictable syntax) | High (uniform distribution) |
| Frequency patterns | Present (E most common in English) | Absent (uniform) |
| Can be intercepted | Yes — dangerous | Yes — but safe if cipher is strong |
| Reversible? | Not applicable | Only with the correct key |`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Review these fundamental concepts:',
        keyPoints: [
          'Plaintext is unencrypted, intelligible data.',
          'Ciphertext is the encrypted, seemingly random result of a cipher.',
          'Standard notation: C = E(K, P), P = D(K, C).',
          'High entropy in ciphertext prevents pattern analysis.',
          'Encryption is reversible only with the correct key.',
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
        content: `You now understand the distinction between Plaintext and Ciphertext, and how ciphers enforce high entropy output to defeat pattern analysis. You also learned the standard mathematical notation used throughout cryptographic literature.

**Next lesson:** Encryption & Decryption — the two reversible phases of cryptographic transformation.`,
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
  // LESSON 5 — ENCRYPTION & DECRYPTION
  // ============================================================
  {
    id: 'enc-dec',
    slug: 'encryption-and-decryption',
    order: 5,
    title: 'Encryption & Decryption',
    category: 'mechanisms',
    description:
      "Learn the two reversible phases of cryptographic transformation and how keys govern the process. Discover Kerckhoffs's Principle — the foundation of all modern security thinking — and why open algorithms with secret keys are safer than secret algorithms.",
    difficulty: 'beginner',
    estimatedMinutes: 11,
    xpReward: 30,
    references: [
      {
        title: "La Cryptographie Militaire (Kerckhoffs's Principle, 1883)",
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
        content: `**Encryption** is the process of converting plaintext into ciphertext using an algorithm (cipher) and a secret key. **Decryption** is the exact inverse process: reconstructing the original plaintext from the ciphertext using the same key (symmetric) or a mathematically related key (asymmetric).

For a cipher to be useful, two conditions must hold:

1. **Reversibility with the correct key** — the intended recipient must be able to recover the plaintext.
2. **Infeasibility without the key** — an attacker with unlimited computational resources (within reason) must not be able to decrypt the message.

If either condition fails, the cipher is broken.`,
        keyPoints: [
          'Encryption: plaintext → ciphertext using key + algorithm',
          'Decryption: ciphertext → plaintext using the correct key',
          'Without the key, decryption should be computationally infeasible',
          'Loss of the key means permanent loss of access to the data',
        ],
      },
      {
        id: 'concept',
        title: "Kerckhoffs's Principle and Shannon's Maxim",
        content: `In 1883, Dutch cryptographer Auguste Kerckhoffs published a foundational principle that still guides modern security engineering:

> *"A cryptographic system should be secure even if everything about the system, except the key, is public knowledge."*

Claude Shannon later restated this as **Shannon's Maxim**: *"The enemy knows the system."*

**Why does this matter?** Because relying on secrecy of the algorithm is a trap called **security through obscurity**. History proves it always fails:

| Case | Obscurity Attempt | Reality |
|---|---|---|
| Enigma (WWII) | Algorithm kept secret | Captured machines + Polish math broke it |
| DVD CSS (1999) | Proprietary obfuscation | Reverse-engineered in weeks |
| Custom crypto (various) | "Our algorithm is unique" | Broken by security researchers |

**The right approach**: publish the algorithm, keep only the key secret. This is why AES, RSA, SHA-256, and ChaCha20 are all publicly documented — and still secure after decades of scrutiny.`,
        codeSnippet: {
          language: 'typescript',
          code: `// Kerckhoffs's Principle in practice
// The algorithm (AES-GCM) is completely public:
import { aesGcmEncrypt, aesGcmDecrypt } from './webcrypto/aes';

// Security depends ONLY on the secrecy of 'secretKey':
const ciphertext = await aesGcmEncrypt(plaintext, secretKey);
const decrypted  = await aesGcmDecrypt(ciphertext, secretKey);

console.log(decrypted === plaintext); // true

// An attacker knows AES-GCM inside-out — but without
// 'secretKey', they cannot decrypt anything.`,
        },
      },
      {
        id: 'example',
        title: 'Symmetric vs Asymmetric Encryption',
        content: `Modern cryptography uses two main types of encryption:

| Aspect | Symmetric | Asymmetric |
|---|---|---|
| Keys used | 1 shared key | 2 keys (public + private) |
| Speed | Very fast (AES: ~1 GB/s) | Slow (~1000× slower) |
| Key distribution | Requires secure channel | Public key can be shared openly |
| Use case | Bulk encryption (files, streams) | Key exchange, signatures |
| Example | AES-GCM, ChaCha20 | RSA-OAEP, ECDH |
| Security basis | Confusion + diffusion | Hard math problems (factoring, DL) |

**Real-world pattern**: TLS (HTTPS) uses asymmetric crypto only to establish a session key, then switches to symmetric crypto for the actual data — combining the best of both worlds.`,
        keyPoints: [
          'Symmetric: same key for encrypt & decrypt, very fast',
          'Asymmetric: public key to encrypt, private key to decrypt',
          'Real protocols (TLS) combine both',
        ],
      },
      {
        id: 'visualization',
        title: 'The Transformation Cycle',
        content: `Encryption and decryption form a reversible cycle:

| Step | Input | Operation | Output |
|---|---|---|---|
| 1 | Plaintext P | C = E(K, P) | Ciphertext C |
| 2 | Ciphertext C | P = D(K, C) | Plaintext P |
| 3 | Verify | Compare P to original | Must match exactly |`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Core takeaways for encryption and decryption:',
        keyPoints: [
          'Encryption turns readable data into ciphertext; decryption reverses it.',
          'Never rely on secret algorithms — always rely on secret keys.',
          "Kerckhoffs's Principle: assume the enemy knows your system.",
          'Symmetric is fast; asymmetric solves key distribution.',
          'Real systems combine both (hybrid encryption).',
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
        content: `You understand the dual nature of encryption/decryption, the historical foundation of Kerckhoffs's Principle, and the trade-offs between symmetric and asymmetric cryptography.

**Next lesson:** Encoding vs Encryption — a common source of critical security mistakes.`,
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
  // LESSON 6 — ENCODING VS ENCRYPTION
  // ============================================================
  {
    id: 'encoding-vs-encryption',
    slug: 'encoding-vs-encryption',
    order: 6,
    title: 'Encoding vs Encryption',
    category: 'foundations',
    description:
      'A critical cybersecurity distinction: why Base64 or Hex is NOT encryption. Discover the catastrophic consequences of confusing encoding with encryption — a mistake that has leaked millions of credentials in real-world data breaches.',
    difficulty: 'beginner',
    estimatedMinutes: 11,
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
        content: `One of the most common — and most dangerous — mistakes made by software engineers is treating **encoding** (Base64, Hex, URL-encoding) as **encryption**.

**Encoding is NOT encryption.** It provides zero confidentiality and no security whatsoever.

If you Base64-encode a password, anyone can decode it in one line of code. If you Hex-encode an API key, anyone with a decoder can read it instantly. There is **no key**, and there is **no secret** — the transformation is fully reversible by anyone.

This mistake has real consequences: in 2019, researchers found thousands of mobile apps and web services storing user credentials or API tokens using Base64 encoding, assuming it provided protection. It did not.`,
        keyPoints: [
          'Encoding is for compatibility — not secrecy',
          'Anyone can decode Base64 or Hex in milliseconds',
          'Encryption requires a secret key; encoding does not',
          'Never use encoding to hide passwords, tokens, or identifiers',
        ],
      },
      {
        id: 'concept',
        title: 'The Three Pillars: Encoding, Encryption, Hashing',
        content: `These three concepts are often confused. Here is the definitive comparison:

| Attribute | Encoding (Base64) | Encryption (AES) | Hashing (SHA-256) |
|---|---|---|---|
| Purpose | Transmission compatibility | Confidentiality | Integrity verification |
| Requires key? | NO | YES | NO |
| Reversible? | YES — trivially | YES — with the key | NO — one-way |
| Output length | Larger than input | Same or larger | Fixed (e.g., 256 bits) |
| Example input | "Hello" | "Hello" | "Hello" |
| Example output | "SGVsbG8=" | "9a8f2b1c7e..." | "185f8db32271..." |
| Anyone can reverse? | YES | Only with the key | NO — impossible |
| Use case | Email attachments, JSON | File/database encryption | Password storage, checksums |

**Rule of thumb:**
- If you can decode it in your browser console with no password → it's **encoding**.
- If it needs a key to reverse → it's **encryption**.
- If it cannot be reversed → it's **hashing**.`,
        codeSnippet: {
          language: 'bash',
          code: `# Base64 (ENCODING) — instant, no secret needed:
$ echo "SGVsbG8gV29ybGQ=" | base64 --decode
Hello World

# Hex (ENCODING) — same story:
$ echo "48656c6c6f" | xxd -r -p
Hello

# AES (ENCRYPTION) — needs the key. No key = no plaintext.
$ openssl enc -d -aes-256-cbc -in encrypted.bin
enter aes-256-cbc decryption password:`,
          caption: 'Encoding needs no credentials; encryption does',
        },
      },
      {
        id: 'example',
        title: 'Why Base64 Exists (And Its Real Purpose)',
        content: `Base64 was invented for a specific practical purpose: **transporting binary data across systems that only support ASCII text.**

Email (SMTP), JSON APIs, and many legacy protocols were designed around 7-bit ASCII — they cannot carry raw binary bytes (like image data, cryptographic keys, or compressed archives). Base64 solves this by mapping every 3 bytes of binary into 4 ASCII characters from a safe subset (A-Z, a-z, 0-9, +, /).

**The trade-off:**
- ✅ Safe transmission across text-only channels
- ✅ Reversible with no information loss
- ❌ 33% larger output (4 chars per 3 bytes)
- ❌ Zero confidentiality — never intended as security

Common legitimate uses: email attachments (MIME), JSON Web Tokens (structure only), inline images in HTML/CSS (data URIs).`,
      },
      {
        id: 'visualization',
        title: 'Visual Representation',
        content: `Two distinct transformation paths:

| Path | Algorithm | Key? | Result |
|---|---|---|---|
| Encoding | Public, fixed (e.g., Base64) | No key | Encoded string (decodable by anyone) |
| Encryption | Public algorithm + secret key | Yes | Ciphertext (secure) |

Both produce output that looks "scrambled" to an untrained eye — but only one of them is actually protecting your data.`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Remember the golden rules:',
        keyPoints: [
          'Never use Base64 or Hex to hide passwords, tokens, or PII.',
          'Encoding = format change for transmission (no security).',
          'Encryption = confidentiality via a secret key (reversible only with key).',
          'Hashing = irreversible integrity verification.',
          'Rule: if anyone can reverse it without a password, it is not encryption.',
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
        content: `You can now confidently explain the difference between encoding, encryption, and hashing — and identify the dangerous confusion that has caused real-world data breaches.

**Next lesson:** Threat Models & Attackers — who are we actually protecting against?`,
      },
    ],
    interactiveExercise: {
      question: 'Is Base64 considered an encryption algorithm?',
      instruction: 'Answer by selecting the correct statement.',
      inputType: 'choice',
      options: [
        'No, it is an encoding scheme with no key and zero confidentiality',
        'Yes, because the text looks scrambled',
      ],
      correctAnswer:
        'No, it is an encoding scheme with no key and zero confidentiality',
      hint: 'Does Base64 require a secret password or key to decode?',
      explanation:
        'Base64 is strictly an encoding format designed for safe data transmission across text protocols. It requires no secret key and provides no security.',
    },
  },

  // ============================================================
  // LESSON 7 — THREAT MODELS & ATTACKERS
  // ============================================================
  {
    id: 'threat-models',
    slug: 'threat-models',
    order: 7,
    title: 'Threat Models & Attackers',
    category: 'security',
    description:
      'Before choosing a cipher, you must know who you are defending against. Learn about different attacker types — from passive eavesdroppers to quantum adversaries — and how security engineers model threats.',
    difficulty: 'beginner',
    estimatedMinutes: 11,
    xpReward: 40,
    references: [
      {
        title: 'Introduction to Modern Cryptography (3rd Edition)',
        author: 'J. Katz, Y. Lindell',
        year: 2020,
        url: 'https://www.taylorfrancis.com/books/mono/10.1201/9781351133036/introduction-modern-cryptography-jonathan-katz-yehuda-lindell',
        type: 'book',
      },
      {
        title: 'NIST SP 800-30 Rev. 1: Guide for Conducting Risk Assessments',
        author: 'NIST',
        year: 2012,
        url: 'https://csrc.nist.gov/publications/detail/sp/800-30/rev-1/final',
        type: 'standard',
      },
    ],
    sections: [
      {
        id: 'introduction',
        title: 'Who Are You Defending Against?',
        content: `Before you choose a cipher, you must answer a fundamental question: **who is the adversary?**

Different attackers have different capabilities:
- A **curious teenager** can run tools they downloaded.
- A **corporate spy** can afford specialized hardware.
- A **nation-state** can invest millions and employ hundreds of PhD cryptanalysts.

Designing for the wrong threat model wastes resources (over-engineering) or leaves you vulnerable (under-engineering). Modern cryptography defines security against **explicit, well-defined attacker capabilities**.`,
        keyPoints: [
          'Choose crypto based on who you defend against',
          'Different attackers have different capabilities',
          'Over-engineering wastes resources; under-engineering is dangerous',
        ],
      },
      {
        id: 'concept',
        title: 'Common Attacker Types',
        content: `Security engineers classify attackers by capability:

| Attacker | Typical Capability | Common Goals |
|---|---|---|
| Passive eavesdropper (Eve) | Reads traffic, cannot modify | Learn secrets |
| Active attacker (Mallory) | Reads + modifies + injects | Alter messages, impersonate |
| Insider | Has legitimate access | Exfiltrate, sabotage |
| Nation-state | Huge budget, custom hardware, zero-days | Espionage, disruption |
| Quantum adversary | Future quantum computer | Break RSA/ECC |
| Physical attacker | Has the device | Extract keys, side-channel |

**Modern ciphers are designed for the strongest realistic threat**:
- AES-256 resists all classical attackers.
- RSA-OAEP resists all classical attackers (until quantum).
- Post-quantum ciphers (Kyber, Dilithium) resist quantum attackers.`,
      },
      {
        id: 'example',
        title: 'Attack Models in Cryptographic Literature',
        content: `Modern cryptography defines security under specific **attack models** — each assumes the adversary can do certain things:

| Attack Model | Attacker Can... | Example Cipher Requirement |
|---|---|---|
| COA (Ciphertext-Only) | See only ciphertext | Basic confidentiality |
| KPA (Known-Plaintext) | Know some plaintext/ciphertext pairs | Prevent key recovery from pairs |
| CPA (Chosen-Plaintext) | Encrypt arbitrary plaintexts | Standard for modern ciphers |
| CCA (Chosen-Ciphertext) | Decrypt arbitrary ciphertexts | Strongest — required for AEAD |

**Why this matters:** A cipher secure under COA may fail under CCA. Modern standards (like AES-GCM, RSA-OAEP) are proven secure under CCA — the strongest model — because real attackers often have more power than textbook examples suggest.`,
      },
      {
        id: 'visualization',
        title: 'Attack Strength Hierarchy',
        content: `Strength ordering (weakest → strongest):

| Rank | Attack Model | Attacker Power |
|---|---|---|
| 1 | Ciphertext-Only (COA) | Passive |
| 2 | Known-Plaintext (KPA) | Has examples |
| 3 | Chosen-Plaintext (CPA) | Can encrypt |
| 4 | Chosen-Ciphertext (CCA) | Can decrypt + encrypt |
| 5 | CCA2 | Adaptive + unlimited |`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Threat model essentials:',
        keyPoints: [
          'Always identify your adversary before choosing crypto.',
          'Passive vs active attackers require different defenses.',
          'Modern ciphers are designed for CCA (strongest) security.',
          'Nation-state attackers require long keys (AES-256, RSA-3072+).',
          'Quantum attackers require post-quantum ciphers.',
        ],
      },
      {
        id: 'exercise',
        title: 'Checkpoint',
        content: 'Test your understanding of threat models.',
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You now understand the different classes of attackers and how security engineers model threats. This framework is essential for choosing the right cryptographic tools for a given situation.

**Next lesson:** CIA Triad — the foundational security model.`,
      },
    ],
    interactiveExercise: {
      question:
        'Which attacker capability model assumes the adversary can both encrypt arbitrary plaintexts AND decrypt arbitrary ciphertexts?',
      instruction: 'Select the strongest attack model.',
      inputType: 'choice',
      options: [
        'Chosen-Ciphertext Attack (CCA)',
        'Ciphertext-Only Attack (COA)',
        'Known-Plaintext Attack (KPA)',
        'Chosen-Plaintext Attack (CPA)',
      ],
      correctAnswer: 'Chosen-Ciphertext Attack (CCA)',
      hint: 'It combines CPA with decryption ability — the strongest standard model.',
      explanation:
        'CCA is the strongest standard attack model. Modern AEAD ciphers like AES-GCM are proven secure under CCA, which is why they are trusted for real-world use.',
    },
  },

  // ============================================================
  // LESSON 8 — CIA TRIAD
  // ============================================================
  {
    id: 'cia-triad',
    slug: 'cia-triad-security',
    order: 8,
    title: 'Confidentiality, Integrity & Availability (CIA)',
    category: 'security',
    description:
      'The capstone of cybersecurity fundamentals: synthesize the CIA Triad and how cryptographic tools defend each pillar. Learn why every modern security architecture is built on these three foundations.',
    difficulty: 'beginner',
    estimatedMinutes: 12,
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
        title:
          'NIST FIPS 199: Standards for Security Categorization of Federal Information and Information Systems',
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
        content: `The **CIA Triad** — Confidentiality, Integrity, and Availability — is the foundational model guiding every modern information security policy, standard, and architecture.

It is called a "triad" because the three pillars are interdependent: sacrificing one weakens the others. For example, encrypting data too aggressively (Confidentiality) may make it inaccessible during a disaster (Availability). A robust system must **balance all three**.

When cryptography is applied correctly, it simultaneously supports all three pillars — plus two additional properties (**Authenticity** and **Non-Repudiation**) that extend the model for modern digital trust.`,
        keyPoints: [
          'Confidentiality: protect data from unauthorized viewing',
          'Integrity: protect data from unauthorized modification',
          'Availability: ensure authorized users have uninterrupted access',
          'Extended: Authenticity + Non-Repudiation',
        ],
      },
      {
        id: 'concept',
        title: 'Mapping Cryptography to the Security Pillars',
        content: `Every cryptographic tool in ChiperLab serves one or more pillars:

| Pillar | Cryptographic Mechanism | Real-World Application |
|---|---|---|
| Confidentiality | Symmetric (AES-GCM), Asymmetric (RSA-OAEP) | HTTPS payloads, disk encryption (BitLocker, FileVault), messaging apps |
| Integrity | Cryptographic hashes (SHA-256), HMAC | File checksums, git commits, blockchain, TLS auth tags |
| Availability | Redundancy + DDoS defense (not crypto, but complementary) | CDNs, failover clusters, backups |
| Authenticity | Digital signatures (ECDSA, RSA-PSS), X.509 certs | Website certificates, code signing, document signing |
| Non-Repudiation | Asymmetric digital signatures | Legal e-contracts, banking confirmations, blockchain |

**Notice:** Cryptography primarily handles Confidentiality, Integrity, Authenticity, and Non-Repudiation. Availability is usually handled by infrastructure (redundancy, rate limiting), though crypto protects it indirectly (e.g., preventing attackers from forging traffic).`,
      },
      {
        id: 'example',
        title: 'Case Study: A $10,000 Wire Transfer',
        content: `When you send a wire transfer through your banking app, all three CIA pillars activate simultaneously:

1. **Confidentiality** — AES-GCM encrypts your account number, recipient, and amount. A network sniffer on public Wi-Fi sees only random bytes.
2. **Integrity** — The same AES-GCM produces an authentication tag. If any byte of the encrypted message is modified in transit, the receiving server rejects it instantly.
3. **Authenticity** — Your session is bound to a server certificate (ECDSA-signed). You know you are really talking to the bank, not an imposter.
4. **Non-Repudiation** — Your 2FA code (or digital signature) proves you authorized the transfer. You cannot later claim "the bank did it without my permission."

**Without cryptography**: an attacker on the same coffee shop Wi-Fi could read your account number, change the amount, and impersonate the bank. **With cryptography**: all three pillars are protected by default.`,
      },
      {
        id: 'visualization',
        title: 'The Extended CIA Model',
        content: `The complete security model:

| Property | What It Protects Against | Cryptographic Tool |
|---|---|---|
| Confidentiality | Eavesdropping | Encryption (AES, RSA) |
| Integrity | Tampering | Hash (SHA-256), MAC, AEAD tag |
| Availability | Disruption | Redundancy (non-crypto, but crypto-enabled) |
| Authenticity | Impersonation | Digital signatures, certificates |
| Non-Repudiation | Denial of action | Digital signatures (private-key bound) |`,
      },
      {
        id: 'takeaways',
        title: 'Key Takeaways',
        content: 'Final review of fundamentals:',
        keyPoints: [
          'Security is a holistic triangle: Confidentiality, Integrity, and Availability.',
          'Extended model adds Authenticity and Non-Repudiation.',
          'Never rely on a single defensive tool.',
          'Cryptography handles Confidentiality, Integrity, Authenticity, and Non-Repudiation.',
          'Knowing which tool solves which threat is the hallmark of a security professional.',
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
        content: `You have completed all **8 beginner lessons**. You now understand:

- What cryptography is and why it matters
- 2,000 years of cryptographic history
- How crypto protects you daily
- The two states of information (plaintext & ciphertext)
- How encryption and decryption work
- The critical distinction between encoding and encryption
- Threat models and attacker types
- The CIA Triad and its extensions

You are now ready for the **intermediate track** — where you will learn the actual mechanisms behind the tools you use daily.`,
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