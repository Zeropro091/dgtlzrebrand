// Command Deck panels: CHAT, TEAM, FINANCE, SETTINGS, GATEWAY (DGTLZ PayGate over BuatQris).
// Zero Emoji Policy, Clean Lucide Vector Glyphs, Fast Tactical Console Layout.

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
  MessageSquare,
  Send,
  Hash,
  Lock,
  Users,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  Plus,
  ShieldCheck,
  KeyRound,
  ExternalLink,
  Bot,
  Trash2
} from 'lucide-react';
import {
  chat, team as teamApi, finance as financeApi, settings, account, gateway, projects as projectsApi,
  type Channel, type Message, type PublicUser, type Transaction, type Project,
  type GatewayTxn, type GatewaySummary,
} from '../lib/deckApi';

// ---------- Shared Console Frame ----------
function Panel({
  title,
  subtitle,
  icon: Icon,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: typeof MessageSquare;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="border-2 border-neutral-900 bg-white">
      <div className="bg-[#F4F3EF] border-b-2 border-neutral-900 px-4 py-2.5 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-electric-blue" />}
          <div>
            <h2 className="font-mono text-xs font-black tracking-widest text-neutral-900 uppercase leading-none">
              {title}
            </h2>
            {subtitle && (
              <p className="font-mono text-[10px] text-neutral-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="p-4 md:p-6">{children}</div>
    </section>
  );
}

// -------------------------------------------------------------
// 1. CHAT PANEL: Fast Tactical Real-Time Channel & Comms Console
// -------------------------------------------------------------
export function ChatPanel({ me, projects }: { me: PublicUser; projects: Project[] }) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadChannels = async () => {
    try {
      const r = await chat.channels();
      setChannels(r.channels);
      if (!activeChannelId && r.channels.length > 0) {
        setActiveChannelId(r.channels[0].id);
      }
    } catch {
      // fallback
    }
  };

  const loadMessages = async (cId: string) => {
    if (!cId) return;
    try {
      const r = await chat.messages(cId);
      setMessages(r.messages);
      setTimeout(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 50);
    } catch {
      // ignore
    }
  };

  useEffect(() => { loadChannels(); }, []);

  useEffect(() => {
    if (!activeChannelId) return;
    loadMessages(activeChannelId);
    const interval = setInterval(() => loadMessages(activeChannelId), 4000);
    return () => clearInterval(interval);
  }, [activeChannelId]);

  async function send(e: FormEvent) {
    e.preventDefault();
    if (!text.trim() || !activeChannelId || sending) return;
    setSending(true);
    try {
      await chat.send(activeChannelId, text.trim());
      setText('');
      await loadMessages(activeChannelId);
    } finally {
      setSending(false);
    }
  }

  const activeChannel = channels.find((c) => c.id === activeChannelId);

  return (
    <Panel
      title="TACTICAL COMMS // REAL-TIME CHANNEL"
      subtitle="Encrypted team broadcasts, operational alerts, and project discussion streams."
      icon={MessageSquare}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 border-2 border-neutral-900 min-h-[420px]">
          {/* Channel Selector Sidebar */}
          <div className="md:col-span-4 border-b-2 md:border-b-0 md:border-r-2 border-neutral-900 bg-[#F4F3EF] flex flex-col justify-between">
            <div className="p-2 space-y-1">
              <div className="px-2 py-1 font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                ACTIVE CHANNELS [{channels.length}]
              </div>
              {channels.map((c) => {
                const isSelected = c.id === activeChannelId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveChannelId(c.id)}
                    className={`w-full text-left px-3 py-2 font-mono text-xs flex items-center justify-between border transition-all ${
                      isSelected
                        ? 'bg-electric-blue text-white border-electric-blue font-bold shadow-xs'
                        : 'border-transparent text-neutral-700 hover:bg-white hover:text-neutral-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {c.kind?.toLowerCase() === 'staff' ? (
                        <Lock className={`w-3 h-3 flex-shrink-0 ${isSelected ? 'text-white' : 'text-neutral-500'}`} />
                      ) : (
                        <Hash className={`w-3 h-3 flex-shrink-0 ${isSelected ? 'text-white' : 'text-neutral-500'}`} />
                      )}
                      <span className="truncate">{c.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 border-t border-neutral-300 font-mono text-[10px] text-neutral-500 bg-white/50">
              <span>CONNECTED AS: </span>
              <span className="font-bold text-neutral-900">{me.email}</span>
            </div>
          </div>

          {/* Messages Stream Viewport */}
          <div className="md:col-span-8 flex flex-col justify-between bg-white">
            <div className="border-b border-neutral-200 px-4 py-2 font-mono text-xs flex justify-between items-center bg-neutral-50">
              <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-electric-blue" />
                {activeChannel?.name || 'SELECT CHANNEL'}
              </span>
              <span className="text-[10px] text-neutral-400">STREAM INTERVAL: 4.0s</span>
            </div>

            <div ref={scrollRef} className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[350px] font-mono text-xs">
              {messages.length === 0 ? (
                <div className="text-center text-neutral-400 py-12 text-[11px] tracking-wider">
                  NO DISPATCHES IN THIS CHANNEL. INITIATE TRANSMISSION BELOW.
                </div>
              ) : (
                messages.map((m) => {
                  const isMe = m.userId === me.id || m.userName === me.name;
                  return (
                    <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400 mb-0.5">
                        <span className="font-bold text-neutral-700">{m.userName || 'Anonymous'}</span>
                        <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div
                        className={`p-2.5 max-w-[85%] border leading-relaxed text-xs ${
                          isMe
                            ? 'bg-electric-blue text-white border-electric-blue'
                            : 'bg-[#F4F3EF] text-neutral-900 border-neutral-300'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={send} className="border-t-2 border-neutral-900 p-2 flex gap-2 bg-[#F4F3EF]">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="TRANSMIT MESSAGE INTO STREAM..."
                className="flex-1 border-2 border-neutral-900 p-2 font-mono text-xs bg-white outline-none focus:border-electric-blue"
              />
              <button
                type="submit"
                disabled={sending || !text.trim()}
                className="bg-neutral-900 text-white font-mono text-xs font-bold px-4 hover:bg-electric-blue disabled:opacity-40 transition-colors flex items-center gap-1.5"
              >
                <span>SEND</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </Panel>
  );
}

// -------------------------------------------------------------
// 2. TEAM PANEL: Squad Workload & Capacity Management
// -------------------------------------------------------------
export function TeamPanel({ me, projects, onMutate }: { me: PublicUser; projects: Project[]; onMutate: () => void }) {
  const [members, setMembers] = useState<PublicUser[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [busy, setBusy] = useState(false);

  const loadTeam = () => {
    teamApi.list().then((r) => setMembers(r.users)).catch(() => {});
  };

  useEffect(() => { loadTeam(); }, []);

  async function assign(e: FormEvent) {
    e.preventDefault();
    if (!selectedUser || !selectedProject) return;
    setBusy(true);
    try {
      const proj = projects.find((p) => p.id === selectedProject);
      if (proj) {
        const currentMembers = proj.memberEmails || [];
        if (!currentMembers.includes(selectedUser)) {
          // Add user to project's member list
          await projectsApi.update(selectedProject, {
            memberEmails: [...currentMembers, selectedUser]
          });
        }
      }
      setSelectedUser('');
      setSelectedProject('');
      onMutate();
      loadTeam();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel
      title="SQUAD CAPACITY // CREW DISPATCH"
      subtitle="Member allocation, project load factoring, and team availability."
      icon={Users}
    >
      <div className="space-y-6">
        {/* Assignment Action Bar */}
        <form onSubmit={assign} className="border-2 border-neutral-900 bg-[#F4F3EF] p-4 flex flex-wrap gap-3 items-end">
          <label className="block flex-1 min-w-[200px] font-mono text-xs">
            <span className="font-bold text-neutral-600 block mb-1 uppercase text-[10px]">CREW OPERATOR:</span>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full border-2 border-neutral-900 p-2 bg-white outline-none font-mono text-xs"
              required
            >
              <option value="">-- SELECT MEMBER --</option>
              {members.map((m) => (
                <option key={m.id} value={m.email}>
                  {m.name || m.email} [{m.role.toUpperCase()}]
                </option>
              ))}
            </select>
          </label>

          <label className="block flex-1 min-w-[200px] font-mono text-xs">
            <span className="font-bold text-neutral-600 block mb-1 uppercase text-[10px]">TARGET CONTRACT:</span>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full border-2 border-neutral-900 p-2 bg-white outline-none font-mono text-xs"
              required
            >
              <option value="">-- SELECT PROJECT --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.phase})
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={busy || !selectedUser || !selectedProject}
            className="border-2 border-neutral-900 bg-neutral-900 text-white font-mono text-xs font-bold px-5 py-2.5 hover:bg-electric-blue hover:border-electric-blue disabled:opacity-40 transition-colors"
          >
            DISPATCH TO PROJECT
          </button>
        </form>

        {/* Squad Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m) => {
            const assignedProjects = projects.filter((p) => (p.memberEmails || []).includes(m.email));
            return (
              <div key={m.id} className="border-2 border-neutral-900 bg-white p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-mono font-bold text-sm text-neutral-900">{m.name || m.email.split('@')[0]}</h3>
                    <span className="font-mono text-[10px] text-neutral-500 block">{m.email}</span>
                  </div>
                  <span className="font-mono text-[9px] font-bold px-2 py-0.5 border border-neutral-900 bg-[#F4F3EF] uppercase">
                    {m.role}
                  </span>
                </div>

                <div className="border-t border-neutral-200 pt-3 font-mono text-xs space-y-1.5">
                  <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                    ASSIGNED DEPLOYMENTS ({assignedProjects.length})
                  </div>
                  {assignedProjects.length === 0 ? (
                    <div className="text-[11px] text-neutral-400 italic">STANDBY / UNALLOCATED</div>
                  ) : (
                    <ul className="space-y-1">
                      {assignedProjects.map((ap) => (
                        <li key={ap.id} className="text-[11px] text-electric-blue font-bold flex items-center gap-1">
                          <span>•</span>
                          <span className="truncate">{ap.title}</span>
                          <span className="text-[9px] text-neutral-400 font-normal">({ap.phase})</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}

// -------------------------------------------------------------
// 3. FINANCE PANEL: Financial Ledger & Cash Flow Telemetry
// -------------------------------------------------------------
export function FinancePanel({ projects }: { projects: Project[] }) {
  const [data, setData] = useState<{
    transactions: Transaction[];
    summary: { income: number; expense: number; net: number };
  } | null>(null);

  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('');
  const [projectId, setProjectId] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => {
    financeApi.list().then(setData).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  async function addTxn(e: FormEvent) {
    e.preventDefault();
    if (!amount || !desc) return;
    setBusy(true);
    try {
      await financeApi.create({
        type,
        amount: Number(amount),
        description: desc,
        category: category || undefined,
        projectId: projectId || undefined,
      });
      setAmount('');
      setDesc('');
      setCategory('');
      setProjectId('');
      load();
    } finally {
      setBusy(false);
    }
  }

  const rp = (n: number) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');

  return (
    <Panel
      title="FINANCIAL LEDGER // CASH FLOW CORE"
      subtitle="Real-time revenue recognition, expense tracking, and contract profit margins."
      icon={Wallet}
    >
      <div className="space-y-6">
        {/* Vital Signs Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-2 border-neutral-900 bg-emerald-50 p-4 border-l-4 border-l-emerald-600">
            <span className="font-mono text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowDownLeft className="w-3.5 h-3.5" />
              TOTAL REVENUE (INFLOW)
            </span>
            <div className="mt-2 font-mono text-2xl font-black text-emerald-900">
              {rp(data?.summary.income || 0)}
            </div>
          </div>

          <div className="border-2 border-neutral-900 bg-red-50 p-4 border-l-4 border-l-red-600">
            <span className="font-mono text-[10px] font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              TOTAL EXPENSE (OUTFLOW)
            </span>
            <div className="mt-2 font-mono text-2xl font-black text-red-900">
              {rp(data?.summary.expense || 0)}
            </div>
          </div>

          <div className="border-2 border-neutral-900 bg-white p-4 border-l-4 border-l-electric-blue">
            <span className="font-mono text-[10px] font-bold text-neutral-600 uppercase tracking-wider flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-electric-blue" />
              NET CASH POSITION
            </span>
            <div className={`mt-2 font-mono text-2xl font-black ${(data?.summary.net || 0) >= 0 ? 'text-electric-blue' : 'text-red-600'}`}>
              {rp(data?.summary.net || 0)}
            </div>
          </div>
        </div>

        {/* Transaction Dispatcher Form */}
        <form onSubmit={addTxn} className="border-2 border-neutral-900 bg-[#F4F3EF] p-4 space-y-3">
          <div className="font-mono text-xs font-bold text-neutral-900 uppercase">
            LOG NEW FINANCIAL ENTRY
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <label className="block font-mono text-xs">
              <span className="text-[10px] font-bold text-neutral-600 block mb-1">TYPE:</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'INCOME' | 'EXPENSE')}
                className="w-full border-2 border-neutral-900 p-2 bg-white outline-none font-mono text-xs font-bold"
              >
                <option value="INCOME">INCOME (+)</option>
                <option value="EXPENSE">EXPENSE (-)</option>
              </select>
            </label>

            <label className="block font-mono text-xs">
              <span className="text-[10px] font-bold text-neutral-600 block mb-1">AMOUNT [IDR]:</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="5000000"
                className="w-full border-2 border-neutral-900 p-2 bg-white outline-none font-mono text-xs"
                required
              />
            </label>

            <label className="block font-mono text-xs">
              <span className="text-[10px] font-bold text-neutral-600 block mb-1">DESCRIPTION:</span>
              <input
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Down Payment Phase 1"
                className="w-full border-2 border-neutral-900 p-2 bg-white outline-none font-mono text-xs"
                required
              />
            </label>

            <label className="block font-mono text-xs">
              <span className="text-[10px] font-bold text-neutral-600 block mb-1">CATEGORY:</span>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Client Retainer"
                className="w-full border-2 border-neutral-900 p-2 bg-white outline-none font-mono text-xs"
              />
            </label>

            <label className="block font-mono text-xs">
              <span className="text-[10px] font-bold text-neutral-600 block mb-1">CONTRACT LINK:</span>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full border-2 border-neutral-900 p-2 bg-white outline-none font-mono text-xs"
              >
                <option value="">-- UNLINKED --</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={busy || !amount || !desc}
              className="border-2 border-neutral-900 bg-neutral-900 text-white font-mono text-xs font-bold px-6 py-2 hover:bg-electric-blue hover:border-electric-blue transition-colors disabled:opacity-40"
            >
              RECORD TRANSACTION
            </button>
          </div>
        </form>

        {/* Transaction Table */}
        <div className="border-2 border-neutral-900 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead className="bg-[#F4F3EF] border-b-2 border-neutral-900 text-[10px] font-black uppercase text-neutral-700">
              <tr>
                <th className="p-3">DATE</th>
                <th className="p-3">TYPE</th>
                <th className="p-3">DESCRIPTION</th>
                <th className="p-3">CATEGORY</th>
                <th className="p-3 text-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {(data?.transactions || []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-400">
                    NO TRANSACTIONS LOGGED IN LEDGER.
                  </td>
                </tr>
              ) : (
                data!.transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-3 text-neutral-500 whitespace-nowrap">
                      {new Date(t.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-[9px] font-bold border uppercase ${
                        t.type === 'INCOME'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                          : 'bg-red-100 text-red-800 border-red-400'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-neutral-900">{t.description}</td>
                    <td className="p-3 text-neutral-500">{t.category || '-'}</td>
                    <td className={`p-3 text-right font-bold whitespace-nowrap ${t.type === 'INCOME' ? 'text-emerald-700' : 'text-red-600'}`}>
                      {t.type === 'INCOME' ? '+' : '-'}{rp(t.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Panel>
  );
}

// -------------------------------------------------------------
// 4. GATEWAY PANEL: DGTLZ PayGate QRIS Core Dashboard
// -------------------------------------------------------------
export function GatewayPanel() {
  const [data, setData] = useState<{ transactions: GatewayTxn[]; summary: GatewaySummary } | null>(null);
  const [cfg, setCfg] = useState<{ accountId: string; merchantName: string; hasSigningSecret: boolean } | null>(null);
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [busy, setBusy] = useState(false);
  const [qrModal, setQrModal] = useState<{ image: string; url: string; pay?: string; amount: number } | null>(null);

  const load = () => {
    gateway.txns().then(setData).catch(() => {});
    gateway.config().then((r) => {
      setCfg(r.configured ? { accountId: 'CONFIGURED', merchantName: r.merchantName, hasSigningSecret: r.hasSigningSecret } : null);
    }).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  async function createQris(e: FormEvent) {
    e.preventDefault();
    if (!amount) return;
    setBusy(true);
    try {
      const r = await gateway.createQris({
        amount: Number(amount),
        description: desc || undefined,
      });
      setAmount('');
      setDesc('');
      setQrModal({
        image: r.qrImage,
        url: r.qrUrl,
        pay: r.paymentUrl,
        amount: r.transaction.totalAmount || r.transaction.amount,
      });
      load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'FAILED TO GENERATE QRIS');
    } finally {
      setBusy(false);
    }
  }

  const rp = (n: number) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');

  return (
    <Panel
      title="PAYGATE CORE // INSTANT QRIS SETTLEMENT"
      subtitle="White-label dynamic QRIS generator, merchant routing, and webhook telemetry."
      icon={QrCode}
    >
      <div className="space-y-6">
        {/* Gateway Telemetry Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
          <div className="border-2 border-neutral-900 bg-white p-3">
            <span className="text-[10px] text-neutral-500 font-bold block uppercase">TOTAL TRANSACTIONS</span>
            <div className="text-2xl font-black text-neutral-900 mt-1">{data?.summary.totalCount || 0}</div>
          </div>
          <div className="border-2 border-neutral-900 bg-emerald-50 p-3 border-l-4 border-l-emerald-600">
            <span className="text-[10px] text-emerald-800 font-bold block uppercase">SETTLED (SUCCESS)</span>
            <div className="text-2xl font-black text-emerald-900 mt-1">{data?.summary.successCount || 0}</div>
          </div>
          <div className="border-2 border-neutral-900 bg-amber-50 p-3 border-l-4 border-l-amber-500">
            <span className="text-[10px] text-amber-800 font-bold block uppercase">PENDING SCAN</span>
            <div className="text-2xl font-black text-amber-900 mt-1">{data?.summary.pendingCount || 0}</div>
          </div>
          <div className="border-2 border-neutral-900 bg-white p-3 border-l-4 border-l-electric-blue">
            <span className="text-[10px] text-neutral-500 font-bold block uppercase">SETTLED VOLUME</span>
            <div className="text-2xl font-black text-electric-blue mt-1">{rp(data?.summary.successVolume || 0)}</div>
          </div>
        </div>

        {/* Dynamic QRIS Generation Console */}
        <form onSubmit={createQris} className="border-2 border-neutral-900 bg-[#F4F3EF] p-4 space-y-3">
          <div className="font-mono text-xs font-bold text-neutral-900 uppercase flex items-center justify-between">
            <span>GENERATE DYNAMIC QRIS (ON-DEMAND)</span>
            <span className="text-[10px] text-neutral-500">MERCHANT: {cfg?.merchantName || 'DGTLZ'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block font-mono text-xs">
              <span className="text-[10px] font-bold text-neutral-600 block mb-1">NOMINAL (RP 1.000 - 5.000.000):</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1500000"
                className="w-full border-2 border-neutral-900 p-2 bg-white outline-none font-mono text-xs"
                required
              />
            </label>

            <label className="block font-mono text-xs">
              <span className="text-[10px] font-bold text-neutral-600 block mb-1">TRANSACTION DIRECTIVE / DESCRIPTION:</span>
              <input
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="DP Web App Contract Client X"
                className="w-full border-2 border-neutral-900 p-2 bg-white outline-none font-mono text-xs"
              />
            </label>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={busy || !amount}
              className="border-2 border-neutral-900 bg-electric-blue text-white font-mono text-xs font-bold px-6 py-2.5 hover:bg-neutral-900 hover:border-neutral-900 transition-colors disabled:opacity-40 flex items-center gap-2"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{busy ? 'PROCESSING...' : 'GENERATE QRIS CODE'}</span>
            </button>
          </div>
        </form>

        {/* QR Display Modal / Card */}
        {qrModal && (
          <div className="border-2 border-neutral-900 bg-white p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm border-l-4 border-l-electric-blue">
            <div className="p-2 border-2 border-neutral-900 bg-white">
              <img src={qrModal.image} alt="Dynamic QRIS" className="w-48 h-48 object-contain" />
            </div>
            <div className="space-y-3 font-mono text-xs flex-1">
              <div className="bg-neutral-900 text-white px-3 py-1 text-[10px] font-bold tracking-widest inline-block">
                QRIS GENERATED SUCCESSFULLY
              </div>
              <div className="text-xl font-black text-neutral-900">
                TOTAL: {rp(qrModal.amount)}
              </div>
              <p className="text-neutral-500 text-xs">
                Scan via any Indonesian banking app or e-wallet (BCA, Mandiri, BRI, GoPay, OVO, ShopeePay).
              </p>
              <div className="flex gap-2 pt-2">
                <a
                  href={qrModal.pay || qrModal.url}
                  target="_blank"
                  rel="noreferrer"
                  className="border-2 border-neutral-900 bg-neutral-900 text-white px-4 py-1.5 font-bold hover:bg-electric-blue transition-colors flex items-center gap-1.5 text-xs"
                >
                  <span>PAYMENT LINK</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => setQrModal(null)}
                  className="border-2 border-neutral-900 px-4 py-1.5 font-bold hover:bg-neutral-100 text-xs"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Ledger */}
        <div className="border-2 border-neutral-900 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead className="bg-[#F4F3EF] border-b-2 border-neutral-900 text-[10px] font-black uppercase text-neutral-700">
              <tr>
                <th className="p-3">TRX ID</th>
                <th className="p-3">TIME</th>
                <th className="p-3">DESCRIPTION</th>
                <th className="p-3 text-right">AMOUNT</th>
                <th className="p-3 text-center">STATUS</th>
                <th className="p-3 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {(data?.transactions || []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400">
                    NO GATEWAY TRANSACTIONS RECORDED.
                  </td>
                </tr>
              ) : (
                data!.transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-3 font-bold text-neutral-900">ID_{t.id.slice(0, 8)}</td>
                    <td className="p-3 text-neutral-500 whitespace-nowrap">
                      {new Date(t.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3">{t.description || '-'}</td>
                    <td className="p-3 text-right font-bold text-neutral-900">{rp(t.amount)}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 text-[9px] font-bold border uppercase ${
                        t.status === 'SUCCESS'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                          : t.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800 border-amber-400'
                          : 'bg-neutral-100 text-neutral-700 border-neutral-300'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {t.status === 'PENDING' && (
                        <button
                          onClick={async () => {
                            try {
                              await gateway.check(t.id);
                              load();
                            } catch (e: unknown) {
                              alert(e instanceof Error ? e.message : 'FAILED');
                            }
                          }}
                          className="border border-neutral-900 px-2 py-0.5 bg-white hover:bg-neutral-900 hover:text-white transition-colors text-[10px] font-bold"
                        >
                          SYNC STATUS
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Panel>
  );
}

// -------------------------------------------------------------
// 5. SETTINGS PANEL: Security & Telegram Dispatch Integration
// -------------------------------------------------------------
export function SettingsPanel({ me }: { me: PublicUser }) {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');

  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [tgMsg, setTgMsg] = useState('');
  const [tgConfigured, setTgConfigured] = useState(false);

  useEffect(() => {
    if (me.role === 'owner') {
      settings.telegram().then((r) => {
        setTgConfigured(r.configured);
        if (r.chatId) setChatId(r.chatId);
      }).catch(() => {});
    }
  }, [me]);

  async function updatePassword(e: FormEvent) {
    e.preventDefault();
    setPwMsg('');
    setPwErr('');
    if (newPw !== confirmPw) {
      setPwErr('NEW PASSWORD CONFIRMATION DOES NOT MATCH');
      return;
    }
    try {
      await account.changePassword(currentPw, newPw);
      setPwMsg('PASSWORD UPDATED SUCCESSFULLY');
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    } catch (err: unknown) {
      setPwErr(err instanceof Error ? err.message : 'FAILED TO CHANGE PASSWORD');
    }
  }

  async function saveTelegram(e: FormEvent) {
    e.preventDefault();
    setTgMsg('');
    try {
      await settings.telegramSetup(botToken, chatId);
      setTgMsg('TELEGRAM INTEGRATION VERIFIED & SAVED');
      setTgConfigured(true);
      setBotToken('');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'FAILED TO CONFIGURE TELEGRAM');
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Account Security */}
      <Panel
        title="SECURITY CREDENTIALS"
        subtitle="Identity protection, password rotation, and session authorization."
        icon={KeyRound}
      >
        <form onSubmit={updatePassword} className="space-y-4 font-mono">
          {pwMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{pwMsg}</span>
            </div>
          )}
          {pwErr && (
            <div className="p-3 bg-red-50 text-red-800 border border-red-400 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{pwErr}</span>
            </div>
          )}

          <label className="block text-xs space-y-1">
            <span className="font-bold text-neutral-600 block uppercase text-[10px]">CURRENT PASSWORD:</span>
            <input
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              className="w-full border-2 border-neutral-900 p-2 bg-[#F4F3EF] focus:bg-white outline-none"
              required
            />
          </label>

          <label className="block text-xs space-y-1">
            <span className="font-bold text-neutral-600 block uppercase text-[10px]">NEW PASSWORD (MIN 8 CHARS):</span>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              className="w-full border-2 border-neutral-900 p-2 bg-[#F4F3EF] focus:bg-white outline-none"
              required
            />
          </label>

          <label className="block text-xs space-y-1">
            <span className="font-bold text-neutral-600 block uppercase text-[10px]">CONFIRM NEW PASSWORD:</span>
            <input
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              className="w-full border-2 border-neutral-900 p-2 bg-[#F4F3EF] focus:bg-white outline-none"
              required
            />
          </label>

          <button
            type="submit"
            className="w-full border-2 border-neutral-900 bg-neutral-900 text-white font-mono text-xs font-bold py-2.5 hover:bg-electric-blue hover:border-electric-blue transition-colors"
          >
            UPDATE CREDENTIALS
          </button>
        </form>
      </Panel>

      {/* Telegram Dispatch Bot */}
      {me.role === 'owner' && (
        <Panel
          title="TELEGRAM TELEMETRY DISPATCH"
          subtitle="Real-time alert relay for inbound leads, approvals, and daily briefs."
          icon={Bot}
        >
          <form onSubmit={saveTelegram} className="space-y-4 font-mono">
            {tgMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{tgMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
              <span className="text-xs text-neutral-500">INTEGRATION STATUS:</span>
              <span className={`px-2 py-0.5 text-[9px] font-bold border uppercase ${
                tgConfigured
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                  : 'bg-neutral-100 text-neutral-600 border-neutral-300'
              }`}>
                {tgConfigured ? 'ACTIVE RELAY' : 'STANDBY'}
              </span>
            </div>

            <label className="block text-xs space-y-1">
              <span className="font-bold text-neutral-600 block uppercase text-[10px]">BOT API TOKEN:</span>
              <input
                type="password"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="7123456789:AAH..."
                className="w-full border-2 border-neutral-900 p-2 bg-[#F4F3EF] focus:bg-white outline-none"
                required={!tgConfigured}
              />
            </label>

            <label className="block text-xs space-y-1">
              <span className="font-bold text-neutral-600 block uppercase text-[10px]">RECIPIENT CHAT ID:</span>
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="-1001234567890"
                className="w-full border-2 border-neutral-900 p-2 bg-[#F4F3EF] focus:bg-white outline-none"
                required
              />
            </label>

            <button
              type="submit"
              className="w-full border-2 border-neutral-900 bg-electric-blue text-white font-mono text-xs font-bold py-2.5 hover:bg-neutral-900 hover:border-neutral-900 transition-colors"
            >
              SAVE TELEGRAM CONFIGURATION
            </button>
          </form>
        </Panel>
      )}
    </div>
  );
}
