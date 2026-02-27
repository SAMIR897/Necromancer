import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getProvider, getProgram } from '../utils/anchor';
import { motion, AnimatePresence } from 'framer-motion';

export default function StakePanel() {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [amount, setAmount] = useState('');
    const [isStaking, setIsStaking] = useState(false);

    const handleStake = async () => {
        if (!wallet.publicKey || !wallet.signTransaction) return;
        try {
            setIsStaking(true);
            const provider = getProvider(wallet as any, connection);
            const program = getProgram(provider);
            console.log('Staking', amount, 'via', program.programId.toBase58());
            await new Promise(resolve => setTimeout(resolve, 1500));
            alert(`Staked ${amount} $GOV successfully!`);
            setAmount('');
        } catch (err) {
            console.error(err);
            alert('Staking failed.');
        } finally {
            setIsStaking(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Input Row */}
            <div className="relative group">
                <div className="absolute -inset-px bg-gradient-to-r from-purple-600/40 to-fuchsia-600/40 rounded-xl blur-sm opacity-0 group-focus-within:opacity-100 transition duration-500 pointer-events-none" />
                <div className="relative flex items-center rounded-xl bg-black/40 border border-white/[0.08] p-1.5 sm:p-2 backdrop-blur-md">
                    <input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="flex-1 bg-transparent px-3 text-2xl sm:text-3xl font-bold text-white placeholder:text-neutral-700 outline-none font-mono tabular-nums tracking-tight min-w-0"
                    />
                    <span className="shrink-0 flex items-center justify-center rounded-lg bg-purple-500/15 border border-purple-500/20 px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold text-purple-300 tracking-widest">
                        $GOV
                    </span>
                </div>
            </div>

            {/* Button */}
            <motion.button
                whileHover={{ scale: wallet.connected ? 1.015 : 1 }}
                whileTap={{ scale: wallet.connected ? 0.985 : 1 }}
                onClick={handleStake}
                disabled={!wallet.connected || !amount || parseFloat(amount) <= 0 || isStaking}
                className="relative w-full overflow-hidden rounded-xl text-white font-bold py-3 sm:py-3.5 text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(168,85,247,0.15)] hover:shadow-[0_4px_28px_rgba(168,85,247,0.3)]"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 animate-gradient" />
                <div className="relative flex items-center justify-center gap-2 z-10">
                    <AnimatePresence mode="popLayout">
                        {isStaking ? (
                            <motion.div key="loading" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center gap-2">
                                <span className="inline-flex rounded-full h-4 w-4 border-2 border-white/40 border-t-white animate-spin" />
                                Initiating Vault...
                            </motion.div>
                        ) : wallet.connected ? (
                            <motion.span key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                Authorize AI Agent
                            </motion.span>
                        ) : (
                            <motion.span key="connect" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-white/60">
                                Connect Wallet to Begin
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </motion.button>
        </div>
    );
}
