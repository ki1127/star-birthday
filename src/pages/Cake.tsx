import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Flame, Mic } from 'lucide-react';
import confetti from 'canvas-confetti';
import StarField from '../components/StarField';

interface CakeProps {
  onBack: () => void;
  onNext: () => void;
}

export default function Cake({ onBack, onNext }: CakeProps) {
  const [blown, setBlown] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [starImgError, setStarImgError] = useState(false);
  const smokeRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  // Check mic support
  useEffect(() => {
    // Test if getUserMedia is actually callable
    const check = async () => {
      try {
        if (!navigator?.mediaDevices?.getUserMedia) return;
        // Quick test: request then immediately stop
        const s = await navigator.mediaDevices.getUserMedia({ audio: true });
        s.getTracks().forEach(t => t.stop());
        setMicSupported(true);
      } catch {
        setMicSupported(false);
      }
    };
    check();
  }, []);

  // Smoke animation
  useEffect(() => {
    if (!blown) return;
    const canvas = smokeRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; life: number; size: number }[] = [];
    // Spawn smoke
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 60,
        y: canvas.height * 0.5,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 3 - 1,
        life: 1,
        size: Math.random() * 20 + 10,
      });
    }

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.015;
        p.size += 0.3;
        if (p.life <= 0) continue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 180, 190, ${p.life * 0.4})`;
        ctx.fill();
      }
      if (particles.some(p => p.life > 0)) {
        animRef.current = requestAnimationFrame(draw);
      }
    };
    draw();

    // Star confetti
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { x: 0.5, y: 0.5 },
      shapes: ['star'],
      colors: ['#FFD966', '#FFB3C1', '#FFF8E7'],
      scalar: 1.2,
    });

    return () => cancelAnimationFrame(animRef.current);
  }, [blown]);

  const blowCandle = useCallback(() => {
    if (blown) return;
    setBlown(true);
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
        if (avg > 40 && !blown) {
          blowCandle();
          stream.getTracks().forEach(t => t.stop());
          audioCtx.close();
          setMicActive(false);
          return;
        }
        if (!blown) requestAnimationFrame(checkBlow);
      };
      checkBlow();

      // Timeout after 30s
      setTimeout(() => {
        if (!blown) {
          stream.getTracks().forEach(t => t.stop());
          audioCtx.close();
          setMicActive(false);
        }
      }, 30000);
    } catch {
      setMicActive(false);
      setMicSupported(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] bg-gradient-to-b from-night-start to-night-end flex flex-col items-center justify-center overflow-hidden">
      <StarField count={30} />
      <canvas ref={smokeRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }} />

      {/* Header */}
      <div className="absolute top-0 left-0 z-20 p-4">
        <button onClick={onBack} className="text-cream/70 hover:text-cream min-h-[44px] min-w-[44px] flex items-center">
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Cake */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* CSS Cake - Simple layered cake */}
          <div className="flex flex-col items-center">
            {/* Star on top */}
            <motion.div
              animate={blown ? { y: -20, opacity: 0, scale: 1.5 } : { y: 0 }}
              transition={{ duration: 0.6 }}
              className="z-10 mb-1"
            >
              {starImgError ? (
                <div className="w-16 h-16 rounded-full bg-warm-yellow img-fallback">⭐</div>
              ) : (
                <img
                  src="/images/star/star-main.png"
                  alt=""
                  className="w-16 h-16 object-contain drop-shadow-[0_0_10px_rgba(255,217,102,0.6)]"
                  onError={() => setStarImgError(true)}
                />
              )}
            </motion.div>

            {/* Candle + flame */}
            {!blown && (
              <div className="flex flex-col items-center mb-1">
                <div className="w-2 h-10 bg-cream rounded-t-full" />
                <div className="w-4 h-6 rounded-full bg-warm-yellow flame-flicker"
                  style={{
                    boxShadow: '0 0 15px rgba(255,217,102,0.7), 0 0 30px rgba(255,179,193,0.3)',
                    marginTop: -4,
                  }}
                />
              </div>
            )}

            {/* Cake layers */}
            <div className="w-48 h-10 bg-soft-pink/80 rounded-lg shadow-inner" />
            <div className="w-40 h-10 bg-warm-yellow/80 rounded-lg -mt-1 shadow-inner" />
            <div className="w-32 h-12 bg-soft-pink/80 rounded-lg -mt-1 shadow-inner flex items-center justify-center">
              <span className="text-night-start text-xs font-semibold">🎂 Happy Birthday</span>
            </div>
          </div>
        </motion.div>

        {/* Buttons */}
        {!blown ? (
          <div className="flex gap-4 flex-wrap justify-center">
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
                  micActive
                    ? 'bg-warm-yellow/10 text-warm-yellow border-warm-yellow/30'
                    : 'bg-transparent text-cream/70 border-cream/20 hover:border-cream/40'
                }`}
              >
                <Mic size={20} />
                {micActive ? '正在听...' : '吹气吹灭'}
              </button>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl text-warm-yellow font-semibold"
            >
              ✨ 愿望已收到 ✨
            </motion.p>
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