import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Flame, Mic } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import confetti from 'canvas-confetti';
import * as THREE from 'three';
import type { Group } from 'three';

interface Cake3DProps {
  onBack: () => void;
  onNext: () => void;
}

// ──── Fallback 3D Cake ────
function FallbackCake({ blown }: { blown: boolean }) {
  const groupRef = useRef<Group>(null!);

  useFrame((_, delta) => {
    if (groupRef.current && !blown) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Layers */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[1.0, 1.05, 0.4, 32]} />
        <meshStandardMaterial color="#FFB3C1" roughness={0.35} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.82, 0.88, 0.35, 32]} />
        <meshStandardMaterial color="#FFD966" roughness={0.35} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.62, 0.68, 0.3, 32]} />
        <meshStandardMaterial color="#FFB3C1" roughness={0.35} metalness={0.05} />
      </mesh>
      {/* Frosting */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.67, 0.6, Math.sin(angle) * 0.67]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#FFF8E7" />
          </mesh>
        );
      })}
      {/* Candle */}
      {!blown && (
        <group position={[0, 0.8, 0]}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.04, 0.4, 16]} />
            <meshStandardMaterial color="#FFF8E7" />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#FFD966" emissive="#FFA500" emissiveIntensity={1.5} toneMapped={false} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// ──── 3D Star Confetti ────
function StarConfetti({ active }: { active: boolean }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 200;
  const posRef = useRef(new Float32Array(count * 3));
  const velRef = useRef(new Float32Array(count * 3));

  useEffect(() => {
    if (!active) return;
    const p = posRef.current;
    const v = velRef.current;
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 0.3;
      p[i * 3 + 1] = 1.0;
      p[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      v[i * 3] = (Math.random() - 0.5) * 0.04;
      v[i * 3 + 1] = Math.random() * 0.04 + 0.03;
      v[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
    }
  }, [active, count]);

  useFrame(() => {
    if (!active || !pointsRef.current) return;
    const p = posRef.current;
    const v = velRef.current;
    for (let i = 0; i < count; i++) {
      p[i * 3] += v[i * 3];
      p[i * 3 + 1] += v[i * 3 + 1];
      p[i * 3 + 2] += v[i * 3 + 2];
      v[i * 3 + 1] -= 0.0008;
    }
    (pointsRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[posRef.current, 3]}
          count={count}
          array={posRef.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#FFD966" blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

// ──── Main Cake Page ────
export default function Cake3D({ onBack, onNext }: Cake3DProps) {
  const [blown, setBlown] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [modelMissing, setModelMissing] = useState(false);

  // Check if cake.glb exists
  useEffect(() => {
    fetch('/models/cake.glb', { method: 'HEAD' })
      .then(r => { if (!r.ok) setModelMissing(true); })
      .catch(() => setModelMissing(true));
  }, []);

  // Check mic
  useEffect(() => {
    const check = async () => {
      try {
        if (!navigator?.mediaDevices?.getUserMedia) return;
        const s = await navigator.mediaDevices.getUserMedia({ audio: true });
        s.getTracks().forEach(t => t.stop());
        setMicSupported(true);
      } catch { /* not supported */ }
    };
    check();
  }, []);

  const blowCandle = useCallback(() => {
    if (blown) return;
    setBlown(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { x: 0.5, y: 0.5 },
      shapes: ['star'],
      colors: ['#FFD966', '#FFB3C1', '#FFF8E7', '#FFE4A0'],
      scalar: 1.2,
    });
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 100,
        origin: { x: 0.3, y: 0.4 },
        shapes: ['star'],
        colors: ['#FFD966', '#FFB3C1'],
        scalar: 1.0,
      });
    }, 300);
  }, [blown]);

  const startMic = async () => {
    try {
      setMicActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const checkBlow = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        if (avg > 45 && !blown) {
          blowCandle();
          stream.getTracks().forEach(t => t.stop());
          audioCtx.close();
          setMicActive(false);
          return;
        }
        if (!blown) requestAnimationFrame(checkBlow);
      };
      checkBlow();
      setTimeout(() => {
        if (!blown) { stream.getTracks().forEach(t => t.stop()); audioCtx.close(); setMicActive(false); }
      }, 30000);
    } catch { setMicActive(false); setMicSupported(false); }
  };

  return (
    <div className="relative min-h-[100dvh] bg-gradient-to-b from-night-start to-night-end overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 z-20 p-4">
        <button onClick={onBack} className="text-cream/70 hover:text-cream min-h-[44px] min-w-[44px] flex items-center">
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Model missing hint */}
      {modelMissing && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 text-cream/40 text-xs bg-black/30 px-3 py-1 rounded-full">
          🎂 3D 蛋糕模型未放置，显示默认蛋糕
        </div>
      )}

      {/* 3D Scene */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0.3, 3.5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} color="#FFF8E7" />
          <directionalLight position={[-3, 2, -3]} intensity={0.3} color="#FFB3C1" />
          <pointLight position={[0, 1.5, 0]} intensity={0.6} color="#FFD966" />
          <Suspense fallback={null}>
            <FallbackCake blown={blown} />
            <StarConfetti active={blown} />
            <OrbitControls
              enableZoom={true}
              enablePan={false}
              minDistance={2}
              maxDistance={6}
              autoRotate={!blown}
              autoRotateSpeed={1.5}
              target={[0, 0.2, 0]}
            />
            <Environment preset="night" />
            <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={5} blur={2.5} />
          </Suspense>
        </Canvas>
      </div>

      {/* UI overlay */}
      <div className="absolute bottom-10 left-0 right-0 z-10 flex flex-col items-center gap-4">
        {!blown ? (
          <div className="flex gap-4 flex-wrap justify-center px-4">
            <button
              onClick={blowCandle}
              className="star-btn bg-warm-yellow text-night-start px-8 py-3 rounded-full font-semibold flex items-center gap-2 min-h-[44px]"
            >
              <Flame size={20} /> 吹蜡烛
            </button>
            {micSupported && (
              <button
                onClick={startMic}
                disabled={micActive}
                className={`star-btn px-6 py-3 rounded-full font-semibold flex items-center gap-2 min-h-[44px] border ${
                  micActive ? 'bg-warm-yellow/10 text-warm-yellow border-warm-yellow/30' : 'bg-transparent text-cream/70 border-cream/20'
                }`}
              >
                <Mic size={20} /> {micActive ? '正在听...' : '吹气吹灭'}
              </button>
            )}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6">
            <p className="text-2xl text-warm-yellow font-semibold">✨ 愿望已收到 ✨</p>
            <button
              onClick={onNext}
              className="star-btn bg-warm-yellow text-night-start px-8 py-3 rounded-full font-semibold flex items-center gap-2 min-h-[44px]"
            >
              一起看烟花 <ArrowRight size={20} />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}