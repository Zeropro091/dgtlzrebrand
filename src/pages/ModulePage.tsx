import { useMemo, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { modulesData, SystemItem } from '../systemsData';
import { getModuleStyle } from '../moduleStyles';
import { getBriefingBySlug } from '../moduleBriefings';
import { SystemModal } from '../components/SystemModal';

const slugify = (code: string) => code.replace('DGT.LZ-', '').toLowerCase();

export function ModulePage() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedSystem, setSelectedSystem] = useState<SystemItem | null>(null);

  const moduleIndex = useMemo(
    () => modulesData.findIndex((m) => slugify(m.code) === slug),
    [slug]
  );
  const mod = moduleIndex >= 0 ? modulesData[moduleIndex] : null;
  const style = mod ? getModuleStyle(mod.code) : null;
  const briefing = mod ? getBriefingBySlug(slugify(mod.code)) : undefined;
  const accent = briefing?.accent ?? '#0B17EF';
  const prevMod = moduleIndex > 0 ? modulesData[moduleIndex - 1] : null;
  const nextMod =
    moduleIndex >= 0 && moduleIndex < modulesData.length - 1
      ? modulesData[moduleIndex + 1]
      : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!mod || !style) {
    return (
      <div className="bg-off-white min-h-[60vh] flex items-center justify-center">
        <div className="border border-dashed border-electric-blue p-16 text-center">
          <div className="font-label-caps text-lg font-bold mb-4 text-electric-blue">
            [ MODULE NOT FOUND IN REGISTRY ]
          </div>
          <Link
            to="/systems"
            className="font-label-caps border border-electric-blue text-electric-blue px-6 py-2 hover:bg-electric-blue hover:text-white transition-colors"
          >
            RETURN TO SYSTEM TAXONOMY
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-off-white min-h-screen">
      {/* ============ HERO: statue with layered filters + texture ============ */}
      <header className="relative border-b border-electric-blue overflow-hidden bg-[#121212]">
        {/* Layer 0 — statue photograph */}
        <img
          src="/statue.png"
          alt="Classical marble statue — module insignia"
          className="absolute inset-0 w-full h-full object-cover object-[50%_20%] grayscale contrast-125 opacity-90"
        />

        {/* Layer 1 — accent duotone wash (screen-blends the module color into the marble) */}
        <div
          className="absolute inset-0 mix-blend-screen pointer-events-none"
          style={{ backgroundColor: accent, opacity: 0.45 }}
        />

        {/* Layer 2 — dark contrast base so type stays legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent pointer-events-none" />

        {/* Layer 3 — module dot-grid texture */}
        <div className="absolute inset-0 opacity-[0.14] pointer-events-none select-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
              backgroundSize: '4px 4px',
            }}
          />
        </div>

        {/* Layer 4 — scanline hairlines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, #ffffff 3px, #ffffff 4px)',
          }}
        />

        {/* Layer 5 — fragmented frame slices over the statue */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute left-[8%] top-[12%] w-[26%] h-[2px]"
            style={{ backgroundColor: accent }}
          />
          <div
            className="absolute right-[10%] bottom-[30%] w-[2px] h-[34%]"
            style={{ backgroundColor: accent, opacity: 0.7 }}
          />
          <div className="absolute left-[30%] bottom-[14%] w-[18%] h-[2px] bg-white/40" />
          <div className="absolute right-[28%] top-[18%] w-[2px] h-[22%] bg-white/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-margin flex flex-col justify-end min-h-[440px] md:min-h-[520px]">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-caps text-white/70 tracking-wider">
              DGT.LZ ARSENAL // MODULE {mod.id}
            </span>
            <span
              className="font-mono text-3xl md:text-5xl font-extrabold mix-blend-difference"
              style={{ color: '#ffffff' }}
            >
              {mod.id}
            </span>
          </div>
          <h1 className="font-display-xl leading-none uppercase text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            {briefing?.headline ?? mod.code}
          </h1>
          <p className="font-label-caps text-white/80 mt-3 uppercase">
            {mod.code} — {mod.name}
          </p>
        </div>
      </header>

      {/* ============ BRIEFING STRIP ============ */}
      {briefing && (
        <section className="grid grid-cols-1 md:grid-cols-12 border-b border-electric-blue bg-white">
          <div
            className="md:col-span-8 p-8 md:p-10 border-b md:border-b-0 md:border-r border-electric-blue"
            style={{ borderLeft: `6px solid ${accent}` }}
          >
            <span className="font-label-caps block mb-4 text-electric-blue font-bold">
              MODULE BRIEFING
            </span>
            <p className="font-body-lg leading-relaxed text-on-surface text-justify">
              {briefing.briefing}
            </p>
            <p className="font-label-caps mt-6 text-electric-blue/70 uppercase">
              {briefing.tactical}
            </p>
          </div>
          <div className="md:col-span-4 bg-off-white p-8 md:p-10 flex flex-col justify-between">
            <div>
              <span className="font-label-caps block mb-4 text-electric-blue font-bold">
                TELEMETRY
              </span>
              <div className="font-mono text-5xl md:text-6xl font-extrabold" style={{ color: accent }}>
                {mod.systems.length}
              </div>
              <span className="font-label-caps text-electric-blue/70 block mt-1">
                SYSTEM SPECIFICATIONS LOADED
              </span>
            </div>
            <Link
              to="/systems"
              className="font-label-caps mt-8 inline-block self-start border border-electric-blue text-electric-blue px-5 py-2.5 hover:bg-electric-blue hover:text-white transition-colors"
            >
              ← ALL MODULES
            </Link>
          </div>
        </section>
      )}

      {/* ============ SYSTEMS GRID ============ */}
      <main className="p-margin max-w-7xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-electric-blue bg-white divide-y md:divide-y-0 md:divide-x">
          {mod.systems.map((sys) => (
            <div
              key={sys.id}
              onClick={() => setSelectedSystem(sys)}
              className="p-6 flex flex-col justify-between group hover:bg-electric-blue hover:text-white transition-all duration-300 relative overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 dither-pattern opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-300"></div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-label-caps text-xs font-bold text-electric-blue group-hover:text-[#39FF14] bg-electric-blue/5 group-hover:bg-white/10 px-2 py-0.5 transition-colors border border-electric-blue/10">
                    {sys.id}
                  </span>
                </div>
                <h3 className="font-mono font-bold text-base leading-snug uppercase mb-2 group-hover:translate-x-1 transition-transform duration-200">
                  {sys.name}
                </h3>
              </div>

              <p className="font-body-sm text-[12px] opacity-75 mt-4 leading-relaxed text-justify border-t border-dashed border-electric-blue/20 group-hover:border-white/20 pt-4">
                {sys.description}
              </p>
            </div>
          ))}
        </div>

        {/* ============ PREV / NEXT ============ */}
        <div className="grid grid-cols-1 md:grid-cols-2 border border-t-0 border-electric-blue mt-0">
          {prevMod ? (
            <Link
              to={`/systems/${slugify(prevMod.code)}`}
              className="p-margin flex flex-col border-b md:border-b-0 md:border-r border-electric-blue group hover:bg-electric-blue hover:text-white transition-colors"
            >
              <span className="font-label-caps text-xs opacity-60 mb-2">
                ← PREVIOUS MODULE // {prevMod.id}
              </span>
              <span className="font-headline-md uppercase">{prevMod.code}</span>
            </Link>
          ) : (
            <div className="p-margin flex flex-col border-b md:border-b-0 md:border-r border-electric-blue opacity-40">
              <span className="font-label-caps text-xs opacity-60 mb-2">START OF REGISTRY</span>
              <span className="font-headline-md uppercase">MODULE 01</span>
            </div>
          )}
          {nextMod ? (
            <Link
              to={`/systems/${slugify(nextMod.code)}`}
              className="p-margin flex flex-col items-end text-right group hover:bg-electric-blue hover:text-white transition-colors"
            >
              <span className="font-label-caps text-xs opacity-60 mb-2">
                NEXT MODULE // {nextMod.id} →
              </span>
              <span className="font-headline-md uppercase">{nextMod.code}</span>
            </Link>
          ) : (
            <div className="p-margin flex flex-col items-end text-right opacity-40">
              <span className="font-label-caps text-xs opacity-60 mb-2">END OF REGISTRY</span>
              <span className="font-headline-md uppercase">MODULE 10</span>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox modal */}
      <SystemModal
        system={selectedSystem}
        onClose={() => setSelectedSystem(null)}
      />
    </div>
  );
}
