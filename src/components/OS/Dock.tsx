"use client";
import { motion } from 'framer-motion';
import { useWindowManager, WindowId } from './WindowManager';

interface DockItem {
  id: WindowId;
  icon: string;
  label: string;
  color: string;
}

const DOCK_ITEMS: DockItem[] = [
  { id: 'about',      icon: '👤', label: 'About',      color: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
  { id: 'projects',   icon: '💼', label: 'Projects',   color: 'linear-gradient(135deg,#06b6d4,#3b82f6)' },
  { id: 'skills',     icon: '⚡', label: 'Skills',     color: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
  { id: 'experience', icon: '🏢', label: 'Experience', color: 'linear-gradient(135deg,#10b981,#06b6d4)' },
  { id: 'contact',    icon: '✉️',  label: 'Contact',   color: 'linear-gradient(135deg,#ec4899,#8b5cf6)' },
  { id: 'github',     icon: '🐙', label: 'GitHub',     color: 'linear-gradient(135deg,#1f2937,#4b5563)' },
];

interface DockProps {
  onOpenWindow: (id: WindowId) => void;
}

export default function Dock({ onOpenWindow }: DockProps) {
  const { isOpen } = useWindowManager();

  return (
    <div className="os-dock" role="toolbar" aria-label="Application dock">
      <div className="os-dock__inner">
        {DOCK_ITEMS.map((item, i) => (
          <motion.div
            key={item.id}
            className={`os-dock__item${isOpen(item.id) ? ' active' : ''}`}
            onClick={() => onOpenWindow(item.id)}
            role="button"
            tabIndex={0}
            aria-label={`Open ${item.label}`}
            id={`dock-${item.id}`}
            onKeyDown={e => e.key === 'Enter' && onOpenWindow(item.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
          >
            <motion.div
              className="os-dock__item-icon"
              style={{ background: item.color, boxShadow: `0 4px 16px rgba(0,0,0,0.4)` }}
              whileHover={{ y: -12, scale: 1.25 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              {item.icon}
            </motion.div>
            <div className="os-dock__tooltip">{item.label}</div>
            <div className="os-dock__item-dot" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
