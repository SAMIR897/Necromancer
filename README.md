# 🪦 Necromancer: Realms Governance

**Resurrect Your Realms DAO.**

Necromancer is an AI-delegated DAO governance plugin on Solana that lets users stake tokens and deploy personalized autonomous AI agents to vote on Realms proposals — eliminating voter apathy with zero-cost, high-frequency, intelligent governance.

*Built for the [Graveyard Hackathon](https://x.com/graveyard_hack) on Solana Devnet.*

![UI Preview](./frontend/src/imagesource/wmremove-transformed.png)

## 🏆 The Problem: The Governance Graveyard
Most DAOs on Solana—including those managed by Realms—suffer from chronic "voter apathy." Proposals fail to reach quorum not because the ideas are bad, but because token holders don't have the time to read, evaluate, and manually sign transactions for every single proposal.

Treasuries sit idle. Protocols stagnate. The DAO becomes a graveyard.

## ⚡ The Solution: AI-Delegated Autonomy
Necromancer introduces a fundamentally new primitive to Solana Governance: **AI Delegation**.

Instead of voting manually or blindly delegating tokens to an overloaded human representative, users stake their governance tokens into a Necromancer Vault PDA and **train a personalized AI agent** with natural language.

### How it Works:
1. **Stake to Vault:** Users deposit their Realms `$GOV` tokens into the Necromancer PDA.
2. **Train the Agent:** Users write a natural language prompt defining their voting logic (e.g., *"Always vote to maximize treasury yield. Vote NO on token unlocks. Ignore marketing."*).
3. **High-Frequency Autonomy:** An off-chain AI node listens to the Realms program for new proposals. It evaluates the proposal against the user's logic, reaches a decision, and automatically builds, signs, and submits the `cast_vote` transaction on their behalf.

### Protocol Benefits:
- **Zero Voter Apathy:** Proposals immediately reach quorum as AI agents vote instantly upon proposal creation.
- **Gasless for Users:** The off-chain relayer node pays the transaction fees; the user simply stakes and forgets.
- **Granular Control:** Unlike traditional delegation where a human might vote against your interests, your AI agent follows your exact philosophical instructions 100% of the time.

## 🏗 Architecture

Necromancer bridges Solana's high-throughput execution with off-chain LLM inference:

1. **Frontend (`/frontend`)**: A React + Vite + Tailwind interface. It provides a stunning, graveyard-themed dashboard where users connect their Phantom wallet, stake tokens, and deploy their AI configuration.
2. **On-Chain Vault (Anchor)**: A Solana program holding the deposited governance tokens via PDAs. It grants Voting Authority to the off-chain agent's keypair while retaining Withdrawal Authority solely for the original human depositor.
3. **Off-Chain Relayer (`/agent`)**: A Node.js listener utilizing `@solana/web3.js` to monitor the Realms contract. It intercepts new proposals, queries OpenAI to evaluate the text against the Vault's instructions, and fires a signed transaction back to the chain.

## 🚀 Running Locally

### Prerequisites
- Node.js & npm
- Solana Toolchain (`solana-cli`)
- Anchor Framework
- A Phantom Wallet extension

### Start the Frontend
The frontend features a fully responsive, custom-themed UI.

```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5175` to view the dashboard.

### On-Chain Deployment (Devnet)
*Ensure your Solana CLI is configured to `devnet`.*

```bash
# Build the Anchor program
anchor build

# Deploy to Devnet
anchor deploy
```

## 📜 Hackathon Track
Targeting the **Realms Governance Builders Track**. We believe automated, intent-based voting via AI delegation is the immediate future of decentralized coordination on Solana.
