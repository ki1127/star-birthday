import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StarDoubleClickProps {
  starMainSrc: string;
}

export default function StarDoubleClick({ starMainSrc }: StarDoubleClickProps) {
  const [spawns, setSpawns] = useState<{ id: number; x: number; y: number; side: 'left' | 'right' | 'top' | 'bottom' }[]>([]);
  const idRef = useRef(0);
  const [imgError, setImgError] = useState(false);

  const spawnStar = useCallback((x: number, y: number) => {
    const sides: ('left' | 'right' | 'top' | 'bottom')[] = ['left', 'right', 'top', 'bottom'];
    const side = sides[Math.floor(Math.random() * sides.length)];
    const id = idRef.current++;
    setSpawns((prev) => [...prev.slice(-2), { id, x, y, side }]);
    setTimeout(() => {
      setSpawns((prev) => prev.filter((s) => s.id !== id));
    }, 1500);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.detail === 2) {
        spawnStar(e.clientX, e.clientY);
      }
    };
    window.addEventListener('dblclick', handler);
    return () => window.removeEventListener('dblclick', handler);
  }, [spawnStar]);

  const getStartPos = (side: 'left' | 'right' | 'top' | 'bottom') => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    switch (side) {
      case 'left': return { x: -80, y: h * 0.5 };
      case 'right': return { x: w + 80, y: h * 0.5 };
      case 'top': return { x: w * 0.5, y: -80 };
      case 'bottom': return { x: w * 0.5, y: h + 80 };
    }
  };

  if (imgError) return null;

  return (
    <AnimatePresence>
      {spawns.map((s) => {
        const start = getStartPos(s.side);
        return (
          <motion.div
            key={s.id}
            initial={{ x: start.x, y: start.y, opacity: 0, scale: 0, rotate: -30 }}
            animate={{
              x: s.x,
              y: s.y,
              opacity: [0, 1, 1, 0],
              scale: [0, 1.2, 1, 0.3],
              rotate: [0, 10, -10, 0],
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="fixed pointer-events-none z-50"
            style={{ width: 80, height: 80, marginLeft: -40, marginTop: -40 }}
          >
            <img
              src={starMainSrc}
              alt=""
              className="w-full h-full object-contain"
              onError={() => setImgError(true)}
            />
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}