// Per-module briefing data for dedicated Arsenal module pages (/systems/:slug)
export interface ModuleBriefing {
  slug: string;
  headline: string;
  briefing: string;
  tactical: string;
  accent: string; // hex used for statue filter layers & accents
}

export const moduleBriefings: ModuleBriefing[] = [
  {
    slug: 'ops',
    headline: 'THE OPERATING CORE',
    briefing:
      'Modul yang mengorkestrasi seluruh operasi DGT.LZ — dari SOP, penjadwalan, hingga delegasi tugas lintas tim. Semua modul lain lapor dan dieksekusi dari sini.',
    tactical: 'TACTICAL ROLE // Koordinasi lintas modul, SOP & pipeline eksekusi harian.',
    accent: '#0B17EF',
  },
  {
    slug: 'gtm',
    headline: 'THE REVENUE ENGINE',
    briefing:
      'Mesin akuisisi klien: pipeline penjualan, outbound systems, dan funnel dari prospek pertama sampai kontrak ditandatangani. Diukur dalam closure, bukan aktivitas.',
    tactical: 'TACTICAL ROLE // Pipeline, outreach otomatis & konversi prospek jadi klien.',
    accent: '#ff3b30',
  },
  {
    slug: 'agent',
    headline: 'THE SWARM',
    briefing:
      'Armada multi-agent otonom yang mengeksekusi tugas kognitif — riset, drafting, klasifikasi, keputusan — tanpa menunggu manusia. Setiap agent punya satu job dan satu standar output.',
    tactical: 'TACTICAL ROLE // Agent otonom, orkestrasi task kognitif & self-execution.',
    accent: '#39FF14',
  },
  {
    slug: 'infra',
    headline: 'THE BULKHEAD',
    briefing:
      'Lapisan reliability: server, deployment, monitoring, dan keamanan. Kalau satu system down, modul ini yang bikin semuanya tetap hidup tanpa drama.',
    tactical: 'TACTICAL ROLE // Uptime, deployment, monitoring & lapisan keamanan.',
    accent: '#1a1b25',
  },
  {
    slug: 'recon',
    headline: 'THE EYES',
    briefing:
      'Satuan intelijen: web scraping, reconnaissance pasar, dan pengumpulan data kompetitor. Semua keputusan strategis DGT.LZ ditembak dari data yang dikumpulkan modul ini.',
    tactical: 'TACTICAL ROLE // Scraping, market intelligence & data recon.',
    accent: '#e5c158',
  },
  {
    slug: 'content',
    headline: 'THE VOICEBOX',
    briefing:
      'Pabrik konten: pipeline produksi media sosial, template visual, dan distribusi otomatis. Satu ide masuk, puluhan aset siap tayang keluar.',
    tactical: 'TACTICAL ROLE // Content engine, media pipeline & distribusi sosial.',
    accent: '#ff007f',
  },
  {
    slug: 'voice',
    headline: 'THE MOUTHPIECE',
    briefing:
      'Agen suara: telephony, voice bot, dan sistem percakapan otomatis yang bisa ngobrol dengan klien 24/7 — booking, follow-up, dan kualifikasi tanpa jeda.',
    tactical: 'TACTICAL ROLE // Voice agents, telephony & percakapan otomatis.',
    accent: '#00d2ff',
  },
  {
    slug: 'rag',
    headline: 'THE MEMORY',
    briefing:
      'Lapisan ingatan: retrieval, embeddings, dan vector engineering. Seluruh pengetahuan korporat diindeks supaya setiap agent dan system bisa menarik jawaban dalam hitungan milidetik.',
    tactical: 'TACTICAL ROLE // Knowledge retrieval, embeddings & vector search.',
    accent: '#7928ca',
  },
  {
    slug: 'fin',
    headline: 'THE LEDGER',
    briefing:
      'Saraf keuangan: OCR dokumen, pencatatan transaksi, dan administrasi otomatis. Invoice masuk, data tercatat, laporan keluar — tanpa entri manual.',
    tactical: 'TACTICAL ROLE // Financial ops, document OCR & administrasi otomatis.',
    accent: '#10b981',
  },
  {
    slug: 'dev',
    headline: 'THE FORGE',
    briefing:
      'Workshop pengrajin: developer tools, API compilers, dan arsitektur otomasi. Semua modul lain dibangun, dirangkai, dan dirawat dari sini.',
    tactical: 'TACTICAL ROLE // Developer tooling, API compiler & arsitektur otomasi.',
    accent: '#121212',
  },
];

export function getBriefingBySlug(slug?: string): ModuleBriefing | undefined {
  return moduleBriefings.find((b) => b.slug === slug);
}
