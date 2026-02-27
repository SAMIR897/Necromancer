const fs = require('fs');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const anchor = require('@coral-xyz/anchor');
const idl = require('./necromancer.json');

const RPC_ENDPOINT = 'https://api.devnet.solana.com';

async function main() {
    console.log('💀 Initializing Vault on Devnet...');

    const secretKeyString = fs.readFileSync('/Users/elliot/.config/solana/id.json', 'utf8');
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    const userKeypair = Keypair.fromSecretKey(secretKey);

    const connection = new Connection(RPC_ENDPOINT, 'confirmed');
    const wallet = new anchor.Wallet(userKeypair);
    const provider = new anchor.AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' });

    const programId = new PublicKey(idl.address);
    const program = new anchor.Program(idl, provider);

    const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), userKeypair.publicKey.toBuffer()],
        program.programId
    );

    console.log(`Vault PDA: ${vaultPda.toBase58()}`);

    try {
        const tx = await program.methods
            .initializeVault(
                userKeypair.publicKey, // We'll set the agent to be our own wallet for this test
                "Always vote YES on profit, NO on everything else."
            )
            .accounts({
                vault: vaultPda,
                user: userKeypair.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();

        console.log(`✅ Vault Initialized! Tx Hash: ${tx}`);
    } catch (e) {
        console.error(`❌ Failed:`, e);
    }
}

main().catch(console.error);
