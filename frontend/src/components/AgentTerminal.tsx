import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Log = {
    id: string;
    source: 'system' | 'ai' | 'tx';
    message: string;
    ts: Date;
};

const TAG_COLORS: Record<string, { text: string; border: string; bg: string }> = {
    system: { text: 'text-blue-300', border: 'border-blue-500/30', bg: 'bg-blue-500/10' },
    ai: { text: 'text-fuchsia-300', border: 'border-fuchsia-500/30', bg: 'bg-fuchsia-500/10' },
    tx: { text: 'text-emerald-300', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
};

const LINE_COLORS: Record<string, string> = {
    system: 'text-blue-200/70 border-blue-500/25',
    ai: 'text-fuchsia-200/80 border-fuchsia-500/40',
    tx: 'text-emerald-200/80 border-emerald-500/40',
};

export default function AgentTerminal() {
    const [logs, setLogs] = useState<Log[]>([
        { id: '1', source: 'system', message: 'Initializing Necromancer Node v1.0.0...', ts: new Date() },
        { id: '2', source: 'system', message: 'Connecting to Solana Devnet RPC...', ts: new Date() },
        { id: '3', source: 'system', message: 'Awaiting Vault Delegation...', ts: new Date() },
    ]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [logs]);

    useEffect(() => {
        const steps: { source: Log['source']; message: string }[] = [
            { source: 'system', message: 'Proposal #41: "Increase Validator Subsidies by 5%" detected.' },
            { source: 'ai', message: 'Parsing against vault instructions...' },
            { source: 'ai', message: '→ Match: "Maximize yield" — Confidence: 94.2%' },
            { source: 'ai', message: '→ Decision: YES' },
            { source: 'tx', message: 'Building cast_vote(41, true)...' },
            { source: 'tx', message: 'Signing with Vault Authority...' },
            { source: 'tx', message: '✓ 26jxRuTUB... Confirmed @ slot 312_049_817' },
            { source: 'ai', message: 'Governance deployed.' },
            { source: 'system', message: 'Returning to listen state...' },
        ];

        let delay = 3500;
        const timers: ReturnType<typeof setTimeout>[] = [];
        steps.forEach((s, i) => {
            timers.push(
                setTimeout(() => {
                    setLogs(prev => [...prev, { id: `${Date.now()}-${i}`, source: s.source, message: s.message, ts: new Date() }]);
                }, delay)
            );
            delay += 700 + Math.random() * 1000;
        });
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-y-auto p-3 sm:p-4 font-mono text-[11px] sm:text-xs leading-relaxed custom-scrollbar">
            <AnimatePresence initial={false}>
                {logs.map((log) => {
                    const tag = TAG_COLORS[log.source];
                    const line = LINE_COLORS[log.source];
                    return (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            className="mb-3 group"
                        >
                            <div className="flex items-center gap-1.5 mb-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                <span className="text-neutral-600 text-[9px] tracking-wider font-sans font-medium">
                                    {log.ts.toLocaleTimeString([], { hour12: false })}
                                </span>
                                <span className={`text-[8px] font-bold uppercase tracking-[0.1em] px-1.5 py-px rounded border ${tag.text} ${tag.border} ${tag.bg}`}>
                                    {log.source}
                                </span>
                            </div>
                            <p className={`pl-2 border-l-2 py-px ${line} break-all`}>
                                {log.message}
                            </p>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
            <div className="h-4" />
        </div>
    );
}
