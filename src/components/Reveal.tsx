import { useEffect, useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { useSound } from '../lib/useSound';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: 32, y: 0 },
  right: { x: -32, y: 0 },
  none: { x: 0, y: 0 },
};

type RevealProps = {
  children: ReactNode;
  from?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  sound?: boolean;
  amount?: number | 'some' | 'all';
  as?: 'div' | 'section' | 'li' | 'article' | 'header' | 'footer';
};

/**
 * Fades + slides its child in the first time it enters the viewport.
 *
 * Uses useInView + an explicit `animate` state rather than `whileInView`,
 * because tall sections (4000px+) can satisfy neither an `amount` ratio nor
 * a reliable intersection ratio when nested inside flex parents.
 */
export function Reveal({
  children,
  from = 'up',
  delay = 0,
  duration = 0.55,
  className,
  sound = false,
  amount = 'some',
  as = 'div',
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const { play } = useSound();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount, margin: '0px 0px -60px 0px' });
  const sounded = useRef(false);
  const offset = OFFSET[from];

  useEffect(() => {
    if (inView && sound && !sounded.current) {
      sounded.current = true;
      play('whoosh');
    }
  }, [inView, sound, play]);

  const MotionTag = motion[as];

  return (
    <MotionTag
      ref={ref as never}
      className={className}
      initial={false}
      animate={
        inView || reduceMotion
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x: offset.x, y: offset.y }
      }
      transition={{ duration: reduceMotion ? 0.2 : duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealGroup({
  children,
  className,
  stagger = 0.07,
  amount = 0.1,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  amount?: number | 'some';
  as?: 'div' | 'ul' | 'section';
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount });
  const MotionTag = motion[as];

  return (
    <MotionTag
      ref={ref as never}
      className={className}
      initial={false}
      animate={inView ? 'visible' : 'hidden'}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  from = 'up',
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  from?: Direction;
  as?: 'div' | 'li' | 'article';
}) {
  const reduceMotion = useReducedMotion();
  const offset = OFFSET[from];
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      variants={
        reduceMotion
          ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
          : {
              hidden: { opacity: 0, x: offset.x, y: offset.y },
              visible: {
                opacity: 1,
                x: 0,
                y: 0,
                transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
              },
            }
      }
    >
      {children}
    </MotionTag>
  );
}
