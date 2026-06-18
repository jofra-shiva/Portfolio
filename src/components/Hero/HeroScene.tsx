"use client";
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, OrbitControls, Sparkles } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FloatingGeo = ({ position, shape, color, speed = 1, distort = 0.3 }) => {
  const meshRef = useRef<any>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3 * speed) * 0.4;
      meshRef.current.rotation.y += 0.005 * speed;
    }
  });

  const geo = shape === 'torus'
    ? <torusGeometry args={[0.7, 0.25, 16, 100]} />
    : shape === 'icosa'
    ? <icosahedronGeometry args={[0.75, 1]} />
    : <octahedronGeometry args={[0.7, 0]} />;

  return (
    <Float speed={speed * 1.5} rotationIntensity={1} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position}>
        {geo}
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
};

const ParticleField = () => {
  return (
    <Sparkles
      count={180}
      scale={12}
      size={1.5}
      speed={0.3}
      opacity={0.5}
      color="#8b5cf6"
    />
  );
};

const HeroScene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#8b5cf6" />
      <pointLight position={[-5, -5, 5]} intensity={1} color="#00d2ff" />
      <pointLight position={[0, 0, 3]} intensity={0.5} color="#3b82f6" />

      <ParticleField />

      <FloatingGeo position={[-3.5, 1.5, -1]} shape="torus" color="#7c3aed" speed={0.8} distort={0.4} />
      <FloatingGeo position={[3.8, -1.2, -2]} shape="icosa" color="#00d2ff" speed={1.2} distort={0.3} />
      <FloatingGeo position={[-2.5, -2, -1.5]} shape="octa" color="#3b82f6" speed={0.6} distort={0.5} />
      <FloatingGeo position={[2.2, 2.5, -3]} shape="torus" color="#8b5cf6" speed={1} distort={0.35} />
    </Canvas>
  );
};

export default HeroScene;
