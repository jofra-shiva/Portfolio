"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import AuroraCanvas from './AuroraCanvas';
import MenuBar from './MenuBar';
import Dock from './Dock';
import OSWindow from './OSWindow';
import { WindowManagerProvider, useWindowManager, WindowId } from './WindowManager';
import ProjectsWindow from './windows/ProjectsWindow';
import SkillsWindow from './windows/SkillsWindow';
import AboutWindow from './windows/AboutWindow';
import { ExperienceWindow, EducationWindow } from './windows/TimelineWindows';
import AwardsWindow from './windows/AwardsWindow';
import ContactWindow from './windows/ContactWindow';
import GitHubWindow from './windows/GitHubWindow';

// ── Kali Linux style SVG icons ──────────────────────────────────────────────
const KaliIcons = {
  projects: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={32} height={32}>
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  skills: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={32} height={32}>
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8M12 17v4"/>
    </svg>
  ),
  about: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={32} height={32}>
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  ),
  experience: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={32} height={32}>
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
    </svg>
  ),
  education: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={32} height={32}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  awards: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={32} height={32}>
      <circle cx="12" cy="8" r="6"/>
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={32} height={32}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" width={32} height={32}>
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  ),
};

// macOS Blue Folder SVG
const MacFolder = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
    <path d="M10 35C10 29.4772 14.4772 25 20 25H38.7428C40.6728 25 42.4172 26.1558 43.1497 27.917L46.8503 36.8143C47.2166 37.6953 48.0888 38.2727 49.0536 38.2727H80C85.5228 38.2727 90 42.75 90 48.2727V75C90 80.5228 85.5228 85 80 85H20C14.4772 85 10 80.5228 10 75V35Z" fill="#88C6FF"/>
    <path d="M10 42C10 36.4772 14.4772 32 20 32H80C85.5228 32 90 36.4772 90 42V75C90 80.5228 85.5228 85 80 85H20C14.4772 85 10 80.5228 10 75V42Z" fill="#3AA0FF"/>
    <path d="M10 42C10 36.4772 14.4772 32 20 32H80C85.5228 32 90 36.4772 90 42V45H10V42Z" fill="#67B6FF"/>
  </svg>
);

const DESKTOP_ICONS: { id: string; label: string }[] = [
  { id: 'projects',   label: 'Projects' },
  { id: 'skills',     label: 'Skills' },
  { id: 'about',      label: 'About Me' },
  { id: 'experience', label: 'Experience' },
  { id: 'education',  label: 'Education' },
  { id: 'awards',     label: 'Awards' },
  { id: 'github',     label: 'GitHub' },
  { id: 'contact',    label: 'Contact' },
];

export const WINDOW_META: Record<string, { title: string; icon: string }> = {
  projects:   { title: 'Projects',   icon: '📁' },
  skills:     { title: 'Skills',     icon: '📁' },
  about:      { title: 'About Me',   icon: '📁' },
  experience: { title: 'Experience', icon: '📁' },
  education:  { title: 'Education',  icon: '📁' },
  awards:     { title: 'Awards',     icon: '📁' },
  contact:    { title: 'Contact',    icon: '📁' },
  github:     { title: 'GitHub',     icon: '📁' },
};

