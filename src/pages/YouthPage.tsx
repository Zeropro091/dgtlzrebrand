import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { submitLead } from '../lib/deckApi';

const PATH_STEPS = [
  {
    num: '01',
    title: 'MEMBER',
    desc: 'APPLY & MASUK TANPA HARUS PUNYA PENGALAMAN. KAMU LANGSUNG MASUK TIM YOUTH: IKUT LATIHAN, SESSION BARENG THE OPERATORS, DAN SIAPIN DIRI UNTUK LOMBA PERTAMA.',
  },
  {
    num: '02',
    title: 'PELOPOR',
    desc: 'DELEGASI DGTLZ DI KOMPETISI — HACKATHON, LOMBA BISNIS PLAN, KOMPETISI TEKNOLOGI. KAMU WAKILIN NAMA DGTLZ, KUMPULIN PENGALAMAN, JEJAK, DAN KONEKSI.',
  },
  {
    num: '03',
    title: 'OPERATOR',
    desc: 'TIER TERATAS: MASUK LINGKARAN INTI — BISA LANJUT JADI EMPLOYEE DI LAB/TIM PROYEK, ATAU KAMI BANTU BANGUN VENTURE SENDIRI PAKAI INFRASTRUKTUR DGTLZ.',
  },
];

const ROLES = ['DESIGN', 'FRONTEND DEV', 'BACKEND DEV', 'BISNIS PLAN', 'PUBLIC SPEAKING', 'CONTENT / COPY', 'AI / AUTOMATION'];

