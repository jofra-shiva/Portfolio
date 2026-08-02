"use client";
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuroraCanvas from './AuroraCanvas';

interface LandingGateProps {
  onEnter: () => void;
}

export default function LandingGate({ onEnter }: LandingGateProps) {
  const [hovering, setHovering] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; dur: number; delay: number; color: string }[]>([]);

  useEffect(() => {
    const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#ec4899', '#3b82f6'];
    const arr = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      dur: Math.random() * 8 + 6,
      delay: Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    setParticles(arr);
  }, []);

  return (
    <motion.div
      className="landing-gate"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {/* Aurora animated background */}
      <div className="landing-gate__aurora">
        <AuroraCanvas />
      </div>

      {/* Floating particles */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {particles.map(p => (
          <motion.div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              opacity: 0.6,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: p.dur,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Center content */}
      <div className="landing-gate__center">
        {/* Name above card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            fontFamily: 'var(--font-satoshi)',
            fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}
        >
          Sivaprakash M — Digital Workspace
        </motion.div>

        {/* Main tap card */}
        <motion.div
          className="landing-gate__tap-card"
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.175, 0.885, 0.32, 1.275] }}
          whileHover={{ scale: 1.03, boxShadow: '0 0 100px rgba(99,102,241,0.5), 0 0 200px rgba(139,92,246,0.2), inset 0 1px 0 rgba(255,255,255,0.15)' }}
          onHoverStart={() => setHovering(true)}
          onHoverEnd={() => setHovering(false)}
          onClick={onEnter}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && onEnter()}
          id="tap-to-open-btn"
          aria-label="Enter digital workspace"
        >
          <div className="landing-gate__line" />
          <motion.div
            className="landing-gate__tap-text"
            animate={{ opacity: hovering ? 1 : [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            Tap to Open
          </motion.div>
          <div className="landing-gate__line" />

          {/* Shimmer effect on hover */}
          <AnimatePresence>
            {hovering && (
              <motion.div
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: '200%', opacity: 0.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="landing-gate__sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
        >
          Enter My Digital Workspace
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1, delay: 2 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 1, height: 40, background: 'linear-gradient(180deg, rgba(255,255,255,0.6), transparent)' }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
