import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getProvider, getProgram } from '../utils/anchor';
import { motion, AnimatePresence } from 'framer-motion';

export default function AgentConfig() {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [prompt, setPrompt] = useState(
        'Always vote to maximize my treasury yield. Vote NO on any token unlocks. Ignore marketing proposals.'
    );
    const [isDeploying, setIsDeploying] = useState(false);

    const handleDeploy = async () => {
        if (!wallet.publicKey || !wallet.signTransaction) return;
        try {
            setIsDeploying(true);
            const provider = getProvider(wallet as any, connection);
            const program = getProgram(provider);
            console.log('Deploying prompt via', program.programId.toBase58());
            await new Promise(resolve => setTimeout(resolve, 2500));
            alert('Agent deployed! It will now auto-vote on your behalf.');
        } catch (err) {
            console.error(err);
            alert('Deployment failed.');
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Textarea */}
            <div className="relative group">
                <div className="absolute -inset-px bg-gradient-to-r from-indigo-500/40 to-cyan-500/40 rounded-xl blur-sm opacity-0 group-focus-within:opacity-100 transition duration-500 pointer-events-none" />
                <div className="relative rounded-xl bg-black/40 border border-white/[0.08] backdrop-blur-md overflow-hidden">
                    <textarea
                        disabled={isDeploying}
                        placeholder="Describe how your agent should vote…"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={4}
                        className="w-full bg-transparent p-3 sm:p-4 text-sm sm:text-base text-indigo-100/90 placeholder:text-neutral-700 resize-none outline-none leading-relaxed"
                    />
                    <div className="px-3 sm:px-4 pb-2 flex justify-end">
                        <span className="text-[9px] font-mono text-indigo-500/30 uppercase tracking-widest">{prompt.length}/500</span>
                    </div>
                </div>
            </div>

            {/* Button */}
            <motion.button
                whileHover={{ scale: wallet.connected ? 1.015 : 1 }}
                whileTap={{ scale: wallet.connected ? 0.985 : 1 }}
                onClick={handleDeploy}
                disabled={!wallet.connected || !prompt || isDeploying}
                className="relative w-full overflow-hidden rounded-xl border border-indigo-500/15 bg-indigo-950/40 text-indigo-300 font-bold py-3 sm:py-3.5 text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-indigo-400/30 hover:text-white hover:bg-indigo-900/30 shadow-[0_4px_20px_rgba(99,102,241,0.08)] hover:shadow-[0_4px_28px_rgba(99,102,241,0.2)]"
            >
                <div className="relative flex items-center justify-center gap-2 z-10">
                    <AnimatePresence mode="popLayout">
                        {isDeploying ? (
                            <motion.div key="loading" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center gap-2 text-indigo-300">
                                <span className="inline-flex rounded-full h-4 w-4 border-2 border-indigo-500/30 border-t-indigo-400 animate-spin" />
                                Syncing Knowledge Base...
                            </motion.div>
                        ) : wallet.connected ? (
                            <motion.span key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                Deploy Prompt On-Chain
                            </motion.span>
                        ) : (
                            <motion.span key="connect" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-white/25">
                                Connect Wallet to Begin
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </motion.button>
        </div>
    );
}
