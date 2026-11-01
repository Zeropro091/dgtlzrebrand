import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { isMuted, play, setMuted, unlock, type SoundName } from './sound';

type SoundApi = {
  play: (name: SoundName) => void;
  muted: boolean;
  toggle: () => void;
};

const SoundContext = createContext<SoundApi>({
  play: () => {},
  muted: false,
  toggle: () => {},
});

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMutedState] = useState<boolean>(() => isMuted());

  // Browsers keep the AudioContext locked until the first gesture. Capture the
  // very first pointer or key event anywhere and warm it up once.
  useEffect(() => {
    const warm = () => unlock();
    const opts = { once: true } as const;
    window.addEventListener('pointerdown', warm, opts);
    window.addEventListener('keydown', warm, opts);
    window.addEventListener('touchstart', warm, opts);
    window.addEventListener('click', warm, opts);
    return () => {
      window.removeEventListener('pointerdown', warm);
      window.removeEventListener('keydown', warm);
      window.removeEventListener('touchstart', warm);
      window.removeEventListener('click', warm);
    };
  }, []);

  const toggle = useCallback(() => {
    const next = !isMuted();
    setMuted(next);
    setMutedState(next);
    // Confirm the new state audibly — but only when turning sound back on.
    if (!next) play('success');
  }, []);

  const value = useMemo<SoundApi>(() => ({ play, muted, toggle }), [muted, toggle]);

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  return useContext(SoundContext);
}

/**
 * Convenience: returns stable handlers that fire a sound. Spread onto any element.
 *   <button {...soundProps('click')} />
 */
export function useSoundProps() {
  const { play: p } = useSound();
  return useCallback(
    (name: SoundName) => ({
      onClick: () => p(name),
      onMouseEnter: () => p('hover'),
    }),
    [p],
  );
}

/**
 * Two-stage mechanical feedback for anything that behaves like a switch:
 * press on pointerdown, release on pointerup, hover tick on enter.
 * Spread onto a native button/anchor when you don't need Pressable's visuals.
 *   <button {...mechanical()} />
 */
export function useMechanical() {
  const { play: p } = useSound();
  return useCallback(
    () => ({
      onPointerDown: () => p('press'),
      onPointerUp: () => p('release'),
      onPointerCancel: () => p('release'),
      onMouseEnter: () => p('hover'),
    }),
    [p],
  );
}

/**
 * Hover tick only — for rows, cards, and list items where a press cue would be
 * noise but silence would feel dead.
 */
export function useHoverTick() {
  const { play: p } = useSound();
  return useCallback(() => p('hover'), [p]);
}

