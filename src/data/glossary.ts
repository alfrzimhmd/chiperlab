import type { GlossaryCategoryInfo, GlossaryTerm } from '../types/encyclopedia';

/* ============================================================
   GLOSSARY CATEGORIES
============================================================ */
export const GLOSSARY_CATEGORIES: GlossaryCategoryInfo[] = [
  {
    id: 'cipher',
    label: 'Ciphers',
    description: 'Encryption and decryption algorithms',
    accentText: 'text-cyan-400',
    accentBg: 'bg-cyan-500/10',
    accentBorder: 'border-cyan-500/30',
  },
  {
    id: 'hash',
    label: 'Hash Functions',
    description: 'One-way integrity functions',
    accentText: 'text-purple-400',
    accentBg: 'bg-purple-500/10',
    accentBorder: 'border-purple-500/30',
  },
  {
    id: 'protocol',
    label: 'Protocols',
    description: 'Communication standards and frameworks',
    accentText: 'text-emerald-400',
    accentBg: 'bg-emerald-500/10',
    accentBorder: 'border-emerald-500/30',
  },
  {
    id: 'attack',
    label: 'Attacks',
    description: 'Cryptanalytic techniques and vulnerabilities',
    accentText: 'text-rose-400',
    accentBg: 'bg-rose-500/10',
    accentBorder: 'border-rose-500/30',
  },
  {
    id: 'concept',
    label: 'Concepts',
    description: 'Foundational cryptographic principles',
    accentText: 'text-amber-400',
    accentBg: 'bg-amber-500/10',
    accentBorder: 'border-amber-500/30',
  },
  {
    id: 'math',
    label: 'Mathematics',
    description: 'Mathematical foundations of cryptography',
    accentText: 'text-blue-400',
    accentBg: 'bg-blue-500/10',
    accentBorder: 'border-blue-500/30',
  },
  {
    id: 'organization',
    label: 'Organizations',
    description: 'Standards bodies and agencies',
    accentText: 'text-indigo-400',
    accentBg: 'bg-indigo-500/10',
    accentBorder: 'border-indigo-500/30',
  },
  {
    id: 'standard',
    label: 'Standards',
    description: 'Specifications and formal documents',
    accentText: 'text-teal-400',
    accentBg: 'bg-teal-500/10',
    accentBorder: 'border-teal-500/30',
  },
];

