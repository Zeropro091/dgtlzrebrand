export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  department: 'AETHERS_STUDIO' | 'MADZILLA3D' | 'INSIGNIA_CREATIVE';
}

export const teamMembers: TeamMember[] = [
  { id: 't1', name: 'ARI', role: 'FOUNDER / CEO', imageUrl: '/team/ari-statue.jpg', department: 'INSIGNIA_CREATIVE' },
  { id: 't2', name: 'RIFKY', role: 'TEAM PARTNER', imageUrl: '/team/rifky-statue.jpg', department: 'MADZILLA3D' },
  { id: 't3', name: 'DWI', role: 'TEAM PARTNER', imageUrl: '/team/dwi-statue.jpg', department: 'INSIGNIA_CREATIVE' },
  { id: 't4', name: 'MADE', role: 'SYSTEMS ARCHITECT', imageUrl: '/team/open1-statue.jpg', department: 'AETHERS_STUDIO' },
  { id: 't5', name: 'PANJI', role: '3D / SPATIAL DESIGNER', imageUrl: '/team/open2-statue.jpg', department: 'MADZILLA3D' },
];

export const services = [
  { id: 's1', title: 'BRAND ARCHITECTURE', description: 'Membangun identitas brand yang kuat, konsisten, dan siap berkembang. Bukan ikut tren — tapi jadi acuan.' },
  { id: 's2', title: 'LANDING PAGE & WEB APP', description: 'Landing page yang jualan, web app yang kerja. Cepat, tegas, dan mudah dipakai.' },
  { id: 's3', title: 'SYSTEM & OTOMASI', description: 'Sistem, integrasi, dan otomasi yang bikin operasional jalan sendiri — stabil dan siap tumbuh.' },
  { id: 's4', title: 'DGTLZ AGENT', description: 'Deploy agent siap pakai ke bisnis kamu: Hermes Agent, OpenClaw, atau custom build — layani chat, follow-up lead, terima booking, dan jalanin operasional 24/7.' },
  { id: 's5', title: 'DGTLZ PAYGATE', description: 'Payment gateway white-label dengan QRIS instan — satu panggilan API, siap dipakai. Akses & onboarding lewat tim kami.' },
  { id: 's6', title: 'DGTLZ ROUTE', description: 'Gateway AI terpadu: routing cerdas, fallback multi-provider, dan respons cepat tanpa cold-start.' }
];

export interface FaqItem {
  category: string;
  topic: string;
  q: string;
  a: string;
}

