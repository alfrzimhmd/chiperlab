import { AlgorithmCategory, DifficultyLevel } from '../types/crypto';

export interface AlgorithmDetail {
  id: string;
  name: string;
  category: AlgorithmCategory;
  difficulty: DifficultyLevel;
  tagline: string;
  description: string;
  overview: string;
  history: string;
  howItWorks: string;
  formula: {
    title: string;
    encryption: string;
    decryption: string;
    notes?: string;
  };
  example: {
    plaintext: string;
    key: string;
    ciphertext: string;
    walkthrough: string;
  };
  securityNotes: string[];
  playgroundRoute: string;
  defaultDemoKey: string;
  defaultDemoInput: string;
}

export const ALGORITHMS: AlgorithmDetail[] = [
  {
    id: 'caesar',
    name: 'Caesar Cipher',
    category: 'classical',
    difficulty: 'beginner',
    tagline: 'The ancient monoalphabetic shift cipher used by Julius Caesar',
    description: 'A substitution cipher where each letter in the plaintext is shifted by a fixed number of positions down the alphabet.',
    overview: 'The Caesar Cipher is one of the simplest and most widely known classical encryption techniques. It is a type of substitution cipher where each letter in the plaintext is replaced by a letter some fixed number of positions down the alphabet.',
    history: 'Named after Julius Caesar, who used it with a shift of 3 (A becomes D, B becomes E) to protect messages of military significance to his generals during the Gallic Wars (circa 58–50 BC). Suetonius recorded in The Twelve Caesars that Caesar would use this substitution whenever he wrote confidential dispatches.',
    howItWorks: 'The algorithm assigns each letter of the alphabet an integer from 0 to 25 (A=0, B=1, ... Z=25). The encryption function adds the secret shift key k to the position and applies modulo 26 to wrap around back to the beginning of the alphabet. Decryption subtracts the key modulo 26.',
    formula: {
      title: 'Mathematical Formulation',
      encryption: 'E(x) = (x + k) mod 26',
      decryption: 'D(x) = (x - k + 26) mod 26',
      notes: 'Where x is the numeric position of the plaintext character (0-25) and k is the shift key (1-25).',
    },
    example: {
      plaintext: 'HELLO WORLD',
      key: '3',
      ciphertext: 'KHOOR ZRUOG',
      walkthrough: 'H (7) + 3 = K (10)\nE (4) + 3 = H (7)\nL (11) + 3 = O (14)\nL (11) + 3 = O (14)\nO (14) + 3 = R (17)',
    },
    securityNotes: [
      'Extremely weak: keyspace has only 25 possible shifts, easily brute-forced in milliseconds by hand or script.',
      'Vulnerable to Frequency Analysis: letter distribution in the ciphertext exactly mirrors the plaintext, just shifted.',
      'Must never be used for real security; purely educational.',
    ],
    playgroundRoute: '/playground?algo=caesar',
    defaultDemoKey: '3',
    defaultDemoInput: 'DEFEND THE EAST WALL',
  },
  {
    id: 'atbash',
    name: 'Atbash Cipher',
    category: 'classical',
    difficulty: 'beginner',
    tagline: 'Ancient Hebrew monoalphabetic mirror substitution',
    description: 'An inversion cipher that maps each letter to its reverse counterpart in the alphabet (A becomes Z, B becomes Y).',
    overview: 'The Atbash cipher is a specific type of monoalphabetic substitution cipher originally developed for the Hebrew alphabet. In this cipher, the alphabet is folded in half and reversed: the first letter maps to the last letter, the second letter to the second-to-last letter, and so forth.',
    history: 'Originating around 500 BC, biblical scholars found Atbash in several passages of the Hebrew Bible (Tanakh), specifically in the Book of Jeremiah where the name "Babel" (Babylon) is enciphered as "Sheshach" using Atbash.',
    howItWorks: 'Because the cipher mirrors the 26-letter alphabet around its midpoint, encryption and decryption are identical operations (involutory). If A maps to Z, then Z maps back to A.',
    formula: {
      title: 'Mathematical Formulation',
      encryption: 'E(x) = (25 - x)',
      decryption: 'D(x) = (25 - x)',
      notes: 'Encryption and decryption share the exact same mathematical formula (self-inverting).',
    },
    example: {
      plaintext: 'SECURITY',
      key: 'None (Fixed Inversion)',
      ciphertext: 'HVXFIRGB',
      walkthrough: 'S (18) → 25 - 18 = 7 (H)\nE (4) → 25 - 4 = 21 (V)\nC (2) → 25 - 2 = 23 (X)\nU (20) → 25 - 20 = 5 (F)\nR (17) → 25 - 17 = 8 (I)\nI (8) → 25 - 8 = 17 (R)\nT (19) → 25 - 19 = 6 (G)\nY (24) → 25 - 24 = 1 (B)',
    },
    securityNotes: [
      'Provides zero security: there is no key, only a fixed substitution rule.',
      'Anyone who knows the algorithm can invert the text immediately.',
      'Directly preserves frequency distribution of natural language.',
    ],
    playgroundRoute: '/playground?algo=atbash',
    defaultDemoKey: '',
    defaultDemoInput: 'ATTACK AT DAWN',
  },
  {
    id: 'vigenere',
    name: 'Vigenère Cipher',
    category: 'classical',
    difficulty: 'intermediate',
    tagline: 'The polyalphabetic cipher once hailed as le chiffre indéchiffrable',
    description: 'A method of encrypting alphabetic text using a series of interwoven Caesar ciphers based on the letters of a keyword.',
    overview: 'The Vigenère cipher is a polyalphabetic substitution cipher that resisted cryptanalysis for over three centuries. Unlike monoalphabetic ciphers, it masks single-letter frequency analysis by using a keyword to shift each letter by differing amounts.',
    history: 'First described by Giovan Battista Bellaso in 1553, it was later misattributed to Blaise de Vigenère in the 19th century. For over 300 years it was nicknamed "le chiffre indéchiffrable" (the indecipherable cipher) until Charles Babbage and Friedrich Kasiski independently broke it in the 1850s-1860s.',
    howItWorks: 'The sender chooses a keyword, repeats it to match the length of the plaintext, and shifts each plaintext character by the corresponding letter of the key. If the key is KEY, the first letter shifts by K (10), second by E (4), third by Y (24), and repeats.',
    formula: {
      title: 'Mathematical Formulation',
      encryption: 'C_i = (P_i + K_{i \\pmod m}) \\pmod{26}',
      decryption: 'P_i = (C_i - K_{i \\pmod m} + 26) \\pmod{26}',
      notes: 'Where m is the length of the repeated keyword K.',
    },
    example: {
      plaintext: 'CYBERSECURITY',
      key: 'LOCK',
      ciphertext: 'NMMBPDRNEFCFE',
      walkthrough: 'C + L(11) = N\nY + O(14) = M\nB + C(2)  = D\nE + K(10) = O...',
    },
    securityNotes: [
      'Vulnerable to Kasiski Examination: finding repeated patterns in ciphertext reveals the key length m.',
      'Once key length is deduced, the ciphertext splits into m distinct Caesar ciphers, solved by standard frequency analysis.',
      'If the key is as long as the message and truly random, it becomes a One-Time Pad (theoretically unbreakable).',
    ],
    playgroundRoute: '/playground?algo=vigenere',
    defaultDemoKey: 'CIPHER',
    defaultDemoInput: 'CRYPTOGRAPHY IS BEAUTIFUL',
  },
  {
    id: 'xor',
    name: 'XOR Cipher',
    category: 'classical',
    difficulty: 'beginner',
    tagline: 'The foundational bitwise building block of all modern digital ciphers',
    description: 'Combines plaintext bytes with key bytes using the binary exclusive-OR logic operator.',
    overview: 'The Exclusive-OR (XOR) operation is the fundamental mathematical primitive of digital cryptography. When applied to bits: 0 ^ 0 = 0, 1 ^ 1 = 0, and 1 ^ 0 = 1. A key property is that applying XOR twice restores the original input: (A ^ B) ^ B = A.',
    history: 'Gilbert Vernam patented the XOR teleprinter cipher in 1917, which became the basis for the One-Time Pad (OTP) and modern stream ciphers. Today, every modern cipher—including AES, ChaCha20, and SHA-2—uses XOR millions of times per second.',
    howItWorks: 'Plaintext characters are converted to binary byte representations (8 bits). Each bit is XORed against the corresponding bit of the repeated key. The output can be formatted as hex or ASCII.',
    formula: {
      title: 'Mathematical Formulation',
      encryption: 'C_i = P_i \\oplus K_i',
      decryption: 'P_i = C_i \\oplus K_i',
      notes: 'Because XOR is involutory (A ⊕ B ⊕ B = A), the exact same code encrypts and decrypts.',
    },
    example: {
      plaintext: 'FLAG',
      key: 'KEY',
      ciphertext: '0F 09 18 0C (Hex)',
      walkthrough: 'F (01000110) ^ K (01001011) = 00001101 (0x0D)\nL (01001100) ^ E (01000101) = 00001001 (0x09)...',
    },
    securityNotes: [
      'Single-byte or repeating-key XOR is easily broken using frequency analysis of common characters (like space 0x20).',
      'Never reuse an XOR key across multiple messages (Two-Time Pad attack: C1 ⊕ C2 = P1 ⊕ P2).',
      'When combined with a non-repeating cryptographically secure PRNG, XOR forms the core of modern stream ciphers.',
    ],
    playgroundRoute: '/playground?algo=xor',
    defaultDemoKey: 'SECRETKEY',
    defaultDemoInput: 'Confidential message payload',
  },
  {
    id: 'aes',
    name: 'AES (AES-GCM)',
    category: 'modern',
    difficulty: 'advanced',
    tagline: 'The global benchmark for authenticated symmetric encryption',
    description: 'The Advanced Encryption Standard operating in Galois/Counter Mode (GCM) providing high-throughput confidentiality and integrity verification.',
    overview: 'AES (Rijndael) is the US federal government standard for encrypting sensitive and classified data, adopted in 2001. When configured with Galois/Counter Mode (GCM), it is an Authenticated Encryption with Associated Data (AEAD) cipher, protecting against both eavesdropping and tampering.',
    history: 'In 1997, NIST announced a global public competition to replace the aging DES cipher. Belgian cryptographers Joan Daemen and Vincent Rijmen submitted Rijndael, which won the competition after thorough public cryptanalysis and was formalized as FIPS PUB 197.',
    howItWorks: 'AES-256 processes 128-bit blocks through 14 rounds of four algebraic steps: SubBytes (non-linear S-box substitution), ShiftRows (cyclic permutation), MixColumns (matrix multiplication in Galois Field GF(2^8)), and AddRoundKey (bitwise XOR with subkeys derived via key schedule). GCM adds a universal hash authentication tag.',
    formula: {
      title: 'Structural Architecture',
      encryption: 'Round(State) = AddRoundKey(MixColumns(ShiftRows(SubBytes(State))))',
      decryption: 'InvRound(State) = AddRoundKey(InvSubBytes(InvShiftRows(InvMixColumns(State))))',
      notes: 'Operates over Galois Field GF(2^8) with irreducible polynomial x^8 + x^4 + x^3 + x + 1.',
    },
    example: {
      plaintext: 'Secure banking transaction data payload',
      key: '256-bit cryptographic hex key',
      ciphertext: '12-byte IV + AES-GCM encrypted ciphertext + 16-byte authentication tag',
      walkthrough: 'Plaintext is encrypted in counter mode; the GMAC authentication tag verifies every byte upon decryption.',
    },
    securityNotes: [
      'No practical attack exists against AES-256: exhaustive key search requires 2^256 operations.',
      'Hardware acceleration (AES-NI) is baked into modern Intel, AMD, and ARM processors.',
      'CRITICAL: Nonce/IV must NEVER be reused with the same key in GCM mode.',
    ],
    playgroundRoute: '/playground?algo=aes-gcm',
    defaultDemoKey: 'Generate 256-bit Hex Key',
    defaultDemoInput: 'Top secret authorization token',
  },
  {
    id: 'rsa',
    name: 'RSA (RSA-OAEP)',
    category: 'modern',
    difficulty: 'advanced',
    tagline: 'The revolutionary public-key asymmetric algorithm based on prime factorization',
    description: 'Enables secure key exchange and encryption without a pre-shared secret using 2048-bit prime number mathematics.',
    overview: 'RSA is the most widely recognized asymmetric cryptosystem in the world. It uses a pair of keys: a public key for encryption and a private key for decryption. RSA-OAEP (Optimal Asymmetric Encryption Padding) is the modern standard format that prevents mathematical chosen-ciphertext attacks.',
    history: 'Invented in 1977 by Ron Rivest, Adi Shamir, and Leonard Adleman at MIT. In 1997, it was declassified that Clifford Cocks at the British intelligence agency GCHQ had conceived an equivalent system in 1973.',
    howItWorks: 'Generate two huge prime numbers p and q. Compute the modulus N = p * q and Euler\'s totient φ(N) = (p - 1)(q - 1). Choose public exponent e (usually 65537) and compute private exponent d such that (d * e) ≡ 1 mod φ(N). Encryption is C = M^e mod N; decryption is M = C^d mod N.',
    formula: {
      title: 'Mathematical Formulation',
      encryption: 'C = M^e \\pmod N',
      decryption: 'M = C^d \\pmod N',
      notes: 'Where (e, N) is the Public Key and (d, N) is the Private Key.',
    },
    example: {
      plaintext: 'Meeting at dawn',
      key: '2048-bit Public Key',
      ciphertext: '256-byte (2048-bit) hex encoded OAEP-padded ciphertext',
      walkthrough: 'Plaintext padded with OAEP random noise, then raised to exponent e modulo N.',
    },
    securityNotes: [
      'Minimum key length today is 2048 bits; 3072 bits is recommended for long-term security.',
      'Textbook RSA (without OAEP padding) is completely insecure due to mathematical malleability.',
      'Quantum computers using Shor\'s Algorithm could theoretically factor large primes, driving the transition to Post-Quantum Cryptography (PQC).',
    ],
    playgroundRoute: '/playground?algo=rsa-oaep',
    defaultDemoKey: 'Generate 2048-bit Key Pair',
    defaultDemoInput: 'Sensitive negotiation document',
  },
  {
    id: 'sha256',
    name: 'SHA-256',
    category: 'hashing',
    difficulty: 'intermediate',
    tagline: 'The cryptographic workhorse of internet security and blockchain',
    description: 'A 256-bit cryptographic one-way hash function designed by the NSA that produces a fixed 64-character hexadecimal digest.',
    overview: 'SHA-256 belongs to the SHA-2 (Secure Hash Algorithm 2) family published by NIST in 2001. It processes input messages in 512-bit blocks through 64 rounds of non-linear logical functions, modular additions, and bitwise rotations.',
    history: 'Designed by the US National Security Agency (NSA) as the successor to SHA-1, which began showing mathematical vulnerability to collision attacks. SHA-256 has withstood intense public cryptanalysis for over two decades without any practical collision discovered.',
    howItWorks: 'Pads the message to a multiple of 512 bits, initializes eight 32-bit state registers with fractional parts of square roots of the first 8 primes, and iteratively compresses each 512-bit chunk using 64 constants derived from the cube roots of the first 64 primes.',
    formula: {
      title: 'Round Compression Structure',
      encryption: 'T_1 = h + \\Sigma_1(e) + \\text{Ch}(e, f, g) + K_t + W_t',
      decryption: 'None (Strictly One-Way)',
      notes: 'Employs Merkle-Damgård construction with Davies-Meyer compression.',
    },
    example: {
      plaintext: 'ChiperLab',
      key: 'None (Unkeyed)',
      ciphertext: '0d48f97b6cfefb8f2c8d2d6...',
      walkthrough: 'Input converted to bytes, padded with bit 1 followed by zeroes and message length, then compressed through 64 rounds.',
    },
    securityNotes: [
      'Provides 128 bits of security against collision attacks (Birthday Paradox) and 256 bits against preimage attacks.',
      'Vulnerable to Length Extension attacks if used in naive MACs (use HMAC-SHA256 instead).',
      'Standard digest algorithm for TLS certificates, DNSSEC, Git object IDs, and Bitcoin consensus.',
    ],
    playgroundRoute: '/playground/hash?algo=SHA-256',
    defaultDemoKey: '',
    defaultDemoInput: 'Integrity verified transmission',
  },
  {
    id: 'sha512',
    name: 'SHA-512',
    category: 'hashing',
    difficulty: 'intermediate',
    tagline: 'High-security 512-bit hashing optimized for 64-bit microprocessors',
    description: 'Produces a massive 512-bit (128-character hex) digest with 80 compression rounds on 64-bit words.',
    overview: 'SHA-512 is the larger member of the SHA-2 family. It operates on 64-bit words (unlike SHA-256\'s 32-bit words), making it exceptionally fast on modern 64-bit CPU architectures while offering an astronomically high security margin.',
    history: 'Released alongside SHA-256 in FIPS 180-2. It was designed to provide long-term cryptographic integrity that remains secure against collision attacks well into the future.',
    howItWorks: 'Message blocks are 1024 bits long. The state consists of eight 64-bit registers, and each block passes through 80 compression rounds using 80 constants derived from the cube roots of the first 80 prime numbers.',
    formula: {
      title: 'Round Compression Structure',
      encryption: 'T_1 = h + \\Sigma_1^{512}(e) + \\text{Ch}(e, f, g) + K_t^{512} + W_t',
      decryption: 'None (Strictly One-Way)',
      notes: 'Produces 512 bits = 64 bytes = 128 hexadecimal characters.',
    },
    example: {
      plaintext: 'Cybersecurity Academy',
      key: 'None (Unkeyed)',
      ciphertext: '128-character hex digest',
      walkthrough: '64-bit state words updated across 80 rounds of bitwise rotations and modular addition mod 2^64.',
    },
    securityNotes: [
      'Provides 256 bits of collision resistance and 512 bits of preimage resistance.',
      'Often faster than SHA-256 on 64-bit hardware because it processes twice as many bits per operation.',
      'Ideal for master key derivation, password hashing salts (Argon2 / PBKDF2), and high-value signature schemes.',
    ],
    playgroundRoute: '/playground/hash?algo=SHA-512',
    defaultDemoKey: '',
    defaultDemoInput: 'Ultra high-security digital envelope',
  },
];
