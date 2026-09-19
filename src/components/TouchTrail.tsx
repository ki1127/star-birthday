import { useEffect, useRef, useCallback } from 'react';

interface TouchTrailProps {
  color?: string;
  shape?: 'star' | 'snow';
  className?: string;
}

export default function TouchTrail({ color = 'rgba(255,217,102,', shape = 'star', className = '' }: TouchTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailsRef = useRef<{ x: number; y: number; life: number; size: number }[]>([]);
  const animRef = useRef<number>(0);

  const addTrail = useCallback((x: number, y: number) => {
    for (let i = 0; i < 2; i++) {
      trailsRef.current.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        life: 1,
        size: shape === 'star' ? Math.random() * 8 + 4 : Math.random() * 6 + 2,
      });
    }
  }, [shape]);

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

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e) {
        for (let i = 0; i < e.touches.length; i++) {
          addTrail(e.touches[i].clientX, e.touches[i].clientY);
        }
      } else {
        addTrail(e.clientX, e.clientY);
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: true });

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      trailsRef.current = trailsRef.current.filter((t) => {
        t.life -= 0.02;
        t.size *= 0.98;
        return t.life > 0;
      });

      for (const t of trailsRef.current) {
        ctx.beginPath();
        if (shape === 'star') {
          // Draw 5-pointed star
          const spikes = 5;
          const outerR = t.size;
          const innerR = t.size * 0.4;
          for (let i = 0; i < spikes * 2; i++) {
            const r = i % 2 === 0 ? outerR : innerR;
            const angle = (i * Math.PI) / spikes - Math.PI / 2;
            const px = t.x + Math.cos(angle) * r;
            const py = t.y + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
        } else {
          ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
        }
        ctx.fillStyle = shape === 'star'
          ? `${color}${t.life * 0.6})`
          : `rgba(255,255,255,${t.life * 0.5})`;
        ctx.fill();
        // Glow
        ctx.shadowBlur = shape === 'star' ? 12 : 8;
        ctx.shadowColor = shape === 'star' ? 'rgba(255,217,102,0.5)' : 'rgba(255,255,255,0.4)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, [addTrail, color, shape]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 90 }}
    />
  );
}