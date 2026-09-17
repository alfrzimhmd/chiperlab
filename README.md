# ChiperLab — Interactive Cryptography Learning Platform

<div align="center">

![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge\&logo=tailwindcss\&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.18-CA4245?style=for-the-badge\&logo=react-router\&logoColor=white)
![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-0.546-4A90D9?style=for-the-badge\&logo=lucide\&logoColor=white)
![Web Crypto](https://img.shields.io/badge/Web_Crypto_API-Native-4A90D9?style=for-the-badge\&logo=letsencrypt\&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-24-339933?style=for-the-badge\&logo=node.js\&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge\&logo=git\&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge\&logo=github\&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Deployed-222222?style=for-the-badge\&logo=githubpages\&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

<br />

**An interactive, hands-on cryptography learning platform for exploring classical ciphers, modern encryption, cryptographic hashing, and cryptanalysis techniques.**

[🌐 Live Demo](https://alfrzimhmd.github.io/chiperlab/)

</div>

---

## 📖 Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Technologies Used](#technologies-used)
* [Installation](#installation)
* [Project Structure](#project-structure)
* [Key Features](#key-features)
* [Learning Path](#learning-path)
* [Security Notice](#security-notice)
* [Contact](#contact)
* [License](#license)
* [Acknowledgments](#acknowledgments)

---

## 🔐 Overview

**ChiperLab** is an educational cryptography platform that transforms abstract cryptographic theory into practical intuition.

The platform bridges the gap between simply knowing what AES is and understanding important cryptographic concepts such as why improper AES-GCM nonce reuse can compromise security.

ChiperLab provides a structured curriculum ranging from classical ciphers to modern authenticated encryption, combined with an interactive playground where learners can encrypt, decrypt, hash, and analyze messages in real time.

All cryptographic operations are performed directly in the browser using the native **Web Crypto API** where applicable.

### Key Highlights

* **12 structured fundamental lessons** covering core security concepts
* **8 algorithm deep dives** with mathematical formulas and historical context
* **Interactive playground** for Caesar, Atbash, Vigenère, XOR, AES-GCM, RSA-OAEP, SHA-256, and SHA-512
* **Step-by-step visualizer** showing character-by-character transformation traces
* **Cryptanalysis lab** with frequency analysis and Caesar brute-force
* **Gamified progression** with XP, achievements, and a 7-level learning roadmap

---

## ✨ Features

| Feature                    | Description                                                                |
| -------------------------- | -------------------------------------------------------------------------- |
| **Structured Curriculum**  | 12 fundamental lessons organized from foundations → mechanisms → security  |
| **Algorithm Catalog**      | Deep dives into classical and modern cryptographic algorithms              |
| **Interactive Playground** | Real-time encryption and decryption with key configuration and live output |
| **Step Visualizer**        | Character-by-character transformation traces for classical ciphers         |
| **Hash Generator**         | Live SHA-256 / SHA-512 digest computation with latency measurement         |
| **Avalanche Effect Lab**   | Side-by-side hash comparison highlighting bit-flip percentage              |
| **Cryptanalysis Tools**    | Character frequency analysis and Caesar brute-force                        |
| **Crypto Puzzles**         | 6 decryption challenges covering multiple cipher concepts                  |
| **Interactive Quiz**       | 10 multiple-choice questions covering cryptography topics                  |
| **Attack Simulations**     | Brute-force, frequency analysis, and Two-Time Pad XOR reuse demonstrations |
| **Progress Tracking**      | XP system, 8 unlockable achievements, and 5 rank tiers                     |
| **7-Level Roadmap**        | Guided learning path from fundamentals to cryptanalysis                    |
| **Dark/Light Theme**       | System preference detection with smooth theme transitions                  |
| **100% Client-Side**       | Cryptographic operations run directly in the browser                       |
| **Fully Responsive**       | Optimized for desktop, tablet, and mobile devices                          |

---

## 🛠️ Technologies Used

### Frontend

![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge\&logo=tailwindcss\&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.18-CA4245?style=for-the-badge\&logo=react-router\&logoColor=white)
![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-0.546-4A90D9?style=for-the-badge\&logo=lucide\&logoColor=white)
![Canvas Confetti](https://img.shields.io/badge/Canvas_Confetti-1.9-FF6B6B?style=for-the-badge\&logo=canvas\&logoColor=white)

### Cryptography Stack

| Layer          | Technology                      | Purpose                                      |
| -------------- | ------------------------------- | -------------------------------------------- |
| **Symmetric**  | AES-GCM (256-bit)               | Authenticated encryption via `crypto.subtle` |
| **Asymmetric** | RSA-OAEP (2048-bit)             | Public-key encryption with SHA-256 padding   |
| **Hashing**    | SHA-256, SHA-512                | One-way cryptographic digests                |
| **Classical**  | Caesar, Atbash, Vigenère, XOR   | Pure TypeScript implementations              |
| **Analysis**   | Frequency Analysis, Brute-force | Cryptanalysis algorithms                     |

### Tools & Services

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge\&logo=git\&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge\&logo=github\&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI/CD-2088FF?style=for-the-badge\&logo=githubactions\&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-24-339933?style=for-the-badge\&logo=node.js\&logoColor=white)
![Google Fonts](https://img.shields.io/badge/Google_Fonts-4285F4?style=for-the-badge\&logo=googlefonts\&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-Editor-007ACC?style=for-the-badge\&logo=visualstudiocode\&logoColor=white)

---

## 🚀 Installation

### Prerequisites

Make sure you have the following installed:

* **Node.js** version 20 or later
* **npm**, **Yarn**, or **Bun**

### Clone the Repository

```bash
git clone https://github.com/alfrzimhmd/chiperlab.git
cd chiperlab
```

### Install Dependencies

```bash
npm install

# or
yarn install

# or
bun install
```

### Start the Development Server

```bash
npm run dev

# or
yarn dev

# or
bun run dev
```

The application will be available at:

```text
http://localhost:5173
```

### Build for Production

```bash
npm run build

# or
yarn build

# or
bun run build
```

### Preview Production Build

```bash
npm run preview

# or
yarn preview

# or
bun run preview
```

The production preview will be available at:

```text
http://localhost:4173/chiperlab/
```

---

## 📁 Project Structure

```text
chiperlab/
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── src/
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── AchievementModal.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── ScrollToTop.tsx
│   │   │   ├── SecurityNotice.tsx
│   │   │   └── ThemeToggle.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   │
│   │   ├── learning/
│   │   │   ├── AlgorithmCard.tsx
│   │   │   └── LessonCard.tsx
│   │   │
│   │   └── playground/
│   │       ├── FrequencyChart.tsx
│   │       └── StepVisualizer.tsx
│   │
│   ├── context/
│   │   └── ProgressContext.tsx
│   │
│   ├── crypto/
│   │   ├── analysis/
│   │   │   ├── caesarBruteForce.ts
│   │   │   └── frequency.ts
│   │   │
│   │   ├── classical/
│   │   │   ├── atbash.ts
│   │   │   ├── caesar.ts
│   │   │   ├── vigenere.ts
│   │   │   └── xor.ts
│   │   │
│   │   └── webcrypto/
│   │       ├── aes.ts
│   │       ├── hash.ts
│   │       └── rsa.ts
│   │
│   ├── data/
│   │   ├── achievements.ts
│   │   ├── algorithms.ts
│   │   ├── challenges.ts
│   │   ├── lessons.ts
│   │   └── roadmap.ts
│   │
│   ├── hooks/
│   │   ├── useProgress.ts
│   │   └── useTheme.ts
│   │
│   ├── pages/
│   │   ├── challenges/
│   │   │   ├── AttackSimPage.tsx
│   │   │   ├── ChallengesIndex.tsx
│   │   │   ├── PuzzlePage.tsx
│   │   │   └── QuizPage.tsx
│   │   │
│   │   ├── learn/
│   │   │   ├── AlgorithmDetail.tsx
│   │   │   ├── AlgorithmsList.tsx
│   │   │   ├── FundamentalsList.tsx
│   │   │   ├── LearnIndex.tsx
│   │   │   ├── LessonDetail.tsx
│   │   │   └── RoadmapPage.tsx
│   │   │
│   │   ├── playground/
│   │   │   ├── AnalyzePlayground.tsx
│   │   │   ├── EncryptPlayground.tsx
│   │   │   ├── HashPlayground.tsx
│   │   │   └── PlaygroundIndex.tsx
│   │   │
│   │   ├── Dashboard.tsx
│   │   └── ProgressPage.tsx
│   │
│   ├── types/
│   │   ├── challenge.ts
│   │   ├── crypto.ts
│   │   ├── lesson.ts
│   │   └── progress.ts
│   │
│   ├── utils/
│   │   └── storage.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── LICENSE
```

---

# 🎓 Key Features

## 📚 Learning Academy

ChiperLab contains **12 fundamental lessons** covering a beginner-to-intermediate cryptography journey:

1. **What is Cryptography?** — History, CIA Triad, and core objectives
2. **Plaintext & Ciphertext** — Entropy and information states
3. **Encryption & Decryption** — Kerckhoffs's Principle and Shannon's Maxim
4. **Encoding vs Encryption** — Why Base64 is NOT encryption
5. **Symmetric Cryptography** — AES, block vs stream ciphers, and key distribution
6. **Asymmetric Cryptography** — RSA, trapdoor functions, and hybrid encryption
7. **Hashing & Avalanche Effect** — One-way digests and collision resistance
8. **Digital Signatures** — Signing, verification, and non-repudiation
9. **Cryptographic Keys & Entropy** — Keyspace and CSPRNG
10. **IV & Nonce** — Why nonce reuse is catastrophic
11. **Authentication & HMAC** — AEAD and integrity verification
12. **CIA Triad Synthesis** — Mapping cryptographic tools to security pillars

### Each Lesson Includes

* Structured sections with key points
* Real-world examples and code snippets
* Interactive checkpoint exercises
* XP rewards of **30–45 XP** per lesson

---

## 🔬 Algorithm Deep Dives

ChiperLab includes **8 algorithm deep dives** with detailed explanations.

| Algorithm       | Category  | Difficulty   | Playground |
| --------------- | --------- | ------------ | ---------- |
| Caesar Cipher   | Classical | Beginner     | ✅          |
| Atbash Cipher   | Classical | Beginner     | ✅          |
| Vigenère Cipher | Classical | Intermediate | ✅          |
| XOR Cipher      | Classical | Beginner     | ✅          |
| AES-GCM         | Modern    | Advanced     | ✅          |
| RSA-OAEP        | Modern    | Advanced     | ✅          |
| SHA-256         | Hashing   | Intermediate | ✅          |
| SHA-512         | Hashing   | Intermediate | ✅          |

### Each Algorithm Entry Includes

* Historical context and origin
* Mathematical formulation
* Encryption and decryption formulas
* Step-by-step walkthrough examples
* Security analysis
* Known vulnerabilities

---

## 🎮 Interactive Playground

ChiperLab provides specialized playgrounds for experimenting with cryptographic concepts directly in the browser.

### 1. Encryption & Decryption Playground

Supported algorithms:

* **Caesar Cipher**

  * Shift slider from 1–25
* **Atbash Cipher**

  * No key required
* **Vigenère Cipher**

  * Keyword input
* **XOR Cipher**

  * Key string with hexadecimal output
* **AES-GCM**

  * 128/256-bit key generation
* **RSA-OAEP**

  * 2048-bit keypair generation

Additional functionality:

* **Step Visualizer** for classical ciphers
* Live latency measurement
* Real-time encryption/decryption output

### 2. Hash Generator & Avalanche Lab

* Real-time **SHA-256 / SHA-512** computation
* Byte-accurate digest display
* **Avalanche Effect comparison**
* Side-by-side hexadecimal difference
* Bit-flip percentage metrics

### 3. Cryptanalysis Lab

* **Character Frequency Analysis**

  * Compare character distribution against an English benchmark
* **Caesar Brute-Force**

  * Test all 25 possible shifts
* Copy-to-clipboard support for candidate results

---

## 🧩 Challenges & Gamification

### Quiz

**10 multiple-choice questions** covering the cryptography topics presented throughout the platform.

### Puzzles

**6 decryption challenges** covering:

* Caesar
* Atbash
* Vigenère
* Base64
* XOR
* SHA-256

### Attack Simulations

**3 interactive simulations:**

1. Caesar brute-force
2. Frequency analysis
3. Two-Time Pad XOR reuse

---

## 🏆 Progress System

ChiperLab includes a gamified progression system designed to encourage continuous learning.

### XP System

Users can earn XP through:

* Lessons: **30–45 XP**
* Algorithms: **15 XP**
* Challenges: **50–80 XP**

### Achievements

There are **8 unlockable achievements**:

1. First Steps
2. Crypto Explorer
3. Puzzle Solver
4. Hash Master
5. Cipher Breaker
6. Top Marks
7. Modern Cryptographer
8. Academy Grandmaster

### Rank Tiers

The platform contains **5 rank tiers**:

```text
Initiate Apprentice
        ↓
Academy Scholar
        ↓
Cipher Specialist
        ↓
Security Cryptanalyst
        ↓
Grandmaster Cryptographer
```

---

## 🗺️ 7-Level Learning Roadmap

The recommended learning progression consists of seven levels:

| Level  | Topic                     | Duration |     XP |
| ------ | ------------------------- | -------: | -----: |
| **01** | Cryptography Fundamentals |  30 mins |  90 XP |
| **02** | Classical Ciphers         |  45 mins | 120 XP |
| **03** | Symmetric Cryptography    |  40 mins | 140 XP |
| **04** | Asymmetric Cryptography   |  50 mins | 160 XP |
| **05** | Cryptographic Hashing     |  35 mins | 120 XP |
| **06** | Digital Signatures        |  40 mins | 140 XP |
| **07** | Cryptanalysis Basics      |  60 mins | 200 XP |

---

## 🎨 User Experience

ChiperLab focuses on an interactive and accessible learning experience.

* **Dark/Light Theme**

  * Includes system preference detection
* **Confetti Animation**

  * Triggered when achievements are unlocked
* **Keyboard Support**

  * `Enter` to submit
  * `Escape` to close modals
* **100% Client-Side**

  * No backend required
  * Cryptographic operations run in the browser
* **Progress Persistence**

  * XP and achievements are stored using `localStorage`
* **Responsive Design**

  * Supports desktop, tablet, and mobile devices

---

# 📚 Learning Path

The recommended learning flow is:

```text
┌─────────────────────────────────────────────────────────────┐
│                    RECOMMENDED FLOW                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Dashboard                                               │
│     See overall progress and recommended next steps         │
│                                                             │
│  2. Learn → Fundamentals                                    │
│     Complete the 12 core lessons                            │
│                                                             │
│  3. Learn → Algorithms                                      │
│     Deep dive into each cryptographic algorithm             │
│                                                             │
│  4. Playground                                              │
│     Experiment with real cryptographic operations           │
│                                                             │
│  5. Challenges                                              │
│     Test your knowledge with quizzes and puzzles            │
│                                                             │
│  6. Progress                                                │
│     Review XP and unlocked achievements                     │
│                                                             │
│  7. Roadmap                                                 │
│     Follow the structured 7-level learning path             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# ⚠️ Security Notice

> **Educational Use Only**
>
> ChiperLab is designed for **learning and experimentation**. All computations execute locally in your browser memory.
>
> The classical ciphers, including Caesar, Atbash, Vigenère, and simple XOR, are strictly educational and **should never be used to protect sensitive real-world applications or production secrets**.
>
> Modern algorithms such as AES-GCM, RSA-OAEP, and SHA-256/512 are implemented using the native Web Crypto API. However, this playground is **not a substitute for properly audited cryptographic libraries in production systems**.
>
> **Never use this playground to protect real-world confidential passwords, private keys, or production data.**

---

# 📬 Contact

<div align="center">

[![Email](https://img.shields.io/badge/Email-mhmdalfrzi.03%40gmail.com-D14836?style=for-the-badge\&logo=gmail\&logoColor=white)](mailto:mhmdalfrzi.03@gmail.com)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge\&logo=linkedin\&logoColor=white)](https://www.linkedin.com/)

[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge\&logo=github\&logoColor=white)](https://github.com/alfrzimhmd)

[![WhatsApp](https://img.shields.io/badge/WhatsApp-Contact-25D366?style=for-the-badge\&logo=whatsapp\&logoColor=white)](https://wa.me/)

</div>

---

# 📄 License

This project is licensed under the **MIT License**.

See the [`LICENSE`](LICENSE) file for more information.

---

# 🙏 Acknowledgments

ChiperLab was built using the following technologies and resources:

* [React](https://react.dev/)
* [TypeScript](https://www.typescriptlang.org/)
* [Vite](https://vite.dev/)
* [Tailwind CSS](https://tailwindcss.com/)
* [React Router](https://reactrouter.com/)
* [Lucide Icons](https://lucide.dev/)
* [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
* [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
* [Node.js](https://nodejs.org/)
* [GitHub Actions](https://github.com/features/actions)

Special thanks to the cryptography community and the many open educational resources that inspired this platform.

---

<div align="center">

### ⭐ If you find ChiperLab useful for your cryptography learning journey, consider giving the repository a star!

<br />

**Built with 💙 by Muhammad Alfarizi**

*Understand. Experiment. Solve.*

</div>
