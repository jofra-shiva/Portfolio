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

    const COLORS = [
      [99, 102, 241],   // indigo
      [139, 92, 246],   // purple
      [6, 182, 212],    // cyan
      [236, 72, 153],   // pink
      [59, 130, 246],   // blue
    ];

    function drawAurora() {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Deep background
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#050816');
      bg.addColorStop(1, '#0a0d1f');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Aurora bands
      for (let i = 0; i < 5; i++) {
        const col = COLORS[i];
        const phase = t * 0.0004 + i * 1.2;
        const x = w * (0.1 + 0.8 * ((Math.sin(phase) + 1) / 2));
        const y = h * (0.1 + 0.6 * ((Math.sin(phase * 0.7 + i) + 1) / 2));
        const r = w * (0.3 + 0.2 * Math.sin(phase * 0.3));

        const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
        grd.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},0.18)`);
        grd.addColorStop(0.4, `rgba(${col[0]},${col[1]},${col[2]},0.08)`);
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);
      }

      // Subtle noise overlay
      const noiseOpacity = 0.015;
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const n = (Math.random() - 0.5) * 30;
        data[i] = Math.min(255, Math.max(0, data[i] + n));
        data[i+1] = Math.min(255, Math.max(0, data[i+1] + n));
        data[i+2] = Math.min(255, Math.max(0, data[i+2] + n));
      }
      ctx.putImageData(imageData, 0, 0);

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
