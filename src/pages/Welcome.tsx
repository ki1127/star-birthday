import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Cake, MessageCircleHeart, Image, Snowflake, Sparkles, ChevronDown, Star } from 'lucide-react';
import { content } from '../data/content';
import StarField from '../components/StarField';
import Lenis from 'lenis';

interface WelcomeProps {
  onNavigate: (page: string) => void;
}

const navCards = [
  { id: 'memories', icon: Image, label: '我们的回忆', color: 'from-soft-pink/20 to-soft-pink/5' },
  { id: 'day', icon: Snowflake, label: '初雪那一天', color: 'from-snow-blue/20 to-snow-blue/5' },
  { id: 'letter', icon: MessageCircleHeart, label: '想对你说的话', color: 'from-warm-yellow/20 to-warm-yellow/5' },
  { id: 'cake', icon: Cake, label: '生日蛋糕', color: 'from-soft-pink/20 to-warm-yellow/5' },
  { id: 'fireworks', icon: Sparkles, label: '一起看烟花', color: 'from-warm-yellow/20 to-soft-pink/5' },
  { id: 'camera', icon: Camera, label: '打开摄像头合影', color: 'from-cream/10 to-cream/5' },
];

export default function Welcome({ onNavigate }: WelcomeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bgIndex, setBgIndex] = useState(0);
  const [bgError, setBgError] = useState(false);
  const [friendImgError, setFriendImgError] = useState(false);
  const [starImgError, setStarImgError] = useState(false);

  // Background carousel
  useEffect(() => {
    if (bgError) return;
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % content.backgrounds.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bgError]);

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)) });
    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-[100dvh] overflow-hidden">
      <StarField count={35} />

      {/* Background carousel */}
      <div className="absolute inset-0 transition-opacity duration-1000">
        {!bgError && (
          <img
            key={bgIndex}
            src={content.backgrounds[bgIndex]}
            alt=""
            className="w-full h-full object-cover scale-105"
            style={{ filter: 'blur(1px) brightness(0.5)' }}
            onError={() => setBgError(true)}
          />
        )}
        {bgError && <div className="w-full h-full bg-gradient-to-b from-night-start to-night-end" />}
      </div>

      {/* Moon */}
      <div className="absolute top-8 left-[10%] md:top-12 md:left-[15%] moon opacity-80" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-4 py-16">
        {/* Friend photo + star */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex items-center gap-6 mb-10"
        >
          <div
            className="rounded-full overflow-hidden border-4 border-warm-yellow/40"
            style={{
              width: 'clamp(120px, 22vw, 200px)',
              height: 'clamp(120px, 22vw, 200px)',
              boxShadow: '0 0 30px rgba(255,217,102,0.4)',
            }}
          >
            {friendImgError ? (
              <div className="w-full h-full img-fallback">⭐</div>
            ) : (
              <img
                src={content.friendPhoto}
                alt=""
                className="w-full h-full object-cover"
                onError={() => setFriendImgError(true)}
              />
            )}
          </div>

          {/* Star character */}
          <div className="breathe sway">
            {starImgError ? (
              <div
                className="rounded-full img-fallback flex items-center justify-center"
                style={{ width: 80, height: 80 }}
              >
                <Star size={40} className="text-warm-yellow" />
              </div>
            ) : (
              <img
                src={content.starMain}
                alt=""
                className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-[0_0_20px_rgba(255,217,102,0.5)]"
                onError={() => setStarImgError(true)}
              />
            )}
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-4xl md:text-6xl font-bold text-cream text-center mb-2"
          style={{ textShadow: '0 0 30px rgba(255,217,102,0.4)' }}
        >
          {content.mainTitle}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-xl md:text-2xl text-cream/70 mb-2"
        >
          {content.subTitle}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-sm text-cream/50 mb-12"
        >
          今年生日刚好是中秋 🌕
        </motion.p>

        {/* Nav cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-2xl px-4"
        >
          {navCards.map((card) => (
            <motion.button
              key={card.id}
              onClick={() => onNavigate(card.id)}
              className={`star-btn bg-gradient-to-br ${card.color} rounded-2xl p-5 border border-white/10 flex items-center gap-4 min-h-[44px] text-left`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <card.icon size={28} className="text-warm-yellow flex-shrink-0" />
              <span className="text-cream font-medium">{card.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 flex flex-col items-center gap-2"
        >
          <span className="text-cream/40 text-sm">向下探索</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown size={20} className="text-cream/40" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}