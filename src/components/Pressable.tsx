import { useCallback, useRef, useState, type ReactNode, type MouseEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useSound } from '../lib/useSound';
import type { SoundName } from '../lib/sound';

type Ripple = { id: number; x: number; y: number };

type PressableProps = {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  className?: string;
  disabled?: boolean;
  /**
   * Sound played on activation. `press`/`release` fire on pointer down/up for a
   * two-stage mechanical feel; anything else fires once on click.
   */
  cue?: SoundName | 'mechanical' | 'none';
  /** Fire a quiet tick on pointer enter. */
  hoverCue?: boolean;
  /** Square ripple expanding from the exact pointer position. */
  ripple?: boolean;
  /** Squash on press. Disable for full-bleed rows where the shift looks wrong. */
  press?: boolean;
  as?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit';
  'aria-label'?: string;
  'aria-pressed'?: boolean;
  title?: string;
};

/**
 * A button/anchor that feels physical: it squashes while held, fires a matching
 * sound, and can throw a square ripple from the pointer location.
 *
 * Sound is split into press (pointerdown) and release (pointerup) so the audio
 * lands with the finger rather than with the click, which is what makes a UI
 * feel tactile instead of merely audible.
 */
export function Pressable({
  children,
  onClick,
  className = '',
  disabled = false,
  cue = 'click',
  hoverCue = true,
  ripple = true,
  press = true,
  as = 'button',
  href,
  target,
  rel,
  type = 'button',
  ...aria
}: PressableProps) {
  const { play } = useSound();
  const reduceMotion = useReducedMotion();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [held, setHeld] = useState(false);
  const seed = useRef(0);

  const spawnRipple = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (!ripple || reduceMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const id = ++seed.current;
      setRipples((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 620);
    },
    [ripple, reduceMotion],
  );

  const handlePointerDown = () => {
    if (disabled) return;
    setHeld(true);
    if (cue === 'mechanical') play('press');
    else if (cue !== 'none') play(cue);
  };

  const handlePointerUp = () => {
    if (disabled) return;
    setHeld(false);
    if (cue === 'mechanical') play('release');
  };

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    if (disabled) return;
    spawnRipple(e);
    onClick?.(e);
  };

  const MotionTag = as === 'a' ? motion.a : motion.button;

  return (
    <MotionTag
      {...(as === 'a' ? { href, target, rel } : { type })}
      {...aria}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => setHeld(false)}
      onPointerCancel={() => setHeld(false)}
      onMouseEnter={() => hoverCue && !disabled && play('hover')}
      disabled={as === 'button' ? disabled : undefined}
      aria-disabled={disabled || undefined}
      animate={{ scale: press && held && !reduceMotion ? 0.965 : 1 }}
      transition={{ type: 'spring', stiffness: 620, damping: 30, mass: 0.35 }}
      className={`relative overflow-hidden select-none ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden="true"
          className="pointer-events-none absolute z-0"
          style={{
            left: r.x,
            top: r.y,
            width: 12,
            height: 12,
            marginLeft: -6,
            marginTop: -6,
            background: 'currentColor',
            animation: 'ripple-square 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        />
      ))}
      <span className="relative z-10 flex items-center justify-inherit gap-inherit">{children}</span>
    </MotionTag>
  );
}
