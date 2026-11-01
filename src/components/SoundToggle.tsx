import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSound } from '../lib/useSound';

/**
 * Brutalist mute toggle. Sits in the navbar. Persists via localStorage.
 */
export function SoundToggle({ compact = false }: { compact?: boolean }) {
  const { muted, toggle } = useSound();

  return (
    <button
      type="button"
      onClick={toggle}
      onMouseEnter={() => !muted && undefined}
      aria-label={muted ? 'Nyalakan sound effect' : 'Matikan sound effect'}
      aria-pressed={!muted}
      title={muted ? 'SOUND: OFF' : 'SOUND: ON'}
      className={`group inline-flex items-center gap-1.5 border border-on-primary/60 px-2 py-1 font-label-caps text-[10px] tracking-widest transition-colors duration-150 hover:bg-on-primary hover:text-electric-blue ${
        muted ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <span className="relative flex h-3 w-3 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={muted ? 'off' : 'on'}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.14 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {muted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
          </motion.span>
        </AnimatePresence>
      </span>
      {!compact && (
        <span className="flex items-center gap-1">
          SOUND
          {/* Live EQ bars — animate only while sound is enabled */}
          <span className="inline-flex h-2.5 items-end gap-[1px]" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`w-[2px] bg-current ${muted ? 'h-[2px]' : 'eq-bar'}`}
                style={muted ? undefined : { animationDelay: `${i * 0.13}s` }}
              />
            ))}
          </span>
        </span>
      )}
    </button>
  );
}
