"use client";
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicIntroProps {
  onComplete: () => void;
  name?: string;
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isDone, setIsDone] = useState(false); // Indicates final exit

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      // Show the welcome screen after video ends
      setShowWelcome(true);
    };

    video.addEventListener('ended', handleEnded);

    video.play().catch((err) => {
      console.warn("Video autoplay blocked:", err.message);
      
      // If it's an AbortError (power-saving pause), retry once after a small delay
      if (err.name === 'AbortError') {
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play().catch((retryErr) => {
              console.warn("Retry failed:", retryErr.message);
              // Fallback if retry also fails
              setShowWelcome(true);
            });
          }
        }, 500);
      } else {
        // Fallback for strict autoplay blockers
        setShowWelcome(true);
      }
    });

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handleWelcomeClick = () => {
    setIsDone(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  useEffect(() => {
    // Add a global click listener from the very beginning. 
    // Clicking ANYWHERE, AT ANY TIME during the video or after, proceeds to the desktop.
    const handleGlobalAction = (e?: Event) => {
      if (!isDone) {
        handleWelcomeClick();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !isDone) {
        handleWelcomeClick();
      }
    };
    
    // Use a small timeout so that initial clicks don't immediately trigger it
    const timer = setTimeout(() => {
      window.addEventListener('click', handleGlobalAction);
      window.addEventListener('keydown', handleKeyDown);
    }, 300);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleGlobalAction);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showWelcome, isDone, onComplete]);

  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
      initial={{ opacity: 1 }} // Changed to 1 so the dark panels are immediately visible
      animate={{ opacity: isDone ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* 2-Way (Left & Right) Split Animation Overlay (Opening the doors to reveal the video) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 99999, pointerEvents: 'none' }}>
        {/* Left Half */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: '-50vw' }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          style={{
            position: 'absolute', top: 0, left: 0, width: '50vw', height: '100vh',
            background: '#0a0a0f', borderRight: '1px solid rgba(0, 212, 255, 0.4)',
            boxShadow: 'inset -20px 0 60px rgba(0,0,0,0.8)'
          }}
        />
        
        {/* Right Half */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: '50vw' }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          style={{
            position: 'absolute', top: 0, right: 0, width: '50vw', height: '100vh',
            background: '#0a0a0f', borderLeft: '1px solid rgba(0, 212, 255, 0.4)',
            boxShadow: 'inset 20px 0 60px rgba(0,0,0,0.8)'
          }}
        />
      </div>

      {/* Main Video Layer */}
      <AnimatePresence>
        {!isDone && (
          <motion.div
            key="video-container"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            style={{ width: '100%', height: '100%', position: 'relative' }}
          >
            <video
              ref={videoRef}
              src="/intro.mp4"
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none'
              }}
            />

            {/* Skip Button */}
            {!isDone && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                onClick={(e) => { e.stopPropagation(); handleWelcomeClick(); }}
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '20px',
                  zIndex: 99999,
                  background: 'rgba(0, 0, 0, 0.2)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  padding: '24px 48px',
                  borderRadius: '100px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-satoshi), sans-serif',
                  fontSize: '1rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
              >
                Skip Intro
              </motion.button>
            )}

            {/* Invisible clickable area over the laptop screen's "WELCOME" */}
            <AnimatePresence>
              {showWelcome && (
                <>
                  {/* Pulsing highlight over the laptop text itself (No onClick here to avoid AI extensions) */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.1, duration: 1 }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: 'transparent',
                      width: '350px',
                      height: '80px',
                      borderRadius: '8px',
                      pointerEvents: 'none', 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '32vh',
                      animation: 'pulseGlow 2s infinite alternate',
                      zIndex: 30,
                    }}
                  >
                    <style>{`
                      @keyframes pulseGlow {
                        0% { box-shadow: 0 0 0px rgba(0, 212, 255, 0); }
                        100% { box-shadow: 0 0 15px rgba(0, 212, 255, 0.15); }
                      }
                    `}</style>
                  </motion.div>

                  {/* Visible "Want to know me?" text at the bottom */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1 }}
                    style={{
                      position: 'absolute',
                      bottom: '2rem', // Adjusted to look better
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 30,
                      pointerEvents: 'none'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.4rem',
                      color: 'rgba(255,255,255,0.6)', // Increased visibility slightly
                      fontFamily: 'var(--font-satoshi), sans-serif',
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      fontSize: '0.75rem',
                      animation: 'pulseText 2s infinite alternate'
                    }}>
                      <span>Want to know me?</span>
                      <div style={{ width: '40px', height: '1px', background: 'rgba(0, 212, 255, 0.5)' }} />
                      <style>{`
                        @keyframes pulseText {
                          0% { opacity: 0.4; text-shadow: 0 0 0px rgba(255,255,255,0); }
                          100% { opacity: 1; text-shadow: 0 0 10px rgba(255,255,255,0.5); }
                        }
                      `}</style>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
