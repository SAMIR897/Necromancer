import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import idl from './necromancer.json';

export const PROGRAM_ID = new PublicKey(idl.address);

export function getProvider(wallet: any, connection: Connection) {
    const provider = new anchor.AnchorProvider(
        connection,
        wallet,
        { preflightCommitment: 'confirmed' }
    );
    return provider;
}

export function getProgram(provider: anchor.AnchorProvider) {
    return new anchor.Program(idl as anchor.Idl, provider);
}
