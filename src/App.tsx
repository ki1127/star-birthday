import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LockScreen from './pages/LockScreen';
import Welcome from './pages/Welcome';
import Memories from './pages/Memories';
import Day from './pages/Day';
import Letter from './pages/Letter';
import Cake3D from './pages/Cake3D';
import Fireworks from './pages/Fireworks';
import Camera from './pages/Camera';
import Final from './pages/Final';
import MusicPlayer from './components/MusicPlayer';
import StarDoubleClick from './components/StarDoubleClick';
import { content } from './data/content';

type Page =
  | 'lock'
  | 'welcome'
  | 'memories'
  | 'day'
  | 'letter'
  | 'cake'
  | 'fireworks'
  | 'camera'
  | 'final';

function App() {
  const [page, setPage] = useState<Page>('lock');
  const [unlocked, setUnlocked] = useState(false);

  const handleUnlock = () => {
    setUnlocked(true);
    setPage('welcome');
  };

  const navigate = (target: string) => setPage(target as Page);

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  // If not unlocked yet, show lock screen over everything
  if (!unlocked) {
    return <LockScreen onUnlock={handleUnlock} />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4 }}
          className="min-h-[100dvh]"
        >
          {page === 'welcome' && <Welcome onNavigate={navigate} />}
          {page === 'memories' && <Memories onBack={() => setPage('welcome')} />}
          {page === 'day' && <Day onBack={() => setPage('welcome')} />}
          {page === 'letter' && (
            <Letter onBack={() => setPage('welcome')} onNext={() => setPage('cake')} />
          )}
          {page === 'cake' && (
            <Cake3D onBack={() => setPage('welcome')} onNext={() => setPage('fireworks')} />
          )}
          {page === 'fireworks' && (
            <Fireworks
              onBack={() => setPage('welcome')}
              onCamera={() => setPage('camera')}
              onFinal={() => setPage('final')}
            />
          )}
          {page === 'camera' && <Camera onBack={() => setPage('fireworks')} />}
          {page === 'final' && <Final onRestart={() => setPage('welcome')} />}
        </motion.div>
      </AnimatePresence>

      {/* Global: Music player (hidden on lock screen) */}
      <MusicPlayer />

      {/* Global: Double-click star easter egg */}
      <StarDoubleClick starMainSrc={content.starMain} />
    </>
  );
}

export default App;