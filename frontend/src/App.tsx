import { useMemo, useState, useRef, useEffect } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { motion, AnimatePresence } from 'framer-motion';
import '@solana/wallet-adapter-react-ui/styles.css';

import StakePanel from './components/StakePanel';
import AgentConfig from './components/AgentConfig';
import AgentTerminal from './components/AgentTerminal';

// Assets
import graveyardBg from './imagesource/wmremove-transformed.png';
import loadingLogo from '../assets_image_music/wmremove-transformed(1).png';
import navbarLogo from '../assets_image_music/logo_nav.png';
import bgMusic1 from '../assets_image_music/Echoes_of_the_Silent_Bell.mp3';
import bgMusic2 from '../assets_image_music/Midnight_Bell_Lament.mp3';

import './App.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { delay: 0.1 + i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const tracks = useMemo(() => [bgMusic1, bgMusic2], []);

  useEffect(() => {
    // Attempt to autoplay audio immediately on mount — no click needed
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => { });
    }
  }, [currentTrackIndex]);

  // Fallback: on first user interaction anywhere, ensure audio is playing
  useEffect(() => {
    const startAudio = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.4;
        audioRef.current.play().catch(() => { });
      }
      document.removeEventListener('click', startAudio);
      document.removeEventListener('keydown', startAudio);
      document.removeEventListener('touchstart', startAudio);
    };
    document.addEventListener('click', startAudio);
    document.addEventListener('keydown', startAudio);
    document.addEventListener('touchstart', startAudio);
    return () => {
      document.removeEventListener('click', startAudio);
      document.removeEventListener('keydown', startAudio);
      document.removeEventListener('touchstart', startAudio);
    };
  }, []);

  const handleTrackEnd = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const handleEnter = () => {
    setHasEntered(true);
    // Also ensure audio is playing (in case browser blocked the initial autoplay)
    if (audioRef.current) {
      audioRef.current.play().catch(() => { });
    }
  };

  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {/* Hidden Background Audio - Dual Track Playlist */}
          <audio
            ref={audioRef}
            src={tracks[currentTrackIndex]}
            onEnded={handleTrackEnd}
            autoPlay
          />

          <AnimatePresence mode="wait">
            {!hasEntered ? (
              /* ─── SPLASH / LOADING SCREEN ─── */
              <motion.div
                key="splash"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 1, ease: 'easeInOut' } }}
                className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050308]"
              >
                <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                  <img src={graveyardBg} alt="" className="w-full h-full object-cover object-center blur-sm" />
                  <div className="absolute inset-0 bg-[#050308]/60" />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <motion.img
                    src={loadingLogo}
                    alt="Necromancer Logo"
                    className="w-[400px] sm:w-[600px] md:w-[800px] max-w-[90vw] mb-12 drop-shadow-[0_0_48px_rgba(168,85,247,0.4)]"
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                  <motion.button
                    onClick={handleEnter}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    // @ts-ignore
                    className="group relative px-12 py-5 rounded-full overflow-hidden bg-purple-900/40 border border-purple-500/30 text-purple-100 font-bold tracking-[0.25em] text-sm sm:text-base uppercase hover:bg-purple-800/60 hover:border-purple-400/50 hover:shadow-[0_0_32px_rgba(168,85,247,0.5)] transition-all duration-500 backdrop-blur-md"
                  >
                    <span className="relative z-10 flex items-center gap-4">
                      Enter Graveyard
                    </span>
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              /* ─── MAIN APP ─── */
              <motion.div
                key="app"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="min-h-screen relative font-sans text-neutral-100 selection:bg-purple-500/30 flex flex-col bg-[#08060e]"
              >

                {/* ─── FULL-SCREEN GRAVEYARD BACKGROUND ─── */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                  <img src={graveyardBg} alt="" className="w-full h-full object-cover object-center" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#08060e]/75 to-[#08060e]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08060e] via-transparent to-transparent" style={{ top: '35%' }} />
                </div>

                {/* ─── FLOATING PARTICLES ─── */}
                <div aria-hidden className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -25, 0], opacity: [0.15, 0.4, 0.15] }}
                      transition={{ duration: 6 + i * 2, repeat: Infinity, delay: i * 1.2, ease: 'easeInOut' }}
                      className="absolute rounded-full bg-purple-400/25 blur-sm"
                      style={{ width: 3 + i * 2, height: 3 + i * 2, left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
                    />
                  ))}
                </div>

                {/* ─── NAV ─── */}
                <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#08060e]/50 backdrop-blur-xl">
                  <nav className="mx-auto flex h-14 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex items-center cursor-default pt-2">
                      {/* Navbar Logo */}
                      <img src={navbarLogo} alt="Necromancer" className="h-10 sm:h-12 w-auto object-contain" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                      <WalletMultiButton />
                    </motion.div>
                  </nav>
                </header>

                {/* ─── MAIN CONTENT ─── */}
                {/* Flex-grow takes remaining height, center items horizontally, margin-top pushes heroin safely past header */}
                <main className="relative z-10 w-full flex-grow flex flex-col items-center px-4 sm:px-6 pb-32">
                  <div className="w-full max-w-4xl flex flex-col items-center mt-12 sm:mt-16 lg:mt-20 gap-10">

                    {/* ═══ HERO ═══ */}
                    <div className="w-full text-center">
                      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
                        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-purple-500/10 px-3 py-1 text-[10px] sm:text-[11px] font-semibold text-purple-300 tracking-[0.12em] uppercase mb-4 backdrop-blur-md">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-60" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-400 glow-dot" />
                          </span>
                          Graveyard Hackathon — Live on Devnet
                        </div>
                      </motion.div>

                      <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1} className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black tracking-tight leading-[1.1] mb-4 whitespace-nowrap overflow-hidden text-ellipsis">
                        <span className="text-white">Resurrect Your </span>
                        <span className="bg-gradient-to-r from-purple-300 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">Realms DAO</span>
                      </motion.h1>

                      <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} className="text-sm sm:text-base text-neutral-400 leading-relaxed px-2">
                        A smart-contract plugin for <span className="text-purple-300 font-medium">Realms</span> that delegates governance to a personalized AI agent. Zero voter apathy. Full autonomy.
                      </motion.p>

                      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2.5} className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 mt-5 text-[11px] sm:text-xs font-medium text-neutral-500">
                        <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-500 glow-dot" /> High-Frequency Voting</span>
                        <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-500 glow-dot" /> Gasless for Users</span>
                        <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-500 glow-dot" /> AI-Powered Decisions</span>
                      </motion.div>
                    </div>

                    {/* ═══ FORM CARDS ═══ */}
                    <div className="w-full flex flex-col gap-5">
                      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
                        className="rounded-xl bg-[#0e0b18]/70 backdrop-blur-xl border border-white/[0.06] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-purple-500/15 transition-colors duration-500 overflow-hidden"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 text-purple-400 text-xs font-bold border border-purple-500/20">1</div>
                          <h2 className="text-base font-bold text-white tracking-tight">Stake to Realms Vault</h2>
                        </div>
                        <p className="text-neutral-500 text-xs mb-4 ml-10 leading-relaxed">Deposit governance tokens into the PDA to activate AI voting power.</p>
                        <StakePanel />
                      </motion.div>

                      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
                        className="rounded-xl bg-[#0e0b18]/70 backdrop-blur-xl border border-white/[0.06] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-indigo-500/15 transition-colors duration-500 overflow-hidden"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400 text-xs font-bold border border-indigo-500/20">2</div>
                          <h2 className="text-base font-bold text-white tracking-tight">Train Your Agent</h2>
                        </div>
                        <p className="text-neutral-500 text-xs mb-4 ml-10 leading-relaxed">Write the logic your AI will use to evaluate DAO proposals.</p>
                        <AgentConfig />
                      </motion.div>
                    </div>

                    {/* ═══ TERMINAL: Absolutely Positioned Lower Right ═══ */}
                    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
                      className="mt-12 lg:mt-0 lg:fixed lg:bottom-6 lg:right-2 xl:bottom-8 xl:right-4 z-30 w-full lg:w-[340px] xl:w-[380px] shrink-0 pointer-events-auto"
                    >
                      <div className="border border-white/[0.08] bg-[#0a0814]/80 backdrop-blur-3xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.8)] flex flex-col h-[400px] lg:h-[460px] xl:h-[500px]">

                        {/* Terminal Title Bar */}
                        <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#0c0918]/90 px-3 py-2.5 shrink-0">
                          <div className="flex items-center gap-1.5">
                            <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                            <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                            <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                          </div>
                          <span className="font-mono text-[9px] text-neutral-600 tracking-widest uppercase truncate mx-2">necromancer_agent</span>
                          <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/15 shrink-0">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 glow-dot" />
                            <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest">Live</span>
                          </div>
                        </div>

                        {/* Terminal Content */}
                        <div className="flex-1 relative overflow-hidden">
                          <div className="absolute top-0 inset-x-0 h-6 bg-gradient-to-b from-[#0a0814] to-transparent z-10 pointer-events-none" />
                          <AgentTerminal />
                          <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[#0a0814] to-transparent z-10 pointer-events-none" />
                        </div>
                      </div>
                    </motion.div>

                  </div>
                </main>
              </motion.div>
            )}
          </AnimatePresence>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
