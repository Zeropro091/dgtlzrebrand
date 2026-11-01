import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

type CountUpProps = {
  to: number;
  from?: number;
  /** Total animation duration in ms. */
  duration?: number;
  prefix?: string;
  suffix?: string;
  /** Fixed decimal places. */
  decimals?: number;
  className?: string;
  /** Group thousands with a separator (default true). */
  separator?: boolean;
};

function format(n: number, decimals: number, separator: boolean): string {
  const fixed = n.toFixed(decimals);
  if (!separator) return fixed;
  const [int, dec] = fixed.split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return dec ? `${grouped}.${dec}` : grouped;
}

export function CountUp({
  to,
  from = 0,
  duration = 1400,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
  separator = true,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(reduceMotion ? to : from);

  useEffect(() => {
    if (!inView || reduceMotion) {
      if (reduceMotion) setValue(to);
      return;
    }

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOutExpo — fast start, long settle. Matches the reveal easing.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(from + (to - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, from, to, duration, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {format(value, decimals, separator)}
      {suffix}
    </span>
  );
}
