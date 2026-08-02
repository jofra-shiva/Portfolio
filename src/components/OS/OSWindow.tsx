"use client";
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWindowManager, WindowId } from './WindowManager';

interface OSWindowProps {
  id: WindowId;
  title: string;
  icon: string;
  width: number;
  height: number;
  x: number;
  y: number;
  zIndex: number;
  children: React.ReactNode;
}

export default function OSWindow({ id, title, icon, width, height, x, y, zIndex, children }: OSWindowProps) {
  const { closeWindow, minimizeWindow, focusWindow, updatePosition, isFocused } = useWindowManager();
  const focused = isFocused(id);
  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    focusWindow(id);
    dragRef.current = { startX: e.clientX, startY: e.clientY, winX: x, winY: y };
    e.preventDefault();
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      const newX = Math.max(0, Math.min(window.innerWidth - width, dragRef.current.winX + dx));
      const newY = Math.max(36, Math.min(window.innerHeight - 60, dragRef.current.winY + dy));
      updatePosition(id, newX, newY);
    };
    const onUp = () => { dragRef.current = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [id, width, updatePosition]);

  return (
    <motion.div
      className={`os-window${focused ? ' os-window--focused' : ''}`}
      style={{ left: x, top: y, width, height, zIndex }}
      initial={{ opacity: 0, scale: 0.8, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 20 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      onMouseDown={() => focusWindow(id)}
      role="dialog"
      aria-label={`${title} window`}
    >
      {/* Title bar */}
      <div
        className="os-window__titlebar"
        onMouseDown={handleMouseDown}
        aria-label={`${title} window title bar - drag to move`}
      >
        <div className="os-window__traffic">
          <button
            className="os-window__traffic-btn os-window__traffic-btn--close"
            onClick={() => closeWindow(id)}
            title="Close"
            aria-label={`Close ${title} window`}
          >×</button>
          <button
            className="os-window__traffic-btn os-window__traffic-btn--minimize"
            onClick={() => minimizeWindow(id)}
            title="Minimize"
            aria-label={`Minimize ${title} window`}
          >−</button>
          <button
            className="os-window__traffic-btn os-window__traffic-btn--maximize"
            title="Maximize"
            aria-label="Full screen"
          >+</button>
        </div>
        <div className="os-window__title-wrap">
          <span style={{ fontSize: '1rem' }}>{icon}</span>
          <span>{title}</span>
        </div>
        <div style={{ width: 60, flexShrink: 0 }} />
      </div>

      {/* Body */}
      <div className="os-window__body">
        {children}
      </div>
    </motion.div>
  );
}