/* ============================================================
   GLOSSARY TERMS (Bagian 1 — cipher + hash)
   Bagian 2 (protocol, attack, concept, math) menyusul.
============================================================ */
export const GLOSSARY_TERMS: GlossaryTerm[] = [
  /* ---------------- CIPHERS ---------------- */
  {
    id: 'aes',
    term: 'AES',
    category: 'cipher',
    definition:
      'Advanced Encryption Standard. A symmetric block cipher standardized by NIST in 2001 as FIPS 197. It processes 128-bit blocks with 128, 192, or 256-bit keys — and remains unbroken after two decades of intense scrutiny.',
    example: 'AES-256-GCM is the default cipher for TLS 1.3 connections.',
    relatedAlgorithms: ['aes'],
    relatedLessons: ['symmetric-crypto'],
  },
  {
    id: 'aes-gcm',
    term: 'AES-GCM',
    category: 'cipher',
    definition:
      'AES in Galois/Counter Mode. An AEAD cipher that provides both confidentiality (via AES-CTR) and integrity (via GHASH authentication tag) in a single pass.',
    example: 'Every HTTPS connection using TLS 1.3 likely uses AES-GCM.',
    relatedAlgorithms: ['aes'],
    relatedTerms: ['aead', 'nonce'],
  },
  {
    id: 'rsa',
    term: 'RSA',
    category: 'cipher',
    definition:
      'A public-key cryptosystem invented by Rivest, Shamir, and Adleman in 1977. Its security rests on the difficulty of factoring large integers. Today it is used primarily for digital signatures and key encapsulation.',
    example: 'RSA-2048 is the minimum recommended key size for modern use.',
    relatedAlgorithms: ['rsa'],
    relatedTerms: ['public-key-cryptography', 'integer-factorization'],
  },
  {
    id: 'chacha20',
    term: 'ChaCha20',
    category: 'cipher',
    definition:
      'A modern stream cipher designed by Daniel J. Bernstein in 2008. It uses only Add-Rotate-XOR (ARX) operations, making it immune to cache-timing attacks and fast on any CPU.',
    example: 'ChaCha20-Poly1305 is used in TLS 1.3, WireGuard, and Signal.',
    relatedAlgorithms: ['chacha20'],
    relatedTerms: ['stream-cipher', 'aead'],
  },
  {
    id: 'caesar-cipher',
    term: 'Caesar Cipher',
    category: 'cipher',
    definition:
      'A monoalphabetic substitution cipher in which each letter is shifted by a fixed number of positions. Named after Julius Caesar, who reportedly used a shift of 3.',
    example: 'With shift 3, "HELLO" becomes "KHOOR".',
    relatedAlgorithms: ['caesar'],
    relatedTerms: ['monoalphabetic', 'substitution-cipher'],
  },
  {
    id: 'vigenere',
    term: 'Vigenère Cipher',
    category: 'cipher',
    definition:
      'A polyalphabetic substitution cipher that uses a keyword to apply different Caesar shifts to each letter. It resisted cryptanalysis for 300 years until Kasiski\'s 1863 attack.',
    example: 'Keyword "KEY" shifts the plaintext by 10, 4, 24 repeatedly.',
    relatedAlgorithms: ['vigenere'],
    relatedTerms: ['polyalphabetic', 'kasiski-examination'],
  },
  {
    id: 'atbash',
    term: 'Atbash Cipher',
    category: 'cipher',
    definition:
      'A Hebrew mirror cipher that maps the first letter of the alphabet to the last (A↔Z, B↔Y). It has no key and is perfectly self-inverse — an involution.',
    example: 'Atbash of "SECURITY" is "HVXFIRGB".',
    relatedAlgorithms: ['atbash'],
    relatedTerms: ['involutory-cipher'],
  },
  {
    id: 'xor-cipher',
    term: 'XOR Cipher',
    category: 'cipher',
    definition:
      'A bitwise cipher that combines plaintext bytes with key bytes using the XOR operation. It is its own inverse: (A ⊕ B) ⊕ B = A. It forms the foundation of every modern cipher and stream cipher.',
    example: 'XOR with a truly random key of message length gives a One-Time Pad.',
    relatedAlgorithms: ['xor'],
    relatedTerms: ['one-time-pad', 'stream-cipher'],
  },
  {
    id: 'one-time-pad',
    term: 'One-Time Pad (OTP)',
    category: 'cipher',
    definition:
      'A cipher that XORs plaintext with a truly random key that is as long as the message and never reused. Proven by Shannon in 1949 to have perfect secrecy — the only cipher with information-theoretic security.',
    example: 'The Vernam cipher (1917) was the first practical OTP implementation.',
    relatedAlgorithms: ['xor'],
    relatedTerms: ['perfect-secrecy', 'two-time-pad'],
  },
  {
    id: 'block-cipher',
    term: 'Block Cipher',
    category: 'cipher',
    definition:
      'A cipher that processes plaintext in fixed-size blocks (e.g., 128 bits for AES). Modes of operation like CBC, CTR, and GCM extend block ciphers to arbitrary-length data.',
    example: 'AES is a 128-bit block cipher; DES was a 64-bit block cipher.',
    relatedAlgorithms: ['aes'],
    relatedTerms: ['stream-cipher', 'aead'],
  },
  {
    id: 'stream-cipher',
    term: 'Stream Cipher',
    category: 'cipher',
    definition:
      'A cipher that processes data byte-by-byte (or bit-by-bit) by XORing plaintext with a pseudorandom keystream. Stream ciphers are typically faster than block ciphers and require no padding.',
    example: 'ChaCha20 and RC4 are stream ciphers.',
    relatedAlgorithms: ['chacha20', 'xor'],
    relatedTerms: ['block-cipher', 'keystream'],
  },
  {
    id: 'symmetric-encryption',
    term: 'Symmetric Encryption',
    category: 'cipher',
    definition:
      'Encryption in which the same key is used for both encryption and decryption. It is fast and suitable for bulk data, but requires a secure channel to share the key.',
    example: 'AES-GCM and ChaCha20-Poly1305 are symmetric ciphers.',
    relatedAlgorithms: ['aes', 'chacha20'],
    relatedTerms: ['asymmetric-encryption'],
  },
  {
    id: 'asymmetric-encryption',
    term: 'Asymmetric Encryption',
    category: 'cipher',
    definition:
      'Encryption using a key pair: a public key for encryption and a private key for decryption. It solves the key distribution problem but is ~1,000× slower than symmetric encryption.',
    example: 'RSA-OAEP and ECIES are asymmetric encryption schemes.',
    relatedAlgorithms: ['rsa'],
    relatedTerms: ['symmetric-encryption', 'public-key-cryptography'],
  },
  {
    id: 'aead',
    term: 'AEAD',
    category: 'cipher',
    definition:
      'Authenticated Encryption with Associated Data. A cryptographic scheme that provides confidentiality and integrity in one operation, while allowing additional unencrypted data to be authenticated.',
    example: 'AES-GCM and ChaCha20-Poly1305 are AEAD ciphers used in TLS 1.3.',
    relatedAlgorithms: ['aes', 'chacha20'],
    relatedTerms: ['mac', 'nonce'],
  },
  {
    id: 'feistel-network',
    term: 'Feistel Network',
    category: 'cipher',
    definition:
      'A symmetric structure used in block ciphers where the encryption and decryption operations are identical except for reversed key order. DES and Blowfish use this structure.',
    example: 'DES uses a 16-round Feistel network.',
    relatedTerms: ['block-cipher', 'des'],
  },

  /* ---------------- HASHES ---------------- */
  {
    id: 'hash-function',
    term: 'Hash Function',
    category: 'hash',
    definition:
      'A one-way function that maps input of any size to a fixed-size output (digest). Cryptographic hash functions provide preimage resistance, second preimage resistance, and collision resistance.',
    example: 'SHA-256 maps "abc" to ba7816bf8f01cfea...015ad.',
    relatedAlgorithms: ['sha256', 'sha512'],
    relatedTerms: ['collision-resistance', 'digest'],
  },
  {
    id: 'sha256',
    term: 'SHA-256',
    category: 'hash',
    definition:
      'Secure Hash Algorithm producing a 256-bit (64 hex chars) digest. Part of the SHA-2 family, standardized in FIPS 180-4. It is widely used in TLS, Git, and Bitcoin.',
    example: 'SHA-256 of "abc" is ba7816bf8f01cfea414140de5dae2223...',
    relatedAlgorithms: ['sha256'],
    relatedTerms: ['hash-function', 'merkle-damgard'],
  },
  {
    id: 'sha512',
    term: 'SHA-512',
    category: 'hash',
    definition:
      'The 512-bit variant of SHA-2. It uses 64-bit words (vs 32 for SHA-256) and 80 rounds, making it faster than SHA-256 on 64-bit CPUs. Preferred for long-term security.',
    example: 'SHA-512 is recommended for master key derivation and high-assurance signatures.',
    relatedAlgorithms: ['sha512'],
    relatedTerms: ['sha256', 'hash-function'],
  },
  {
    id: 'md5',
    term: 'MD5',
    category: 'hash',
    definition:
      'A 128-bit hash function designed by Ron Rivest in 1991, cryptographically broken since 2004. Practical collisions can be generated in seconds — it must never be used for security.',
    example: 'MD5 is still safe for non-adversarial checksums like cache keys.',
    relatedAlgorithms: ['md5'],
    relatedTerms: ['collision-resistance', 'hash-function'],
  },
  {
    id: 'collision-resistance',
    term: 'Collision Resistance',
    category: 'hash',
    definition:
      'The property that it is computationally infeasible to find two different inputs producing the same hash output. For an n-bit hash, collision resistance is only n/2 bits due to the Birthday Paradox.',
    example: 'SHA-256 has 128-bit collision resistance (2^128 operations needed).',
    relatedTerms: ['hash-function', 'birthday-paradox'],
  },
  {
    id: 'preimage-resistance',
    term: 'Preimage Resistance',
    category: 'hash',
    definition:
      'The property that, given a hash output H, it is computationally infeasible to find any input M such that hash(M) = H. This is why hashing is described as "one-way".',
    example: 'SHA-256 has 256-bit preimage resistance.',
    relatedTerms: ['hash-function', 'collision-resistance'],
  },
  {
    id: 'merkle-damgard',
    term: 'Merkle-Damgård',
    category: 'hash',
    definition:
      'The iterative construction used by MD5, SHA-1, and SHA-2. It processes fixed-size blocks sequentially, using the previous block\'s output as the next block\'s input. Vulnerable to length-extension attacks.',
    example: 'SHA-256 uses Merkle-Damgård with 512-bit blocks.',
    relatedTerms: ['hash-function', 'length-extension'],
  },
  {
    id: 'length-extension',
    term: 'Length Extension Attack',
    category: 'attack',
    definition:
      'An attack on Merkle-Damgård hashes where, given H(secret || message), an attacker can compute H(secret || message || padding || extra) without knowing the secret. HMAC is designed to prevent this.',
    example: 'Flickr\'s API (2009) was exploited via length extension.',
    relatedTerms: ['merkle-damgard', 'hmac'],
  },
  {
    id: 'hmac',
    term: 'HMAC',
    category: 'concept',
    definition:
      'Hash-based Message Authentication Code. A keyed MAC that combines a hash function with a secret key using nested hashing. It provides both integrity and authenticity, and is immune to length extension.',
    example: 'HMAC-SHA256 powers JWT signatures (HS256) and AWS SigV4.',
    relatedAlgorithms: ['hmac'],
    relatedTerms: ['mac', 'hash-function'],
  },
  {
    id: 'mac',
    term: 'MAC',
    category: 'concept',
    definition:
      'Message Authentication Code. A short tag computed from a message and a secret key, verifying both integrity (message unchanged) and authenticity (sender holds the key). Unlike digital signatures, MACs are symmetric.',
    example: 'HMAC-SHA256 and Poly1305 are common MACs.',
    relatedTerms: ['hmac', 'digital-signature'],
  },
  {
    id: 'argon2',
    term: 'Argon2',
    category: 'hash',
    definition:
      'A password hashing function that won the Password Hashing Competition in 2015. Deliberately slow and memory-hard, it is resistant to GPU and ASIC attacks. Recommended by OWASP for password storage.',
    example: 'Argon2id is the recommended variant for most use cases.',
    relatedTerms: ['password-hashing', 'bcrypt'],
  },
  {
    id: 'password-hashing',
    term: 'Password Hashing',
    category: 'concept',
    definition:
      'A class of deliberately slow hash functions designed specifically for storing passwords securely. They use salting, memory-hardness, and tunable cost to resist brute-force attacks.',
    example: 'Argon2, bcrypt, scrypt, and PBKDF2 are password hashing functions.',
    relatedTerms: ['argon2', 'salt'],
  },
  {
    id: 'salt',
    term: 'Salt',
    category: 'concept',
    definition:
      'Random data added to a password before hashing. It ensures that two identical passwords produce different hashes, defeating rainbow table attacks and preventing attackers from cracking multiple passwords at once.',
    example: 'Every user in a database should have a unique salt.',
    relatedTerms: ['password-hashing', 'argon2'],
  },
  {
    id: 'rainbow-table',
    term: 'Rainbow Table',
    category: 'attack',
    definition:
      'A precomputed table of password hashes used to reverse unsalted hashes quickly. Rainbow tables are defeated by salting, which forces attackers to recompute hashes for each unique salt.',
    example: 'The 2012 LinkedIn breach exposed unsalted SHA-1 hashes — vulnerable to rainbow tables.',
    relatedTerms: ['salt', 'password-hashing'],
  },
  {
    id: 'sha3',
    term: 'SHA-3',
    category: 'hash',
    definition:
      'The Keccak-based hash standard published by NIST in 2015 as FIPS 202. It uses a sponge construction — completely different from SHA-2 — and is immune to length-extension attacks. Not a replacement for SHA-2, but a structural backup.',
    example: 'SHA3-256 is the 256-bit variant of SHA-3.',
    relatedTerms: ['sha256', 'sponge-construction'],
  },
  {
    id: 'sponge-construction',
    term: 'Sponge Construction',
    category: 'math',
    definition:
      'A hash function construction used by SHA-3 and Keccak. It absorbs input into an internal state and squeezes output out, offering different security properties than Merkle-Damgård.',
    example: 'SHA-3 uses a sponge with a 1600-bit state.',
    relatedTerms: ['sha3', 'merkle-damgard'],
  },
    /* ---------------- PROTOCOLS ---------------- */
  {
    id: 'tls',
    term: 'TLS',
    category: 'protocol',
    definition:
      'Transport Layer Security. The cryptographic protocol that secures HTTPS, email, and many other internet services. TLS 1.3 (2018) mandates AEAD ciphers and forward secrecy.',
    example: 'Every HTTPS connection uses TLS to encrypt traffic.',
    relatedAlgorithms: ['aes', 'chacha20', 'rsa'],
    relatedTerms: ['forward-secrecy', 'aead'],
  },
  {
    id: 'ssh',
    term: 'SSH',
    category: 'protocol',
    definition:
      'Secure Shell. A cryptographic network protocol for secure remote login and file transfer. It uses asymmetric cryptography for authentication and symmetric encryption for the session.',
    example: 'System administrators use SSH to manage remote servers.',
    relatedTerms: ['public-key-cryptography', 'ecdh'],
  },
  {
    id: 'ipsec',
    term: 'IPsec',
    category: 'protocol',
    definition:
      'Internet Protocol Security. A suite of protocols that authenticate and encrypt IP packets. It is commonly used in VPNs to secure traffic at the network layer.',
    example: 'Enterprise VPNs typically use IPsec with AES-GCM.',
    relatedAlgorithms: ['aes'],
    relatedTerms: ['vpn', 'aead'],
  },
  {
    id: 'vpn',
    term: 'VPN',
    category: 'protocol',
    definition:
      'Virtual Private Network. A service that creates an encrypted tunnel between your device and a remote server, protecting traffic from local eavesdroppers.',
    example: 'WireGuard is a modern VPN protocol using ChaCha20-Poly1305.',
    relatedAlgorithms: ['chacha20'],
    relatedTerms: ['ipsec', 'tunnel'],
  },
  {
    id: 'signal-protocol',
    term: 'Signal Protocol',
    category: 'protocol',
    definition:
      'A cryptographic protocol for end-to-end encrypted messaging. It uses X25519, Double Ratchet, and AEAD to provide forward secrecy and post-compromise security.',
    example: 'Signal, WhatsApp, and Google Messages all use the Signal Protocol.',
    relatedTerms: ['forward-secrecy', 'x25519', 'double-ratchet'],
  },
  {
    id: 'jwt',
    term: 'JWT',
    category: 'protocol',
    definition:
      'JSON Web Token. A compact, URL-safe token format for authentication and information exchange. It consists of a Base64URL header, payload, and either HMAC or RSA signature.',
    example: 'A JWT with HS256 signature uses HMAC-SHA256.',
    relatedAlgorithms: ['hmac', 'rsa', 'base64'],
    relatedTerms: ['mac', 'digital-signature'],
  },
  {
    id: 'pki',
    term: 'PKI',
    category: 'protocol',
    definition:
      'Public Key Infrastructure. The system of certificate authorities, registration authorities, policies, and procedures that manage digital certificates and public-key encryption.',
    example: 'Your browser ships with a set of trusted PKI root certificates.',
    relatedAlgorithms: ['rsa'],
    relatedTerms: ['x509', 'certificate-authority'],
  },
  {
    id: 'x509',
    term: 'X.509',
    category: 'protocol',
    definition:
      'The ITU-T standard for public key certificates. An X.509 certificate binds a public key to an identity (e.g., a domain name) and is signed by a certificate authority.',
    example: 'Every HTTPS site presents an X.509 certificate.',
    relatedTerms: ['pki', 'certificate-authority'],
  },
  {
    id: 'certificate-authority',
    term: 'Certificate Authority (CA)',
    category: 'protocol',
    definition:
      'A trusted organization that issues and signs digital certificates. Browsers and operating systems maintain a list of trusted CAs — the anchor of the entire HTTPS trust model.',
    example: 'Let\'s Encrypt, DigiCert, and GlobalSign are major CAs.',
    relatedTerms: ['x509', 'pki'],
  },
  {
    id: 'diffie-hellman',
    term: 'Diffie-Hellman',
    category: 'protocol',
    definition:
      'A key exchange protocol published in 1976 that allows two parties to agree on a shared secret over an untrusted channel. It solved the key distribution problem.',
    example: 'ECDHE (Ephemeral Diffie-Hellman) provides forward secrecy in TLS 1.3.',
    relatedTerms: ['key-exchange', 'ecdh', 'forward-secrecy'],
    people: ['Whitfield Diffie', 'Martin Hellman'],
  },
  {
    id: 'ecdh',
    term: 'ECDH',
    category: 'protocol',
    definition:
      'Elliptic Curve Diffie-Hellman. A key exchange protocol using elliptic curve cryptography. It offers the same security as classical Diffie-Hellman with much smaller keys.',
    example: 'X25519 is a widely-used ECDH curve.',
    relatedTerms: ['diffie-hellman', 'ecc'],
  },
  {
    id: 'ecc',
    term: 'ECC',
    category: 'concept',
    definition:
      'Elliptic Curve Cryptography. A family of public-key algorithms based on the algebraic structure of elliptic curves over finite fields. ECC offers 128-bit security with only 256-bit keys — 12× smaller than RSA equivalents.',
    example: 'Bitcoin uses ECC (secp256k1) for transaction signatures.',
    relatedTerms: ['ecdh', 'ecdsa'],
  },
  {
    id: 'ecdsa',
    term: 'ECDSA',
    category: 'concept',
    definition:
      'Elliptic Curve Digital Signature Algorithm. The elliptic-curve analogue of DSA, standardized in FIPS 186. It uses a per-signature random nonce — reusing it leaks the private key (as happened with the Sony PS3 in 2010).',
    example: 'Every Bitcoin transaction is signed with ECDSA.',
    relatedTerms: ['ecc', 'digital-signature'],
  },

  /* ---------------- ATTACKS ---------------- */
  {
    id: 'brute-force',
    term: 'Brute-Force Attack',
    category: 'attack',
    definition:
      'An attack that tries every possible key until the correct one is found. Its feasibility depends entirely on key size — the Caesar cipher falls in milliseconds, AES-256 in the heat death of the universe.',
    example: 'A 25-key Caesar cipher is brute-forced by trying all 25 shifts.',
    relatedTerms: ['keyspace', 'entropy'],
  },
  {
    id: 'frequency-analysis',
    term: 'Frequency Analysis',
    category: 'attack',
    definition:
      'A cryptanalytic technique that exploits the non-uniform distribution of letters in natural language. In English, "E" appears ~12.7% of the time — so the most common ciphertext letter is likely shifted "E".',
    example: 'Frequency analysis breaks monoalphabetic ciphers like Caesar.',
    relatedAlgorithms: ['caesar', 'vigenere'],
    relatedTerms: ['monoalphabetic', 'index-of-coincidence'],
  },
  {
    id: 'kasiski-examination',
    term: 'Kasiski Examination',
    category: 'attack',
    definition:
      'A cryptanalytic technique for breaking Vigenère-like ciphers. It finds repeated sequences in the ciphertext and computes the GCD of their distances — revealing the keyword length.',
    example: 'Repeated "ABC" at positions 10 and 25 → distance 15 → likely key length 5, 3, or 15.',
    relatedAlgorithms: ['vigenere'],
    relatedTerms: ['polyalphabetic', 'frequency-analysis'],
  },
  {
    id: 'chosen-plaintext',
    term: 'Chosen-Plaintext Attack',
    category: 'attack',
    definition:
      'An attack model where the adversary can request encryptions of arbitrary plaintexts. Modern ciphers are designed to be IND-CPA secure — indistinguishable under chosen-plaintext attack.',
    example: 'AES-GCM is proven IND-CPA secure (and IND-CCA2).',
    relatedTerms: ['chosen-ciphertext', 'attack-model'],
  },
  {
    id: 'chosen-ciphertext',
    term: 'Chosen-Ciphertext Attack',
    category: 'attack',
    definition:
      'An attack model where the adversary can also request decryptions of arbitrary ciphertexts. The strongest standard model — AEAD ciphers are designed to resist this.',
    example: 'Textbook RSA is vulnerable to chosen-ciphertext attacks; RSA-OAEP is not.',
    relatedAlgorithms: ['rsa', 'aes'],
    relatedTerms: ['chosen-plaintext', 'cca-security'],
  },
  {
    id: 'padding-oracle',
    term: 'Padding Oracle Attack',
    category: 'attack',
    definition:
      'An attack on CBC-mode encryption that exploits error messages distinguishing "invalid padding" from other failures. It decrypts entire ciphertexts byte-by-byte without knowing the key.',
    example: 'ASP.NET (2010) and POODLE (2014) were padding oracle attacks.',
    relatedTerms: ['cbc-mode', 'aead'],
  },
  {
    id: 'two-time-pad',
    term: 'Two-Time Pad',
    category: 'attack',
    definition:
      'Reusing a One-Time Pad key across multiple messages. It breaks the cipher: XORing two ciphertexts (C1 ⊕ C2) reveals the XOR of plaintexts (P1 ⊕ P2) — often enough to recover both.',
    example: 'The Soviet VENONA project was broken via Two-Time Pad in the 1940s.',
    relatedAlgorithms: ['xor'],
    relatedTerms: ['one-time-pad', 'nonce-reuse'],
  },
  {
    id: 'nonce-reuse',
    term: 'Nonce Reuse',
    category: 'attack',
    definition:
      'Reusing a nonce with the same key in an AEAD cipher. In AES-GCM and ChaCha20-Poly1305, it is catastrophic — breaking both confidentiality and integrity.',
    example: 'A 2016 study found 184 HTTPS servers reusing GCM nonces.',
    relatedAlgorithms: ['aes', 'chacha20'],
    relatedTerms: ['nonce', 'aead'],
  },
  {
    id: 'mitm',
    term: 'MITM (Man-in-the-Middle)',
    category: 'attack',
    definition:
      'An attack in which the adversary secretly relays and possibly alters communication between two parties who believe they are communicating directly. PKI and certificates are designed to prevent MITM in HTTPS.',
    example: 'Without certificate validation, HTTPS is vulnerable to MITM.',
    relatedTerms: ['pki', 'x509', 'certificate-authority'],
  },
  {
    id: 'timing-attack',
    term: 'Timing Attack',
    category: 'attack',
    definition:
      'A side-channel attack that exploits data-dependent execution time. Naive string comparison, for example, exits early on the first byte mismatch — leaking byte-by-byte information about the secret.',
    example: 'Lucky Thirteen (2013) was a timing attack on TLS-CBC.',
    relatedTerms: ['side-channel', 'constant-time'],
  },
  {
    id: 'side-channel',
    term: 'Side-Channel Attack',
    category: 'attack',
    definition:
      'An attack that exploits physical leakage — timing, power consumption, cache access patterns, electromagnetic emissions — rather than weaknesses in the algorithm itself.',
    example: 'Spectre and Meltdown (2018) exploited speculative-execution side channels.',
    relatedTerms: ['timing-attack', 'constant-time'],
  },
  {
    id: 'quantum-attack',
    term: 'Quantum Attack',
    category: 'attack',
    definition:
      'An attack using a quantum computer. Shor\'s algorithm factors RSA and breaks ECC in polynomial time. Grover\'s algorithm halves symmetric key security. This drives post-quantum migration.',
    example: 'NIST standardized ML-KEM (Kyber) in 2024 to replace ECDH.',
    relatedTerms: ['shor-algorithm', 'post-quantum'],
  },

  /* ---------------- CONCEPTS ---------------- */
  {
    id: 'plaintext',
    term: 'Plaintext',
    category: 'concept',
    definition:
      'The original, readable form of information before encryption. Plaintext can be text, files, or any binary data.',
    example: '"Meet me at 5 PM" is plaintext.',
    relatedTerms: ['ciphertext'],
  },
  {
    id: 'ciphertext',
    term: 'Ciphertext',
    category: 'concept',
    definition:
      'The encrypted, unreadable output of a cipher. Ciphertext should be indistinguishable from random noise to an attacker without the key.',
    example: '"KHOOR" is the ciphertext of "HELLO" under Caesar shift 3.',
    relatedTerms: ['plaintext', 'encryption'],
  },
  {
    id: 'encryption',
    term: 'Encryption',
    category: 'concept',
    definition:
      'The process of converting plaintext into ciphertext using an algorithm and a key. Reversible only with the correct key.',
    example: 'AES-GCM encrypts plaintext using a 256-bit key and 96-bit nonce.',
    relatedTerms: ['decryption', 'plaintext', 'ciphertext'],
  },
  {
    id: 'decryption',
    term: 'Decryption',
    category: 'concept',
    definition:
      'The process of converting ciphertext back to plaintext using the correct key. Without the key, decryption should be computationally infeasible.',
    example: 'AES-GCM decrypts ciphertext only if the authentication tag is valid.',
    relatedTerms: ['encryption', 'ciphertext'],
  },
  {
    id: 'key',
    term: 'Key',
    category: 'concept',
    definition:
      'The secret parameter that controls encryption and decryption. Key strength depends on its length (bits) and its entropy (randomness).',
    example: 'AES-256 uses a 256-bit key; RSA-2048 uses a 2048-bit modulus.',
    relatedTerms: ['entropy', 'keyspace'],
  },
  {
    id: 'keyspace',
    term: 'Keyspace',
    category: 'concept',
    definition:
      'The total number of possible keys in a cipher. A larger keyspace means more brute-force resistance. An n-bit key has 2^n possible values.',
    example: 'Caesar has a keyspace of 25; AES-256 has 2^256.',
    relatedTerms: ['key', 'brute-force'],
  },
  {
    id: 'entropy',
    term: 'Entropy',
    category: 'concept',
    definition:
      'A measure of unpredictability in bits. A 256-bit key with only 40 bits of entropy is effectively a 40-bit key — brute-forceable. Always use a CSPRNG for keys.',
    example: 'crypto.getRandomValues() provides full-entropy random bytes.',
    relatedTerms: ['key', 'csprng'],
  },
  {
    id: 'csprng',
    term: 'CSPRNG',
    category: 'concept',
    definition:
      'Cryptographically Secure Pseudorandom Number Generator. A random number generator suitable for cryptographic use. Never use Math.random() for keys or nonces.',
    example: 'crypto.getRandomValues() is a browser CSPRNG.',
    relatedTerms: ['entropy', 'nonce'],
  },
  {
    id: 'nonce',
    term: 'Nonce',
    category: 'concept',
    definition:
      'A "number used once". A random or sequential value used once per encryption to ensure ciphertexts differ even for identical plaintexts. Nonce reuse is catastrophic in AEAD ciphers.',
    example: 'AES-GCM requires a unique 96-bit nonce per encryption.',
    relatedTerms: ['iv', 'nonce-reuse'],
  },
  {
    id: 'iv',
    term: 'IV (Initialization Vector)',
    category: 'concept',
    definition:
      'A random value used alongside the key in block cipher modes (like CBC) to ensure that encrypting the same plaintext twice produces different ciphertexts. IVs do not need to be secret, but must be unique.',
    example: 'CBC mode uses a random 128-bit IV for AES.',
    relatedTerms: ['nonce', 'block-cipher'],
  },
  {
    id: 'kerckhoffs-principle',
    term: 'Kerckhoffs\'s Principle',
    category: 'concept',
    definition:
      'The principle that a cipher must be secure even if everything about the system except the key is public. Modern cryptography relies on published algorithms and secret keys — never on obscure algorithms.',
    example: 'AES, RSA, and SHA-256 are all fully public and still secure.',
    relatedTerms: ['security-through-obscurity'],
    people: ['Auguste Kerckhoffs'],
  },
  {
    id: 'security-through-obscurity',
    term: 'Security Through Obscurity',
    category: 'concept',
    definition:
      'Relying on the secrecy of the algorithm (rather than the key) for security. This is universally considered a bad practice — history has repeatedly shown it fails.',
    example: 'DVD CSS and early Enigma relied on obscurity — both were broken.',
    relatedTerms: ['kerckhoffs-principle'],
  },
  {
    id: 'cryptanalysis',
    term: 'Cryptanalysis',
    category: 'concept',
    definition:
      'The science of analyzing cryptographic systems to find weaknesses. It drives the evolution of cryptography — every cipher that falls teaches us what to avoid.',
    example: 'Frequency analysis, Kasiski examination, and padding oracle attacks are cryptanalytic techniques.',
    relatedTerms: ['frequency-analysis', 'kasiski-examination'],
  },
  {
    id: 'perfect-secrecy',
    term: 'Perfect Secrecy',
    category: 'concept',
    definition:
      'The strongest notion of confidentiality: even an adversary with infinite computing power learns nothing about the plaintext from the ciphertext. Only the One-Time Pad achieves this.',
    example: 'Shannon proved OTP has perfect secrecy in 1949.',
    relatedTerms: ['one-time-pad', 'information-theoretic-security'],
    people: ['Claude Shannon'],
  },
  {
    id: 'forward-secrecy',
    term: 'Forward Secrecy',
    category: 'concept',
    definition:
      'A property of key exchange protocols where session keys are ephemeral — they cannot be recovered even if the long-term private key is later compromised. TLS 1.3 mandates it via ECDHE.',
    example: 'If a server\'s private key leaks tomorrow, yesterday\'s sessions remain secure.',
    relatedTerms: ['ecdh', 'tls'],
  },
  {
    id: 'post-quantum',
    term: 'Post-Quantum',
    category: 'concept',
    definition:
      'Cryptographic algorithms designed to resist quantum computer attacks. In 2024 NIST standardized ML-KEM (Kyber) for key exchange and ML-DSA (Dilithium) for signatures.',
    example: 'ML-KEM-768 replaces ECDH in post-quantum TLS.',
    relatedTerms: ['quantum-attack', 'shor-algorithm', 'lattice-cryptography'],
  },
  {
    id: 'digital-signature',
    term: 'Digital Signature',
    category: 'concept',
    definition:
      'A cryptographic scheme that proves authenticity, integrity, and non-repudiation of a message. Signed with the sender\'s private key, verified with the public key.',
    example: 'Code signing, TLS certificates, and legal e-signatures all use digital signatures.',
    relatedTerms: ['ecdsa', 'rsa', 'non-repudiation'],
  },
  {
    id: 'non-repudiation',
    term: 'Non-Repudiation',
    category: 'concept',
    definition:
      'The property that a signer cannot deny having signed a message. Provided by digital signatures (not MACs) because only the signer holds the private key.',
    example: 'A digital contract signed with ECDSA provides non-repudiation.',
    relatedTerms: ['digital-signature'],
  },
  {
    id: 'confusion-diffusion',
    term: 'Confusion & Diffusion',
    category: 'concept',
    definition:
      'Shannon\'s two principles for cipher design. Confusion obscures the relationship between key and ciphertext; diffusion spreads plaintext influence across the whole ciphertext.',
    example: 'AES achieves both via S-boxes (confusion) and MixColumns (diffusion).',
    relatedAlgorithms: ['aes'],
    relatedTerms: ['shannon'],
  },

  /* ---------------- MATHEMATICS ---------------- */
  {
    id: 'modular-arithmetic',
    term: 'Modular Arithmetic',
    category: 'math',
    definition:
      'Arithmetic performed modulo a number, wrapping around when exceeding it. It is the mathematical foundation of RSA, Diffie-Hellman, and elliptic curve cryptography.',
    example: 'Caesar cipher uses mod 26; RSA uses mod N.',
    relatedTerms: ['rsa', 'diffie-hellman'],
  },
  {
    id: 'integer-factorization',
    term: 'Integer Factorization',
    category: 'math',
    definition:
      'The problem of finding the prime factors of a composite number. RSA security rests on its hardness — no efficient classical algorithm exists for 2048-bit numbers.',
    example: 'Factoring a 2048-bit modulus would take longer than the age of the universe.',
    relatedTerms: ['rsa', 'shor-algorithm'],
  },
  {
    id: 'shor-algorithm',
    term: 'Shor\'s Algorithm',
    category: 'math',
    definition:
      'A quantum algorithm published by Peter Shor in 1994 that factors integers and computes discrete logs in polynomial time. It would break RSA and ECC on a sufficiently large quantum computer.',
    example: 'Post-quantum migration is driven by Shor\'s algorithm.',
    relatedTerms: ['quantum-attack', 'post-quantum'],
    people: ['Peter Shor'],
  },
  {
    id: 'lattice-cryptography',
    term: 'Lattice Cryptography',
    category: 'math',
    definition:
      'A family of cryptographic algorithms based on the hardness of lattice problems (like Learning With Errors). Believed quantum-resistant, driving NIST PQC standards.',
    example: 'ML-KEM (Kyber) uses Module-LWE.',
    relatedTerms: ['post-quantum', 'lwe'],
  },
  {
    id: 'lwe',
    term: 'Learning With Errors (LWE)',
    category: 'math',
    definition:
      'A hard mathematical problem introduced by Oded Regev in 2005. Given noisy linear equations, recover the secret vector — believed hard for both classical and quantum computers.',
    example: 'ML-KEM and ML-DSA both use LWE variants.',
    relatedTerms: ['lattice-cryptography', 'post-quantum'],
    people: ['Oded Regev'],
  },
  {
    id: 'gf2-128',
    term: 'GF(2^128)',
    category: 'math',
    definition:
      'The Galois field with 2^128 elements. Used by AES-GCM\'s GHASH authentication — multiplication in this field provides fast, tamper-evident authentication.',
    example: 'GHASH multiplies ciphertext blocks in GF(2^128).',
    relatedAlgorithms: ['aes'],
    relatedTerms: ['aes-gcm'],
  },
  {
    id: 'merkle-tree',
    term: 'Merkle Tree',
    category: 'math',
    definition:
      'A binary hash tree where each leaf is a hash and each internal node is the hash of its children. It enables efficient proof of inclusion in a set — used in Git, Bitcoin, and certificate transparency.',
    example: 'A Bitcoin block commits to thousands of transactions via a Merkle root.',
    relatedTerms: ['hash-function', 'proof-of-work'],
  },
  /* ---------------- NEW: CIPHERS (+6) ---------------- */
  {
    id: 'des',
    term: 'DES',
    category: 'cipher',
    definition:
      'Data Encryption Standard. A 56-bit symmetric block cipher adopted as FIPS 46 in 1977. Its short key size made it obsolete by the late 1990s, replaced by AES.',
    example: 'DES was brute-forced in 22 hours in 1999 (Deep Crack).',
    relatedTerms: ['3des', 'aes', 'block-cipher', 'fips'],
  },
  {
    id: '3des',
    term: '3DES / Triple DES',
    category: 'cipher',
    definition:
      'A variant of DES that applies the cipher three times with different keys, extending effective key length to 112 or 168 bits. Deprecated by NIST in 2023 — replaced by AES.',
    example: '3DES is still found in legacy banking systems (ATM PIN blocks).',
    relatedTerms: ['des', 'aes'],
  },
  {
    id: 'blowfish',
    term: 'Blowfish',
    category: 'cipher',
    definition:
      'A symmetric block cipher designed by Bruce Schneier in 1993. Its 64-bit block size makes it unsuitable for large files. Succeeded by Twofish and AES.',
    example: 'Blowfish is used in bcrypt password hashing.',
    relatedTerms: ['twofish', 'aes', 'feistel-network'],
  },
  {
    id: 'rc4',
    term: 'RC4',
    category: 'cipher',
    definition:
      'A stream cipher designed by Ron Rivest in 1987. Once widely used in SSL, WEP, and WPA, it is now completely broken due to statistical biases in its keystream.',
    example: 'RC4 was removed from all major browsers by 2015.',
    relatedTerms: ['stream-cipher', 'keystream'],
  },
  {
    id: 'playfair',
    term: 'Playfair Cipher',
    category: 'cipher',
    definition:
      'A digraph substitution cipher invented by Charles Wheatstone in 1854. It encrypts pairs of letters using a 5×5 grid, defeating simple frequency analysis.',
    example: 'Playfair was used by British forces in World War I.',
    relatedTerms: ['substitution-cipher', 'frequency-analysis'],
  },
  {
    id: 'hill-cipher',
    term: 'Hill Cipher',
    category: 'cipher',
    definition:
      'A polygraphic substitution cipher based on linear algebra, invented by Lester Hill in 1929. It encrypts blocks of letters using matrix multiplication mod 26.',
    example: 'Hill cipher introduces linear algebra to classical cryptography.',
    relatedTerms: ['substitution-cipher', 'modular-arithmetic'],
  },

  /* ---------------- NEW: HASHES (+4) ---------------- */
  {
    id: 'sha1',
    term: 'SHA-1',
    category: 'hash',
    definition:
      'A 160-bit hash function published by NIST in 1995. Broken by a practical collision attack in 2017 ("SHAttered"). Deprecated for all security purposes.',
    example: 'Git historically used SHA-1 for commit IDs — migrating to SHA-256.',
    relatedTerms: ['sha256', 'collision-resistance', 'hash-function'],
  },
  {
    id: 'bcrypt',
    term: 'bcrypt',
    category: 'hash',
    definition:
      'A password hashing function based on the Blowfish cipher, designed in 1999. Deliberately slow with a tunable cost factor. Still widely used, though Argon2 is preferred.',
    example: 'bcrypt uses a cost factor (e.g., 12) to control computational expense.',
    relatedTerms: ['argon2', 'password-hashing', 'blowfish'],
  },
  {
    id: 'pbkdf2',
    term: 'PBKDF2',
    category: 'hash',
    definition:
      'Password-Based Key Derivation Function 2, defined in RFC 8018. Applies HMAC repeatedly (thousands of iterations) to derive keys from passwords. Older than Argon2 but still acceptable.',
    example: 'PBKDF2-HMAC-SHA256 with 600,000 iterations is OWASP-recommended.',
    relatedTerms: ['argon2', 'bcrypt', 'hmac', 'kdf'],
  },
  {
    id: 'blake3',
    term: 'BLAKE3',
    category: 'hash',
    definition:
      'A modern cryptographic hash function released in 2020, based on BLAKE2. Extremely fast (faster than SHA-256 and even MD5 in software) while remaining cryptographically secure.',
    example: 'BLAKE3 is used in modern build systems and content-addressed storage.',
    relatedTerms: ['sha3', 'hash-function'],
  },

  /* ---------------- NEW: PROTOCOLS (+4) ---------------- */
  {
    id: 'pgp',
    term: 'PGP / GPG',
    category: 'protocol',
    definition:
      'Pretty Good Privacy (and its open-source variant GNU Privacy Guard). A hybrid encryption system for email and files, using RSA/ECC for key exchange and AES for bulk encryption.',
    example: 'PGP signatures are common in open-source release verification.',
    relatedTerms: ['hybrid-encryption', 'digital-signature', 'rsa'],
  },
  {
    id: 'kerberos',
    term: 'Kerberos',
    category: 'protocol',
    definition:
      'A network authentication protocol developed at MIT in the 1980s. Uses symmetric cryptography and a trusted third party (KDC) to authenticate users in Windows Active Directory and enterprise networks.',
    example: 'Kerberos is the default auth protocol for Windows domains.',
    relatedTerms: ['authentication', 'symmetric-encryption'],
  },
  {
    id: 'wireguard',
    term: 'WireGuard',
    category: 'protocol',
    definition:
      'A modern VPN protocol designed in 2016, using Curve25519, ChaCha20-Poly1305, and BLAKE2. Its small codebase (~4,000 lines) makes it easy to audit and fast.',
    example: 'WireGuard is now built into the Linux kernel and supported by most VPN providers.',
    relatedTerms: ['chacha20', 'vpn', 'ecc'],
  },
  {
    id: 'oauth',
    term: 'OAuth 2.0',
    category: 'protocol',
    definition:
      'An authorization framework that allows third-party applications to access resources on behalf of a user, without revealing the user\'s password. Uses access tokens (often JWTs).',
    example: '"Sign in with Google" uses OAuth 2.0.',
    relatedTerms: ['jwt', 'authentication'],
  },

  /* ---------------- NEW: ATTACKS (+6) ---------------- */
  {
    id: 'birthday-attack',
    term: 'Birthday Attack',
    category: 'attack',
    definition:
      'A cryptanalytic attack exploiting the Birthday Paradox: finding a collision in an n-bit hash requires only ~2^(n/2) attempts, not 2^n. This is why SHA-256 provides 128-bit collision resistance.',
    example: 'A 64-bit hash has only ~32-bit collision resistance.',
    relatedTerms: ['collision-resistance', 'hash-function'],
  },
  {
    id: 'known-plaintext',
    term: 'Known-Plaintext Attack',
    category: 'attack',
    definition:
      'An attack model where the adversary has access to plaintext–ciphertext pairs. Historical ciphers (Caesar, Vigenère) fall immediately to this — a single pair reveals the key.',
    example: 'The Allies used known-plaintext attacks against Enigma using weather reports.',
    relatedTerms: ['chosen-plaintext', 'chosen-ciphertext', 'attack-model'],
  },
  {
    id: 'replay-attack',
    term: 'Replay Attack',
    category: 'attack',
    definition:
      'An attack where the adversary captures and later retransmits a valid message. Prevented by nonces, timestamps, and unique session identifiers in modern protocols.',
    example: 'TLS uses unique nonces in the handshake to prevent replay.',
    relatedTerms: ['nonce', 'mitm'],
  },
  {
    id: 'downgrade-attack',
    term: 'Downgrade Attack',
    category: 'attack',
    definition:
      'An attack where the adversary forces two parties to negotiate a weaker protocol or cipher than they would otherwise choose. TLS 1.3 fixed this by removing support for legacy ciphers.',
    example: 'POODLE (2014) exploited a downgrade to SSL 3.0.',
    relatedTerms: ['mitm', 'tls'],
  },
  {
    id: 'bleichenbacher',
    term: 'Bleichenbacher Attack',
    category: 'attack',
    definition:
      'A 1998 adaptive chosen-ciphertext attack against RSA with PKCS#1 v1.5 padding. It exploits error messages that distinguish valid from invalid padding. Fixed by OAEP.',
    example: 'Bleichenbacher forced the adoption of RSA-OAEP.',
    relatedTerms: ['rsa', 'padding-oracle', 'chosen-ciphertext'],
  },
  {
    id: 'meet-in-the-middle',
    term: 'Meet-in-the-Middle Attack',
    category: 'attack',
    definition:
      'An attack that trades memory for time by attacking each half of a cipher separately, then matching results. It is why 2DES provides only ~57-bit security instead of 112 bits.',
    example: 'Meet-in-the-middle reduced 2DES to barely stronger than DES.',
    relatedTerms: ['des', 'brute-force'],
  },

  /* ---------------- NEW: CONCEPTS (+10) ---------------- */
  {
    id: 'kdf',
    term: 'Key Derivation Function (KDF)',
    category: 'concept',
    definition:
      'A function that derives one or more secret keys from a password or master key. Examples: PBKDF2, HKDF, Argon2. Use a KDF — never raw hashing — to turn passwords into keys.',
    example: 'HKDF-SHA256 derives subkeys for TLS 1.3.',
    relatedTerms: ['pbkdf2', 'argon2', 'hkdf'],
  },
  {
    id: 'kem',
    term: 'Key Encapsulation Mechanism (KEM)',
    category: 'concept',
    definition:
      'A public-key scheme that encapsulates a randomly generated symmetric key, allowing it to be transported securely. ML-KEM (Kyber) is the NIST post-quantum KEM.',
    example: 'TLS 1.3 hybrid mode combines ECDH with ML-KEM.',
    relatedTerms: ['post-quantum', 'lattice-cryptography'],
  },
  {
    id: 's-box',
    term: 'S-Box (Substitution Box)',
    category: 'concept',
    definition:
      'A lookup table used in block ciphers to provide non-linearity (confusion). AES uses one 256-byte S-box; DES uses eight. S-box lookups can leak through cache timing — a reason ChaCha20 avoids them.',
    example: 'AES SubBytes applies the S-box to every byte of state.',
    relatedTerms: ['aes', 'confusion-diffusion', 'chacha20'],
  },
  {
    id: 'padding',
    term: 'Padding',
    category: 'concept',
    definition:
      'Extra bytes added to plaintext so it fits the cipher block size, or to add randomness and prevent malleability. Examples: PKCS#7 (block ciphers), OAEP (RSA), ISO/IEC 7816-4.',
    example: 'PKCS#7 padding adds 1–16 bytes to complete the final block.',
    relatedTerms: ['rsa', 'padding-oracle', 'block-cipher'],
  },
  {
    id: 'hybrid-encryption',
    term: 'Hybrid Encryption',
    category: 'concept',
    definition:
      'A scheme that uses asymmetric encryption to transport a symmetric key, then symmetric encryption for bulk data. This is how TLS, PGP, and Signal work — combining the strengths of both.',
    example: 'TLS 1.3 uses ECDHE for key exchange, AES-GCM for data.',
    relatedTerms: ['asymmetric-encryption', 'symmetric-encryption', 'tls'],
  },
  {
    id: 'public-key-cryptography',
    term: 'Public-Key Cryptography',
    category: 'concept',
    definition:
      'Cryptography using a mathematically linked key pair: a public key (shared) and a private key (secret). Introduced by Diffie-Hellman (1976) and RSA (1977), it solved the key distribution problem.',
    example: 'RSA, ECC, and post-quantum ML-KEM are all public-key systems.',
    relatedTerms: ['key-exchange', 'asymmetric-encryption', 'diffie-hellman'],
  },
  {
    id: 'key-distribution',
    term: 'Key Distribution Problem',
    category: 'concept',
    definition:
      'The challenge of securely sharing a symmetric key between two parties who have never met. Public-key cryptography solved this — one of the most important advances in the field.',
    example: 'Diffie-Hellman was the first solution to the key distribution problem.',
    relatedTerms: ['public-key-cryptography', 'diffie-hellman'],
  },
  {
    id: 'zero-knowledge',
    term: 'Zero-Knowledge Proof (ZKP)',
    category: 'concept',
    definition:
      'A cryptographic protocol that lets one party prove knowledge of a secret without revealing the secret itself. Used in privacy-preserving blockchains (Zcash) and modern authentication.',
    example: 'zk-SNARKs power shielded transactions in Zcash.',
    relatedTerms: ['digital-signature'],
  },
  {
    id: 'homomorphic-encryption',
    term: 'Homomorphic Encryption',
    category: 'concept',
    definition:
      'A form of encryption that allows computations to be performed directly on ciphertext, producing an encrypted result that decrypts to the correct value. Enables privacy-preserving computation.',
    example: 'Fully Homomorphic Encryption (FHE) enables computation on encrypted data.',
    relatedTerms: ['symmetric-encryption', 'asymmetric-encryption'],
  },
  {
    id: 'steganography',
    term: 'Steganography',
    category: 'concept',
    definition:
      'The practice of hiding the existence of a message, as opposed to hiding its content. Examples include embedding data in image pixels (LSB) or audio. Often combined with encryption.',
    example: 'Hiding a message in the least significant bits of an image.',
    relatedTerms: ['plaintext', 'ciphertext'],
  },

  /* ---------------- NEW: MATH (+4) ---------------- */
  {
    id: 'euler-theorem',
    term: 'Euler\'s Theorem',
    category: 'math',
    definition:
      'A foundational theorem stating that a^φ(n) ≡ 1 (mod n) for coprime a and n, where φ is Euler\'s totient. It is the mathematical basis for RSA\'s correctness.',
    example: 'RSA depends on Euler\'s theorem for M = C^d mod N to hold.',
    relatedTerms: ['rsa', 'modular-arithmetic', 'integer-factorization'],
  },
  {
    id: 'discrete-logarithm',
    term: 'Discrete Logarithm Problem',
    category: 'math',
    definition:
      'The problem of finding x given g and g^x mod p. Believed to be computationally hard — the basis of Diffie-Hellman, DSA, and ElGamal. ECC uses an elliptic-curve analogue.',
    example: 'Breaking Diffie-Hellman requires solving the discrete log problem.',
    relatedTerms: ['diffie-hellman', 'modular-arithmetic', 'ecc'],
  },
  {
    id: 'elliptic-curve',
    term: 'Elliptic Curve',
    category: 'math',
    definition:
      'A curve defined by y² = x³ + ax + b over a finite field. Points on the curve form a group under an addition operation, enabling cryptographic schemes with much smaller keys than RSA.',
    example: 'P-256, Curve25519, and secp256k1 are standard elliptic curves.',
    relatedTerms: ['ecc', 'ecdsa', 'ecdh'],
  },
  {
    id: 'trapdoor-function',
    term: 'Trapdoor Function',
    category: 'math',
    definition:
      'A mathematical function that is easy to compute in one direction but hard to invert without a secret "trapdoor". The basis for all public-key cryptography (RSA, ECC, lattice).',
    example: 'RSA\'s modular exponentiation is easy; inverting it (without d) is hard.',
    relatedTerms: ['public-key-cryptography', 'rsa', 'integer-factorization'],
  },

  /* ---------------- NEW: ORGANIZATIONS (+5) ---------------- */
  {
    id: 'nist',
    term: 'NIST',
    category: 'organization',
    definition:
      'National Institute of Standards and Technology. A US government agency that publishes cryptographic standards like AES (FIPS 197), SHA-2/SHA-3 (FIPS 180-4/202), and post-quantum standards (FIPS 203-205). The world\'s most influential cryptographic standards body.',
    example: 'NIST FIPS 197 defines AES; NIST FIPS 203 defines ML-KEM.',
    relatedTerms: ['fips', 'aes', 'sha256', 'post-quantum'],
  },
  {
    id: 'nsa',
    term: 'NSA',
    category: 'organization',
    definition:
      'National Security Agency. A US intelligence agency responsible for signal intelligence and information assurance. The NSA designed DES and SHA-1/SHA-2, and evaluates cryptographic algorithms for classified use.',
    example: 'The NSA originally designed DES (with a shortened 56-bit key).',
    relatedTerms: ['nist', 'des', 'sha256'],
  },
  {
    id: 'ietf',
    term: 'IETF',
    category: 'organization',
    definition:
      'Internet Engineering Task Force. The organization that develops and promotes internet standards, including TLS, IPsec, SSH, and hundreds of RFCs that define cryptographic protocols.',
    example: 'RFC 8446 (TLS 1.3) was published by the IETF.',
    relatedTerms: ['rfc', 'tls', 'ipsec'],
  },
  {
    id: 'gchq',
    term: 'GCHQ',
    category: 'organization',
    definition:
      'Government Communications Headquarters. The UK\'s signals intelligence agency. Notably, mathematician Clifford Cocks invented RSA-equivalent cryptography at GCHQ in 1973 — four years before MIT published RSA.',
    example: 'Cocks\' 1973 work was classified until 1997.',
    relatedTerms: ['rsa', 'nsa'],
  },
  {
    id: 'owasp',
    term: 'OWASP',
    category: 'organization',
    definition:
      'Open Worldwide Application Security Project. A nonprofit foundation that publishes security guidance, including the Cryptographic Storage Cheat Sheet and the Top 10 web application security risks.',
    example: 'OWASP recommends Argon2id for password hashing.',
    relatedTerms: ['argon2', 'password-hashing'],
  },

  /* ---------------- NEW: STANDARDS (+5) ---------------- */
  {
    id: 'fips',
    term: 'FIPS',
    category: 'standard',
    definition:
      'Federal Information Processing Standards. NIST publications that define US government cryptographic standards. Key examples: FIPS 197 (AES), FIPS 180-4 (SHA-2), FIPS 203-205 (post-quantum).',
    example: 'AES is formally defined in FIPS 197.',
    relatedTerms: ['nist', 'aes', 'sha256', 'post-quantum'],
  },
  {
    id: 'rfc',
    term: 'RFC',
    category: 'standard',
    definition:
      'Request for Comments. The IETF publication series that defines internet standards. Cryptographic examples include RFC 8017 (RSA), RFC 2104 (HMAC), and RFC 8446 (TLS 1.3).',
    example: 'RFC 2104 defines HMAC.',
    relatedTerms: ['ietf', 'tls', 'hmac'],
  },
  {
    id: 'pkcs',
    term: 'PKCS',
    category: 'standard',
    definition:
      'Public-Key Cryptography Standards. A set of specifications published by RSA Laboratories. PKCS#1 (RSA), PKCS#7 (padding), and PKCS#12 (key storage) are the most widely used.',
    example: 'PKCS#1 v1.5 padding is vulnerable to Bleichenbacher attacks; PKCS#1 OAEP is safe.',
    relatedTerms: ['rsa', 'padding', 'bleichenbacher'],
  },
  {
    id: 'nist-sp-800',
    term: 'NIST SP 800 Series',
    category: 'standard',
    definition:
      'NIST Special Publications providing detailed guidance on cryptographic implementation. Notable: SP 800-38 (modes of operation), SP 800-57 (key management), SP 800-90 (random number generation).',
    example: 'AES-GCM is specified in NIST SP 800-38D.',
    relatedTerms: ['nist', 'aes-gcm', 'fips'],
  },
  {
    id: 'x509-standard',
    term: 'X.509 Standard',
    category: 'standard',
    definition:
      'The ITU-T standard defining the format of public-key certificates. Every HTTPS certificate follows X.509 — containing a subject, public key, issuer, validity dates, and a CA signature.',
    example: 'RFC 5280 profiles X.509 for internet use.',
    relatedTerms: ['pki', 'certificate-authority', 'tls'],
  },
];