function DesktopIcons({ onOpen }: { onOpen: (id: WindowId) => void }) {
  const { isOpen } = useWindowManager();
  const [clickTimes, setClickTimes] = useState<Record<string, number>>({});
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const handleClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIcon(id);
    
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    if (isMobile) { onOpen(id as WindowId); return; }
    
    const now = Date.now();
    const last = clickTimes[id] || 0;
    if (now - last < 400) {
      // Double click
      onOpen(id as WindowId);
      setClickTimes(prev => ({ ...prev, [id]: 0 }));
    } else {
      setClickTimes(prev => ({ ...prev, [id]: now }));
    }
  };

  // Deselect when clicking outside
  useEffect(() => {
    const handleGlobalClick = () => setSelectedIcon(null);
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <div 
      className="mac-desktop-grid" 
      aria-label="Desktop icons"
    >
      {DESKTOP_ICONS.map((icon, i) => {
        const isSelected = selectedIcon === icon.id;
        return (
          <motion.div
            key={icon.id}
            className="mac-desktop-icon"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            onClick={(e) => handleClick(icon.id, e)}
            role="button"
            tabIndex={0}
            id={`desktop-icon-${icon.id}`}
            aria-label={`Open ${icon.label}`}
            onKeyDown={e => e.key === 'Enter' && onOpen(icon.id as WindowId)}
          >
            <div className={`mac-icon-img ${isSelected ? 'selected' : ''}`}>
              <MacFolder />
            </div>
            <span className={`mac-icon-label ${isSelected ? 'selected' : ''}`}>
              {icon.label}
            </span>
          </motion.div>
        );
      })}
      
      <style>{`
        .mac-desktop-grid {
          position: absolute;
          top: 60px;
          right: 20px;
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          grid-auto-flow: column;
          grid-template-rows: repeat(8, auto);
          gap: 24px;
          padding: 20px;
          pointer-events: auto;
          z-index: 10;
        }
        
        .mac-desktop-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          width: 80px;
          cursor: default;
        }
        
        .mac-icon-img {
          width: 64px;
          height: 64px;
          border-radius: 8px;
          padding: 2px;
          transition: all 0.1s;
        }
        
        .mac-icon-img.selected {
          background-color: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .mac-icon-label {
          color: white;
          font-size: 13px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          text-align: center;
          text-shadow: 0 1px 2px rgba(0,0,0,0.8);
          padding: 2px 6px;
          border-radius: 4px;
          margin-top: 4px;
          user-select: none;
          word-break: break-word;
          line-height: 1.2;
        }
        
        .mac-icon-label.selected {
          background-color: #0a84ff;
          color: white;
          text-shadow: none;
        }

        @media (max-width: 768px) {
          .mac-desktop-grid {
            right: auto;
            left: 10px;
            top: 40px;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: auto;
            grid-auto-flow: row;
          }
        }
      `}</style>
    </div>
  );
}

function MinimizedTaskbar() {
  const { windows, openWindow } = useWindowManager();
  const minimized = windows.filter(w => w.minimized);
  if (minimized.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'fixed', bottom: 84, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '0.5rem', zIndex: 820,
        background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(16px)',
        border: '1px solid rgba(0,212,255,0.15)', borderRadius: 8, padding: '6px 10px',
      }}
    >
      {minimized.map(win => {
        const meta = WINDOW_META[win.id!] || { title: win.id!, icon: '$' };
        return (
          <motion.button
            key={win.id}
            onClick={() => openWindow(win.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)',
              borderRadius: 6, padding: '4px 10px', color: '#00d4ff',
              fontFamily: "'Hack', 'JetBrains Mono', 'Courier New', monospace",
              fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
            }}
            aria-label={`Restore ${meta.title}`}
          >
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>{meta.icon}</span>
            <span>{meta.title}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}

function WelcomeHint() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          style={{
            position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8,
            padding: '0.5rem 1.2rem', zIndex: 500, pointerEvents: 'none',
            fontFamily: "'Hack', 'JetBrains Mono', monospace",
            fontSize: '0.72rem', color: '#00d4ff', whiteSpace: 'nowrap',
          }}
        >
          <span style={{ color: '#00ff88' }}>$</span> double-click icons to open —{' '}
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>single-click on mobile</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function WindowRenderer({ data }: { data: any }) {
  const { windows } = useWindowManager();
  return (
    <AnimatePresence>
      {windows.filter(w => !w.minimized).map(win => {
        const meta = WINDOW_META[win.id!] || { title: win.id!, icon: '$' };
        return (
          <OSWindow key={win.id} id={win.id} title={meta.title} icon={meta.icon}
            width={win.width} height={win.height} x={win.x} y={win.y} zIndex={win.zIndex}
          >
            {win.id === 'projects'   && <ProjectsWindow   projects={data.projects} />}
            {win.id === 'skills'     && <SkillsWindow     skills={data.skills} />}
            {win.id === 'about'      && <AboutWindow      info={data.info} />}
            {win.id === 'experience' && <ExperienceWindow timeline={data.timeline} />}
            {win.id === 'education'  && <EducationWindow  timeline={data.timeline} />}
            {win.id === 'awards'     && <AwardsWindow     achievements={data.achievements} />}
            {win.id === 'contact'    && <ContactWindow    info={data.info} />}
            {win.id === 'github'     && <GitHubWindow     info={data.info} commitsCount={data.commitsCount} />}
          </OSWindow>
        );
      })}
    </AnimatePresence>
  );
}

function CenterWelcome({ data }: { data: any }) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 10,
      paddingBottom: '80px' // Offset upwards to balance with the dock
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: 'center' }}
      >
        <h1 style={{ 
          fontSize: 'clamp(2rem, 8vw, 3.5rem)', 
          fontWeight: 800, 
          letterSpacing: '-1px',
          marginBottom: '0.5rem',
          color: '#ffffff',
          textShadow: '0 4px 30px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.6)',
          lineHeight: '1.2'
        }}>
          Hello, I am {data.info?.name || 'Sivaprakash'}
        </h1>
        <div style={{
          fontSize: 'clamp(1.5rem, 5.5vw, 2.2rem)',
          fontWeight: 600,
          marginBottom: '1.5rem',
          textShadow: '0 2px 10px rgba(0,0,0,0.6)',
          minHeight: '3.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <TypewriterText texts={
            data.info?.role 
              ? (Array.isArray(data.info.role) ? data.info.role : [data.info.role]) 
              : ['Full Stack Developer', 'Software Engineer', 'UI/UX Designer']
          } />
        </div>
        <p style={{
          fontSize: '1.1rem',
          color: 'rgba(255,255,255,0.7)',
          fontWeight: 400,
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          letterSpacing: '0.5px'
        }}>
          Explore my workspace to learn more about my journey.
        </p>
      </motion.div>
    </div>
  );
}

