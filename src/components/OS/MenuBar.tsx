"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WindowId } from './WindowManager';

// Kali Linux dragon logo (simplified SVG)
const KaliDragon = () => (
  <svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 5 C30 5 10 20 10 45 C10 65 25 80 45 88 L50 95 L55 88 C75 80 90 65 90 45 C90 20 70 5 50 5Z" fill="#367bf0" opacity="0.9"/>
    <path d="M50 5 C35 15 20 30 22 50 C24 65 35 78 50 85 C65 78 76 65 78 50 C80 30 65 15 50 5Z" fill="#1a5cc4" opacity="0.7"/>
    <path d="M40 35 L35 50 L42 48 L38 65 L52 45 L44 47 Z" fill="white" opacity="0.95"/>
    <path d="M58 32 L62 46 L55 44 L60 62 L47 42 L54 44 Z" fill="#00d4ff" opacity="0.9"/>
  </svg>
);

interface MenuBarProps {
  name?: string;
  onOpenWindow: (id: WindowId) => void;
}

export default function MenuBar({ name, onOpenWindow }: MenuBarProps) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  const navItems: { label: string; id: WindowId }[] = [
    { label: 'whoami', id: 'about' },
    { label: 'projects', id: 'projects' },
    { label: 'skills', id: 'skills' },
    { label: 'contact', id: 'contact' },
  ];

  return (
    <motion.div
      className="os-menubar"
      initial={{ y: -36, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
      role="navigation"
      aria-label="OS Menu Bar"
    >
      {/* Left: Kali logo + menu */}
      <div className="os-menubar__left">
        <div className="kali-logo" title="Kali Linux Portfolio" style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 8 }}>
          <KaliDragon />
          <span style={{
            fontFamily: "'Hack', 'JetBrains Mono', monospace",
            fontSize: '0.75rem', fontWeight: 700,
            color: '#367bf0', letterSpacing: '0.05em'
          }}>kali</span>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', fontFamily: 'monospace' }}>@</span>
          <span style={{
            fontFamily: "'Hack', 'JetBrains Mono', monospace",
            fontSize: '0.72rem', fontWeight: 600, color: '#00d4ff',
          }}>{name?.split(' ')[0]?.toLowerCase() || 'portfolio'}</span>
        </div>

        <div className="kali-separator" style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)', margin: '0 6px' }} />

        {navItems.map(item => (
          <motion.button
            key={item.id}
            className="os-menubar__item kali-nav-btn"
            onClick={() => onOpenWindow(item.id)}
            whileHover={{ color: '#00d4ff' }}
            whileTap={{ scale: 0.95 }}
            style={{ fontFamily: "'Hack', 'JetBrains Mono', monospace", fontSize: '0.72rem' }}
          >
            {item.label}
          </motion.button>
        ))}
      </div>

      {/* Right: status + clock */}
      <div className="os-menubar__right" style={{ gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 6px #00ff88', flexShrink: 0 }} />
          <span style={{
            fontFamily: "'Hack', 'JetBrains Mono', monospace",
            fontSize: '0.65rem', color: '#00ff88', fontWeight: 600,
          }}>online</span>
        </div>

        <div className="kali-clock" style={{
          fontFamily: "'Hack', 'JetBrains Mono', 'Courier New', monospace",
          fontSize: '0.68rem', color: 'rgba(200,220,255,0.8)',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.3,
        }}>
          <span style={{ color: '#00d4ff', fontWeight: 700 }}>{time}</span>
          <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.35)' }}>{date}</span>
        </div>
      </div>
    </motion.div>
  );
}
