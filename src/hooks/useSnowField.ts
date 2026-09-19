import { useEffect, useRef, useCallback } from 'react';

interface Snowflake {
  x: number;
  y: number;
  size: number;
  speed: number;
  wind: number;
  opacity: number;
  isHex: boolean;
  rotation: number;
  rotationSpeed: number;
}

export function useSnowField(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  count: number = 60,
) {
  const flakesRef = useRef<Snowflake[]>([]);
  const animRef = useRef<number>(0);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const initFlakes = useCallback(
    (width: number, height: number) => {
      const n = isMobile ? Math.floor(count / 2) : count;
      flakesRef.current = Array.from({ length: n }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 4 + 1.5,
        speed: Math.random() * 0.8 + 0.3,
        wind: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.4,
        isHex: Math.random() < 0.1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      }));
    },
    [count, isMobile],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initFlakes(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const drawHexSnowflake = (x: number, y: number, size: number, rotation: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        const ax = Math.cos(angle) * size;
        const ay = Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(ax, ay);
        else ctx.lineTo(ax, ay);
        // Branch
        const bx = Math.cos(angle) * size * 0.5;
        const by = Math.sin(angle) * size * 0.5;
        ctx.moveTo(bx, by);
        ctx.lineTo(
          bx + Math.cos(angle + 0.5) * size * 0.3,
          by + Math.sin(angle + 0.5) * size * 0.3,
        );
        ctx.moveTo(bx, by);
        ctx.lineTo(
          bx + Math.cos(angle - 0.5) * size * 0.3,
          by + Math.sin(angle - 0.5) * size * 0.3,
        );
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();
    };

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const f of flakesRef.current) {
        f.y += f.speed;
        f.x += f.wind + Math.sin(f.y * 0.01) * 0.2;
        f.rotation += f.rotationSpeed;
        if (f.y > canvas.height + 10) {
          f.y = -10;
          f.x = Math.random() * canvas.width;
        }
        if (f.x > canvas.width + 10) f.x = -10;
        if (f.x < -10) f.x = canvas.width + 10;

        if (f.isHex && f.size > 2.5) {
          drawHexSnowflake(f.x, f.y, f.size, f.rotation, f.opacity);
        } else {
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
          ctx.fill();
          // Glow
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(214, 232, 245, ${f.opacity * 0.3})`;
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef, initFlakes]);
}