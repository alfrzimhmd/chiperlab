import type { TimelineEra, TimelineEraInfo, TimelineEvent } from '../types/encyclopedia';

/* ============================================================
   TIMELINE ERAS
============================================================ */
export const TIMELINE_ERAS: TimelineEraInfo[] = [
  {
    id: 'classical',
    label: 'Classical Era',
    period: '500 BC – 1500 AD',
    description:
      'From Spartan scytales to Arabic frequency analysis. Simple substitution ciphers dominated, and cryptanalysis was born.',
    accentText: 'text-slate-300',
    accentBg: 'bg-slate-500/10',
    accentBorder: 'border-slate-500/30',
  },
  {
    id: 'renaissance',
    label: 'Renaissance',
    period: '1500 – 1800',
    description:
      'Polyalphabetic ciphers rose and fell. Vigenère was hailed as unbreakable — until Babbage and Kasiski proved otherwise.',
    accentText: 'text-amber-400',
    accentBg: 'bg-amber-500/10',
    accentBorder: 'border-amber-500/30',
  },
  {
    id: 'mechanical',
    label: 'Mechanical Era',
    period: '1800 – 1950',
    description:
      'Rotor machines automated encryption. Enigma, Purple, and Lorenz powered world wars — and the Bombe cracked them.',
    accentText: 'text-orange-400',
    accentBg: 'bg-orange-500/10',
    accentBorder: 'border-orange-500/30',
  },
  {
    id: 'computer',
    label: 'Computer Era',
    period: '1950 – 2000',
    description:
      'Shannon founded information theory. DES, Diffie-Hellman, and RSA launched digital cryptography as we know it.',
    accentText: 'text-cyan-400',
    accentBg: 'bg-cyan-500/10',
    accentBorder: 'border-cyan-500/30',
  },
  {
    id: 'modern',
    label: 'Modern Era',
    period: '2000 – Present',
    description:
      'AES, TLS 1.3, post-quantum standards, and blockchain. Cryptography now protects billions of daily interactions.',
    accentText: 'text-purple-400',
    accentBg: 'bg-purple-500/10',
    accentBorder: 'border-purple-500/30',
  },
];

