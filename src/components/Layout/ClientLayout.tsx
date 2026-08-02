"use client";
import { useState, useEffect } from 'react';
import Chatbot from '../Chatbot/Chatbot';
import { getPortfolioInfo } from '../../lib/db';

// NOTE: Navbar and Footer are removed — the OS Desktop has its own MenuBar + Dock.
// Lenis is disabled — the OS desktop is fixed-position with no page scroll.
// ClientLayout now provides: theme syncing + Chatbot (AI assistant still available).

const ClientLayout = ({ children }) => {
  const [info, setInfo] = useState(null);


  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await getPortfolioInfo();
        setInfo(res && typeof res === 'object' ? res : null);
      } catch (err) {
        console.error('Failed to load portfolio info:', err);
      }
    };
    fetchInfo();
  }, []);

  useEffect(() => {
    if (info && (info as any).themeName) {
      document.documentElement.setAttribute('data-color-theme', (info as any).themeName);
      localStorage.setItem('color-theme', (info as any).themeName);
    } else if (info) {
      document.documentElement.setAttribute('data-color-theme', 'purple');
      localStorage.setItem('color-theme', 'purple');
    }
  }, [info]);

  return (
    <>
      {children}
      <Chatbot />
    </>
  );
};

export default ClientLayout;