export const faqs: FaqItem[] = [
  {
    category: '04 / AI & AUTOMATION',
    topic: 'DGTLZ AGENT',
    q: 'BISA DEPLOY AI AGENT KE BISNIS KAMI?',
    a: 'Bisa. Kami deploy Hermes Agent (operator otonom full-stack), OpenClaw (customer-facing agent untuk WhatsApp/IG/web chat), atau custom build sesuai alur kerja kamu. Agent terhubung ke web app, PayGate, dan notifikasi Telegram — lalu kami rawat lewat skema management.'
  },
  {
    category: '01 / INVESTMENT & VALUE',
    topic: 'COMPLEX AUTOMATION & AI',
    q: 'BISA BUAT AUTOMASI & AI YANG KOMPLEKS?',
    a: 'Bisa. Kami membangun otomasi yang lebih dari sekadar website — mulai dari AI agent, alur kerja multi-langkah, sistem pendukung keputusan, integrasi custom, sampai AI private/local.\n\nKami tidak menambahkan AI sekadar biar keren. Kami cari bagian kerja yang berulang dan makan waktu, lalu otomatisasi.'
  },
  {
    category: '01 / INVESTMENT & VALUE',
    topic: 'THE DGT.LZ DIFFERENCE',
    q: 'KENAPA DGT.LZ, BUKAN AGENCY WEBSITE BIASA?',
    a: 'Kami tidak bikin brosur digital — kami bangun infrastruktur operasional.\n\nAgency biasa memperbagus tampilan bisnis kamu di internet. Kami melihat cara bisnis kamu berjalan sehari-hari, lalu merapikan alur kerjanya.\n\nInput data manual. Komunikasi terpecah. Ketergantungan spreadsheet. Approval berulang. Sistem yang tidak nyambung.\n\nSemua itu kami ubah jadi sistem yang rapi.'
  },
  {
    category: '01 / INVESTMENT & VALUE',
    topic: 'INVESTMENT & SCOPE',
    q: 'BERAPA BIAYA PROYEKNYA?',
    a: 'Karena tidak pakai template generik, harga tergantung kompleksitas alur kerja, integrasi yang dibutuhkan, dan kedalaman otomasinya.\n\nSebelum mulai, kami sepakati lingkup, arsitektur, hasil, dan biaya secara fix. Kalau ada permintaan di luar itu, kami konfirmasi dulu sebelum kerja tambahan dimulai.'
  },
  {
    category: '02 / THE PROCESS & TIMELINE',
    topic: 'CLIENT INVOLVEMENT',
    q: 'APA YANG HARUS KAMI LAKUKAN SELAMA PROYEK?',
    a: 'Keterlibatan terbesar kamu ada di awal (Fase 1: Blueprinting) — kami butuh gambaran jelas cara bisnis kamu berjalan, di mana datanya, dan apa hambatannya. Setelah arsitektur dan desain disetujui, tim kami yang mengurus semua — kamu fokus jalanin bisnis.'
  },
  {
    category: '02 / THE PROCESS & TIMELINE',
    topic: 'TIMELINE & DELIVERY',
    q: 'BERAPA LAMA PENGERJAANNYA?',
    a: 'Sistem produksi yang fokus biasanya selesai sekitar 8 minggu dari riset sampai tayang. Proyek yang lebih kompleks bisa butuh fase tambahan.\n\nMINGGU 01\nARSITEKTUR & PRD\n\nMINGGU 2–4\nDESAIN & PROTOTYPE\n\nMINGGU 5–7\nSISTEM & OTOMASI\n\nMINGGU 8\nDEPLOY & SERAH TERIMA'
  },
  {
    category: '03 / SECURITY & OWNERSHIP',
    topic: 'CODE OWNERSHIP',
    q: 'SIAPA PEMILIK SOURCE CODE?',
    a: 'Ya — semua hasil proyek dan source code jadi milik kamu setelah selesai, sesuai kesepakatan di kontrak proyek.'
  },
  {
    category: '03 / SECURITY & OWNERSHIP',
    topic: 'POST-LAUNCH SUPPORT',
    q: 'APA YANG TERJADI SETELAH WEBSITE JADI?',
    a: 'Kami bisa lanjut bantu lewat paket maintenance bulanan: pemantauan, update, optimasi, dan pengembangan tambahan.'
  },
  {
    category: '03 / SECURITY & OWNERSHIP',
    topic: 'EXISTING SYSTEMS',
    q: 'BISA DIHUBUNGKAN DENGAN SISTEM KAMI YANG SUDAH ADA?',
    a: 'Bisa. Kami bisa terhubung dengan database, API, CRM, platform komunikasi, tools internal, dan layanan pihak ketiga yang sudah kamu pakai — selama memang technically feasible.'
  },
  {
    category: '04 / AI & AUTOMATION',
    topic: 'LEGACY SOFTWARE',
    q: 'APAKAH SOFTWARE LAMA KAMI HARUS DIGANTI?',
    a: 'Tidak harus. Langkah pertama kami justru memahami apa yang sudah berjalan baik. Kalau bisa diintegrasikan, kami tidak akan mengganti.'
  },
  {
    category: '04 / AI & AUTOMATION',
    topic: 'DECISION BOUNDARIES',
    q: 'APAKAH AI BISA MENGAMBIL KEPUTUSAN UNTUK BISNIS KAMI?',
    a: 'AI bisa mengambil keputusan yang aturannya sudah jelas, dalam batas yang kami tentukan. Untuk keputusan penting, ada gerbang approval, review manusia, logging, dan mekanisme rollback.'
  },
  {
    category: '01 / INVESTMENT & VALUE',
    topic: 'STYLE & ADAPTATION',
    q: 'THE DESIGN STYLE IS VERY BOLD AND STARK. CAN IT BE MODIFIED?',
    a: 'Our signature look is Architectural High-Tech Minimalism and Hardcore Neo-Brutalism. It relies on rigid grids, clear monospaced typography, and high contrast. While we strictly avoid fluffy, cluttered design elements, the layout is highly adaptable. We tailor the structural styling to feel clean, incredibly fast, and hyper-professional while staying true to your brand\'s core identity.'
  },
  {
    category: '05 / AFTER LAUNCH',
    topic: 'SELF-SUFFICIENCY',
    q: 'WILL WE BE ABLE TO MODIFY THE SYSTEM OURSELVES?',
    a: 'Yes. We aim to avoid unnecessary vendor lock-in. Systems are documented and structured so your team can understand, operate, and extend them.'
  },
  {
    category: '05 / AFTER LAUNCH',
    topic: 'SYSTEM RELIABILITY',
    q: 'WHAT HAPPENS IF THE SYSTEM BREAKS DOWN THE ROAD?',
    a: 'We build systems with high-reliability architectures—global edge deployment and isolated containerized services. This keeps the tech stack incredibly stable. Upon handover, we offer tailored Service Level Agreements (SLAs) for ongoing maintenance, security patches, and system scaling as your operations expand.'
  },
  {
    category: '02 / THE PROCESS & TIMELINE',
    topic: 'COMMUNICATIONS',
    q: 'WHO WILL BE MY POINT OF CONTACT?',
    a: 'You won\'t be passed around a giant, faceless account team. Client communication, project onboarding, and milestone tracking are tightly coordinated by our team partners, Kak Rifky and Dwi. You will have a direct, transparent loop to see exactly where your project stands at any given hour.'
  }
];

