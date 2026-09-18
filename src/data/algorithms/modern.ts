import { AlgorithmDetail } from './_types';

/**
 * Modern Algorithms — Order 5-8
 *
 * Production-grade cryptographic algorithms powering TLS 1.3,
 * WireGuard VPN, JWT authentication, and every HTTPS connection
 * on the modern internet.
 *
 * Order:
 *   5. AES-GCM (Symmetric AEAD)
 *   6. RSA-OAEP (Asymmetric Public-Key)
 *   7. ChaCha20-Poly1305 (Stream AEAD)
 *   8. HMAC-SHA256 (Message Authentication Code)
 *
 * Sources:
 *   - NIST FIPS 197: Advanced Encryption Standard (AES)
 *   - NIST SP 800-38D: GCM and GMAC
 *   - RFC 8017: PKCS #1 — RSA Cryptography Specifications v2.2
 *   - RFC 8439: ChaCha20 and Poly1305 for IETF Protocols
 *   - RFC 2104: HMAC — Keyed-Hashing for Message Authentication
 *   - J. Katz & Y. Lindell, "Introduction to Modern Cryptography" (3rd ed.)
 *   - J.-P. Aumasson, "Serious Cryptography" (2017)
 */
export const MODERN_ALGORITHMS: AlgorithmDetail[] = [
  // ============================================================
  // 5 — AES-GCM
  // ============================================================
  {
    id: 'aes',
    name: 'AES-GCM',
    category: 'modern',
    difficulty: 'advanced',
    tagline: 'The global benchmark for authenticated symmetric encryption',
    description:
      'The Advanced Encryption Standard operating in Galois/Counter Mode (GCM) — an AEAD cipher providing high-throughput confidentiality and integrity verification in a single pass. Protects TLS 1.3, IPsec, and virtually every HTTPS connection on the planet.',
    estimatedMinutes: 15,
    references: [
      {
        title: 'NIST FIPS 197: Advanced Encryption Standard (AES)',
        author: 'NIST',
        year: 2001,
        url: 'https://csrc.nist.gov/publications/detail/fips/197/final',
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
        title: 'The Galois/Counter Mode of Operation (GCM)',
        author: 'D. McGrew, J. Viega',
        year: 2004,
        url: 'https://csrc.nist.gov/CSRC/media/Publications/sp/800-38d/archive/2007-11-19/documents/gcm-spec.pdf',
        type: 'paper',
      },
      {
        title:
          'Introduction to Modern Cryptography (3rd Edition)',
        author: 'J. Katz, Y. Lindell',
        year: 2020,
        url: 'https://www.taylorfrancis.com/books/mono/10.1201/9781351133036/introduction-modern-cryptography-jonathan-katz-yehuda-lindell',
        type: 'book',
      },
    ],
    keyTakeaways: [
      'AES-GCM is an **AEAD** cipher: provides confidentiality AND integrity in one pass.',
      'The **16-byte authentication tag** detects any tampering — decryption fails instantly if even one bit changes.',
      '**Nonce reuse is catastrophic** — it breaks both confidentiality and integrity.',
      'Standardized in **NIST SP 800-38D (2007)** and mandated in TLS 1.3.',
    ],
    sections: [
      {
        id: 'introduction',
        title: 'What is AES-GCM?',
        content: `**AES-GCM** (Advanced Encryption Standard in Galois/Counter Mode) is the **most widely deployed authenticated cipher in the world**. It combines two cryptographic primitives into a single, efficient operation:

1. **AES-CTR** — for encryption (confidentiality)
2. **GHASH** — for authentication (integrity), using multiplication in the Galois field **GF(2¹²⁸)**

**The "AEAD" property:**
AES-GCM is an **Authenticated Encryption with Associated Data** (AEAD) cipher. This means it does **two jobs in one pass**:
- **Encrypts** the plaintext (confidentiality)
- **Authenticates** the ciphertext and any additional data (integrity)

**Output:** a single bundle containing:
- The **ciphertext**
- A **16-byte authentication tag** (sometimes called the "MAC")

If even **one bit** of the ciphertext is modified in transit, the authentication tag will not validate — decryption fails instantly. No need for a separate MAC algorithm.

**Where AES-GCM protects you right now:**
- Every **HTTPS** connection using TLS 1.3
- Every **VPN** using IPsec
- Every **SSH** session
- Google, Facebook, AWS, Cloudflare — all use AES-GCM by default`,
        keyPoints: [
          'AEAD cipher: combines encryption + authentication in one pass',
          'Output = ciphertext + 16-byte authentication tag',
          'Standardized in NIST SP 800-38D (2007)',
          'Mandated in TLS 1.3 — the backbone of HTTPS',
        ],
        callout: {
          type: 'info',
          title: 'AEAD vs Naive Encryption + MAC',
          content: `Before AEAD ciphers, developers had to combine AES-CBC + HMAC-SHA256 manually. This was error-prone — many implementations had subtle bugs (padding oracle attacks, MAC-then-encrypt vs encrypt-then-MAC confusion). **AEAD ciphers make the correct choice the default** — no way to get the combination wrong.`,
        },
      },
      {
        id: 'history',
        title: 'Historical Origin',
        content: `The story of AES-GCM begins with a **global cryptographic competition** and ends with the most deployed cipher in history.

**Part 1 — AES selection (1997–2000):**
In 1997, the aging **DES** cipher (56-bit key, adopted 1977) was clearly no longer secure. **NIST** announced a public competition to select a successor. Fifteen designs were submitted from around the world.

After three years of intense public cryptanalysis, the winner was **Rijndael**, designed by two Belgian cryptographers:
- **Joan Daemen** (b. 1965)
- **Vincent Rijmen** (b. 1970)

Rijndael was formalized as **FIPS PUB 197** in November 2001. It supports key sizes of 128, 192, and 256 bits — with 256-bit being the recommended strength for long-term security.

**Part 2 — GCM mode (2004–2007):**
AES by itself is a **block cipher** — it encrypts one 128-bit block at a time. To encrypt arbitrary data, a **mode of operation** is needed. The most popular mode today is **GCM** (Galois/Counter Mode), designed by **David A. McGrew** and **John Viega** in 2004.

GCM was standardized in **NIST SP 800-38D** (2007). Its rise accelerated dramatically after **TLS 1.3** (2018) mandated AEAD ciphers and effectively deprecated older modes like CBC.`,
        keyPoints: [
          'AES selected via global NIST competition (1997–2000)',
          'Won by Rijndael (Daemen & Rijmen) — Belgian cryptographers',
          'GCM designed by McGrew & Viega (2004), standardized in 2007',
          'Mandated in TLS 1.3 (2018) — the reason it is everywhere today',
        ],
      },
      {
        id: 'how-it-works',
        title: 'How It Works',
        content: `AES-GCM encryption proceeds in four distinct phases:

**Phase 1 — Key expansion**
The 128-bit or 256-bit AES key is expanded into **14 round keys** via the AES key schedule. This is a one-time operation per session.

**Phase 2 — Counter mode encryption (AES-CTR)**
The plaintext is encrypted using a **counter mode** construction:
- Start with a **96-bit nonce** and a **32-bit counter** (initialized to 1)
- For each 128-bit plaintext block Pᵢ, compute **Cᵢ = Pᵢ ⊕ AES_K(J₀ + i)**
- The AES outputs form a **keystream** that is XORed with the plaintext

**Phase 3 — GHASH authentication**
While encryption runs, a parallel **GHASH** computation authenticates the ciphertext:
- Compute **H = AES_K(0^128)** — a secret subkey derived from the AES key
- For each ciphertext block Cᵢ: **Yᵢ = (Yᵢ₋₁ ⊕ Cᵢ) · H** in the Galois field GF(2¹²⁸)
- Multiply-accumulate every ciphertext block, plus any Additional Authenticated Data (AAD)

**Phase 4 — Authentication tag**
The final 16-byte tag is computed as:

**T = AES_K(J₀) ⊕ GHASH(...)**

This tag is appended to the ciphertext. On decryption, the receiver recomputes GHASH and compares — if the tags differ, decryption is **rejected**.

**Why this is fast:**
- AES-CTR can be parallelized across CPU cores
- GHASH multiplication in GF(2¹²⁸) is efficient with carry-less multiplication (CLMUL)
- Modern CPUs implement both in hardware (AES-NI + PCLMULQDQ), achieving multiple GB/s.`,
        keyPoints: [
          'AES-CTR encrypts plaintext blocks in counter mode',
          'GHASH authenticates every ciphertext block in GF(2¹²⁸)',
          'Final tag = AES_K(J₀) ⊕ GHASH(...)',
          'Hardware-accelerated on modern CPUs (AES-NI + PCLMULQDQ)',
        ],
        codeSnippet: {
          language: 'typescript',
          code: `// AES-GCM via Web Crypto API (NIST-compliant)
const key = await crypto.subtle.generateKey(
  { name: 'AES-GCM', length: 256 },
  true,
  ['encrypt', 'decrypt']
);

// CRITICAL: 96-bit (12-byte) nonce, unique per encryption
const nonce = crypto.getRandomValues(new Uint8Array(12));

const ciphertext = await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv: nonce, tagLength: 128 },
  key,
  new TextEncoder().encode("Secret message")
);
// ciphertext = encryptedData || 16-byte authTag

// To decrypt, both ciphertext AND tag must be valid:
const plaintext = await crypto.subtle.decrypt(
  { name: 'AES-GCM', iv: nonce, tagLength: 128 },
  key,
  ciphertext
);

// If ANY byte was tampered with, this will throw.`,
          caption: 'AES-GCM in Web Crypto — nonce is 12 bytes, tag is 16 bytes',
        },
      },
      {
        id: 'formula',
        title: 'Mathematical Formulation',
        content: `AES-GCM combines two mathematical operations into a single coherent scheme.

**1. Counter-mode encryption:**
For plaintext block Pᵢ and counter block J₀ + i:

**Cᵢ = Pᵢ ⊕ AES_K(J₀ + i)**

Where J₀ = nonce || 0x00000001.

**2. GHASH authentication:**
GHASH operates in the Galois field **GF(2¹²⁸)**. Given the hash subkey:

**H = AES_K(0^128)**

For each ciphertext block Cᵢ, GHASH computes:

**Yᵢ = (Yᵢ₋₁ ⊕ Cᵢ) · H in GF(2¹²⁸)**

The multiplication "·" is **carry-less polynomial multiplication** modulo an irreducible polynomial:

**x^128 + x^7 + x^2 + x + 1**

**3. Final authentication tag:**

**T = AES_K(J₀) ⊕ GHASH(C₁, ..., Cₙ, AAD)**

The tag T is 16 bytes. On decryption, the receiver recomputes T and checks that it matches exactly — a **constant-time comparison** is used to prevent timing attacks.

**Why GF(2¹²⁸) multiplication?**
Polynomial multiplication in a binary field is **fast** and **parallelizable**, and has no carry propagation — which makes it very efficient on hardware that supports carry-less multiplication (PCLMULQDQ instruction on x86).`,
        keyPoints: [
          'Encryption: Cᵢ = Pᵢ ⊕ AES_K(J₀ + i)',
          'Authentication: Yᵢ = (Yᵢ₋₁ ⊕ Cᵢ) · H in GF(2¹²⁸)',
          'Final tag: T = AES_K(J₀) ⊕ GHASH(...)',
          'GF(2¹²⁸) multiplication is fast and hardware-accelerated',
        ],
      },
      {
        id: 'example',
        title: 'Worked Example (Conceptual)',
        content: `Let us walk through the encryption of a short message with AES-GCM.

**Setup:**
- **Plaintext:** "Hello" (5 bytes)
- **Key:** 256-bit AES key (publicly generated via Web Crypto)
- **Nonce:** 12 random bytes, e.g., \`A1 B2 C3 D4 E5 F6 07 08 09 0A 0B 0C\`

**Step 1 — Counter blocks:**
J₀ = nonce || 0x00000001 = \`A1 B2 C3 D4 E5 F6 07 08 09 0A 0B 0C 00 00 00 01\`

**Step 2 — Keystream generation:**
- AES_K(J₀) → 16 bytes of pseudorandom output
- AES_K(J₀ + 1) → next 16 bytes
- (only 5 bytes needed for "Hello")

**Step 3 — XOR with plaintext:**
Ciphertext = "Hello" ⊕ keystream[0..4]

**Step 4 — GHASH computation:**
- Initialize Y₀ = 0
- For the single ciphertext block C₁: Y₁ = (0 ⊕ C₁) · H
- Include length encoding and AAD (if any)

**Step 5 — Tag:**
T = AES_K(J₀) ⊕ GHASH_result

**Final output:** ciphertext (5 bytes) || tag (16 bytes) = 21 bytes total.

**Tamper test:** If an attacker flips a single bit in the ciphertext, the receiver's recomputed GHASH will be completely different (the avalanche effect in GF(2¹²⁸) changes ~50% of the bits). The tag comparison fails, and decryption is rejected.`,
      },
      {
        id: 'security',
        title: 'Security Analysis',
        content: `AES-GCM is currently considered **extremely secure** when used correctly. But like every cipher, there are critical usage requirements.

**Strengths:**

1. **No practical attack on AES-256.** Exhaustive key search requires 2²⁵⁶ operations — more than the number of atoms in the observable universe.

2. **AEAD guarantees.** Confidentiality and integrity are provided together, preventing many classes of implementation errors (padding oracles, MAC-then-encrypt attacks).

3. **Hardware acceleration.** AES-NI and PCLMULQDQ make AES-GCM faster than many software-only alternatives.

**Critical vulnerabilities to avoid:**

**1. Nonce reuse — the cardinal sin:**
If the same (key, nonce) pair encrypts two different messages:
- C₁ ⊕ C₂ = P₁ ⊕ P₂ — the keystream cancels, revealing the XOR of plaintexts
- Worse, the GHASH subkey H can be recovered algebraically, enabling **authentication tag forgery**

**Real-world incident (2016):** The "Nonce-Disrespecting Adversaries" paper found **184 HTTPS servers** reusing GCM nonces, completely breaking their TLS security.

**2. Short authentication tags:**
Truncating the 16-byte tag to fewer bytes (e.g., 8 bytes for IoT) reduces security. NIST recommends ≥ 96 bits (12 bytes) for all but the most constrained environments.

**3. Weak key derivation:**
If the AES key is derived from a password, use **Argon2** or **PBKDF2** — never raw hashing or simple KDFs.

**4. Ignoring decryption failures:**
If decryption throws an error, do NOT expose the error details. Always return a generic "decryption failed" response to prevent padding-oracle-style attacks.`,
        keyPoints: [
          '**Nonce reuse is catastrophic** — breaks both confidentiality and integrity',
          'Authentication tag must be ≥ 96 bits (12 bytes) in production',
          'Key derivation should use Argon2 or PBKDF2 — never raw hashes',
          'Always return a uniform error on decryption failure',
        ],
        callout: {
          type: 'warning',
          title: 'One Nonce Reuse = Total Compromise',
          content: `Reusing a single (key, nonce) pair in AES-GCM is **not a minor weakness** — it completely destroys the security of the cipher. An attacker who observes two messages encrypted with the same key + nonce can recover the XOR of the plaintexts AND forge authentication tags for arbitrary future messages. **Always generate a fresh random nonce for every encryption.**`,
        },
      },
      {
        id: 'comparison',
        title: 'AES-GCM vs Alternatives',
        content: `How does AES-GCM compare to other modern ciphers?

| Aspect | AES-GCM | AES-CBC + HMAC | ChaCha20-Poly1305 |
|---|---|---|---|
| Type | AEAD (authenticated) | Encrypt-then-MAC | AEAD (authenticated) |
| Passes | 1 pass | 2 passes | 1 pass |
| Hardware accel. | AES-NI + CLMUL | AES-NI | None needed |
| Speed (with HW) | Very fast (~3 GB/s) | Fast (~1.5 GB/s) | Fast (~1 GB/s) |
| Speed (no HW) | Slow, timing-vulnerable | Slow | Fast, constant-time |
| Nonce size | 96 bits (recommended) | 128 bits (IV) | 96 bits |
| Standardized | NIST SP 800-38D | NIST SP 800-38A | RFC 8439 |
| Best for | Servers, desktop | Legacy systems | Mobile, embedded |

**When to choose AES-GCM:**
- Desktop/server environments with AES-NI
- TLS 1.3 connections
- Anywhere hardware acceleration is available

**When to choose ChaCha20-Poly1305:**
- Mobile devices without AES hardware
- Embedded systems with limited CPU
- Environments where constant-time execution matters (ChaCha20 is inherently constant-time)

**Both are excellent.** TLS 1.3 supports both, and modern servers typically negotiate whichever the client prefers.`,
      },
      {
        id: 'lab',
        title: 'Try It Yourself',
        content: `Use the mini-lab below to experiment with AES-GCM. Notice:
- The **IV/nonce** is generated fresh for every encryption — this is critical.
- Try encrypting the same plaintext twice — you will get **different ciphertexts** each time (semantic security).
- Try modifying the ciphertext — decryption will **fail** because the authentication tag does not match.`,
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You have mastered AES-GCM — the authenticated cipher that protects the entire internet.

**Core concepts learned:**
- **AEAD**: authenticated encryption with associated data — confidentiality + integrity in one pass
- **CTR mode + GHASH**: encryption and authentication combined
- **Authentication tag**: 16-byte integrity proof
- **Nonce uniqueness**: the single most critical usage requirement
- **Hardware acceleration**: AES-NI + PCLMULQDQ for multi-GB/s throughput

**Next algorithm:** RSA-OAEP — the public-key cipher that started the asymmetric revolution.`,
      },
    ],
    playgroundRoute: '/playground/encrypt?algo=aes-gcm',
    defaultDemoKey: 'Generate 256-bit Hex Key',
    defaultDemoInput: 'Top secret authorization token',
    labEnabled: true,
  },

  // ============================================================
  // 6 — RSA-OAEP
  // ============================================================
  {
    id: 'rsa',
    name: 'RSA-OAEP',
    category: 'modern',
    difficulty: 'advanced',
    tagline: 'The revolutionary public-key algorithm based on prime factorization',
    description:
      'The most widely recognized asymmetric cryptosystem, using a mathematically linked public/private key pair. RSA-OAEP (Optimal Asymmetric Encryption Padding) is the modern, CCA-secure variant — mandatory for real-world encryption and key exchange.',
    estimatedMinutes: 16,
    references: [
      {
        title: 'A Method for Obtaining Digital Signatures and Public-Key Cryptosystems',
        author: 'R. Rivest, A. Shamir, L. Adleman',
        year: 1978,
        url: 'https://dl.acm.org/doi/10.1145/359340.359342',
        type: 'paper',
      },
      {
        title: 'RFC 8017: PKCS #1 — RSA Cryptography Specifications Version 2.2',
        author: 'K. Moriarty, B. Kaliski, J. Jonsson, A. Rusch',
        year: 2016,
        url: 'https://datatracker.ietf.org/doc/html/rfc8017',
        type: 'standard',
      },
      {
        title: 'Optimal Asymmetric Encryption — How to Encrypt with RSA',
        author: 'M. Bellare, P. Rogaway',
        year: 1994,
        url: 'https://link.springer.com/chapter/10.1007/BFb0053428',
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
    keyTakeaways: [
      'RSA uses a **key pair**: a public key (for encryption) and a private key (for decryption).',
      'Its security rests on the **integer factorization problem** — believed hard for classical computers.',
      '**Textbook RSA is broken** — OAEP padding is mandatory for any real-world use.',
      'Recommended minimum key size is **2048 bits** (3072 for long-term security).',
    ],
    sections: [
      {
        id: 'introduction',
        title: 'What is RSA?',
        content: `**RSA** (named after Rivest, Shamir, and Adleman) is the world's most widely deployed **asymmetric cryptosystem**. Unlike AES — where both parties share the same key — RSA uses a **mathematically linked key pair**:

- **Public key** — shared with the entire world; used to **encrypt** messages to you
- **Private key** — kept secret; used to **decrypt** messages sent to you

**The revolutionary idea:**
Before RSA (1977), two parties needed a **pre-shared secret key** to communicate securely. But how do you share that key in the first place? This is the **key distribution problem**, and it was considered a fundamental barrier.

RSA shattered that barrier. Now, anyone can encrypt a message to you using your public key — and only you can decrypt it using your private key. No prior contact or shared secret is needed.

**RSA-OAEP is not textbook RSA:**
Raw RSA (textbook RSA) is **completely insecure** for encryption — it is deterministic, malleable, and vulnerable to many attacks. **OAEP** (Optimal Asymmetric Encryption Padding) is a modern construction that adds randomized padding, making RSA secure against chosen-ciphertext attacks. RFC 8017 standardized RSA-OAEP in 2016 — it is what every real-world system uses today.

**Where RSA protects you right now:**
- **TLS certificates** (authentication)
- **SSH keys** (server access)
- **Code signing** (Windows, macOS, Linux)
- **Email encryption** (PGP, S/MIME)
- **PDF e-signatures**`,
        keyPoints: [
          'Asymmetric: separate public key (encrypt) and private key (decrypt)',
          'Solves the **key distribution problem** without prior shared secrets',
          'Textbook RSA is broken — **OAEP padding is mandatory**',
          'Standardized in RFC 8017 (PKCS #1 v2.2)',
        ],
        callout: {
          type: 'info',
          title: 'The Key Distribution Problem',
          content: `Imagine Alice wants to send a secret to Bob, but they have never met. If they use AES, they need a shared secret key — but how do they share it without an attacker intercepting it? **RSA solved this paradox in 1977** by using a mathematically linked key pair. Alice encrypts with Bob's public key; only Bob can decrypt with his private key. No shared secret required.`,
        },
      },
      {
        id: 'history',
        title: 'Historical Origin',
        content: `RSA is one of the most important inventions in the history of cryptography. Its story involves a public breakthrough, a declassified secret, and decades of cryptographic evolution.

**The public story (1976–1978):**
In 1976, **Whitfield Diffie** and **Martin Hellman** published *New Directions in Cryptography* — the paper that introduced the concept of **public-key cryptography** and proposed the Diffie-Hellman key exchange protocol.

The Diffie-Hellman protocol allowed two parties to agree on a shared key over an open channel, but it did not provide full encryption. In 1977, three MIT researchers — **Ron Rivest**, **Adi Shamir**, and **Leonard Adleman** — developed the first full public-key cryptosystem. They published it in 1978 as *A Method for Obtaining Digital Signatures and Public-Key Cryptosystems*.

**The declassified secret (1997):**
In 1997, the British intelligence agency **GCHQ** declassified documents revealing that **Clifford Cocks**, a British mathematician, had developed an equivalent system in **1973** — four years before RSA. It was classified for national security reasons and never published.

So RSA is *not* the first invention of public-key crypto, but it *is* the first publicly known one — and it is the one that became the standard.

**Evolution to RSA-OAEP:**
- **1977–1990s:** Textbook RSA widely deployed — vulnerabilities gradually discovered.
- **1994:** Bellare and Rogaway propose OAEP padding to fix RSA's weaknesses.
- **1998:** Bleichenbacher attack demonstrates chosen-ciphertext vulnerabilities in PKCS#1 v1.5.
- **2016:** RFC 8017 standardizes RSA-OAEP as the modern recommendation.

Today, RSA-OAEP is the only RSA encryption mode approved by NIST for new deployments.`,
        keyPoints: [
          'Public-key crypto concept introduced by Diffie-Hellman (1976)',
          'RSA developed by Rivest, Shamir, Adleman at MIT (1977)',
          'Clifford Cocks (GCHQ) invented an equivalent in 1973 — classified until 1997',
          'OAEP padding added in 1994 to fix textbook RSA weaknesses',
          'RFC 8017 (2016) standardized RSA-OAEP as modern recommendation',
        ],
      },
      {
        id: 'how-it-works',
        title: 'How It Works',
        content: `RSA operates on large integers and modular arithmetic. Here is the full process, from key generation to encryption/decryption.

**Step 1 — Key generation**
1. Choose two large **prime numbers** p and q (typically 1024 bits each).
2. Compute the **modulus** N = p × q (2048 bits total).
3. Compute **Euler's totient**: φ(N) = (p − 1)(q − 1).
4. Choose a **public exponent** e (usually 65537). It must be coprime to φ(N).
5. Compute the **private exponent** d such that **d × e ≡ 1 (mod φ(N))**.
   - This uses the **extended Euclidean algorithm**.
6. **Public key** = (e, N). **Private key** = (d, N).
7. **Securely destroy** p, q, and φ(N) — they must never be exposed.

**Step 2 — Encryption (sender)**
The sender takes the plaintext message M (as an integer < N) and computes:

**C = M^e mod N**

This is a **modular exponentiation** — computing it requires only a few hundred multiplications, even for 2048-bit numbers.

**Step 3 — Decryption (receiver)**
The receiver uses the private exponent d:

**M = C^d mod N**

Only the holder of d can perform this operation. Because d was mathematically derived from p and q, and p, q are destroyed, no one else can compute it.

**Step 4 — OAEP padding (mandatory)**
Before encryption, the message is padded using **OAEP**, a randomized hash-based padding scheme. This ensures:
- **Semantic security**: encrypting the same message twice gives different ciphertexts
- **CCA security**: chosen-ciphertext attacks are prevented

**Performance note:** RSA is roughly **1,000× slower** than AES. In practice, RSA is used only for **key encapsulation** — encrypting a short symmetric key — then AES handles the bulk data.`,
        keyPoints: [
          'Two large primes p, q → modulus N = p × q',
          'Public exponent e = 65537 (most common)',
          'Private exponent d satisfies d × e ≡ 1 (mod φ(N))',
          'Encryption: C = M^e mod N; Decryption: M = C^d mod N',
          'OAEP padding is mandatory for real-world security',
        ],
        codeSnippet: {
          language: 'typescript',
          code: `// RSA-OAEP via Web Crypto (RFC 8017 compliant)
const keyPair = await crypto.subtle.generateKey(
  {
    name: 'RSA-OAEP',
    modulusLength: 2048,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
    hash: 'SHA-256',
  },
  true,
  ['encrypt', 'decrypt']
);

// Encrypt with the public key
const ciphertext = await crypto.subtle.encrypt(
  { name: 'RSA-OAEP' },
  keyPair.publicKey,
  new TextEncoder().encode("Secret message")
);

// Decrypt with the private key
const plaintext = await crypto.subtle.decrypt(
  { name: 'RSA-OAEP' },
  keyPair.privateKey,
  ciphertext
);

// Note: RSA-OAEP can only encrypt up to ~214 bytes
// with a 2048-bit key (due to padding overhead).`,
          caption: 'RSA-OAEP via Web Crypto — max plaintext is ~214 bytes for 2048-bit key',
        },
      },
      {
        id: 'formula',
        title: 'Mathematical Formulation',
        content: `RSA's security rests on the difficulty of **integer factorization**. Here are the core formulas.

**Key generation:**
1. Select large primes: **p, q**
2. Compute modulus: **N = p × q**
3. Compute totient: **φ(N) = (p − 1)(q − 1)**
4. Select public exponent: **e** with gcd(e, φ(N)) = 1
5. Compute private exponent: **d = e⁻¹ mod φ(N)**

**Encryption:**
**C = M^e mod N**

**Decryption:**
**M = C^d mod N**

**Why decryption works:**
By **Euler's theorem**, for any M coprime to N:

**M^φ(N) ≡ 1 (mod N)**

Since d × e ≡ 1 (mod φ(N)), we have d × e = 1 + k·φ(N) for some integer k:

**C^d = (M^e)^d = M^(e·d) = M^(1 + k·φ(N)) = M · (M^φ(N))^k ≡ M · 1^k ≡ M (mod N)**

This is the mathematical reason RSA works — it relies on a beautiful property of modular arithmetic.

**Why it is hard to break:**
An attacker who knows (e, N) needs to find d. This requires knowing φ(N), which requires factoring N into p and q. For a 2048-bit modulus, factoring is believed infeasible for classical computers — the best known algorithm (General Number Field Sieve) would take longer than the age of the universe.

**Quantum threat:**
**Shor's algorithm** (1994) can factor N in polynomial time on a sufficiently powerful quantum computer. This is the driving force behind **post-quantum cryptography** (ML-KEM, ML-DSA).`,
        keyPoints: [
          'N = p × q, φ(N) = (p − 1)(q − 1)',
          'd × e ≡ 1 (mod φ(N)) — computed via extended Euclidean algorithm',
          'Correctness relies on **Euler\'s theorem**',
          'Security relies on the **integer factorization problem**',
          'Quantum computers using **Shor\'s algorithm** could break RSA',
        ],
      },
      {
        id: 'example',
        title: 'Worked Example (Small Numbers)',
        content: `Real RSA uses 2048-bit numbers, but we can illustrate with small primes.

**Step 1 — Choose primes:**
- p = 61
- q = 53

**Step 2 — Compute N and φ(N):**
- N = 61 × 53 = **3233**
- φ(N) = (61 − 1)(53 − 1) = 60 × 52 = **3120**

**Step 3 — Choose public exponent e:**
- e = **17** (since gcd(17, 3120) = 1)

**Step 4 — Compute private exponent d:**
- Need d × 17 ≡ 1 (mod 3120)
- Using extended Euclidean algorithm: d = **2753**

**Step 5 — Encrypt message M = 65 ("A"):**
- C = 65^17 mod 3233
- Computing: 65^17 = a very large number
- 65^17 mod 3233 = **2790**

**Step 6 — Decrypt:**
- M = 2790^2753 mod 3233
- Result: **65** ✓

**Public key:** (17, 3233)
**Private key:** (2753, 3233)

**Why this is insecure:**
3233 is trivially factorable (61 × 53). Real RSA uses N with **2048 bits = 617 decimal digits** — impossible to factor with known algorithms.`,
        example: `Walkthrough (small numbers):

p = 61, q = 53
N = 61 × 53 = 3233
φ(N) = 60 × 52 = 3120
e = 17 (coprime to 3120)
d = 2753 (since 2753 × 17 mod 3120 = 1)

Encrypt M = 65:
C = 65^17 mod 3233
  = 2790

Decrypt:
M = 2790^2753 mod 3233
  = 65 ✓

Public key: (17, 3233)
Private key: (2753, 3233)`,
      },
      {
        id: 'security',
        title: 'Security Analysis',
        content: `RSA's security depends on both **mathematical hardness** and **correct implementation**. Mistakes in either area can be catastrophic.

**Mathematical strengths:**

1. **Integer factorization is hard.** The best known classical algorithm (General Number Field Sieve) would take trillions of years for 2048-bit N.

2. **Well-understood.** 45+ years of public cryptanalysis have not broken properly-padded RSA.

3. **Standardized.** RFC 8017 defines RSA-OAEP precisely — no ambiguity, no room for implementation errors.

**Critical vulnerabilities to avoid:**

**1. Textbook RSA (no padding) — catastrophically broken:**
- **Deterministic**: same plaintext → same ciphertext (breaks semantic security)
- **Malleable**: an attacker can multiply the ciphertext by kᵉ, and the plaintext will be multiplied by k
- **Small-message attack**: if Mᵉ < N, then C = Mᵉ exactly — recover M with a simple e-th root
- **Related-message attack**: if two messages differ by a known value, both can be recovered

**2. Small key sizes:**
- 512-bit and 1024-bit RSA are broken by modern factoring techniques
- **2048-bit** is the current minimum
- **3072-bit** is recommended for data that needs to remain secure for 20+ years

**3. Weak random number generation:**
If p and q are not truly random (or too close together), the modulus can be factored efficiently. This affected real-world systems (Debian OpenSSL bug, 2008).

**4. Side-channel leaks:**
Timing attacks, power analysis, and cache-timing attacks can recover the private key from physical measurements. Constant-time implementations are essential.

**5. Quantum computers:**
**Shor's algorithm** can factor RSA moduli in polynomial time. This is the reason post-quantum cryptography exists.

**Best practices:**
- Use RSA-OAEP (never raw RSA, never PKCS#1 v1.5 for new code)
- Minimum 2048-bit keys, 3072-bit for long-term
- Use constant-time cryptographic libraries
- Plan migration to post-quantum algorithms`,
        keyPoints: [
          '**Textbook RSA is broken** — never use without OAEP padding',
          '**2048-bit minimum**, 3072-bit recommended for long-term security',
          '**Weak random primes** can be factored (Debian 2008 vulnerability)',
          '**Side channels** (timing, cache, power) leak private keys',
          '**Quantum threat**: Shor\'s algorithm breaks RSA',
        ],
        callout: {
          type: 'warning',
          title: 'Never Roll Your Own RSA',
          content: `Implementing RSA correctly is **extremely difficult**. Even a single mistake in padding, key generation, or error handling can completely break security. Always use **well-tested cryptographic libraries** (OpenSSL, BoringSSL, Web Crypto, libsodium) — never attempt to implement RSA from scratch.`,
        },
      },
      {
        id: 'comparison',
        title: 'RSA vs Alternative Public-Key Cryptosystems',
        content: `RSA was the first widely-deployed public-key system, but it is not the only one. Here is how it compares to modern alternatives:

| Aspect | RSA-OAEP | ECDH / ECDSA | ML-KEM (Post-Quantum) |
|---|---|---|---|
| Family | Integer factorization | Elliptic curve discrete log | Lattice (Module-LWE) |
| Key size (128-bit security) | 3072 bits | 256 bits | ~1.2 KB |
| Speed | Slow | Fast | Fast |
| Quantum-safe? | No | No | **Yes** |
| Standardized | RFC 8017 (2016) | NIST SP 800-186 | NIST FIPS 203 (2024) |
| Real-world use | Legacy PKI, code signing | TLS 1.3, Signal, Bitcoin | Future TLS, PQC migration |

**When to choose RSA-OAEP:**
- Legacy systems that already use RSA
- Code signing and PKI where RSA is dominant
- Compatibility with older clients

**When to choose ECDH/ECDSA:**
- **New deployments** — ECC offers the same security with 12× smaller keys
- Mobile and IoT (smaller keys = less bandwidth, less storage)
- TLS 1.3 (default)

**When to choose ML-KEM:**
- Systems that need **post-quantum security** (harvest-now-decrypt-later threat)
- Government and defense applications
- Any new system planned for 10+ years of security

**The transition:**
- **Short-term:** RSA-OAEP remains viable for standard use.
- **Medium-term:** ECC replaces RSA in most new deployments.
- **Long-term:** Post-quantum algorithms (ML-KEM, ML-DSA) will replace both.`,
      },
      {
        id: 'lab',
        title: 'Try It Yourself',
        content: `Use the mini-lab below to experiment with RSA-OAEP. Note:
- You must first **generate a key pair** — click the button to create a fresh 2048-bit RSA key.
- **Encrypt** with the public key (anyone can do this).
- **Decrypt** with the private key (only the key holder can do this).
- Try encrypting the same message twice — you will get **different ciphertexts** (OAEP randomizes the padding).`,
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You have mastered RSA-OAEP — the revolutionary public-key cryptosystem that made secure communication over the open internet possible.

**Core concepts learned:**
- **Asymmetric cryptography**: separate public and private keys
- **Integer factorization**: the hard mathematical problem underpinning RSA
- **Modular exponentiation**: C = M^e mod N, M = C^d mod N
- **OAEP padding**: mandatory randomized padding for CCA security
- **Key sizes**: 2048-bit minimum, 3072-bit recommended

**Next algorithm:** ChaCha20-Poly1305 — the modern AEAD that competes with AES-GCM.`,
      },
    ],
    playgroundRoute: '/playground/encrypt?algo=rsa-oaep',
    defaultDemoKey: 'Generate 2048-bit Key Pair',
    defaultDemoInput: 'Sensitive negotiation document',
    labEnabled: true,
  },

  // ============================================================
  // 7 — CHACHA20-POLY1305
  // ============================================================
  {
    id: 'chacha20',
    name: 'ChaCha20-Poly1305',
    category: 'modern',
    difficulty: 'advanced',
    tagline: 'The modern AEAD stream cipher powering WireGuard and TLS 1.3',
    description:
      'A high-performance authenticated encryption cipher combining the ChaCha20 stream cipher with the Poly1305 MAC. Designed for mobile devices and constant-time execution, it is a mandatory AEAD cipher in TLS 1.3 alongside AES-GCM.',
    estimatedMinutes: 14,
    references: [
      {
        title: 'RFC 8439: ChaCha20 and Poly1305 for IETF Protocols',
        author: 'Y. Nir, A. Langley',
        year: 2018,
        url: 'https://datatracker.ietf.org/doc/html/rfc8439',
        type: 'standard',
      },
      {
        title: 'ChaCha, a variant of Salsa20',
        author: 'D. J. Bernstein',
        year: 2008,
        url: 'https://cr.yp.to/chacha/chacha-20080128.pdf',
        type: 'paper',
      },
      {
        title: 'Serious Cryptography: A Practical Introduction to Modern Encryption',
        author: 'J.-P. Aumasson',
        year: 2017,
        url: 'https://nostarch.com/seriouscrypto',
        type: 'book',
      },
    ],
    keyTakeaways: [
      'ChaCha20-Poly1305 is an **AEAD cipher** — confidentiality + integrity in one pass.',
      'Uses only **ARX operations** (Add-Rotate-XOR) — no S-box lookups, immune to cache-timing attacks.',
      'Faster than AES-GCM on devices **without AES hardware acceleration** (e.g., mobile ARM chips).',
      'Mandatory in **TLS 1.3** alongside AES-GCM.',
    ],
    sections: [
      {
        id: 'introduction',
        title: 'What is ChaCha20-Poly1305?',
        content: `**ChaCha20-Poly1305** is a modern **AEAD cipher** — like AES-GCM, it provides both confidentiality (encryption) and integrity (authentication) in a single operation. But unlike AES-GCM, it is designed to be **fast on any CPU**, with no dependency on specialized hardware.

**Two components combined:**
1. **ChaCha20** — a stream cipher that generates a pseudorandom keystream
2. **Poly1305** — a message authentication code (MAC) that verifies integrity

**Why "ChaCha"?**
The name is a playful reference to **Salsa20** — an earlier cipher by the same author, **Daniel J. Bernstein**. ChaCha is a variant of Salsa20 with improved diffusion per round, published in 2008.

**Where ChaCha20-Poly1305 protects you right now:**
- **WireGuard VPN** — the default cipher
- **TLS 1.3** — mandatory alongside AES-GCM
- **SSH** — popular alternative to AES-GCM
- **Signal / WhatsApp** — for some message types
- **Cloudflare, Google** — prefer it for mobile clients

**Why does it exist alongside AES-GCM?**
AES-GCM is very fast **when the CPU has AES-NI** — a hardware instruction that accelerates AES. But many **mobile and embedded CPUs** do not have AES-NI. On those devices, AES-GCM runs in software and can be vulnerable to **cache-timing attacks**. ChaCha20 was designed from the ground up to be **constant-time** — no data-dependent branches, no table lookups — making it a safer choice on hardware without AES acceleration.`,
        keyPoints: [
          'AEAD cipher: encryption + authentication in one pass',
          'Combines ChaCha20 (encryption) + Poly1305 (authentication)',
          'All operations are **constant-time** (Add-Rotate-XOR, no table lookups)',
          'Preferred on devices without AES hardware acceleration',
        ],
        callout: {
          type: 'info',
          title: 'ARX: A Different Design Philosophy',
          content: `AES uses **S-box lookups** (a 256-byte table) as its core non-linear operation. S-box lookups can leak information through cache timing — an attacker measures how long memory accesses take and infers the key. ChaCha20 avoids this entirely by using only **Add, Rotate, and XOR** (ARX) operations. No data-dependent memory access, no timing leaks, no cache issues. This is why ChaCha20 is considered a **safer choice** on hardware without AES acceleration.`,
        },
      },
      {
        id: 'history',
        title: 'Historical Origin',
        content: `ChaCha20 was designed by **Daniel J. Bernstein** (djb) in 2008 as an improvement on his earlier **Salsa20** cipher (2005). Bernstein is one of the most influential cryptographers of the modern era — also known for creating NaCl, libsodium, and the Curve25519 elliptic curve.

**Timeline:**
- **2005:** Bernstein publishes **Salsa20** — a fast, constant-time stream cipher.
- **2008:** Bernstein publishes **ChaCha20** — a variant with improved diffusion per round.
- **2013:** Google engineer **Adam Langley** proposes ChaCha20 for Chrome TLS as a defense against cache-timing attacks on AES-GCM.
- **2015:** **RFC 7539** standardizes ChaCha20-Poly1305 for TLS.
- **2016:** WireGuard VPN selects ChaCha20-Poly1305 as its default cipher.
- **2018:** **RFC 8439** revises the standard with test vectors and clarifications.
- **2018:** **TLS 1.3** mandates ChaCha20-Poly1305 alongside AES-GCM.

**Google's crucial role:**
In 2013, Google deployed ChaCha20-Poly1305 in Chrome after **BEAST** and **Lucky Thirteen** attacks showed that AES-CBC was vulnerable on mobile devices. ChaCha20's constant-time design eliminated the entire class of timing-based attacks. Today, ChaCha20-Poly1305 protects a substantial share of mobile internet traffic.`,
        keyPoints: [
          'Designed by **Daniel J. Bernstein** (2008) — a variant of Salsa20 (2005)',
          'Google deployed ChaCha20 in Chrome (2013) to defend against cache-timing',
          'Standardized in **RFC 7539** (2015) and **RFC 8439** (2018)',
          'Default cipher for **WireGuard VPN** (2016)',
          'Mandatory in **TLS 1.3** (2018)',
        ],
      },
      {
        id: 'how-it-works',
        title: 'How It Works',
        content: `ChaCha20-Poly1305 has two distinct stages: keystream generation (ChaCha20) and authentication (Poly1305).

**Part 1 — ChaCha20 keystream generation:**

ChaCha20 maintains a **4×4 matrix of 32-bit words** (16 words total):
- 4 words: constants (\`"expand 32-byte k"\`)
- 8 words: 256-bit key
- 3 words: nonce (96 bits)
- 1 word: block counter

The matrix is processed through **20 rounds** (10 "double rounds"). Each double round consists of:
- **4 quarter-round** operations on columns
- **4 quarter-round** operations on diagonals

**Each quarter-round is defined as:**

\`\`\`
a += b;  d ^= a;  d <<<= 16;
c += d;  b ^= c;  b <<<= 12;
a += b;  d ^= a;  d <<<= 8;
c += d;  b ^= c;  b <<<= 7;
\`\`\`

Where **+=** is modular addition mod 2³², **^=** is XOR, and **<<<=** is left rotation. This is the **ARX** design — Add, Rotate, XOR.

After 20 rounds, the resulting 64-byte block is **added** to the original state (word-wise), producing the keystream block. This block is XORed with the plaintext to produce the ciphertext.

**Part 2 — Poly1305 authentication:**

Poly1305 is a **one-time authenticator**. It computes a 16-byte tag over the ciphertext (and any Additional Authenticated Data) using:
- A secret 256-bit key (derived from ChaCha20)
- Arithmetic in the prime field **mod 2¹³⁰ − 5**

The tag is appended to the ciphertext. On decryption, the tag is recomputed and compared in constant time — any tampering causes the tag to differ, and decryption is rejected.`,
        keyPoints: [
          'ChaCha20 uses a 4×4 matrix of 32-bit words (constants + key + nonce + counter)',
          '20 rounds of ARX operations produce a 64-byte keystream block',
          'Poly1305 computes a 16-byte authentication tag over the ciphertext',
          'No data-dependent branches or table lookups — fully constant-time',
        ],
        codeSnippet: {
          language: 'typescript',
          code: `// ChaCha20-Poly1305 is not natively supported by Web Crypto,
// so this example uses a conceptual API (e.g., libsodium.js).

import sodium from 'libsodium-wrappers';

await sodium.ready;

const key = sodium.crypto_aead_chacha20poly1305_ietf_keygen();
const nonce = sodium.randombytes_buf(12); // 96-bit nonce

const plaintext = new TextEncoder().encode("Secret message");

const ciphertext = sodium.crypto_aead_chacha20poly1305_ietf_encrypt(
  plaintext,
  null,    // additional data (optional)
  null,    // secret nonce (usually null for IETF variant)
  nonce,
  key
);

// ciphertext includes the 16-byte Poly1305 tag

const decrypted = sodium.crypto_aead_chacha20poly1305_ietf_decrypt(
  null,
  ciphertext,
  null,
  nonce,
  key
);

// If ANY byte is tampered with, decryption throws.`,
          caption: 'ChaCha20-Poly1305 via libsodium.js (Web Crypto lacks native support)',
        },
      },
      {
        id: 'formula',
        title: 'Mathematical Formulation',
        content: `ChaCha20 operates with 32-bit modular arithmetic and bit rotations.

**State matrix (before rounds):**

\`\`\`
[ c0 c1 c2 c3 ]   ← constants: "expa", "nd 3", "2-by", "te k"
[ k0 k1 k2 k3 ]   ← key (words 0-3)
[ k4 k5 k6 k7 ]   ← key (words 4-7)
[ t0 n0 n1 n2 ]   ← counter + nonce
\`\`\`

**Quarter-round function:**

\`\`\`
QR(a, b, c, d):
    a = a + b;  d = d XOR a;  d = rotl(d, 16)
    c = c + d;  b = b XOR c;  b = rotl(b, 12)
    a = a + b;  d = d XOR a;  d = rotl(d, 8)
    c = c + d;  b = b XOR c;  b = rotl(b, 7)
\`\`\`

Where **+** is addition mod 2³², **XOR** is bitwise exclusive-or, and **rotl(x, n)** is left rotation by n bits.

**Double round:**
- 4 quarter-rounds on **columns**: (0,4,8,12), (1,5,9,13), (2,6,10,14), (3,7,11,15)
- 4 quarter-rounds on **diagonals**: (0,5,10,15), (1,6,11,12), (2,7,8,13), (3,4,9,14)

**20 rounds = 10 double rounds.**

**Final keystream block:**

**keystream = state_after_rounds + state_initial (word-wise mod 2³²)**

**Ciphertext:**

**C = P ⊕ keystream**

**Poly1305 tag:**
Poly1305 computes an authentication tag using polynomial evaluation in the field of integers mod 2¹³⁰ − 5:

**tag = ((c₁·rⁿ + c₂·rⁿ⁻¹ + ... + cₙ·r) mod (2¹³⁰ − 5)) + s mod 2¹²⁸**

Where r and s are derived from the ChaCha20 keystream.`,
        keyPoints: [
          'ARX: Add mod 2³², Rotate, XOR — no table lookups',
          '20 rounds = 10 double rounds of quarter-round operations',
          'Final keystream = state + initial state (mod 2³²)',
          'Poly1305: polynomial evaluation mod 2¹³⁰ − 5, then mod 2¹²⁸',
        ],
      },
      {
        id: 'example',
        title: 'Worked Example (Conceptual)',
        content: `Let us walk through ChaCha20-Poly1305 encryption of a short message.

**Setup:**
- **Key:** 256-bit key (32 bytes)
- **Nonce:** 96-bit nonce (12 random bytes)
- **Plaintext:** "Hello World" (11 bytes)

**Step 1 — Initialize state matrix:**
\`\`\`
Row 0: "expa" "nd 3" "2-by" "te k"    ← constants
Row 1: key[0..15]                      ← key (first half)
Row 2: key[16..31]                     ← key (second half)
Row 3: counter=1, nonce[0..11]         ← counter + nonce
\`\`\`

**Step 2 — Apply 20 rounds of ARX:**
- 10 double rounds, each with 8 quarter-rounds
- Each quarter-round uses additions, rotations, and XOR

**Step 3 — Add original state:**
After 20 rounds, add the initial state (word-wise mod 2³²) to produce the keystream block (64 bytes).

**Step 4 — XOR with plaintext:**
Ciphertext = "Hello World" ⊕ keystream[0..10]

**Step 5 — Poly1305 authentication:**
Poly1305 computes a 16-byte tag over the ciphertext, using a key derived from the first 32 bytes of the ChaCha20 keystream.

**Step 6 — Output:**
- 11-byte ciphertext
- 16-byte Poly1305 tag

**Tamper test:** If an attacker modifies even one bit of the ciphertext, the receiver's recomputed Poly1305 tag will differ. Decryption is rejected — no partial decryption, no error leak.`,
      },
      {
        id: 'security',
        title: 'Security Analysis',
        content: `ChaCha20-Poly1305 is considered one of the most robust AEAD ciphers available today. It has no known practical attacks when used correctly.

**Strengths:**

1. **Constant-time by design.** All operations are additions, rotations, and XOR — no data-dependent branches, no table lookups. This eliminates cache-timing attacks entirely.

2. **No hardware dependency.** Runs at full speed on any CPU — including mobile ARM chips, embedded devices, and old x86 CPUs without AES-NI.

3. **AEAD security.** Confidentiality and integrity are provided together, in one pass, with a 16-byte tag.

4. **Well-analyzed.** Fifteen years of public cryptanalysis have found no practical attacks.

5. **High performance.** Typically 1–3 GB/s on modern hardware.

**Critical usage requirements:**

**1. Nonce uniqueness (same as AES-GCM):**
Reusing a (key, nonce) pair across two messages leaks the XOR of plaintexts — the Two-Time Pad attack. **Always use a fresh random 96-bit nonce.**

**2. ChaCha20 alone (without Poly1305) is not enough:**
ChaCha20 by itself provides confidentiality but not integrity. An attacker can flip ciphertext bits, and the plaintext will be silently corrupted. **Always use the full AEAD variant.**

**3. Poly1305 is a one-time MAC:**
The Poly1305 key is derived from the first ChaCha20 block. Reusing the same (key, nonce) pair reuses the Poly1305 key — catastrophic for authentication. **Never reuse a nonce.**

**Comparison with AES-GCM:**

| Aspect | ChaCha20-Poly1305 | AES-GCM |
|---|---|---|
| Constant-time | Yes (by design) | Only with AES-NI |
| Speed without HW accel. | Fast | Slow, timing-vulnerable |
| Speed with HW accel. | Fast | Very fast |
| Nonce size | 96 bits | 96 bits |
| Tag size | 128 bits | 128 bits |
| Standardized | RFC 8439 | NIST SP 800-38D |

Both ciphers are **equally secure** when used correctly. The choice depends on hardware and threat model.`,
        keyPoints: [
          '**Constant-time by design** — no cache-timing vulnerabilities',
          '**No hardware dependency** — fast on any CPU',
          '**Nonce uniqueness** is critical — same requirement as AES-GCM',
          'ChaCha20 alone lacks integrity — always use with Poly1305',
          'Both ChaCha20-Poly1305 and AES-GCM are equally secure when used correctly',
        ],
        callout: {
          type: 'warning',
          title: 'Nonce Reuse is Catastrophic',
          content: `Like AES-GCM, ChaCha20-Poly1305 is **completely broken by nonce reuse**. If the same (key, nonce) pair encrypts two different messages, an attacker can:
1. Recover P₁ ⊕ P₂ (XOR of the plaintexts)
2. Forge Poly1305 tags for arbitrary messages
**Always generate a fresh random 96-bit nonce for every encryption.**`,
        },
      },
      {
        id: 'comparison',
        title: 'ChaCha20-Poly1305 vs AES-GCM vs Other AEADs',
        content: `Modern cryptography offers several excellent AEAD ciphers. Here is how they compare:

| Aspect | ChaCha20-Poly1305 | AES-GCM | AES-GCM-SIV | Ascon |
|---|---|---|---|---|
| Design | ARX (no tables) | S-box + CLMUL | S-box + CLMUL | Sponge |
| Constant-time | Yes | Only with AES-NI | Yes | Yes |
| Speed (no HW) | Fast | Slow | Slow | Very fast |
| Speed (with HW) | Fast | Very fast | Very fast | Fast |
| Nonce misuse resistant? | No | No | **Yes** | No |
| Standardized | RFC 8439 | NIST SP 800-38D | RFC 8452 | NIST SP 800-232 |
| Best for | Mobile, embedded | Servers, desktop | High-assurance | IoT, lightweight |

**Key observations:**

- **ChaCha20-Poly1305** is the modern default for **mobile and embedded** environments.
- **AES-GCM** is the fastest choice when **AES-NI hardware is available** (nearly all modern servers).
- **AES-GCM-SIV** is nonce-misuse resistant — safer if you cannot guarantee nonce uniqueness.
- **Ascon** is the newest NIST standard for **lightweight IoT** devices.

**Practical advice:**
- **TLS 1.3** supports both AES-GCM and ChaCha20-Poly1305 — the client's preference decides.
- **WireGuard** uses ChaCha20-Poly1305 exclusively — simpler, constant-time, fast on all devices.
- **Signal** uses both — ChaCha20-Poly1305 for message content, AES-GCM for some metadata.
- **Your browser** negotiates either based on your device's capabilities.`,
      },
      {
        id: 'lab',
        title: 'Try It Yourself',
        content: `Use the mini-lab below to experiment with ChaCha20-Poly1305. Note:
- The **nonce** is generated fresh for every encryption — critical for security.
- Try encrypting the same plaintext twice — you will get **different ciphertexts** each time.
- Modify the ciphertext manually and try to decrypt — authentication will fail.`,
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You have mastered ChaCha20-Poly1305 — the modern AEAD cipher that competes with AES-GCM.

**Core concepts learned:**
- **ARX design**: Add, Rotate, XOR — no table lookups, fully constant-time
- **20 rounds** of quarter-round operations produce a 64-byte keystream block
- **Poly1305**: polynomial MAC providing integrity
- **AEAD property**: confidentiality + integrity in one pass
- **Nonce uniqueness**: critical for both ChaCha20 and AES-GCM

**Next algorithm:** HMAC-SHA256 — the standard MAC for API authentication and JWT signatures.`,
      },
    ],
    playgroundRoute: '/playground/encrypt?algo=chacha20',
    defaultDemoKey: '32-byte hex key',
    defaultDemoInput: 'Modern authenticated encryption',
    labEnabled: true,
  },

  // ============================================================
  // 8 — HMAC-SHA256
  // ============================================================
  {
    id: 'hmac',
    name: 'HMAC-SHA256',
    category: 'modern',
    difficulty: 'intermediate',
    tagline: 'Keyed message authentication — proving integrity AND authenticity',
    description:
      'A keyed hash-based message authentication code combining a secret key with SHA-256. Provides integrity (data unchanged) and authenticity (sender holds the key). Powers JWT signatures, AWS API authentication, and TLS PRF.',
    estimatedMinutes: 12,
    references: [
      {
        title: 'RFC 2104: HMAC — Keyed-Hashing for Message Authentication',
        author: 'H. Krawczyk, M. Bellare, R. Canetti',
        year: 1997,
        url: 'https://datatracker.ietf.org/doc/html/rfc2104',
        type: 'standard',
      },
      {
        title: 'Keying Hash Functions for Message Authentication',
        author: 'M. Bellare, R. Canetti, H. Krawczyk',
        year: 1996,
        url: 'https://cseweb.ucsd.edu/~mihir/papers/hmac.html',
        type: 'paper',
      },
      {
        title: 'NIST FIPS 198-1: The Keyed-Hash Message Authentication Code (HMAC)',
        author: 'NIST',
        year: 2008,
        url: 'https://csrc.nist.gov/publications/detail/fips/198/1/final',
        type: 'standard',
      },
    ],
    keyTakeaways: [
      'HMAC provides **integrity** (data unchanged) AND **authenticity** (sender holds the key).',
      'It is **immune to length-extension attacks** — unlike naive H(key || message).',
      'Requires a **shared secret** between sender and receiver — unsuitable for public verification.',
      'Powers JWT (HS256), AWS SigV4, Stripe webhooks, and TLS PRF.',
    ],
    sections: [
      {
        id: 'introduction',
        title: 'What is HMAC-SHA256?',
        content: `**HMAC-SHA256** (Hash-based Message Authentication Code using SHA-256) is the world standard for **keyed message authentication**. It combines a cryptographic hash function (SHA-256) with a **secret key** to produce a fixed-size authentication tag.

**Two guarantees — in one tag:**
1. **Integrity** — the message has not been modified in transit
2. **Authenticity** — the sender holds the shared secret key

**How is this different from a plain hash?**
A plain SHA-256 hash proves only that the data has not changed (integrity). Anyone can compute it — no secret is involved. An attacker can modify a message and recompute the hash. HMAC fixes this by requiring a **secret key**. An attacker without the key cannot forge a valid HMAC tag.

**Where HMAC-SHA256 protects you right now:**
- **JWT tokens** — HS256 signatures (the most common JWT algorithm)
- **AWS Signature V4** — every AWS API request is HMAC-signed
- **Stripe webhooks** — every webhook event is HMAC-verified
- **GitHub webhooks** — HMAC verification of incoming events
- **TLS PRF** — pseudorandom function for key derivation
- **HKDF** — HMAC-based key derivation function (RFC 5869)

**Key insight:**
HMAC is a **symmetric** primitive — both parties must share the same secret key. This makes it **fast** (no public-key operations) but **unsuitable** for public verification (unlike digital signatures).`,
        keyPoints: [
          'Combines SHA-256 with a **secret key**',
          'Provides **integrity** + **authenticity** — two guarantees in one tag',
          '**Symmetric**: both parties share the same key',
          'Powers JWT, AWS, Stripe, GitHub webhooks, and TLS PRF',
        ],
        callout: {
          type: 'info',
          title: 'MAC vs Hash vs Signature',
          content: `**Hash** (SHA-256): no key, anyone can compute, proves integrity only. **MAC** (HMAC): secret key, both parties can compute, proves integrity + authenticity. **Digital Signature** (ECDSA, RSA-PSS): public/private key pair, anyone can verify, proves integrity + authenticity + non-repudiation. HMAC sits between a hash and a signature — fast, symmetric, but not publicly verifiable.`,
        },
      },
      {
        id: 'history',
        title: 'Historical Origin',
        content: `HMAC was invented in 1996 by **Mihir Bellare**, **Ran Canetti**, and **Hugo Krawczyk** — three of the most influential cryptographers of the modern era. Their goal was to design a **provably secure** MAC from any cryptographic hash function.

**Why not just use H(key || message)?**
The naive construction **tag = H(secret || message)** was widely used in the 1990s — and it turned out to be **broken** by the **length-extension attack**. Given H(secret || message), an attacker can compute H(secret || message || padding || extra) without knowing the secret. This broke dozens of real-world APIs (Flickr, 2009).

**HMAC's elegant solution:**
Instead of hashing the key once at the beginning, HMAC uses the key **twice** — nested hashing:

**HMAC(K, m) = H((K ⊕ opad) || H((K ⊕ ipad) || m))**

This structure defeats length extension because the **outer hash** processes the intermediate inner-hash result as the final block — no attacker-controlled continuation is possible.

**Timeline:**
- **1996:** Bellare, Canetti, Krawczyk publish HMAC in *Keying Hash Functions for Message Authentication*.
- **1997:** RFC 2104 standardizes HMAC for the IETF.
- **2002:** NIST FIPS 198 adopts HMAC as a federal standard.
- **2008:** FIPS 198-1 updates the standard.
- **Today:** HMAC-SHA256 is the most widely deployed MAC in the world.

**Provable security:**
HMAC is **provably secure** if the underlying hash function is a **pseudorandom function** (PRF). This is a **weaker** assumption than collision resistance — meaning HMAC remains secure even if the underlying hash is later weakened (as happened with MD5).`,
        keyPoints: [
          'Invented by **Bellare, Canetti, Krawczyk (1996)**',
          'Designed to resist the **length-extension attack** that broke H(key || message)',
          'Standardized in **RFC 2104** (1997) and **FIPS 198-1** (2008)',
          'Provably secure if the hash is a PRF — a weaker assumption than collision resistance',
        ],
      },
      {
        id: 'how-it-works',
        title: 'How It Works',
        content: `HMAC uses a **nested hash construction** with two derived keys to prevent length-extension attacks.

**Step 1 — Prepare the key**
If the key is shorter than the hash block size (64 bytes for SHA-256), pad it with zeros to exactly 64 bytes. If the key is longer, hash it first with SHA-256, then pad. Call the result K'.

**Step 2 — Derive two keys**
- **ipad** (inner padding) = 0x36 repeated 64 times
- **opad** (outer padding) = 0x5C repeated 64 times
- Compute **K' ⊕ ipad** and **K' ⊕ opad**

**Step 3 — Inner hash**
Concatenate (K' ⊕ ipad) with the message and hash it:

**inner = SHA256((K' ⊕ ipad) || message)**

**Step 4 — Outer hash**
Concatenate (K' ⊕ opad) with the inner hash result and hash again:

**tag = SHA256((K' ⊕ opad) || inner)**

**Step 5 — Output**
The final tag is 32 bytes (256 bits) for HMAC-SHA256.

**Why the two-pass structure defeats length extension:**
The inner hash produces a **fixed-size intermediate value**. The outer hash processes this intermediate value as the **final block** — no attacker-controlled data can extend it. Without knowing K, an attacker cannot compute the inner hash for a modified message.

**Verification:**
To verify, the receiver recomputes the HMAC over the received message and compares it with the received tag using **constant-time comparison** (to prevent timing attacks).`,
        keyPoints: [
          'Key padded to 64 bytes (SHA-256 block size)',
          'Two derived keys: **ipad** (0x36) and **opad** (0x5C)',
          'Nested hashing: inner hash then outer hash',
          'Output: 32-byte tag for HMAC-SHA256',
          'Verify with **constant-time comparison**',
        ],
        codeSnippet: {
          language: 'typescript',
          code: `// HMAC-SHA256 via Web Crypto API
const key = await crypto.subtle.importKey(
  'raw',
  new TextEncoder().encode("shared_secret_key"),
  { name: 'HMAC', hash: 'SHA-256' },
  false,
  ['sign', 'verify']
);

const message = new TextEncoder().encode("Hello, World");

// Compute HMAC tag
const tag = await crypto.subtle.sign('HMAC', key, message);
// tag is 32 bytes (256 bits)

// Verify HMAC tag (constant-time internally)
const isValid = await crypto.subtle.verify(
  'HMAC',
  key,
  tag,
  message
);

// isValid === true`,
          caption: 'HMAC-SHA256 via Web Crypto — sign and verify',
        },
      },
      {
        id: 'formula',
        title: 'Mathematical Formulation',
        content: `HMAC is defined by a single, elegant formula:

**HMAC(K, m) = H((K ⊕ opad) || H((K ⊕ ipad) || m))**

Where:
- **H** = the underlying hash function (SHA-256 for HMAC-SHA256)
- **K** = the secret key (padded to block size, or hashed if too long)
- **m** = the message
- **ipad** = 0x36 repeated to the block size (64 bytes for SHA-256)
- **opad** = 0x5C repeated to the block size
- **||** = concatenation
- **⊕** = XOR

**Inner hash:**
H((K ⊕ ipad) || m) — produces an intermediate fixed-size value.

**Outer hash:**
H((K ⊕ opad) || inner) — produces the final tag.

**Security reduction:**
HMAC's security proof reduces to the assumption that the underlying hash function is a **pseudorandom function (PRF)**. Formally:

If H is a PRF under key K, then HMAC(K, ·) is also a PRF.

This is a **weaker** assumption than collision resistance — HMAC remains secure even if collisions are found in the underlying hash (as happened with MD5).

**Key length considerations:**
- Recommended minimum: 128 bits (16 bytes)
- Recommended maximum: block size (512 bits / 64 bytes)
- If longer than block size: hash first, then use the hash output as the key

**Tag length:**
- HMAC-SHA256 produces 256 bits (32 bytes)
- Truncation to fewer bits weakens security — NIST recommends ≥ 128 bits`,
        keyPoints: [
          'HMAC(K, m) = H((K ⊕ opad) || H((K ⊕ ipad) || m))',
          'Security reduces to hash being a **PRF**',
          'Weaker assumption than collision resistance',
          'Minimum key length: 128 bits; tag length: ≥ 128 bits',
        ],
      },
      {
        id: 'example',
        title: 'Worked Example',
        content: `Let us walk through HMAC-SHA256 of the message "hello" with key "key".

**Step 1 — Prepare key:**
- Key "key" is 3 bytes
- SHA-256 block size is 64 bytes
- Pad with 61 zero bytes → K' = "key" + 61 zeros

**Step 2 — XOR with ipad and opad:**
- K' ⊕ ipad (0x36 × 64) = first 3 bytes: "key" ⊕ 0x36, rest are 0x36
- K' ⊕ opad (0x5C × 64) = first 3 bytes: "key" ⊕ 0x5C, rest are 0x5C

**Step 3 — Inner hash:**
- Concatenate (K' ⊕ ipad) with "hello"
- SHA256 of this 69-byte input → 32-byte inner hash

**Step 4 — Outer hash:**
- Concatenate (K' ⊕ opad) with the 32-byte inner hash
- SHA256 of this 96-byte input → 32-byte final tag

**Step 5 — Output:**
- Final HMAC tag (32 bytes, 64 hex chars)

**Verification example:**
If an attacker changes "hello" to "helo" without knowing the key:
- Their recomputation of HMAC fails
- The receiver's tag mismatch rejects the message

**Real-world test vector (RFC 4231):**
- Key: 0x0b repeated 20 times
- Message: "Hi There"
- HMAC-SHA256: b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7

You can verify this in any HMAC library — it is a standard test vector.`,
        example: `Walkthrough (character level):

Message: "Hi There"
Key: 0x0b × 20 (20 bytes of 0x0b)

Step 1: Pad key to 64 bytes
  K' = 0x0b × 20 || 0x00 × 44

Step 2: K' ⊕ ipad (0x36 × 64)
  = 0x3d × 20 || 0x36 × 44

Step 3: SHA256((K' ⊕ ipad) || "Hi There")
  = 0x5d4c... (32 bytes intermediate)

Step 4: K' ⊕ opad (0x5C × 64)
  = 0x57 × 20 || 0x5c × 44

Step 5: SHA256((K' ⊕ opad) || intermediate)
  = b0344c61d8db38535ca8afceaf0bf12b
    881dc200c9833da726e9376c2e32cff7 ✓

Matches RFC 4231 test vector.`,
      },
      {
        id: 'security',
        title: 'Security Analysis',
        content: `HMAC-SHA256 is one of the most rigorously analyzed cryptographic primitives in existence. It has no known practical attacks.

**Strengths:**

1. **Provably secure.** If SHA-256 is a pseudorandom function, HMAC-SHA256 is secure. This proof is one of the crown jewels of modern cryptography.

2. **Immune to length extension.** The nested construction defeats the attack that broke H(key || message).

3. **Fast.** No public-key operations — just two hash computations.

4. **Well-analyzed.** Over 25 years of public cryptanalysis, no practical attacks have been found.

5. **Standards-approved.** RFC 2104, FIPS 198-1, and countless industry standards.

**Critical usage requirements:**

**1. Constant-time comparison:**
Never compare HMAC tags with \`==\` or \`===\`. String comparison exits early on the first byte mismatch, leaking information via timing. Use a constant-time comparison function.

**Bad:**
\`\`\`
if (receivedTag === computedTag) { ... }  // Timing leak!
\`\`\`

**Good:**
\`\`\`
if (constantTimeEqual(receivedTag, computedTag)) { ... }
\`\`\`

**2. Key length ≥ 128 bits:**
Short keys (e.g., "secret") are brute-forceable. Use at least 128 bits (16 random bytes) — ideally 256 bits (32 bytes).

**3. Key management:**
- Keys must be **randomly generated** (CSPRNG)
- Keys must be **rotated periodically**
- Keys must be **transported securely** (over TLS)
- **Never** hardcode keys in source code

**4. Don't truncate below 128 bits:**
Truncating HMAC-SHA256 to fewer than 128 bits weakens security. For HMAC-SHA256, use the full 256-bit tag unless constraints require otherwise.

**Common mistakes:**
- **Using H(key || message)** instead of HMAC — vulnerable to length extension
- **Using timing-vulnerable comparison** — leaks tag bytes
- **Short or predictable keys** — brute-forceable
- **Reusing HMAC keys across contexts** — enable cross-protocol attacks`,
        keyPoints: [
          '**Provably secure** if the hash is a PRF',
          '**Immune to length extension** — unlike H(key || message)',
          '**Constant-time comparison** is mandatory for verification',
          'Key must be ≥ 128 bits (random, rotated, transported securely)',
          'Never truncate below 128 bits',
        ],
        callout: {
          type: 'warning',
          title: 'Constant-Time Comparison is Critical',
          content: `The most common HMAC vulnerability is **timing attacks via naive string comparison**. When you write \`tag1 === tag2\`, JavaScript compares bytes one at a time and exits early on the first mismatch. An attacker can measure the timing of millions of comparisons to recover a valid tag byte by byte. **Always use a constant-time comparison** — Web Crypto's \`subtle.verify()\` does this internally.`,
        },
      },
      {
        id: 'comparison',
        title: 'HMAC vs Other Authentication Primitives',
        content: `HMAC is one of several ways to authenticate messages. Here is how it compares:

| Aspect | HMAC-SHA256 | Digital Signature (ECDSA) | AEAD Tag (AES-GCM) |
|---|---|---|---|
| Symmetric? | Yes | No (asymmetric) | Yes |
| Speed | Very fast | Slow (~1000× slower) | Very fast |
| Key management | Shared secret | Public/private key pair | Shared secret |
| Publicly verifiable? | No | Yes | No |
| Non-repudiation? | No | Yes | No |
| Output size | 32 bytes | ~64 bytes | 16 bytes |
| Standardized | RFC 2104 | FIPS 186-5 | NIST SP 800-38D |
| Use case | API auth, JWT | Code signing, PKI | Encrypted data |

**When to choose HMAC-SHA256:**
- API request authentication (AWS SigV4, Stripe webhooks)
- JWT signatures (HS256)
- Message authentication between two parties sharing a secret
- Anywhere speed matters and public verification is not needed

**When to choose ECDSA / RSA-PSS:**
- Code signing (proving authorship to the world)
- TLS certificate authentication
- Any use case requiring **non-repudiation** (signer cannot deny)
- Publicly verifiable proofs

**When to choose AEAD tag:**
- When you are already encrypting with AES-GCM or ChaCha20-Poly1305
- The authentication tag comes free with the encryption

**Combining primitives:**
Modern protocols often combine multiple primitives:
- **TLS 1.3**: HMAC-SHA256 for the PRF, AES-GCM for the payload, ECDSA for the handshake
- **JWT**: HS256 (HMAC) or RS256 (RSA) for the signature
- **SSH**: HMAC-SHA256 for message authentication, ChaCha20 for encryption`,
      },
      {
        id: 'lab',
        title: 'Try It Yourself',
        content: `Use the mini-lab below to experiment with HMAC-SHA256. Note:
- The **key** is required — unlike plain hashing, HMAC depends on the secret.
- Try the same message with **different keys** — you will get completely different tags.
- Try the same key with **slightly different messages** — you will get completely different tags (avalanche effect).
- If you change even one bit of the message, the tag becomes invalid.`,
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You have mastered HMAC-SHA256 — the standard keyed MAC for API authentication.

**Core concepts learned:**
- **Keyed MAC**: provides both integrity AND authenticity
- **Nested hashing**: the key is applied twice to prevent length extension
- **PRF security**: HMAC remains secure even if the hash is weakened
- **Constant-time comparison**: mandatory for verification
- **Real-world use**: JWT, AWS, Stripe, GitHub webhooks, TLS PRF

**Next algorithm:** SHA-256 — the cryptographic hash powering blockchain and certificates.`,
      },
    ],
    playgroundRoute: '/playground/hash?algo=hmac',
    defaultDemoKey: 'shared_secret_key',
    defaultDemoInput: 'Authenticate this message',
    labEnabled: true,
  },
];