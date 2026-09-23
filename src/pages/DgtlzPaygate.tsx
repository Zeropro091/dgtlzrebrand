import { useState } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  ArrowDownRight, 
  Lock, 
  Activity, 
  QrCode, 
  CheckCircle2,
  Clock,
  Sparkles,
  Smartphone,
  MessageSquare,
  Building2,
  Check,
  HelpCircle,
  TrendingUp,
  CreditCard,
  Layers,
  Bot
} from 'lucide-react';

const WA_CONTACT_LINK = "https://wa.me/6281237729115?text=Halo%20DGTLZ%20Team!%20Saya%20tertarik%20untuk%20mengajukan%20akses%20private%20DGTLZ%20PayGate%20untuk%20bisnis%20saya.%20Mohon%20info%20onboarding%20dan%20kredensial.";

const FEATURES = [
  {
    tag: "WHITE-LABEL BRANDING",
    title: "Dynamic Merchant Identity",
    desc: "Nama bisnis kamu yang langsung terpampang di aplikasi m-banking & e-wallet pelanggan (BCA, Mandiri, BRI, GoPay, OVO, ShopeePay), bukan nama agregator pihak ketiga.",
    highlight: "100% Brand Trust"
  },
  {
    tag: "INSTANT AUTOMATION",
    title: "AI & WhatsApp Seamless Checkout",
    desc: "Didesain spesifik untuk terhubung langsung dengan AI Agent dan automasi WhatsApp. Pelanggan chat, sistem generate QR instan, pembayaran lunas terdeteksi seketika tanpa perlu kirim bukti transfer manual.",
    highlight: "Zero Manual Slip Checking"
  },
  {
    tag: "INTELLIGENT ROUTING",
    title: "4-Tier Redundant Failover",
    desc: "Infrastruktur multi-jalur aktif (qris_one s/d qris_four). Saat satu jalur perbankan sedang maintenance nasional, sistem otomatis mengalihkan transaksi ke jalur sekunder tanpa checkout gagal.",
    highlight: "99.98% Success Rate"
  },
  {
    tag: "LIQUIDITY & PAYOUT",
    title: "Instant API-Driven Settlement",
    desc: "Penarikan saldo otomatis tanpa proses birokrasi berhari-hari. Dilindungi otentikasi PIN 6-digit dan whitelist rekening terdaftar untuk keamanan dana operasional bisnis Anda.",
    highlight: "Same-Day Liquidity"
  }
];

const USE_CASES = [
  {
    badge: "BOOKING & APPOINTMENT",
    title: "WhatsApp Booking & DP Otomatis",
    problem: "Calon pelanggan booking via WhatsApp sering batal karena proses transfer lambat dan admin harus bolak-balik cek mutasi manual.",
    solution: "AI Assistant otomatis mengirim QRIS ber-nominal unik dan nama bisnis kamu. Begitu pelanggan scan & bayar, slot booking langsung terkunci & notifikasi appointment otomatis terkirim.",
    result: "Penurunan no-show hingga 78% & efisiensi admin 100%."
  },
  {
    badge: "DIGITAL SERVICES & SAAS",
    title: "Instant Top-Up & Subscription",
    problem: "Gateway konvensional mengenakan biaya langganan bulanan mahal dan verifikasi merchant hingga berminggu-minggu.",
    solution: "Satu pintu API PayGate DGTLZ dengan integrasi webhook instan. Pelanggan top-up saldo atau bayar invoice dalam hitungan 5 detik.",
    result: "Checkout conversion naik 35% tanpa biaya sewa gateway."
  },
  {
    badge: "F&B, RETAIL & HOSPITALITY",
    title: "Contactless QR Table Ordering",
    problem: "Kasir kewalahan saat jam sibuk dan pelanggan enggan download aplikasi terpisah hanya untuk order makanan.",
    solution: "Scan QR di meja, pilih menu di web browser, scan QRIS dinamis di layar yang sama. Pesanan langsung masuk ke printer dapur tanpa kasir manual.",
    result: "Turnover meja 2x lebih cepat di jam padat."
  }
];

