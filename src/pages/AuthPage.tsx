import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, setToken, type PublicUser } from '../lib/deckApi';

// Shared auth surface: /register creates the first-ever owner account (after that,
// registration requires an invite code) and /login is for everyone.
export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [invite, setInvite] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const res = mode === 'login'
        ? await auth.login({ email, password })
        : await auth.register({ email, password, name, invite: invite || undefined });
      setToken(res.token);
      nav('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'GAGAL');
    } finally { setBusy(false); }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F4F3EF] px-4">
      <div className="w-full max-w-md border-2 border-neutral-900 bg-white">
        <div className="bg-electric-blue text-white px-5 py-3 font-mono text-[11px] tracking-widest flex justify-between">
          <span>DGTLZ // COMMAND DECK</span>
          <span>{mode === 'login' ? 'AUTH.LOGIN' : 'AUTH.REGISTER'}</span>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          {mode === 'register' && (
            <Field label="NAMA" value={name} onChange={setName} placeholder="Ari" />
          )}
          <Field label="EMAIL" type="email" value={email} onChange={setEmail} placeholder="operator@dgtlz.com" required />
          <Field label="PASSWORD" type="password" value={password} onChange={setPassword} placeholder="min. 8 karakter" required />
          {mode === 'register' && (
            <Field label="KODE INVITE (NON-OWNER)" value={invite} onChange={setInvite} placeholder="DGT-XXXXXXXX" />
          )}
          {error && (
            <p className="border-2 border-red-600 bg-red-50 text-red-700 font-mono text-xs px-3 py-2">✕ {error}</p>
          )}
          <button
            type="submit" disabled={busy}
            className="w-full border-2 border-neutral-900 bg-neutral-900 text-white font-mono text-xs tracking-widest py-3 hover:bg-electric-blue hover:border-electric-blue transition-colors disabled:opacity-50"
          >
            {busy ? 'MEMPROSES…' : mode === 'login' ? 'MASUK →' : 'DAFTAR →'}
          </button>
          <p className="font-mono text-[11px] text-neutral-500">
            {mode === 'login' ? (
              <>Belum punya akun? <Link to="/register" className="text-electric-blue underline">REGISTER</Link></>
            ) : (
              <>Akun pertama yang mendaftar otomatis jadi OWNER. <Link to="/login" className="text-electric-blue underline">LOGIN</Link></>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] tracking-widest text-neutral-500">{label}</span>
      <input
        type={type} value={value} required={required} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border-2 border-neutral-300 focus:border-electric-blue outline-none bg-[#F4F3EF] px-3 py-2 font-mono text-sm"
      />
    </label>
  );
}

export function requireRole(user: PublicUser | null, roles: string[]) {
  return user ? roles.includes(user.role) : false;
}
