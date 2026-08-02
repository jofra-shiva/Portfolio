"use client";
import { useEffect, useRef } from 'react';

export default function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COLORS: [number,number,number][] = [
      [54, 123, 240],   // Kali blue
      [0, 212, 255],    // cyan
      [103, 58, 183],   // deep purple
      [0, 170, 187],    // teal
      [0, 80, 160],     // navy
    ];

    function drawAurora() {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Kali dark background
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, w, h);

      // Smooth aurora blobs — NO pixel manipulation (performance fix)
      for (let i = 0; i < 5; i++) {
        const col = COLORS[i];
        const phase = t * 0.0003 + i * 1.3;
        const x = w * (0.1 + 0.8 * ((Math.sin(phase) + 1) / 2));
        const y = h * (0.05 + 0.7 * ((Math.sin(phase * 0.6 + i) + 1) / 2));
        const r = Math.min(w, h) * (0.28 + 0.1 * Math.sin(phase * 0.4));

        const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
        grd.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},0.13)`);
        grd.addColorStop(0.5, `rgba(${col[0]},${col[1]},${col[2]},0.04)`);
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);
      }


      t++;
      animId = requestAnimationFrame(drawAurora);
    }

    drawAurora();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
}