const FAQS = [
  {
    q: "Apa bedanya DGTLZ PayGate dengan Payment Gateway umum lainnya?",
    a: "DGTLZ PayGate dibangun sebagai White-Label Proxy Engine yang siap diintegrasikan langsung dengan AI Agent, bot WhatsApp, dan arsitektur otomasi kustom. Anda mendapatkan fitur nama toko dinamis per transaksi, rute multi-failover otomatis, dan tanpa biaya sewa bulanan atau verifikasi birokratis yang berbelit-belit."
  },
  {
    q: "Aplikasi apa saja yang bisa digunakan pembeli untuk scan QRIS PayGate?",
    a: "Semua aplikasi mobile banking di Indonesia (BCA Mobile, Livin by Mandiri, BRImo, BNI Mobile, CIMB Octo, Permata, dll) serta seluruh E-Wallet resmi (GoPay, OVO, Dana, ShopeePay, LinkAja, AstraPay) yang mendukung standar QRIS Nasional Bank Indonesia."
  },
  {
    q: "Bagaimana cara kerja biaya admin (fee)?",
    a: "DGTLZ PayGate mendukung 2 mode: Mode 'Buyer' (biaya admin 0.7% ditambahkan transparan ke nominal pembayaran pelanggan sehingga Anda menerima 100% utuh) atau Mode 'User' (biaya dipotong dari saldo). Tidak ada biaya tersembunyi atau potongan bulanan."
  },
  {
    q: "Bagaimana proses onboarding dan mendapatkan akses kredensial?",
    a: "Akses DGTLZ PayGate saat ini dibuka secara terkelola (Managed Onboarding). Anda cukup menghubungi tim kami melalui tombol WhatsApp di bawah. Tim kami akan menyiapkan konfigurasi profil usaha, whitelist URL/domain Anda, dan menyerahkan akses akun."
  }
];

