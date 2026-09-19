import type { Variants } from 'framer-motion';

// ==================== 通用过渡效果池 ====================

export const fadeScale: Variants = {
  enter: { opacity: 0, scale: 0.8, filter: 'blur(4px)' },
  center: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 1.2, filter: 'blur(4px)' },
};

export const slideIn: Variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

export const flip3D: Variants = {
  enter: { rotateY: -90, opacity: 0, scale: 0.9 },
  center: { rotateY: 0, opacity: 1, scale: 1 },
  exit: { rotateY: 90, opacity: 0, scale: 0.9 },
};

export const floatUp: Variants = {
  enter: { y: 60, opacity: 0, scale: 0.95 },
  center: { y: 0, opacity: 1, scale: 1 },
  exit: { y: -40, opacity: 0, scale: 0.95 },
};

export const starBurst: Variants = {
  enter: { opacity: 0, scale: 0.3, rotate: -15 },
  center: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 200, damping: 15 },
  },
  exit: { opacity: 0, scale: 0.3, rotate: 15 },
};

export const polaroidShake: Variants = {
  enter: { opacity: 0, rotate: -8, scale: 0.85, y: 30 },
  center: {
    opacity: 1,
    rotate: [0, -1, 1, -0.5, 0],
    scale: 1,
    y: 0,
    transition: {
      rotate: { duration: 0.6, ease: 'easeOut' },
      scale: { type: 'spring', stiffness: 150, damping: 12 },
      opacity: { duration: 0.3 },
    },
  },
  exit: { opacity: 0, rotate: 8, scale: 0.85, y: -30 },
};

export const cardStack: Variants = {
  enter: { y: -80, opacity: 0, scale: 0.9, rotateX: 15 },
  center: { y: 0, opacity: 1, scale: 1, rotateX: 0 },
  exit: { y: 80, opacity: 0, scale: 0.9, rotateX: -15 },
};

// ==================== 初雪专属过渡效果池 ====================

export const snowScatter: Variants = {
  enter: { opacity: 0, scale: 0.5, filter: 'blur(8px) brightness(1.5)' },
  center: { opacity: 1, scale: 1, filter: 'blur(0px) brightness(1)' },
  exit: { opacity: 0, scale: 0.5, filter: 'blur(8px) brightness(2)' },
};

export const iceCover: Variants = {
  enter: {
    clipPath: 'circle(0% at 0% 0%)',
    opacity: 0,
  },
  center: {
    clipPath: 'circle(150% at 50% 50%)',
    opacity: 1,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    clipPath: 'circle(0% at 100% 100%)',
    opacity: 0,
  },
};

export const fadeScaleSnow: Variants = {
  enter: { opacity: 0, scale: 0.85, filter: 'blur(3px) brightness(1.3)' },
  center: { opacity: 1, scale: 1, filter: 'blur(0px) brightness(1)' },
  exit: { opacity: 0, scale: 1.15, filter: 'blur(3px) brightness(1.3)' },
};

// ==================== 效果池 ====================

export interface TransitionEffect {
  name: string;
  variants: Variants;
}

export const generalPool: TransitionEffect[] = [
  { name: 'fadeScale', variants: fadeScale },
  { name: 'slideIn', variants: slideIn },
  { name: 'flip3D', variants: flip3D },
  { name: 'floatUp', variants: floatUp },
  { name: 'starBurst', variants: starBurst },
  { name: 'polaroidShake', variants: polaroidShake },
  { name: 'cardStack', variants: cardStack },
];

export const snowPool: TransitionEffect[] = [
  { name: 'snowScatter', variants: snowScatter },
  { name: 'polaroidShake', variants: polaroidShake },
  { name: 'iceCover', variants: iceCover },
  { name: 'fadeScaleSnow', variants: fadeScaleSnow },
];

// ==================== 随机选择函数 ====================

export function getRandomTransition(
  pool: TransitionEffect[],
  exclude?: string,
): TransitionEffect {
  if (pool.length === 1) return pool[0];
  const candidates = exclude ? pool.filter((t) => t.name !== exclude) : pool;
  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index] || pool[0];
}