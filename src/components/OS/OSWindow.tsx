"use client";
import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [maximized, setMaximized] = useState(false);
  const [preMaxState, setPreMaxState] = useState({ x, y, width, height });

  // Compute display rect
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const displayStyle = maximized
    ? { left: 0, top: 36, width: vw, height: vh - 36 }
    : { left: x, top: y, width, height };

  const handleMaximize = () => {
    if (!maximized) {
      setPreMaxState({ x, y, width, height });
      setMaximized(true);
    } else {
      setMaximized(false);
      updatePosition(id, preMaxState.x, preMaxState.y);
    }
  };

  // Mouse drag on title bar
  const handleTitleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button') || maximized) return;
    focusWindow(id);
    dragRef.current = { startX: e.clientX, startY: e.clientY, winX: x, winY: y };
    e.preventDefault();
  };

  // Touch drag on title bar
  const handleTitleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button') || maximized) return;
    const touch = e.touches[0];
    focusWindow(id);
    dragRef.current = { startX: touch.clientX, startY: touch.clientY, winX: x, winY: y };
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      const newX = Math.max(0, Math.min(window.innerWidth - width, dragRef.current.winX + dx));
      const newY = Math.max(36, Math.min(window.innerHeight - 60, dragRef.current.winY + dy));
      updatePosition(id, newX, newY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragRef.current) return;
      const touch = e.touches[0];
      const dx = touch.clientX - dragRef.current.startX;
      const dy = touch.clientY - dragRef.current.startY;
      const newX = Math.max(0, dragRef.current.winX + dx);
      const newY = Math.max(36, dragRef.current.winY + dy);
      updatePosition(id, newX, newY);
    };
    const onUp = () => { dragRef.current = null; };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [id, width, updatePosition]);

  return (
    <motion.div
      className={`os-window${focused ? ' os-window--focused' : ''}`}
      style={{ ...displayStyle, zIndex, transition: maximized ? 'all 0.3s cubic-bezier(0.4,0,0.2,1)' : undefined }}
      initial={{ opacity: 0, scale: 0.8, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 20 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      onMouseDown={() => focusWindow(id)}
      role="dialog"
      aria-label={`${title} window`}
      aria-modal="true"
    >
      {/* Title bar */}
      <div
        className="os-window__titlebar"
        onMouseDown={handleTitleMouseDown}
        onTouchStart={handleTitleTouchStart}
        style={{ cursor: maximized ? 'default' : 'grab' }}
        aria-label={`${title} title bar`}
      >
        <div className="os-window__traffic">
          <button
            className="os-window__traffic-btn os-window__traffic-btn--close"
            onClick={() => closeWindow(id)}
            title="Close"
            aria-label={`Close ${title}`}
          >×</button>
          <button
            className="os-window__traffic-btn os-window__traffic-btn--minimize"
            onClick={() => minimizeWindow(id)}
            title="Minimize"
            aria-label={`Minimize ${title}`}
          >−</button>
          <button
            className="os-window__traffic-btn os-window__traffic-btn--maximize"
            onClick={handleMaximize}
            title={maximized ? 'Restore' : 'Maximize'}
            aria-label={maximized ? 'Restore window' : 'Maximize window'}
          >+</button>
        </div>

        <div className="os-window__title-wrap">
          <span style={{ fontSize: '1rem' }}>{icon}</span>
          <span>{title}</span>
          {maximized && (
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginLeft: 4 }}>(maximized)</span>
          )}
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

