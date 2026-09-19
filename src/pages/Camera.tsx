import { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CameraIcon, Zap, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CameraProps {
  onBack: () => void;
}

export default function Camera({ onBack }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const starCanvasRef = useRef<HTMLCanvasElement>(null);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState('');
  const [flash, setFlash] = useState(false);
  const [frameError] = useState(false);
  const animRef = useRef<number>(0);

  // Star overlay animation on video
  useEffect(() => {
    if (!started) return;
    const canvas = starCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const stars: { x: number; y: number; size: number; speed: number; opacity: number; phase: number }[] = [];
    for (let i = 0; i < 15; i++) {
      stars.push({
        x: Math.random() * 400,
        y: Math.random() * 400,
        size: Math.random() * 6 + 3,
        speed: Math.random() * 0.4 + 0.2,
        opacity: Math.random() * 0.6 + 0.3,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let frame = 0;
    const draw = () => {
      if (!ctx || !canvas) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      frame++;

      for (const s of stars) {
        s.y += s.speed;
        if (s.y > h + 10) { s.y = -10; s.x = Math.random() * w; }
        const twinkle = Math.sin(frame * 0.03 + s.phase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 248, 231, ${s.opacity * twinkle})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 217, 102, ${s.opacity * twinkle * 0.3})`;
        ctx.fill();
      }

      // Star frame overlay
      if (!frameError) {
        ctx.strokeStyle = 'rgba(255, 217, 102, 0.3)';
        ctx.lineWidth = 2;
        const margin = 20;
        ctx.beginPath();
        ctx.roundRect(margin, margin, w - margin * 2, h - margin * 2, 12);
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [started, frameError]);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStarted(true);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
    } catch (err: any) {
      setError(err.message || '无法访问摄像头');
      setStarted(true); // Show the downgraded view
    }
  };

  const takePhoto = useCallback(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    // Flash effect
    setFlash(true);
    setTimeout(() => setFlash(false), 300);

    // Composite to canvas
    const compositeCanvas = document.createElement('canvas');
    compositeCanvas.width = video.videoWidth || 640;
    compositeCanvas.height = video.videoHeight || 480;
    const ctx = compositeCanvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, compositeCanvas.width, compositeCanvas.height);

    // If star canvas has content, draw it on top
    if (starCanvasRef.current) {
      ctx.drawImage(starCanvasRef.current, 0, 0, compositeCanvas.width, compositeCanvas.height);
    }

    // Download
    const link = document.createElement('a');
    link.download = `birthday-photo-${Date.now()}.png`;
    link.href = compositeCanvas.toDataURL('image/png');
    link.click();
  }, []);

  const fireworkOnCamera = useCallback(() => {
    confetti({
      particleCount: 40,
      spread: 80,
      origin: { x: 0.5, y: 0.6 },
      shapes: ['star'],
      colors: ['#FFD966', '#FFB3C1', '#FFF8E7'],
      scalar: 0.8,
    });
  }, []);

  return (
    <div className="relative min-h-[100dvh] bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Flash overlay */}
      {flash && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-white z-50 pointer-events-none"
        />
      )}

      {/* Header */}
      <div className="absolute top-0 left-0 z-20 p-4">
        <button onClick={onBack} className="text-cream/70 hover:text-cream min-h-[44px] min-w-[44px] flex items-center">
          <ArrowLeft size={24} />
        </button>
      </div>

      {!started ? (
        <div className="flex flex-col items-center gap-6 z-10 px-4">
          <CameraIcon size={64} className="text-warm-yellow/60" />
          <p className="text-cream/60 text-center">点击下方按钮打开摄像头</p>
          <button
            onClick={startCamera}
            className="star-btn bg-warm-yellow text-night-start px-8 py-3 rounded-full font-semibold flex items-center gap-2 min-h-[44px]"
          >
            <CameraIcon size={20} /> 打开摄像头
          </button>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-6 z-10 px-4 text-center">
          <Sparkles size={64} className="text-soft-pink/60" />
          <p className="text-cream/60">摄像头不可用 😅</p>
          <p className="text-cream/40 text-sm max-w-xs">{error}</p>
          <p className="text-warm-yellow/60">试试星光照相亭模式吧～</p>
          {/* Downgraded mode: just a star animation */}
          <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-warm-yellow/10 to-soft-pink/10 border border-warm-yellow/20 flex items-center justify-center">
            <span className="text-6xl animate-breathe">⭐</span>
          </div>
        </div>
      ) : (
        <div className="relative w-full max-w-lg mx-auto">
          {/* Video */}
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full object-cover camera-frame"
            style={{ transform: 'scaleX(-1)', aspectRatio: '4/3' }}
          />

          {/* Star overlay */}
          <canvas
            ref={starCanvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 2 }}
            width={400}
            height={300}
          />

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={takePhoto}
              className="star-btn bg-cream text-night-start px-6 py-3 rounded-full font-semibold flex items-center gap-2 min-h-[44px]"
            >
              <CameraIcon size={20} /> 拍照
            </button>
            <button
              onClick={fireworkOnCamera}
              className="star-btn bg-soft-pink/80 text-night-start px-6 py-3 rounded-full font-semibold flex items-center gap-2 min-h-[44px]"
            >
              <Zap size={20} /> 放烟花
            </button>
          </div>
        </div>
      )}
    </div>
  );
}