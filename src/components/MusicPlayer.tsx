import { useRef, useState, useCallback, useEffect } from 'react';
import { Music, Pause } from 'lucide-react';
import { content } from '../data/content';

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.7;
    audioRef.current = audio;

    const onCanPlay = () => setLoading(false);
    const onError = () => setHasError(true);
    audio.addEventListener('canplaythrough', onCanPlay);
    audio.addEventListener('error', onError);
    audio.src = content.music;
    audio.load();

    return () => {
      audio.pause();
      audio.removeEventListener('canplaythrough', onCanPlay);
      audio.removeEventListener('error', onError);
      audio.remove();
    };
  }, []);

  const toggle = useCallback(() => {
    if (!audioRef.current || hasError || loading) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => setHasError(true));
    }
  }, [playing, hasError, loading]);

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