export function DgtlzPaygate() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-off-white min-h-screen text-neutral-900 selection:bg-electric-blue selection:text-white">
      
      {/* 1. TOP STATUS TICKER STRIP */}
      <div className="bg-electric-blue text-white px-4 md:px-margin py-2 text-[11px] font-mono flex flex-wrap items-center justify-between gap-4 border-b border-electric-blue">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse"></span>
            PAYGATE ENGINE STATUS: PRIVATE MANAGED ACCESS
          </span>
          <span className="hidden sm:inline text-white/40">|</span>
          <span className="hidden sm:inline text-white/80">DISPATCH SPEED: &lt; 200MS</span>
          <span className="hidden md:inline text-white/40">|</span>
          <span className="hidden md:inline text-white/80">NATIONAL QRIS RECOGNITION</span>
        </div>
        <div className="flex items-center gap-4 text-white/90">
          <span className="font-bold tracking-widest text-[10px] uppercase bg-white/10 px-2 py-0.5 border border-white/20">
            WHITE-LABEL PROXY
          </span>
          <span className="text-[10px] text-[#39FF14]">STANDBY FOR ONBOARDING</span>
        </div>
      </div>

      {/* 2. GRAND HERO SECTION */}
      <header className="border-b border-electric-blue bg-white relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Main Hero Column */}
          <div className="lg:col-span-7 p-6 md:p-margin lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-electric-blue">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="font-label-caps bg-electric-blue text-white px-3 py-1 font-bold">
                  PROPRIETARY PAYMENT ENGINE
                </span>
                <span className="font-label-caps border border-electric-blue text-electric-blue px-3 py-1 font-bold">
                  WHITE-LABEL QRIS PROXY
                </span>
              </div>

              <h1 className="font-display-xl uppercase leading-none tracking-tight text-neutral-900">
                DGTLZ PAYGATE
              </h1>
              
              <p className="font-serif text-xl md:text-2xl lg:text-3xl text-electric-blue italic mt-4 max-w-2xl leading-snug">
                Sistem pembayaran QRIS dinamis & otomatisasi settlement untuk bisnis modern, UMKM, dan ekosistem AI WhatsApp.
              </p>

              <p className="font-sans text-neutral-600 text-base leading-relaxed mt-6 max-w-xl">
                Bebaskan bisnis Anda dari verifikasi manual bukti transfer. Terima pembayaran instan dari seluruh bank & e-wallet di Indonesia dengan nama brand Anda sendiri, notifikasi real-time, dan penarikan saldo instan.
              </p>

              {/* Core Feature Matrix Banner */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-b border-electric-blue/30 py-4 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block">Settlement</span>
                  <span className="text-lg font-serif font-bold text-electric-blue">Real-Time</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block">Merchant Brand</span>
                  <span className="text-lg font-serif font-bold text-neutral-900">Custom 100%</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block">Auto-Failover</span>
                  <span className="text-lg font-serif font-bold text-neutral-900">4 Active Rails</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block">Integration</span>
                  <span className="text-lg font-serif font-bold text-[#39FF14] bg-black px-1.5 py-0.5">DIRECT AI/WA</span>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4 items-center font-mono text-xs">
              <a
                href={WA_CONTACT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-electric-blue text-white font-bold uppercase tracking-wider hover:bg-blue-800 transition-colors flex items-center gap-2 shadow-sm"
              >
                AJUKAN AKSES & ONBOARDING PRIVATE &rarr;
              </a>
              <a
                href="#showcase-preview"
                className="px-6 py-4 border border-electric-blue text-electric-blue font-bold uppercase tracking-wider hover:bg-electric-blue/5 transition-colors flex items-center gap-2"
              >
                <QrCode className="w-4 h-4" /> LIHAT PREVIEW SISTEM
              </a>
            </div>
          </div>

          {/* Right Column: Hero Visual Product Mockup */}
          <div className="lg:col-span-5 bg-neutral-900 text-white p-6 md:p-8 flex flex-col justify-between font-mono relative overflow-hidden border-b lg:border-b-0">
            {/* Header Badge */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
              <span className="text-xs text-[#39FF14] font-bold uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#39FF14]" />
                LIVE CHECKOUT PREVIEW
              </span>
              <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 border border-neutral-700">
                DYNAMIC QRIS
              </span>
            </div>

            {/* Static Visual Phone-Style Card Mockup */}
            <div className="bg-white text-black p-5 rounded-none border border-neutral-300 shadow-2xl relative">
              {/* Merchant Title */}
              <div className="text-center border-b border-neutral-200 pb-3">
                <div className="inline-flex items-center gap-1.5 bg-blue-50 text-electric-blue px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3" /> VERIFIED MERCHANT
                </div>
                <h3 className="font-bold text-sm uppercase tracking-tight text-neutral-900">
                  DGTLZ STORE
                </h3>
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">
                  NMID: ID1020269918239 • QRIS RESMI
                </span>
              </div>

              {/* Dynamic QR Display Box */}
              <div className="my-4 flex flex-col items-center justify-center p-3 bg-neutral-50 border border-dashed border-neutral-300">
                <div className="relative p-2 bg-white border border-neutral-200 shadow-xs">
                  {/* Visual QR Image representation */}
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=00020101021226680016ID.CO.QRIS.WWW01189360091100000000005204581253033605802ID5922DGTLZ%20STORE6013DENPASAR6304ABCD" 
                    alt="Sample QRIS Preview" 
                    className="w-44 h-44 object-contain"
                  />
                  <div className="absolute inset-0 border-2 border-electric-blue/30 pointer-events-none"></div>
                </div>

                <div className="flex items-center gap-2 mt-3 text-[10px] font-mono text-neutral-600">
                  <Clock className="w-3 h-3 text-amber-500 animate-pulse" />
                  <span>Berlaku 15:00 menit • Auto-Deteksi</span>
                </div>
              </div>

              {/* Payment Detail Breakdown */}
              <div className="space-y-1.5 border-t border-neutral-200 pt-3 text-xs font-mono">
                <div className="flex justify-between text-neutral-600 text-[11px]">
                  <span>Tagihan Layanan (Facial Glow):</span>
                  <span className="font-bold text-neutral-800">Rp 350.000</span>
                </div>
                <div className="flex justify-between text-neutral-500 text-[10px]">
                  <span>Kode Verifikasi Unik:</span>
                  <span>Rp 47</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-neutral-200 text-electric-blue">
                  <span>TOTAL PEMBAYARAN:</span>
                  <span className="text-base font-serif">Rp 350.047</span>
                </div>
              </div>

              {/* Supported Apps Ticker */}
              <div className="mt-4 pt-3 border-t border-neutral-200 text-center">
                <span className="text-[9px] text-neutral-400 uppercase tracking-wider block mb-1">
                  BCA • MANDIRI • BRI • BNI • GOPAY • OVO • DANA • SHOPEEPAY
                </span>
                <div className="w-full bg-[#39FF14]/20 border border-[#39FF14] text-neutral-900 py-1.5 text-[10px] font-bold uppercase tracking-wider">
                  ✓ OTOMATIS TERVERIFIKASI REAL-TIME
                </div>
              </div>
            </div>

            {/* Bottom Card Summary */}
            <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400">
              <span>SECURITY: ENCRYPTED HTTPS</span>
              <span className="text-[#39FF14]">DGT.LZ PROTOCOL V1</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. CORE VALUE PILLARS */}
      <section className="border-b border-electric-blue bg-white py-16">
        <div className="px-4 md:px-margin max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="font-label-caps bg-electric-blue text-white px-2.5 py-1 text-[10px] font-bold">
              WHY DGTLZ PAYGATE
            </span>
            <h2 className="font-display-md uppercase mt-3 text-neutral-900">
              INFRASTRUKTUR TRANSAKSI TANPA HAMBATAN
            </h2>
            <p className="font-serif italic text-neutral-600 max-w-2xl text-base mt-2">
              Dirancang untuk menghilangkan friksi pembayaran, mempercepat perputaran arus kas, dan membebaskan tim Anda dari pekerjaan klerikal manual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
            {FEATURES.map((feat, idx) => (
              <div 
                key={idx} 
                className="border border-electric-blue p-6 bg-off-white hover:bg-white transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-electric-blue/20 pb-2">
                    <span className="text-[10px] text-electric-blue font-bold uppercase tracking-wider">
                      {feat.tag}
                    </span>
                    <span className="text-xs text-neutral-400 font-bold">0{idx + 1}</span>
                  </div>
                  <h3 className="font-bold text-base text-neutral-900 uppercase mb-2 group-hover:text-electric-blue transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-neutral-600 text-xs leading-relaxed font-sans mt-2">
                    {feat.desc}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-neutral-200">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-neutral-900 uppercase bg-white border border-neutral-300 px-2 py-1">
                    <CheckCircle2 className="w-3 h-3 text-[#39FF14] fill-black" />
                    {feat.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. STATIC VISUAL SHOWCASE & MOCKUPS */}
      <section id="showcase-preview" className="border-b border-electric-blue py-16 bg-off-white">
        <div className="px-4 md:px-margin max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 pb-4 border-b border-electric-blue">
            <div>
              <span className="font-label-caps bg-black text-[#39FF14] px-2.5 py-0.5 text-[10px] tracking-widest uppercase">
                SYSTEM SHOWCASE
              </span>
              <h2 className="font-display-md uppercase leading-none mt-3">
                INTEGRASI REAL-WORLD DGTLZ PAYGATE
              </h2>
            </div>
            <p className="font-serif italic text-neutral-600 max-w-md text-sm mt-2 md:mt-0">
              Bagaimana PayGate beroperasi di dalam ekosistem WhatsApp AI, Web Checkout, dan Panel Keuangan Bisnis Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-mono">
            
            {/* Mockup 1: WhatsApp Bot Automated Payment Flow */}
            <div className="border border-electric-blue bg-neutral-900 text-neutral-100 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
                  <span className="text-xs text-[#39FF14] font-bold uppercase flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    1. WHATSAPP AI AGENT FLOW
                  </span>
                  <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5">AUTO CHAT</span>
                </div>

                <div className="space-y-3 text-[11px] font-sans">
                  {/* User Bubble */}
                  <div className="bg-neutral-800 p-3 rounded-lg text-neutral-200 max-w-[85%] ml-auto border border-neutral-700">
                    <span className="text-[9px] text-neutral-400 block mb-1">Customer (08:42 WITA)</span>
                    "Halo kak, mau DP booking sesi konsultasi jam 3 sore ini."
                  </div>

                  {/* AI Bot Bubble with QR */}
                  <div className="bg-blue-950/80 border border-electric-blue/40 p-3 rounded-lg text-neutral-200 max-w-[90%] space-y-2">
                    <div className="flex items-center gap-1.5 text-electric-blue font-bold text-[10px] uppercase font-mono">
                      <Bot className="w-3.5 h-3.5" /> DGTLZ AI CONCIERGE
                    </div>
                    <p>Baik Kak Sarah, slot booking jam 15:00 sudah kami siapkan. Silakan scan QRIS DP berikut:</p>
                    
                    <div className="bg-white p-2 rounded text-center my-1 text-black font-mono">
                      <div className="text-[9px] font-bold">DGTLZ STORE</div>
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=ESTHETIQUE_DP_100000" 
                        alt="QRIS Preview" 
                        className="w-28 h-28 mx-auto my-1"
                      />
                      <div className="text-[10px] font-bold text-electric-blue">Rp 100.000</div>
                    </div>
                  </div>

                  {/* Immediate Confirmation Notification */}
                  <div className="bg-emerald-950/60 border border-emerald-500/40 p-3 rounded-lg text-neutral-200 max-w-[90%] font-mono text-[10px]">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> PAYMENT DETECTED (LUNAS)
                    </div>
                    <p className="font-sans text-[11px]">Terima kasih! Pembayaran DP Rp 100.000 telah masuk. Jadwal Anda otomatis terkunci di sistem bisnis.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-neutral-800 text-[10px] text-neutral-400">
                Otomasi 24/7 tanpa perlu ada admin yang standby malam hari.
              </div>
            </div>

            {/* Mockup 2: Fast Checkout Modal for Web / Apps */}
            <div className="border border-electric-blue bg-white text-neutral-900 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
                  <span className="text-xs text-electric-blue font-bold uppercase flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    2. SEAMLESS IN-APP CHECKOUT
                  </span>
                  <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5">POPUP / MODAL</span>
                </div>

                <div className="border border-neutral-300 p-4 bg-off-white space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                    <div>
                      <span className="text-[10px] text-neutral-500 block uppercase">ORDER #DG-9921</span>
                      <span className="font-bold text-xs uppercase">DGTLZ AI Token Tier 03</span>
                    </div>
                    <span className="text-base font-serif font-bold text-electric-blue">Rp 195.000</span>
                  </div>

                  <div className="bg-white p-3 border border-neutral-200 text-center">
                    <span className="text-[9px] text-neutral-500 uppercase block mb-1">SCAN VIA MOBILE BANKING ATAU E-WALLET</span>
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DGTLZ_TOKEN_CHECKOUT" 
                      alt="Checkout QR" 
                      className="w-32 h-32 mx-auto my-1 border border-neutral-200 p-1"
                    />
                    <div className="text-[10px] font-mono text-neutral-600 mt-1">
                      Kode Unik: <strong className="text-neutral-900">Rp 195.012</strong>
                    </div>
                  </div>

                  <div className="space-y-1 text-[10px] text-neutral-500 font-mono">
                    <div className="flex items-center gap-1 text-emerald-600 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      Listening for incoming bank webhook...
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-neutral-200 text-[10px] text-neutral-500">
                Kompatibel dengan semua web framework (React, Next.js, WordPress, Webhook).
              </div>
            </div>

            {/* Mockup 3: Merchant Analytics & Instant Settlement Portal */}
            <div className="border border-electric-blue bg-white text-neutral-900 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
                  <span className="text-xs text-neutral-900 font-bold uppercase flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-electric-blue" />
                    3. MERCHANT SETTLEMENT HUD
                  </span>
                  <span className="text-[10px] bg-electric-blue text-white px-2 py-0.5 font-bold">LIVE HUB</span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Saldo Metric */}
                  <div className="bg-off-white border border-electric-blue/40 p-3">
                    <span className="text-[10px] text-neutral-500 uppercase block">Saldo Siap Tarik (Settled Balance)</span>
                    <div className="text-2xl font-serif font-bold text-electric-blue mt-0.5">
                      Rp 14.850.000
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-neutral-200 text-[10px] text-neutral-600">
                      <span>Hari Ini: +48 Transaksi</span>
                      <span className="text-emerald-600 font-bold">100% Success</span>
                    </div>
                  </div>

                  {/* Recent Settlement List */}
                  <div className="border border-neutral-200 p-2.5 bg-white space-y-2 text-[10px]">
                    <div className="font-bold text-neutral-700 uppercase border-b border-neutral-100 pb-1">
                      Riwayat Penarikan Saldo Otomatis
                    </div>
                    <div className="flex justify-between items-center text-neutral-600">
                      <span>Withdraw to BCA (Ari Putu)</span>
                      <span className="font-bold text-neutral-900">Rp 5.000.000 ✓</span>
                    </div>
                    <div className="flex justify-between items-center text-neutral-600">
                      <span>Withdraw to Mandiri Corp</span>
                      <span className="font-bold text-neutral-900">Rp 8.500.000 ✓</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-neutral-200 text-[10px] text-neutral-500">
                Pencairan saldo aman terlindungi verifikasi PIN 6-digit.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. INDUSTRY USE CASES & SCENARIOS */}
      <section className="border-b border-electric-blue bg-white py-16">
        <div className="px-4 md:px-margin max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="font-label-caps border border-electric-blue text-electric-blue px-3 py-1 text-[10px] font-bold">
              TARGET WORKFLOWS
            </span>
            <h2 className="font-display-md uppercase mt-3 text-neutral-900">
              DIRANCANG KHUSUS UNTUK USE CASE BERIKUT
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {USE_CASES.map((uc, i) => (
              <div 
                key={i} 
                className="border border-electric-blue p-6 md:p-8 bg-off-white hover:bg-white transition-colors flex flex-col justify-between"
              >
                <div>
                  <span className="font-label-caps bg-black text-[#39FF14] px-2 py-0.5 text-[9px] font-bold tracking-wider inline-block mb-3">
                    {uc.badge}
                  </span>
                  <h3 className="font-bold font-mono text-base uppercase text-neutral-900 mb-4">
                    {uc.title}
                  </h3>

                  <div className="space-y-3 font-sans text-xs">
                    <div>
                      <span className="font-mono text-[10px] text-red-600 font-bold uppercase block mb-0.5">
                        [ KENDALA SEBELUMNYA ]
                      </span>
                      <p className="text-neutral-600 leading-relaxed">
                        {uc.problem}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-neutral-200">
                      <span className="font-mono text-[10px] text-electric-blue font-bold uppercase block mb-0.5">
                        [ DENGAN DGTLZ PAYGATE ]
                      </span>
                      <p className="text-neutral-800 leading-relaxed">
                        {uc.solution}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-electric-blue/30 font-mono text-xs text-neutral-900 font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#39FF14] bg-black p-0.5" />
                  {uc.result}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ONBOARDING & ACCESS STEPS */}
      <section className="border-b border-electric-blue bg-neutral-900 text-white py-16 font-mono">
        <div className="px-4 md:px-margin max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-label-caps bg-electric-blue text-white px-3 py-1 text-[10px] font-bold">
              3-STEP ONBOARDING
            </span>
            <h2 className="font-display-md uppercase mt-3 text-white">
              CARA MENGAKTIFKAN DGTLZ PAYGATE
            </h2>
            <p className="font-serif italic text-neutral-400 text-sm mt-2">
              Proses aktivasi cepat tanpa birokrasi berbelit. Siap digunakan dalam hitungan jam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-neutral-800 p-6 bg-neutral-950 relative">
              <div className="text-3xl font-serif text-[#39FF14] font-bold mb-3">01</div>
              <h3 className="font-bold text-sm uppercase text-white mb-2">Hubungi Tim Operator</h3>
              <p className="text-neutral-400 font-sans text-xs leading-relaxed">
                Klik tombol WhatsApp untuk mengajukan kebutuhan payment gateway, nama brand merchant, dan jenis integrasi bisnis Anda.
              </p>
            </div>

            <div className="border border-neutral-800 p-6 bg-neutral-950 relative">
              <div className="text-3xl font-serif text-[#39FF14] font-bold mb-3">02</div>
              <h3 className="font-bold text-sm uppercase text-white mb-2">Penerbitan Kredensial & Whitelist</h3>
              <p className="text-neutral-400 font-sans text-xs leading-relaxed">
                Tim engineering DGTLZ menerbitkan `account_id`, `secret_token`, serta mendaftarkan URL webhook dan rekening settlement Anda.
              </p>
            </div>

            <div className="border border-neutral-800 p-6 bg-neutral-950 relative">
              <div className="text-3xl font-serif text-[#39FF14] font-bold mb-3">03</div>
              <h3 className="font-bold text-sm uppercase text-white mb-2">Live Production & Auto Settlement</h3>
              <p className="text-neutral-400 font-sans text-xs leading-relaxed">
                Sistem langsung aktif menerima pembayaran QRIS dari pelanggan, mengirim notifikasi otomatis, dan dana siap ditarik kapan saja.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a
              href={WA_CONTACT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-5 bg-[#39FF14] text-black font-bold uppercase tracking-wider hover:bg-emerald-400 transition-colors text-sm shadow-lg"
            >
              <Lock className="w-4 h-4" /> HUBUNGI OPERATOR UNTUK AKTIVASI &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="border-b border-electric-blue bg-white py-16">
        <div className="px-4 md:px-margin max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <span className="font-label-caps border border-electric-blue text-electric-blue px-3 py-1 text-[10px] font-bold">
              FAQ & DETAILS
            </span>
            <h2 className="font-display-md uppercase mt-3">
              PERTANYAAN UMUM
            </h2>
          </div>

          <div className="space-y-4 font-mono">
            {FAQS.map((faq, idx) => (
              <div 
                key={idx} 
                className="border border-electric-blue bg-off-white transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 md:p-5 flex items-center justify-between gap-4 font-bold text-xs uppercase text-neutral-900 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-electric-blue shrink-0" />
                    {faq.q}
                  </span>
                  <span className="text-electric-blue text-base font-bold">
                    {openFaq === idx ? '−' : '+'}
                  </span>
                </button>

                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-neutral-600 font-sans text-xs leading-relaxed border-t border-neutral-200">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FOOTER CALL TO ACTION */}
      <footer className="bg-electric-blue text-white py-16 px-4 md:px-margin font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-[10px] text-[#39FF14] uppercase font-bold tracking-widest block mb-2">
              PRIVATE MANAGED INTEGRATION
            </span>
            <h3 className="font-display-md uppercase leading-tight">
              SIAP MENGOTOMATISASI PEMBAYARAN BISNIS ANDA?
            </h3>
            <p className="font-serif italic text-white/80 text-sm mt-2 max-w-xl">
              Hubungi tim operator DGTLZ sekarang untuk konsultasi workflow, konfigurasi nama merchant, dan aktivasi akses kredensial.
            </p>
          </div>
          
          <a
            href={WA_CONTACT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-5 bg-white text-electric-blue font-bold uppercase tracking-wider hover:bg-[#39FF14] hover:text-black transition-colors flex items-center gap-2 text-sm shrink-0 shadow-lg"
          >
            CONTACT OPERATOR ON WHATSAPP &rarr;
          </a>
        </div>
      </footer>
    </div>
  );
}
