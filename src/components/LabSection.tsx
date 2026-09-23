import { Link } from 'react-router-dom';

export function LabSection() {
  return (
    <section id="lab" className="grid grid-cols-1 md:grid-cols-12 bg-electric-blue text-off-white border-b border-electric-blue">
      {/* Header block */}
      <div className="col-span-12 md:col-span-5 p-margin border-b md:border-b-0 md:border-r border-off-white/30 flex flex-col justify-between min-h-[400px]">
        <span className="font-label-caps block">DGTLZ LAB — INNOVATION ENGINE</span>
        <h2 className="font-display-lg leading-none uppercase">TIM SCIENTIST.<br />RISET. PRODUK.</h2>
        <p className="font-body-sm leading-relaxed opacity-80 max-w-sm">
          DGTLZ BUKAN SEKADAR AGENCY — LAB ADALAH MESIN INOVASINYA: TIM SCIENTIST, ENGINEER, DAN PRODUCT
          BUILDER YANG FOKUSNYA SATU — BIKIN INOVASI DAN PRODUK NYATA.
        </p>
      </div>

      {/* Three focus columns */}
      <div className="col-span-12 md:col-span-7 grid grid-cols-1 md:grid-cols-3">
        {[
          ['01 / RESEARCH', 'EKSPORASI TEKNOLOGI, METODOLOGI, DAN IDE BARU. RISET DILAKUKAN SERIUS — BUKAN SEKADAR IKUT TREN.'],
          ['02 / PRODUCT', 'RISET DITERJEMAHKAN JADI PRODUK YANG DIPAKAI. ROUTE, PAYGATE, DAN AGENT LAHIR DARI SINI.'],
          ['03 / ENGINE', 'OUTPUT LAB MENGALIR KE SELURUH ECOSYSTEM DGTLZ — BIKIN BISNIS KLIEN DAN TIM TERUS MAJU 24/7.'],
        ].map(([t, d], i) => (
          <div key={t} className={`p-margin border-b md:border-b-0 ${i < 2 ? 'md:border-r border-off-white/30' : ''} flex flex-col`}>
            <span className="font-label-caps block mb-6 opacity-60">{t}</span>
            <p className="font-body-sm leading-relaxed opacity-90">{d}</p>
          </div>
        ))}
      </div>

      {/* Footer strip */}
      <div className="col-span-12 border-t border-off-white/30 p-margin flex flex-wrap items-center justify-between gap-4">
        <span className="font-label-caps opacity-70">SIAPKAN DIRI — PEREKRUTAN TERBAIK LAB DATANG DARI DGTLZ YOUTH</span>
        <Link to="/youth" className="font-label-caps border-2 border-off-white px-6 py-3 hover:bg-off-white hover:text-electric-blue transition-all">
          MASUK LEWAT YOUTH →
        </Link>
      </div>
    </section>
  );
}
