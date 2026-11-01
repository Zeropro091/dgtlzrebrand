import { useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Momentum scrolling. Matches how the reference sites feel: the wheel input is
 * decoupled from the scroll position, then eased toward it, so motion continues
 * briefly after the gesture ends instead of stopping dead.
 *
 * `lerp` (not `duration`) is used on purpose — it tracks the input continuously
 * rather than easing toward a fixed target, which stays responsive on fast spins.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      smoothWheel: true,
      syncTouch: false,
      anchors: { offset: -64 },
      autoRaf: false,
      respectReducedMotion: true,
    });
    lenisInstance = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}
