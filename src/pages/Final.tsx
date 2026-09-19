import { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { content } from '../data/content';
import StarField from '../components/StarField';
import confetti from 'canvas-confetti';

interface FinalProps {
  onRestart: () => void;
}

export default function Final({ onRestart }: FinalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const animRef = useRef<number>(0);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const launchFirework = useCallback((x: number, y: number) => {
    const colors = ['#FFD966', '#FFB3C1', '#FFF8E7', '#FFE4A0', '#FFC0CB'];
    const count = isMobile ? 30 : 60;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 4 + 2;
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1, maxLife: Math.random() * 0.5 + 0.5,
        size: Math.random() * 3 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }, [isMobile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const drawStar = (x: number, y: number, size: number, color: string, alpha: number) => {
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      const spikes = 5;
      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? size : size * 0.4;
        const angle = (i * Math.PI) / spikes - Math.PI / 2;
        const px = x + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter(p => p.life > 0);
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03;
        p.vx *= 0.99;
        p.life -= 0.008;
        drawStar(p.x, p.y, p.size, p.color, p.life / p.maxLife);
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    // Initial big burst
    setTimeout(() => launchFirework(canvas.width / 2, canvas.height * 0.3), 500);
    setTimeout(() => launchFirework(canvas.width * 0.3, canvas.height * 0.25), 800);
    setTimeout(() => launchFirework(canvas.width * 0.7, canvas.height * 0.25), 1000);

    // Confetti burst
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { x: 0.5, y: 0.4 },
        shapes: ['star'],
        colors: ['#FFD966', '#FFB3C1', '#FFF8E7'],
        scalar: 1.5,
      });
    }, 1500);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [launchFirework]);

  return (
    <div className="relative min-h-[100dvh] bg-black overflow-hidden flex flex-col items-center justify-center">
      <StarField count={40} />
      <canvas ref={canvasRef} className="absolute inset-0" style={{ zIndex: 2 }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-3xl md:text-5xl font-bold text-cream"
          style={{ textShadow: '0 0 30px rgba(255,217,102,0.5)' }}
        >
          {content.finalMessage}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="text-lg md:text-xl text-cream/70 max-w-md leading-relaxed"
        >
          {content.finalLine}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2.5 }}
          className="text-xl md:text-2xl text-warm-yellow font-light italic mt-4"
        >
          "{content.finalQuote}"
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.5 }}
          onClick={onRestart}
          className="star-btn bg-warm-yellow text-night-start px-8 py-3 rounded-full font-semibold flex items-center gap-2 min-h-[44px] mt-4"
        >
          <RotateCcw size={20} /> 再玩一次
        </motion.button>
      </div>
    </div>
  );
}