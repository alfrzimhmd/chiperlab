import { LessonReference } from '../types/lesson';

export interface ReferencesGroup {
  title: string;
  description: string;
  type: LessonReference['type'];
  items: LessonReference[];
}

/**
 * Master list of all sources referenced across ChiperLab lessons.
 * Grouped by type: standards, papers, books, documentation.
 *
 * All content in ChiperLab is paraphrased for educational clarity.
 * No verbatim copying from these sources.
 */
export const REFERENCES_GROUPS: ReferencesGroup[] = [
  // ============================================================
  // STANDARDS (NIST, IETF RFC)
  // ============================================================
  {
    title: 'Standards & Specifications',
    description: 'Official cryptographic standards from NIST and IETF.',
    type: 'standard',
    items: [
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
        title: 'NIST SP 800-38D: Recommendation for Block Cipher Modes of Operation: GCM and GMAC',
        author: 'NIST',
        year: 2007,
        url: 'https://csrc.nist.gov/publications/detail/sp/800-38d/final',
        type: 'standard',
      },
      {
        title: 'NIST FIPS 180-4: Secure Hash Standard (SHS)',
        author: 'NIST',
        year: 2015,
        url: 'https://csrc.nist.gov/publications/detail/fips/180/4/final',
        type: 'standard',
      },
      {
        title: 'NIST FIPS 186-5: Digital Signature Standard (DSS)',
        author: 'NIST',
        year: 2023,
        url: 'https://csrc.nist.gov/publications/detail/fips/186/5/final',
        type: 'standard',
      },
      {
        title: 'NIST SP 800-186: Recommendations for Discrete Logarithm-based Cryptography: Elliptic Curve Domain Parameters',
        author: 'NIST',
        year: 2023,
        url: 'https://csrc.nist.gov/publications/detail/sp/800-186/final',
        type: 'standard',
      },
      {
        title: 'NIST SP 800-90A Rev. 1: Recommendation for Random Number Generation Using Deterministic Random Bit Generators',
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
        title: 'NIST FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism Standard (ML-KEM)',
        author: 'NIST',
        year: 2024,
        url: 'https://csrc.nist.gov/pubs/fips/203/final',
        type: 'standard',
      },
      {
        title: 'NIST FIPS 204: Module-Lattice-Based Digital Signature Standard (ML-DSA)',
        author: 'NIST',
        year: 2024,
        url: 'https://csrc.nist.gov/pubs/fips/204/final',
        type: 'standard',
      },
      {
        title: 'NIST FIPS 205: Stateless Hash-Based Digital Signature Standard (SLH-DSA)',
        author: 'NIST',
        year: 2024,
        url: 'https://csrc.nist.gov/pubs/fips/205/final',
        type: 'standard',
      },
      {
        title: 'RFC 2104: HMAC — Keyed-Hashing for Message Authentication',
        author: 'H. Krawczyk, M. Bellare, R. Canetti',
        year: 1997,
        url: 'https://datatracker.ietf.org/doc/html/rfc2104',
        type: 'standard',
      },
      {
        title: 'RFC 4648: The Base16, Base32, and Base64 Data Encodings',
        author: 'S. Josefsson',
        year: 2006,
        url: 'https://datatracker.ietf.org/doc/html/rfc4648',
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
        title: 'RFC 8439: ChaCha20 and Poly1305 for IETF Protocols',
        author: 'Y. Nir, A. Langley',
        year: 2018,
        url: 'https://datatracker.ietf.org/doc/html/rfc8439',
        type: 'standard',
      },
    ],
  },

  // ============================================================
  // ACADEMIC PAPERS
  // ============================================================
  {
    title: 'Academic Papers',
    description: 'Foundational research papers in cryptography and cryptanalysis.',
    type: 'paper',
    items: [
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
        title: 'Communication Theory of Secrecy Systems',
        author: 'C. E. Shannon',
        year: 1949,
        url: 'https://ieeexplore.ieee.org/document/6769090',
        type: 'paper',
      },
      {
        title: 'Optimal Asymmetric Encryption — How to Encrypt with RSA',
        author: 'M. Bellare, P. Rogaway',
        year: 1994,
        url: 'https://link.springer.com/chapter/10.1007/BFb0053428',
        type: 'paper',
      },
      {
        title: 'On Lattices, Learning with Errors, Random Linear Codes, and Cryptography',
        author: 'O. Regev',
        year: 2005,
        url: 'https://cims.nyu.edu/~regev/papers/qcrypto.pdf',
        type: 'paper',
      },
      {
        title: 'Timing Attacks on Implementations of Diffie-Hellman, RSA, DSS, and Other Systems',
        author: 'P. Kocher',
        year: 1996,
        url: 'https://link.springer.com/chapter/10.1007/3-540-68697-5_9',
        type: 'paper',
      },
      {
        title: 'Differential Power Analysis',
        author: 'P. Kocher, J. Jaffe, B. Jun',
        year: 1999,
        url: 'https://link.springer.com/chapter/10.1007/3-540-48405-1_25',
        type: 'paper',
      },
      {
        title: 'Cache-Timing Attacks on AES',
        author: 'D. J. Bernstein',
        year: 2005,
        url: 'https://cr.yp.to/antiforgery/cachetiming-20050414.pdf',
        type: 'paper',
      },
      {
        title: 'Security Flaws Induced by CBC Padding — Applications to SSL, IPSEC, WTLS',
        author: 'S. Vaudenay',
        year: 2002,
        url: 'https://link.springer.com/chapter/10.1007/3-540-46035-7_35',
        type: 'paper',
      },
      {
        title: 'Second Preimages on n-bit Hash Functions for Much Less than 2ⁿ Work',
        author: 'J. Kelsey, B. Schneier',
        year: 2005,
        url: 'https://link.springer.com/chapter/10.1007/11426639_28',
        type: 'paper',
      },
      {
        title: 'Quantum Cryptography: Public Key Distribution and Coin Tossing (BB84)',
        author: 'C. H. Bennett, G. Brassard',
        year: 1984,
        url: 'https://www.sciencedirect.com/science/article/pii/S0304397585800357',
        type: 'paper',
      },
      {
        title: 'Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer',
        author: 'P. W. Shor',
        year: 1997,
        url: 'https://epubs.siam.org/doi/10.1137/S0097539795293172',
        type: 'paper',
      },
      {
        title: 'A Fast Quantum Mechanical Algorithm for Database Search (Grover)',
        author: 'L. K. Grover',
        year: 1996,
        url: 'https://dl.acm.org/doi/10.1145/237814.237866',
        type: 'paper',
      },
    ],
  },

  // ============================================================
  // BOOKS
  // ============================================================
  {
    title: 'Books & Textbooks',
    description: 'Standard reference textbooks used for cryptographic concepts.',
    type: 'book',
    items: [
      {
        title: 'Introduction to Modern Cryptography (3rd Edition)',
        author: 'J. Katz, Y. Lindell',
        year: 2020,
        url: 'https://www.taylorfrancis.com/books/mono/10.1201/9781351133036/introduction-modern-cryptography-jonathan-katz-yehuda-lindell',
        type: 'book',
      },
      {
        title: 'A Graduate Course in Applied Cryptography',
        author: 'D. Boneh, V. Shoup',
        year: 2020,
        url: 'https://toc.cryptobook.us/',
        type: 'book',
      },
      {
        title: 'Cryptography and Network Security: Principles and Practice (8th Edition)',
        author: 'W. Stallings',
        year: 2019,
        url: 'https://www.pearson.com/en-us/subject-catalog/p/cryptography-and-network-security/P200000003456',
        type: 'book',
      },
      {
        title: 'Serious Cryptography: A Practical Introduction to Modern Encryption',
        author: 'J.-P. Aumasson',
        year: 2017,
        url: 'https://nostarch.com/seriouscrypto',
        type: 'book',
      },
      {
        title: 'The Code Book: The Science of Secrecy from Ancient Egypt to Quantum Cryptography',
        author: 'S. Singh',
        year: 1999,
        url: 'https://simonsingh.net/books/the-code-book/',
        type: 'book',
      },
    ],
  },

  // ============================================================
  // DOCUMENTATION & PLATFORMS
  // ============================================================
  {
    title: 'Documentation & Educational Platforms',
    description: 'Technical documentation and educational resources.',
    type: 'documentation',
    items: [
      {
        title: 'MDN Web Docs — Web Crypto API',
        author: 'Mozilla',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API',
        type: 'documentation',
      },
      {
        title: 'OWASP Cryptographic Storage Cheat Sheet',
        author: 'OWASP Foundation',
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html',
        type: 'documentation',
      },
      {
        title: 'Crypto101 — A free introductory cryptography course',
        author: 'Laurens Van Houtven',
        url: 'https://www.crypto101.io/',
        type: 'documentation',
      },
      {
        title: 'Cryptohack — Interactive cryptography challenges',
        author: 'Cryptohack Community',
        url: 'https://cryptohack.org/',
        type: 'documentation',
      },
      {
        title: 'Khan Academy — Cryptography',
        author: 'Khan Academy',
        url: 'https://www.khanacademy.org/computing/computer-science/cryptography',
        type: 'documentation',
      },
      {
        title: 'Wikipedia — Outline of Cryptography',
        author: 'Wikipedia Contributors',
        url: 'https://en.wikipedia.org/wiki/Outline_of_cryptography',
        type: 'documentation',
      },
    ],
  },
];

/** Flat list of all references for quick lookup by lesson */
export const ALL_REFERENCES: LessonReference[] = REFERENCES_GROUPS.flatMap(
  group => group.items
);