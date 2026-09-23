// DGTLZ Command Deck API — Express + JSON file store, zero new deps.
// Auth: scrypt password hashes + HMAC-signed tokens. Roles: owner | admin | client.
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const SECRET_FILE = path.join(DATA_DIR, 'secret.key');
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(SECRET_FILE)) fs.writeFileSync(SECRET_FILE, crypto.randomBytes(32).toString('hex'));
const SECRET = Buffer.from(fs.readFileSync(SECRET_FILE, 'utf8').trim(), 'hex');

const DEFAULT_SITE = {
  pages: {
    '/': { status: 'LIVE', nav: true },
    '/route': { status: 'LIVE', nav: true },
    '/paygate': { status: 'LIVE', nav: true },
    '/agent': { status: 'LIVE', nav: true },
    '/gallery': { status: 'LIVE', nav: true },
    '/partners': { status: 'LIVE', nav: true },
    '/systems': { status: 'LIVE', nav: true },
  },
  updatedAt: null,
};
// ---- gallery: kurasi karya, editable dari SITE OPS (seed = 5 item arsip awal) ----
const DEFAULT_GALLERY = [
  { id: 'LOG-01', title: 'IDENTITY_KIT: THE MARK AND ITS VARIANTS', image: '/gallery/logo-pack.png', story: 'The complete logo architecture of DGTLZ.AGENCY — every lockup, ratio, and compression state locked into a single archival sheet. A mark engineered for both the width of a building banner and the constraint of a 16px favicon. Not decoration. Infrastructure.' },
  { id: 'HER-02', title: 'BUILD_THE_NEXT: FLAGSHIP POSTER', image: '/gallery/poster-build-the-next.jpg', story: 'The manifesto rendered as a future artifact — a classical bust corrupted by Klein Blue scanlines, as if excavated from an architectural archive that doesn\'t exist yet. It is the agency\'s core position in one frame: old enough to have authority, new enough to feel dangerous.' },
  { id: 'GRO-03', title: 'GROWTH_DOCTRINE: AN AGENCY THAT GROWS WITH YOU', image: '/gallery/poster-agency-that-grows-with-you.jpg', story: 'A statement of structural partnership. Not a vendor slide — a load-bearing contract translated into ink and grid. The design argues that growth is not a service rendered, but a system both parties build and are built by.' },
  { id: 'REC-04', title: 'RECRUITMENT_SIGNAL: KENDALIKAN OPERASIONAL', image: '/gallery/poster-rekrutmen-kendalikan-operasional.png', story: 'An open transmission to future operators. \'Kendalikan Operasional\' — take control of operations. The poster treats hiring the way brutalism treats concrete: honest about the weight, explicit about the function, no facade.' },
  { id: 'STK-05', title: 'ANALOG_ARTIFACTS: THE STICKER PACK', image: '/gallery/sticker-pack.png', story: 'The identity forced into its most portable form — die-cut vinyl built for laptops, hard cases, and studio doors. Every sticker is a deployable unit of the doctrine.' },
];

// ---- events: jadwal publik (forum, workshop, summit, webinar, launching) ----
const DEFAULT_EVENTS = [
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

const EMPTY = { users: [], leads: [], projects: [], invites: [], channels: [], messages: [], finance: [], gateway: [], site: DEFAULT_SITE, pageviews: [], gallery: [], events: [] };
function loadDb() {
  try { return { ...EMPTY, ...JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) }; }
  catch { return { ...EMPTY }; }
}
function ensureSeed(db) {
  if (!Array.isArray(db.gallery) || db.gallery.length === 0) {
    db.gallery = DEFAULT_GALLERY.map((g) => ({ ...g }));
  }
  if (!Array.isArray(db.events) || db.events.length === 0) {
    db.events = DEFAULT_EVENTS.map((e) => ({ ...e }));
  }
  if (!db.channels.some((c) => c.slug === 'general')) {
    db.channels.unshift({ id: crypto.randomUUID(), slug: 'general', name: 'GENERAL', description: 'Satu ruang diskusi tim — bebas topik kerja', kind: 'public', memberEmails: [], createdAt: new Date().toISOString() });
  }
  if (!db.channels.some((c) => c.slug === 'leads')) {
    db.channels.unshift({ id: crypto.randomUUID(), slug: 'leads', name: 'LEADS', description: 'Koordinasi lead masuk & closing — HANYA staf', kind: 'staff', memberEmails: [], createdAt: new Date().toISOString() });
  }
  return db;
}
function saveDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// ---- auth primitives ----
function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(pw, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}
function verifyPassword(pw, stored) {
  const [salt, hash] = stored.split(':');
  const check = crypto.scryptSync(pw, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(check, 'hex'));
}
function signToken(payload, ttlMs = 1000 * 60 * 60 * 24 * 14) {
  const body = { ...payload, exp: Date.now() + ttlMs };
  const data = Buffer.from(JSON.stringify(body)).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}
function readToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [data, sig] = token.split('.');
  const expect = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
  if (sig.length !== expect.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expect))) return null;
  try {
    const body = JSON.parse(Buffer.from(data, 'base64url').toString());
    if (!body.exp || body.exp < Date.now()) return null;
    return body;
  } catch { return null; }
}

const app = express();
// BuatQris webhook — MUST read raw body for HMAC signature; register before express.json()
app.post('/api/gateway/webhook/buatqris', express.raw({ type: '*/*' }), (req, res) => {
  const cfg = bqConfig();
  if (!cfg || !cfg.signingSecret) return res.status(503).json({ ok: false, error: 'WEBHOOK BELUM DIKONFIGURASI' });
  const sig = String(req.headers['x-buatqris-signature'] || '');
  const expected = 'sha256=' + crypto.createHmac('sha256', cfg.signingSecret).update(req.body).digest('hex');
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)))
    return res.status(401).json({ ok: false, error: 'SIGNATURE TIDAK VALID' });
  let payload = {};
  try { payload = JSON.parse(req.body.toString()); } catch {}
  const event = String(req.headers['x-buatqris-event'] || payload.event || '');
  const trxId = String(req.headers['x-buatqris-delivery'] || payload.transaction_id || '');
  const db = loadDb();
  const row = db.gateway.find((t) => t.bqTrxId === trxId);
  if (!row) return res.json({ ok: true, ignored: true });
  const evStatus = { 'payment.success': 'SUCCESS', 'payment.expired': 'EXPIRED', 'payment.failed': 'FAILED' }[event];
  if (evStatus && evStatus !== row.status) {
    markGatewayStatus(db, row, evStatus);
  }
  res.json({ ok: true });
});
app.use(express.json({ limit: '12mb' }));

