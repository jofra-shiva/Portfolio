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

const DESKTOP_ICONS = [
  { id: 'projects',   icon: '💼', label: 'Projects',    color: 'linear-gradient(135deg,#06b6d4,#3b82f6)' },
  { id: 'skills',     icon: '⚡', label: 'Skills',      color: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
  { id: 'about',      icon: '👤', label: 'About',       color: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
  { id: 'experience', icon: '🏢', label: 'Experience',  color: 'linear-gradient(135deg,#10b981,#06b6d4)' },
  { id: 'education',  icon: '🎓', label: 'Education',   color: 'linear-gradient(135deg,#8b5cf6,#ec4899)' },
  { id: 'awards',     icon: '🏆', label: 'Awards',      color: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
  { id: 'contact',    icon: '✉️',  label: 'Contact',    color: 'linear-gradient(135deg,#ec4899,#8b5cf6)' },
  { id: 'github',     icon: '🐙', label: 'GitHub',      color: 'linear-gradient(135deg,#1f2937,#4b5563)' },
];

const WINDOW_META: Record<string, { title: string; icon: string }> = {
  projects:   { title: 'Projects',    icon: '💼' },
  skills:     { title: 'Skills',      icon: '⚡' },
  about:      { title: 'About',       icon: '👤' },
  experience: { title: 'Experience',  icon: '🏢' },
  education:  { title: 'Education',   icon: '🎓' },
  awards:     { title: 'Awards',      icon: '🏆' },
  contact:    { title: 'Contact',     icon: '✉️' },
  github:     { title: 'GitHub',      icon: '🐙' },
};

function DesktopIcons({ onOpen }: { onOpen: (id: WindowId) => void }) {
  const { isOpen } = useWindowManager();
  const [clickTimes, setClickTimes] = useState<Record<string, number>>({});

  // Single-click on mobile, double-click on desktop
  const handleClick = (id: string) => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    if (isMobile) {
      onOpen(id as WindowId);
      return;
    }
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
      {DESKTOP_ICONS.map((icon, i) => (
        <motion.div
          key={icon.id}
          className={`os-icon${isOpen(icon.id as WindowId) ? ' selected' : ''}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 25 }}
          onClick={() => handleClick(icon.id)}
          role="button"
          tabIndex={0}
          aria-label={`Open ${icon.label}`}
          id={`desktop-icon-${icon.id}`}
          onKeyDown={e => e.key === 'Enter' && onOpen(icon.id as WindowId)}
        >
          <motion.div
            className="os-icon__visual"
            style={{ background: icon.color, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
            whileHover={{ scale: 1.15, y: -6 }}
            whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          >
            {icon.icon}
          </motion.div>
          <span className="os-icon__label">{icon.label}</span>
        </motion.div>
      ))}
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
        position: 'fixed',
        bottom: 84,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '0.5rem',
        zIndex: 820,
        background: 'rgba(10,12,30,0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: '6px 10px',
      }}
    >
      {minimized.map(win => {
        const meta = WINDOW_META[win.id!] || { title: win.id!, icon: '📄' };
        return (
          <motion.button
            key={win.id}
            onClick={() => openWindow(win.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              padding: '4px 10px',
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'var(--font-satoshi)',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            aria-label={`Restore ${meta.title}`}
          >
            <span>{meta.icon}</span>
            <span>{meta.title}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}

function WindowRenderer({ data }: { data: any }) {
  const { windows, openWindow } = useWindowManager();

  return (
    <AnimatePresence>
      {windows.filter(w => !w.minimized).map(win => {
        const meta = WINDOW_META[win.id!] || { title: win.id!, icon: '📄' };
        return (
          <OSWindow
            key={win.id}
            id={win.id}
            title={meta.title}
            icon={meta.icon}
            width={win.width}
            height={win.height}
            x={win.x}
            y={win.y}
            zIndex={win.zIndex}
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

function WelcomeHint() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          style={{
            position: 'fixed',
            bottom: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(10,12,30,0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: '0.6rem 1.2rem',
            fontFamily: 'var(--font-satoshi)',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.6)',
            zIndex: 500,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          💡 Click icons or dock items to open sections
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DesktopInner({ data }: { data: any }) {
  const { openWindow } = useWindowManager();
  return (
    <div className="os-desktop">
      {/* Animated wallpaper */}
      <div className="os-wallpaper"><AuroraCanvas /></div>

      {/* Fixed OS chrome */}
      <MenuBar name={data.info?.name} onOpenWindow={id => openWindow(id as WindowId)} />
      <DesktopIcons onOpen={openWindow} />
      <Dock onOpenWindow={openWindow} />

      {/* Welcome hint */}
      <WelcomeHint />

      {/* Minimized windows taskbar */}
      <MinimizedTaskbar />

      {/* Windows */}
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
