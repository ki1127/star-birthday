import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Snowflake } from 'lucide-react';
import { content } from '../data/content';
import { useSnowField } from '../hooks/useSnowField';
import TouchTrail from '../components/TouchTrail';
import AlbumCarousel from '../components/AlbumCarousel';
import { snowPool } from '../utils/transitions';

interface DayProps {
  onBack: () => void;
}

export default function Day({ onBack }: DayProps) {
  const snowCanvasRef = useRef<HTMLCanvasElement>(null);
  const [typed, setTyped] = useState('');
  const [typing, setTyping] = useState(true);
  const storyRef = useRef<HTMLDivElement>(null);

  useSnowField(snowCanvasRef, 70);

  // Typewriter effect
  useEffect(() => {
    const story = content.dayStory;
    let i = 0;
    setTyped('');
    setTyping(true);
    const timer = setInterval(() => {
      if (i < story.length) {
        setTyped(story.slice(0, i + 1));
        i++;
      } else {
        setTyping(false);
        clearInterval(timer);
      }
    }, 80);
    return () => clearInterval(timer);
  }, []);

  const skipTyping = useCallback(() => {
    setTyped(content.dayStory);
    setTyping(false);
  }, []);

  return (
    <div className="relative min-h-[100dvh] overflow-hidden">
      {/* Snow background layer */}
      <div className="absolute inset-0">
        {content.dayPhotos.length > 0 && (
          <img
            src={content.dayPhotos[0].src}
            alt=""
            className="w-full h-full object-cover blur-sm"
            style={{ filter: 'blur(8px) brightness(0.3) saturate(0.5)' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-snow-blue/20 via-night-start/40 to-night-end/60" />
      </div>

      {/* Snow canvas */}
      <canvas ref={snowCanvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} />

      {/* Snow touch trail */}
      <TouchTrail shape="snow" className="z-[91]" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-transparent backdrop-blur-sm border-b border-white/5">
          <div className="flex items-center gap-4 px-4 py-4 max-w-4xl mx-auto">
            <button onClick={onBack} className="text-cream/70 hover:text-cream min-h-[44px] min-w-[44px] flex items-center">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h2 className="frost-text text-2xl md:text-3xl font-bold">{content.dayTitle}</h2>
              <p className="text-snow-blue/60 text-sm">{content.daySubtitle}</p>
            </div>
          </div>
        </div>

        {/* Timeline center line */}
        <div className="absolute left-1/2 top-32 bottom-0 w-px bg-gradient-to-b from-snow-blue/30 via-snow-blue/10 to-transparent hidden md:block" />

        {/* Photo album */}
        <div className="max-w-3xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <AlbumCarousel photos={content.dayPhotos} pool={snowPool} />
          </motion.div>
        </div>

        {/* Story section */}
        <div ref={storyRef} className="max-w-2xl mx-auto px-6 py-12">
          <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-10 border border-white/10">
            <Snowflake size={24} className="text-snow-blue/60 mb-4" />
            <div className="text-cream/80 leading-relaxed text-base md:text-lg whitespace-pre-line">
              {typed}
              {typing && <span className="animate-pulse text-snow-blue">|</span>}
            </div>
            {typing && (
              <button
                onClick={skipTyping}
                className="mt-4 text-xs text-snow-blue/60 hover:text-snow-blue underline"
              >
                显示全部
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}