function currentUser(req) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const body = readToken(token);
  if (!body) return null;
  const db = loadDb();
  const user = db.users.find((u) => u.id === body.uid);
  return user ? { id: user.id, email: user.email, name: user.name, role: user.role } : null;
}
function requireAuth(...roles) {
  return (req, res, next) => {
    const user = currentUser(req);
    if (!user) return res.status(401).json({ error: 'UNAUTHORIZED' });
    if (roles.length && !roles.includes(user.role)) return res.status(403).json({ error: 'FORBIDDEN' });
    req.user = user;
    next();
  };
}
const isStaff = (r) => r.role === 'owner' || r.role === 'admin';

// ---- telegram notify (optional; config via /api/settings/telegram, stored in data/telegram.json) ----
function tgConfig() {
  try { return JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'telegram.json'), 'utf8')); }
  catch { return null; }
}
async function notify(text) {
  const cfg = tgConfig();
  if (!cfg || !cfg.botToken || !cfg.chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${cfg.botToken}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: cfg.chatId, text: `⚡ DGTLZ DECK\n${text}`, disable_web_page_preview: true }),
    });
  } catch (e) { console.error('TG notify gagal:', e.message); }
}

// ---- BuatQris gateway (white-label DGTLZ PayGate layer) ----
function bqConfig() {
  try { return JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'gateway.json'), 'utf8')); } catch { return null; }
}
function saveBqConfig(cfg) { fs.writeFileSync(path.join(DATA_DIR, 'gateway.json'), JSON.stringify(cfg, null, 2)); }
async function bqCall(action, extra = {}) {
  const cfg = bqConfig();
  if (!cfg) throw new Error('GATEWAY BELUM DIKONFIGURASI');
  const body = new URLSearchParams({ action, account_id: cfg.accountId, secret_token: cfg.secretToken, ...extra });
  const r = await fetch('https://api.buatqris.site', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
  const j = await r.json().catch(() => ({}));
  if (!j.success) throw new Error(j.message || 'REQUEST BUATQRIS GAGAL');
  return j.data || {};
}
function markGatewayStatus(db, row, status) {
  row.status = status;
  row.resolvedAt = new Date().toISOString();
  if (status === 'SUCCESS' && !row.financeTxnId) {
    const txn = { id: crypto.randomUUID(), type: 'INCOME', category: 'PAYGATE', description: `QRIS ${row.description || row.dgtlzTrxId}`, amount: row.amount, date: new Date().toISOString().slice(0, 10), projectId: row.projectId || null, status: 'PAID', createdAt: new Date().toISOString() };
    db.finance.unshift(txn);
    row.financeTxnId = txn.id;
  }
  saveDb(db);
  const label = { SUCCESS: 'LUNAS ✅', EXPIRED: 'KEDALUWARSA ⏳', FAILED: 'GAGAL ❌' }[status] || status;
  notify(`💳 PAYGATE ${label}\nJumlah: ${rupiah(row.amount)}\nTRX: ${row.dgtlzTrxId}`);
}

function publicUser(u) { return { id: u.id, email: u.email, name: u.name, role: u.role, title: u.title || '', status: u.status || 'ACTIVE', capacityHours: u.capacityHours ?? 40, createdAt: u.createdAt }; }

// ---- auth routes ----
// First account ever = owner. Later registrations need an invite code (clients) or
// must be created by staff — protects the deck from open signup abuse.
app.post('/api/auth/register', (req, res) => {
  const { email, password, name, invite } = req.body || {};
  if (!email || !password || typeof password !== 'string' || password.length < 8)
    return res.status(400).json({ error: 'EMAIL DAN PASSWORD (MIN 8 KARAKTER) WAJIB' });
  const db = loadDb();
  if (db.users.some((u) => u.email.toLowerCase() === String(email).toLowerCase()))
    return res.status(409).json({ error: 'EMAIL SUDAH TERDAFTAR' });
  const first = db.users.length === 0;
  let role;
  if (first) {
    role = 'owner';
  } else {
    const inv = db.invites.find((i) => i.code === invite && !i.usedBy);
    if (!inv) return res.status(403).json({ error: 'KODE INVITE TIDAK VALID' });
    role = inv.role || 'client';
    inv.usedBy = email;
  }
  const user = {
    id: crypto.randomUUID(), email: String(email), name: String(name || email).slice(0, 80),
    role, password: hashPassword(password), createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  saveDb(db);
  res.json({ token: signToken({ uid: user.id }), user: publicUser(user), firstAccount: first });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const db = loadDb();
  const user = db.users.find((u) => u.email.toLowerCase() === String(email || '').toLowerCase());
  if (!user || !verifyPassword(String(password || ''), user.password))
    return res.status(401).json({ error: 'EMAIL ATAU PASSWORD SALAH' });
  res.json({ token: signToken({ uid: user.id }), user: publicUser(user) });
});

app.get('/api/auth/me', requireAuth(), (req, res) => res.json({ user: req.user }));
app.post('/api/auth/logout', (req, res) => res.json({ ok: true }));

// ---- staff-only: user + invite management ----
app.get('/api/users', requireAuth('owner', 'admin'), (req, res) =>
  res.json({ users: loadDb().users.map(publicUser) }));

app.post('/api/users', requireAuth('owner', 'admin'), (req, res) => {
  const { email, password, name, role } = req.body || {};
  if (!['admin', 'client'].includes(role)) return res.status(400).json({ error: 'ROLE HARUS admin|client' });
  if (!email || !password || password.length < 8) return res.status(400).json({ error: 'EMAIL + PASSWORD (MIN 8) WAJIB' });
  const db = loadDb();
  if (db.users.some((u) => u.email.toLowerCase() === String(email).toLowerCase()))
    return res.status(409).json({ error: 'EMAIL SUDAH TERDAFTAR' });
  const user = { id: crypto.randomUUID(), email: String(email), name: String(name || email).slice(0, 80), role, password: hashPassword(password), createdAt: new Date().toISOString() };
  db.users.push(user); saveDb(db);
  res.json({ user: publicUser(user) });
});

app.post('/api/invites', requireAuth('owner', 'admin'), (req, res) => {
  const code = `DGT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  const db = loadDb();
  db.invites.push({ code, role: (req.body && req.body.role) || 'client', usedBy: null, createdAt: new Date().toISOString() });
  saveDb(db);
  res.json({ invite: { code, role: db.invites.at(-1).role } });
});

// ---- leads (public POST for site contact form; staff read/delete) ----
app.post('/api/leads', (req, res) => {
  const { name, contact, message } = req.body || {};
  if (!name || !contact) return res.status(400).json({ error: 'NAMA DAN KONTAK WAJIB' });
  const db = loadDb();
  const lead = { id: crypto.randomUUID(), name: String(name).slice(0, 120), contact: String(contact).slice(0, 160), message: String(message || '').slice(0, 2000), status: 'NEW', createdAt: new Date().toISOString() };
  db.leads.unshift(lead); saveDb(db);
  notify(`🧲 LEAD BARU\nNama: ${lead.name}\nKontak: ${lead.contact}\n${lead.message || '(tanpa pesan)'}`);
  res.json({ lead });
});
app.get('/api/leads', requireAuth('owner', 'admin'), (req, res) => res.json({ leads: loadDb().leads }));
app.delete('/api/leads/:id', requireAuth('owner', 'admin'), (req, res) => {
  const db = loadDb();
  db.leads = db.leads.filter((l) => l.id !== req.params.id); saveDb(db);
  res.json({ ok: true });
});

// ---- projects (pipeline; client sees own). Create/patch extended with deadline, budget, members ----
app.get('/api/projects', requireAuth(), (req, res) => {
  const db = loadDb();
  const projects = isStaff(req.user) ? db.projects : db.projects.filter((p) => p.clientEmail === req.user.email);
  res.json({ projects });
});

app.post('/api/projects', requireAuth('owner', 'admin'), (req, res) => {
  const { title, clientEmail, phase, deliverables, deadline, budget, memberEmails } = req.body || {};
  if (!title || !clientEmail) return res.status(400).json({ error: 'TITLE + CLIENT EMAIL WAJIB' });
  const db = loadDb();
  const project = {
    id: crypto.randomUUID(), title: String(title).slice(0, 160), clientEmail: String(clientEmail),
    phase: ['DISCOVERY', 'BUILD', 'REVIEW', 'LIVE'].includes(phase) ? phase : 'DISCOVERY',
    deliverables: Array.isArray(deliverables) ? deliverables.map((d) => ({ name: String(d).slice(0, 160), done: false })) : [],
    deadline: deadline ? String(deadline) : '',
    budget: Number(budget) || 0,
    memberEmails: Array.isArray(memberEmails) ? memberEmails.map((e) => String(e).toLowerCase()).slice(0, 20) : [],
    createdAt: new Date().toISOString(),
  };
  db.projects.unshift(project); saveDb(db);
  // auto-create a channel for the project
  if (!db.channels.some((c) => c.slug === `proj-${project.id.slice(0, 8)}`)) {
    db.channels.push({ id: crypto.randomUUID(), slug: `proj-${project.id.slice(0, 8)}`, name: `PROJ: ${project.title}`.slice(0, 40), description: `Koordinasi proyek "${project.title}" — klien + staf terkait`, kind: 'project', projectId: project.id, memberEmails: project.memberEmails, clientEmail: project.clientEmail, createdAt: new Date().toISOString() });
    saveDb(db);
  }
  res.json({ project });
});
app.patch('/api/projects/:id', requireAuth(), (req, res) => {
  const db = loadDb();
  const p = db.projects.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'PROYEK TIDAK DITEMUKAN' });
  if (!isStaff(req.user) && p.clientEmail !== req.user.email) return res.status(403).json({ error: 'FORBIDDEN' });
  if (req.body.phase) {
    if (!isStaff(req.user)) return res.status(403).json({ error: 'HANYA STAFF YANG BISA UBAH FASE' });
    if (['DISCOVERY', 'BUILD', 'REVIEW', 'LIVE'].includes(req.body.phase) && req.body.phase !== p.phase) {
      p.phase = req.body.phase;
      notify(`📦 PROYEK: ${p.title}\nFase → ${p.phase}`);
    }
  }
  if (Array.isArray(req.body.deliverables) && p.deliverables.length === req.body.deliverables.length) {
    p.deliverables = p.deliverables.map((d, i) => ({ ...d, done: !!req.body.deliverables[i]?.done }));
  }
  if (isStaff(req.user)) {
    if (req.body.deadline !== undefined) p.deadline = String(req.body.deadline || '');
    if (req.body.budget !== undefined) p.budget = Number(req.body.budget) || 0;
    if (Array.isArray(req.body.memberEmails)) p.memberEmails = req.body.memberEmails.map((e) => String(e).toLowerCase()).slice(0, 20);
  }
  saveDb(db);
  res.json({ project: p });
});

// ---- team management (staff): profiles, status, capacity ----
app.get('/api/team', requireAuth('owner', 'admin'), (req, res) => {
  const db = ensureSeed(loadDb()); saveDb(db);
  res.json({ users: db.users.map(publicUser) });
});
app.patch('/api/team/:id', requireAuth('owner', 'admin'), (req, res) => {
  const db = loadDb();
  const u = db.users.find((x) => x.id === req.params.id);
  if (!u) return res.status(404).json({ error: 'USER TIDAK DITEMUKAN' });
  const { title, status, capacityHours } = req.body || {};
  if (title !== undefined) u.title = String(title).slice(0, 60);
  if (status !== undefined) { if (!['ACTIVE', 'BENCH', 'LEAVE'].includes(status)) return res.status(400).json({ error: 'STATUS HARUS ACTIVE|BENCH|LEAVE' }); u.status = status; }
  if (capacityHours !== undefined) u.capacityHours = Math.max(0, Math.min(80, Number(capacityHours) || 0));
  saveDb(db);
  res.json({ user: publicUser(u) });
});

// ---- chat channels + messages (all roles, access-filtered) ----
function channelVisible(ch, user) {
  if (isStaff(user)) return true;
  if (ch.kind === 'staff') return false;
  if (ch.kind === 'project') return ch.clientEmail === user.email || (ch.memberEmails || []).includes(user.email);
  return (ch.memberEmails || []).length === 0 || ch.memberEmails.includes(user.email); // public channels: open unless members restricted
}
app.get('/api/channels', requireAuth(), (req, res) => {
  const db = ensureSeed(loadDb()); saveDb(db);
  res.json({ channels: db.channels.filter((c) => channelVisible(c, req.user)) });
});
app.post('/api/channels', requireAuth('owner', 'admin'), (req, res) => {
  const { name, description, kind, memberEmails } = req.body || {};
  if (!name) return res.status(400).json({ error: 'NAMA CHANNEL WAJIB' });
  const db = loadDb();
  const slug = String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  if (!slug || db.channels.some((c) => c.slug === slug)) return res.status(409).json({ error: 'SLUG CHANNEL SUDAH ADA / TIDAK VALID' });
  const ch = { id: crypto.randomUUID(), slug, name: String(name).slice(0, 40).toUpperCase(), description: String(description || '').slice(0, 160), kind: ['public', 'staff'].includes(kind) ? kind : 'public', memberEmails: Array.isArray(memberEmails) ? memberEmails.map((e) => String(e).toLowerCase()) : [], projectId: null, createdAt: new Date().toISOString() };
  db.channels.push(ch); saveDb(db);
  res.json({ channel: ch });
});
app.get('/api/channels/:id/messages', requireAuth(), (req, res) => {
  const db = loadDb();
  const ch = db.channels.find((c) => c.id === req.params.id);
  if (!ch) return res.status(404).json({ error: 'CHANNEL TIDAK DITEMUKAN' });
  if (!channelVisible(ch, req.user)) return res.status(403).json({ error: 'FORBIDDEN' });
  const msgs = db.messages.filter((m) => m.channelId === ch.id).slice(-200);
  res.json({ messages: msgs });
});
app.post('/api/channels/:id/messages', requireAuth(), (req, res) => {
  const db = loadDb();
  const ch = db.channels.find((c) => c.id === req.params.id);
  if (!ch) return res.status(404).json({ error: 'CHANNEL TIDAK DITEMUKAN' });
  if (!channelVisible(ch, req.user)) return res.status(403).json({ error: 'FORBIDDEN' });
  const text = String((req.body || {}).text || '').trim().slice(0, 2000);
  if (!text) return res.status(400).json({ error: 'PESAN KOSONG' });
  const msg = { id: crypto.randomUUID(), channelId: ch.id, userId: req.user.id, userName: req.user.name, userRole: req.user.role, text, createdAt: new Date().toISOString() };
  db.messages.push(msg);
  if (db.messages.length > 5000) db.messages = db.messages.slice(-4000); // ring buffer
  saveDb(db);
  res.json({ message: msg });
});
app.delete('/api/channels/:id', requireAuth('owner', 'admin'), (req, res) => {
  const db = loadDb();
  const ch = db.channels.find((c) => c.id === req.params.id);
  if (!ch) return res.status(404).json({ error: 'CHANNEL TIDAK DITEMUKAN' });
  if (['general', 'leads'].includes(ch.slug)) return res.status(400).json({ error: 'CHANNEL BAWAAN TIDAK BISA DIHAPUS' });
  db.channels = db.channels.filter((c) => c.id !== ch.id);
  db.messages = db.messages.filter((m) => m.channelId !== ch.id);
  saveDb(db);
  res.json({ ok: true });
});

// ---- finance (staff): transactions + summary ----
app.get('/api/finance', requireAuth('owner', 'admin'), (req, res) => {
  const txns = loadDb().finance;
  const income = txns.filter((t) => t.type === 'INCOME').reduce((a, t) => a + t.amount, 0);
  const expense = txns.filter((t) => t.type === 'EXPENSE').reduce((a, t) => a + t.amount, 0);
  res.json({ transactions: txns, summary: { income, expense, net: income - expense } });
});
app.post('/api/finance', requireAuth('owner', 'admin'), (req, res) => {
  const { type, category, description, amount, date, projectId } = req.body || {};
  if (!['INCOME', 'EXPENSE'].includes(type)) return res.status(400).json({ error: 'TYPE HARUS INCOME|EXPENSE' });
  const amt = Number(amount);
  if (!amt || amt <= 0) return res.status(400).json({ error: 'AMOUNT HARUS > 0' });
  const db = loadDb();
  const txn = {
    id: crypto.randomUUID(), type, category: String(category || (type === 'INCOME' ? 'CLIENT PAYMENT' : 'OPERATIONAL')).slice(0, 40).toUpperCase(),
    description: String(description || '').slice(0, 200), amount: amt,
    date: date ? String(date) : new Date().toISOString().slice(0, 10),
    projectId: projectId || null,
    status: type === 'INCOME' ? 'PAID' : '', // income defaults PAID; can be set DRAFT/SENT for receivables
    createdAt: new Date().toISOString(),
  };
  db.finance.unshift(txn); saveDb(db);
  res.json({ transaction: txn });
});
app.patch('/api/finance/:id', requireAuth('owner', 'admin'), (req, res) => {
  const db = loadDb();
  const t = db.finance.find((x) => x.id === req.params.id);
  if (!t) return res.status(404).json({ error: 'TRANSAKSI TIDAK DITEMUKAN' });
  if ((req.body || {}).status && ['DRAFT', 'SENT', 'PAID'].includes(req.body.status)) t.status = req.body.status;
  saveDb(db);
  res.json({ transaction: t });
});
app.delete('/api/finance/:id', requireAuth('owner', 'admin'), (req, res) => {
  const db = loadDb();
  db.finance = db.finance.filter((x) => x.id !== req.params.id); saveDb(db);
  res.json({ ok: true });
});


// ---- site control & analytics (SITE OPS) ----
const SITE_KEYS = new Set(['/', '/route', '/paygate', '/agent', '/gallery', '/partners', '/systems']);

app.get('/api/site/config', (_req, res) => {
  const db = loadDb();
  res.json({ site: db.site || DEFAULT_SITE });
});

app.patch('/api/site/config', requireAuth('owner', 'admin'), (req, res) => {
  const db = loadDb();
  if (!db.site) db.site = JSON.parse(JSON.stringify(DEFAULT_SITE));
  const body = req.body || {};
  for (const [k, v] of Object.entries(body.pages || {})) {
    if (!SITE_KEYS.has(k)) continue;
    db.site.pages[k] = {
      status: v.status === 'MAINTENANCE' ? 'MAINTENANCE' : 'LIVE',
      nav: v.nav !== false,
    };
  }
  db.site.updatedAt = new Date().toISOString();
  saveDb(db);
  res.json({ site: db.site });
});

app.post('/api/analytics/pageview', (req, res) => {
  const db = loadDb();
  if (!Array.isArray(db.pageviews)) db.pageviews = [];
  const b = req.body || {};
  const pv = {
    path: String(b.path || '/').slice(0, 120),
    sid: String(b.sid || '').slice(0, 64),
    ref: String(b.ref || '').slice(0, 200),
    device: b.device === 'mobile' ? 'mobile' : b.device === 'tablet' ? 'tablet' : 'desktop',
    ts: new Date().toISOString(),
  };
  db.pageviews.push(pv);
  // keep store bounded: last 20k events
  if (db.pageviews.length > 20000) db.pageviews = db.pageviews.slice(-20000);
  saveDb(db);
  res.json({ ok: true });
});

app.get('/api/analytics/summary', requireAuth('owner', 'admin'), (req, res) => {
  const db = loadDb();
  const pvs = Array.isArray(db.pageviews) ? db.pageviews : [];
  const now = Date.now();
  const dayAgo = now - 24 * 3600 * 1000;
  const weekAgo = now - 7 * 24 * 3600 * 1000;

  const perPage = {};
  const sessions = new Set();
  const devices = { desktop: 0, mobile: 0, tablet: 0 };
  const recent = [];
  let views24 = 0;
  for (const pv of pvs) {
    const t = Date.parse(pv.ts);
    if (t >= dayAgo) {
      views24++;
      perPage[pv.path] = perPage[pv.path] || { day: 0, week: 0, all: 0 };
      perPage[pv.path].day++;
      sessions.add(pv.sid);
      devices[pv.device] = (devices[pv.device] || 0) + 1;
      recent.push(pv);
    } else if (t >= weekAgo) {
      perPage[pv.path] = perPage[pv.path] || { day: 0, week: 0, all: 0 };
      perPage[pv.path].week++;
    }
    if (perPage[pv.path]) perPage[pv.path].all++;
  }
  const top = Object.entries(perPage)
    .map(([path, c]) => ({ path, ...c }))
    .sort((a, b) => b.day - a.day || b.week - a.week);

  // funnel: home views -> /login -> /register -> dashboard-hits via /api/auth counts
  const funnel = {
    home: (perPage['/'] || {}).day || 0,
    login: (perPage['/login'] || {}).day || 0,
    register: (perPage['/register'] || {}).day || 0,
  };

  recent.sort((a, b) => Date.parse(b.ts) - Date.parse(a.ts));

  res.json({
    summary: {
      views24,
      sessions24: sessions.size,
      devices,
      total: pvs.length,
    },
    pages: top,
    recent: recent.slice(0, 12),
    funnel,
  });
});


// ---- gallery: kurasi karya (GET publik utk halaman gallery; CRUD owner/admin di SITE OPS) ----
app.get('/api/gallery', (_req, res) => {
  const db = loadDb();
  ensureSeed(db);
  const items = (db.gallery || []).slice().sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));
  res.json({ items });
});

app.post('/api/gallery', requireAuth('owner', 'admin'), (req, res) => {
  const db = loadDb();
  const { id, title, image, story } = req.body || {};
  const safeId = String(id || '').trim().toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 16);
  if (!safeId) return res.status(400).json({ error: 'ID wajib (A-Z, 0-9, tanda hubung)' });
  if (!title || !String(title).trim()) return res.status(400).json({ error: 'Judul wajib diisi' });
  if (db.gallery.some((g) => g.id === safeId)) return res.status(409).json({ error: `ID ${safeId} sudah dipakai` });
  db.gallery.push({ id: safeId, title: String(title).trim().slice(0, 120), image: String(image || '').trim(), story: String(story || '').trim().slice(0, 2000) });
  saveDb(db);
  res.json({ ok: true, item: db.gallery[db.gallery.length - 1] });
});

app.patch('/api/gallery/:id', requireAuth('owner', 'admin'), (req, res) => {
  const db = loadDb();
  const item = db.gallery.find((g) => g.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Item tidak ditemukan' });
  const { title, story, image } = req.body || {};
  if (title !== undefined) item.title = String(title).trim().slice(0, 120) || item.title;
  if (story !== undefined) item.story = String(story).trim().slice(0, 2000);
  if (image !== undefined) item.image = String(image).trim();
  saveDb(db);
  res.json({ ok: true, item });
});

app.delete('/api/gallery/:id', requireAuth('owner', 'admin'), (req, res) => {
  const db = loadDb();
  const before = db.gallery.length;
  db.gallery = db.gallery.filter((g) => g.id !== req.params.id);
  if (db.gallery.length === before) return res.status(404).json({ error: 'Item tidak ditemukan' });
  saveDb(db);
  res.json({ ok: true });
});

// ---- events: CRUD jadwal publik ----
app.get('/api/events', (_req, res) => {
  const db = loadDb();
  ensureSeed(db);
  const items = (db.events || []).slice();
  res.json({ items });
});

app.post('/api/events', requireAuth('owner', 'admin'), (req, res) => {
  const db = loadDb();
  ensureSeed(db);
  const { id, date, title, location, status, description } = req.body || {};
  const safeId = String(id || `EVT-${String(db.events.length + 1).padStart(2, '0')}`).trim().toUpperCase();
  if (!title || !String(title).trim()) return res.status(400).json({ error: 'Judul event wajib' });
  if (db.events.some((e) => e.id === safeId)) return res.status(409).json({ error: `ID event ${safeId} sudah dipakai` });
  
  const newEvt = {
    id: safeId,
    date: String(date || new Date().toISOString().slice(0, 10).replace(/-/g, '.')),
    title: String(title).trim().toUpperCase().slice(0, 120),
    location: String(location || 'ONLINE').trim().toUpperCase(),
    status: ['OPEN', 'CLOSED', 'INVITE ONLY'].includes(status) ? status : 'OPEN',
    description: String(description || '').trim().slice(0, 1000),
  };
  db.events.push(newEvt);
  saveDb(db);
  res.json({ ok: true, item: newEvt });
});

app.patch('/api/events/:id', requireAuth('owner', 'admin'), (req, res) => {
  const db = loadDb();
  ensureSeed(db);
  const item = db.events.find((e) => e.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Event tidak ditemukan' });
  const { date, title, location, status, description } = req.body || {};
  if (date !== undefined) item.date = String(date).trim();
  if (title !== undefined) item.title = String(title).trim().toUpperCase().slice(0, 120);
  if (location !== undefined) item.location = String(location).trim().toUpperCase();
  if (status !== undefined && ['OPEN', 'CLOSED', 'INVITE ONLY'].includes(status)) item.status = status;
  if (description !== undefined) item.description = String(description).trim().slice(0, 1000);
  saveDb(db);
  res.json({ ok: true, item });
});

app.delete('/api/events/:id', requireAuth('owner', 'admin'), (req, res) => {
  const db = loadDb();
  ensureSeed(db);
  const before = db.events.length;
  db.events = db.events.filter((e) => e.id !== req.params.id);
  if (db.events.length === before) return res.status(404).json({ error: 'Event tidak ditemukan' });
  saveDb(db);
  res.json({ ok: true });
});

// ---- gallery upload: simpan file gambar (base64) ke server/data/uploads, dilayani di /uploads/* ----
const IMG_MIME = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp', 'image/gif': '.gif', 'image/svg+xml': '.svg' };
app.post('/api/gallery/upload', requireAuth('owner', 'admin'), (req, res) => {
  const { dataUrl } = req.body || {};
  const m = typeof dataUrl === 'string' ? dataUrl.match(/^data:(image\/(?:png|jpeg|webp|gif|svg\+xml));base64,([A-Za-z0-9+/=]+)$/) : null;
  if (!m) return res.status(400).json({ error: 'Format harus data URL image (png/jpg/webp/gif/svg), maks ~9MB' });
  const ext = IMG_MIME[m[1]];
  const buf = Buffer.from(m[2], 'base64');
  if (buf.length > 8 * 1024 * 1024) return res.status(413).json({ error: 'File terlalu besar (maks 8MB)' });
  const fname = `g-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
  fs.writeFileSync(path.join(UPLOAD_DIR, fname), buf);
  res.json({ ok: true, url: `/uploads/${fname}` });
});

app.use('/uploads', express.static(path.join(UPLOAD_DIR), { maxAge: '30d', immutable: true }));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'dgtlz-command-deck', time: new Date().toISOString() }));

