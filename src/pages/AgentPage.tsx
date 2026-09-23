// DGTLZ AGENT — sub-halaman deploy AI agent (Hermes Agent, OpenClaw, custom).
// Dark neon style senada AgentSection & modul arsenal DGT.LZ-AGENT.
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Check, ArrowRight, MessageSquare, Calendar, Wallet, Cog, Activity } from 'lucide-react';

const WA_LINK =
  'https://wa.me/6281237729115?text=Halo%20DGTLZ!%20Saya%20mau%20konsultasi%20deploy%20AI%20Agent%20untuk%20bisnis%20saya.';

const ENGINES = [
  {
    engine: 'HERMES AGENT',
    badge: 'AUTONOMOUS OPERATOR',
    icon: Cog,
    tagline: 'Otak operasional yang bekerja di belakang layar.',
    desc: 'Agent otonom full-stack: orchestrasikan tools, jalanin workflow multi-langkah, kelola data, dan eksekusi keputusan operasional. Sama seperti otak di balik DGTLZ Command Deck — sekarang ditempatkan di bisnis kamu.',
    includes: [
      'Orchestration tools & workflow multi-langkah',
      'Integrasi web app, PayGate, database & API eksternal',
      'Notifikasi & laporan harian ke Telegram',
      'Memory jangka panjang + audit log keputusan',
    ],
    bestFor: 'Bisnis dengan operasional berulang: follow-up lead, rekap transaksi, koordinasi tim, monitoring sistem.',
    deploy: '1–2 MINGGU',
  },
  {
    engine: 'OPENCLAW',
    badge: 'CUSTOMER-FACING AGENT',
    icon: MessageSquare,
    tagline: 'Garis depan yang tidak pernah tidur.',
    desc: 'Open-source customer-facing agent: balas chat, qualifikasi calon klien, jawab FAQ, dan handoff ke manusia di moment yang tepat. Terhubung WhatsApp, Instagram, dan web chat dalam satu deployment.',
    includes: [
      'Customer support 24/7 tanpa jeda',
      'Qualifikasi lead sebelum masuk pipeline',
      'Integrasi WhatsApp Business, Instagram DM, web chat',
      'Handoff pintar ke admin manusia + transcript lengkap',
    ],
    bestFor: 'Bisnis yang ramai chat: booking, retail, jasa, komunitas — yang tidak mau kehilangan calon klien di luar jam kerja.',
    deploy: '3–7 HARI',
  },
  {
    engine: 'CUSTOM BUILD',
    badge: 'TAILOR-MADE',
    icon: Bot,
    tagline: 'Agent yang dirancang untuk alur kerja kamu — bukan sebaliknya.',
    desc: 'Booking bot, sales agent, agent keuangan, internal ops — kami pilih engine yang paling pas (Hermes, OpenClaw, atau framework lain) lalu bangun personality, tools, dan guardrail-nya dari nol.',
    includes: [
      'Discovery workshop + agent blueprint',
      'Custom tools & integrasi khusus bisnis kamu',
      'Guardrail, approval gate & escalation path',
      'Evaluasi berkala + retraining',
    ],
    bestFor: 'Alur kerja unik yang tidak bisa diselesaikan template: multi-departemen, regulasi ketat, proses proprietary.',
    deploy: '2–4 MINGGU',
  },
];

const STEPS = [
  { n: '01', title: 'AUDIT GRATIS', desc: 'Bedah alur kerja kamu 45 menit. Kami petakan mana yang bisa dijalankan agent, mana yang tetap manusia, dan estimasi hemat waktunya.' },
  { n: '02', title: 'BLUEPRINT AGENT', desc: 'Rancangan teknis: engine, tools, integrasi, guardrail, dan skenario percakapan/keputusan. Kamu approve, baru kami bangun.' },
  { n: '03', title: 'DEPLOY & LATIH', desc: 'Agent dipasang ke ecosystem kamu (web app, WhatsApp, PayGate, Telegram), dilatih dengan data & tone bisnis kamu, diuji paralel dengan proses lama.' },
  { n: '04', title: 'RAWAT & UPGRADE', desc: 'Monitoring, evaluasi kualitas jawaban/keputusan, retraining, dan upgrade capability tiap bulan. Agent kamu makin tajam seiring waktu.' },
];

