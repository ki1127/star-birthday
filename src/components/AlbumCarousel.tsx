import { useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import type { PhotoItem } from '../data/content';
import { getRandomTransition, generalPool } from '../utils/transitions';
import type { TransitionEffect } from '../utils/transitions';

interface AlbumCarouselProps {
  photos: PhotoItem[];
  pool?: TransitionEffect[];
  className?: string;
}

export default function AlbumCarousel({
  photos,
  pool = generalPool,
  className = '',
}: AlbumCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [direction, setDirection] = useState(1);
  const [transition, setTransition] = useState<TransitionEffect>(pool[0]);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());

  const goTo = useCallback(
    (idx: number, dir?: number) => {
      if (idx >= 0 && idx < photos.length && idx !== current) {
        const d = dir ?? (idx > current ? 1 : -1);
        setDirection(d);
        setTransition(getRandomTransition(pool, transition.name));
        setCurrent(idx);
      }
    },
    [current, photos.length, pool, transition.name],
  );

  const next = () => goTo((current + 1) % photos.length, 1);
  const prev = () => goTo((current - 1 + photos.length) % photos.length, -1);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;

    if (fullscreen) {
      if (dy > 80) setFullscreen(false);
      else if (Math.abs(dx) > 50) dx > 0 ? prev() : next();
    } else {
      if (Math.abs(dx) > 50) dx > 0 ? prev() : next();
    }
    touchStart.current = null;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (fullscreen) {
      if (e.deltaX > 30 || e.deltaY > 30) next();
      else if (e.deltaX < -30 || e.deltaY < -30) prev();
    }
  };

  const handleImgError = (idx: number) => {
    setImgErrors((prev) => new Set(prev).add(idx));
  };

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-cream/50 text-sm">
        📷 暂无照片，请将照片放入对应文件夹
      </div>
    );
  }

  const currentPhoto = photos[current];

  const currentVariants: Record<string, any> = {
    enter: (dir: number) => {
      try {
        const v = (transition.variants as any).enter;
        return typeof v === 'function' ? v(dir) : v;
      } catch { return transition.variants.enter; }
    },
    center: transition.variants.center,
    exit: (dir: number) => {
      try {
        const v = (transition.variants as any).exit;
        return typeof v === 'function' ? v(dir) : v;
      } catch { return transition.variants.exit; }
    },
  };

  return (
    <div className={`${className}`}>
      {/* Main carousel */}
      <div
        className="relative w-full overflow-hidden rounded-2xl"
        style={{ aspectRatio: '4/3', maxHeight: fullscreen ? '100dvh' : '60dvh' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={currentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            {imgErrors.has(current) ? (
              <div className="w-full h-full img-fallback flex-col gap-2">
                <span className="text-3xl">📷</span>
                <span>{currentPhoto.src.split('/').pop()}</span>
              </div>
            ) : (
              <img
                src={currentPhoto.src}
                alt={currentPhoto.caption || `照片 ${current + 1}`}
                className="w-full h-full object-contain bg-black/40"
                loading="lazy"
                onError={() => handleImgError(current)}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Nav arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-cream hover:bg-black/50 transition-all min-h-[44px] min-w-[44px]"
          aria-label="上一张"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-cream hover:bg-black/50 transition-all min-h-[44px] min-w-[44px]"
          aria-label="下一张"
        >
          <ChevronRight size={24} />
        </button>

        {/* Fullscreen toggle */}
        <button
          onClick={() => setFullscreen(!fullscreen)}
          className="absolute top-3 right-12 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-cream hover:bg-black/50 transition-all min-h-[44px] min-w-[44px]"
          aria-label="全屏"
        >
          <Maximize2 size={18} />
        </button>

        {/* Counter */}
        <div className="absolute bottom-3 left-3 bg-black/40 rounded-full px-3 py-1 text-xs text-cream">
          {current + 1} / {photos.length}
        </div>
      </div>

      {/* Caption */}
      {currentPhoto.caption && (
        <p className="text-center text-cream/70 text-sm mt-3">{currentPhoto.caption}</p>
      )}

      {/* Thumbnails */}
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2 justify-center">
        {photos.map((photo, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`album-thumb flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden ${
              i === current ? 'active' : ''
            }`}
          >
            {imgErrors.has(i) ? (
              <div className="w-full h-full img-fallback text-[10px]">📷</div>
            ) : (
              <img
                src={photo.src}
                alt={photo.caption || `缩略图 ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={() => handleImgError(i)}
              />
            )}
          </button>
        ))}
      </div>

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
          >
            <button
              onClick={() => setFullscreen(false)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white z-10 min-h-[44px] min-w-[44px]"
            >
              <X size={28} />
            </button>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`fs-${current}`}
                custom={direction}
                variants={currentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-4 flex items-center justify-center"
              >
                {imgErrors.has(current) ? (
                  <div className="img-fallback w-2/3 h-2/3 flex-col gap-4 text-xl">
                    📷 {currentPhoto.src.split('/').pop()}
                  </div>
                ) : (
                  <img
                    src={currentPhoto.src}
                    alt={currentPhoto.caption || `照片 ${current + 1}`}
                    className="max-w-full max-h-full object-contain"
                    onError={() => handleImgError(current)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 rounded-full px-4 py-2 text-sm text-cream">
              {current + 1} / {photos.length}
              {currentPhoto.caption && ` - ${currentPhoto.caption}`}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}