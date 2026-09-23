import { Link } from 'react-router-dom';

export function CloudSection() {
  return (
    <section id="cloud" className="grid grid-cols-1 md:grid-cols-12 bg-off-white border-b border-electric-blue">
      {/* Left rail */}
      <div className="col-span-12 md:col-span-4 p-margin border-b md:border-b-0 md:border-r border-electric-blue flex flex-col justify-between min-h-[360px]">
        <span className="font-label-caps block">INFRASTRUCTURE</span>
        <h2 className="font-display-lg leading-none">DGTLZ<br />CLOUD.</h2>
        <p className="font-body-sm opacity-70 max-w-xs">
          LAPISAN INFRASTRUKTUR ECOSYSTEM — TEMPAT SEMUA SISTEM DGTLZ (DAN BISNIS KAMU) HIDUP, JALAN, DAN TETAP ONLINE.
        </p>
      </div>
      {/* Right: 3 pillars */}
      <div className="col-span-12 md:col-span-8 grid grid-cols-1 md:grid-rows-3">
        <div className="p-margin border-b border-electric-blue md:grid md:grid-cols-3">
          <div className="md:col-span-1">
            <span className="font-label-caps block mb-4">01 / DEPLOYMENT</span>
            <h3 className="font-headline-lg leading-tight">SHIP TANPA DRAMA.</h3>
          </div>
          <p className="md:col-span-2 font-body-sm leading-relaxed mt-6 md:mt-0">
            PIPELINE DEPLOY OTOMATIS — DARI GIT KE PRODUCTION TANPA SETUP RIBET. ROLLBACK CEPAT, MONITORING AKTIF, DAN INFRASTRUKTUR YANG SCALA SAAT TRAFIK NAIK.
          </p>
        </div>
        <div className="p-margin border-b border-electric-blue md:grid md:grid-cols-3">
          <div className="md:col-span-1">
            <span className="font-label-caps block mb-4">02 / DOCKER</span>
            <h3 className="font-headline-lg leading-tight">CONTAINERIZED.</h3>
          </div>
          <p className="md:col-span-2 font-body-sm leading-relaxed mt-6 md:mt-0">
            SEMUA WORKLOAD DIJALANKAN DALAM CONTAINER — ENVIRONMENT YANG SAMA DI LOCAL, STAGING, DAN PRODUCTION. SATU IMAGE, JALAN DI MANA SAJA, NOL "TAPI DI KOMPUTER AKU JALAN".
          </p>
        </div>
        <div className="p-margin md:grid md:grid-cols-3">
          <div className="md:col-span-1">
            <span className="font-label-caps block mb-4">03 / DATABASES</span>
            <h3 className="font-headline-lg leading-tight">DATA YANG AMAN & RAPI.</h3>
          </div>
          <p className="md:col-span-2 font-body-sm leading-relaxed mt-6 md:mt-0">
            MANAGED DATABASE DENGAN BACKUP REGULER, MIGRASI TERKONTROL, DAN SKEMA YANG DOKUMENTASI. DATA BISNIS KAMU DISEGARKAN — BUKAN DITABURKAN.
          </p>
        </div>
      </div>
    </section>
  );
}

export function CloudTeaserSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-12 bg-electric-blue text-off-white border-b border-electric-blue">
      <div className="col-span-12 md:col-span-8 p-margin">
        <span className="font-label-caps block mb-4">DGTLZ CLOUD</span>
        <p className="font-headline-lg leading-tight max-w-2xl">
          SEMUA SISTEM YANG KAMI BANGUN BERJALAN DI INFRASTRUKTUR KAMI SENDIRI — DEPLOYMENT OTOMATIS, DOCKER, DAN DATABASE YANG TERJAGA. KAMU TINGGAL PAKAI.
        </p>
      </div>
      <div className="col-span-12 md:col-span-4 p-margin flex items-center justify-start md:justify-end">
        <span className="font-label-caps border border-off-white px-6 py-3">DEPLOYMENT // DOCKER // DATABASES</span>
      </div>
    </section>
  );
}