// ── Typewriter Effect Component ──────────────────────────────────────────────
const TypewriterText = ({ texts }: { texts: string[] }) => {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const timer = setTimeout(() => {
      const fullText = texts[index % texts.length];
      if (!isDeleting) {
        setText(fullText.substring(0, text.length + 1));
        setTypingSpeed(100);
        if (text === fullText) {
          setIsDeleting(true);
          setTypingSpeed(2500); // Wait before deleting
        }
      } else {
        setText(fullText.substring(0, text.length - 1));
        setTypingSpeed(50);
        if (text === '') {
          setIsDeleting(false);
          setIndex((prev) => prev + 1);
          setTypingSpeed(500); // Wait before typing next
        }
      }
    }, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, index, texts, typingSpeed]);

  return (
    <span style={{ fontFamily: 'var(--font-mono)', display: 'inline-flex', alignItems: 'center' }}>
      <span style={{ color: '#60efff', marginRight: '12px' }}>{'>'}</span>
      <span style={{ 
        background: 'linear-gradient(90deg, #00ff87, #60efff)', 
        WebkitBackgroundClip: 'text', 
        WebkitTextFillColor: 'transparent',
        display: 'inline-block'
      }}>
        {text}
      </span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        style={{ 
          display: 'inline-block',
          width: '3px',
          height: '2.2rem',
          backgroundColor: '#00ff87',
          marginLeft: '4px',
          borderRadius: '2px'
        }}
      />
    </span>
  );
};

function DesktopInner({ data }: { data: any }) {
  const { openWindow } = useWindowManager();
  return (
    <div className="os-desktop">
      {/* Background image is handled by globals.css */}
      <MenuBar name={data.info?.name} onOpenWindow={id => openWindow(id as WindowId)} />
      <CenterWelcome data={data} />
      <Dock onOpenWindow={openWindow} />
      <MinimizedTaskbar />
      <WindowRenderer data={data} />
    </div>
  );
}

export default function Desktop({ data }: { data: any }) {
  return (
    <WindowManagerProvider>
      <DesktopInner data={data} />
    </WindowManagerProvider>
  );
}