// ---- settings: telegram notify (owner only) ----
app.get('/api/settings/telegram', requireAuth('owner'), (_req, res) => {
  const cfg = tgConfig();
  res.json({ configured: !!(cfg && cfg.botToken && cfg.chatId), chatId: cfg ? cfg.chatId : '' });
});
app.post('/api/settings/telegram', requireAuth('owner'), async (req, res) => {
  const { botToken, chatId } = req.body || {};
  const db = loadDb(); // touch db to keep access pattern consistent
  if (!botToken || !chatId) return res.status(400).json({ error: 'BOT TOKEN + CHAT ID WAJIB' });
  // validate by calling getMe + sending a test message
  try {
    const me = await fetch(`https://api.telegram.org/bot${botToken}/getMe`).then((r) => r.json());
    if (!me.ok) return res.status(400).json({ error: 'BOT TOKEN TIDAK VALID' });
    const send = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: '⚡ DGTLZ DECK\nNotifikasi terhubung! Pesan ini adalah tes koneksi.' }),
    }).then((r) => r.json());
    if (!send.ok) return res.status(400).json({ error: `CHAT ID SALAH / BOT BISA NGGAK KIRIM: ${send.description}` });
    fs.writeFileSync(path.join(DATA_DIR, 'telegram.json'), JSON.stringify({ botToken: String(botToken), chatId: String(chatId) }, null, 2));
    void db;
    res.json({ ok: true, bot: me.result.username });
  } catch (e) {
    res.status(502).json({ error: `GAGAL HUBUNGI TELEGRAM: ${e.message}` });
  }
});
app.delete('/api/settings/telegram', requireAuth('owner'), (_req, res) => {
  try { fs.unlinkSync(path.join(DATA_DIR, 'telegram.json')); } catch {}
  res.json({ ok: true });
});

