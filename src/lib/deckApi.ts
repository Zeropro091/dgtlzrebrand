// Tiny API client for the DGTLZ Command Deck. Token lives in localStorage.
const TOKEN_KEY = 'dgtlz_deck_token';

export function getToken(): string | null { return localStorage.getItem(TOKEN_KEY); }
export function setToken(t: string | null): void {
  if (t) localStorage.setItem(TOKEN_KEY, t); else localStorage.removeItem(TOKEN_KEY);
}

export type PublicUser = {
  id: string; email: string; name: string; role: 'owner' | 'admin' | 'client';
  title?: string; status?: 'ACTIVE' | 'BENCH' | 'LEAVE'; capacityHours?: number; createdAt: string;
};
export type Channel = { id: string; slug: string; name: string; kind: 'GENERAL' | 'PROJECT' | 'STAFF'; description: string; projectId?: string };
export type Message = { id: string; channelId: string; userId: string; userName: string; text: string; createdAt: string };
export type Transaction = {
  id: string; type: 'INCOME' | 'EXPENSE'; description: string; amount: number;
  category?: string; status: 'DRAFT' | 'SENT' | 'PAID' | 'DONE'; projectId?: string | null; createdAt: string;
};
export type Project = {
  id: string; title: string; clientEmail: string; phase: string; deliverables: { name: string; done: boolean; approval?: 'APPROVED' | 'REVISI'; approvalNote?: string; approvalBy?: string; approvalAt?: string }[];
  budget?: number | null; deadline?: string | null; memberEmails?: string[]; createdAt: string;
};

type ApiOptions = { method?: string; body?: unknown };

async function api<T>(path: string, { method = 'GET', body }: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || `HTTP ${res.status}`);
  return data as T;
}

export const auth = {
  register: (p: { email: string; password: string; name?: string; invite?: string }) =>
    api<{ token: string; user: PublicUser; firstAccount: boolean }>('/api/auth/register', { method: 'POST', body: p }),
  login: (p: { email: string; password: string }) =>
    api<{ token: string; user: PublicUser }>('/api/auth/login', { method: 'POST', body: p }),
  logout: () => api<{ ok: boolean }>('/api/auth/logout', { method: 'POST' }),
  me: () => api<{ user: PublicUser }>('/api/auth/me'),
};

export const leads = {
  list: () => api<{ leads: unknown[] }>('/api/leads'),
  remove: (id: string) => api<{ ok: boolean }>(`/api/leads/${id}`, { method: 'DELETE' }),
  create: (p: { name: string; contact: string; message?: string }) =>
    api<{ lead: unknown }>('/api/leads', { method: 'POST', body: p }),
};

export const projects = {
  list: () => api<{ projects: Project[] }>('/api/projects'),
  create: (p: { title: string; clientEmail: string; deliverables?: string[]; budget?: number; deadline?: string; memberEmails?: string[] }) =>
    api<{ project: Project }>('/api/projects', { method: 'POST', body: p }),
  update: (id: string, p: Record<string, unknown>) =>
    api<{ project: Project }>(`/api/projects/${id}`, { method: 'PATCH', body: p }),
};

export const users = {
  list: () => api<{ users: PublicUser[] }>('/api/users'),
  create: (p: { email: string; password: string; name?: string; role: string }) =>
    api<{ user: PublicUser }>('/api/users', { method: 'POST', body: p }),
  invite: (role: 'client' | 'admin') =>
    api<{ invite: { code: string; role: string } }>('/api/invites', { method: 'POST', body: { role } }),
};

export const team = {
  list: () => api<{ users: PublicUser[] }>('/api/team'),
  update: (id: string, p: { title?: string; status?: string; capacityHours?: number }) =>
    api<{ user: PublicUser }>(`/api/team/${id}`, { method: 'PATCH', body: p }),
};

export const chat = {
  channels: () => api<{ channels: Channel[] }>('/api/channels'),
  messages: (channelId: string) => api<{ messages: Message[] }>(`/api/channels/${channelId}/messages`),
  send: (channelId: string, text: string) =>
    api<{ message: Message }>(`/api/channels/${channelId}/messages`, { method: 'POST', body: { text } }),
};

export const finance = {
  list: () => api<{ transactions: Transaction[]; summary: { income: number; expense: number; net: number } }>('/api/finance'),
  create: (p: { type: 'INCOME' | 'EXPENSE'; description: string; amount: number; category?: string; projectId?: string }) =>
    api<{ transaction: Transaction }>('/api/finance', { method: 'POST', body: p }),
};

export const settings = {
  telegram: () => api<{ configured: boolean; chatId: string }>('/api/settings/telegram'),
  telegramSetup: (botToken: string, chatId: string) =>
    api<{ ok: boolean; bot: string }>('/api/settings/telegram', { method: 'POST', body: { botToken, chatId } }),
  telegramRemove: () => api<{ ok: boolean }>('/api/settings/telegram', { method: 'DELETE' }),
};

