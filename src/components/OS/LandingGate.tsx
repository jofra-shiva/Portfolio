"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuroraCanvas from './AuroraCanvas';

interface LandingGateProps {
  onEnter: () => void;
  info?: any;
  stats?: any[];
  projects?: any[];
}

export default function LandingGate({ onEnter, info }: LandingGateProps) {
  const [hovering, setHovering] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; s: number; d: number; del: number }[]>([]);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setParticles(Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: Math.random() * 2 + 1,
      d: Math.random() * 10 + 8,
      del: Math.random() * 5,
    })));
  }, []);

  const handleEnter = () => {
    onEnter();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEnter]);

  const userName = info?.name || 'Sivaprakash M';

  return (
    <>
      <motion.div
        className="landing-gate"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background Aurora */}
        <div className="landing-gate__aurora">
          <AuroraCanvas />
        </div>

        {/* Floating Particles */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {particles.map(p => (
            <motion.div
              key={p.id}
              style={{
                position: 'absolute',
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.s,
                height: p.s,
                borderRadius: '50%',
                background: '#00d4ff',
                boxShadow: `0 0 ${p.s * 4}px #00d4ff`,
                opacity: 0.3,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.5, 0.1],
              }}
              transition={{
                duration: p.d,
                repeat: Infinity,
                delay: p.del,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Ultra-Premium Cinematic Tap to Begin */}
        <div className="landing-gate__center" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div
            onHoverStart={() => setHovering(true)}
            onHoverEnd={() => setHovering(false)}
            onClick={handleEnter}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            role="button"
            tabIndex={0}
            aria-label="Tap to begin"
            id="landing-enter-btn"
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              cursor: 'pointer',
              padding: '4rem', // Large hit area without visible box
              outline: 'none'
            }}
          >
            <motion.div 
              animate={hovering ? { scale: 1.02 } : { scale: 1 }} 
              transition={{ duration: 0.4, ease: 'easeOut' }} 
              style={{ width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              
              {/* Sleek User Name */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                style={{
                  fontFamily: "var(--font-satoshi), sans-serif",
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  marginBottom: '1.5rem',
                  background: 'linear-gradient(90deg, #fff 0%, #777 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {userName}
              </motion.div>

              {/* Elegant Tap to Begin */}
              <motion.div 
                style={{
                  fontFamily: "var(--font-satoshi), sans-serif",
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  fontWeight: 300,
                  letterSpacing: '0.15em',
                  color: 'white',
                  textTransform: 'uppercase',
                  textShadow: hovering ? '0 0 20px rgba(255,255,255,0.4)' : 'none',
                  transition: 'text-shadow 0.4s ease',
                }}
              >
                Tap to Begin
              </motion.div>
              
              {/* Premium Pulsing Indicator */}
              <motion.div
                animate={{ 
                  height: hovering ? 24 : 16,
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ 
                  height: { duration: 0.3 },
                  opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' } 
                }}
                style={{
                  width: '1px',
                  height: '16px',
                  background: 'linear-gradient(to bottom, #00d4ff, transparent)',
                  marginTop: '2rem',
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
