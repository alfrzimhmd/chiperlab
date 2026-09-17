export interface RoadmapLevel {
  levelNumber: number;
  levelCode: string;
  title: string;
  subtitle: string;
  description: string;
  estimatedTime: string;
  xpReward: number;
  requiredLessonIds: string[];
  algorithms: string[];
  route: string;
  iconName: string;
  objectives: string[];
}

export const ROADMAP_LEVELS: RoadmapLevel[] = [
  {
    levelNumber: 1,
    levelCode: 'LEVEL 01',
    title: 'Cryptography Fundamentals',
    subtitle: 'Core terminology, confidentiality vs integrity, and the CIA triad',
    description: 'Build your mental model of cryptography. Understand how data moves from plaintext to ciphertext, why encoding is not encryption, and the fundamental pillars of information security.',
    estimatedTime: '30 mins',
    xpReward: 90,
    requiredLessonIds: ['intro-crypto', 'plaintext-ciphertext', 'enc-dec', 'encoding-vs-encryption'],
    algorithms: ['Caesar'],
    route: '/learn/fundamentals',
    iconName: 'Shield',
    objectives: [
      'Master plaintext vs ciphertext definitions',
      'Understand Kerckhoffs\'s principle',
      'Distinguish Base64 encoding from true encryption',
    ],
  },
  {
    levelNumber: 2,
    levelCode: 'LEVEL 02',
    title: 'Classical Ciphers',
    subtitle: 'Substitution, transposition, and ancient military secret writing',
    description: 'Explore historical ciphers from the Roman Empire and biblical eras. Discover how Caesar, Atbash, and Vigenère transformed text and why simple alphabetic patterns are vulnerable.',
    estimatedTime: '45 mins',
    xpReward: 120,
    requiredLessonIds: ['symmetric-crypto'],
    algorithms: ['caesar', 'atbash', 'vigenere', 'xor'],
    route: '/learn/algorithms',
    iconName: 'Key',
    objectives: [
      'Implement Caesar shifts with modulo arithmetic',
      'Experiment with Atbash alphabet inversion',
      'Break monoalphabetic substitution with letter frequencies',
    ],
  },
  {
    levelNumber: 3,
    levelCode: 'LEVEL 03',
    title: 'Symmetric Cryptography',
    subtitle: 'High-throughput block ciphers, AES-GCM, and shared secrets',
    description: 'Deep dive into modern secret-key encryption. Learn how AES processes 128-bit blocks through substitution-permutation networks and why Galois/Counter Mode (GCM) provides authenticated encryption.',
    estimatedTime: '40 mins',
    xpReward: 140,
    requiredLessonIds: ['symmetric-crypto', 'crypto-keys', 'iv-nonce'],
    algorithms: ['aes', 'xor'],
    route: '/learn/algorithms/aes',
    iconName: 'Lock',
    objectives: [
      'Generate 256-bit cryptographic keys using Web Crypto API',
      'Understand the role of Initialization Vectors (IV)',
      'Prevent catastrophic nonce reuse in AES-GCM',
    ],
  },
  {
    levelNumber: 4,
    levelCode: 'LEVEL 04',
    title: 'Asymmetric Cryptography',
    subtitle: 'Public-key pairs, prime factorization, and key exchange',
    description: 'Discover the public-key revolution that powers internet commerce. Learn how trapdoor functions in RSA-OAEP enable two strangers to communicate securely across an untrusted network.',
    estimatedTime: '50 mins',
    xpReward: 160,
    requiredLessonIds: ['asymmetric-crypto'],
    algorithms: ['rsa'],
    route: '/learn/algorithms/rsa',
    iconName: 'Share2',
    objectives: [
      'Generate 2048-bit RSA public/private key pairs',
      'Understand integer factorization hardness',
      'Master hybrid encryption pipelines used in TLS/HTTPS',
    ],
  },
  {
    levelNumber: 5,
    levelCode: 'LEVEL 05',
    title: 'Cryptographic Hashing',
    subtitle: 'One-way mathematical digests and the avalanche effect',
    description: 'Learn how deterministic one-way functions act as digital fingerprints. Explore SHA-256 and SHA-512, preimage resistance, and why even a 1-bit input change scrambles the entire digest.',
    estimatedTime: '35 mins',
    xpReward: 120,
    requiredLessonIds: ['hashing-foundations'],
    algorithms: ['sha256', 'sha512'],
    route: '/playground/hash',
    iconName: 'Fingerprint',
    objectives: [
      'Compute SHA-256 digests in real-time',
      'Observe the avalanche effect with live character edits',
      'Understand collision resistance and birthday attacks',
    ],
  },
  {
    levelNumber: 6,
    levelCode: 'LEVEL 06',
    title: 'Digital Signatures',
    subtitle: 'Integrity verification, PKI, and non-repudiation',
    description: 'Combine hashing and asymmetric cryptography to create digital signatures. Learn how digital signatures verify author identity, safeguard software updates, and secure blockchain ledgers.',
    estimatedTime: '40 mins',
    xpReward: 140,
    requiredLessonIds: ['digital-signature', 'authentication-mac', 'cia-triad'],
    algorithms: ['rsa'],
    route: '/learn/fundamentals/digital-signatures',
    iconName: 'CheckCircle2',
    objectives: [
      'Differentiate signing from encryption',
      'Verify digital signature authenticity',
      'Understand HMAC vs asymmetric signatures',
    ],
  },
  {
    levelNumber: 7,
    levelCode: 'LEVEL 07',
    title: 'Cryptanalysis Basics',
    subtitle: 'Breaking ciphers, brute-force attacks, and frequency analysis',
    description: 'Step into the shoes of a cryptanalyst. Put your knowledge to the test by brute-forcing weak keyspaces, analyzing ciphertext character frequencies, and solving cryptographic puzzles.',
    estimatedTime: '60 mins',
    xpReward: 200,
    requiredLessonIds: ['cia-triad'],
    algorithms: ['caesar', 'vigenere', 'xor'],
    route: '/challenges',
    iconName: 'Terminal',
    objectives: [
      'Execute automated Caesar brute-force cracking',
      'Perform statistical character frequency analysis',
      'Complete cybersecurity academy challenges & puzzles',
    ],
  },
];
