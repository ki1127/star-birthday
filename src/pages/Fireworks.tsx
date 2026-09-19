import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Heart } from 'lucide-react';
import StarField from '../components/StarField';

interface FireworksProps {
  onBack: () => void;
  onCamera: () => void;
  onFinal: () => void;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number; color: string;
}

const quotes = ["Stars can't shine without darkness.", '生日快乐！', '今天你是主角 🌟'];

export default function Fireworks({ onBack, onCamera, onFinal }: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const launchFirework = useCallback((x: number, y: number) => {
    const colors = ['#FFD966', '#FFB3C1', '#FFF8E7', '#FFE4A0', '#FFC0CB'];
    const count = isMobile ? 40 : 80;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 4 + 2;
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: Math.random() * 0.5 + 0.5,
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
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
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
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter(p => p.life > 0);

      for (const p of particlesRef.current) {
        // Draw trail first
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = (p.life / p.maxLife) * 0.3;
        ctx.fill();
      }

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

    // Auto launch timer
    const autoTimer = setInterval(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight * 0.6;
      launchFirework(x, y);
    }, isMobile ? 2000 : 1500);

    // Click to launch
    const handleClick = (e: MouseEvent) => {
      launchFirework(e.clientX, e.clientY);
    };
    canvas.addEventListener('click', handleClick);

    // Initial burst
    launchFirework(window.innerWidth / 2, window.innerHeight * 0.3);

    return () => {
      cancelAnimationFrame(animRef.current);
      clearInterval(autoTimer);
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('resize', resize);
    };
  }, [launchFirework, isMobile]);

  // Quote rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => {
        const idx = quotes.indexOf(prev);
        return quotes[(idx + 1) % quotes.length];
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-[100dvh] bg-black overflow-hidden">
      <StarField count={20} />
      <canvas ref={canvasRef} className="absolute inset-0" style={{ zIndex: 2 }} />

      {/* Header */}
      <div className="absolute top-0 left-0 z-20 p-4 flex gap-2">
        <button onClick={onBack} className="text-cream/70 hover:text-cream min-h-[44px] min-w-[44px] flex items-center">
          <ArrowLeft size={24} />
        </button>
        <button
          onClick={onCamera}
          className="star-btn bg-cream/10 text-cream/70 hover:text-cream px-4 py-2 rounded-full flex items-center gap-2 min-h-[44px] border border-cream/20"
        >
          <Camera size={18} /> 打开摄像头
        </button>
        <button
          onClick={onFinal}
          className="star-btn bg-warm-yellow/80 text-night-start px-4 py-2 rounded-full font-semibold flex items-center gap-2 min-h-[44px]"
        >
          <Heart size={18} /> 最后祝福
        </button>
      </div>

      {/* Quote */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuote}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 1.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center"
        >
          <p className="text-2xl md:text-4xl text-cream font-light" style={{ textShadow: '0 0 20px rgba(255,217,102,0.5)' }}>
            {currentQuote}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}