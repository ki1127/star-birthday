import { useEffect, useRef, useCallback } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export function useStarField(canvasRef: React.RefObject<HTMLCanvasElement | null>, count: number = 40) {
  const starsRef = useRef<Star[]>([]);
  const animRef = useRef<number>(0);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const initStars = useCallback((width: number, height: number) => {
    const n = isMobile ? Math.floor(count / 2) : count;
    starsRef.current = Array.from({ length: n }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.5 + 0.15,
      opacity: Math.random() * 0.6 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));
  }, [count, isMobile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    let frame = 0;
    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      for (const s of starsRef.current) {
        s.y += s.speed;
        if (s.y > canvas.height + 5) {
          s.y = -5;
          s.x = Math.random() * canvas.width;
        }
        const twinkle = Math.sin(frame * s.twinkleSpeed + s.twinkleOffset) * 0.3 + 0.7;
        const alpha = s.opacity * twinkle;

        // Glow
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 217, 102, ${alpha * 0.3})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 248, 231, ${alpha})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef, initStars]);
}

// Shooting star
export function useShootingStars(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let shooting: { x: number; y: number; vx: number; vy: number; life: number; trail: {x:number;y:number}[] } | null = null;

    const spawnShooting = () => {
      const w = canvas.width;
      const h = canvas.height;
      shooting = {
        x: Math.random() * w * 0.8,
        y: Math.random() * h * 0.3,
        vx: 3 + Math.random() * 4,
        vy: 2 + Math.random() * 3,
        life: 60 + Math.random() * 40,
        trail: [],
      };
    };

    // Spawn one immediately, then every 5-8s
    const spawnTimer = setInterval(spawnShooting, 5000 + Math.random() * 3000);
    setTimeout(spawnShooting, 2000);

    let frame = 0;
    const draw = () => {
      if (!ctx || !canvas) return;
      // We only clear the shooting star's area, not the whole canvas
      // Actually we redraw the whole scene - stars are on a separate canvas
      // Let's use a simpler approach - just draw on top
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      if (shooting) {
        shooting.trail.push({ x: shooting.x, y: shooting.y });
        if (shooting.trail.length > 20) shooting.trail.shift();
        shooting.x += shooting.vx;
        shooting.y += shooting.vy;
        shooting.life--;

        // Draw trail
        if (shooting.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(shooting.trail[0].x, shooting.trail[0].y);
          for (let i = 1; i < shooting.trail.length; i++) {
            ctx.lineTo(shooting.trail[i].x, shooting.trail[i].y);
          }
          ctx.lineTo(shooting.x, shooting.y);
          ctx.strokeStyle = `rgba(255, 248, 231, ${Math.min(shooting.life / 30, 1) * 0.8})`;
          ctx.lineWidth = 2;
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(255, 217, 102, 0.6)';
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        if (shooting.life <= 0) shooting = null;
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      clearInterval(spawnTimer);
    };
  }, [canvasRef]);
}