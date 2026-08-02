"use client";
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuroraCanvas from './AuroraCanvas';

interface LandingGateProps {
  onEnter: () => void;
  info?: any;
  stats?: any[];
  projects?: any[];
}

// Kali Linux Dragon SVG
const KaliDragon = ({ size = 72 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="dg" cx="40%" cy="30%">
        <stop offset="0%" stopColor="#5a9cf8"/>
        <stop offset="100%" stopColor="#1a4fa8"/>
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <path d="M50 3C27 3 6 22 6 48c0 22 17 39 40 47l4 2 4-2c23-8 40-25 40-47C94 22 73 3 50 3z" fill="url(#dg)" filter="url(#glow)"/>
    <path d="M50 10c-16 9-29 25-27 42 2 14 13 27 27 35 14-8 25-21 27-35 2-17-11-33-27-42z" fill="#1a5cc4" opacity="0.45"/>
    {/* Lightning bolt */}
    <path d="M43 26 L36 50 L44 48 L39 74 L57 44 L48 47 Z" fill="white" opacity="0.97" filter="url(#glow)"/>
    <path d="M57 23 L63 48 L55 45 L61 72 L44 42 L52 45 Z" fill="#00d4ff" opacity="0.9"/>
  </svg>
);

// Typing terminal component
function Terminal({ lines }: { lines: { prompt?: string; text: string; color?: string }[] }) {
  const [shown, setShown] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (shown >= lines.length) return;
    const cur = lines[shown].text;
    if (charIdx < cur.length) {
      const t = setTimeout(() => setCharIdx(c => c + 1), 28);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setShown(s => s + 1); setCharIdx(0); }, 350);
      return () => clearTimeout(t);
    }
  }, [shown, charIdx, lines]);

  return (
    <div style={{
      fontFamily: "'Hack','JetBrains Mono','Courier New',monospace",
      fontSize: '0.72rem', lineHeight: 1.9,
      background: 'rgba(0,0,0,0.5)', borderRadius: 8, padding: '0.9rem 1.1rem',
      border: '1px solid rgba(0,212,255,0.15)', width: '100%',
      minHeight: 90,
    }}>
      {lines.map((line, i) => {
        if (i > shown) return null;
        const isActive = i === shown;
        const displayText = isActive ? line.text.slice(0, charIdx) : line.text;
        return (
          <div key={i}>
            {line.prompt && (
              <span style={{ color: '#00ff88', fontWeight: 700 }}>{line.prompt}</span>
            )}
            <span style={{ color: line.color || (line.prompt ? '#e2e8f0' : 'rgba(160,200,220,0.7)') }}>
              {displayText}
            </span>
            {isActive && charIdx < line.text.length && (
              <span style={{ display: 'inline-block', width: 7, height: '0.9em', background: '#00d4ff', verticalAlign: 'text-bottom', animation: 'blink 0.8s step-end infinite' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Social icon SVGs
const SocialIcons = {
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16}>
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
};

export default function LandingGate({ onEnter, info, stats = [], projects = [] }: LandingGateProps) {
  const [ready, setReady] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; s: number; d: number; del: number }[]>([]);

  useEffect(() => {
    setParticles(Array.from({ length: 25 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      s: Math.random() * 2 + 0.5, d: Math.random() * 10 + 8, del: Math.random() * 5,
    })));
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  const name = info?.name || 'Sivaprakash M';
  const firstName = name.split(' ')[0];
  const role = info?.role || info?.title || 'Full Stack Developer';
  const github = info?.github || '';
  const linkedin = info?.linkedin || '';
  const email = info?.email || '';
  const projectsCount = projects.length || 0;
  const commitsVal = stats.find(s => s.label?.toLowerCase().includes('commit') || s.label?.toLowerCase().includes('commit'))?.value || '500+';

  const terminalLines = [
    { prompt: `${firstName.toLowerCase()}@kali:~$ `, text: 'whoami', color: '#e2e8f0' },
    { text: `${name} — ${role}`, color: 'rgba(160,200,220,0.8)' },
    { prompt: `${firstName.toLowerCase()}@kali:~$ `, text: 'ls ./projects | wc -l', color: '#e2e8f0' },
    { text: `${projectsCount} projects found`, color: 'rgba(160,200,220,0.8)' },
    { prompt: `${firstName.toLowerCase()}@kali:~$ `, text: './portfolio --open-desktop', color: '#e2e8f0' },
  ];

  const socials = [
    github && { icon: SocialIcons.github, href: github, label: 'GitHub', color: '#e2e8f0' },
    linkedin && { icon: SocialIcons.linkedin, href: linkedin, label: 'LinkedIn', color: '#0a66c2' },
    email && { icon: SocialIcons.mail, href: `mailto:${email}`, label: 'Email', color: '#00d4ff' },
  ].filter(Boolean) as { icon: React.ReactNode; href: string; label: string; color: string }[];

  return (
    <motion.div
      style={{ position: 'fixed', inset: 0, background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000, overflow: 'hidden' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.5 }}
    >
      {/* Aurora background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}><AuroraCanvas /></div>

      {/* Particles */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {particles.map(p => (
          <motion.div key={p.id} style={{
            position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
            width: p.s, height: p.s, borderRadius: '50%',
            background: '#00d4ff', boxShadow: `0 0 ${p.s * 5}px #00d4ff80`, opacity: 0.35,
          }} animate={{ y: [0, -35, 0], opacity: [0.15, 0.55, 0.15] }}
            transition={{ duration: p.d, repeat: Infinity, delay: p.del, ease: 'easeInOut' }} />
        ))}
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={ready ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ delay: 0.3, type: 'spring', stiffness: 180, damping: 22 }}
        style={{
          position: 'relative', zIndex: 2,
          background: 'rgba(8,10,20,0.92)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(0,212,255,0.2)',
          borderRadius: 20,
          padding: '2.5rem 2.2rem',
          width: '100%', maxWidth: 440,
          margin: '0 1rem',
          boxShadow: '0 0 60px rgba(54,123,240,0.15), 0 0 120px rgba(0,212,255,0.05)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.4rem',
          // Kali border animation
          outline: '1px solid transparent',
        }}
        className="kali-gate-card"
      >
        {/* Dragon logo + name */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <motion.div
            animate={{ y: [0, -7, 0], filter: ['drop-shadow(0 0 14px #367bf060)', 'drop-shadow(0 0 28px #367bf0a0)', 'drop-shadow(0 0 14px #367bf060)'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <KaliDragon size={72} />
          </motion.div>

          {/* Name */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: "'Hack','JetBrains Mono',monospace",
              fontSize: 'clamp(1.3rem, 4vw, 1.7rem)', fontWeight: 900,
              letterSpacing: '0.05em', lineHeight: 1.2,
              display: 'flex', alignItems: 'baseline', gap: 10, justifyContent: 'center', flexWrap: 'wrap',
            }}>
              <span style={{ color: '#367bf0' }}>{firstName}</span>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 300 }}>
                {name.substring(firstName.length).trim()}
              </span>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              style={{
                fontFamily: "'Hack','JetBrains Mono',monospace",
                fontSize: '0.68rem', color: '#00d4ff', letterSpacing: '0.18em',
                textTransform: 'uppercase', marginTop: 6,
              }}
            >
              {role}
            </motion.div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent)' }} />

        {/* Terminal */}
        <motion.div style={{ width: '100%' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <Terminal lines={terminalLines} />
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}
        >
          {[
            { val: projectsCount > 0 ? `${projectsCount}+` : '10+', label: 'Projects' },
            { val: '3+', label: 'Years Exp' },
            { val: commitsVal, label: 'Commits' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Hack','JetBrains Mono',monospace", fontSize: '1.1rem', fontWeight: 900, color: '#00d4ff' }}>{s.val}</div>
              <div style={{ fontFamily: "'Hack','JetBrains Mono',monospace", fontSize: '0.58rem', color: 'rgba(160,200,220,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Socials */}
        {socials.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}
          >
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                title={s.label} aria-label={s.label}
                onClick={e => e.stopPropagation()}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 34, height: 34, borderRadius: 8,
                  background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.18)',
                  color: s.color, textDecoration: 'none', transition: 'all 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,212,255,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,212,255,0.07)')}
              >
                {s.icon}
              </a>
            ))}
          </motion.div>
        )}

        {/* Enter button */}
        <motion.button
          onClick={onEnter}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, type: 'spring' }}
          whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(0,212,255,0.3)' }}
          whileTap={{ scale: 0.96 }}
          id="landing-enter-btn"
          aria-label="Enter portfolio desktop"
          style={{
            width: '100%', padding: '0.9rem',
            background: 'rgba(54,123,240,0.12)',
            border: '1px solid rgba(54,123,240,0.4)',
            borderRadius: 10, cursor: 'pointer',
            fontFamily: "'Hack','JetBrains Mono',monospace",
            fontSize: '0.8rem', fontWeight: 700,
            color: '#e2e8f0', letterSpacing: '0.12em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            transition: 'all 0.2s',
          }}
        >
          <span style={{ color: '#00ff88' }}>$</span>
          <span>./open-desktop</span>
          <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}>▊</motion.span>
        </motion.button>

        {/* Bottom hint */}
        <div style={{
          fontFamily: "'Hack','JetBrains Mono',monospace",
          fontSize: '0.58rem', color: 'rgba(160,200,220,0.3)',
          letterSpacing: '0.08em',
        }}>
          press enter or click to continue
        </div>
      </motion.div>

      {/* Version tag */}
      <div style={{
        position: 'absolute', bottom: 20, right: 20,
        fontFamily: "'Hack','JetBrains Mono',monospace",
        fontSize: '0.6rem', color: 'rgba(0,212,255,0.25)',
        letterSpacing: '0.1em',
      }}>
        kali-portfolio v1.0 | {new Date().getFullYear()}
      </div>
    </motion.div>
  );
}
