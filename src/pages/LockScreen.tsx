import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { content } from '../data/content';
import StarField from '../components/StarField';

interface LockScreenProps {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [input, setInput] = useState('');
  const [shake, setShake] = useState(false);
  const [error, setError] = useState('');
  const [unlocking, setUnlocking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const normalized = input.trim().toLowerCase();
    const expected = content.lockAnswer.toLowerCase();
    if (normalized === expected) {
      setUnlocking(true);
      setTimeout(onUnlock, 800);
    } else {
      setShake(true);
      setError(content.lockHint);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <AnimatePresence>
      {!unlocking && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.2, filter: 'blur(8px)' }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-b from-night-start to-night-end overflow-hidden"
          style={{ minHeight: '100dvh' }}
        >
          <StarField count={50} />

          {/* Background: bg-1.jpg - subtle blur, higher opacity */}
          <div className="absolute inset-0 opacity-40">
            <img
              src="/images/backgrounds/bg-1.jpg"
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: 'blur(2px) brightness(0.6)' }}
              loading="eager"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 px-6 w-full max-w-4xl">
            {/* Left: Big photo */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-shrink-0"
            >
              <div
                className="relative rounded-full overflow-hidden"
                style={{
                  width: 'clamp(160px, 30vw, 300px)',
                  height: 'clamp(160px, 30vw, 300px)',
                  boxShadow: '0 0 40px rgba(255,217,102,0.3), 0 0 80px rgba(255,179,193,0.2)',
                }}
              >
                <img
                  src={content.friendPhoto}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="eager"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = 'none';
                    if (el.parentElement) {
                      el.parentElement.classList.add('img-fallback');
                      el.parentElement.innerHTML = '<span style="font-size:40px">⭐</span>';
                    }
                  }}
                />
              </div>
            </motion.div>

            {/* Right: Password form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col items-center md:items-start gap-6"
            >
              <motion.div
                animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="text-center md:text-left"
              >
                <h2 className="text-2xl md:text-3xl text-cream font-semibold mb-2">
                  🌟 欢迎来到星星派对
                </h2>
                <p className="text-cream/70 text-lg">{content.lockQuestion}</p>
              </motion.div>

              <div className="flex gap-3 w-full max-w-[300px]">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setError(''); }}
                  onKeyDown={handleKeyDown}
                  className="lock-input flex-1"
                  placeholder="输入答案..."
                  autoFocus
                />
                <button
                  onClick={handleSubmit}
                  className="star-btn bg-warm-yellow text-night-start px-6 py-3 rounded-full font-semibold min-h-[44px]"
                >
                  开门
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-soft-pink text-sm"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}