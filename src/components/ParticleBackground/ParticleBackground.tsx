import { useCallback, memo } from 'react';
import { loadSlim } from '@tsparticles/slim';
import Particles from '@tsparticles/react';

const ParticleBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      // @ts-ignore
      init={particlesInit}
      style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}
      options={{
        background: { color: { value: 'transparent' } as any},
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: { enable: true, mode: 'repulse' },
            onClick: { enable: true, mode: 'push' },
          },
          modes: {
            repulse: { distance: 80, duration: 0.4 },
            push: { quantity: 2 },
          },
        },
        particles: {
          color: {
            value: ['#8b5cf6', '#00d2ff', '#3b82f6', '#a78bfa'],
          },
          links: {
            color: '#8b5cf6',
            distance: 140,
            enable: true,
            opacity: 0.08,
            width: 1,
          },
          move: {
            enable: true,
            outModes: { default: 'out' },
            speed: 0.6,
            direction: 'none',
            random: true,
            straight: false,
          },
          number: {
            value: 70,
            density: { enable: true, area: 900 } as any,
          },
          opacity: {
            value: { min: 0.1, max: 0.4 },
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.05,
            },
          },
          shape: { type: 'circle' },
          size: {
            value: { min: 1, max: 2.5 },
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.5,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default memo(ParticleBackground);
