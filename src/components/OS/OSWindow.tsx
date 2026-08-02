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

  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragRef.current || !windowRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      const newX = Math.max(0, Math.min(window.innerWidth - width, dragRef.current.winX + dx));
      const newY = Math.max(36, Math.min(window.innerHeight - 60, dragRef.current.winY + dy));
      
      // Update DOM directly for zero-latency dragging (bypasses React render cycle)
      windowRef.current.style.left = `${newX}px`;
      windowRef.current.style.top = `${newY}px`;
      
      (dragRef.current as any).lastX = newX;
      (dragRef.current as any).lastY = newY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragRef.current || !windowRef.current) return;
      const touch = e.touches[0];
      const dx = touch.clientX - dragRef.current.startX;
      const dy = touch.clientY - dragRef.current.startY;
      const newX = Math.max(0, dragRef.current.winX + dx);
      const newY = Math.max(36, dragRef.current.winY + dy);
      
      windowRef.current.style.left = `${newX}px`;
      windowRef.current.style.top = `${newY}px`;
      
      (dragRef.current as any).lastX = newX;
      (dragRef.current as any).lastY = newY;
    };
    const onUp = () => { 
      if (dragRef.current && (dragRef.current as any).lastX !== undefined) {
        updatePosition(id, (dragRef.current as any).lastX, (dragRef.current as any).lastY);
      }
      dragRef.current = null; 
    };

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
      ref={windowRef}
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
      {/* Title bar — macOS style */}
      <div
        className="mac-window-titlebar"
        onMouseDown={handleTitleMouseDown}
        onTouchStart={handleTitleTouchStart}
        style={{ cursor: maximized ? 'default' : 'grab' }}
        aria-label={`${title} title bar`}
      >
        <div className="mac-traffic-lights">
          <button
            className="mac-traffic-btn mac-close"
            onClick={() => closeWindow(id)}
            title="Close"
            aria-label={`Close ${title}`}
          />
          <button
            className="mac-traffic-btn mac-minimize"
            onClick={() => minimizeWindow(id)}
            title="Minimize"
            aria-label={`Minimize ${title}`}
          />
          <button
            className="mac-traffic-btn mac-maximize"
            onClick={handleMaximize}
            title={maximized ? 'Restore' : 'Maximize'}
            aria-label={maximized ? 'Restore window' : 'Maximize window'}
          />
        </div>

        <div className="mac-window-title" style={{ padding: '0 80px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title}
        </div>
        
      </div>

      <style>{`
        .mac-window-titlebar {
          height: 36px;
          background: rgba(44, 44, 46, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: grab;
          border-radius: 12px 12px 0 0;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.5px;
          user-select: none;
        }
        
        .mac-window-titlebar:active {
          cursor: grabbing;
        }

        .mac-traffic-lights {
          position: absolute;
          left: 16px;
          display: flex;
          gap: 12px;
        }

        .mac-window-content {
          flex: 1;
          background: rgba(30, 30, 30, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
        }

        .mac-traffic-btn {
          width: 18px;
          height: 18px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.05);
          outline: none;
          padding: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          color: rgba(255, 255, 255, 0.5);
        }

        .mac-traffic-btn:hover {
          transform: scale(1.15) translateY(-1px);
        }

        .mac-traffic-btn::after {
          font-family: var(--font-mono), monospace;
          font-weight: 600;
          line-height: 1;
          transition: all 0.2s;
        }

        .mac-close:hover {
          background-color: rgba(255, 80, 80, 0.25);
          border-color: rgba(255, 80, 80, 0.8);
          color: #ff6b6b;
          box-shadow: 0 0 12px rgba(255, 80, 80, 0.4);
        }
        .mac-close::after { content: '×'; font-size: 16px; margin-top: -1px; }
        
        .mac-minimize:hover {
          background-color: rgba(255, 180, 40, 0.25);
          border-color: rgba(255, 180, 40, 0.8);
          color: #ffca28;
          box-shadow: 0 0 12px rgba(255, 180, 40, 0.4);
        }
        .mac-minimize::after { content: '−'; font-size: 14px; margin-top: -2px; }

        .mac-maximize:hover {
          background-color: rgba(40, 200, 64, 0.25);
          border-color: rgba(40, 200, 64, 0.8);
          color: #28c840;
          box-shadow: 0 0 12px rgba(40, 200, 64, 0.4);
        }
        .mac-maximize::after { content: '□'; font-size: 12px; margin-top: -1px; }

        .mac-window-title {
          flex: 1;
          text-align: center;
          font-family: var(--font-satoshi);
          font-size: 13px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85);
          letter-spacing: 0.3px;
        }

        .os-window {
          border-radius: 12px;
          overflow: hidden;
          background: rgba(30, 30, 30, 0.7);
          backdrop-filter: blur(25px) saturate(180%);
          -webkit-backdrop-filter: blur(25px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        
        .os-window--focused {
          box-shadow: 0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2);
          border-color: rgba(255, 255, 255, 0.25);
        }
      `}</style>

      {/* Body */}
      <div className="os-window__body">
        {children}
      </div>
    </motion.div>
  );
}

