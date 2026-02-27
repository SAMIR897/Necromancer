const fs = require('fs');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const anchor = require('@coral-xyz/anchor');
const fetch = require('node-fetch');
const idl = require('./necromancer.json');

// --- Settings ---
const RPC_ENDPOINT = 'https://api.devnet.solana.com';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Mock proposal data for the hackathon MVP
const MOCK_PROPOSALS = [
    { id: 41, text: "Increase Validator Subsidies by 5% to secure the network." },
    { id: 42, text: "Spend $1.5M of treasury funds on a Superbowl advertisement." },
];

async function main() {
    console.log('💀 Necromancer Node Starting...');

    // 1. Load the User's CLI Wallet (which acts as the AI Agent's burner wallet for now)
    const secretKeyString = fs.readFileSync('/Users/elliot/.config/solana/id.json', 'utf8');
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    const agentKeypair = Keypair.fromSecretKey(secretKey);

    // 2. Connect to Solana
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');
    const wallet = new anchor.Wallet(agentKeypair);
    const provider = new anchor.AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' });

    // 3. Initialize Anchor Program
    const programId = new PublicKey(idl.address);
    const program = new anchor.Program(idl, provider);

    console.log(`📡 Connected to Devnet Program: ${programId.toBase58()}`);
    console.log(`🤖 Agent Wallet: ${agentKeypair.publicKey.toBase58()}`);

    if (!OPENAI_API_KEY) {
        console.warn('⚠️ No OPENAI_API_KEY found in environment. Using mock AI responses.');
    }

    // 4. In a real app, we'd fetch all active Vaults assigned to this Agent.
    // We'll hardcode the prompt string for this demo script to simulate evaluating a Vault.
    const userPrompt = "Always vote to maximize my treasury yield, vote NO on any token unlocks, and ignore marketing proposals.";

    console.log('\n--- Evaluating Active Proposals ---');
    for (const proposal of MOCK_PROPOSALS) {
        console.log(`\nEvaluating Proposal #${proposal.id}: "${proposal.text}"`);
        console.log(`User Prompt: "${userPrompt}"`);

        // 5. Ask OpenAI
        let voteDecision = false;

        if (OPENAI_API_KEY) {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{
                        role: "system",
                        content: `You are an AI delegate evaluating a DAO proposal on behalf of a user. The user's instructions: "${userPrompt}". 
            Based ONLY on their instructions, should you vote YES or NO on this proposal: "${proposal.text}"?
            Reply with exactly one word: either YES or NO.`
                    }],
                    temperature: 0.1,
                    max_tokens: 5,
                })
            });

            const data = await response.json();
            const answer = data.choices[0].message.content.trim().toUpperCase();
            console.log(`🧠 AI Decision: ${answer}`);
            voteDecision = answer.includes('YES');

        } else {
            // Mock logic if no API key
            voteDecision = proposal.id === 41;
            console.log(`🧠 Mock AI Decision: ${voteDecision ? 'YES' : 'NO'}`);
        }

        // 6. Push Vote to Smart Contract
        console.log(`⚡ Pushing vote to Solana...`);

        try {
            // Find the Vault PDA and VoteRecord PDA for the user's wallet
            const [vaultPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault"), agentKeypair.publicKey.toBuffer()], // For MVP, we pretend the agent is the user
                program.programId
            );

            // Convert proposal_id (u64) to buffer 
            const proposalBuffer = Buffer.alloc(8);
            proposalBuffer.writeBigUInt64LE(BigInt(proposal.id));

            const [voteRecordPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("vote"), vaultPda.toBuffer(), proposalBuffer],
                program.programId
            );

            // Build Transaction
            const tx = await program.methods
                .castVote(new anchor.BN(proposal.id), voteDecision)
                .accounts({
                    vault: vaultPda,
                    agent: agentKeypair.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                    voteRecord: voteRecordPda
                })
                .rpc();

            console.log(`✅ Success! Tx Hash: ${tx}`);
        } catch (e) {
            console.log(`❌ Failed to push tx: ${e.message}`);
            // Usually fails because we haven't actually run the InitializeVault instruction 
            // on this specific wallet yet in our local testing.
        }
    }
}

main().catch(console.error);