/* ============================================================
   TIMELINE EVENTS
============================================================ */
export const TIMELINE_EVENTS: TimelineEvent[] = [
  /* ---------------- CLASSICAL ---------------- */
  {
    id: 'scytale',
    year: -700,
    yearLabel: '700 BC',
    title: 'The Spartan Scytale',
    description:
      'Ancient Spartans wrap leather strips around a wooden cylinder (scytale) to transpose messages. One of the earliest known transposition ciphers.',
    era: 'classical',
    relatedTerms: ['transposition-cipher'],
  },
  {
    id: 'caesar-cipher-event',
    year: -58,
    yearLabel: '58 BC',
    title: 'Julius Caesar Uses Shift-3 Substitution',
    description:
      'Caesar protects military dispatches during the Gallic Wars using a monoalphabetic substitution — each letter shifted three positions forward.',
    era: 'classical',
    relatedAlgorithms: ['caesar'],
    relatedTerms: ['monoalphabetic', 'substitution-cipher', 'modular-arithmetic'],
    people: ['Julius Caesar'],
  },
  {
    id: 'atbash-event',
    year: 500,
    yearLabel: '500 AD',
    title: 'Atbash in Hebrew Texts',
    description:
      'Hebrew scribes use the Atbash mirror cipher (A↔Z, B↔Y) to encode passages in the Book of Jeremiah, hiding "Babel" as "Sheshach".',
    era: 'classical',
    relatedAlgorithms: ['atbash'],
    relatedTerms: ['involutory-cipher'],
  },
  {
    id: 'al-kindi-frequency',
    year: 850,
    yearLabel: '850 AD',
    title: 'Al-Kindi Invents Frequency Analysis',
    description:
      'Arab polymath Al-Kindi publishes "A Manuscript on Deciphering Cryptographic Messages" — the first documented use of frequency analysis to break ciphers.',
    era: 'classical',
    relatedTerms: ['frequency-analysis', 'cryptanalysis'],
    people: ['Al-Kindi'],
  },
  {
    id: 'vigenere-published',
    year: 1553,
    yearLabel: '1553 AD',
    title: 'Bellaso Publishes the Polyalphabetic Cipher',
    description:
      'Giovan Battista Bellaso publishes a keyword-based polyalphabetic cipher — later misattributed to Blaise de Vigenère. It will resist cryptanalysis for 300 years.',
    era: 'classical',
    relatedAlgorithms: ['vigenere'],
    relatedTerms: ['polyalphabetic', 'kasiski-examination'],
    people: ['Giovan Battista Bellaso'],
  },

  /* ---------------- RENAISSANCE ---------------- */
  {
    id: 'vigenere-book',
    year: 1586,
    yearLabel: '1586 AD',
    title: 'Blaise de Vigenère Publishes Autokey Cipher',
    description:
      'French diplomat Blaise de Vigenère publishes a variant of the polyalphabetic cipher. Historians will later misattribute the entire technique to him.',
    era: 'renaissance',
    relatedAlgorithms: ['vigenere'],
    people: ['Blaise de Vigenère'],
  },
  {
    id: 'babbage-breaks-vigenere',
    year: 1854,
    yearLabel: '1854 AD',
    title: 'Charles Babbage Breaks Vigenère (Unpublished)',
    description:
      'Charles Babbage discovers the technique to break polyalphabetic ciphers using repeated sequences — but does not publish. The discovery stays private.',
    era: 'renaissance',
    relatedAlgorithms: ['vigenere'],
    relatedTerms: ['kasiski-examination'],
    people: ['Charles Babbage'],
  },
  {
    id: 'kasiski-published',
    year: 1863,
    yearLabel: '1863 AD',
    title: 'Kasiski Publishes Vigenère Cryptanalysis',
    description:
      'Prussian officer Friedrich Kasiski independently rediscovers Babbage\'s technique and publishes it — ending Vigenère\'s 300-year reign as "le chiffre indéchiffrable".',
    era: 'renaissance',
    relatedAlgorithms: ['vigenere'],
    relatedTerms: ['kasiski-examination'],
    people: ['Friedrich Kasiski'],
  },
  {
    id: 'kerckhoffs-principle',
    year: 1883,
    yearLabel: '1883 AD',
    title: 'Kerckhoffs\'s Principle',
    description:
      'Dutch cryptographer Auguste Kerckhoffs publishes "La Cryptographie Militaire", stating that a cipher must be secure even if everything except the key is public.',
    era: 'renaissance',
    relatedTerms: ['kerckhoffs-principle', 'security-through-obscurity'],
    people: ['Auguste Kerckhoffs'],
  },

  /* ---------------- MECHANICAL ---------------- */
  {
    id: 'vernam-otp',
    year: 1917,
    yearLabel: '1917 AD',
    title: 'Vernam Patents the One-Time Pad',
    description:
      'AT&T engineer Gilbert Vernam patents a cipher that XORs a random key with the plaintext. Combined with Joseph Mauborgne\'s ideas, it becomes the only provably unbreakable cipher.',
    era: 'mechanical',
    relatedAlgorithms: ['xor'],
    relatedTerms: ['one-time-pad', 'perfect-secrecy'],
    people: ['Gilbert Vernam'],
  },
  {
    id: 'enigma-adopted',
    year: 1926,
    yearLabel: '1926 AD',
    title: 'German Military Adopts Enigma',
    description:
      'The German military adopts the Enigma rotor machine for secure communication. It will be used through World War II.',
    era: 'mechanical',
    relatedTerms: ['rotor-machine', 'enigma'],
  },
  {
    id: 'rejewski-breaks-enigma',
    year: 1932,
    yearLabel: '1932 AD',
    title: 'Polish Mathematicians Break Enigma',
    description:
      'Marian Rejewski, Jerzy Różycki, and Henryk Zygalski reverse-engineer Enigma using mathematics — a breakthrough shared with Britain and France in 1939.',
    era: 'mechanical',
    relatedTerms: ['enigma'],
    people: ['Marian Rejewski'],
  },
  {
    id: 'turing-bombe',
    year: 1939,
    yearLabel: '1939 AD',
    title: 'Alan Turing Builds the Bombe',
    description:
      'At Bletchley Park, Alan Turing and team build the Bombe — an electromechanical machine that tests Enigma settings, breaking German U-boat codes.',
    era: 'mechanical',
    relatedTerms: ['enigma', 'cryptanalysis'],
    people: ['Alan Turing'],
  },
  {
    id: 'shannon-secrecy',
    year: 1949,
    yearLabel: '1949 AD',
    title: 'Shannon Founds Information-Theoretic Cryptography',
    description:
      'Claude Shannon publishes "Communication Theory of Secrecy Systems" — formalizing perfect secrecy, confusion, and diffusion. Modern cryptography begins here.',
    era: 'computer',
    relatedTerms: ['perfect-secrecy', 'confusion-diffusion'],
    people: ['Claude Shannon'],
  },

  /* ---------------- COMPUTER ---------------- */
  {
    id: 'des-standard',
    year: 1977,
    yearLabel: '1977 AD',
    title: 'DES Becomes US Federal Standard',
    description:
      'The Data Encryption Standard (DES) — a 56-bit symmetric block cipher — becomes FIPS 46. It will protect US government data for two decades.',
    era: 'computer',
    relatedTerms: ['block-cipher', 'feistel-network'],
  },
  {
    id: 'diffie-hellman',
    year: 1976,
    yearLabel: '1976 AD',
    title: 'Diffie-Hellman Key Exchange',
    description:
      'Whitfield Diffie and Martin Hellman publish "New Directions in Cryptography" — introducing public-key cryptography and solving the key distribution problem.',
    era: 'computer',
    relatedTerms: ['key-exchange', 'diffie-hellman', 'public-key-cryptography'],
    people: ['Whitfield Diffie', 'Martin Hellman'],
  },
  {
    id: 'rsa-published',
    year: 1977,
    yearLabel: '1977 AD',
    title: 'RSA Invented at MIT',
    description:
      'Ron Rivest, Adi Shamir, and Leonard Adleman publish RSA — the first practical public-key cryptosystem based on integer factorization.',
    era: 'computer',
    relatedAlgorithms: ['rsa'],
    relatedTerms: ['public-key-cryptography', 'integer-factorization'],
    people: ['Ron Rivest', 'Adi Shamir', 'Leonard Adleman'],
  },
  {
    id: 'cocks-gchq',
    year: 1973,
    yearLabel: '1973 AD (declassified 1997)',
    title: 'Clifford Cocks Invents RSA at GCHQ',
    description:
      'British mathematician Clifford Cocks invents an equivalent public-key system at GCHQ — four years before RSA. It remains classified until 1997.',
    era: 'computer',
    relatedAlgorithms: ['rsa'],
    people: ['Clifford Cocks'],
  },
  {
    id: 'aes-competition',
    year: 1997,
    yearLabel: '1997 AD',
    title: 'NIST Launches AES Competition',
    description:
      'NIST announces a global public competition to replace DES. Fifteen designs are submitted; Rijndael (Daemen & Rijmen) wins in 2000.',
    era: 'computer',
    relatedAlgorithms: ['aes'],
    relatedTerms: ['block-cipher'],
  },
  {
    id: 'md5-broken',
    year: 2004,
    yearLabel: '2004 AD',
    title: 'MD5 Cryptographically Broken',
    description:
      'Xiaoyun Wang demonstrates practical collisions in MD5 — two different messages with the same hash. The algorithm falls for all security uses.',
    era: 'computer',
    relatedAlgorithms: ['md5'],
    relatedTerms: ['collision-resistance', 'hash-function'],
    people: ['Xiaoyun Wang'],
  },

  /* ---------------- MODERN ---------------- */
  {
    id: 'aes-fips',
    year: 2001,
    yearLabel: '2001 AD',
    title: 'AES Standardized as FIPS 197',
    description:
      'The Advanced Encryption Standard (Rijndael) becomes the global symmetric encryption standard. It remains unbroken today.',
    era: 'modern',
    relatedAlgorithms: ['aes'],
    relatedTerms: ['block-cipher', 'aes-ni'],
  },
  {
    id: 'bitcoin-launch',
    year: 2008,
    yearLabel: '2008 AD',
    title: 'Bitcoin Launches Blockchain Cryptography',
    description:
      'Satoshi Nakamoto publishes "Bitcoin: A Peer-to-Peer Electronic Cash System" — combining SHA-256, ECDSA, and Merkle trees into a decentralized trust system.',
    era: 'modern',
    relatedTerms: ['merkle-tree', 'proof-of-work'],
  },
  {
    id: 'sha1-shattered',
    year: 2017,
    yearLabel: '2017 AD',
    title: 'SHA-1 Collision ("SHAttered")',
    description:
      'Google and CWI Amsterdam produce the first practical SHA-1 collision, confirming what cryptanalysts had warned for a decade. SHA-1 is now deprecated.',
    era: 'modern',
    relatedTerms: ['hash-function', 'collision-resistance'],
  },
  {
    id: 'tls13-standard',
    year: 2018,
    yearLabel: '2018 AD',
    title: 'TLS 1.3 Standardized (RFC 8446)',
    description:
      'TLS 1.3 mandates AEAD ciphers (AES-GCM or ChaCha20-Poly1305), forward secrecy, and eliminates legacy algorithms. HTTPS becomes faster and safer.',
    era: 'modern',
    relatedAlgorithms: ['aes', 'chacha20'],
    relatedTerms: ['aead', 'forward-secrecy', 'tls'],
  },
  {
    id: 'pqc-standards',
    year: 2024,
    yearLabel: '2024 AD',
    title: 'NIST Finalizes Post-Quantum Standards',
    description:
      'NIST publishes FIPS 203 (ML-KEM/Kyber), FIPS 204 (ML-DSA/Dilithium), and FIPS 205 (SLH-DSA/SPHINCS+) — the first post-quantum standards, ready for global deployment.',
    era: 'modern',
    relatedTerms: ['post-quantum', 'lattice-cryptography', 'shor-algorithm'],
  },
  /* ============================================================
   MASTER REFERENCES
   The full list of sources used across all timeline events.
   Displayed at the bottom of the Timeline view.
============================================================ */
];

