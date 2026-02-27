# 🪦 Necromancer: Realms Governance

**Resurrect Your Realms DAO.**

Necromancer is an AI-delegated DAO governance plugin on Solana that lets users stake tokens and deploy personalized autonomous AI agents to vote on Realms proposals — eliminating voter apathy with zero-cost, high-frequency, intelligent governance.

*Built for the [Graveyard Hackathon](https://x.com/graveyard_hack) on Solana Devnet.*

---

![Necromancer Splash Screen](./frontend/assets_image_music/wmremove-transformed%281%29.png)

---

## 🏆 The Problem: The Governance Graveyard

Most DAOs on Solana — including those managed by Realms — suffer from chronic **voter apathy**. Proposals fail to reach quorum not because the ideas are bad, but because token holders don't have the time to read, evaluate, and manually sign every proposal.

> Treasuries sit idle. Protocols stagnate. The DAO becomes a graveyard.

---

## ⚡ The Solution: AI-Delegated Autonomy

Necromancer introduces a fundamentally new primitive to Solana Governance: **AI Delegation**.

Instead of voting manually or blindly delegating to an overloaded human representative, users stake their governance tokens into a **Necromancer Vault PDA** and train a personalized AI agent with natural language instructions.

### How It Works

| Step | Action | Description |
|------|--------|-------------|
| 1️⃣ | **Stake to Vault** | Deposit `$GOV` tokens into the Necromancer PDA |
| 2️⃣ | **Train the Agent** | Write natural language voting logic (e.g. *"Always vote to maximize treasury yield. Vote NO on token unlocks."*) |
| 3️⃣ | **Full Autonomy** | The off-chain AI node listens for new proposals, evaluates them, and auto-submits `cast_vote` on your behalf |

### Protocol Benefits

- 🧠 **Zero Voter Apathy** — Proposals reach quorum the instant they're created
- ⛽ **Gasless for Users** — The relayer node pays transaction fees; users just stake and forget
- 🎯 **Granular Control** — Your AI follows *your exact* philosophical instructions, 100% of the time
- ⚡ **Solana Native** — Sub-second finality, Realms-compatible, built on Anchor

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Necromancer Stack                       │
├──────────────────┬──────────────────┬───────────────────────┤
│  Frontend        │  On-Chain Vault  │  Off-Chain Relayer    │
│  React + Vite    │  Anchor / Solana │  Node.js + OpenAI     │
│  Tailwind CSS    │  PDA Governance  │  @solana/web3.js      │
│  Framer Motion   │  Realms Plugin   │  Auto cast_vote       │
└──────────────────┴──────────────────┴───────────────────────┘
```

1. **Frontend (`/frontend`)** — Graveyard-themed React dashboard. Users connect Phantom, stake tokens, and configure their AI agent's voting logic.
2. **On-Chain Vault (`/contracts`)** — Anchor program that holds deposited governance tokens via PDAs. Grants Voting Authority to the off-chain agent while keeping Withdrawal Authority solely with the depositor.
3. **Off-Chain Relayer (`/offchain`)** — Node.js listener that monitors the Realms contract. On each new proposal, it queries the OpenAI API with the user's vault instructions, receives a YES/NO decision, and fires a signed transaction back to the chain.

---

## 🚀 Deployment

### ▲ Vercel (Recommended — for everyone)

Connect your GitHub repo to [vercel.com](https://vercel.com), set **Root Directory** to `frontend/`, and click Deploy. Vercel auto-detects Vite and gives you a public URL anyone can visit — no local setup needed.

---

### 💻 Local Development

> **Note:** This section is for **contributors only**. Regular users should visit the live Vercel URL instead.

**Prerequisites**
- Node.js & npm
- Solana Toolchain (`solana-cli`)
- Anchor Framework
- Phantom Wallet browser extension

**Start the Frontend**

```bash
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:5175` on your own machine only.

**On-Chain Deployment (Devnet)**

```bash
solana config set --url devnet
anchor build
anchor deploy
```

**Run the Off-Chain Agent**

```bash
cd offchain
npm install
# Set OPENAI_API_KEY and VAULT_KEYPAIR in .env
node index.js
```

---

## 📁 Project Structure

```
Necromancer/
├── frontend/          # React + Vite dApp UI
│   ├── src/
│   │   ├── App.tsx        # Main application
│   │   ├── components/    # StakePanel, AgentConfig, AgentTerminal
│   │   └── imagesource/   # Background assets
│   └── assets_image_music/ # Logo assets & background music
├── contracts/         # Anchor smart contracts (Solana)
├── offchain/          # Node.js AI voting agent
└── README.md
```

---

## 📜 Hackathon Track

Targeting the **Realms Governance Builders Track** at the Graveyard Hackathon.

We believe automated, intent-based voting via AI delegation is the **immediate future of decentralized coordination** on Solana. Necromancer is the proof of concept.

---

<div align="center">

**Built with 💜 and a little dark magic 🪄**

*Solana · Anchor · OpenAI · Realms*

</div>
