export function DoctrineSection() {
  return (
    <section id="doctrine" className="border-b border-electric-blue bg-electric-blue text-white">
      <div className="p-margin border-b border-white">
        <h2 className="font-display-lg leading-none uppercase">ECOSYSTEM DOCTRINE</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="p-margin border-b md:border-b-0 md:border-r border-white group hover:bg-white hover:text-electric-blue transition-colors duration-300">
          <h3 className="font-headline-md mb-4 italic">I. TRUTH IN STRUCTURE</h3>
          <p className="font-body-sm opacity-80 group-hover:opacity-100 transition-opacity">Kami tidak menyembunyikan proses kerja. Cara kami bekerja terbuka dan jadi bagian dari gaya desainnya.</p>
        </div>
        <div className="p-margin border-b md:border-b-0 md:border-r border-white group hover:bg-white hover:text-electric-blue transition-colors duration-300">
          <h3 className="font-headline-md mb-4 italic">II. ZERO DECORATION</h3>
          <p className="font-body-sm opacity-80 group-hover:opacity-100 transition-opacity">Hiasan tanpa fungsi itu pemborosan. Setiap elemen harus punya guna. Kalau tidak berfungsi, kami buang.</p>
        </div>
        <div className="p-margin group hover:bg-white hover:text-electric-blue transition-colors duration-300">
          <h3 className="font-headline-md mb-4 italic">III. ABSOLUTE PRESENCE</h3>
          <p className="font-body-sm opacity-80 group-hover:opacity-100 transition-opacity">Karya kami dirancang untuk terlihat dan diingat. Website dan sistem yang kami bangun tampil percaya diri karena isinya berfungsi nyata.</p>
        </div>
      </div>
    </section>
  );
}
