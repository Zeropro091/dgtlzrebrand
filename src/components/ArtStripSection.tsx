import { motion, useReducedMotion } from 'motion/react';

type Art = {
  src: string;
  label: string;
  note: string;
};

const artworks: Art[] = [
  { src: '/art-hermes-agent.jpg', label: 'THE AGENT', note: 'Mata biru — AI yang memantau 24/7' },
  { src: '/art-figure.jpg', label: 'THE OPERATOR', note: 'Siluet abu-abu — eksekutor di balik sistem' },
  { src: '/art-shade.jpg', label: 'THE SHADE', note: 'Bayangan gelap — otomasi yang bekerja tanpa terlihat' },
];

export function ArtStripSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="art-strip"
      className="relative grid grid-cols-1 md:grid-cols-3 border-b-2 border-black bg-white"
    >
      {artworks.map((art, i) => (
        <motion.figure
          key={art.src}
          className={`relative overflow-hidden bg-white ${i < artworks.length - 1 ? 'border-b md:border-b-0 md:border-r border-electric-blue' : ''} group`}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative h-[320px] sm:h-[380px] overflow-hidden">
            <img
              src={art.src}
              alt={art.label}
              loading="lazy"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-[filter,transform] duration-500 group-hover:scale-[1.03]"
            />
          </div>
          <figcaption className="flex items-baseline justify-between gap-3 border-t border-electric-blue px-4 py-3">
            <span className="font-label-caps text-[10px] sm:text-xs text-electric-blue font-bold tracking-[0.2em]">
              {String(i + 1).padStart(2, '0')} — {art.label}
            </span>
            <span className="font-mono text-[10px] text-neutral-600 text-right">
              {art.note}
            </span>
          </figcaption>
        </motion.figure>
      ))}
    </section>
  );
}
