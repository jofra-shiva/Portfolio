"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuroraCanvas from './AuroraCanvas';

interface CinematicIntroProps {
  onComplete: () => void;
  name?: string;
}

const PHASES = [
  { id: 0, label: 'aurora', duration: 1200 },
  { id: 1, label: 'laptop', duration: 1400 },
  { id: 2, label: 'welcome', duration: 2500 },
  { id: 3, label: 'zoom', duration: 800 },
];

export default function CinematicIntro({ onComplete, name }: CinematicIntroProps) {
  const [phase, setPhase] = useState(0);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    let timers: ReturnType<typeof setTimeout>[] = [];
    let accum = 0;
    PHASES.forEach((p, i) => {
      accum += p.duration;
      timers.push(setTimeout(() => {
        setPhase(i + 1);
        if (i === PHASES.length - 1) {
          setTimeout(onComplete, 600);
        }
      }, accum));
    });
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const handleContinue = () => {
    if (clicked) return;
    setClicked(true);
    setTimeout(onComplete, 400);
  };

  return (
    <motion.div
      className="cinematic-intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08 }}
      transition={{ duration: 0.5 }}
    >
      {/* Aurora background */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <AuroraCanvas />
      </div>

      {/* Phase: Aurora burst */}
      <AnimatePresence>
        {phase === 0 && (
          <motion.div
            key="aurora-burst"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 1], opacity: [0, 0.8, 0.3] }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{
                width: '80vw',
                height: '80vw',
                maxWidth: 600,
                maxHeight: 600,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(139,92,246,0.2) 40%, transparent 70%)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase: Laptop appears */}
      <AnimatePresence>
        {phase >= 1 && (
          <motion.div
            key="laptop"
            className="cinematic-intro__screen"
            initial={{ opacity: 0, scale: 0.7, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275] }}
          >
            <div className="cinematic-laptop">
              {/* Laptop lid / screen */}
              <div className="cinematic-laptop__body">
                <div className="cinematic-laptop__screen">
                  {/* Screen aurora */}
                  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(ellipse at 50% 30%, rgba(99,102,241,0.4), rgba(6,182,212,0.2), transparent 70%)',
                      }}
                    />
                  </div>

                  {/* Welcome content */}
                  <AnimatePresence>
                    {phase >= 2 && (
                      <motion.div
                        key="welcome"
                        className="cinematic-laptop__content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ position: 'relative', zIndex: 1 }}
                      >
                        {/* Decorative line */}
                        <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.8), transparent)', margin: '0 auto 1.5rem' }} />
                        
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          style={{ fontFamily: 'var(--font-satoshi)', fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}
                        >
                          Welcome.
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          style={{ fontFamily: 'var(--font-satoshi)', fontSize: 'clamp(0.8rem, 1.5vw, 1rem)', color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}
                        >
                          Nice to meet you.
                        </motion.p>

                        <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.8), transparent)', margin: '0 auto 1.5rem' }} />

                        <motion.button
                          onClick={handleContinue}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.9, type: 'spring' }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            background: 'rgba(99,102,241,0.2)',
                            border: '1px solid rgba(99,102,241,0.5)',
                            borderRadius: 10,
                            padding: '0.5rem 1.5rem',
                            color: 'white',
                            fontFamily: 'var(--font-satoshi)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            letterSpacing: '0.08em',
                          }}
                          id="intro-continue-btn"
                          aria-label="Continue to portfolio"
                        >
                          Tap to Continue
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="cinematic-laptop__base" />
              <div className="cinematic-laptop__stand" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name tag bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 1 ? { opacity: 0.5, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-satoshi)',
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
      >
        {name || 'Sivaprakash M'} — Portfolio
      </motion.div>
    </motion.div>
  );
}