export interface WorkItem {
  id: string;
  client: string;
  title: string;
  category: string;
  imageUrl: string;
  videoUrl?: string;
  images?: string[];
  pdfUrl?: string;
  slidesUrl?: string;
  igCarouselUrl?: string;
  status?: 'LIVE' | 'UNDER CONSTRUCTION' | 'IN RESEARCH';
  span: string;
  story: string;
  problem: string;
  solve: string;
}

export interface EventItem {
  id: string;
  date: string;
  title: string;
  location: string;
  status: 'OPEN' | 'CLOSED' | 'INVITE ONLY';
  description: string;
}

export const events: EventItem[] = [
  {
    id: 'EVT-01',
    date: '2026.04.15',
    title: 'STRUCTURAL FORUM',
    location: 'ONLINE',
    status: 'CLOSED',
    description: 'Diskusi terbuka soal masa depan desain brutalist dan software engineering.'
  },
  {
    id: 'EVT-02',
    date: '2026.05.22',
    title: 'SYSTEM DECAY WORKSHOP',
    location: 'ONLINE',
    status: 'CLOSED',
    description: 'Workshop tertutup: eksplorasi efek glitch, visualisasi data mentah, dan estetika digital.'
  },
  {
    id: 'EVT-03',
    date: '2026.06.10',
    title: 'NEO-BRUTALISM SUMMIT',
    location: 'ONLINE',
    status: 'CLOSED',
    description: 'Summit online: kembali ke desain yang fungsional, tegas, dan tanpa basa-basi.'
  }
];

