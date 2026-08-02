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

// Kali Linux style: each icon has terminal-style icon + dark gradient
const DESKTOP_ICONS: { id: string; label: string; color: string; iconColor: string }[] = [
  { id: 'projects',   label: 'Code Lab',    color: 'linear-gradient(135deg,#0d1b2a,#1a3a5c)', iconColor: '#00d4ff' },
  { id: 'skills',     label: 'Tech Stack',  color: 'linear-gradient(135deg,#0d1a0d,#1a3a1a)', iconColor: '#00ff88' },
  { id: 'about',      label: 'Whoami',      color: 'linear-gradient(135deg,#1a0d2e,#2e1a4a)', iconColor: '#a78bfa' },
  { id: 'experience', label: 'Work Log',    color: 'linear-gradient(135deg,#1a1a0d,#3a2e0d)', iconColor: '#fbbf24' },
  { id: 'education',  label: 'Edu Shell',   color: 'linear-gradient(135deg,#0d2a1a,#1a4a2e)', iconColor: '#34d399' },
  { id: 'awards',     label: 'Exploits',    color: 'linear-gradient(135deg,#2a0d0d,#4a1a1a)', iconColor: '#f87171' },
  { id: 'contact',    label: 'Netcat',      color: 'linear-gradient(135deg,#0d1a2a,#1a2a3a)', iconColor: '#38bdf8' },
  { id: 'github',     label: 'Git Repo',    color: 'linear-gradient(135deg,#0d0d0d,#1a1a1a)', iconColor: '#e2e8f0' },
];

const WINDOW_META: Record<string, { title: string; icon: string }> = {
  projects:   { title: 'Code Lab',   icon: '</>' },
  skills:     { title: 'Tech Stack', icon: '⬡' },
  about:      { title: 'Whoami',     icon: '$' },
  experience: { title: 'Work Log',   icon: '▸' },
  education:  { title: 'Edu Shell',  icon: '⊕' },
  awards:     { title: 'Exploits',   icon: '★' },
  contact:    { title: 'Netcat',     icon: '~' },
  github:     { title: 'Git Repo',   icon: '⎇' },
};

function DesktopIcons({ onOpen }: { onOpen: (id: WindowId) => void }) {
  const { isOpen } = useWindowManager();
  const [clickTimes, setClickTimes] = useState<Record<string, number>>({});

  const handleClick = (id: string) => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    if (isMobile) { onOpen(id as WindowId); return; }
    const now = Date.now();
    const last = clickTimes[id] || 0;
    if (now - last < 400) {
      onOpen(id as WindowId);
      setClickTimes(prev => ({ ...prev, [id]: 0 }));
    } else {
      setClickTimes(prev => ({ ...prev, [id]: now }));
    }
  };

  return (
    <div className="os-icons-area" aria-label="Desktop icons">
      {DESKTOP_ICONS.map((icon, i) => {
        const active = isOpen(icon.id as WindowId);
        return (
          <motion.div
            key={icon.id}
            className={`os-icon kali-icon${active ? ' selected' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 280, damping: 22 }}
            onClick={() => handleClick(icon.id)}
            role="button"
            tabIndex={0}
            id={`desktop-icon-${icon.id}`}
            aria-label={`Open ${icon.label}`}
            onKeyDown={e => e.key === 'Enter' && onOpen(icon.id as WindowId)}
          >
            <motion.div
              className="kali-icon__box"
              style={{
                background: icon.color,
                color: icon.iconColor,
                boxShadow: active
                  ? `0 0 0 2px ${icon.iconColor}60, 0 8px 32px rgba(0,0,0,0.6)`
                  : '0 4px 20px rgba(0,0,0,0.5)',
                border: `1px solid ${icon.iconColor}20`,
              }}
              whileHover={{ scale: 1.1, y: -8, boxShadow: `0 0 0 1px ${icon.iconColor}40, 0 12px 40px rgba(0,0,0,0.7)` }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            >
              {KaliIcons[icon.id as keyof typeof KaliIcons]}
            </motion.div>
            <span className="kali-icon__label">{icon.label}</span>
            {active && <div className="kali-icon__dot" style={{ background: icon.iconColor }} />}
          </motion.div>
        );
      })}
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

function DesktopInner({ data }: { data: any }) {
  const { openWindow } = useWindowManager();
  return (
    <div className="os-desktop">
      <div className="os-wallpaper"><AuroraCanvas /></div>
      <MenuBar name={data.info?.name} onOpenWindow={id => openWindow(id as WindowId)} />
      <DesktopIcons onOpen={openWindow} />
      <Dock onOpenWindow={openWindow} />
      <WelcomeHint />
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