const PLANS = [
  {
    name: 'AGENT STARTER',
    engine: 'OpenClaw — customer-facing',
    price: 'Rp 3,5 jt',
    unit: 'sekali deploy',
    maint: '+ Rp 750 rb/bln maintenance',
    points: ['1 channel (WhatsApp atau web chat)', 'FAQ & knowledge base training', 'Handoff ke admin manusia', 'Monitoring via Telegram'],
    cta: 'MULAI STARTER',
  },
  {
    name: 'AGENT OPERATOR',
    engine: 'Hermes Agent — autonomous',
    price: 'Rp 10 jt',
    unit: 'sekali deploy',
    maint: '+ Rp 2 jt/bln maintenance',
    featured: true,
    points: ['Semua di Starter', 'Workflow otomasi multi-langkah', 'Integrasi web app + PayGate + API', 'Laporan harian otomatis + audit log'],
    cta: 'MULAI OPERATOR',
  },
  {
    name: 'ECOSYSTEM FLEET',
    engine: 'Multi-agent + custom build',
    price: 'CUSTOM',
    unit: 'setelah audit',
    maint: 'SLA & retainer didiskusikan',
    points: ['Beberapa agent saling terhubung', 'Custom tools & integrasi proprietary', 'Approval gate & escalation path', 'Dedicated support + SLA'],
    cta: 'JADWALKAN AUDIT',
  },
];

const USE_CASES = [
  { icon: Calendar, t: 'Booking & Appointment', d: 'Chat → tawarkan slot → kirim QRIS DP → slot terkunci otomatis.' },
  { icon: MessageSquare, t: 'Support 24/7', d: 'Jawab pertanyaan berulang kapan pun, eskalasi ke manusia saat perlu.' },
  { icon: Wallet, t: 'Follow-up & Sales', d: 'Qualifikasi lead, kirim penawaran, ingatkan invoice — tanpa lupa.' },
  { icon: Cog, t: 'Internal Ops', d: 'Data entry, rekap harian, reminder tim, koordinasi lintas channel.' },
  { icon: Activity, t: 'Monitoring', d: 'Pantau transaksi & sistem, alarm Telegram kalau ada anomali.' },
  { icon: Bot, t: 'Fleet Multi-Agent', d: 'Sales agent menyerahkan ke ops agent — ecosystem yang saling terhubung.' },
];

const FAQ = [
  { q: 'AGENT BISA PAKAI MODEL AI KAMI SENDIRI?', a: 'Bisa. Lewat DGTLZ Route, agent bisa diarahkan ke provider mana pun — termasuk API private/self-hosted — dengan routing & fallback otomatis.' },
  { q: 'KALAU AGENT SALAH JAWAB ATAU SALAH KEPUTUSAN?', a: 'Setiap agent punya guardrail: batas wewenang, approval gate untuk aksi kritis, escalation ke manusia, dan audit log. Agent tidak pernah jalan tanpa pagar.' },
  { q: 'DATA BISNIS KAMI AMAN?', a: 'Agent jalan di infrastruktur yang kami kelola dengan credential terpisah per klien. Untuk kebutuhan ketat, kami bisa deploy di server kamu sendiri (self-hosted).' },
  { q: 'BERAPA LAMA SAMPAI AGENT BENERAN PAKAI?', a: 'OpenClaw 3–7 hari, Hermes Agent 1–2 minggu, custom 2–4 minggu. Selalu ada masa uji paralel dengan proses lama sebelum full handover.' },
];

