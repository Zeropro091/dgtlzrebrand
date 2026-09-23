export function PhilosophySection() {
  return (
    <section id="philosophy" className="grid grid-cols-1 md:grid-cols-12 bg-off-white border-b border-electric-blue">
      <div className="col-span-12 md:col-span-4 p-margin border-b md:border-b-0 md:border-r border-electric-blue flex flex-col justify-between min-h-[400px]">
        <span className="font-label-caps block">ABOUT</span>
        <h2 className="font-display-lg leading-none opacity-10 select-none">PHILOSOPHY</h2>
        <h3 className="font-headline-lg leading-tight mt-8">KERJA YANG RAPI & TEPAT.</h3>
      </div>
      <div className="col-span-12 md:col-span-8 grid grid-cols-1 md:grid-cols-2">
         <div className="p-margin border-b md:border-b-0 md:border-r border-electric-blue">
          <span className="font-label-caps block mb-8">01 / MATERIALITY</span>
          <p className="font-body-sm leading-relaxed text-justify">
            KAMI MEMBANGUN YANG KUAT DAN TAHAN LAMA. HASIL KERJA KAMI JELAS, TAJAM, DAN ARCHITECTURAL. BUKAN SEKADAR TREN HARI INI — TAPI STRUKTUR YANG TETAP KUAT TAHUN KE TAHUN.
          </p>
        </div>
        <div className="p-margin">
          <span className="font-label-caps block mb-8">02 / INTERFACE</span>
          <p className="font-body-sm leading-relaxed text-justify">
            SETIAP PROYEK KAMI RANCANG DENGAN DETAIL DAN STRUKTUR YANG JELAS. TANPA HIASAN TIDAK PERLU — SEMUANYA PUNYA FUNGSI. KAMI HILANGKAN GANGGUAN AGAR PESAN UTAMA MUNCUL LEBIH KUAT.
          </p>
        </div>
      </div>
    </section>
  );
}
