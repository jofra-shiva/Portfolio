"use client";
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { WindowId } from './WindowManager';
import { useWindowManager } from './WindowManager';
import { useRef } from 'react';
import Image from 'next/image';

const DOCK_ITEMS: { id: WindowId; label: string; svg: React.ReactNode }[] = [
  { id: 'projects', label: 'Projects', svg: <Image src="/dock/projects.png" alt="Projects" width={60} height={60} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '22%' }} /> },
  { id: 'skills', label: 'Skills', svg: <Image src="/dock/skills.png" alt="Skills" width={60} height={60} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '22%' }} /> },
  { id: 'about', label: 'About Me', svg: <Image src="/dock/about.png" alt="About" width={60} height={60} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '22%' }} /> },
  { id: 'experience', label: 'Experience', svg: <Image src="/dock/experience.png" alt="Experience" width={60} height={60} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '22%' }} /> },
  { id: 'education', label: 'Education', svg: <Image src="/dock/education.png" alt="Education" width={60} height={60} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '22%' }} /> },
  { id: 'awards', label: 'Awards', svg: <Image src="/dock/awards.png" alt="Awards" width={60} height={60} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '22%' }} /> },
  { id: 'github', label: 'GitHub', svg: <Image src="/dock/github.png" alt="GitHub" width={60} height={60} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '22%' }} /> },
  { id: 'contact', label: 'Contact', svg: <Image src="/dock/contact.png" alt="Contact" width={60} height={60} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '22%' }} /> },
];

function DockItem({ item, mouseX }: { item: typeof DOCK_ITEMS[0], mouseX: any }) {
  const { isOpen, openWindow } = useWindowManager();
  const active = isOpen(item.id);
  const ref = useRef<HTMLDivElement>(null);

  // macOS Dock magnification logic
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [50, 80, 50]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width, height: width }}
      className="mac-dock-item-container"
      onClick={() => openWindow(item.id)}
      role="button"
      tabIndex={0}
      aria-label={`Open ${item.label}`}
    >
      {/* Icon Image */}
      <motion.div className="mac-dock-icon" whileTap={{ scale: 0.85 }}>
        {item.svg}
      </motion.div>
      
      {/* Tooltip */}
      <div className="mac-dock-tooltip">{item.label}</div>
      
      {/* Active Indicator Dot */}
      <motion.div
        className="mac-dock-dot"
        initial={{ scale: 0 }}
        animate={{ scale: active ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.div>
  );
}

export default function Dock({ onOpenWindow }: { onOpenWindow: (id: WindowId) => void }) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      className="mac-dock-wrapper"
      initial={{ y: 80, x: '-50%', opacity: 0 }}
      animate={{ y: 0, x: '-50%', opacity: 1 }}
      transition={{ delay: 0.4, type: 'spring', stiffness: 280, damping: 26 }}
    >
      <div
        className="mac-dock-inner"
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {DOCK_ITEMS.map((item) => (
          <DockItem key={item.id} item={item} mouseX={mouseX} />
        ))}
      </div>
      
      {/* Injecting CSS specifically for the Mac dock to ensure it renders correctly immediately */}
      <style>{`
        .mac-dock-wrapper {
          position: fixed;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 800;
          pointer-events: none;
          max-width: 100vw;
        }
        .mac-dock-inner {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          padding: 8px 12px;
          background: rgba(44, 44, 46, 0.65);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.2);
          pointer-events: auto;
          transform-origin: bottom center;
          max-width: calc(100vw - 20px);
          overflow-x: auto;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .mac-dock-inner::-webkit-scrollbar {
          display: none;
        }
        .mac-dock-item-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .mac-dock-icon {
          width: 100%;
          height: 100%;
          border-radius: 22%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          transform-origin: bottom;
          will-change: transform, width, height;
        }
        .mac-dock-dot {
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          margin-top: 4px;
          box-shadow: 0 0 4px rgba(255,255,255,0.4);
        }
        .mac-dock-tooltip {
          position: absolute;
          top: -45px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transform: translateY(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        .mac-dock-item-container:hover .mac-dock-tooltip {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </motion.div>
  );
}
