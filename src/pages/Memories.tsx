import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, GraduationCap, Building2 } from 'lucide-react';
import { content } from '../data/content';
import AlbumCarousel from '../components/AlbumCarousel';
import StarField from '../components/StarField';

interface MemoriesProps {
  onBack: () => void;
}

const tabs = [
  { id: 'couple', label: '我们的合照', icon: Users, photos: content.couplePhotos },
  { id: 'class', label: '那年的我们', icon: GraduationCap, photos: content.classPhotos },
  { id: 'school', label: '母校的四季', icon: Building2, photos: content.schoolPhotos },
];

export default function Memories({ onBack }: MemoriesProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="relative min-h-[100dvh] bg-gradient-to-b from-night-start to-night-end">
      <StarField count={25} />

      {/* Header */}
      <div className="sticky top-0 z-20 bg-night-start/80 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center gap-4 px-4 py-4 max-w-4xl mx-auto">
          <button onClick={onBack} className="text-cream/70 hover:text-cream min-h-[44px] min-w-[44px] flex items-center">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl md:text-2xl text-cream font-semibold">我们的回忆</h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-1 md:gap-4 px-4 pb-4">
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm md:text-base transition-all min-h-[44px] ${
                i === activeTab
                  ? 'bg-warm-yellow/20 text-warm-yellow border border-warm-yellow/30'
                  : 'text-cream/50 hover:text-cream/80'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Album */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AlbumCarousel photos={tabs[activeTab].photos} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}