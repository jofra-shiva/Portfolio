"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuroraCanvas from './AuroraCanvas';

interface LandingGateProps { onEnter: () => void; }

// Kali Linux Dragon SVG logo
const KaliDragonLarge = () => (
  <svg width="90" height="90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dragonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#367bf0"/>
        <stop offset="100%" stopColor="#1a4fa8"/>
      </linearGradient>
      <filter id="dragonGlow">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Dragon body */}
    <path d="M50 4 C28 4 8 22 8 48 C8 70 24 86 46 94 L50 98 L54 94 C76 86 92 70 92 48 C92 22 72 4 50 4Z" fill="url(#dragonGrad)" filter="url(#dragonGlow)" opacity="0.95"/>
    {/* Inner shadow */}
    <path d="M50 8 C32 18 16 34 18 52 C20 68 32 82 50 90 C68 82 80 68 82 52 C84 34 68 18 50 8Z" fill="#1a5cc4" opacity="0.5"/>
    {/* Dragon lightning bolt */}
    <path d="M42 28 L36 50 L44 48 L39 72 L56 44 L47 46 Z" fill="white" opacity="0.98" filter="url(#dragonGlow)"/>
    {/* Second bolt */}
    <path d="M56 25 L62 47 L54 45 L60 70 L44 42 L52 44 Z" fill="#00d4ff" opacity="0.9"/>
  </svg>
);

// Kali-style terminal typing animation
function TerminalPrompt() {
  const lines = [
    { prompt: 'kali@portfolio', cmd: ':~$ uname -a' },
    { prompt: '', cmd: 'Linux portfolio 6.1.0-kali9-amd64' },
    { prompt: 'kali@portfolio', cmd: ':~$ ./portfolio --launch' },
  ];
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= lines.length) return;
    const t = setTimeout(() => setVisible(v => v + 1), visible === 0 ? 600 : 900);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <div style={{
      fontFamily: "'Hack','JetBrains Mono','Courier New',monospace",
      fontSize: '0.72rem', lineHeight: 1.8,
      color: 'rgba(200,220,255,0.7)', textAlign: 'left',
      background: 'rgba(0,0,0,0.4)', borderRadius: 8,
      padding: '0.75rem 1rem', width: '100%',
      border: '1px solid rgba(0,212,255,0.1)',
    }}>
      {lines.slice(0, visible).map((line, i) => (
        <div key={i}>
          {line.prompt && <span style={{ color: '#00ff88', fontWeight: 700 }}>{line.prompt}</span>}
          <span style={{ color: line.prompt ? '#00d4ff' : '#e2e8f0' }}>{line.cmd}</span>
        </div>
      ))}
      {visible < lines.length && (
        <span style={{ display: 'inline-block', width: 8, height: '1em', background: '#00d4ff', animation: 'blink 1s step-end infinite', verticalAlign: 'text-bottom' }} />
      )}
    </div>
  );
}

export default function LandingGate({ onEnter }: LandingGateProps) {
  const [hovering, setHovering] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; dur: number; delay: number }[]>([]);

  useEffect(() => {
    // Kali colors: blues, cyans — fewer particles for performance
    const arr = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      dur: Math.random() * 10 + 8,
      delay: Math.random() * 6,
    }));
    setParticles(arr);
  }, []);

  return (
    <motion.div
      className="landing-gate"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.5 }}
    >
      {/* Aurora background */}
      <div className="landing-gate__aurora"><AuroraCanvas /></div>

      {/* Floating binary/hex particles — Kali style */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {particles.map(p => (
          <motion.div
            key={p.id}
            style={{
              position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size, borderRadius: '50%',
              background: '#00d4ff', boxShadow: `0 0 ${p.size * 4}px #00d4ff`,
              opacity: 0.4,
            }}
            animate={{ y: [0, -40, 0], opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Main card */}
      <div className="landing-gate__center">
        <motion.div
          className="landing-gate__card kali-gate-card"
          onHoverStart={() => setHovering(true)}
          onHoverEnd={() => setHovering(false)}
          onClick={onEnter}
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 22 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          role="button"
          tabIndex={0}
          aria-label="Enter portfolio"
          onKeyDown={e => e.key === 'Enter' && onEnter()}
          id="landing-enter-btn"
        >
          {/* Kali dragon logo */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 20px #367bf080)' }}
          >
            <KaliDragonLarge />
          </motion.div>

          {/* Kali Linux branding */}
          <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            <span style={{
              fontFamily: "'Hack','JetBrains Mono',monospace",
              fontSize: '1.6rem', fontWeight: 900, color: '#367bf0',
              letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>Kali</span>
            <span style={{
              fontFamily: "'Hack','JetBrains Mono',monospace",
              fontSize: '1.6rem', fontWeight: 300, color: 'rgba(255,255,255,0.6)',
              letterSpacing: '0.08em',
            }}>Portfolio</span>
          </div>

          <div style={{
            fontFamily: "'Hack','JetBrains Mono',monospace",
            fontSize: '0.65rem', color: 'rgba(0,212,255,0.6)',
            letterSpacing: '0.2em', marginBottom: '1.5rem', textTransform: 'uppercase',
          }}>
            The Art of Exploitation
          </div>

          {/* Terminal animation */}
          <div style={{ width: '100%', marginBottom: '1.5rem' }}>
            <TerminalPrompt />
          </div>

          {/* CTA */}
          <motion.div
            animate={hovering ? { opacity: 1 } : { opacity: 0.7 }}
            style={{
              fontFamily: "'Hack','JetBrains Mono',monospace",
              fontSize: '0.8rem', color: '#00d4ff', letterSpacing: '0.15em',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <span style={{ color: '#00ff88' }}>$</span>
            <span>./enter</span>
            <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}>▊</motion.span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