// ---- auth: change password (any logged-in user) ----
app.post('/api/auth/change-password', requireAuth(), (req, res) => {
  const { current, next } = req.body || {};
  if (!next || typeof next !== 'string' || next.length < 8) return res.status(400).json({ error: 'PASSWORD BARU MIN 8 KARAKTER' });
  const db = loadDb();
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user || !verifyPassword(String(current || ''), user.password)) return res.status(401).json({ error: 'PASSWORD LAMA SALAH' });
  user.password = hashPassword(next);
  saveDb(db);
  notify(`🔑 Password diubah untuk akun ${user.email}`);
  res.json({ ok: true });
});

// ---- deliverable approval (client on own project; staff too) ----
app.patch('/api/projects/:id/approve', requireAuth(), (req, res) => {
  const db = loadDb();
  const p = db.projects.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'PROYEK TIDAK DITEMUKAN' });
  if (!isStaff(req.user) && p.clientEmail !== req.user.email) return res.status(403).json({ error: 'FORBIDDEN' });
  const { index, decision, note } = req.body || {};
  const i = Number(index);
  if (!Number.isInteger(i) || !p.deliverables[i]) return res.status(400).json({ error: 'INDEX DELIVERABLE TIDAK VALID' });
  if (!['APPROVED', 'REVISI'].includes(decision)) return res.status(400).json({ error: 'DECISION HARUS APPROVED|REVISI' });
  const d = p.deliverables[i];
  d.approval = decision;
  d.approvalNote = String(note || '').slice(0, 500);
  d.approvalAt = new Date().toISOString();
  d.approvalBy = req.user.name || req.user.email;
  saveDb(db);
  notify(
    decision === 'APPROVED'
      ? `✅ DELIVERABLE DISETUJUI\nProyek: ${p.title}\nItem: ${d.name}\nOleh: ${d.approvalBy}${d.approvalNote ? `\nCatatan: ${d.approvalNote}` : ''}`
      : `🔁 REVISI DIMINTA\nProyek: ${p.title}\nItem: ${d.name}\nOleh: ${d.approvalBy}${d.approvalNote ? `\nCatatan: ${d.approvalNote}` : ''}`
  );
  res.json({ project: p });
});

