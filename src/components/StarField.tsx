import { useRef } from 'react';
import { useStarField, useShootingStars } from '../hooks/useStarField';

interface StarFieldProps {
  count?: number;
  className?: string;
}

export default function StarField({ count = 40, className = '' }: StarFieldProps) {
  const starCanvas = useRef<HTMLCanvasElement>(null);
  const shootCanvas = useRef<HTMLCanvasElement>(null);

  useStarField(starCanvas, count);
  useShootingStars(shootCanvas);

  return (
    <>
      <canvas
        ref={starCanvas}
        className={`fixed inset-0 pointer-events-none ${className}`}
        style={{ zIndex: 0 }}
      />
      <canvas
        ref={shootCanvas}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />
    </>
  );
}