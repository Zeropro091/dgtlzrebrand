import { Link } from 'react-router-dom';

export function YouthSection() {
  return (
    <section id="youth" className="grid grid-cols-1 md:grid-cols-12 bg-off-white border-b border-electric-blue">
      <div className="col-span-12 md:col-span-5 p-margin border-b md:border-b-0 md:border-r border-electric-blue flex flex-col justify-between min-h-[360px]">
        <span className="font-label-caps block">DGTLZ YOUTH — THE NEXT GENERATION</span>
        <h2 className="font-display-lg leading-none uppercase">TIM ANAK MUDA.<br />LOMBA.<br />GROW.</h2>
        <p className="font-body-sm opacity-70 max-w-xs">
          YOUTH ADALAH TIM ANAK MUDA DGTLZ: FOKUS KE LOMBA, PENGEMBANGAN KARIR & PENGALAMAN —
          SEKALIGUS NGEMBANGKAN NAMA DGTLZ DI DUNIA LUAR.
        </p>
      </div>
      <div className="col-span-12 md:col-span-7 grid grid-cols-1 md:grid-cols-3">
        {[
          ['01', 'LOMBA', 'DELEGASI DGTLZ DI KOMPETISI — HACKATHON, BISNIS PLAN, TEKNOLOGI. MENANG ATAU BELAJAR, DUA-DUANYA NAIKKIN LEVEL.'],
          ['02', 'KARIR & PENGALAMAN', 'MENTORING, REAL PROJECT, DAN JEJAK YANG BISA DIBANGGAKAN. PENGALAMAN YANG NGGAK KASIH SEKOLAH.'],
          ['03', 'NAMA DGTLZ', 'SETIAP KEMENANGAN & KARYA YOUTH ADALAH KAMPAINGE ORGANIS — NAMA DGTLZ MAKIN DIKENAL.'],
        ].map(([n, t, d], i) => (
          <div key={n} className={`p-margin border-b md:border-b-0 ${i < 2 ? 'md:border-r' : ''} border-electric-blue flex flex-col`}>
            <span className="font-label-caps mb-4 opacity-60">{n}</span>
            <h3 className="font-headline-lg leading-tight mb-4">{t}</h3>
            <p className="font-body-sm leading-relaxed opacity-80">{d}</p>
          </div>
        ))}
      </div>
      <div className="col-span-12 border-t border-electric-blue p-margin flex flex-wrap items-center justify-between gap-4">
        <span className="font-label-caps">STATUS: OPEN — REMOTE-FIRST</span>
        <Link to="/youth" className="font-label-caps bg-electric-blue text-white px-6 py-3 hover:bg-transparent hover:text-electric-blue border-2 border-electric-blue transition-all">
          GABUNG DGTLZ YOUTH →
        </Link>
      </div>
    </section>
  );
}
