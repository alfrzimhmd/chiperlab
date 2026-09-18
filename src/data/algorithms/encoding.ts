import { AlgorithmDetail } from './_types';

/**
 * Encoding Schemes — Order 12-14
 *
 * NOT encryption. Encoding schemes provide safe
 * transport and human-readable display of binary data.
 * They use NO key and provide ZERO confidentiality.
 *
 * Order:
 *   12. Base64 (binary-to-text transport)
 *   13. Hex / Base16 (universal byte display)
 *   14. ROT13 (self-inverse letter rotation)
 *
 * Sources:
 *   - RFC 4648: The Base16, Base32, and Base64 Data Encodings
 *   - OWASP Cryptographic Storage Cheat Sheet
 *   - MDN Web Docs — Base64 and atob/btoa
 *   - S. Singh, "The Code Book" (1999) — for ROT13 history
 */
export const ENCODING_ALGORITHMS: AlgorithmDetail[] = [
  // ============================================================
  // 12 — BASE64
  // ============================================================
  {
    id: 'base64',
    name: 'Base64 Encoding',
    category: 'encoding',
    difficulty: 'beginner',
    tagline: 'Binary-to-text encoding for safe transport — NOT encryption',
    description:
      'A binary-to-text encoding scheme that represents binary data using 64 printable ASCII characters. Commonly used in email attachments (MIME), JSON Web Tokens, and data URIs. Provides zero confidentiality — anyone can decode it.',
    estimatedMinutes: 8,
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
      {
        title: 'MDN Web Docs — Base64 Encoding and Decoding',
        author: 'Mozilla',
        url: 'https://developer.mozilla.org/en-US/docs/Glossary/Base64',
        type: 'documentation',
      },
    ],
    keyTakeaways: [
      'Base64 is **encoding**, not encryption — it provides **zero confidentiality**.',
      'Anyone can decode Base64 in milliseconds with a single line of code.',
      'Its purpose is **transport**: carrying binary data across text-only protocols.',
      'Common uses: MIME email attachments, JWT tokens, data URIs (inline images).',
    ],
    sections: [
      {
        id: 'introduction',
        title: 'What is Base64?',
        content: `**Base64** is a **binary-to-text encoding** scheme that represents binary data using 64 printable ASCII characters. It is one of the most widely used — and most misunderstood — schemes in computing.

**The core purpose:**
Many systems were designed around **text** — email (SMTP), JSON, XML, URLs. But these systems cannot safely carry **binary data** (images, cryptographic keys, compressed archives). Base64 solves this by converting arbitrary bytes into a text-safe string.

**How it looks:**
- Input: \`"Hello"\` (5 ASCII bytes)
- Base64 output: \`"SGVsbG8="\` (8 characters)

**The critical fact — Base64 is NOT encryption:**
Many developers mistakenly believe Base64 hides data. **It does not.** There is no key, no secret, no transformation that requires any credential to reverse. Anyone with a browser console can decode Base64 instantly:

\`\`\`javascript
atob("SGVsbG8=")  // → "Hello"
\`\`\`

**Why this misconception matters:**
Real-world data breaches have occurred because developers stored passwords or API keys as Base64, believing it provided protection. It did not — attackers decoded them without effort.

**Real-world uses:**
- **Email attachments (MIME)** — every PDF, image, and document in your email inbox travels as Base64.
- **JWT tokens** — the header and payload sections of every JSON Web Token are Base64URL-encoded.
- **Data URIs** — embedding small images directly in HTML or CSS without separate files.
- **Basic HTTP Auth** — the \`username:password\` string in the Authorization header.
- **Kubernetes secrets** — secret values stored in Kubernetes are Base64-encoded (and NOT encrypted by default!).

**The correct mental model:**
Base64 is like putting a letter in an envelope. Anyone can open the envelope. It protects the letter from being damaged in transit — not from being read.`,
        keyPoints: [
          'Binary-to-text encoding, not encryption',
          'Zero confidentiality — decode with a single line of code',
          'Purpose is **safe transport** across text-only protocols',
          'Real-world uses: email, JWT, data URIs, K8s secrets',
        ],
        callout: {
          type: 'warning',
          title: 'Never Store Secrets as Base64',
          content: `Storing passwords, API keys, tokens, or any sensitive data as **Base64 is equivalent to storing them as plaintext**. Real-world breaches have occurred because developers confused encoding with encryption. If you need confidentiality, use **AES-GCM** or **ChaCha20-Poly1305**. If you need safe transport, use **Base64**. Never mix the two.`,
        },
      },
      {
        id: 'history',
        title: 'Historical Origin',
        content: `Base64 was invented to solve a specific problem: **moving binary data through systems designed for text.**

**The problem (1960s–1980s):**
- Email (SMTP) was designed for **7-bit ASCII** only.
- Many network protocols could not reliably transmit bytes with the high bit set (≥ 0x80).
- Binary files — images, executables, compressed archives — could not travel across these channels unmodified.

**The solution — encoding schemes:**
Engineers created schemes that converted 8-bit binary into 7-bit text, at the cost of making the output larger. The most successful of these was **Base64** (also **Base32**, **uuencode**, **BinHex**).

**Timeline:**
- **1987**: PEM (Privacy-Enhanced Mail) specification introduces Base64 in **RFC 989** — the first formal use.
- **1992**: **RFC 1341** (MIME) adopts Base64 for email attachments.
- **1996**: **RFC 2045** refines the MIME Base64 specification.
- **2006**: **RFC 4648** defines Base64, Base32, and Base16 (Hex) — the current standard.

**Why "64"?**
Base64's alphabet has 64 symbols:
- A–Z (26)
- a–z (26)
- 0–9 (10)
- \`+\` and \`/\` (2)

That is 64 characters total — one symbol for each of the 64 possible 6-bit values. Because **64 = 2⁶**, every 6 bits of binary data maps to exactly one Base64 character — a clean, efficient correspondence.

**The 33% overhead:**
Every 3 bytes (24 bits) of input becomes 4 Base64 characters (24 bits of *encoded* data). So Base64 output is exactly **4/3 = 133%** of the input size. This is the price of text-safe transport — a well-understood trade-off that has served the internet for decades.`,
        keyPoints: [
          'Invented to solve 7-bit ASCII limits on email and network protocols',
          'PEM (1987) → MIME (1992) → RFC 4648 (2006)',
          '64 symbols = 6 bits per character',
          'Output is 33% larger than input (3 bytes → 4 chars)',
        ],
      },
      {
        id: 'how-it-works',
        title: 'How It Works',
        content: `Base64 encoding processes data in **3-byte groups** and converts them to **4-character output**.

**Step 1 — Group into 3-byte chunks**
Take 3 bytes (24 bits) of input at a time. If the input length is not a multiple of 3, the last group is **padded** with zeros.

**Step 2 — Split into 6-bit segments**
Divide the 24 bits into four 6-bit groups. Each 6-bit group represents a value from 0 to 63.

**Step 3 — Map to Base64 alphabet**
Each 6-bit value is mapped to a character:

| Value | Char | Value | Char | Value | Char | Value | Char |
|---|---|---|---|---|---|---|---|
| 0–25 | A–Z | 26–51 | a–z | 52–61 | 0–9 | 62 | + |
| 63 | / | | | | | | |

**Step 4 — Handle padding**
If the last chunk has only 1 or 2 bytes, add \`=\` characters to make the output length a multiple of 4:
- 1 leftover byte → 2 Base64 chars + \`==\` (2 padding)
- 2 leftover bytes → 3 Base64 chars + \`=\` (1 padding)

**Example — encoding "Hello":**

Input bytes: \`"Hello"\` = \`48 65 6C 6C 6F\` (5 bytes, so 1 group of 3 + 2 leftovers)

**First group (3 bytes): \`48 65 6C\`**
Binary:
\`\`\`
01001000 01100101 01101100
\`\`\`
Split into 6-bit groups:
\`\`\`
010010 | 000110 | 010101 | 101100
   18   |    6   |   21   |   44
\`\`\`
Map to Base64 alphabet:
\`\`\`
18 → S
 6 → G
21 → V
44 → s
\`\`\`
Output: \`SGVs\`

**Second group (2 bytes): \`6C 6F\`**
Pad to 3 bytes with zeros:
\`\`\`
01101100 01101111 00000000
\`\`\`
Split into 6-bit groups:
\`\`\`
011011 | 000110 | 111100 | 000000
   27  |    6   |   60   |  (padding)
\`\`\`
Map:
\`\`\`
27 → b
 6 → G
60 → 8
pad → =
\`\`\`
Output: \`bG8=\`

**Final Base64 output:** \`SGVsbG8=\` (8 characters)`,
        keyPoints: [
          'Process input in 3-byte groups (24 bits → 4 × 6-bit)',
          'Each 6-bit value maps to one Base64 character',
          'Padding with "=" handles inputs not divisible by 3',
          'Output is always a multiple of 4 characters',
        ],
        codeSnippet: {
          language: 'typescript',
          code: `// Base64 encode/decode in the browser
const text = "Hello, World!";

// Encode (UTF-8 aware)
function base64Encode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  bytes.forEach(b => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

// Decode (UTF-8 aware)
function base64Decode(encoded: string): string {
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

console.log(base64Encode("Hello, World!"));
// → "SGVsbG8sIFdvcmxkIQ=="

console.log(base64Decode("SGVsbG8sIFdvcmxkIQ=="));
// → "Hello, World!"`,
          caption: 'Base64 encode/decode in the browser (UTF-8 aware)',
        },
      },
      {
        id: 'formula',
        title: 'Mathematical Formulation',
        content: `Base64 encoding is a **bijective mapping** between 3-byte (24-bit) chunks and 4-character output.

**Encoding — 3 bytes → 4 chars:**
Given input bytes \`b₁ b₂ b₃\`:

\`\`\`
c₁ = b₁ >> 2
c₂ = ((b₁ & 0x03) << 4) | (b₂ >> 4)
c₃ = ((b₂ & 0x0F) << 2) | (b₃ >> 6)
c₄ = b₃ & 0x3F
\`\`\`

Each \`cᵢ\` is a 6-bit value (0–63), mapped to a Base64 character via the alphabet table.

**Decoding — 4 chars → 3 bytes:**
Given characters \`c₁ c₂ c₃ c₄\` (converted back to values 0–63):

\`\`\`
b₁ = (c₁ << 2) | (c₂ >> 4)
b₂ = ((c₂ & 0x0F) << 4) | (c₃ >> 2)
b₃ = ((c₃ & 0x03) << 6) | c₄
\`\`\`

**Size expansion:**
Input: 3 bytes = 24 bits
Output: 4 chars × 8 bits (ASCII) = 32 bits

Overhead ratio = **32 / 24 = 1.333** → **33% larger**

**Padding rule:**
- Input length mod 3 = 0 → no padding
- Input length mod 3 = 1 → 2 padding chars (\`==\`)
- Input length mod 3 = 2 → 1 padding char (\`=\`)

**Base64URL variant:**
For URL-safe contexts (JWT, query strings), the alphabet is modified:
- \`+\` → \`-\` (dash)
- \`/\` → \`_\` (underscore)
- \`=\` padding often omitted

This avoids URL-encoding issues and makes Base64 strings safe in any URL.`,
        keyPoints: [
          'Encoding: 3 bytes (24 bits) → 4 chars (4 × 6-bit values)',
          'Decoding: reverse the bit-shift operations',
          'Overhead: exactly **33% larger** than input',
          'Base64URL variant uses \`-\` and \`_\` for URL safety',
        ],
      },
      {
        id: 'example',
        title: 'Worked Example',
        content: `Let us encode the string **"Cat"** to Base64.

**Step 1 — Convert to ASCII bytes:**

| Char | ASCII (dec) | Binary |
|---|---|---|
| C | 67 | \`01000011\` |
| a | 97 | \`01100001\` |
| t | 116 | \`01110100\` |

**Step 2 — Concatenate:**
\`\`\`
01000011 01100001 01110100
\`\`\`

**Step 3 — Split into 6-bit groups:**
\`\`\`
010000 | 110110 | 000101 | 110100
\`\`\`

**Step 4 — Convert to decimal:**

| Group | Binary | Decimal | Base64 Char |
|---|---|---|---|
| 1 | 010000 | 16 | Q |
| 2 | 110110 | 54 | 2 |
| 3 | 000101 | 5 | F |
| 4 | 110100 | 52 | 0 |

**Wait — value 16 maps to 'Q'?** Yes. Let me double-check the alphabet:
- 0–25 → A–Z
- 26–51 → a–z
- 52–61 → 0–9
- 62 → \`+\`
- 63 → \`/\`

So:
- 16 → Q (A=0, so Q=16) ✓
- 54 → 2 (0=52, 1=53, 2=54) ✓
- 5 → F ✓
- 52 → 0 ✓

**Base64 output:** **"Q2F0"**

**Verification:**
\`\`\`
echo -n "Cat" | base64
# Q2F0
\`\`\`

**Decoding "Q2F0":**
Reverse the process:
- Q (16) = \`010000\`
- 2 (54) = \`110110\`
- F (5)  = \`000101\`
- 0 (52) = \`110100\`

Concatenate: \`01000011 01100001 01110100\` = \`C a t\` ✓`,
        example: `Walkthrough (character by character):

Input: "Cat" = 43 61 74 (hex) = 01000011 01100001 01110100

Split into 6-bit groups:
  010000 110110 000101 110100
     16     54      5     52

Map to Base64 alphabet:
  16 → Q
  54 → 2
   5 → F
  52 → 0

Output: "Q2F0"

Try it yourself:
  echo -n "Cat" | base64
  # Q2F0`,
      },
      {
        id: 'security',
        title: 'Security Analysis',
        content: `Base64 provides **zero cryptographic security**. It is not designed to protect data — only to encode it safely for transport.

**The fundamental fact:**
Base64 is **fully reversible without any key**. Any tool, any language, any browser console can decode it instantly. It provides the same confidentiality as writing the original data on a postcard.

**Why it is confused with encryption:**
- The output **looks** scrambled: \`SGVsbG8=\` does not look like "Hello".
- Non-technical observers may assume it is encrypted.
- Junior developers may copy the pattern from examples without understanding.

This confusion has caused **real-world breaches**:
- **2019**: A cybersecurity research firm found thousands of mobile apps storing API keys and user credentials as Base64 in their network traffic and local storage. Attackers decoded them trivially.
- **Multiple data breaches** have involved Base64-encoded secrets in configuration files, environment variables, and source code repositories.

**The correct mental model:**
Base64 is like a **transparent envelope**. Anyone can see through it. It protects the contents from being damaged in transit (mangling by text-only protocols) — not from being read.

**Base64 is safe for:**
- **Transport encoding**: carrying binary data over text protocols.
- **Data URIs**: embedding small images in HTML/CSS.
- **JWT structure**: encoding header and payload (the signature provides actual security).
- **Non-sensitive obfuscation**: hiding spoilers, ensuring text-safe storage.

**Base64 is NOT safe for:**
- **Password storage** — never encode a password as Base64.
- **API keys, tokens, secrets** — never store credentials as Base64.
- **Confidential data transmission** — use TLS + AES-GCM.
- **Any context where confidentiality is required**.

**The right tool for the job:**
| Goal | Use |
|---|---|
| Safe transport of binary data | Base64 |
| Confidentiality of data | AES-GCM, ChaCha20-Poly1305 |
| Integrity verification | SHA-256, HMAC-SHA256 |
| Password storage | Argon2id |
| Digital signatures | ECDSA, Ed25519, RSA-PSS |

Never mix Base64 with any of these — always use the right tool.`,
        keyPoints: [
          '**Zero confidentiality** — decodable by anyone without a key',
          'Caused **real-world breaches** via "hidden" secrets',
          'Safe for **transport** and **non-sensitive encoding**',
          'Unsafe for **passwords, keys, secrets, confidential data**',
          'Never confuse Base64 with encryption',
        ],
        callout: {
          type: 'warning',
          title: 'Never Use Base64 for Confidentiality',
          content: `If you find yourself writing \`btoa(password)\` or storing secrets as Base64, **stop immediately**. Base64 provides zero protection. Use **AES-GCM** or **ChaCha20-Poly1305** for confidentiality, **Argon2id** for password storage, and **TLS** for transport.`,
        },
      },
      {
        id: 'comparison',
        title: 'Base64 vs Other Encodings',
        content: `Base64 is one of several encoding schemes. Here is how they compare:

| Encoding | Alphabet size | Overhead | Use case |
|---|---|---|---|
| **Base64** | 64 chars | 33% | General binary-to-text |
| **Base64URL** | 64 chars | 33% | URL-safe (JWT, query strings) |
| **Base32** | 32 chars | 60% | Case-insensitive, TOTP secrets |
| **Hex (Base16)** | 16 chars | 100% | Byte display, hashes, MAC addresses |
| **ASCII85** | 85 chars | 25% | PostScript, PDF (rare) |
| **Quoted-Printable** | 67 chars | Variable | Email (mostly ASCII) |
| **uuencode** | 64 chars | 33% | Legacy Unix (superseded by Base64) |

**Base64 vs Base32:**
- Base64 is more compact (33% vs 60% overhead).
- Base32 is case-insensitive and easier to read aloud (used for TOTP secrets).
- Base64 uses \`+\` and \`/\` — problematic in URLs.
- Base32 uses only A–Z and 2–7 — URL-safe and human-friendly.

**Base64 vs Hex:**
- Hex is twice as long (100% overhead) but trivially readable.
- Base64 is more compact but harder to eyeball.
- Hex is preferred for cryptographic outputs (hashes, keys, MAC addresses).
- Base64 is preferred for binary payloads (images, files, JWTs).

**Base64 vs encryption:**
- Base64 is **encoding** — reversible by anyone, no key.
- AES-GCM is **encryption** — reversible only with the key.
- These are **fundamentally different operations** with entirely different purposes.

**Practical recommendations:**
- **Email attachments** → Base64 (MIME)
- **JWT tokens** → Base64URL
- **TOTP secrets** → Base32
- **Cryptographic hashes** → Hex
- **Inline images** → Base64 data URI
- **Confidentiality** → AES-GCM or ChaCha20-Poly1305 (never Base64)`,
      },
      {
        id: 'lab',
        title: 'Try It Yourself',
        content: `Use the mini-lab below to encode and decode Base64. Note:
- The **same function** reverses — no key required (unlike encryption).
- Try encoding text with special characters or emoji — Base64 handles any UTF-8.
- Decode a Base64 string you encounter in the wild — it will reveal the underlying data instantly.
- Remember: Base64 is **not encryption**.`,
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You have mastered Base64 — the most widely used encoding scheme in computing, and the most commonly misunderstood.

**Core concepts learned:**
- **Binary-to-text encoding**: 3 bytes → 4 chars
- **33% overhead**: the price of text-safe transport
- **Zero confidentiality**: anyone can decode without a key
- **Real-world use**: email, JWT, data URIs, K8s secrets
- **Not encryption**: never confuse the two

**Next algorithm:** Hex — the universal display format for cryptographic outputs.`,
      },
    ],
    playgroundRoute: '/playground/encrypt?algo=base64',
    defaultDemoKey: '',
    defaultDemoInput: 'ChiperLab — Base64 is NOT encryption!',
    labEnabled: true,
  },

  // ============================================================
  // 13 — HEX / BASE16
  // ============================================================
  {
    id: 'hex',
    name: 'Hexadecimal Encoding',
    category: 'encoding',
    difficulty: 'beginner',
    tagline: 'Base16 representation of bytes — the universal display format',
    description:
      'A base-16 encoding that represents each byte as two hexadecimal characters (0-9, A-F). Universally used to display cryptographic outputs, hashes, MAC addresses, and binary data. Also known as Base16.',
    estimatedMinutes: 6,
    references: [
      {
        title: 'RFC 4648: The Base16, Base32, and Base64 Data Encodings',
        author: 'S. Josefsson',
        year: 2006,
        url: 'https://datatracker.ietf.org/doc/html/rfc4648',
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
        title: 'MDN Web Docs — Number.prototype.toString()',
        author: 'Mozilla',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toString',
        type: 'documentation',
      },
    ],
    keyTakeaways: [
      'Hex represents each byte as **two characters** (0-9, A-F).',
      'It is the **universal display format** for cryptographic outputs.',
      'Output is exactly **2× the input size** — highly readable but space-inefficient.',
      'Not encryption — anyone can decode hex instantly.',
    ],
    sections: [
      {
        id: 'introduction',
        title: 'What is Hexadecimal Encoding?',
        content: `**Hexadecimal** (often shortened to **hex**) is a **base-16** number system that represents each byte of binary data as **two printable characters**. It is the **universal display format** for cryptographic outputs and low-level binary data.

**The 16 symbols of hex:**
- \`0\` through \`9\` — represent values 0 through 9
- \`A\` through \`F\` — represent values 10 through 15

Because **16 = 2⁴**, every hex character encodes exactly **4 bits** — a perfect alignment with the byte structure of modern computers.

**Example:**
- Byte \`0x4A\` (74 in decimal) → \`4A\` in hex
- Byte \`0xFF\` (255 in decimal) → \`FF\` in hex
- The SHA-256 hash of "abc" → 64 hex characters (32 bytes)

**Where hex appears:**
- **SHA-256 hashes** — \`ba7816bf8f01cfea...\`
- **AES keys** — \`a3f5b8c9d1e7f2a4...\`
- **RSA signatures** — long hex strings in JWTs and certificates
- **MAC addresses** — \`00:1A:2B:3C:4D:5E\`
- **Color codes** — \`#FF5733\`
- **Git commit IDs** — \`a591a6d40bf42040...\`
- **Ethereum addresses** — \`0x742d35Cc6634C05329...\`

**Why hex is preferred for cryptographic output:**
- **Compact enough**: 2 chars per byte (vs Base64's ~1.33 chars per byte).
- **Readable**: an experienced developer can visually parse byte boundaries.
- **Byte-aligned**: each byte maps to exactly 2 characters — no padding, no ambiguity.
- **Universal**: every programming language has built-in hex conversion.

**The trade-off:**
Hex is more readable than Base64 but exactly **2× the size** of the original binary. For display purposes, this is a fine trade-off. For transport, Base64 is more efficient.`,
        keyPoints: [
          'Base-16 system: 16 symbols (0-9, A-F)',
          'Each byte → exactly 2 hex characters',
          'The universal display format for cryptographic outputs',
          'Output is 2× the input size — readable but less compact than Base64',
        ],
      },
      {
        id: 'history',
        title: 'Historical Origin',
        content: `Hexadecimal notation has been used in computing since the **earliest days of digital computers**, but its popularity exploded with the rise of byte-addressable architectures in the 1960s.

**Why base-16?**
- **Binary is verbose**: a single byte requires 8 binary digits — hard to read.
- **Decimal is misaligned**: 1 byte = 0–255, which does not map cleanly to decimal digits.
- **Octal (base-8) is convenient**: used in early machines (PDP-8), but 8 does not divide 8 bits cleanly into equal groups.
- **Hex is perfect**: 16 = 2⁴, so 8 bits = exactly 2 hex characters.

**Historical milestones:**
- **1950s**: IBM mainframes use hex for memory dumps and debugging.
- **1964**: IBM System/360 popularizes byte-addressable memory — hex becomes the standard notation.
- **1970s–1980s**: Unix, C, and assembly language documentation adopt hex as the default binary display.
- **1990s–2000s**: Cryptographic standards (NIST, IETF) formalize hex for hash and key display.
- **2006**: RFC 4648 formally defines **Base16** as a name for hex encoding.
- **Today**: Hex is ubiquitous — from HTTP headers to blockchain addresses to CSS colors.

**Why "hexadecimal" not "sexadecimal"?**
The word derives from Greek **hex** (six) and Latin **decem** (ten) — reflecting that 16 = 6 + 10. Early computing literature briefly used "sexadecimal" (from Latin *sedecim*, sixteen), but "hexadecimal" won out.

**The 0x prefix:**
In most programming languages, hex literals are written with a **\`0x\`** prefix:
- \`0xFF\` = 255
- \`0x10\` = 16
- \`0x00\` = 0

This is a **convention**, not part of the encoding. \`0xFF\` and \`FF\` represent the same byte.`,
        keyPoints: [
          'Hex notation dates back to 1950s mainframe debugging',
          'IBM System/360 (1964) popularized byte-aligned hex',
          'RFC 4648 (2006) formally defines Base16',
          'The \`0x\` prefix is a **programming convention**, not part of the encoding',
        ],
      },
      {
        id: 'how-it-works',
        title: 'How It Works',
        content: `Hex encoding is simple and mechanical — each byte is converted to exactly two hex characters.

**Step 1 — Split each byte into two 4-bit nibbles**
For byte \`0x4A\` (74 decimal):
- High nibble: \`0x4\` (4)
- Low nibble: \`0xA\` (10)

**Step 2 — Convert each nibble to a hex character**
- Nibble values 0–9 → characters \`0\`–\`9\`
- Nibble values 10–15 → characters \`A\`–\`F\`

**Step 3 — Concatenate the two characters**

**Full mapping table:**

| Nibble | Hex | Nibble | Hex |
|---|---|---|---|
| 0 | 0 | 8 | 8 |
| 1 | 1 | 9 | 9 |
| 2 | 2 | 10 | A |
| 3 | 3 | 11 | B |
| 4 | 4 | 12 | C |
| 5 | 5 | 13 | D |
| 6 | 6 | 14 | E |
| 7 | 7 | 15 | F |

**Example — encoding the string "Hi":**

Input bytes: \`H\` (0x48) and \`i\` (0x69).

| Char | Decimal | Hex |
|---|---|---|
| H | 72 | 48 |
| i | 105 | 69 |

**Output:** \`"4869"\` (4 characters for 2 bytes)

**Decoding:**
Reverse the process — split the hex string into pairs, convert each pair to a byte value.

**Display conventions:**
- **No separator**: \`4869\`
- **Space-separated**: \`48 69\`
- **Colon-separated** (MAC addresses): \`48:69\`
- **0x-prefixed**: \`0x48 0x69\`
- **Uppercase or lowercase**: \`4869\` = \`4869\` = \`4869\` (case-insensitive)

The choice of separator and case is **cosmetic** — the underlying bytes are identical.`,
        keyPoints: [
          'Each byte → 2 hex characters (high nibble + low nibble)',
          'Nibble values 0-9 → "0"-"9"; values 10-15 → "A"-"F"',
          'Case-insensitive: "4A" = "4a"',
          'Separators (spaces, colons) are cosmetic, not part of encoding',
        ],
        codeSnippet: {
          language: 'typescript',
          code: `// Hex encode/decode in the browser
function hexEncode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexDecode(hex: string): string {
  const clean = hex.replace(/\\s+/g, '');
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.substring(i, i + 2), 16);
  }
  return new TextDecoder().decode(bytes);
}

console.log(hexEncode("Hi"));
// → "4869"

console.log(hexDecode("4869"));
// → "Hi"

console.log(hexEncode("Hello, World!"));
// → "48656c6c6f2c20576f726c6421"`,
          caption: 'Hex encode/decode — each byte becomes 2 hex chars',
        },
      },
      {
        id: 'formula',
        title: 'Mathematical Formulation',
        content: `Hex encoding is a **bijective mapping** between byte values (0–255) and two-character hex strings.

**Encoding — byte b → 2 chars:**

\`\`\`
high_nibble = (b >> 4) & 0x0F      # bits 7..4
low_nibble  = b & 0x0F              # bits 3..0
\`\`\`

Each nibble (0–15) is mapped to a character:
- 0–9 → \`'0'\` through \`'9'\` (ASCII 48–57)
- 10–15 → \`'A'\` through \`'F'\` (ASCII 65–70, or lowercase 97–102)

**Decoding — 2 chars → byte:**

\`\`\`
b = (hex_to_int(c1) << 4) | hex_to_int(c2)
\`\`\`

Where \`hex_to_int\` maps a character back to its numeric value (0–15).

**Size expansion:**
- Input: 1 byte = 8 bits
- Output: 2 chars × 8 bits (ASCII) = 16 bits

Overhead ratio = **16 / 8 = 2.0** → **100% larger**

**Byte alignment:**
Because each byte maps to exactly 2 hex characters, hex output is **always even-length**. This makes hex self-synchronizing: if you lose a character, you know you have lost half a byte.

**Uppercase vs lowercase:**
Both \`4869\` and \`4869\` represent the same bytes. The choice is stylistic:
- **Uppercase** is more common in cryptography (hash outputs).
- **Lowercase** is more common in web contexts (URLs, HTML colors).

**Common conventions:**
- **SHA-256 hash**: \`a591a6d40bf42040...\` (lowercase, no separator)
- **MAC address**: \`00:1A:2B:3C:4D:5E\` (uppercase, colon-separated)
- **HTTP dump**: \`48 65 6c 6c 6f\` (lowercase, space-separated)
- **C/JS literal**: \`0x48, 0x65\` (0x prefix)`,
        keyPoints: [
          'byte → high nibble (bits 7-4) + low nibble (bits 3-0)',
          'nibble 0-9 → chars "0"-"9"; nibble 10-15 → "A"-"F"',
          'Size: exactly **2× the input** (100% overhead)',
          'Hex output is always **even-length**',
        ],
      },
      {
        id: 'example',
        title: 'Worked Example',
        content: `Let us encode the string **"Hi"** in hex.

**Step 1 — Convert each character to ASCII bytes:**

| Char | Decimal | Hex |
|---|---|---|
| H | 72 | 0x48 |
| i | 105 | 0x69 |

**Step 2 — Split each byte into nibbles:**

| Byte | Binary | High Nibble | Low Nibble |
|---|---|---|---|
| 0x48 | \`01001000\` | \`0100\` (4) | \`1000\` (8) |
| 0x69 | \`01101001\` | \`0110\` (6) | \`1001\` (9) |

**Step 3 — Map each nibble to a hex character:**

| Nibble Value | Hex Char |
|---|---|
| 4 | 4 |
| 8 | 8 |
| 6 | 6 |
| 9 | 9 |

**Step 4 — Concatenate:**

**Hex output:** **"4869"**

**Decoding:**
- Pair "48" → byte 0x48 → ASCII 72 → "H"
- Pair "69" → byte 0x69 → ASCII 105 → "i"
- Result: **"Hi"** ✓

**Larger example — encoding "Hello, World!":**

Bytes: \`48 65 6c 6c 6f 2c 20 57 6f 72 6c 64 21\`

**Hex output:** \`48656c6c6f2c20576f726c6421\` (26 hex chars for 13 bytes)`,
        example: `Walkthrough (byte by byte):

Input: "Hi"

'H' = 72 (decimal) = 0x48
  High nibble: 0x4 = '4'
  Low nibble:  0x8 = '8'
  → "48"

'i' = 105 (decimal) = 0x69
  High nibble: 0x6 = '6'
  Low nibble:  0x9 = '9'
  → "69"

Concatenated: "4869"

Verify:
  echo -n "Hi" | xxd -p
  # 4869

  echo "4869" | xxd -r -p
  # Hi`,
      },
      {
        id: 'security',
        title: 'Security Analysis',
        content: `Hex provides **zero cryptographic security**. Like Base64, it is a **display and transport format**, not an encryption scheme.

**The fundamental fact:**
Hex is **fully reversible without any key**. Every programming language has a built-in function (\`parseInt(hex, 16)\`, \`bytes.fromhex()\`, \`xxd -r -p\`) that decodes hex in microseconds.

**Why hex appears in security contexts:**
Hex is used to **display** cryptographic outputs — hashes, keys, signatures. But the security comes from the underlying cryptographic operation (SHA-256, AES, RSA), **not** from the hex encoding itself.

**Example — the two operations are separate:**
\`\`\`
① Compute SHA-256("password")       ← cryptographic operation
   → 32-byte binary digest

② Hex-encode the digest              ← display conversion
   → "5e884898da28047151d0e56f8dc62927..."
\`\`\`

Reversing step ② (decoding the hex) gives you the 32-byte digest back. Reversing step ① is infeasible — that is the cryptographic security.

**Common misconception:**
Seeing a long hex string may feel "secure" because it looks random. But a hexadecimal string of your password is just as exposed as the password itself:

\`\`\`
hex("password") = "70617373776f7264"
\`\`\`

Decoding this is trivial:
\`\`\`
echo "70617373776f7264" | xxd -r -p
# password
\`\`\`

**Where hex is safe and appropriate:**
- Displaying hashes and keys (the underlying crypto provides security).
- Debugging output (memory dumps, packet captures).
- Configuration files (MAC addresses, color codes).
- Any non-confidential data representation.

**Where hex must never be used as "protection":**
- Storing passwords — never.
- Hiding API keys or secrets — never.
- Confidential transport — use TLS + AES-GCM.
- Any context where confidentiality is required.

**The correct mental model:**
Hex is like writing a message in **Morse code** — it changes the presentation but hides nothing from anyone who knows the code. It is not encryption, and it must never be relied upon for confidentiality.`,
        keyPoints: [
          '**Zero confidentiality** — trivially reversible',
          'The security of a hex-encoded hash comes from the **hash**, not the hex',
          'Never store secrets as hex and call it "obfuscation"',
          'Use hex for **display** of cryptographic outputs',
        ],
        callout: {
          type: 'warning',
          title: 'Hex Is Not Encryption',
          content: `Just like Base64, hex provides **no confidentiality**. If you see a hex-encoded password or API key in a configuration file, **assume it is plaintext**. The only safe approach for storing secrets is **encryption with a key** (AES-GCM, ChaCha20-Poly1305) — or better, a proper secrets manager (HashiCorp Vault, AWS Secrets Manager).`,
        },
      },
      {
        id: 'comparison',
        title: 'Hex vs Base64 vs Other Encodings',
        content: `How does hex compare to other encoding schemes?

| Encoding | Symbols | Overhead | Readability | Typical Use |
|---|---|---|---|---|
| **Hex (Base16)** | 16 (0-9, A-F) | 100% | High | Hashes, keys, MAC addresses |
| **Base64** | 64 | 33% | Low | Email, JWT, data URIs |
| **Base32** | 32 (A-Z, 2-7) | 60% | Medium | TOTP secrets |
| **Base64URL** | 64 (URL-safe) | 33% | Low | URLs, JWTs |
| **Binary (bits)** | 2 (0-1) | 700% | Very low | Educational only |
| **Decimal** | 10 (0-9) | 155% | Medium | Rare in crypto |

**When to use hex:**
- **Displaying cryptographic outputs** — hashes, keys, signatures, addresses.
- **Human inspection** — byte-level debugging, memory dumps.
- **Protocol fields** — MAC addresses, IPv6 addresses, UUIDs.
- **Configuration** — color codes, hash fingerprints.

**When to use Base64:**
- **Transporting binary data** — images, PDFs, attachments.
- **Embedding in JSON/XML** — when binary cannot be represented natively.
- **Data URIs** — inline images in HTML/CSS.

**Why hex is preferred for hashes:**
Consider a SHA-256 hash (32 bytes):
- **Hex**: 64 characters — one glance shows byte boundaries.
- **Base64**: 44 characters — more compact, but harder to eyeball.
- **Binary**: 256 characters — unreadable.

Hex wins for cryptographic display because it is **byte-aligned** — every 2 chars = 1 byte, making it easy to compare hashes visually or spot differences.

**Why Base64 is preferred for transport:**
When you are sending 1 GB of binary data (an image, a video), the 33% overhead of Base64 beats the 100% overhead of hex.

**The rule of thumb:**
- **Display** → hex
- **Transport** → Base64
- **Confidentiality** → AES-GCM (neither of the above)`,
      },
      {
        id: 'lab',
        title: 'Try It Yourself',
        content: `Use the mini-lab below to encode and decode hex. Note:
- Every byte becomes **exactly 2 hex characters**.
- The output is **always even-length**.
- Try encoding a long string — you will see the exact 2× size expansion.
- **Hex is not encryption** — the same function reverses without a key.`,
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You have mastered hexadecimal encoding — the universal display format for cryptographic outputs.

**Core concepts learned:**
- **Base-16 system**: 16 symbols (0-9, A-F)
- **Byte-aligned**: 1 byte → 2 hex characters, always
- **100% overhead**: hex output is exactly 2× the input
- **Universal display**: hashes, keys, MAC addresses, git commit IDs
- **Not encryption**: trivially reversible

**Next algorithm:** ROT13 — the self-inverse letter rotation that has a special place in internet culture.`,
      },
    ],
    playgroundRoute: '/playground/encrypt?algo=hex',
    defaultDemoKey: '',
    defaultDemoInput: 'Hello World',
    labEnabled: true,
  },

  // ============================================================
  // 14 — ROT13
  // ============================================================
  {
    id: 'rot13',
    name: 'ROT13',
    category: 'encoding',
    difficulty: 'beginner',
    tagline: 'The self-inverse Caesar shift of 13 — obfuscation, not security',
    description:
      'A special case of the Caesar cipher with shift 13. Because 13 is exactly half of 26, applying ROT13 twice returns the original text — making it perfectly self-inverse. Used for hiding spoilers and puzzle answers, not for security.',
    estimatedMinutes: 6,
    references: [
      {
        title: 'The Code Book: The Science of Secrecy from Ancient Egypt to Quantum Cryptography',
        author: 'S. Singh',
        year: 1999,
        url: 'https://simonsingh.net/books/the-code-book/',
        type: 'book',
      },
      {
        title: 'RFC 4648: The Base16, Base32, and Base64 Data Encodings (mentions ROT13 as historical)',
        author: 'S. Josefsson',
        year: 2006,
        url: 'https://datatracker.ietf.org/doc/html/rfc4648',
        type: 'standard',
      },
      {
        title: 'ROT13 — Wikipedia',
        author: 'Wikipedia Contributors',
        url: 'https://en.wikipedia.org/wiki/ROT13',
        type: 'documentation',
      },
    ],
    keyTakeaways: [
      'ROT13 is a **Caesar cipher with shift 13** — the exact middle of the alphabet.',
      'It is **self-inverse**: ROT13(ROT13(x)) = x.',
      'It is **not encryption** — it provides zero confidentiality.',
      'Used for hiding **spoilers, punchlines, and puzzle answers**.',
    ],
    sections: [
      {
        id: 'introduction',
        title: 'What is ROT13?',
        content: `**ROT13** ("rotate by 13 places") is a **letter substitution** where each letter is shifted by exactly 13 positions in the alphabet. Because the Latin alphabet has 26 letters and 13 is **exactly half**, ROT13 is its own inverse:

**ROT13(ROT13(x)) = x**

Applying ROT13 **twice** returns the original message — no separate decryption step.

**How it looks:**
- Input: \`"Hello"\`
- Output: \`"Uryyb"\`
- ROT13 again: \`"Hello"\` ✓

**The mapping:**
- A ↔ N
- B ↔ O
- C ↔ P
- ...and so on, with M ↔ Z

**Why it exists:**
ROT13 originated in **Usenet newsgroups** (early 1980s) to hide:
- **Spoilers** (movie endings, book plot twists)
- **Punchlines** (jokes that depend on the surprise)
- **Puzzle answers** (so solvers do not spoil it for others)
- **Offensive content** (letting readers choose to reveal it)

**Why it is grouped with encoding, not cipher:**
- **No key** — the transformation is completely fixed.
- **No security** — anyone can decode it.
- **Involutory** — like Base64 and Atbash, encryption = decryption.

ROT13 is technically a **Caesar cipher with shift 13**, but because it has **no key** and is used for **obfuscation rather than secrecy**, it is best understood as a **fixed substitution encoding**.

**Where ROT13 appears today:**
- **Reddit** — spoiler tags often mention "ROT13 to reveal."
- **Stack Exchange** — sometimes used in "spoiler" hints.
- **Programming tutorials** — a classic example of string manipulation.
- **Puzzles and CTFs** — a common first challenge.

**Important:** ROT13 is **not encryption**. It provides **zero confidentiality** and must never be used to protect real data.`,
        keyPoints: [
          'Caesar cipher with fixed shift 13 — the exact alphabet midpoint',
          'Self-inverse: ROT13(ROT13(x)) = x',
          'No key, no security — purely obfuscation',
          'Used for spoilers, puzzle hints, and puzzle answers',
        ],
        callout: {
          type: 'info',
          title: 'Why Group ROT13 with Encoding?',
          content: `ROT13 is technically a cipher (a Caesar variant), but we group it under **encoding** because it has **no key** and provides **zero confidentiality** — the two defining characteristics of encoding schemes. Like Base64 and Atbash, ROT13 is **self-inverse** and serves a purpose other than secrecy: hiding text from casual readers.`,
        },
      },
      {
        id: 'history',
        title: 'Historical Origin',
        content: `ROT13 emerged not from military or cryptographic necessity, but from **internet culture** — specifically the Usenet newsgroups of the early 1980s.

**The Usenet era (1980–1990):**
Usenet was a distributed discussion system where users posted messages to topic-based newsgroups. Two problems emerged:
1. **Spoilers**: users posting movie endings or book twists would ruin the experience for others.
2. **Offensive content**: jokes and discussions could offend readers who did not expect them.

**The solution — ROT13:**
Someone proposed using **Caesar shift 13** as a voluntary obfuscation:
- Text is easy to decode if you want to read it.
- Text is easy to **not** decode if you do not want spoilers.
- The transformation requires no tool — you can do it mentally with practice.

**First appearances:**
- **1982**: ROT13 appears in Usenet discussions.
- **1983**: Formalized in the *ROT13* entry of the *Jargon File* (a glossary of hacker slang).
- **1980s–1990s**: Becomes standard in Usenet, IRC, and early web forums.
- **2000s–present**: Continues in modern platforms (Reddit, Stack Exchange, puzzle communities).

**The Jargon File definition:**
The Jargon File (also known as the Hacker's Dictionary) defines ROT13 as:
> *"A simple letter substitution cipher that is trivially breakable; used on Usenet to prevent inadvertent reading of material that could be considered offensive (e.g., offensive jokes or puzzles)."*

**Why 13 specifically?**
Because 13 = 26 / 2, ROT13 is **self-inverse** — a feature that makes it uniquely suited for voluntary obfuscation. If you can encrypt, you can decrypt with the **same operation**. No key, no tool, no separate direction to remember.

**Cultural persistence:**
ROT13 has outlived the technology that created it (Usenet). It remains in use today as:
- A cultural reference to early internet culture.
- A puzzle mechanism in capture-the-flag (CTF) challenges.
- A teaching example for beginner programmers.

**Legacy:**
ROT13 is a perfect example of a **non-cryptographic use of a cryptographic primitive**. The Caesar cipher provides zero security — but that was never the goal. The goal was **voluntary obfuscation**, and ROT13 achieves it perfectly.`,
        keyPoints: [
          'Originated on **Usenet** in the early 1980s',
          'Formalized in the **Jargon File** (1983)',
          '13 chosen because 26/2 = 13 → self-inverse',
          'Still used for spoilers, puzzles, and teaching',
        ],
      },
      {
        id: 'how-it-works',
        title: 'How It Works',
        content: `ROT13 is the **simplest possible cipher** — a Caesar shift with one fixed value (13). Because 13 is exactly half the alphabet, the transformation has some elegant properties.

**The mapping:**

| Plain | A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Cipher | N | O | P | Q | R | S | T | U | V | W | X | Y | Z |

| Plain | N | O | P | Q | R | S | T | U | V | W | X | Y | Z |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Cipher | A | B | C | D | E | F | G | H | I | J | K | L | M |

Notice: **A ↔ N**, **B ↔ O**, ..., **M ↔ Z**. The mapping is symmetric.

**Step 1 — For each letter, add 13 to its position**
For a letter with alphabet position P (A=0, ..., Z=25):

**C = (P + 13) mod 26**

**Step 2 — Preserve non-alphabetic characters**
Digits, spaces, and punctuation are left unchanged.

**Step 3 — Preserve case**
Uppercase stays uppercase, lowercase stays lowercase. Both are shifted within their respective ranges.

**Step 4 — Decryption is identical**
Because 13 + 13 = 26 = alphabet length, applying ROT13 twice returns the original:

**ROT13(ROT13(P)) = (P + 13 + 13) mod 26 = (P + 26) mod 26 = P**

This is the **involution** property — the same operation both encrypts and decrypts.

**Worked example:**
Encrypting "HELLO":
- H (7) + 13 = 20 → U
- E (4) + 13 = 17 → R
- L (11) + 13 = 24 → Y
- L (11) + 13 = 24 → Y
- O (14) + 13 = 27 mod 26 = 1 → B

Result: **"URYYB"**

Applying ROT13 again:
- U (20) + 13 = 33 mod 26 = 7 → H
- R (17) + 13 = 30 mod 26 = 4 → E
- Y (24) + 13 = 37 mod 26 = 11 → L
- Y (24) + 13 = 37 mod 26 = 11 → L
- B (1) + 13 = 14 → O

Result: **"HELLO"** ✓`,
        keyPoints: [
          'Formula: C = (P + 13) mod 26',
          'Self-inverse: applying twice returns the original',
          'Non-alphabetic characters preserved',
          'Case preserved within each letter range',
        ],
        codeSnippet: {
          language: 'typescript',
          code: `// ROT13 — the same function encrypts and decrypts
function rot13(text: string): string {
  return text
    .split('')
    .map(ch => {
      const code = ch.charCodeAt(0);
      // Uppercase A-Z
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + 13) % 26) + 65);
      }
      // Lowercase a-z
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + 13) % 26) + 97);
      }
      return ch;
    })
    .join('');
}

console.log(rot13("Hello, World!"));
// → "Uryyb, Jbeyq!"

console.log(rot13("Uryyb, Jbeyq!"));
// → "Hello, World!" (same function!)

// ROT13 is its own inverse:
console.log(rot13(rot13("anything")) === "anything");
// → true`,
          caption: 'ROT13: one function, both directions',
        },
      },
      {
        id: 'formula',
        title: 'Mathematical Formulation',
        content: `ROT13 is a special case of the **Caesar cipher** with shift **k = 13**.

**Encoding formula (identical to decryption):**

**C = (P + 13) mod 26**

**Self-inverse proof:**

Applying ROT13 twice:

**ROT13(ROT13(P)) = ((P + 13) + 13) mod 26**
**= (P + 26) mod 26**
**= P mod 26**
**= P**

Because **26 mod 26 = 0**, adding 26 leaves the value unchanged. This is why ROT13 is **its own inverse** — the defining property of an **involution**.

**Comparison with other involutions:**

| Construction | Formula | Type |
|---|---|---|
| **ROT13** | E(x) = (x + 13) mod 26 | Shift involution |
| **Atbash** | E(x) = 25 − x | Mirror involution |
| **XOR** | E(x) = x ⊕ k | Bitwise involution |
| **Feistel round** | (L, R) → (R, L ⊕ f(R)) | Network involution |

**Why involutions are elegant:**
- **Single implementation**: one function, one code path.
- **No key state**: no direction flag to track.
- **Symmetric protocols**: both parties use identical logic.
- **Easier to reason about**: formal verification is simpler.

**Extension — ROT-N:**
The general "rotate by N" scheme for any N is:
**C = (P + N) mod 26**

For most N, applying twice does not return the original — you would need to apply (26 − N) to decrypt. ROT13 is the **unique** rotation that is self-inverse (because 2 × 13 = 26).

**Similar schemes for other alphabets:**
- **ROT5**: digits 0-9 shifted by 5 (used by some obfuscators)
- **ROT18**: combined ROT13 (letters) + ROT5 (digits)
- **ROT47**: ASCII printable range rotation (94 characters)`,
        keyPoints: [
          'Formula: C = (P + 13) mod 26 — same for both directions',
          'Self-inverse because 2 × 13 = 26',
          'Unique: ROT13 is the only self-inverse alphabetic rotation',
          'Generalizations: ROT5 (digits), ROT18 (letters+digits), ROT47 (ASCII)',
        ],
      },
      {
        id: 'example',
        title: 'Worked Example',
        content: `Let us apply ROT13 to the phrase **"Why did the chicken cross the road?"**

**Step 1 — Process each letter:**

| Original | Position | +13 | Mod 26 | Cipher |
|---|---|---|---|---|
| W | 22 | 35 | 9 | J |
| h | 7 | 20 | 20 | u |
| y | 24 | 37 | 11 | l |
| (space) | — | — | — | (space) |
| d | 3 | 16 | 16 | q |
| i | 8 | 21 | 21 | v |
| d | 3 | 16 | 16 | q |
| ... | ... | ... | ... | ... |

**Continue processing:**

- "the" → "gur"
- "chicken" → "puvpxra"
- "cross" → "pebff"
- "the" → "gur"
- "road" → "ebnq"

**Full ROT13 output:**
**"Jul qvq gur puvpxra pebff gur ebnq?"**

**Verify by applying ROT13 again:**
- "Jul" → "Why" ✓
- "qvq" → "did" ✓
- "gur" → "the" ✓
- "puvpxra" → "chicken" ✓
- "pebff" → "cross" ✓
- "gur" → "the" ✓
- "ebnq" → "road" ✓

**Full recovered output:**
**"Why did the chicken cross the road?"** ✓

**Notice:**
- **Uppercase preserved**: W → J (both uppercase)
- **Lowercase preserved**: h → u (both lowercase)
- **Punctuation preserved**: ? stays ?
- **Spaces preserved**: spaces stay spaces

This is the classic ROT13 use case — hiding a punchline from readers who do not want spoilers.`,
        example: `Walkthrough (character by character):

Original: "Hello"
→ ROT13:  "Uryyb"

'H' (7)  + 13 = 20 → 'U'
'e' (4)  + 13 = 17 → 'r'
'l' (11) + 13 = 24 → 'y'
'l' (11) + 13 = 24 → 'y'
'o' (14) + 13 = 27 → 1 → 'b'

Apply ROT13 again to "Uryyb":
'U' (20) + 13 = 33 → 7 → 'H'
'r' (17) + 13 = 30 → 4 → 'e'
'y' (24) + 13 = 37 → 11 → 'l'
'y' (24) + 13 = 37 → 11 → 'l'
'b' (1)  + 13 = 14 → 'o'

Result: "Hello" ✓`,
      },
      {
        id: 'security',
        title: 'Security Analysis',
        content: `ROT13 provides **zero cryptographic security**. It is not designed to protect data — only to **obfuscate** it from casual readers.

**The fundamental fact:**
ROT13 has **no keyspace**. There is nothing to brute-force because there is nothing secret. Anyone who knows the algorithm can decode ROT13 in their head with practice.

**Comparison with Caesar cipher:**

| Aspect | Caesar | ROT13 |
|---|---|---|
| Keyspace | 25 shifts | **1** (fixed shift) |
| Key required | Yes (the shift) | **No** |
| Self-inverse | No | **Yes** |
| Purpose | Military obfuscation | Content obfuscation |
| Security | Zero | Zero |

ROT13 is not "weaker than Caesar" — it is **differently purposed**. Caesar used a **variable** shift to protect military dispatches. ROT13 uses a **fixed** shift to hide spoilers. Different goals, different designs.

**Real-world incident — Stack Exchange and Reddit:**
Spoiler-hiding communities (movies, books, TV shows) rely on ROT13 to hide plot twists. If someone were to post a solution without obfuscation, they would violate community norms. ROT13 is a **social convention** — its value is not cryptographic but cultural.

**Where ROT13 is fine:**
- **Spoiler text**: hiding a movie ending from readers.
- **Puzzle hints**: a solver can choose to reveal.
- **Teaching cryptography**: a simple example of an involution.
- **Casual obfuscation**: hiding a joke's punchline.

**Where ROT13 must never be used:**
- **Protecting secrets**: API keys, passwords, tokens.
- **Confidential transport**: use TLS + AES-GCM.
- **Any context requiring real confidentiality**: use proper encryption.
- **Data at rest**: use AES-GCM with a proper key.

**The critical distinction — obfuscation vs security:**
- **Obfuscation** (ROT13, Base64): makes data less obvious to a casual observer.
- **Security** (AES, ChaCha20): makes data computationally inaccessible without a key.

Confusing the two is a **common and dangerous mistake**. If you see ROT13 or Base64 in a security-critical context, treat it as **plaintext** — because for a determined attacker, it is.`,
        keyPoints: [
          '**Zero keyspace**: no secrets to protect',
          'Provides **obfuscation**, not security',
          'Legitimate use: spoilers, puzzle hints, teaching',
          'Never use for secrets, passwords, or real confidentiality',
        ],
        callout: {
          type: 'warning',
          title: 'Obfuscation ≠ Security',
          content: `ROT13, Base64, and other "encoding" schemes make data look scrambled — but any attacker can reverse them in seconds. If you see ROT13 or Base64 in a security-critical context (password storage, API keys, confidential data), assume it is **plaintext**. Use **AES-GCM** or **ChaCha20-Poly1305** for real confidentiality.`,
        },
      },
      {
        id: 'comparison',
        title: 'ROT13 vs Other Self-Inverse Operations',
        content: `ROT13 belongs to a family of **involutory operations** — functions that are their own inverse. Here is how they compare:

| Operation | Domain | Formula | Self-inverse? |
|---|---|---|---|
| **ROT13** | Letters A-Z | (x + 13) mod 26 | Yes |
| **Atbash** | Letters A-Z | 25 − x | Yes |
| **XOR** | Any bytes | x ⊕ k | Yes |
| **Feistel round** | Bit blocks | (L, R) → (R, L ⊕ f(R)) | Yes |
| **Caesar (general)** | Letters | (x + k) mod 26 | Only if k = 13 |
| **AES encryption** | 128-bit blocks | Multiple rounds | No (AES ≠ AES⁻¹) |

**Why involutions matter:**
- **Elegant code**: one function does both jobs.
- **Fewer bugs**: no asymmetric encrypt/decrypt code to keep in sync.
- **Protocol simplicity**: both sides use identical logic.

**ROT13 vs Atbash:**
Both are involutions on the Latin alphabet, but they use different symmetries:
- **ROT13**: **rotation** — moves letters by a fixed offset.
- **Atbash**: **reflection** — mirrors letters around the alphabet midpoint.

Both have **no key** and provide **zero confidentiality**. The choice between them is a matter of style, not security.

**ROT13 vs XOR:**
XOR is also an involution, but operates on **bytes** rather than letters. This makes XOR far more versatile:
- Handles any binary data (images, files, protocols).
- Foundation of stream ciphers (ChaCha20, AES-CTR).
- Can achieve information-theoretic security (One-Time Pad).

ROT13, by contrast, is limited to the Latin alphabet.

**ROT13 vs Feistel round:**
The Feistel round is an involution on **bit blocks** (typically 32 or 64 bits). It is the foundation of DES, Blowfish, and other block ciphers. A full cipher applies multiple Feistel rounds — each round is an involution, but the sequence is not.

**The design lesson:**
Involutions are a **building block**, not a complete cipher. ROT13 uses a single involution — trivially breakable. Modern ciphers use **rounds of involutions combined with key mixing** — creating security from simple primitives.`,
      },
      {
        id: 'lab',
        title: 'Try It Yourself',
        content: `Use the mini-lab below to experiment with ROT13. Note:
- The **encrypt** and **decrypt** buttons perform the **same operation** (involution).
- Uppercase stays uppercase, lowercase stays lowercase.
- Non-alphabetic characters are preserved.
- **ROT13 is not encryption** — do not use it to protect real data.`,
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `You have mastered ROT13 — the self-inverse letter rotation that has a special place in internet culture.

**Core concepts learned:**
- **Caesar shift 13**: fixed, self-inverse
- **Involution**: ROT13(ROT13(x)) = x
- **No key**: provides zero confidentiality
- **Cultural use**: spoilers, puzzle hints, teaching
- **Obfuscation ≠ security**: ROT13 is not encryption

**The lesson:**
Not every transformation needs to be security. ROT13 fills a legitimate niche — voluntary obfuscation — with elegance and simplicity. But it must never be confused with encryption. Use the right tool for the right purpose.

**You have now completed the full algorithm catalog** — 14 algorithms across 4 categories: classical, modern, hashing, and encoding.`,
      },
    ],
    playgroundRoute: '/playground/encrypt?algo=rot13',
    defaultDemoKey: '',
    defaultDemoInput: 'Why did the chicken cross the road?',
    labEnabled: true,
  },
];