export default function AgentPage() {
  useEffect(() => {
    document.title = 'DGTLZ AGENT — Deploy AI Agent untuk Bisnis Kamu';
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute('content', 'Deploy Hermes Agent, OpenClaw, atau custom AI agent: layani pelanggan, follow-up lead, terima booking, jalanin operasional 24/7. Audit gratis.');
  }, []);

  return (
    <div className="bg-[#121212] text-white">
      {/* ===== HERO ===== */}
      <header className="border-b border-[#39FF14]/30">
        <div className="p-margin pt-16 pb-12">
          <span className="font-label-caps block text-[#39FF14] mb-4">DGTLZ AGENT // DEPLOY ON DEMAND</span>
          <h1 className="font-display-xl leading-none uppercase">
            AGENT KERJA<span className="text-[#39FF14]">.</span><br />BISNIS JALAN<span className="text-[#39FF14]">.</span>
          </h1>
          <p className="font-body-sm opacity-80 max-w-2xl mt-6 leading-relaxed">
            Kami deploy AI agent siap pakai ke dalam bisnis kamu — layani pelanggan, follow-up lead, terima booking & pembayaran, jalankan operasional 24/7. Pilih engine-nya, kami yang pasang, latih, dan rawat.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className="font-label-caps bg-[#39FF14] text-[#121212] px-6 py-3 hover:bg-white transition-colors">
              AUDIT GRATIS 45 MENIT →
            </a>
            <a href="#agent-engines"
              className="font-label-caps border border-[#39FF14]/60 text-[#39FF14] px-6 py-3 hover:bg-[#39FF14] hover:text-[#121212] transition-colors">
              LIHAT ENGINES
            </a>
          </div>
          <div className="font-mono text-[10px] opacity-60 tracking-widest mt-8">
            COMPATIBLE: HERMES AGENT · OPENCLAW · CUSTOM FRAMEWORK · N8N WORKFLOWS · DGTLZ ROUTE
          </div>
        </div>
      </header>

      {/* ===== ENGINES ===== */}
      <section id="agent-engines" className="border-b border-[#39FF14]/30">
        <div className="p-margin pt-12 pb-6">
          <span className="font-label-caps block text-[#39FF14] mb-2">PILIH ENGINE</span>
          <h2 className="font-display-lg leading-none uppercase">3 CARA DEPLOY<span className="text-[#39FF14]">.</span></h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {ENGINES.map((e, i) => (
            <div key={e.engine}
              className={`p-margin pb-12 flex flex-col min-h-[520px] hover:bg-[#39FF14]/5 transition-colors ${i < 2 ? 'border-b lg:border-b-0 lg:border-r border-[#39FF14]/20' : ''}`}>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-[10px] px-2 py-1 border border-[#39FF14]/40 text-[#39FF14] tracking-widest">{e.badge}</span>
                <e.icon className="w-5 h-5 text-[#39FF14]" />
              </div>
              <h3 className="font-headline-md mb-1 group-hover:text-[#39FF14]">{e.engine}</h3>
              <p className="font-serif italic text-sm opacity-70 mb-4">{e.tagline}</p>
              <p className="font-body-sm opacity-80 leading-relaxed mb-5">{e.desc}</p>
              <div className="font-label-caps text-[10px] text-[#39FF14] mb-2">TERMASUK:</div>
              <ul className="space-y-2 mb-5">
                {e.includes.map((inc) => (
                  <li key={inc} className="font-mono text-[11px] opacity-80 flex gap-2">
                    <Check className="w-3.5 h-3.5 text-[#39FF14] shrink-0 mt-0.5" /> {inc}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <div className="font-label-caps text-[10px] opacity-60 mb-1">PALING COCOK UNTUK:</div>
                <p className="font-mono text-[11px] opacity-75 mb-5">{e.bestFor}</p>
                <div className="pt-3 border-t border-[#39FF14]/20 flex items-center justify-between font-mono text-[11px]">
                  <span className="opacity-75">DEPLOY: {e.deploy}</span>
                  <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="text-[#39FF14] tracking-widest hover:opacity-70 transition-opacity">
                    PASANG <ArrowRight className="w-3 h-3 inline" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== USE CASES ===== */}
      <section className="border-b border-[#39FF14]/30">
        <div className="p-margin pt-12 pb-6">
          <span className="font-label-caps block text-[#39FF14] mb-2">USE CASES</span>
          <h2 className="font-display-lg leading-none uppercase">APA YANG DIJALANKAN<span className="text-[#39FF14]">?</span></h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-[#39FF14]/20">
          {USE_CASES.map((u) => (
            <div key={u.t} className="p-margin border-b sm:border-r border-[#39FF14]/20 hover:bg-[#39FF14]/5 transition-colors">
              <u.icon className="w-5 h-5 text-[#39FF14] mb-3" />
              <h3 className="font-headline-sm mb-2">{u.t}</h3>
              <p className="font-mono text-[11px] opacity-75 leading-relaxed">{u.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ONBOARDING ===== */}
      <section className="border-b border-[#39FF14]/30">
        <div className="p-margin pt-12 pb-6">
          <span className="font-label-caps block text-[#39FF14] mb-2">PROSES</span>
          <h2 className="font-display-lg leading-none uppercase">DARI AUDIT SAMPAI AGENT JALAN<span className="text-[#39FF14]">.</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 border-t border-[#39FF14]/20">
          {STEPS.map((s, i) => (
            <div key={s.n} className={`p-margin border-b md:border-b-0 border-[#39FF14]/20 ${i < 3 ? 'md:border-r' : ''}`}>
              <div className="font-display-lg text-[#39FF14]/30 mb-3">{s.n}</div>
              <h3 className="font-headline-sm mb-2">{s.title}</h3>
              <p className="font-body-sm opacity-75 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="border-b border-[#39FF14]/30">
        <div className="p-margin pt-12 pb-6">
          <span className="font-label-caps block text-[#39FF14] mb-2">INVESTASI</span>
          <h2 className="font-display-lg leading-none uppercase">MULAI SEBESAR KEBUTUHAN KAMU<span className="text-[#39FF14]">.</span></h2>
          <p className="font-mono text-[11px] opacity-60 mt-3">Harga final ditentukan setelah audit gratis — tergantung kompleksitas integrasi & volume percakapan.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <div key={p.name}
              className={`p-margin pb-10 flex flex-col ${p.featured ? 'bg-[#39FF14]/10 border-y border-[#39FF14]/40' : ''} ${i < 2 ? 'lg:border-r border-[#39FF14]/20' : ''}`}>
              {p.featured && <span className="font-mono text-[10px] text-[#39FF14] tracking-widest mb-3">★ PALING SERING DIAMBIL</span>}
              <div className="font-label-caps text-[10px] opacity-60 mb-1">{p.engine}</div>
              <h3 className="font-headline-md mb-4">{p.name}</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-display-lg leading-none">{p.price}</span>
                <span className="font-mono text-[11px] opacity-60">{p.unit}</span>
              </div>
              <div className="font-mono text-[11px] text-[#39FF14] mb-6">{p.maint}</div>
              <ul className="space-y-2 mb-8">
                {p.points.map((pt) => (
                  <li key={pt} className="font-mono text-[11px] opacity-80 flex gap-2">
                    <Check className="w-3.5 h-3.5 text-[#39FF14] shrink-0 mt-0.5" /> {pt}
                  </li>
                ))}
              </ul>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                className={`mt-auto font-label-caps text-center px-6 py-3 transition-colors ${p.featured ? 'bg-[#39FF14] text-[#121212] hover:bg-white' : 'border border-[#39FF14]/60 text-[#39FF14] hover:bg-[#39FF14] hover:text-[#121212]'}`}>
                {p.cta} →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="border-b border-[#39FF14]/30">
        <div className="p-margin pt-12 pb-10">
          <span className="font-label-caps block text-[#39FF14] mb-2">FAQ</span>
          <h2 className="font-display-lg leading-none uppercase mb-8">YANG SERING DITANYAKAN<span className="text-[#39FF14]">.</span></h2>
          <div className="space-y-0 border-t border-[#39FF14]/20">
            {FAQ.map((f) => (
              <details key={f.q} className="border-b border-[#39FF14]/20 group">
                <summary className="font-headline-sm py-4 cursor-pointer list-none flex justify-between items-center gap-4 hover:text-[#39FF14] transition-colors">
                  {f.q}
                  <span className="font-mono text-[#39FF14] group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="font-body-sm opacity-80 leading-relaxed pb-5 max-w-3xl">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="font-mono text-[11px] opacity-60 mt-6">FAQ lengkap lainnya ada di <Link to="/#faq" className="text-[#39FF14] hover:opacity-70">main page →</Link></p>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="p-margin py-16 text-center">
        <h2 className="font-display-lg leading-none uppercase mb-4">SIAP PUNYA AGENT<span className="text-[#39FF14]">?</span></h2>
        <p className="font-body-sm opacity-80 max-w-xl mx-auto mb-8">
          Mulai dari audit gratis 45 menit. Kalau agent tidak cocok untuk bisnis kamu, kami bilang apa adanya — bukan maksa jual.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
            className="font-label-caps bg-[#39FF14] text-[#121212] px-8 py-4 hover:bg-white transition-colors">
            CHAT WHATSAPP SEKARANG →
          </a>
          <Link to="/#contact"
            className="font-label-caps border border-white/40 px-8 py-4 hover:bg-white hover:text-[#121212] transition-colors">
            LEWAT FORM KONTAK
          </Link>
        </div>
      </section>
    </div>
  );
}
