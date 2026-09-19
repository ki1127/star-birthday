import { useRef, useState, useCallback, useEffect } from 'react';
import { Music, Pause } from 'lucide-react';
import { content } from '../data/content';

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = new Audio(content.music);
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;
    audio.addEventListener('error', () => setHasError(true));
    return () => {
      audio.pause();
      audio.remove();
    };
  }, []);

  const toggle = useCallback(() => {
    if (!audioRef.current || hasError) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => setHasError(true));
    }
    setPlaying(!playing);
  }, [playing, hasError]);

  if (hasError) return null;

  return (
    <button
      onClick={toggle}
      className={`music-btn ${playing ? 'playing' : ''}`}
      aria-label={playing ? '暂停音乐' : '播放音乐'}
    >
      {playing ? <Pause size={20} /> : <Music size={20} />}
    </button>
  );
}