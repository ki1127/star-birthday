import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { content } from '../data/content';
import StarField from '../components/StarField';

interface LetterProps {
  onBack: () => void;
  onNext: () => void;
}

export default function Letter({ onBack, onNext }: LetterProps) {
  const [typed, setTyped] = useState('');
  const [typing, setTyping] = useState(true);
  const [starCount, setStarCount] = useState(0);

  // Typewriter with star triggers
  useEffect(() => {
    const lines = content.letter.split('\n');
    let charIndex = 0;
    let lineIndex = 0;
    let currentText = '';

    const timer = setInterval(() => {
      if (lineIndex < lines.length) {
        if (charIndex < lines[lineIndex].length) {
          currentText += lines[lineIndex][charIndex];
          charIndex++;
        } else {
          currentText += '\n';
          lineIndex++;
          charIndex = 0;
          // Light a star at paragraph break
          if (lines[lineIndex - 1]?.trim() === '') {
            setStarCount((prev) => prev + 1);
          }
        }
        setTyped(currentText);
      } else {
        setTyping(false);
        clearInterval(timer);
      }
    }, 60);
    return () => clearInterval(timer);
  }, []);

  const skipTyping = useCallback(() => {
    setTyped(content.letter);
    setStarCount(5);
    setTyping(false);
  }, []);

  return (
    <div className="relative min-h-[100dvh] bg-gradient-to-b from-night-start to-night-end">
      <StarField count={20} />

      {/* Header */}
      <div className="sticky top-0 z-20 bg-night-start/80 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center justify-between px-4 py-4 max-w-4xl mx-auto">
          <button onClick={onBack} className="text-cream/70 hover:text-cream min-h-[44px] min-w-[44px] flex items-center">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl text-cream font-semibold">想对你说的话</h2>
          <div className="w-[44px]" />
        </div>
      </div>

      {/* Letter */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="relative bg-gradient-to-br from-warm-yellow/10 via-cream/5 to-soft-pink/10 rounded-2xl p-8 md:p-12 border border-warm-yellow/20 shadow-lg">
          {/* Stars earned */}
          <div className="flex gap-1 mb-6">
            {Array.from({ length: Math.min(starCount, 8) }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Star size={16} className="text-warm-yellow twinkle" style={{ animationDelay: `${i * 0.3}s` }} />
              </motion.div>
            ))}
          </div>

          {/* Letter text - using 楷体 */}
          <div
            className="text-cream/85 leading-loose text-base md:text-lg whitespace-pre-line"
            style={{ fontFamily: "'FZKaiTi', 'KaiTi', serif", lineHeight: 2.2 }}
          >
            {typed}
            {typing && <span className="animate-pulse text-warm-yellow">|</span>}
          </div>

          {typing && (
            <button
              onClick={skipTyping}
              className="mt-6 text-xs text-warm-yellow/60 hover:text-warm-yellow underline"
            >
              显示全部
            </button>
          )}
        </div>

        {/* Next button */}
        {!typing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-8"
          >
            <button
              onClick={onNext}
              className="star-btn bg-warm-yellow text-night-start px-8 py-3 rounded-full font-semibold flex items-center gap-2 min-h-[44px]"
            >
              继续 <ArrowRight size={20} />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}