// DGTLZ Route — Pay-as-you-go quick start: model catalog + per-token pricing + API keys.
// Section component, dipasang di DgtlzRoute.tsx sebelum catalog paket langganan.
import { useState } from 'react';
import { Zap, KeyRound, Calculator, MessagesSquare, BarChart3, LayoutGrid, Check, ArrowRight, Copy, Check as CheckIcon } from 'lucide-react';

const WA_LINK =
  'https://wa.me/6281237729115?text=Halo%20DGTLZ!%20Saya%20mau%20akses%20DGTLZ%20Route%20Pay-as-you-go.';

type ModelRow = {
  id: string; provider: string; ctx: string;
  input: string; cached: string; output: string;
  tag?: string; note?: string;
};

// Harga per 1M token (USD). Sumber: katalog Route quick start.
const MODELS: ModelRow[] = [
  { id: 'claude-haiku-4-5', provider: 'anthropic', ctx: '200K', input: '$1.00', cached: '$0.10', output: '$5.00' },
  { id: 'claude-opus-4-8', provider: 'anthropic', ctx: '1M', input: '$5.00', cached: '$0.50', output: '$25.00' },
  { id: 'claude-opus-5', provider: 'anthropic', ctx: '1M', input: '$5.00', cached: '$0.50', output: '$25.00' },
  { id: 'claude-sonnet-5', provider: 'anthropic', ctx: '1M', input: '$2.00', cached: '$0.20', output: '$10.00' },
  { id: 'deepseek-flash', provider: 'deepseek', ctx: '1M', input: '$0.15–0.30', cached: '$0.003–0.006', output: '$0.60–1.20', note: 'off-peak–peak' },
  { id: 'deepseek-v4-pro', provider: 'deepseek', ctx: '1M', input: '$0.66–1.32', cached: '$0.022–0.044', output: '$1.98–3.96', note: 'off-peak–peak' },
  { id: 'deepseek-v4-flash:netra', provider: 'netra-runtime', ctx: '1M', input: '$0.20', cached: '$0.010', output: '$0.50', tag: '80% OFF' },
  { id: 'deepseek-v4.1-flash:netra', provider: 'netra-runtime', ctx: '1M', input: '$0.30', cached: '$0.010', output: '$1.00', tag: '80% OFF' },
  { id: 'gemini-3-flash-preview', provider: 'gemini', ctx: '1M', input: '$0.50', cached: '$0.05', output: '$3.00' },
  { id: 'gemini-3.1-flash-lite', provider: 'gemini', ctx: '1M', input: '$0.25', cached: '$0.025', output: '$1.50' },
  { id: 'gemini-3.1-pro-preview', provider: 'gemini', ctx: '1M', input: '$2.00', cached: '$0.20', output: '$12.00' },
  { id: 'gemini-3.5-flash', provider: 'gemini', ctx: '1M', input: '$1.50', cached: '$0.15', output: '$9.00' },
  { id: 'gemini-3.5-flash-lite', provider: 'gemini', ctx: '1M', input: '$0.30', cached: '$0.03', output: '$2.50' },
  { id: 'gemini-3.7/3.8-flash', provider: 'gemini', ctx: '1M', input: '$0.75', cached: '$0.075', output: '$3.75' },
  { id: 'gemini-embedding-001', provider: 'gemini', ctx: '2K', input: '$0.15', cached: '—', output: 'GRATIS' },
  { id: 'glm-5', provider: 'z.ai', ctx: '128K', input: '$0.60', cached: '$0.12', output: '$2.00' },
  { id: 'glm-5-turbo', provider: 'sumopod', ctx: '128K', input: '$1.20', cached: '$0.26', output: '$4.00' },
  { id: 'glm-5.1', provider: 'z.ai', ctx: '1M', input: '$1.40', cached: '$0.26', output: '$4.40' },
  { id: 'glm-5.2', provider: 'z.ai', ctx: '1M', input: '$1.05', cached: '$0.195', output: '$3.30', tag: '25% OFF' },
  { id: 'glm-5.3-flash', provider: 'z.ai', ctx: '1M', input: '$0.015', cached: '$0.015', output: '$0.25', tag: '50% OFF' },
  { id: 'glm-5v-turbo', provider: 'z.ai', ctx: '128K', input: '$1.20', cached: '$0.26', output: '$4.00' },
  { id: 'gpt-4.1', provider: 'openai', ctx: '1M', input: '$2.00', cached: '$0.50', output: '$8.00' },
  { id: 'gpt-4.1-mini', provider: 'openai', ctx: '1M', input: '$0.40', cached: '$0.10', output: '$1.60' },
  { id: 'gpt-4.1-nano', provider: 'openai', ctx: '1M', input: '$0.10', cached: '$0.025', output: '$0.40' },
  { id: 'gpt-4o', provider: 'openai', ctx: '128K', input: '$2.50', cached: '$1.25', output: '$10.00' },
  { id: 'gpt-4o-mini', provider: 'openai', ctx: '128K', input: '$0.15', cached: '$0.075', output: '$0.60' },
  { id: 'gpt-5', provider: 'openai', ctx: '272K', input: '$1.25', cached: '$0.125', output: '$10.00' },
  { id: 'gpt-5-mini', provider: 'openai', ctx: '272K', input: '$0.25', cached: '$0.025', output: '$2.00' },
  { id: 'gpt-5-nano', provider: 'openai', ctx: '272K', input: '$0.05', cached: '$0.005', output: '$0.40' },
  { id: 'gpt-5.4', provider: 'openai', ctx: '1M', input: '$2.50', cached: '$0.25', output: '$15.00' },
  { id: 'gpt-5.4-mini', provider: 'openai', ctx: '272K', input: '$0.75', cached: '$0.075', output: '$4.50' },
  { id: 'gpt-5.4-nano', provider: 'openai', ctx: '272K', input: '$0.20', cached: '$0.020', output: '$1.25' },
  { id: 'gpt-5.6-luna', provider: 'openai', ctx: '922K', input: '$0.20', cached: '$0.020', output: '$1.20' },
  { id: 'gpt-5.6-sol', provider: 'openai', ctx: '922K', input: '$4.00', cached: '$0.40', output: '$20.00' },
  { id: 'gpt-5.6-terra', provider: 'openai', ctx: '922K', input: '$2.00', cached: '$0.20', output: '$12.00' },
  { id: 'hy3', provider: 'tencent', ctx: '256K', input: '$0.132', cached: '$0.033', output: '$0.53' },
  { id: 'kimi-k2.6', provider: 'moonshoot', ctx: '262K', input: '$0.67', cached: '$0.14', output: '$3.39' },
  { id: 'kimi-k2.7', provider: 'moonshoot', ctx: '262K', input: '$0.95', cached: '$0.19', output: '$4.00' },
  { id: 'kimi-k3', provider: 'moonshoot', ctx: '1M', input: '$1.50', cached: '$0.15', output: '$7.50', tag: '50% OFF' },
  { id: 'mimo-v2.5', provider: 'mimo', ctx: '1M', input: '$0.14', cached: '$0.003', output: '$0.28' },
  { id: 'mimo-v2.5-pro', provider: 'mimo', ctx: '1M', input: '$0.435', cached: '$0.004', output: '$0.87', tag: '75% OFF' },
  { id: 'MiniMax-M2.7-highspeed', provider: 'sumopod', ctx: '204K', input: '$0.03', cached: '$0.03', output: '$0.12', tag: '90% OFF' },
  { id: 'MiniMax-M3', provider: 'minimax', ctx: '1M', input: '$0.30', cached: '$0.06', output: '$1.20' },
  { id: 'qwen3.6-flash', provider: 'alibaba', ctx: '1M', input: '$0.25', cached: '$0.025', output: '$1.50' },
  { id: 'qwen3.6-plus', provider: 'alibaba', ctx: '1M', input: '$0.50', cached: '$0.05', output: '$3.00' },
  { id: 'qwen3.7-flash-2026-07-15', provider: 'alibaba', ctx: '1M', input: '$0.03–0.20', cached: '$0.006–0.04', output: '$0.13–0.80', note: 'tiered by context' },
  { id: 'qwen3.7-max', provider: 'dashscope', ctx: '991K', input: '$1.25', cached: '$0.125', output: '$3.75', tag: '15% OFF' },
  { id: 'qwen3.7-plus', provider: 'alibaba', ctx: '1M', input: '$0.32', cached: '$0.032', output: '$1.28' },
  { id: 'qwen3.8-flash', provider: 'alibaba', ctx: '1M', input: '$0.15', cached: '$0.016', output: '$0.47' },
  { id: 'qwen3.8-max', provider: 'dashscope', ctx: '991K', input: '$1.00', cached: '$0.125', output: '$3.00', tag: '50% OFF' },
  { id: 'seed-2-0-code', provider: 'byteplus', ctx: '256K', input: '$0.50', cached: '$0.10', output: '$3.00' },
  { id: 'seed-2-0-lite', provider: 'byteplus', ctx: '224K', input: '$0.25', cached: '$0.05', output: '$2.00' },
  { id: 'seed-2-0-mini', provider: 'byteplus', ctx: '224K', input: '$0.10', cached: '$0.02', output: '$0.40' },
  { id: 'seed-2-0-pro', provider: 'byteplus', ctx: '256K', input: '$0.50', cached: '$0.10', output: '$3.00' },
  { id: 'text-embedding-3-large', provider: 'openai', ctx: '8K', input: '$0.13', cached: '—', output: 'GRATIS' },
  { id: 'text-embedding-3-small', provider: 'openai', ctx: '8K', input: '$0.02', cached: '—', output: 'GRATIS' },
];

