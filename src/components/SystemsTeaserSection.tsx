import { Link } from 'react-router-dom';
import { modulesData } from '../systemsData';
import { getModuleStyle } from '../moduleStyles';

const slugify = (code: string) => code.replace('DGT.LZ-', '').toLowerCase();

/**
 * Special "DGTLZ AUTOMATION ARSENAL" section.
 * Modules are NOT a sequential 01-10 ledger: no rank numbers, no ordered rows.
 * Each module becomes a colored chip whose width grows with its share of
 * systems (content-driven hierarchy), ranked by system count so file order
 * never implies a 1-10 sequence.
 */
export function SystemsTeaserSection() {
  const totalSystems = modulesData.reduce((sum, m) => sum + m.systems.length, 0);
  const maxSystems = Math.max(...modulesData.map((m) => m.systems.length));
  const ranked = [...modulesData].sort((a, b) => b.systems.length - a.systems.length);

  return (
    <section id="systems" className="border-b border-electric-blue bg-white">
      {/* Section header: brand band, not a list intro */}
      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-electric-blue">
        <div className="md:col-span-8 p-margin pb-6">
          <span className="font-label-caps block mb-4">SPECIAL SECTION // ARSENAL INDEX</span>
          <h2 className="font-display-lg leading-none uppercase">
            DGTLZ AUTOMATION
            <br />
            ARSENAL<span className="text-electric-blue">.</span>
          </h2>
        </div>
        <div className="md:col-span-4 p-margin md:py-6 md:pl-0 border-t md:border-t-0 md:border-l border-electric-blue flex flex-col justify-center">
          <p className="font-body-sm opacity-80 max-w-sm">
            {totalSystems} system blueprint terklasifikasi ke dalam {modulesData.length} modul —
            tidak ditampilkan berurutan. Semua bagian dari satu arsenal.
          </p>
        </div>
      </div>

      {/* Chip field: size = share of systems, no sequence numbers */}
      <div className="p-margin flex flex-wrap gap-3 md:gap-4">
        {ranked.map((mod) => {
          const style = getModuleStyle(mod.code);
          const grow = Math.max(1, Math.round((mod.systems.length / maxSystems) * 4));

          return (
            <Link
              key={mod.id}
              to={`/systems/${slugify(mod.code)}`}
              className={`group relative block overflow-hidden ${style.bg} p-5 md:p-6 transition-transform duration-200 hover:-translate-y-0.5`}
              style={{ flexGrow: grow, flexBasis: '240px' }}
            >
              <div
                className="absolute inset-0 opacity-10 pointer-events-none select-none overflow-hidden"
                aria-hidden="true"
              >
                <div className={`w-full h-full ${style.dotClass}`}></div>
              </div>

              <div className="relative z-10 flex flex-col gap-8 md:gap-12">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-label-caps text-xs opacity-80">{mod.code}</span>
                  <span className="font-label-caps text-xs border border-black/20 px-2 py-1 shrink-0">
                    {mod.systems.length} SYS
                  </span>
                </div>
                <h3 className="font-headline-md uppercase leading-tight break-words">{mod.name}</h3>
              </div>
            </Link>
          );
        })}
      </div>

      {/* CTA band: single arsenal-wide action */}
      <div className="border-t border-electric-blue p-margin flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <span className="font-label-caps text-xs opacity-60">
          // FULL DIRECTORY: SETIAP MODUL, SEMUA SYSTEM
        </span>
        <Link
          to="/systems"
          className="font-label-caps inline-flex items-center justify-center gap-3 bg-electric-blue text-white border border-electric-blue px-8 py-4 w-full sm:w-auto text-center hover:bg-white hover:text-electric-blue transition-colors"
        >
          VISIT ARSENAL →
        </Link>
      </div>
    </section>
  );
}
