import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { useSound } from '../lib/useSound';

type TypewriterProps = {
  /** Either a single string or a list of lines revealed one after another. */
  text: string | string[];
  /** ms per character. */
  speed?: number;
  /** ms to wait before typing starts. */
  startDelay?: number;
  /** ms to pause between lines when `text` is an array. */
  linePause?: number;
  className?: string;
  /** Render the blinking terminal cursor. */
  cursor?: boolean;
  /** Emit a quiet keypress tick per character. */
  sound?: boolean;
  /** Only begin once scrolled into view. */
  onView?: boolean;
};

export function Typewriter({
  text,
  speed = 38,
  startDelay = 0,
  linePause = 380,
  className,
  cursor = true,
  sound = true,
  onView = true,
}: TypewriterProps) {
  const lines = Array.isArray(text) ? text : [text];
  const full = lines.join('\n');
  const reduceMotion = useReducedMotion();
  const { play } = useSound();

  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  const [shown, setShown] = useState(reduceMotion ? full.length : 0);
  const [done, setDone] = useState(!!reduceMotion);

  useEffect(() => {
    if (reduceMotion) {
      setShown(full.length);
      setDone(true);
      return;
    }
    if (onView && !inView) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const step = (index: number) => {
      if (cancelled) return;
      if (index >= full.length) {
        setDone(true);
        return;
      }
      setShown(index + 1);

      const ch = full[index];
      if (sound && ch.trim() !== '') play('type');

      // Pause longer at line breaks and after sentence punctuation — reads as typing.
      const prev = full[index - 1] ?? '';
      let wait = speed;
      if (ch === '\n') wait = linePause;
      else if ('.!?'.includes(ch)) wait = speed * 6;
      else if (',;:'.includes(ch)) wait = speed * 3;
      else if (prev === '\n') wait = speed * 2;

      timer = setTimeout(() => step(index + 1), wait);
    };

    const kick = setTimeout(() => step(0), startDelay);

    return () => {
      cancelled = true;
      clearTimeout(kick);
      clearTimeout(timer);
    };
  }, [inView, onView, full, speed, startDelay, linePause, sound, reduceMotion, play]);

  const visible = full.slice(0, shown);

  return (
    <span ref={ref} className={className}>
      {/* Split on the newline we joined with so multi-line copy keeps its breaks */}
      {visible.split('\n').map((line, i, arr) => (
        <span key={i}>
          {line}
          {i < arr.length - 1 && <br />}
        </span>
      ))}
      {cursor && !done && <span className="terminal-cursor" aria-hidden="true" />}
      {cursor && done && <span className="terminal-cursor opacity-30" aria-hidden="true" />}
    </span>
  );
}