const QUICK_TABS = [
  { id: 'chat', label: 'CHAT', icon: MessagesSquare },
  { id: 'usage', label: 'USAGE', icon: BarChart3 },
  { id: 'models', label: 'MODELS', icon: LayoutGrid },
  { id: 'keys', label: 'API KEYS', icon: KeyRound },
] as const;

const PROVIDER_FILTERS = ['SEMUA', 'openai', 'anthropic', 'gemini', 'deepseek', 'z.ai', 'alibaba', 'moonshoot', 'byteplus', 'mimo', 'minimax', 'netra-runtime', 'dashscope', 'tencent', 'sumopod'] as const;

export function RoutePayg() {
  const [q, setQ] = useState('');
  const [prov, setProv] = useState<string>('SEMUA');
  const [tab, setTab] = useState<(typeof QUICK_TABS)[number]['id']>('chat');
  const [copied, setCopied] = useState('');

  const filtered = MODELS.filter((m) =>
    (prov === 'SEMUA' || m.provider === prov) &&
    (q === '' || m.id.toLowerCase().includes(q.toLowerCase()))
  );

  const copy = (t: string) => { setCopied(t); setTimeout(() => setCopied(''), 1500); };

  return (
    <section id="payg-section" className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12 font-mono">

        {/* header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6 border-b border-electric-blue pb-6">
          <div>
            <div className="flex items-center gap-2 text-electric-blue font-mono text-xs uppercase tracking-widest font-bold">
              <Zap className="w-4 h-4" />
              // PAY-AS-YOU-GO // QUICK START
            </div>
            <h2 className="font-serif font-display-md uppercase tracking-tight text-neutral-900 mt-1">
              ISI SALDO, PAKAI MODEL APAPUN
            </h2>
            <p className="font-mono text-xs text-neutral-600 mt-2 max-w-2xl">
              Tanpa langganan. Tanpa minimum. Bayar per token — harga transparan per 1M token di bawah. Saldo tidak hangus, aktif kapan pun kamu butuh.
            </p>
          </div>
          <div className="font-mono text-xs text-neutral-600 lg:text-right shrink-0">
            <div className="text-2xl font-bold text-electric-blue">60+</div>
            <div>MODEL SIAP PAKAI</div>
            <div className="mt-1">Anthropic · Gemini · DeepSeek · GLM · Qwen · Kimi · MiniMax · Seed · GPT</div>
          </div>
        </div>

        {/* quick start tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {QUICK_TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 border text-xs uppercase tracking-widest transition-colors ${tab === t.id ? 'bg-electric-blue text-white border-electric-blue' : 'border-neutral-300 text-neutral-600 hover:border-electric-blue hover:text-electric-blue'}`}>
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          ))}
        </div>

        {/* CHAT tab */}
        {tab === 'chat' && (
          <div className="border border-neutral-300 p-6 md:p-8 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-serif font-display-sm uppercase mb-3">Chat Dulu, Baru Bayar Token</h3>
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  Setiap akun Route langsung punya chat playground: test model mana pun dari katalog — bandingkan jawaban, kecepatan, dan biaya real-time sebelum dipakai di produksi.
                </p>
                <ul className="space-y-2">
                  {['Semua model katalog bisa dicoba', 'Biaya real-time per pesan (per token)', 'Riwayat chat tersimpan per akun', 'Langsung loncat ke API kalau sudah cocok'].map((x) => (
                    <li key={x} className="flex gap-2 text-xs text-neutral-700"><Check className="w-3.5 h-3.5 text-electric-blue shrink-0 mt-0.5" />{x}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-neutral-900 text-neutral-200 p-5 text-[11px] leading-relaxed">
                <div className="text-electric-blue mb-2">// 1 juta token itu kira-kira:</div>
                <div>≈ 750 halaman dokumen dibaca &amp; diringkas</div>
                <div>≈ 60–80 percakapan support panjang</div>
                <div>≈ 3.500 baris kode di-review</div>
                <div className="mt-3 pt-3 border-t border-neutral-700">
                  Dari <span className="text-electric-blue font-bold">$0.02</span> (gpt-5-nano) sampai <span className="text-electric-blue font-bold">$25.00</span> (anthropic 1M) per 1M output — kamu pilih titik harga/kualitasnya.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USAGE tab */}
        {tab === 'usage' && (
          <div className="border border-neutral-300 p-6 md:p-8 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Calculator className="w-5 h-5 text-electric-blue mb-3" />
                <h3 className="font-serif font-display-sm uppercase mb-2">Rumus Billing</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  <span className="text-electric-blue font-bold">token ÷ 1.000.000 × harga</span>. Input, output, dan cache dihitung terpisah sesuai tarif model. DeepSeek punya rate off-peak lebih murah.
                </p>
              </div>
              <div>
                <BarChart3 className="w-5 h-5 text-electric-blue mb-3" />
                <h3 className="font-serif font-display-sm uppercase mb-2">Transparan Real-time</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Dashboard usage menampilkan pemakaian per model, per hari, per API key. Sisa saldo &amp; estimasi biaya terlihat sebelum request berikutnya.
                </p>
              </div>
              <div>
                <Zap className="w-5 h-5 text-electric-blue mb-3" />
                <h3 className="font-serif font-display-sm uppercase mb-2">Top-up Fleksibel</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Isi saldo via DGTLZ PayGate (QRIS) atau transfer. Saldo tidak hangus — pakai pelan-pelan atau habiskan sekaligus.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* KEYS tab */}
        {tab === 'keys' && (
          <div className="border border-neutral-300 p-6 md:p-8 mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="font-serif font-display-sm uppercase mb-3">Satu API Key, Semua Provider</h3>
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  Bikin key di dashboard, pakai endpoint OpenAI-compatible. Ganti model = ganti satu string. Tidak ada SDK tambahan.
                </p>
                <div className="bg-neutral-900 text-neutral-200 p-4 text-[11px] leading-relaxed relative">
                  <button onClick={() => copy('env')}
                    className="absolute top-2 right-2 text-neutral-400 hover:text-white" aria-label="copy">
                    {copied === 'env' ? <CheckIcon className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <div className="text-neutral-500"># .env</div>
                  <div><span className="text-electric-blue">OPENAI_BASE_URL</span>=https://route.dgtlz.com/v1</div>
                  <div><span className="text-electric-blue">OPENAI_API_KEY</span>=dgtlz-sk-xxxx</div>
                  <div className="mt-2 text-neutral-500"># model = string apa pun dari katalog</div>
                  <div>model: <span className="text-electric-blue">"gemini-3.1-flash-lite"</span></div>
                </div>
              </div>
              <div>
                <h3 className="font-serif font-display-sm uppercase mb-3">Siap dalam 4 Menit</h3>
                <ol className="space-y-3">
                  {[
                    'Daftar akun Route & verify email',
                    'Top-up saldo via QRIS (PayGate) — langsung masuk',
                    'Buat API key di dashboard',
                    'Set BASE_URL + key → panggil model mana pun',
                  ].map((s, i) => (
                    <li key={s} className="flex gap-3 text-xs text-neutral-700">
                      <span className="w-5 h-5 border border-electric-blue text-electric-blue flex items-center justify-center text-[10px] shrink-0">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* MODELS tab */}
        {tab === 'models' && (
          <div className="mb-10">
            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <input
                value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="cari model… (mis. claude, gpt-5, flash)"
                className="flex-1 border border-neutral-300 px-4 py-2 text-xs outline-none focus:border-electric-blue"
              />
              <select value={prov} onChange={(e) => setProv(e.target.value)}
                className="border border-neutral-300 px-3 py-2 text-xs uppercase tracking-widest outline-none focus:border-electric-blue bg-white">
                {PROVIDER_FILTERS.map((p) => <option key={p} value={p}>{p === 'SEMUA' ? 'SEMUA PROVIDER' : p}</option>)}
              </select>
            </div>
            <div className="border border-neutral-300 overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="bg-neutral-900 text-neutral-300 text-left">
                    <th className="px-3 py-2 font-normal">MODEL</th>
                    <th className="px-3 py-2 font-normal">PROVIDER</th>
                    <th className="px-3 py-2 font-normal">CTX</th>
                    <th className="px-3 py-2 font-normal">INPUT /1M</th>
                    <th className="px-3 py-2 font-normal">CACHED /1M</th>
                    <th className="px-3 py-2 font-normal">OUTPUT /1M</th>
                    <th className="px-3 py-2 font-normal"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m, i) => (
                    <tr key={m.id} className={i % 2 ? 'bg-neutral-50' : 'bg-white'}>
                      <td className="px-3 py-2 text-neutral-900">
                        {m.id}
                        {m.tag && <span className="ml-2 px-1.5 py-0.5 bg-electric-blue text-white text-[9px]">{m.tag}</span>}
                      </td>
                      <td className="px-3 py-2 text-neutral-600">{m.provider}</td>
                      <td className="px-3 py-2 text-neutral-600">{m.ctx}</td>
                      <td className="px-3 py-2">{m.input}</td>
                      <td className="px-3 py-2 text-neutral-600">{m.cached}</td>
                      <td className="px-3 py-2">{m.output}</td>
                      <td className="px-3 py-2 text-neutral-400">{m.note || ''}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="px-3 py-6 text-center text-neutral-400">tidak ada model yang cocok</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CTA band */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-electric-blue p-5">
          <div className="text-xs text-neutral-700">
            <span className="font-bold text-neutral-900">MAU COBA DULU?</span> Chat playground tersedia saat daftar — bayar cuma token yang kepakai.
          </div>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-electric-blue text-white px-5 py-2.5 text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
            AKTIFKAN PAY-AS-YOU-GO <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
