import { useSound } from '../lib/useSound';
import { motion, useReducedMotion } from 'motion/react';

export function WorkflowSection() {
  const { play } = useSound();
  const reduceMotion = useReducedMotion();

  const phases = [
    {
      id: "01",
      title: "RANCANGAN (AUDIT & RENCANA)",
      desc: "Konsultasi awal 100% tanpa biaya. Kami bedah cara bisnis kamu jalan, lalu rancang ecosystem digitalnya: landing page, web app, otomasi, sampai AI agent."
    },
    {
      id: "02",
      title: "BUILD (4-8 MINGGU)",
      desc: "Membangun landing page, web app, dan integrasi sistem secara bertahap. Setiap fase ada hasil nyata yang bisa langsung dipakai."
    },
    {
      id: "03",
      title: "AI AGENTS & OTOMASI",
      desc: "Deploy Hermes Agent, OpenClaw, atau custom agent: layani chat, follow up lead, terima booking & pembayaran, jalan 24/7, terhubung web app, WhatsApp, dan PayGate."
    },
    {
      id: "04",
      title: "ECOSYSTEM MANAGEMENT (CTO)",
      desc: "Skema retainer bulanan: kami jaga dan kembangkan seluruh ecosystem kamu sebagai CTO eksternal: server, API, keamanan, pemeliharaan."
    }
  ];

  return (
    <section id="workflow" className="relative grid grid-cols-1 md:grid-cols-12 border-b-2 border-black md:border-electric-blue bg-white overflow-hidden">
      {/* Left Column: Cara Kerja + Upright Tree */}
      <div className="relative col-span-12 md:col-span-5 lg:col-span-4 p-6 sm:p-8 md:p-10 border-b md:border-b-0 md:border-r border-electric-blue flex flex-col justify-between min-h-[460px] md:min-h-[580px] overflow-hidden bg-white">
        
        {/* Charcoal Upright Tree Artwork */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 flex items-end justify-center">
          <motion.img
            src="/tree-upright.webp"
            alt="Ink wash pine tree"
            className="w-[85%] sm:w-[75%] md:w-[92%] max-w-[390px] object-contain object-bottom origin-bottom transition-transform duration-700"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Content layer over tree */}
        <div className="relative z-10">
          <span className="font-label-caps text-xs text-electric-blue font-bold tracking-[0.2em] block mb-4">
            CARA KERJA
          </span>
          <h2 className="font-display-lg leading-[0.92] uppercase text-electric-blue font-serif font-extrabold tracking-tight">
            CARA KAMI<br />
            MEMBANGUN<br />
            ECOSYSTEM.
          </h2>
        </div>

        <div className="relative z-10 mt-auto pt-16 md:pt-24">
          <p className="font-mono text-xs text-neutral-700 opacity-90 max-w-xs leading-relaxed">
            Kami memadukan konsultasi teknis dengan pengembangan tangkas untuk potensi komersial ekonomis nyata.
          </p>
        </div>
      </div>

      {/* Right Column: 4 Phases Table + Cliff Tree */}
      <div className="relative col-span-12 md:col-span-7 lg:col-span-8 flex flex-col justify-between bg-white overflow-hidden">
        
        {/* Japanese Sumi-e Pine Tree on Cliff Artwork */}
        <div className="absolute bottom-0 right-0 pointer-events-none select-none z-0 w-[48%] max-w-[350px] md:max-w-[430px] h-[78%] md:h-[92%] overflow-hidden flex items-end justify-end">
          <motion.img
            src="/tree-cliff.webp"
            alt="Japanese pine tree on cliff"
            className="w-full h-full object-contain object-right-bottom origin-bottom-right"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Phases list */}
        <div className="relative z-10 flex flex-col h-full">
          {phases.map((phase, i) => (
            <div
              key={phase.id}
              onMouseEnter={() => play('hover')}
              onClick={() => play('open')}
              className={`p-6 sm:p-7 md:p-8 lg:p-9 flex flex-col sm:flex-row gap-5 sm:gap-7 md:gap-9 items-start ${
                i !== phases.length - 1 ? 'border-b border-electric-blue' : ''
              } group hover:bg-electric-blue/5 transition-colors duration-200 cursor-pointer flex-1 justify-center`}
            >
              {/* Display Phase Number */}
              <div className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold leading-none text-electric-blue/35 group-hover:text-electric-blue transition-colors shrink-0 select-none">
                {phase.id}
              </div>

              {/* Phase Details */}
              <div className="flex-1 max-w-xl pr-6 md:pr-12">
                <span className="font-label-caps text-[10px] sm:text-xs text-electric-blue/70 font-semibold tracking-widest mb-1.5 block">
                  TAHAP
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold uppercase text-electric-blue mb-2.5 tracking-tight group-hover:translate-x-1 transition-transform duration-200">
                  {phase.title}
                </h3>
                <p className="font-mono text-xs sm:text-[13px] text-neutral-700 leading-relaxed opacity-90">
                  {phase.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
