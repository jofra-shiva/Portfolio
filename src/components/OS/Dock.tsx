"use client";
import { motion } from 'framer-motion';
import { WindowId } from './WindowManager';
import { useWindowManager } from './WindowManager';

const DOCK_ITEMS: { id: WindowId; label: string; color: string; iconColor: string; svg: React.ReactNode }[] = [
  {
    id: 'projects', label: 'Code Lab', color: '#0d1b2a', iconColor: '#00d4ff',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={22} height={22}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  },
  {
    id: 'about', label: 'Whoami', color: '#1a0d2e', iconColor: '#a78bfa',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={22} height={22}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  },
  {
    id: 'skills', label: 'Tech', color: '#0d1a0d', iconColor: '#00ff88',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={22} height={22}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  },
  {
    id: 'experience', label: 'Work', color: '#1a1a0d', iconColor: '#fbbf24',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={22} height={22}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  },
  {
    id: 'github', label: 'Git', color: '#0d0d0d', iconColor: '#e2e8f0',
    svg: <svg viewBox="0 0 24 24" fill="currentColor" width={22} height={22}><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>,
  },
  {
    id: 'contact', label: 'Netcat', color: '#0d1a2a', iconColor: '#38bdf8',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={22} height={22}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  },
];

export default function Dock({ onOpenWindow }: { onOpenWindow: (id: WindowId) => void }) {
  const { isOpen, windows } = useWindowManager();

  return (
    <motion.div
      className="os-dock"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, type: 'spring', stiffness: 280, damping: 26 }}
    >
      <div className="os-dock__inner kali-dock__inner">
        {DOCK_ITEMS.map((item) => {
          const active = isOpen(item.id);
          return (
            <motion.div
              key={item.id}
              className="os-dock__item kali-dock__item"
              onClick={() => onOpenWindow(item.id)}
              whileHover={{ y: -12, scale: 1.25 }}
              whileTap={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 420, damping: 18 }}
              title={item.label}
              id={`dock-${item.id}`}
              role="button"
              aria-label={`Open ${item.label}`}
            >
              <div
                className="kali-dock__icon"
                style={{
                  background: item.color,
                  color: item.iconColor,
                  border: `1px solid ${item.iconColor}25`,
                  boxShadow: active
                    ? `0 0 0 1.5px ${item.iconColor}60, 0 8px 24px rgba(0,0,0,0.6)`
                    : '0 4px 16px rgba(0,0,0,0.5)',
                }}
              >
                {item.svg}
              </div>
              {active && (
                <motion.div
                  layoutId={`dock-dot-${item.id}`}
                  className="os-dock__item-dot"
                  style={{ background: item.iconColor }}
                />
              )}
              <div className="os-dock__tooltip kali-dock__tooltip">{item.label}</div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
