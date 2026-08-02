"use client";
import { useState, useEffect } from 'react';

interface MenuBarProps {
  name?: string;
  onOpenWindow?: (id: string) => void;
}

export default function MenuBar({ name, onOpenWindow }: MenuBarProps) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
      setDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const displayName = name?.split(' ')[0] || 'Sivaprakash';

  return (
    <div className="os-menubar" role="navigation" aria-label="Menu bar">
      <div className="os-menubar__left">
        <span className="os-menubar__logo">⌘ {displayName}</span>
        <div className="os-menubar__items">
          <span className="os-menubar__item" onClick={() => onOpenWindow?.('about')}>About</span>
          <span className="os-menubar__item" onClick={() => onOpenWindow?.('projects')}>Projects</span>
          <span className="os-menubar__item" onClick={() => onOpenWindow?.('contact')}>Contact</span>
        </div>
      </div>
      <div className="os-menubar__right">
        <div className="os-menubar__status">
          <div className="os-menubar__status-dot" />
          <span>Available</span>
        </div>
        <span className="os-menubar__time">{date} &nbsp; {time}</span>
      </div>
    </div>
  );
}
