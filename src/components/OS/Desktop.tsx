"use client";
import { motion, AnimatePresence } from 'framer-motion';
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

  return (
    <div className="os-icons-area" aria-label="Desktop icons">
      {DESKTOP_ICONS.map((icon, i) => (
        <motion.div
          key={icon.id}
          className={`os-icon${isOpen(icon.id as WindowId) ? ' selected' : ''}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 25 }}
          onDoubleClick={() => onOpen(icon.id as WindowId)}
          onClick={() => {}}
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

function DesktopInner({ data }: { data: any }) {
  const { openWindow } = useWindowManager();
  return (
    <div className="os-desktop">
      {/* Animated wallpaper */}
      <div className="os-wallpaper"><AuroraCanvas /></div>

      {/* OS UI */}
      <div className="os-desktop__content">
        <MenuBar name={data.info?.name} onOpenWindow={id => openWindow(id as WindowId)} />
        <DesktopIcons onOpen={openWindow} />
        <Dock onOpenWindow={openWindow} />
      </div>

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