export const account = {
  changePassword: (current: string, next: string) =>
    api<{ ok: boolean }>('/api/auth/change-password', { method: 'POST', body: { current, next } }),
};

export const approvals = {
  decide: (projectId: string, index: number, decision: 'APPROVED' | 'REVISI', note?: string) =>
    api<{ project: Project }>(`/api/projects/${projectId}/deliverables/${index}/approval`, { method: 'POST', body: { decision, note } }),
};

// ---- gateway (DGTLZ PayGate over BuatQris) ----
export type GatewayTxn = {
  id: string; dgtlzTrxId: string; bqTrxId: string; amount: number; totalAmount?: number; adminFee?: number;
  description: string; invoiceId?: string | null; projectId?: string | null;
  status: 'PENDING' | 'SUCCESS' | 'EXPIRED' | 'FAILED'; method?: string; createdAt: string; resolvedAt?: string;
};
export type GatewaySummary = { count: number; success: number; pending: number; volume: number; fees: number };
export const gateway = {
  config: () => api<{ configured: boolean; merchantName: string; hasSigningSecret: boolean }>('/api/gateway/config'),
  saveConfig: (p: { accountId: string; secretToken: string; merchantName?: string; signingSecret?: string }) =>
    api<{ ok: boolean }>('/api/gateway/config', { method: 'POST', body: p }),
  clearConfig: () => api<{ ok: boolean }>('/api/gateway/config', { method: 'DELETE' }),
  txns: () => api<{ transactions: GatewayTxn[]; summary: GatewaySummary }>('/api/gateway/transactions'),
  createQris: (p: { amount: number; description?: string; invoiceId?: string; projectId?: string }) =>
    api<{ transaction: GatewayTxn; qrImage?: string | null; qrUrl?: string | null; paymentUrl?: string | null }>('/api/gateway/qris', { method: 'POST', body: p }),
  check: (id: string) => api<{ transaction: GatewayTxn }>(`/api/gateway/${id}/check`, { method: 'POST' }),
};

// ---- site ops (page control + traffic) ----
export type SitePageState = { status: 'LIVE' | 'MAINTENANCE'; nav: boolean };
export type SiteConfig = { pages: Record<string, SitePageState>; updatedAt: string | null };
export type TrafficSummary = {
  summary: { views24: number; sessions24: number; devices: Record<string, number>; total: number };
  pages: Array<{ path: string; day: number; week: number; all: number }>;
  recent: Array<{ path: string; sid: string; ref: string; device: string; ts: string }>;
  funnel: { home: number; login: number; register: number };
};

export const siteOps = {
  config: () => api<{ site: SiteConfig }>('/api/site/config'),
  saveConfig: (pages: Record<string, Partial<SitePageState>>) =>
    api<{ site: SiteConfig }>('/api/site/config', { method: 'PATCH', body: { pages } }),
  traffic: () => api<TrafficSummary>('/api/analytics/summary'),
  track: (p: { path: string; sid: string; ref?: string; device?: string }) =>
    api<{ ok: boolean }>('/api/analytics/pageview', { method: 'POST', body: p }),
};

// ---- gallery: kurasi karya (CRUD dari SITE OPS) ----
export type GalleryItem = { id: string; title: string; image: string; story?: string };
export const galleryApi = {
  list: () => api<{ items: GalleryItem[] }>('/api/gallery'),
  create: (p: { id: string; title: string; image: string; story?: string }) =>
    api<{ ok: boolean; item: GalleryItem }>('/api/gallery', { method: 'POST', body: p }),
  update: (id: string, p: { title?: string; story?: string; image?: string }) =>
    api<{ ok: boolean; item: GalleryItem }>(`/api/gallery/${id}`, { method: 'PATCH', body: p }),
  remove: (id: string) => api<{ ok: boolean }>(`/api/gallery/${id}`, { method: 'DELETE' }),
  upload: (dataUrl: string) =>
    api<{ ok: boolean; url: string }>('/api/gallery/upload', { method: 'POST', body: { dataUrl } }),
};

// ---- events: jadwal publik (CRUD dari SITE OPS) ----
export type EventItem = {
  id: string;
  date: string;
  title: string;
  location: string;
  status: 'OPEN' | 'CLOSED' | 'INVITE ONLY';
  description: string;
};
export const eventsApi = {
  list: () => api<{ items: EventItem[] }>('/api/events'),
  create: (p: { id?: string; date: string; title: string; location?: string; status?: string; description?: string }) =>
    api<{ ok: boolean; item: EventItem }>('/api/events', { method: 'POST', body: p }),
  update: (id: string, p: { date?: string; title?: string; location?: string; status?: string; description?: string }) =>
    api<{ ok: boolean; item: EventItem }>(`/api/events/${id}`, { method: 'PATCH', body: p }),
  remove: (id: string) => api<{ ok: boolean }>(`/api/events/${id}`, { method: 'DELETE' }),
};

export async function submitLead(p: { name: string; contact: string; message?: string }) {
  return api<{ lead: unknown }>('/api/leads', { method: 'POST', body: p });
}