app.listen(PORT, () => console.log(`DGTLZ Command Deck API → http://localhost:${PORT}`));

// ---- scheduler state persisted so restarts don't double-fire ----
function schedState() {
  try { return JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'scheduler.json'), 'utf8')); } catch { return {}; }
}
function saveSched(s) { fs.writeFileSync(path.join(DATA_DIR, 'scheduler.json'), JSON.stringify(s, null, 2)); }
const WITA_OFFSET_MIN = 480; // UTC+8
function witaNow() {
  const t = new Date(Date.now() + WITA_OFFSET_MIN * 60000);
  return { date: t.toISOString().slice(0, 10), dow: t.getUTCDay(), h: t.getUTCHours(), m: t.getUTCMinutes() };
}
const rupiah = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;

// ---------- GATEWAY (PayGate) endpoints ----------
app.get('/api/gateway/config', requireAuth('owner', 'admin'), (_req, res) => {
  const c = bqConfig();
  res.json({ configured: !!(c && c.accountId && c.secretToken), merchantName: c ? c.merchantName || '' : '', hasSigningSecret: !!(c && c.signingSecret) });
});
app.post('/api/gateway/config', requireAuth('owner'), (req, res) => {
  const { accountId, secretToken, merchantName, signingSecret } = req.body || {};
  if (!accountId || !secretToken) return res.status(400).json({ error: 'ACCOUNT ID + SECRET TOKEN WAJIB' });
  saveBqConfig({ accountId: String(accountId).trim(), secretToken: String(secretToken).trim(), merchantName: String(merchantName || 'DGTLZ').slice(0, 60), signingSecret: String(signingSecret || '').trim() });
  notify('💳 Gateway PayGate dikonfigurasi');
  res.json({ ok: true });
});
app.delete('/api/gateway/config', requireAuth('owner'), (_req, res) => {
  try { fs.unlinkSync(path.join(DATA_DIR, 'gateway.json')); } catch {}
  res.json({ ok: true });
});
// create QRIS transaction (white-label: qris_name = merchant trade name)
app.post('/api/gateway/qris', requireAuth('owner', 'admin'), async (req, res) => {
  const { amount, description, invoiceId, projectId } = req.body || {};
  const amt = Number(amount);
  if (!amt || amt < 1000 || amt > 5000000) return res.status(400).json({ error: 'NOMINAL RP 1.000 - 5.000.000' });
  try {
    const cfg = bqConfig();
    const data = await bqCall('api_create_qris', { amount: String(amt), description: String(description || '').slice(0, 100), qris_name: cfg ? cfg.merchantName || 'DGTLZ' : 'DGTLZ' });
    const db = loadDb();
    const row = {
      id: crypto.randomUUID(), dgtlzTrxId: `DGT-${Date.now()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`,
      bqTrxId: String(data.transaction_id || ''), amount: amt, totalAmount: data.total_amount || amt,
      adminFee: data.admin_fee || 0, description: String(description || '').slice(0, 100),
      invoiceId: invoiceId || null, projectId: projectId || null,
      status: 'PENDING', method: data.qris_method || '', createdAt: new Date().toISOString(),
    };
    db.gateway.unshift(row); saveDb(db);
    res.json({ transaction: row, qrImage: data.qris_image || null, qrUrl: data.qr_url || null, paymentUrl: data.payment_url || null });
  } catch (e) { res.status(502).json({ error: e.message }); }
});
// manual status check (buatqris rate limit: 1 req / 20s / trx)
app.post('/api/gateway/:id/check', requireAuth('owner', 'admin'), async (req, res) => {
  const db = loadDb();
  const row = db.gateway.find((t) => t.id === req.params.id);
  if (!row) return res.status(404).json({ error: 'TRANSAKSI TIDAK DITEMUKAN' });
  if (row.status !== 'PENDING') return res.json({ transaction: row });
  try {
    const data = await bqCall('api_check_status', { transaction_id: row.bqTrxId });
    const map = { success: 'SUCCESS', expired: 'EXPIRED', failed: 'FAILED', pending: 'PENDING' };
    const st = map[String(data.status || 'pending')] || 'PENDING';
    if (st !== 'PENDING') markGatewayStatus(db, row, st);
    res.json({ transaction: row });
  } catch (e) { res.status(502).json({ error: e.message }); }
});
app.get('/api/gateway/transactions', requireAuth('owner', 'admin'), (_req, res) => {
  const db = loadDb();
  const txns = db.gateway;
  const summary = {
    count: txns.length, success: txns.filter((t) => t.status === 'SUCCESS').length, pending: txns.filter((t) => t.status === 'PENDING').length,
    volume: txns.filter((t) => t.status === 'SUCCESS').reduce((s, t) => s + t.amount, 0),
    fees: txns.filter((t) => t.status === 'SUCCESS').reduce((s, t) => s + Number(t.adminFee || 0), 0),
  };
  res.json({ transactions: txns, summary });
});
// ---- deadline + digest scheduler (checks every 10 min) ----
function daysUntil(dateStr) { return Math.ceil((new Date(dateStr + 'T23:59:59+08:00') - Date.now()) / 864e5); }
async function schedulerTick() {
  const w = witaNow();
  if (w.h !== 8 || w.m >= 10) return; // fire window 08:00-08:09 WITA
  const sched = schedState();
  // deadline alerts: H-7, H-3, H-1, overdue — once per threshold per project per day
  const db = loadDb();
  const alerts = [];
  for (const p of db.projects) {
    if (!p.deadline || p.phase === 'LIVE' || p.phase === 'DONE') continue;
    const d = daysUntil(p.deadline.slice(0, 10));
    const th = d < 0 ? 'OVERDUE' : [7, 3, 1].includes(d) ? `H-${d}` : null;
    if (!th) continue;
    const key = `${p.id}:${th}:${w.date}`;
    if ((sched.deadlineAlerts || []).includes(key)) continue;
    alerts.push(`⏰ ${th === 'OVERDUE' ? 'TELAT' : 'DEADLINE ' + th}\n📦 ${p.title}\n📅 ${p.deadline.slice(0, 10)}${d < 0 ? ` (${Math.abs(d)} hari lewat)` : ''}`);
    sched.deadlineAlerts = [...(sched.deadlineAlerts || []), key].slice(-200);
  }
  if (alerts.length) { await notify(alerts.join('\n\n')); saveSched(sched); }
  // daily digest
  if (sched.lastDigest !== w.date) {
    const active = db.projects.filter((p) => p.phase !== 'DONE');
    const soon = db.projects.filter((p) => { if (!p.deadline || p.phase === 'DONE') return false; const d = daysUntil(p.deadline.slice(0, 10)); return d >= 0 && d <= 7; });
    const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10);
    const inc = db.finance.filter((t) => t.type === 'INCOME' && t.date >= weekAgo).reduce((s, t) => s + t.amount, 0);
    const exp = db.finance.filter((t) => t.type === 'EXPENSE' && t.date >= weekAgo).reduce((s, t) => s + t.amount, 0);
    const newLeads = db.leads.filter((l) => l.createdAt.slice(0, 10) === w.date).length;
    const openLeads = db.leads.filter((l) => !['WON', 'LOST'].includes(l.status)).length;
    const lines = [
      '☀️ DGTLZ DIGEST HARIAN', `📅 ${w.date} WITA`,
      `📦 Proyek aktif: ${active.length}`,
      ...(soon.length ? [`⏰ Deadline ≤7 hari: ${soon.map((p) => `${p.title} → ${p.deadline.slice(0, 10)}`).join(' | ')}`] : []),
      `💰 7 hari terakhir: masuk ${rupiah(inc)} / keluar ${rupiah(exp)} (net ${rupiah(inc - exp)})`,
      `🧲 Lead baru hari ini: ${newLeads} · menunggu ditindak: ${openLeads}`,
      `💳 PayGate: ${db.gateway.filter((t) => t.status === 'PENDING').length} pending, ${db.gateway.filter((t) => t.status === 'SUCCESS').length} lunas`,
    ];
    await notify(lines.join('\n'));
    sched.lastDigest = w.date; saveSched(sched);
  }
  // weekly digest (Monday)
  if (w.dow === 1 && sched.lastWeekly !== w.date) {
    const active = db.projects.filter((p) => p.phase !== 'DONE');
    const lines = [
      '🗓️ DGTLZ DIGEST MINGGUAN', `📅 Senin ${w.date} WITA`,
      `📦 Pipeline: ${['DISCOVERY', 'BUILD', 'REVIEW'].map((ph) => `${ph} ${active.filter((p) => p.phase === ph).length}`).join(' · ')} · LIVE ${db.projects.filter((p) => p.phase === 'LIVE').length}`,
      `🧲 Total lead: ${db.leads.length} (baru ${db.leads.filter((l) => l.status === 'NEW').length})`,
      `👥 Tim: ${db.users.length} akun · ${db.users.filter((u) => u.status === 'ACTIVE').length} aktif`,
      'Selamat minggu kerja baru 🚀',
    ];
    await notify(lines.join('\n'));
    sched.lastWeekly = w.date; saveSched(sched);
  }
}
setInterval(() => { schedulerTick().catch((e) => console.error('scheduler:', e.message)); }, 10 * 60 * 1000);
setTimeout(() => { schedulerTick().catch(() => {}); }, 5000); // initial check shortly after boot
