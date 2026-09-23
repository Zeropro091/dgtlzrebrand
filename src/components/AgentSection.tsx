// DGTLZ AGENT — deploy-ready business agents (Hermes Agent, OpenClaw, custom builds).
// Dark theme matches the DGT.LZ-AGENT arsenal module (bg-[#121212] text-[#39FF14]).
const AGENTS = [
  {
    engine: 'HERMES AGENT',
    badge: 'AUTONOMOUS OPERATOR',
    desc: 'Agent otonom full-stack: orchestrasi tools, jalanin workflow, kelola data, dan eksekusi keputusan operasional. Otak di balik Command Deck — sekarang bisa kerja untuk bisnis kamu.',
    uses: ['Kelola inbox & follow-up lead otomatis', 'Orchestrasikan seluruh ecosystem (web app, PayGate, chat)', 'Laporan harian & monitoring ke Telegram'],
    deploy: '1-2 MINGGU',
  },
  {
    engine: 'OPENCLAW',
    badge: 'CUSTOMER-FACING AGENT',
    desc: 'Open-source agent untuk garis depan: balas chat, qualifikasi calon klien, jawab FAQ, dan handoff ke manusia pas moment tepat. Terhubung WhatsApp, Instagram, dan web chat.',
    uses: ['Customer support 24/7 tanpa jeda', 'Qualifikasi lead sebelum masuk pipeline', 'Integrasi WhatsApp & sosial media'],
    deploy: '3-7 HARI',
  },
  {
    engine: 'CUSTOM BUILD',
    badge: 'TAILOR-MADE',
    desc: 'Agent yang dirancang khusus untuk alur kerja unik bisnis kamu: booking bot, sales agent, agent keuangan, internal ops — dibangun di atas engine yang paling pas.',
    uses: ['Booking & appointment otomatis via WhatsApp', 'Sales agent: dari chat pertama sampai invoice', 'Internal ops: data entry, rekap, reminder'],
    deploy: '2-4 MINGGU',
  },
];

export function AgentSection() {
  return (
    <section id="agent" className="border-b border-electric-blue bg-[#121212] text-white">
      <div className="p-margin border-b border-[#39FF14]/30 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-label-caps block text-[#39FF14] mb-2">DGTLZ AGENT // DEPLOY ON DEMAND</span>
          <h2 className="font-display-lg leading-none uppercase">
            BISNIS KAMU,<br />DIJALANKAN AGENT<span className="text-[#39FF14]">.</span>
          </h2>
        </div>
        <p className="font-body-sm opacity-80 max-w-sm">
          Kami deploy AI agent siap pakai ke dalam ecosystem bisnis kamu — dari layani pelanggan sampai jalanin operasional. Pilih engine-nya, kami yang pasang, latih, dan rawat.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3">
        {AGENTS.map((a, i) => (
          <div
            key={a.engine}
            className={`p-margin flex flex-col justify-between min-h-[380px] group hover:bg-[#39FF14]/5 transition-colors duration-300 ${
              i < 2 ? 'border-b md:border-b-0 md:border-r border-[#39FF14]/20' : ''
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-[10px] px-2 py-1 border border-[#39FF14]/40 text-[#39FF14] tracking-widest">
                  {a.badge}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
              </div>
              <h3 className="font-headline-md mb-3 group-hover:text-[#39FF14] transition-colors">{a.engine}</h3>
              <p className="font-body-sm opacity-80 leading-relaxed mb-5">{a.desc}</p>
              <ul className="space-y-2">
                {a.uses.map((u) => (
                  <li key={u} className="font-mono text-[11px] opacity-75 flex gap-2">
                    <span className="text-[#39FF14]">▸</span> {u}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-3 border-t border-[#39FF14]/20 flex items-center justify-between font-mono text-[11px]">
              <span className="opacity-75">DEPLOY: {a.deploy}</span>
              <a href="#contact" className="text-[#39FF14] tracking-widest hover:opacity-70 transition-opacity">
                PASANG &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#39FF14]/30 p-margin flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <span className="font-mono text-[11px] opacity-70 tracking-widest">
          COMPATIBLE: HERMES AGENT · OPENCLAW · CUSTOM FRAMEWORK · N8N WORKFLOWS
        </span>
        <a
          href="/agent"
          className="font-label-caps bg-[#39FF14] text-[#121212] px-6 py-3 text-center hover:bg-white transition-colors"
        >
          KONSULTASI AGENT GRATIS →
        </a>
      </div>
    </section>
  );
}