export interface MasterReference {
  id: string;
  title: string;
  author?: string;
  year?: number;
  url?: string;
  type: 'standard' | 'paper' | 'book' | 'article' | 'documentation';
  /** Which era this reference relates to (for grouping) */
  era: TimelineEra | 'general';
}

export const TIMELINE_REFERENCES: MasterReference[] = [
  // ============================================================
  // GENERAL — Foundational overview books
  // ============================================================
  {
    id: 'singh-code-book',
    title: 'The Code Book: The Science of Secrecy from Ancient Egypt to Quantum Cryptography',
    author: 'S. Singh',
    year: 1999,
    url: 'https://simonsingh.net/books/the-code-book/',
    type: 'book',
    era: 'general',
  },
  {
    id: 'kahn-codebreakers',
    title: 'The Codebreakers: The Comprehensive History of Secret Communication',
    author: 'D. Kahn',
    year: 1996,
    url: 'https://en.wikipedia.org/wiki/The_Codebreakers',
    type: 'book',
    era: 'general',
  },
  {
    id: 'katz-lindell',
    title: 'Introduction to Modern Cryptography (3rd Edition)',
    author: 'J. Katz, Y. Lindell',
    year: 2020,
    url: 'https://www.taylorfrancis.com/books/mono/10.1201/9781351133036/introduction-modern-cryptography-jonathan-katz-yehuda-lindell',
    type: 'book',
    era: 'general',
  },

  // ============================================================
  // CLASSICAL ERA
  // ============================================================
  {
    id: 'suetonius',
    title: 'The Twelve Caesars (Divus Iulius, Chapter 56)',
    author: 'Suetonius',
    year: 121,
    url: 'http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.02.0132',
    type: 'article',
    era: 'classical',
  },
  {
    id: 'al-kindi-manuscript',
    title: 'A Manuscript on Deciphering Cryptographic Messages',
    author: 'Al-Kindi',
    year: 850,
    url: 'https://en.wikipedia.org/wiki/Al-Kindi',
    type: 'article',
    era: 'classical',
  },

  // ============================================================
  // RENAISSANCE
  // ============================================================
  {
    id: 'kerckhoffs-militaire',
    title: 'La Cryptographie Militaire',
    author: 'A. Kerckhoffs',
    year: 1883,
    url: 'https://en.wikipedia.org/wiki/Kerckhoffs%27s_principle',
    type: 'paper',
    era: 'renaissance',
  },

  // ============================================================
  // MECHANICAL ERA
  // ============================================================
  {
    id: 'hodges-turing',
    title: 'Alan Turing: The Enigma',
    author: 'A. Hodges',
    year: 1983,
    url: 'https://en.wikipedia.org/wiki/Alan_Turing:_The_Enigma',
    type: 'book',
    era: 'mechanical',
  },

  // ============================================================
  // COMPUTER ERA
  // ============================================================
  {
    id: 'diffie-hellman-new-directions',
    title: 'New Directions in Cryptography',
    author: 'W. Diffie, M. Hellman',
    year: 1976,
    url: 'https://ieeexplore.ieee.org/document/1055638',
    type: 'paper',
    era: 'computer',
  },
  {
    id: 'rsa-paper',
    title: 'A Method for Obtaining Digital Signatures and Public-Key Cryptosystems',
    author: 'R. Rivest, A. Shamir, L. Adleman',
    year: 1978,
    url: 'https://dl.acm.org/doi/10.1145/359340.359342',
    type: 'paper',
    era: 'computer',
  },

  // ============================================================
  // MODERN ERA
  // ============================================================
  {
    id: 'nist-fips-197-aes',
    title: 'NIST FIPS 197: Advanced Encryption Standard (AES)',
    author: 'NIST',
    year: 2001,
    url: 'https://csrc.nist.gov/publications/detail/fips/197/final',
    type: 'standard',
    era: 'modern',
  },
  {
    id: 'nakamoto-bitcoin',
    title: 'Bitcoin: A Peer-to-Peer Electronic Cash System',
    author: 'S. Nakamoto',
    year: 2008,
    url: 'https://bitcoin.org/bitcoin.pdf',
    type: 'paper',
    era: 'modern',
  },
  {
    id: 'nist-pqc-2024',
    title: 'NIST Post-Quantum Cryptography Standards (FIPS 203, 204, 205)',
    author: 'NIST',
    year: 2024,
    url: 'https://csrc.nist.gov/projects/post-quantum-cryptography',
    type: 'standard',
    era: 'modern',
  },
];