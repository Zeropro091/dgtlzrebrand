import { useRef, useState, type ReactNode, type MouseEvent, type Key } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useSound } from '../lib/useSound';

/**
 * Pulls its child toward the pointer while hovered, then springs back.
 * Strength is a fraction of the offset, capped by `max` px.
 */
export function Magnetic({
  children,
  className,
  strength = 0.28,
  max = 10,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  max?: number;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const clamp = (v: number) => Math.max(-max, Math.min(max, v));

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({
      x: clamp((e.clientX - (rect.left + rect.width / 2)) * strength),
      y: clamp((e.clientY - (rect.top + rect.height / 2)) * strength),
    });
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 260, damping: 22, mass: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Subtle 3D tilt following the pointer. Also drives a specular highlight via
 * CSS custom properties so the card catches "light" as it turns.
 */
export function Tilt3D({
  children,
  className,
  maxTilt = 6,
  disabled = false,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  disabled?: boolean;
  key?: Key;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * maxTilt * 2,
      ry: (px - 0.5) * maxTilt * 2,
      mx: px * 100,
      my: py * 100,
    });
  };

  return (
    <motion.div
      {...rest}
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ rx: 0, ry: 0, mx: 50, my: 50 })}
      animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
      transition={{ type: 'spring', stiffness: 220, damping: 20, mass: 0.5 }}
      style={{
        transformStyle: 'preserve-3d',
        transformPerspective: 900,
        ['--mx' as string]: `${tilt.mx}%`,
        ['--my' as string]: `${tilt.my}%`,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Wraps children so that hovering fires a hover cue and clicking fires `cue`.
 * For elements that must keep their own markup (rows, cards, links).
 */
export function useHoverSound(cue: 'hover' | 'none' = 'hover') {
  const { play } = useSound();
  return {
    onMouseEnter: () => cue !== 'none' && play('hover'),
  };
}