export function YouthPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [role, setRole] = useState(ROLES[0]);
  const [note, setNote] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!name || !email) return;
    setState('sending');
    try {
      await submitLead({
        name,
        contact: email,
        message: `[DGTLZ YOUTH APPLY] role: ${role} • portfolio: ${portfolio || '-'} • ${note}`,
      });
      setState('sent');
      setName(''); setEmail(''); setPortfolio(''); setNote('');
    } catch {
      setState('error');
    }
  }

  return (
    <div className="bg-off-white">
      {/* HERO */}
      <header className="grid grid-cols-1 md:grid-cols-12 border-b border-electric-blue">
        <div className="col-span-12 md:col-span-8 p-margin flex flex-col justify-end border-b md:border-b-0 md:border-r border-electric-blue min-h-[400px] md:min-h-[520px]">
          <span className="font-label-caps mb-4">DGTLZ YOUTH — THE NEXT GENERATION</span>
          <h1 className="font-display-xl leading-none uppercase">
            TIM ANAK MUDA<br />YANG WAKILIN<br />DGTLZ.
          </h1>
          <p className="font-mono text-xs md:text-sm tracking-widest mt-6 opacity-70 max-w-xl">
            FOKUS KAMI: LOMBA, PENGEMBANGAN KARIR & PENGALAMAN — DAN NGEMBANGKAN NAMA DGTLZ DI SETIAP PANGGUNG.
          </p>
        </div>
        <div className="col-span-12 md:col-span-4 bg-electric-blue text-off-white flex flex-col justify-between p-gutter min-h-[300px]">
          <span className="font-label-caps">STATUS: OPEN</span>
          <div>
            <p className="font-headline-lg leading-tight">BUKAN MAGANG. INI TIM LOMBA + INKUBATOR KARIR.</p>
            <p className="font-body-sm mt-4 opacity-80">KAMU DAPAT PANGGUNG, MENTOR, DAN TIM. DGTLZ DAPAT GENERASI BERIKUTNYA.</p>
          </div>
          <span className="font-label-caps opacity-60">EST. BALI // REMOTE-FIRST</span>
        </div>
      </header>

      {/* PATH */}
      <section className="grid grid-cols-1 md:grid-cols-12 border-b border-electric-blue">
        <div className="col-span-12 md:col-span-4 p-margin border-b md:border-b-0 md:border-r border-electric-blue flex flex-col justify-between min-h-[300px]">
          <span className="font-label-caps block">THE PATH</span>
          <h2 className="font-display-lg leading-none">3 TIER.<br />1 JALUR.</h2>
          <p className="font-body-sm opacity-70 max-w-xs">DARI MEMBER SAMPAI OPERATOR — SETIAP TIER PUNYA PANGGUNG, OUTPUT, DAN AKSES NYATA.</p>
        </div>
        {PATH_STEPS.map((s, i) => (
          <div key={s.num} className={`col-span-12 md:col-span-8 p-margin border-b md:border-b-0 ${i < 2 ? 'md:border-r' : ''} border-electric-blue md:grid md:grid-cols-3`}>
            <div className="md:col-span-1">
              <span className="font-label-caps block mb-4">TIER {s.num}</span>
              <h3 className="font-headline-lg leading-tight">{s.title}</h3>
            </div>
            <p className="md:col-span-2 font-body-sm leading-relaxed mt-6 md:mt-0">{s.desc}</p>
          </div>
        ))}
      </section>

      {/* FOCUS */}
      <section className="grid grid-cols-1 md:grid-cols-3 border-b border-electric-blue">
        {[
          ['LOMBA', 'HACKATHON, KOMPETISI BISNIS & TEKNOLOGI. KAMI SIAPIN TIM, STRATEGI, DAN SUPPORT PENUH DARI DGTLZ.'],
          ['KARIR & PENGALAMAN', 'MENTORING DARI THE OPERATORS, REAL PROJECT, SERTIFIKASI, DAN JEJAK YANG BIKIN CV KAMU BEDA DARI YANG LAIN.'],
          ['NAMA DGTLZ', 'SETIAP PANGGUNG YANG KAMU HABISI = NAMA DGTLZ MAKIN KERAS. KEMENANGAN YOUTH ADALAH KEMENANGAN ECOSYSTEM.'],
        ].map(([t, d], i) => (
          <div key={t} className={`p-margin border-b md:border-b-0 ${i < 2 ? 'md:border-r' : ''} border-electric-blue`}>
            <span className="font-label-caps block mb-4">{`0${i + 1} / ${t}`}</span>
            <p className="font-body-sm leading-relaxed">{d}</p>
          </div>
        ))}
      </section>

      {/* APPLY */}
      <section id="apply" className="grid grid-cols-1 md:grid-cols-12 border-b border-electric-blue">
        <div className="col-span-12 md:col-span-5 p-margin border-b md:border-b-0 md:border-r border-electric-blue flex flex-col justify-between min-h-[400px]">
          <div>
            <h2 className="font-display-lg leading-none uppercase">GABUNG<br />YOUTH</h2>
            <p className="font-body-sm mt-6 max-w-sm">ISI FORM. KAMI REVIEW SEMUA APLIKASI & BALAS VIA EMAIL. PENGALAMAN LOMBA / PORTFOLIO / AKUN SOSIAL KAMU SANGAT DISARANKAN.</p>
          </div>
          <Link to="/" className="font-label-caps text-electric-blue hover:opacity-60 transition-opacity">← BACK TO MAIN</Link>
        </div>
        <form onSubmit={submit} className="col-span-12 md:col-span-7 p-margin flex flex-col gap-6 bg-electric-blue/5">
          <div className="flex flex-col gap-2">
            <label className="font-label-caps">NAMA</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="border-b-2 border-electric-blue bg-transparent outline-none py-2 font-body-sm focus:border-opacity-50 transition-colors" placeholder="Nama kamu" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-caps">EMAIL</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="border-b-2 border-electric-blue bg-transparent outline-none py-2 font-body-sm focus:border-opacity-50 transition-colors" placeholder="Email kamu" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-label-caps">FOCUS ROLE</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="border-b-2 border-electric-blue bg-transparent outline-none py-2 font-body-sm">
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-caps">PORTFOLIO / SOSIAL</label>
              <input value={portfolio} onChange={(e) => setPortfolio(e.target.value)} className="border-b-2 border-electric-blue bg-transparent outline-none py-2 font-body-sm focus:border-opacity-50 transition-colors" placeholder="https://" />
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-grow">
            <label className="font-label-caps">PRESTASI / PENGALAMAN LOMBA (OPSIONAL)</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} className="border-b-2 border-electric-blue bg-transparent outline-none py-2 font-body-sm focus:border-opacity-50 transition-colors resize-none min-h-[120px]" placeholder="Lomba yang pernah ikut, posisi, atau apa yang mau kamu kontribusikan ke Youth" />
          </div>
          {state === 'sent' && (
            <p className="font-label-caps text-sm border-2 border-[#39FF14] px-4 py-3" style={{ color: '#0a8a0a' }}>
              ✓ Aplikasi terkirim — kami review & balas via email.
            </p>
          )}
          {state === 'error' && (
            <p className="font-label-caps text-sm border-2 border-red-600 text-red-600 px-4 py-3">
              ✕ Gagal mengirim — coba lagi.
            </p>
          )}
          <button type="submit" disabled={state === 'sending'} className="bg-electric-blue text-white px-8 py-4 font-label-caps hover:bg-transparent hover:text-electric-blue border-2 border-electric-blue transition-all mt-auto cursor-pointer disabled:opacity-50 self-start">
            {state === 'sending' ? 'MENGIRIM…' : 'SUBMIT APLIKASI'}
          </button>
        </form>
      </section>
    </div>
  );
}
