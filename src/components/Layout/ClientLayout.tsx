"use client";
import { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Chatbot from '../Chatbot/Chatbot';
import { getPortfolioInfo } from '../../lib/db';
import useLenis from '../../hooks/useLenis';

const ClientLayout = ({ children }) => {
  const [info, setInfo] = useState(null);

  // Initialize Lenis smooth scroll
  useLenis();

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
    if (info && info.themeName) {
      document.documentElement.setAttribute('data-color-theme', info.themeName);
      localStorage.setItem('color-theme', info.themeName);
    } else if (info) {
      document.documentElement.setAttribute('data-color-theme', 'purple');
      localStorage.setItem('color-theme', 'purple');
    }
  }, [info]);

  return (
    <>
      <Navbar info={info} />
      <main>
        {children}
      </main>
      <Footer info={info} />
      <Chatbot />
    </>
  );
};

export default ClientLayout;
