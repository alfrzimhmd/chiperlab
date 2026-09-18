import { AlgorithmDetail } from './_types';

/**
 * Hashing Algorithms — Order 9-11
 *
 * One-way cryptographic hash functions for integrity
 * verification, password storage, digital signatures,
 * and blockchain consensus.
 *
 * Order:
 *   9.  SHA-256 (Secure Hash Algorithm 2)
 *   10. SHA-512 (Secure Hash Algorithm 2 — 64-bit variant)
 *   11. MD5 (Broken Demo — historical cautionary tale)
 *
 * Sources:
 *   - NIST FIPS 180-4: Secure Hash Standard (SHS)
 *   - NIST SP 800-107 Rev. 1: Recommendation for Applications Using Approved Hash Algorithms
 *   - RFC 1321: The MD5 Message-Digest Algorithm
 *   - J. Katz & Y. Lindell, "Introduction to Modern Cryptography" (3rd ed.)
 *   - J.-P. Aumasson, "Serious Cryptography" (2017)
 *   - X. Wang, Y. L. Yin, H. Yu, "Finding Collisions in the Full SHA-1" (CRYPTO 2005)
 */
export const HASHING_ALGORITHMS: AlgorithmDetail[] = [
  // ============================================================
  // 9 — SHA-256
  // ============================================================
  {
    id: 'sha256',
    name: 'SHA-256',
    category: 'hashing',
    difficulty: 'intermediate',
    tagline: 'The cryptographic workhorse of internet security and blockchain',
    description:
      'A 256-bit cryptographic one-way hash function published by NIST as part of the SHA-2 family. Produces a fixed 64-character hexadecimal digest from any input. Powers TLS certificates, Git object IDs, and Bitcoin consensus.',
    estimatedMinutes: 12,
    references: [
      {
        title: 'NIST FIPS 180-4: Secure Hash Standard (SHS)',
        author: 'NIST',
        year: 2015,
        url: 'https://csrc.nist.gov/publications/detail/fips/180/4/final',
        type: 'standard',
      },
      {
        title:
          'NIST SP 800-107 Rev. 1: Recommendation for Applications Using Approved Hash Algorithms',
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
      {
        title: 'Serious Cryptography: A Practical Introduction to Modern Encryption',
        author: 'J.-P. Aumasson',
        year: 2017,
        url: 'https://nostarch.com/seriouscrypto',
        type: 'book',
      },
    ],
    keyTakeaways: [
      'SHA-256 is a **one-way function** — you cannot reverse it to recover the input.',
      'It always produces a **256-bit digest** (64 hex characters), regardless of input size.',
      'The **avalanche effect** ensures that a 1-bit input change flips ~50% of the output bits.',
      'Widely used in **TLS, Git, DNSSEC, Bitcoin**, and digital signatures.',
    ],
    sections: [
      {
        id: 'introduction',
        title: 'What is SHA-256?',
        content: `**SHA-256** (Secure Hash Algorithm, 256-bit) is a **cryptographic hash function** that takes an input of any size and produces a fixed **256-bit** output — usually displayed as a **64-character hexadecimal string**.

**Example:**
- Input: \`"Hello"\`
- SHA-256 output: \`185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969\`

Input \`"Hello World"\` gives a completely different output:
- \`a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e\`

**Three critical properties:**

1. **Deterministic** — same input always produces the same output.
2. **One-way** — you cannot reverse the hash to recover the input (preimage resistance).
3. **Collision-resistant** — it is computationally infeasible to find two inputs producing the same hash.

**What SHA-256 is used for:**
- **TLS certificates** — every HTTPS site's certificate is signed against a SHA-256 digest
- **Git commits** — every commit, tree, and blob is identified by its SHA-1 historically, now SHA-256 in newer repos
- **Bitcoin** — every block's proof-of-work is based on double SHA-256
- **DNSSEC** — DNS records are authenticated using SHA-256 hashes
- **File integrity** — download verification (Ubuntu ISOs, software installers)
- **Password storage** — combined with salting and slow hashing (e.g., PBKDF2-HMAC-SHA256)

**Important:** SHA-256 is **not** encryption. There is no key, and no way to recover the original input. It is a **one-way** integrity primitive.`,
        keyPoints: [
          'Deterministic, one-way, collision-resistant',
          'Fixed 256-bit output (64 hex characters) regardless of input size',
          'Preimage resistant: cannot reverse the hash to recover input',
          'Widely used in TLS, Git, DNSSEC, Bitcoin, and digital signatures',
        ],
        callout: {
          type: 'info',
          title: 'Hash is NOT Encryption',
          content: `Hashing and encryption are fundamentally different:
- **Encryption** is reversible (with the key) — confidentiality
- **Hashing** is one-way (no reversal) — integrity verification

You cannot "decrypt" a SHA-256 hash. If someone claims to offer a "SHA-256 decryption service", they are actually running a **lookup table** — a precomputed database of common inputs and their hashes. For truly random inputs, no such table exists.`,
        },
      },
      {
        id: 'history',
        title: 'Historical Origin',
        content: `SHA-256 is part of the **SHA-2 family**, designed by the **National Security Agency (NSA)** and published by **NIST** in 2001.

**Why SHA-2 was needed:**
- **1993**: NIST published **SHA-0** — quickly withdrawn due to an undisclosed flaw.
- **1995**: **SHA-1** published — 160-bit hash, widely deployed for two decades.
- **2001**: **SHA-2 family** published (SHA-224, SHA-256, SHA-384, SHA-512).
- **2004**: **MD5 broken** — Xiaoyun Wang demonstrated practical collisions.
- **2005**: **SHA-1 weakened** — Wang demonstrated collision attacks with 2⁶⁹ work (later reduced to 2⁶³).
- **2017**: **SHA-1 fully broken** — Google and CWI Amsterdam produced the first SHA-1 collision ("SHAttered").

**SHA-2 survived:**
Despite SHA-1's fall, SHA-256 has withstood **two decades of intense public cryptanalysis** without any practical break. The SHA-2 design uses a different structure (more rounds, different constants, larger state) that has proven resilient.

**The SHA-3 decision (2007–2012):**
After SHA-1 was weakened, NIST held a **public competition** to select a *backup* hash function, in case SHA-2 was also broken. The winner was **Keccak**, which became **SHA-3** in 2015. SHA-3 uses a completely different construction (**sponge**) and is not based on the Merkle-Damgård paradigm.

**Important:** SHA-3 does **not** replace SHA-2. Both are approved by NIST for all applications. SHA-2 remains the most widely deployed hash family in the world.`,
        keyPoints: [
          'SHA-2 family designed by NSA, published by NIST in 2001',
          'SHA-1 broke in 2017 (Google SHAttered collision)',
          'SHA-2 has withstood 20+ years of public cryptanalysis',
          'SHA-3 (Keccak) is a parallel standard, not a replacement',
        ],
      },
      {
        id: 'how-it-works',
        title: 'How It Works',
        content: `SHA-256 uses the **Merkle-Damgård construction** — the same paradigm used by MD5 and SHA-1. The process has four stages:

**Stage 1 — Padding**
The input message is padded so its length is congruent to 448 mod 512 (bits). The padding is:
- A single \`1\` bit
- Followed by zeros
- Ending with the original message length as a 64-bit integer

Example: \`"abc"\` (24 bits) → padded to 512 bits total.

**Stage 2 — Parse into blocks**
The padded message is split into **512-bit blocks** (64 bytes each). Each block is further split into **sixteen 32-bit words** (W₀ through W₁₅).

**Stage 3 — Message schedule**
For each 512-bit block, SHA-256 expands the sixteen 32-bit words into **sixty-four 32-bit words** using the formula:

\`W[t] = σ₁(W[t-2]) + W[t-7] + σ₀(W[t-15]) + W[t-16]\`

Where σ₀ and σ₁ are small non-linear mixing functions.

**Stage 4 — Compression function**
Eight **32-bit working registers** (a, b, c, d, e, f, g, h) are initialized with the previous block's output (or a fixed IV for the first block). Each of the **64 rounds** updates these registers using:
- Non-linear functions: **Ch** (choose), **Maj** (majority), **Σ₀**, **Σ₁**
- Round constants K[t] (first 32 bits of the cube roots of the first 64 primes)
- The message schedule W[t]

After 64 rounds, the working registers are added back to the previous hash state — this is the **Davies-Meyer** construction.

**Stage 5 — Output**
The final state after processing all blocks is the **256-bit hash** — output as 64 hex characters.

**Why this is one-way:**
The compression function is highly non-linear and mixes the input state with the message in a way that cannot be inverted. Recovering the input from the output requires solving a system with **2²⁵⁶ possible solutions** — infeasible.`,
        keyPoints: [
          'Padding ensures the message length ≡ 448 mod 512',
          'Message is split into 512-bit blocks',
          'Message schedule expands 16 words to 64 words per block',
          '64 rounds of compression using non-linear functions',
          'Final state = 256-bit hash output',
        ],
        codeSnippet: {
          language: 'typescript',
          code: `// SHA-256 via Web Crypto API
const message = "Hello, World";
const encoder = new TextEncoder();
const data = encoder.encode(message);

const hashBuffer = await crypto.subtle.digest('SHA-256', data);
const hashArray = Array.from(new Uint8Array(hashBuffer));
const hexDigest = hashArray
  .map(b => b.toString(16).padStart(2, '0'))
  .join('');

console.log(hexDigest);
// "dffd6021bb2bd5b0af676290809ec3a5
//  314a7c85fdbb38a4bccb3a1f0a9f9b5d"

// Note: "Hello, World" and "Hello, world"
// (lowercase "w") produce completely different hashes.`,
          caption: 'SHA-256 via Web Crypto — 64-character hex output',
        },
      },
      {
        id: 'formula',
        title: 'Mathematical Formulation',
        content: `SHA-256 is defined by precise mathematical operations over 32-bit words.

**1. Message schedule:**
For t = 16 to 63:

**W[t] = σ₁(W[t-2]) + W[t-7] + σ₀(W[t-15]) + W[t-16]**

Where:
- **σ₀(x) = ROTR⁷(x) ⊕ ROTR¹⁸(x) ⊕ SHR³(x)**
- **σ₁(x) = ROTR¹⁷(x) ⊕ ROTR¹⁹(x) ⊕ SHR¹⁰(x)**
- **ROTRⁿ** = right rotation by n bits
- **SHRⁿ** = right shift by n bits
- **+** = addition modulo 2³²

**2. Compression function (64 rounds):**

For each round t = 0 to 63:

\`\`\`
T1 = h + Σ₁(e) + Ch(e, f, g) + K[t] + W[t]
T2 = Σ₀(a) + Maj(a, b, c)

h = g
g = f
f = e
e = d + T1
d = c
c = b
b = a
a = T1 + T2
\`\`\`

Where:
- **Ch(e, f, g) = (e ∧ f) ⊕ (¬e ∧ g)** — "choose" function
- **Maj(a, b, c) = (a ∧ b) ⊕ (a ∧ c) ⊕ (b ∧ c)** — "majority" function
- **Σ₀(a) = ROTR²(a) ⊕ ROTR¹³(a) ⊕ ROTR²²(a)**
- **Σ₁(e) = ROTR⁶(e) ⊕ ROTR¹¹(e) ⊕ ROTR²⁵(e)**
- **K[t]** = first 32 bits of the cube roots of the first 64 primes

**3. Final hash:**
After processing all blocks, the final state is:

**H = IV ⊕ (state after all rounds)**

Where IV is the fixed initial value derived from the fractional parts of the square roots of the first 8 primes.

**Why these constants:**
Using the square roots and cube roots of primes makes the constants appear "random" (their binary representations do not follow any predictable pattern). This prevents hidden structural weaknesses — a technique known as "nothing up my sleeve" numbers.`,
        keyPoints: [
          'W[t] uses σ₀ and σ₁ — small non-linear mixing functions',
          '64 rounds update 8 working registers (a through h)',
          'Ch (choose) and Maj (majority) are the non-linear cores',
          'Round constants derived from cube roots of primes',
          'Initial values derived from square roots of primes',
        ],
      },
      {
        id: 'example',
        title: 'Worked Example',
        content: `Let us compute SHA-256 of the string **"abc"**.

**Input:**
- ASCII "abc" = \`61 62 63\` (hex) = \`01100001 01100010 01100011\`

**Step 1 — Padding:**
- Original length: 24 bits
- Add 1 bit: total 25 bits
- Pad with zeros until length ≡ 448 mod 512
- Append 64-bit length (24 = \`0x0000000000000018\`)

Padded message (in hex):
\`\`\`
6162638000000000 0000000000000000
0000000000000000 0000000000000000
0000000000000000 0000000000000000
0000000000000000 0000000000000018
\`\`\`

**Step 2 — Compression:**
- Initialize 8 state registers with SHA-256 IV
- Process the single 512-bit block through 64 rounds
- Each round updates the state using Ch, Maj, Σ₀, Σ₁

**Step 3 — Final digest:**

SHA-256("abc") = \`ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad\`

**Verification:**
This matches the standard test vector from NIST FIPS 180-4. You can verify it in any SHA-256 library:

\`\`\`
echo -n "abc" | sha256sum
# ba7816bf8f01cfea414140de5dae2223
# b00361a396177a9cb410ff61f20015ad
\`\`\`

**Avalanche demonstration:**
- SHA-256("abc") = \`ba7816bf...\`
- SHA-256("abd") = \`4b2f7a4b...\`

Changing a single character flips approximately **half of the 256 output bits** — this is the **avalanche effect**.`,
        example: `Standard NIST test vectors:

Input  "abc"
Output ba7816bf8f01cfea414140de5dae2223
       b00361a396177a9cb410ff61f20015ad

Input  "abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq"
Output 248d6a61d20638b8e5c026930c3e6039
       a33ce45964ff2167f6ecedd419db06c1

Input  "a" × 1,000,000 (one million 'a's)
Output cdc76e5c9914fb9281a1c7e284d73e67
       f1809a48a497200e046d39ccc7112cd0`,
      },
      {
        id: 'security',
        title: 'Security Analysis',
        content: `SHA-256 has been extensively analyzed for over two decades and remains **cryptographically secure** for all standard applications.

**Security guarantees:**

| Attack type | Complexity required | Notes |
|---|---|---|
| Preimage | 2²⁵⁶ | Impossible with current tech |
| Second preimage | 2²⁵⁶ | Impossible with current tech |
| Collision | 2¹²⁸ (birthday) | Impossible with current tech |

**The birthday paradox:**
Finding a collision requires only ~2^(n/2) work, not 2^n. For SHA-256, this is 2¹²⁸ — still astronomically infeasible. This is why 256-bit hashes give **128 bits of collision resistance**.

**Common vulnerabilities to avoid:**

**1. Length extension attack:**
SHA-256 uses Merkle-Damgård — the final hash **is** the internal state. Given SHA256(secret || message), an attacker can compute SHA256(secret || message || padding || extra) without knowing the secret.

**Fix:** Use **HMAC-SHA256** for message authentication, not naive H(secret || message).

**2. Password storage:**
SHA-256 is **fast** — billions of hashes per second on GPUs. For passwords, use **Argon2**, **bcrypt**, or **scrypt** — deliberately slow, memory-hard functions designed for password storage.

**3. Quantum threat (Grover's algorithm):**
Grover's quantum algorithm provides a **quadratic speedup** for brute-force search. This reduces SHA-256's effective preimage resistance from 256 bits to **128 bits** — still secure. Collision resistance is halved again → 64 bits, which is borderline. For post-quantum contexts, **SHA-384** or **SHA-512** are recommended.

**4. Weak inputs:**
SHA-256 of a short or low-entropy input (e.g., a 4-digit PIN) can be brute-forced. Always salt and use slow hashes for password-like data.

**What SHA-256 is safe for:**
- File integrity verification
- Digital signatures
- Certificate fingerprints
- Blockchain consensus
- HMAC (with proper construction)
- Key derivation (as part of HKDF or PBKDF2)

**What SHA-256 is NOT safe for:**
- Password storage (use Argon2)
- Authenticated encryption (use AEAD ciphers)`,
        keyPoints: [
          'Preimage/collision resistance: **unbroken** (2²⁵⁶ / 2¹²⁸)',
          '**Length extension**: safe only with HMAC, not H(secret || msg)',
          '**Password storage**: too fast — use Argon2/bcrypt/scrypt',
          '**Quantum threat**: Grover reduces security to 128 bits (still safe)',
        ],
        callout: {
          type: 'warning',
          title: 'Do Not Use SHA-256 for Password Storage',
          content: `SHA-256 is **designed to be fast** — a modern GPU can compute **billions of SHA-256 hashes per second**. This makes it catastrophically wrong for password storage: an attacker with a stolen database can try every possible password in minutes. Use **Argon2id** (the winner of the Password Hashing Competition) — deliberately slow, memory-hard, and resistant to GPU acceleration.`,
        },
      },
      {
        id: 'comparison',
        title: 'SHA-256 vs Other Hash Functions',
        content: `SHA-256 is one of several hash functions used in modern systems. Here is the comparison:

| Hash | Output | Status | Speed | Notes |
|---|---|---|---|---|
| MD5 | 128-bit | **Broken** (2004) | Very fast | Legacy only |
| SHA-1 | 160-bit | **Broken** (2017) | Fast | Deprecated |
| SHA-256 | 256-bit | **Secure** | Fast | Most deployed |
| SHA-512 | 512-bit | **Secure** | Faster on 64-bit | 128 rounds |
| SHA-3-256 | 256-bit | **Secure** | Moderate | Sponge construction |
| BLAKE3 | Variable | **Secure** | Very fast | Modern alternative |

**Practical guidance:**

- **General use**: SHA-256
- **64-bit CPUs**: SHA-512 (faster than SHA-256 due to 64-bit word processing)
- **Post-quantum resistance**: SHA-384, SHA-512
- **Maximum speed**: BLAKE3
- **New protocols**: SHA-256 or SHA-3
- **Legacy compatibility**: SHA-1 (only if forced — verify against migration)
- **Never**: MD5

**SHA-256 vs SHA-512:**
- SHA-256 uses 32-bit words and 64 rounds — fast on 32-bit CPUs
- SHA-512 uses 64-bit words and 80 rounds — faster on 64-bit CPUs
- Both are considered secure; the choice depends on the target architecture

**SHA-2 vs SHA-3:**
- SHA-2 uses Merkle-Damgård — vulnerable to length extension (mitigated by HMAC)
- SHA-3 uses **sponge construction** — immune to length extension by design
- Both are approved by NIST — SHA-2 remains most deployed due to legacy compatibility`,
      },
      {
        id: 'lab',
        title: 'Try It Yourself',
        content: `Use the mini-lab below to compute SHA-256 hashes. Note:
- The output is always **64 hex characters** (256 bits), regardless of input length.
- Change one character in the input — the entire hash changes (avalanche effect).
- You **cannot** reverse the hash to recover the input.`,
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You have mastered SHA-256 — the cryptographic hash powering the modern internet.

**Core concepts learned:**
- **One-way function**: cannot be reversed
- **Fixed output**: 256 bits / 64 hex characters
- **Avalanche effect**: 1-bit input change flips ~50% of output bits
- **Merkle-Damgård construction**: block-by-block compression
- **Collision resistance**: 128 bits (birthday bound)
- **Widespread use**: TLS, Git, DNSSEC, Bitcoin, digital signatures

**Next algorithm:** SHA-512 — the 64-bit variant with a larger digest.`,
      },
    ],
    playgroundRoute: '/playground/hash?algo=SHA-256',
    defaultDemoKey: '',
    defaultDemoInput: 'Integrity verified transmission',
    labEnabled: true,
  },

  // ============================================================
  // 10 — SHA-512
  // ============================================================
  {
    id: 'sha512',
    name: 'SHA-512',
    category: 'hashing',
    difficulty: 'intermediate',
    tagline: 'High-security 512-bit hashing optimized for 64-bit microprocessors',
    description:
      'The larger member of the SHA-2 family, producing a 512-bit (128-character hex) digest. Uses 64-bit words and 80 compression rounds, making it exceptionally fast on modern 64-bit CPU architectures.',
    estimatedMinutes: 10,
    references: [
      {
        title: 'NIST FIPS 180-4: Secure Hash Standard (SHS)',
        author: 'NIST',
        year: 2015,
        url: 'https://csrc.nist.gov/publications/detail/fips/180/4/final',
        type: 'standard',
      },
      {
        title:
          'NIST SP 800-107 Rev. 1: Recommendation for Applications Using Approved Hash Algorithms',
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
    keyTakeaways: [
      'SHA-512 produces a **512-bit digest** (128 hex characters) — twice the size of SHA-256.',
      'Uses **64-bit words** and **80 rounds** — faster than SHA-256 on 64-bit CPUs.',
      'Provides **256 bits of collision resistance** — a very large security margin.',
      'Recommended for **high-assurance** applications and post-quantum contexts.',
    ],
    sections: [
      {
        id: 'introduction',
        title: 'What is SHA-512?',
        content: `**SHA-512** is the larger member of the SHA-2 family, producing a **512-bit** (64-byte) hash digest. It is functionally identical to SHA-256 — same family, same security principles — but designed to operate on **64-bit words** instead of 32-bit words.

**Output format:**
- SHA-256 → 64 hex characters (256 bits)
- SHA-512 → 128 hex characters (512 bits)

**Example:**
- SHA-512("Hello") = \`9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043\`

**Why 64-bit words matter:**
Modern CPUs (nearly all since 2003) have **64-bit registers**. When SHA-256 runs, it uses only the lower 32 bits of each register — wasting half the hardware. SHA-512 uses the full 64-bit registers, achieving roughly **1.5× the throughput** of SHA-256 in bytes-per-second on the same hardware.

**When to choose SHA-512 over SHA-256:**
- **High-assurance contexts**: signing keys, master key derivation
- **64-bit server environments**: SHA-512 is often faster
- **Post-quantum concern**: SHA-512 keeps 256-bit security even against Grover's algorithm
- **New applications with no legacy constraints**: SHA-512 is a modern default

**When SHA-256 is preferred:**
- Compatibility with existing protocols (TLS, Git, DNSSEC)
- 32-bit embedded systems
- Shorter digest requirements (bandwidth, storage)`,
        keyPoints: [
          'Produces a **512-bit digest** (128 hex chars)',
          'Uses **64-bit words** — faster on modern 64-bit CPUs',
          'Provides **256-bit collision resistance** — very large margin',
          'Recommended for high-assurance and post-quantum contexts',
        ],
      },
      {
        id: 'history',
        title: 'Historical Origin',
        content: `SHA-512 was published alongside SHA-256 in **FIPS 180-2 (2002)** — the same NIST standard that formalized the SHA-2 family. All three variants (SHA-256, SHA-384, SHA-512) share the same design philosophy but differ in word size and output length.

**The SHA-2 family:**

| Variant | Word size | Rounds | Output | IV source |
|---|---|---|---|---|
| SHA-224 | 32-bit | 64 | 224-bit | SHA-256 truncated |
| SHA-256 | 32-bit | 64 | 256-bit | √(first 8 primes) |
| SHA-384 | 64-bit | 80 | 384-bit | SHA-512 truncated |
| SHA-512 | 64-bit | 80 | 512-bit | √(first 8 primes) |
| SHA-512/224 | 64-bit | 80 | 224-bit | SHA-512 truncated |
| SHA-512/256 | 64-bit | 80 | 256-bit | SHA-512 truncated |

**Why NIST chose 64-bit words for SHA-512:**
The design was forward-looking. In 2001, 64-bit CPUs were still uncommon (only Sun UltraSPARC and IBM POWER had them). But NIST anticipated the transition to 64-bit computing, which became dominant with the AMD64 (2003) and Intel EM64T (2004) architectures.

**The choice paid off:** Today, SHA-512 is measurably faster than SHA-256 on virtually every server, desktop, and mobile processor — because the hardware processes 64-bit integers natively.

**SHA-512/256 — the modern truncated variant:**
NIST also defined **SHA-512/256** — a SHA-512 computation truncated to 256 bits with a different IV. This variant is **immune to length-extension** attacks that affect SHA-256 (because it uses a different IV derived from the SHA-512 constants). It is being adopted in some modern protocols.`,
        keyPoints: [
          'Published in **FIPS 180-2 (2002)** alongside SHA-256',
          'Designed with **64-bit words** for forward compatibility',
          'Today faster than SHA-256 on nearly all CPUs',
          'SHA-512/256 variant is immune to length extension',
        ],
      },
      {
        id: 'how-it-works',
        title: 'How It Works',
        content: `SHA-512 follows the same Merkle-Damgård construction as SHA-256, but scaled up:

**Key differences from SHA-256:**

| Aspect | SHA-256 | SHA-512 |
|---|---|---|
| Word size | 32 bits | 64 bits |
| Block size | 512 bits | 1024 bits |
| Rounds | 64 | 80 |
| Output | 256 bits | 512 bits |
| Message length field | 64 bits | 128 bits |

**Step 1 — Padding:**
Similar to SHA-256, but the message length is encoded as a **128-bit** integer (instead of 64-bit). This allows hashing inputs up to 2¹²⁸ bits — vastly larger than SHA-256's limit of 2⁶⁴ bits.

**Step 2 — Parse into 1024-bit blocks:**
Each block is 16 × 64-bit words (instead of 16 × 32-bit for SHA-256).

**Step 3 — Message schedule:**
The 16 initial words are expanded to **80 words** using:

**W[t] = σ₁(W[t-2]) + W[t-7] + σ₀(W[t-15]) + W[t-16]**

The σ functions operate on 64-bit words with different rotation amounts than SHA-256.

**Step 4 — Compression function:**
Eight **64-bit working registers** (a through h) go through **80 rounds**:

\`\`\`
T1 = h + Σ₁(e) + Ch(e, f, g) + K[t] + W[t]
T2 = Σ₀(a) + Maj(a, b, c)
\`\`\`

Same formulas as SHA-256, but with **64-bit arithmetic** and **80 different round constants** derived from the cube roots of the first 80 primes.

**Step 5 — Output:**
The final 512-bit state is the SHA-512 digest.

**Why 80 rounds instead of 64:**
More rounds provide a greater security margin. The additional 16 rounds ensure that the non-linear mixing reaches every bit of the state. Even if a weakness is found in fewer rounds, SHA-512 has more buffer.`,
        keyPoints: [
          'Block size: **1024 bits** (vs 512 for SHA-256)',
          'Rounds: **80** (vs 64 for SHA-256)',
          'Message length field: **128 bits** (vs 64 for SHA-256)',
          'Output: **512 bits** (vs 256 for SHA-256)',
        ],
        codeSnippet: {
          language: 'typescript',
          code: `// SHA-512 via Web Crypto API
const message = "Hello, World";
const encoder = new TextEncoder();
const data = encoder.encode(message);

const hashBuffer = await crypto.subtle.digest('SHA-512', data);
const hashArray = Array.from(new Uint8Array(hashBuffer));
const hexDigest = hashArray
  .map(b => b.toString(16).padStart(2, '0'))
  .join('');

console.log(hexDigest);
// 128 hex characters (512 bits)
// "374d794a95cdcfd8b35993185fef9ba3
//  68d5c73a4e8e4a0d5b52c8e2c2a1a95c..."

// Note: SHA-512 is often FASTER than SHA-256
// on 64-bit CPUs because it uses full 64-bit
// registers instead of the lower 32 bits.`,
          caption: 'SHA-512 via Web Crypto — 128-character hex output',
        },
      },
      {
        id: 'formula',
        title: 'Mathematical Formulation',
        content: `SHA-512's mathematics is identical in structure to SHA-256, scaled to 64-bit words.

**1. Message schedule (80 words):**

For t = 16 to 79:

**W[t] = σ₁(W[t-2]) + W[t-7] + σ₀(W[t-15]) + W[t-16]**

Where:
- **σ₀(x) = ROTR¹(x) ⊕ ROTR⁸(x) ⊕ SHR⁷(x)**
- **σ₁(x) = ROTR¹⁹(x) ⊕ ROTR⁶¹(x) ⊕ SHR⁶(x)**
- **ROTRⁿ** = right rotation by n bits on 64-bit words
- **+** = addition modulo 2⁶⁴

**2. Compression function (80 rounds):**

For each round t = 0 to 79:

\`\`\`
T1 = h + Σ₁(e) + Ch(e, f, g) + K[t] + W[t]
T2 = Σ₀(a) + Maj(a, b, c)

h = g
g = f
f = e
e = d + T1
d = c
c = b
b = a
a = T1 + T2
\`\`\`

Where:
- **Ch(e, f, g) = (e ∧ f) ⊕ (¬e ∧ g)**
- **Maj(a, b, c) = (a ∧ b) ⊕ (a ∧ c) ⊕ (b ∧ c)**
- **Σ₀(a) = ROTR²⁸(a) ⊕ ROTR³⁴(a) ⊕ ROTR³⁹(a)**
- **Σ₁(e) = ROTR¹⁴(e) ⊕ ROTR¹⁸(e) ⊕ ROTR⁴¹(e)**
- **K[t]** = first 64 bits of the cube roots of the first 80 primes

**3. Constants:**
The 80 round constants K[t] are derived from the **fractional parts** of the cube roots of the first 80 primes. The initial hash values (IV) come from the square roots of the first 8 primes.

**Security parameter:**
- **Collision resistance**: 2²⁵⁶ (birthday bound)
- **Preimage resistance**: 2⁵¹²
- **Second preimage resistance**: 2⁵¹²

This is a **256-bit security level** — matching the security of AES-256 and providing a very long useful lifetime.`,
        keyPoints: [
          'σ functions use 64-bit rotations specific to SHA-512',
          'Σ functions mix bits with three rotations each',
          'Round constants derived from cube roots of first 80 primes',
          'Security level: **256-bit collision resistance**',
        ],
      },
      {
        id: 'example',
        title: 'Worked Example',
        content: `Let us compute SHA-512 of the string **"abc"**.

**Input:**
- ASCII "abc" = \`61 62 63\` (hex)

**Step 1 — Padding:**
- Original length: 24 bits
- Add 1 bit, then zeros
- Pad to length ≡ 896 mod 1024 (note: SHA-512 uses 1024-bit blocks)
- Append **128-bit** length field: \`0x0000...0018\`

**Padded message (in hex, 1024 bits total):**
\`\`\`
61626380000000000000000000000000
00000000000000000000000000000000
... (many zeros)
00000000000000000000000000000018
\`\`\`

**Step 2 — Compression:**
- Initialize 8 × 64-bit state registers
- Process the 1024-bit block through **80 rounds**
- Each round uses Ch, Maj, Σ₀, Σ₁ with 64-bit arithmetic

**Step 3 — Final digest:**

SHA-512("abc") = \`ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f\`

**Verification:**
This matches the standard test vector from NIST FIPS 180-4:

\`\`\`
echo -n "abc" | sha512sum
# ddaf35a193617abacc417349ae204131
# 12e6fa4e89a97ea20a9eeee64b55d39a
# 2192992a274fc1a836ba3c23a3feebbd
# 454d4423643ce80e2a9ac94fa54ca49f
\`\`\`

**Output:** 128 hex characters (512 bits / 64 bytes).`,
        example: `Standard NIST test vectors:

Input  "abc"
Output ddaf35a193617abacc417349ae20413112e6fa4e
       89a97ea20a9eeee64b55d39a2192992a274fc1a8
       36ba3c23a3feebbd454d4423643ce80e2a9ac94f
       a54ca49f

Input  "abcdefghbcdefghicdefghijdefghijkefghijkl
        fghijklmghijklmnhijklmnoijklmnopjklmnopq
        klmnopqrlmnopqrsmnopqrstnopqrstu"
Output 8e959b75dae313da8cf4f72814fc143f8f7779c6
       eb9f7fa17299aeadb6889018501d289e4900f7e4
       331b99dec4b5433ac7d329eeb6dd26545e96e55b
       874acadeb4c44c9d3a8b9f99969f9d4e`,
      },
      {
        id: 'security',
        title: 'Security Analysis',
        content: `SHA-512 provides an extremely high security margin — one of the largest of any widely deployed hash function.

**Security guarantees:**

| Attack type | Complexity required | Notes |
|---|---|---|
| Preimage | 2⁵¹² | Astronomically infeasible |
| Second preimage | 2⁵¹² | Astronomically infeasible |
| Collision | 2²⁵⁶ (birthday) | Impossible with current tech |
| Grover (quantum) | 2²⁵⁶ (preimage) | Still infeasible |

**Post-quantum advantage:**
Grover's algorithm halves the effective security of any hash function:
- SHA-256 → 128-bit post-quantum security (safe but reduced)
- SHA-512 → 256-bit post-quantum security (comfortable margin)

For systems that need to remain secure for **30+ years**, SHA-512 provides a much larger safety margin against both classical and quantum attacks.

**Advantages of the larger word size:**

1. **Naturally resistant to length extension variants**: While SHA-512 is still vulnerable to the basic length-extension attack (it uses Merkle-Damgård), the larger state and more rounds make it harder to exploit in practice.

2. **Higher collision resistance**: 256-bit collision resistance is effectively unbreakable — even with quantum computers and foreseeable future technology.

3. **Post-quantum comfortable**: Unlike SHA-256, whose post-quantum collision resistance is only 128 bits, SHA-512 remains at 256 bits.

**Common vulnerabilities:**

**1. Length-extension attack** — same as SHA-256. Use HMAC-SHA512 for authentication, not H(secret || message).

**2. Password storage** — SHA-512 is fast (a GPU computes billions per second). Use Argon2id for passwords.

**3. Side channels** — SHA-512 has no data-dependent branches, so it is naturally constant-time. No side-channel concerns.

**When SHA-512's extra security matters:**
- **Code signing keys** (long-lived)
- **Root CA certificates** (25+ year lifetime)
- **Master key derivation** (for HSMs)
- **Long-term archive integrity**
- **Post-quantum transition contexts**`,
        keyPoints: [
          'Collision resistance: **2²⁵⁶** — completely infeasible',
          'Post-quantum: **256-bit security** even against Grover',
          'Naturally constant-time (no data-dependent branches)',
          'Preferred for long-lived keys and high-assurance systems',
        ],
        callout: {
          type: 'tip',
          title: 'SHA-512 for Long-Term Security',
          content: `If you are building a system in 2025 that needs to remain secure through 2055, **choose SHA-512 over SHA-256**. The extra security margin costs almost nothing in performance (SHA-512 is often *faster* on 64-bit CPUs), and it provides 256-bit post-quantum collision resistance — a comfortable buffer against future advances.`,
        },
      },
      {
        id: 'comparison',
        title: 'SHA-512 vs SHA-256',
        content: `SHA-256 and SHA-512 are nearly identical in structure — both from the SHA-2 family, both designed by the NSA. The differences are in word size, block size, and output length.

| Aspect | SHA-256 | SHA-512 |
|---|---|---|
| Word size | 32 bits | **64 bits** |
| Block size | 512 bits | 1024 bits |
| Rounds | 64 | **80** |
| Output | 256 bits | 512 bits |
| Length field | 64 bits | 128 bits |
| Collision resistance | 128 bits | **256 bits** |
| Speed on 32-bit CPU | Fast | Slow |
| Speed on 64-bit CPU | Fast | **Faster** |
| Post-quantum margin | Reduced (128-bit) | **Full (256-bit)** |
| Standardized | FIPS 180-4 | FIPS 180-4 |

**Performance analysis:**
On a modern 64-bit CPU:
- SHA-256: ~500 MB/s (uses half of each 64-bit register)
- SHA-512: ~800 MB/s (uses full 64-bit registers)

**Practical recommendations:**
- **Server-side, no compatibility issues**: SHA-512 is a solid default
- **TLS, Git, DNSSEC, Bitcoin**: SHA-256 (compatibility established)
- **Long-term keys (10+ years)**: SHA-512
- **Embedded/32-bit**: SHA-256 (SHA-512 wastes 32-bit registers)
- **Post-quantum contexts**: SHA-384 or SHA-512

**Both are safe.** The choice is driven by compatibility and threat model — never by security concerns about either algorithm.`,
      },
      {
        id: 'lab',
        title: 'Try It Yourself',
        content: `Use the mini-lab below to compute SHA-512 hashes. Note:
- The output is **128 hex characters** — twice the length of SHA-256.
- Compare the SHA-256 and SHA-512 hashes of the same input — they are completely unrelated.
- Try modifying a single character — both hashes change completely (avalanche effect).`,
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You have mastered SHA-512 — the high-security variant of the SHA-2 family.

**Core concepts learned:**
- **64-bit words, 80 rounds, 1024-bit blocks**
- **512-bit output** — 128 hex characters
- **256-bit collision resistance** — post-quantum comfortable
- **Faster than SHA-256** on modern 64-bit CPUs
- **Preferred for long-term, high-assurance systems**

**Next algorithm:** MD5 — the broken hash that teaches us cryptographic agility.`,
      },
    ],
    playgroundRoute: '/playground/hash?algo=SHA-512',
    defaultDemoKey: '',
    defaultDemoInput: 'Ultra high-security digital envelope',
    labEnabled: true,
  },

  // ============================================================
  // 11 — MD5 (BROKEN DEMO)
  // ============================================================
  {
    id: 'md5',
    name: 'MD5 (Broken)',
    category: 'hashing',
    difficulty: 'beginner',
    tagline: 'A broken hash function — a cautionary tale of cryptographic obsolescence',
    description:
      'A 128-bit hash function designed in 1991, cryptographically broken since 2004. Included as a historical lesson on why cryptographic algorithms have finite useful lifetimes and must be replaced when weaknesses emerge.',
    estimatedMinutes: 9,
    references: [
      {
        title: 'RFC 1321: The MD5 Message-Digest Algorithm',
        author: 'R. Rivest',
        year: 1992,
        url: 'https://datatracker.ietf.org/doc/html/rfc1321',
        type: 'standard',
      },
      {
        title:
          'How to Break MD5 and Other Hash Functions',
        author: 'X. Wang, H. Yu',
        year: 2005,
        url: 'https://link.springer.com/chapter/10.1007/11426639_2',
        type: 'paper',
      },
      {
        title:
          'Second Preimages on n-bit Hash Functions for Much Less than 2ⁿ Work',
        author: 'J. Kelsey, B. Schneier',
        year: 2005,
        url: 'https://link.springer.com/chapter/10.1007/11426639_28',
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
      'MD5 is **cryptographically broken** since 2004 — collision attacks are practical.',
      'It is **deterministic and fast** — usable only as a non-cryptographic checksum.',
      'A famous 2008 attack forged a **rogue CA certificate** using MD5 collisions.',
      'Modern replacements: **SHA-256, SHA-3, BLAKE3**.',
    ],
    sections: [
      {
        id: 'introduction',
        title: 'What is MD5?',
        content: `**MD5** (Message Digest 5) is a **128-bit cryptographic hash function** designed by **Ron Rivest** in 1991. For over a decade, it was the **world standard** for file integrity checks, password hashing, and digital signatures.

**Output format:**
- 128-bit digest — 32 hex characters
- Example: MD5("Hello") = \`8b1a9953c4611296a827abf8c47804d7\`

**The problem:**
In **2004**, a team led by **Xiaoyun Wang** demonstrated that MD5 has **practical collision attacks** — two different inputs producing the same MD5 hash can be generated in **seconds** on a laptop. This is fatal for any cryptographic use.

**What MD5 is still safe for:**
- **Non-adversarial checksums**: verifying a download against a corrupted transfer (not against a malicious attacker)
- **Cache keys**: generating unique IDs for HTTP caching (a collision just causes a cache miss — not a security issue)
- **Deduplication**: detecting identical files in a non-adversarial environment
- **Legacy compatibility**: verifying against existing MD5 records where no security is required

**What MD5 must NEVER be used for:**
- **Digital signatures** (attacker can forge signatures)
- **Certificate fingerprints** (attacker can forge certificates)
- **Password storage** (fast hashing + collisions)
- **File integrity against attackers** (integrity is now meaningless)
- **Any security-critical purpose**

**Why it is included in ChiperLab:**
MD5 is a **pedagogical lesson** — cryptographic algorithms have a **finite useful lifetime**. SHA-1 fell after 22 years. MD5 fell after 13 years. Modern cryptographic design must anticipate this — which is why NIST standardized SHA-3 as a **structural backup** to SHA-2, using a completely different design.`,
        keyPoints: [
          '128-bit hash from Ron Rivest (1991)',
          '**Broken since 2004** — practical collision attacks exist',
          'Still usable as a non-cryptographic checksum',
          'Famous 2008 attack forged a rogue CA certificate',
        ],
        callout: {
          type: 'warning',
          title: 'MD5 is Broken — Do Not Use for Security',
          content: `MD5 provides **no cryptographic security** in 2024. Any protocol, certificate, or signature that relies on MD5 is **fundamentally compromised**. This lesson exists to show **why** cryptographic algorithms age, and **how** the cryptographic community responds when a widely-deployed algorithm falls.`,
        },
      },
      {
        id: 'history',
        title: 'Historical Origin and Fall',
        content: `MD5's story is one of the most instructive in cryptographic history — a decade of dominance followed by a dramatic, complete collapse.

**The rise (1991–2004):**
- **1991**: Ron Rivest publishes MD5 as a successor to MD4, both designed at MIT.
- **1992**: RFC 1321 formalizes MD5 as an internet standard.
- **1990s**: MD5 becomes ubiquitous — SSL/TLS certificates, PGP keys, file checksums, password storage, code signing.
- **2000**: Widely assumed secure by the cryptography community.

**Early cracks (1996–2003):**
- **1996**: Hans Dobbertin finds a flaw in MD5's compression function.
- **2003**: Statistical weaknesses published.
- **2004**: **Xiaoyun Wang** presents a practical collision attack — two different messages with the same MD5 hash, generated in hours.

**The collapse (2005–2019):**
- **2005**: Wang refines the attack — collisions found in **seconds** on a standard PC.
- **2007**: Marc Stevens publishes "chosen-prefix collisions" — two arbitrary messages with controlled prefixes can be forced to collide.
- **2008**: **Rogue CA certificate attack** — researchers used MD5 collisions to forge a certificate that browsers accepted as legitimate, potentially allowing man-in-the-middle attacks on any HTTPS site.
- **2012**: Flame malware uses a crafted MD5 collision to bypass Windows Update signature verification.
- **2019**: Researchers demonstrate further refinements.

**The response:**
- **2008**: NIST discourages MD5 for all security applications.
- **2011**: Certificate authorities stop issuing MD5-signed certificates.
- **Today**: MD5 is formally deprecated by NIST, IETF, and industry bodies.

**The lesson:**
Cryptographic algorithms are not immortal. The cryptographic community must:
1. **Anticipate** weaknesses and design successors.
2. **Standardize** structural backups (SHA-3 for SHA-2).
3. **Migrate** proactively, not reactively.
4. **Never assume** an algorithm will remain secure forever.`,
        keyPoints: [
          'Designed by Ron Rivest (1991), standardized in RFC 1321',
          'First flaw found in **1996** (Dobbertin)',
          'Practical collision attack published by **Wang in 2004**',
          '**Rogue CA certificate (2008)** demonstrated real-world impact',
          '**Flame malware (2012)** exploited MD5 in Windows Update',
        ],
      },
      {
        id: 'how-it-works',
        title: 'How It Works',
        content: `MD5 uses the same **Merkle-Damgård construction** as SHA-1 and SHA-2, but with a much simpler round function — one reason for its vulnerability.

**Step 1 — Padding:**
The message is padded so its length ≡ 448 mod 512 (bits):
- Append a single \`1\` bit
- Append zeros
- Append the original message length as a **64-bit integer**

**Step 2 — Parse into 512-bit blocks:**
Each block is 16 × 32-bit words.

**Step 3 — Initialize state:**
Four 32-bit registers (A, B, C, D) initialized with specific constants:
- A = 0x67452301
- B = 0xefcdab89
- C = 0x98badcfe
- D = 0x10325476

(These are "nothing up my sleeve" numbers — computed from the sine of integers.)

**Step 4 — Compression:**
Each 512-bit block is processed through **64 rounds** across **4 stages** of 16 rounds each. Each stage uses a different non-linear function:
- F(b, c, d) = (b ∧ c) ∨ (¬b ∧ d)  (rounds 0–15)
- G(b, c, d) = (b ∧ d) ∨ (c ∧ ¬d)  (rounds 16–31)
- H(b, c, d) = b ⊕ c ⊕ d           (rounds 32–47)
- I(b, c, d) = c ⊕ (b ∨ ¬d)         (rounds 48–63)

Each round also applies a **left rotation** of varying amounts and uses a **different constant** derived from the sine of integers.

**Step 5 — Output:**
After processing all blocks, the final 128-bit state (A || B || C || D) is the MD5 digest.

**Why MD5 broke — the design flaw:**
MD5's round functions are **linear in one input** for each stage. This linearity, combined with the differential trail structure, allows attackers to construct messages that collide with far less work than the birthday bound of 2⁶⁴. Modern cryptanalysis reduced practical MD5 collisions to operations measured in **seconds on a laptop**.

**Why SHA-256 resists:**
SHA-256 uses more rounds (64 vs 64 — similar) but with **stronger non-linear functions** (Ch and Maj instead of MD5's simpler F and G) and **more complex message scheduling** (SHA-256 expands 16 words to 64, while MD5 uses the same 16 words throughout). This makes differential attacks vastly harder.`,
        keyPoints: [
          'Merkle-Damgård: 512-bit blocks, 64 rounds',
          'Non-linear functions F, G, H, I — simpler than SHA-2',
          'Differential cryptanalysis exploits MD5\'s linear components',
          '64 rounds are not enough when round functions have structural weaknesses',
        ],
        codeSnippet: {
          language: 'typescript',
          code: `// MD5 is NOT available in Web Crypto API
// (because it is cryptographically broken).
//
// To demonstrate MD5, you would need a third-party library:
//
//   import md5 from 'crypto-js/md5';
//
//   const hash = md5("Hello").toString();
//   // "8b1a9953c4611296a827abf8c47804d7"
//
// But in modern applications, you should NEVER
// use MD5 for security. Use SHA-256 instead:
//
//   const hashBuffer = await crypto.subtle.digest(
//     'SHA-256',
//     new TextEncoder().encode("Hello")
//   );`,
          caption: 'Web Crypto deliberately omits MD5 — use SHA-256 instead',
        },
      },
      {
        id: 'formula',
        title: 'Mathematical Formulation',
        content: `MD5 uses 32-bit modular arithmetic with four stages of processing.

**State registers:**
Four 32-bit registers A, B, C, D, initialized to fixed constants derived from the fractional parts of sine values.

**Four non-linear functions (one per 16-round stage):**

| Stage | Rounds | Function | Formula |
|---|---|---|---|
| 1 | 0–15 | F | (B ∧ C) ∨ (¬B ∧ D) |
| 2 | 16–31 | G | (B ∧ D) ∨ (C ∧ ¬D) |
| 3 | 32–47 | H | B ⊕ C ⊕ D |
| 4 | 48–63 | I | C ⊕ (B ∨ ¬D) |

**Round operations (each of 64 rounds):**

\`\`\`
F = stage_function(B, C, D)
A = B + ROTL(A + F + K[i] + M[g], s[i])
(A, B, C, D) = (D, A, B, C)   // rotate registers
\`\`\`

Where:
- **K[i]** = 64 distinct constants (floor(2³² × |sin(i+1)|))
- **M[g]** = message word chosen by a specific per-round schedule
- **s[i]** = per-round rotation amounts
- **+** = addition modulo 2³²
- **ROTL** = left rotation

**Why MD5 is vulnerable:**
The F and G functions are **linear in one argument** for portions of the computation. Specifically:
- **F is linear in C and D** if B is held constant
- **G is linear in B and D** if C is held constant

This linearity allows attackers to use **differential cryptanalysis**: they construct two messages that produce almost identical internal states through the first several rounds, then diverge only at a controlled point. Modern collision attacks find such messages with **2³⁰ to 2⁴⁰ operations** — vastly less than the 2⁶⁴ birthday bound.

**Comparison with SHA-2's resistance:**
SHA-256's Ch and Maj functions are **non-linear in all three arguments simultaneously**. There is no way to hold one argument constant and linearize the function. This is a fundamental design improvement that makes differential attacks vastly harder.`,
        keyPoints: [
          'Four stages of 16 rounds, each with a different non-linear function',
          'F and G are linear in one argument — enables differential cryptanalysis',
          'Practical collisions found in **2³⁰–2⁴⁰ operations**',
          'SHA-2 uses Ch/Maj functions that are non-linear in all arguments',
        ],
      },
      {
        id: 'example',
        title: 'Collision Demonstration',
        content: `MD5's weakness is best understood by looking at the classic collision examples.

**Standard test vector:**
MD5("Hello") = \`8b1a9953c4611296a827abf8c47804d7\`
MD5("hello") = \`5d41402abc4b2a76b9719d911017c592\`

Different case → completely different hash. So far so good.

**But now the famous collision:**
Two binary files (128 bytes each), differing only in 6 bytes, produce the **same MD5 hash**:

- File 1: \`d131dd02c5e6eec4...\`
- File 2: \`d131dd02c5e6eec4...\` (slightly different)

Both produce MD5 hash = \`79054025255fb1a26e4bc422aef54eb4\`

**This collision was published by Wang et al. in 2004.**

**The 2008 Rogue CA attack:**
Security researchers used MD5 collisions to generate a **fake certificate authority certificate** that browsers accepted as legitimate. The attack:
1. Bought a legitimate certificate from a real CA (with a specific MD5 hash X).
2. Crafted a fake CA certificate that also had MD5 hash X.
3. If the CA signed their certificate (which it did), the signature would ALSO validate the fake CA certificate.
4. The fake CA could then issue certificates for any domain.

The attack was theoretical (researchers destroyed their copy) but demonstrated MD5's real-world impact.

**The 2012 Flame malware:**
The Flame malware used a specially crafted MD5 collision to create a fake Microsoft certificate. This certificate allowed the malware to sign updates that Windows Update would install — even though Microsoft never signed them. Flame spread to thousands of Windows machines in the Middle East.

**The lesson:**
Hash collisions are not just theoretical — they have been used to attack real systems. Any security-critical use of MD5 is **fundamentally unsafe**.`,
        example: `Classic MD5 collision (Wang 2004):

File 1 (128 bytes):
  d131dd02c5e6eec4693d9a0698aff95c
  2fcab58712467eab4004583eb8fb7f89
  ... (many bytes)
  MD5 = 79054025255fb1a26e4bc422aef54eb4

File 2 (128 bytes):
  d131dd02c5e6eec4693d9a0698aff95c
  2fcab50712467eab4004583eb8fb7f89
  ... (slightly different bytes)
  MD5 = 79054025255fb1a26e4bc422aef54eb4

Same MD5 hash, different files.`,
      },
      {
        id: 'security',
        title: 'Security Analysis',
        content: `MD5 provides **no cryptographic security** in 2024. Every security property it was designed to provide has been broken.

**Broken properties:**

| Property | Status |
|---|---|
| Preimage resistance | **Theoretically weak**, no practical attack yet |
| Second preimage resistance | **Weak** in structured cases |
| Collision resistance | **Completely broken** since 2004 |

**Practical attack complexity:**
- Finding a collision: **2²⁰ – 2³⁰ operations** (seconds to hours on a laptop)
- Chosen-prefix collision: **hours to days** on a single GPU
- Meaningful collision (two files with desired content): **feasible with dedicated effort**

**Real-world attacks that used MD5 collisions:**

1. **Rogue CA certificate (2008)** — forged certificate that browsers trusted.
2. **Flame malware (2012)** — fake Microsoft certificate to sign malware.
3. **Multiple PGP key collisions** — forged identity in PGP's web of trust.
4. **Signed PDF collisions** — two different documents with the same MD5 signature.

**What is still safe:**

MD5 remains acceptable for **non-security, non-adversarial** uses:

- **Cache keys**: HTTP caching, CDN edge caches, application cache invalidation — a collision causes a cache miss, not a security issue.
- **Change detection**: detecting accidental file modifications (corruption, transfer errors).
- **Deduplication**: identifying identical files in a trusted environment.
- **Legacy verification**: checking old records where the original value is known.

**What MD5 must NEVER be used for:**

- **Digital signatures** — an attacker can forge a signature.
- **Certificate fingerprints** — the entire PKI trust chain is compromised.
- **Password storage** — far too fast, and collisions are possible.
- **File integrity in security contexts** — attackers can craft files with matching hashes.
- **HMAC-MD5** — even HMAC cannot save MD5 for new applications.

**Modern replacements:**
- **SHA-256** — the standard replacement
- **SHA-3** — different construction, immune to length extension
- **BLAKE3** — fastest modern hash
- **Argon2id** — for password storage specifically`,
        keyPoints: [
          'Collision resistance: **broken since 2004**',
          'Practical collisions: **seconds to hours** on modern hardware',
          'Used in **real attacks** (rogue CA, Flame malware)',
          'Still safe for **non-adversarial checksums** only',
          'Modern replacement: **SHA-256 or SHA-3**',
        ],
        callout: {
          type: 'warning',
          title: 'If You See MD5 in Production Code — Flag It',
          content: `If you encounter MD5 in **any security-critical context** (signatures, certificates, password storage, integrity checks in adversarial environments), it is a **critical vulnerability**. Migrate to SHA-256 or SHA-3 immediately. Non-adversarial uses (cache keys, deduplication) may be acceptable but should be documented as intentional.`,
        },
      },
      {
        id: 'comparison',
        title: 'MD5 vs Modern Alternatives',
        content: `How does MD5 compare to the hashes that replaced it?

| Hash | Output | Status | Speed | Collision resistance |
|---|---|---|---|---|
| **MD5** | 128-bit | **Broken** | Very fast | **Zero** (broken) |
| SHA-1 | 160-bit | **Broken** | Fast | Zero (broken) |
| SHA-256 | 256-bit | **Secure** | Fast | 128 bits |
| SHA-512 | 512-bit | **Secure** | Fast on 64-bit | 256 bits |
| SHA-3-256 | 256-bit | **Secure** | Moderate | 128 bits |
| BLAKE3 | Variable | **Secure** | Very fast | 128+ bits |
| Argon2id | Variable | **Secure** | Deliberately slow | N/A (KDF) |

**Migration guidance:**

**For file integrity / digital signatures:**
- Move from MD5 → **SHA-256** (standard) or **SHA-3-256** (modern).

**For password storage:**
- Move from MD5 → **Argon2id** (with salt, tuned cost).
- Never use SHA-256 for passwords either — use a password hashing function.

**For HMAC:**
- Move from HMAC-MD5 → **HMAC-SHA256**.

**For legacy verification (compatibility only):**
- Keep MD5 only for verifying old data where the original is known.
- Never compute **new** MD5 signatures.

**Timeline of hash function obsolescence:**
- **MD5**: designed 1991, broken 2004 (13 years)
- **SHA-1**: designed 1995, broken 2017 (22 years)
- **SHA-256**: designed 2001, still secure after 23 years
- **SHA-3**: designed 2015, still secure after 9 years

**Design lesson:** Cryptographic agility — the ability to swap algorithms — is now a **requirement** for long-lived systems.`,
      },
      {
        id: 'lab',
        title: 'Try It Yourself',
        content: `Use the mini-lab below to compute MD5 hashes. Note:
- The output is **32 hex characters** (128 bits).
- MD5 is fast — try hashing many inputs to feel the speed.
- **Do NOT use MD5 for any security purpose.** It is included here purely for education.
- Compare MD5's speed with SHA-256 — MD5 is noticeably faster, one reason it was so widely deployed.`,
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You have explored MD5 — the broken hash that teaches cryptographic agility.

**Core concepts learned:**
- **128-bit digest** from Ron Rivest (1991)
- **Merkle-Damgård** construction with 4 stages of 16 rounds
- **Collision attack (2004)**: practical on a laptop
- **Real-world impact**: rogue CA certificate (2008), Flame malware (2012)
- **Cryptographic obsolescence**: algorithms have finite useful lifetimes

**The lesson:**
Cryptographic algorithms are not immortal. MD5 held the world for 13 years before falling. SHA-1 lasted 22. The cryptographic community must design for obsolescence — which is why NIST maintains **SHA-3 as a structural backup** to SHA-2, using a completely different construction.

**Next algorithm:** Base64 — the encoding scheme that is often mistaken for encryption.`,
      },
    ],
    playgroundRoute: '/playground/hash?algo=MD5',
    defaultDemoKey: '',
    defaultDemoInput: 'collision-resistant?',
    labEnabled: true,
  },
];