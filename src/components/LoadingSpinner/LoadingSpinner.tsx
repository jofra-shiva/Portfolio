"use client";
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './LoadingSpinner.css';

/* ─── Particle canvas ─── */
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    let W = (c.width = innerWidth), H = (c.height = innerHeight);
    const resize = () => { W = c.width = innerWidth; H = c.height = innerHeight; };
    window.addEventListener('resize', resize);

    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: 0.8 + Math.random() * 1.6,
      o: 0.15 + Math.random() * 0.5,
      hue: Math.random() > 0.55 ? 195 : 260, // cyan or purple
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.o})`;
        ctx.fill();
      });
      // Draw faint connecting lines between nearby particles
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(0, 200, 255, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} className="loader__particles" />;
}

/* ─── Blueprint SVG lines (draw themselves) ─── */
function BlueprintLines() {
  return (
    <svg className="loader__blueprint" viewBox="0 0 100 100" preserveAspectRatio="none">
      {/* Corner brackets */}
      <path d="M 8 28 L 8 8 L 28 8"       className="bp-line bp-line--1" />
      <path d="M 92 28 L 92 8 L 72 8"      className="bp-line bp-line--2" />
      <path d="M 8 72 L 8 92 L 28 92"      className="bp-line bp-line--3" />
      <path d="M 92 72 L 92 92 L 72 92"    className="bp-line bp-line--4" />

      {/* Horizontal horizon lines */}
      <path d="M 0 50 L 33 50"             className="bp-line bp-line--5" />
      <path d="M 67 50 L 100 50"           className="bp-line bp-line--6" />

      {/* Vertical axis lines */}
      <path d="M 50 0 L 50 33"             className="bp-line bp-line--7" />
      <path d="M 50 67 L 50 100"           className="bp-line bp-line--8" />

      {/* Inner accent brackets */}
      <path d="M 8 42 L 8 38 L 14 38"     className="bp-line bp-line--9 bp-line--accent" />
      <path d="M 92 42 L 92 38 L 86 38"   className="bp-line bp-line--10 bp-line--accent" />
      <path d="M 8 58 L 8 62 L 14 62"     className="bp-line bp-line--11 bp-line--accent" />
      <path d="M 92 58 L 92 62 L 86 62"   className="bp-line bp-line--12 bp-line--accent" />

      {/* Subtle cross-hair center marks */}
      <path d="M 47 50 L 53 50"            className="bp-line bp-line--cross" />
      <path d="M 50 47 L 50 53"            className="bp-line bp-line--cross" />
    </svg>
  );
}

/* ─── Main component ─── */
const LoadingSpinner = ({ isLeaving, name = "Sivaprakash M" }: { isLeaving: boolean; name?: string }) => {
  const parts = name.split(' ');
  const first = parts[0] ?? 'Sivaprakash';
  const last  = parts.slice(1).join(' ') || 'M';

  const [showContent, setShowContent] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShowContent(true), 400); return () => clearTimeout(t); }, []);

  const nameLetters = first.split('');

  return (
    <div className={`loader ${isLeaving ? 'loader--leaving' : ''}`}>

      {/* Layered backgrounds */}
      <div className="loader__bg-grid" />
      <div className="loader__bg-vignette" />

      {/* Floating particles + connection lines */}
      <ParticleCanvas />

      {/* Blueprint geometric lines */}
      <BlueprintLines />

      {/* ── Glass center panel ── */}
      <motion.div
        className="loader__card"
        initial={{ opacity: 0, scale: 0.88, y: 16 }}
        animate={showContent ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Top rule */}
        <motion.div
          className="loader__rule"
          initial={{ scaleX: 0 }}
          animate={showContent ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        />

        {/* Initials */}
        <div className="loader__initials">
          <motion.span
            className="loader__initial-m"
            initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
            animate={showContent ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            M
          </motion.span>
          <motion.span
            className="loader__initial-s"
            initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
            animate={showContent ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            S
          </motion.span>
        </div>

        {/* Full name cleanly displayed below initials */}
        <motion.div
          className="loader__full-name"
          initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
          animate={showContent ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          {name}
        </motion.div>

        {/* Bottom rule */}
        <motion.div
          className="loader__rule"
          initial={{ scaleX: 0 }}
          animate={showContent ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        />


      </motion.div>

    </div>
  );
};

export default LoadingSpinner;