export const workItems: WorkItem[] = [
  {
    id: 'w1',
    client: 'MADZILLA 3D STUDIO LAB',
    title: 'BLUE MARBLE 3D PRINT',
    category: 'PRODUCT DESIGN',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop',
    videoUrl: '/blue-marble.mp4',
    span: 'md:col-span-8',
    story: 'Madzilla 3D Studio Lab ingin menunjukkan hasil print 3D premium yang meniru pola, warna, dan kilau marmer biru asli.',
    problem: 'Print 3D biasa terlihat datar dan murahan: garis layer kelihatan dan kesan plastik menutupi kesan mewah.',
    solve: 'Kami pakai filament komposit khusus dengan suhu printing terukur supaya lapisan warna menyatu alami. Hasil akhirnya dipoles glossy — mirip marmer biru asli.'
  },
  {
    id: 'w2',
    client: 'AETHERS STUDIO',
    title: 'RAMPUNG: MANAGEMENT APP',
    category: 'MOBILE APP / COMPOSE',
    imageUrl: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=800&auto=format&fit=crop',
    span: 'md:col-span-4',
    story: 'Aplikasi manajemen tugas dan proyek studio Aethers dengan monitoring ritme kerja dan fokus terkurasi untuk tim kecil 5-15 orang.',
    problem: 'Tools project management konvensional terlalu berat dan penuh form rumit yang justru mendistraksi fokus kerja harian tim studio.',
    solve: 'Kami bangun native Android app dengan Jetpack Compose & Room DB. Memadukan estetika Warm Sand Editorial, alur Task-First, checklist subtask drill-down, dan auto-sync progres proyek.'
  },
  {
    id: 'w3',
    client: 'VANGUARD SECURE',
    title: 'DATA VAULT PROTOCOL',
    category: 'SYSTEM ENGINEERING',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
    span: 'md:col-span-4',
    story: 'Vanguard Secure butuh tampilan digital yang langsung terasa rapuh-dilindungi: penyimpanan terenkripsi yang tidak bisa ditembus.',
    problem: 'Platform lama mereka terlihat seperti SaaS biasa — tidak menyampaikan seberapa aman dan terisolasi data vault-nya.',
    solve: 'Kami bangun sistem yang terasa seperti brankas fisik: tema gelap kontras tinggi dengan garis struktur tegas. Setiap aksi pengguna disengaja — terasa terkendali dan aman.'
  },
  {
    id: 'w4',
    client: 'LENSA INSIGNIA',
    title: 'LENSA INSIGNIA',
    category: 'NEWS PORTAL',
    imageUrl: '/lensainsignia_home.png',
    span: 'md:col-span-8',
    story: 'Lensa Insignia, portal berita online, butuh website yang cepat dan enak dibaca — tanpa keramaian khas situs berita biasa.',
    problem: 'Situs berita biasa bikin pembaca lelah: iklan menyela, kolom berantakan, dan alur baca tidak jelas.',
    solve: 'Kami bangun portal yang bersih dan cepat: huruf tajam, kategori jelas, desain minimal. Fokusnya nyaman dibaca dan gampang dinavigasi — dari berita sosial sampai edukasi dan pemerintahan.'
  },
  {
    id: 'w5',
    client: 'STUDENT ARCHITECTS & MADZILLA3D',
    title: '3D BUILDING & PRINT',
    category: 'SPATIAL MODELING',
    imageUrl: '/3d-building/building-1.webp',
    images: [
      '/3d-building/building-1.webp',
      '/3d-building/building-2.webp',
      '/3d-building/building-3.webp',
      '/3d-building/building-4.webp'
    ],
    span: 'md:col-span-12',
    story: 'Proyek kolaborasi model arsitektur dengan mahasiswa: mengubah CAD bangunan yang rumit jadi maket fisik untuk analisis ruang.',
    problem: 'Detail halus seperti kisi jendela, overhang tipis, dan struktur mikro sering rusak atau jebol saat print FDM/SLA biasa.',
    solve: 'Kami pakai dukungan mikro khusus dan teknik slicing custom. Dengan PLA kualitas tinggi, hasilnya presisi milimeter — referensi fisik yang rapi untuk riset mahasiswa.'
  },
  {
    id: 'w6',
    client: 'DGTLZ DIGITAL Solutions (R&D)',
    title: 'OMNICHANNEL CRO & CAC EFFICIENCY',
    category: 'APPLIED RESEARCH',
    imageUrl: '/case-study-dgtlz.png',
    pdfUrl: '/case_study_paper_dgtlz.pdf',
    slidesUrl: '/case_study_slides_dgtlz.pptx',
    igCarouselUrl: '/ig-carousel-generator.html',
    span: 'md:col-span-12',
    story: 'Studi A/B testing 90 hari yang menggabungkan Design Thinking, Fogg Behavior Model, dan funnel AARRR. Dari 245.000 sesi aktif, kami memetakan perilaku pengguna untuk menaikkan konversi dan efisiensi iklan.',
    problem: 'Masalah klasik: pembeli kabur di kasir (78% cart abandonment) dan biaya iklan mahal. Penyebab utamanya — form checkout 12 kolom, tombol sulit dijangkau di HP, dan iklan menyasar terlalu luas.',
    solve: 'Kami rombak perjalanan pengguna di 2 area: (1) checkout jadi satu halaman 4 kolom dengan alamat otomatis, dan (2) iklan disegmentasi TOFU/MOFU/BOFU. Hasilnya: konversi naik 183,3% (1,2% → 3,4%), cart abandonment turun 46,1%, biaya iklan turun 43,3%.'
  },
  {
    id: 'w7',
    client: 'DGTLZ FINTECH LAB (R&D)',
    title: 'PAYMENT ORCHESTRATION LAYER (DGTLZ PAYGATE)',
    category: 'FINTECH INFRASTRUCTURE',
    imageUrl: '/posters/payment-orchestration.png',
    pdfUrl: '/case_study_paper_payment_dgtlz.pdf',
    status: 'LIVE',
    span: 'md:col-span-12',
    story: 'DGTLZ PayGate adalah mesin pembayaran white-label dengan QRIS instan. Dirancang untuk checkout otomatis, bot booking AI, dan retail tanpa storefront — cocok untuk UMKM, bisnis booking, dan bisnis digital di Indonesia.',
    problem: 'Transfer manual dan gateway standar sering bikin pembeli kabur dan pencatatan jadi manual. Padahal bisnis butuh QRIS instan yang menyatu dengan sistem otomatis mereka — tanpa merek pihak ketiga yang kelihatan.',
    solve: 'Kami bangun PayGate sebagai proxy ringan berperforma tinggi: QRIS dibuat dalam satu panggilan API, nama merchant bisa custom, webhook terverifikasi otomatis, dan callback instan. Akses API dan onboarding ditangani langsung oleh tim kami.'
  }
];


