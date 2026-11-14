import { motion, useReducedMotion } from 'motion/react';

// Art strip — theme matches AI AGENT UNTUK BISNIS (AgentSection):
// dark #121212 canvas, terminal-green #39FF14 accents, mono labels.
type Art = {
  src: string;
  label: string;
  note: string;
};

const artworks: Art[] = [
  { src: '/art-hermes-agent.jpg', label: 'THE AGENT', note: 'MATA BIRU — AI YANG MEMANTAU 24/7' },
  { src: '/art-figure.jpg', label: 'THE OPERATOR', note: 'SILUET — EKSEKUTOR DI BALIK SISTEM' },
  { src: '/art-shade.jpg', label: 'THE SHADE', note: 'BAYANGAN — OTOMASI TANPA TERLIHAT' },
];

export function ArtStripSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="art-strip" className="border-b border-[#39FF14]/30 bg-[#121212] text-white">
      {/* Pixel dissolve band — putih dari CARA KERJA "bocor" jadi piksel ke arsip gelap */}
      <div aria-hidden="true" className="w-full overflow-hidden">
        {[0.25, 0.5, 0.75, 1].map((d, i) => (
          <div
            key={i}
            className="h-6 w-full"
            style={{
              backgroundColor: '#ffffff',
              backgroundImage:
                d >= 1
                  ? 'linear-gradient(#121212, #121212)'
                  : `conic-gradient(rgba(18,18,18,${d}) 0 25%, transparent 25% 50%, rgba(18,18,18,${d}) 50% 75%, transparent 75% 100%)`,
              backgroundSize: d >= 1 ? 'auto' : '12px 12px',
              backgroundPosition: i % 2 ? '6px 0' : '0 0',
            }}
          />
        ))}
      </div>

      {/* Header bar — mirrors AgentSection header pattern */}
      <div className="p-margin border-b border-[#39FF14]/30 flex items-end justify-between gap-4">
        <span className="font-label-caps block text-[#39FF14]">ARSIP VISUAL</span>
        <span className="font-mono text-[11px] opacity-70 tracking-widest">
          03 ARTIFACTS · DEPLOYED
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3">
        {artworks.map((art, i) => (
          <motion.figure
            key={art.src}
            className={`relative overflow-hidden group hover:bg-[#39FF14]/5 transition-colors duration-300 ${
              i < artworks.length - 1 ? 'border-b md:border-b-0 md:border-r border-[#39FF14]/20' : ''
            }`}
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
              {/* terminal overlay: dark base + LIVE status */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#121212]/70 via-transparent to-transparent" />
              <span className="absolute top-3 right-3 flex items-center gap-2 font-mono text-[10px] text-[#39FF14] tracking-widest opacity-90">
                <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
                LIVE
              </span>
            </div>
            <figcaption className="border-t border-[#39FF14]/20 px-4 py-3 flex flex-col gap-1">
              <span className="font-mono text-[11px] font-bold text-[#39FF14] tracking-widest group-hover:text-white transition-colors">
                ▸ {String(i + 1).padStart(2, '0')} — {art.label}
              </span>
              <span className="font-mono text-[10px] opacity-70 tracking-wider">
                {art.note}
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>

      <div className="border-t border-[#39FF14]/30 p-margin flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <span className="font-mono text-[11px] opacity-70 tracking-widest">
          VISUAL SYSTEM: THE AGENT · THE OPERATOR · THE SHADE
        </span>
        <a
          href="#agent"
          className="font-label-caps bg-[#39FF14] text-[#121212] px-6 py-3 text-center hover:bg-white transition-colors"
        >
          LIHAT AGENT →
        </a>
      </div>
    </section>
  );
}
