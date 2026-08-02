"use client";
import { createContext, useContext, useState, useCallback } from 'react';

export type WindowId = 
  | 'projects' | 'skills' | 'about' | 'experience'
  | 'education' | 'awards' | 'contact' | 'github' | null;

interface WindowState {
  id: WindowId;
  zIndex: number;
  minimized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface WindowManagerCtx {
  windows: WindowState[];
  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  updatePosition: (id: WindowId, x: number, y: number) => void;
  isOpen: (id: WindowId) => boolean;
  isFocused: (id: WindowId) => boolean;
}

const Ctx = createContext<WindowManagerCtx | null>(null);

let zCounter = 1000;

export function WindowManagerProvider({ children }: { children: React.ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([]);

  const openWindow = useCallback((id: WindowId) => {
    if (!id) return;
    setWindows(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        const newZ = ++zCounter;
        return prev.map(w => w.id === id ? { ...w, zIndex: newZ, minimized: false } : w);
      }
      const SIZES: Record<string, { width: number; height: number }> = {
        projects:   { width: 900, height: 580 },
        skills:     { width: 800, height: 540 },
        about:      { width: 700, height: 520 },
        experience: { width: 680, height: 520 },
        education:  { width: 680, height: 520 },
        awards:     { width: 720, height: 500 },
        contact:    { width: 820, height: 560 },
        github:     { width: 750, height: 500 },
      };
      const sizes = SIZES[id] || { width: 700, height: 500 };
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = Math.min(sizes.width, vw * 0.9);
      const h = Math.min(sizes.height, vh * 0.85);
      const x = Math.max(20, (vw - w) / 2);
      const y = Math.max(50, (vh - h) / 2 - 20);
      return [...prev, { id, zIndex: ++zCounter, minimized: false, x, y, width: w, height: h }];
    });
  }, []);

  const closeWindow = useCallback((id: WindowId) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const focusWindow = useCallback((id: WindowId) => {
    setWindows(prev => {
      const newZ = ++zCounter;
      return prev.map(w => w.id === id ? { ...w, zIndex: newZ } : w);
    });
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: true } : w));
  }, []);

  const updatePosition = useCallback((id: WindowId, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  }, []);

  const isOpen = useCallback((id: WindowId) => windows.some(w => w.id === id && !w.minimized), [windows]);

  const isFocused = useCallback((id: WindowId) => {
    if (!windows.length) return false;
    const max = Math.max(...windows.map(w => w.zIndex));
    return windows.find(w => w.id === id)?.zIndex === max;
  }, [windows]);

  return (
    <Ctx.Provider value={{ windows, openWindow, closeWindow, focusWindow, minimizeWindow, updatePosition, isOpen, isFocused }}>
      {children}
    </Ctx.Provider>
  );
}

export function useWindowManager() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useWindowManager must be used within WindowManagerProvider');
  return ctx;
}
