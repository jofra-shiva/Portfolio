"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WindowId } from './WindowManager';

import Image from 'next/image';
import userLogo from '../../assets/logo.png';

interface MenuBarProps {
  name?: string;
  onOpenWindow: (id: WindowId) => void;
}

export default function MenuBar({ name, onOpenWindow }: MenuBarProps) {
  const [timeData, setTimeData] = useState({ date: '', time: '' });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const datePart = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      const timePart = now.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' });
      setTimeData({ date: datePart, time: timePart });
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
      role="navigation"
      aria-label="Menu Bar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '44px',
        background: 'rgba(5, 12, 23, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontSize: '13px',
        zIndex: 900,
        userSelect: 'none',
        textShadow: '0 1px 2px rgba(255,255,255,0.5)',
      }}
    >
      {/* Left: User Logo and Name */}
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', cursor: 'default' }}>
          <Image 
            src={userLogo} 
            alt="Logo" 
            width={24} 
            height={24} 
            style={{ borderRadius: '4px', objectFit: 'contain', mixBlendMode: 'screen' }}
          />
          <span 
            style={{ 
              marginLeft: '12px', 
              fontFamily: "'Outfit', sans-serif", 
              fontSize: 'clamp(14px, 4vw, 18px)', 
              fontWeight: 700, 
              letterSpacing: '0.5px', 
              color: '#1d85c4',
              textTransform: 'uppercase',
              textShadow: '0 0 10px rgba(29, 133, 196, 0.5), 0 0 20px rgba(29, 133, 196, 0.3)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            SIVAPRAKASH M
          </span>
        </div>
      </div>

      {/* Right: Only Clock */}
      <div style={{ display: 'flex', alignItems: 'center', paddingRight: '12px', whiteSpace: 'nowrap' }}>
        <div style={{ fontWeight: 500, letterSpacing: '0.2px' }}>
          <span className="menubar-date">{timeData.date}</span>
          <span className="menubar-date" style={{ margin: '0 4px' }}></span>
          <span>{timeData.time}</span>
        </div>
      </div>
      <style>{`
        @media (max-width: 600px) {
          .menubar-date { display: none; }
        }
      `}</style>
    </motion.div>
  );
}
