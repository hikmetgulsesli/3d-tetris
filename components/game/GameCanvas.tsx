'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function RotatingCube() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color="#d4ff00" 
        emissive="#6366f1"
        emissiveIntensity={0.2}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />
      <RotatingCube />
      <OrbitControls enableZoom={true} enablePan={true} />
    </>
  );
}

export default function GameCanvas() {
  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border border-[var(--border-primary)]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'var(--bg-secondary)' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
