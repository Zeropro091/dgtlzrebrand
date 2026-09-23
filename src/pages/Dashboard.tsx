import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  MessageSquare,
  Users,
  Wallet,
  QrCode,
  ShieldAlert,
  Settings,
  LogOut,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  Search,
  ExternalLink,
  Target,
  Sliders,
  Eye,
  EyeOff,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Send,
  UserCheck,
  Globe,
  Wrench,
  Activity,
  Image as ImageIcon,
  Pencil,
  Trash2,
} from 'lucide-react';
import {
  auth,
  leads as leadsApi,
  projects as projectsApi,
  users as usersApi,
  chat as chatApi,
  finance as financeApi,
  gateway as gatewayApi,
  type Channel,
  // Lead

  type Message,
  type Project,
  type PublicUser,
  type Transaction,
  type GatewayTxn,
  type GatewaySummary,
  siteOps,
  galleryApi,
  type GalleryItem,
  eventsApi,
  type EventItem,
} from '../lib/deckApi';
import { ChatPanel, FinancePanel, GatewayPanel, SettingsPanel, TeamPanel } from '../components/DeckPanels';
import { CrewToolsPanel } from '../components/CrewToolsPanel';

type Tab = 'OVERVIEW' | 'TASKS' | 'OPS' | 'CHAT' | 'TEAM' | 'FINANCE' | 'GATEWAY' | 'ADMIN' | 'SITEOPS' | 'CREW_TOOLS' | 'CLIENT' | 'SETTINGS';

// ---- TASK-FIRST HYBRID: task = deliverable yang diangkat jadi unit kerja mandiri ----
type TaskItem = {
  key: string;            // `${projectId}:${idx}`
  projectId: string;
  projectTitle: string;
  projectPhase: string;
  projectDeadline?: string | null;
  index: number;
  name: string;
  done: boolean;
  approval?: 'APPROVED' | 'REVISI';
  approvalNote?: string;
  priority: 'OVERDUE' | 'TODAY' | 'SOON' | 'HIGH' | 'NORMAL';
  category?: string;
  dueDate?: string;
  assignees: string[];
  isMine: boolean;
};

type TaskFilter = 'MINE' | 'ALL' | 'DONE';
type TaskSort = 'PRIORITY' | 'DEADLINE' | 'PROJECT';

const DAY_MS = 24 * 60 * 60 * 1000;

function dayDiff(dateStr?: string | null): number | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const today = new Date();
  const a = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const b = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((a.getTime() - b.getTime()) / DAY_MS);
}

function collectTasks(projects: Project[], meEmail?: string): TaskItem[] {
  const out: TaskItem[] = [];
  for (const p of projects) {
    const members = p.memberEmails || [];
    const isMember = !!meEmail && members.some((m) => m.toLowerCase() === meEmail.toLowerCase());
    (p.deliverables || []).forEach((raw, idx) => {
      const d = raw as DeckDeliverable;
      const done = !!d.done || d.approval === 'APPROVED';
      const dd = dayDiff(d.dueDate || p.deadline);
      let priority: TaskItem['priority'] = 'NORMAL';
      if (!done) {
        if (dd !== null && dd < 0) priority = 'OVERDUE';
        else if (dd === 0) priority = 'TODAY';
        else if (dd !== null && dd <= 3) priority = 'SOON';
        else if (getPriority(d) === 'HIGH') priority = 'HIGH';
      }
      out.push({
        key: `${p.id}:${idx}`,
        projectId: p.id,
        projectTitle: p.title,
        projectPhase: p.phase,
        projectDeadline: p.deadline || null,
        index: idx,
        name: d.name,
        done,
        approval: d.approval,
        approvalNote: d.approvalNote,
        priority,
        category: d.category,
        dueDate: d.dueDate,
        assignees: members,
        isMine: isMember || members.length === 0,
      });
    });
  }
  return out;
}

const PRIORITY_ORDER: Record<TaskItem['priority'], number> = { OVERDUE: 0, TODAY: 1, SOON: 2, HIGH: 3, NORMAL: 4 };

const TASK_PRIORITY_STYLES: Record<TaskItem['priority'], string> = {
  OVERDUE: 'bg-red-600 text-white border-red-700',
  TODAY: 'bg-amber-500 text-white border-amber-600',
  SOON: 'bg-amber-100 text-amber-800 border-amber-300',
  HIGH: 'bg-orange-100 text-orange-800 border-orange-300',
  NORMAL: 'bg-neutral-100 text-neutral-500 border-neutral-300',
};

type Lead = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  service?: string;
  budget?: string;
  notes?: string;
  createdAt: string;
};


// Isolated Live Clock to prevent root Dashboard re-rendering every second
function LiveClock() {
  const [timeStr, setTimeStr] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(
        d.toLocaleTimeString('id-ID', {
          timeZone: 'Asia/Makassar',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' WITA'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span>{timeStr || 'SYNCING TIME...'}</span>;
}

// ---- Priority & Category system (mirrors legacy task app) ----
type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
type DeliverableCategory = 'DEVELOPMENT' | 'DESIGN' | 'MARKETING' | 'ADMIN';

const PRIORITY_STYLES: Record<Priority, string> = {
  HIGH: 'bg-amber-100 text-amber-900 border-amber-400',
  MEDIUM: 'bg-blue-50 text-blue-900 border-blue-300',
  LOW: 'bg-neutral-100 text-neutral-600 border-neutral-300',
};

const CATEGORY_STYLES: Record<DeliverableCategory, string> = {
  DEVELOPMENT: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  DESIGN: 'bg-violet-50 text-violet-800 border-violet-300',
  MARKETING: 'bg-rose-50 text-rose-800 border-rose-300',
  ADMIN: 'bg-neutral-100 text-neutral-700 border-neutral-300',
};

const PRIORITY_LABEL: Record<Priority, string> = { HIGH: 'PRIORITAS TINGGI', MEDIUM: 'MEDIUM', LOW: 'LOW' };

type DeckDeliverable = {
  name: string; done: boolean;
  approval?: 'APPROVED' | 'REVISI'; approvalNote?: string; approvalBy?: string; approvalAt?: string;
  priority?: Priority; category?: DeliverableCategory; dueDate?: string;
};

const getPriority = (d: DeckDeliverable): Priority => d.priority || 'MEDIUM';
const isDueToday = (d: DeckDeliverable): boolean => {
  if (!d.dueDate || d.done || d.approval === 'APPROVED') return false;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const due = new Date(d.dueDate + 'T00:00:00'); due.setHours(0, 0, 0, 0);
  return due.getTime() <= today.getTime();
};

interface DeckConfig {
  defaultLanding: 'DECK' | 'TASKS';
  showToday: boolean;
  showTelemetry: boolean;
  showPipeline: boolean;
  showComms: boolean;
  showPaygate: boolean;
  showLeads: boolean;
  showTeam: boolean;
  density: 'compact' | 'standard';
  autoProgress: boolean;
}

const DEFAULT_CONFIG: DeckConfig = {
  defaultLanding: 'DECK',
  showToday: true,
  showTelemetry: true,
  showPipeline: true,
  showComms: true,
  showPaygate: true,
  showLeads: true,
  showTeam: true,
  density: 'standard',
  autoProgress: true,
};

export function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    try {
      const saved = localStorage.getItem('dgtlz_deck_config');
      const cfg = saved ? JSON.parse(saved) : null;
      return cfg?.defaultLanding === 'TASKS' ? 'TASKS' : 'OVERVIEW';
    } catch {
      return 'OVERVIEW';
    }
  });
  const [loading, setLoading] = useState(true);

  // Deck Config State
  const [deckConfig, setDeckConfig] = useState<DeckConfig>(() => {
    try {
      const saved = localStorage.getItem('dgtlz_deck_config');
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Operational Data State
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [allUsers, setAllUsers] = useState<PublicUser[] | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [recentMessages, setRecentMessages] = useState<Array<{ msg: Message; channelName: string }>>([]);
  const [finance, setFinance] = useState<{ transactions: Transaction[]; summary: { income: number; expense: number; net: number } } | null>(null);
  const [gateway, setGateway] = useState<{ transactions: GatewayTxn[]; summary: GatewaySummary } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [timeStr, setTimeStr] = useState('');

  const updateConfig = (patch: Partial<DeckConfig>) => {
    setDeckConfig((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem('dgtlz_deck_config', JSON.stringify(next));
      return next;
    });
  };

  const resetConfig = () => {
    setDeckConfig(DEFAULT_CONFIG);
    localStorage.setItem('dgtlz_deck_config', JSON.stringify(DEFAULT_CONFIG));
  };



  const loadData = useCallback(async () => {
    try {
      const u = await auth.me();
      setUser(u.user);

      const [projs, lds, fin, gtwy, chs] = await Promise.all([
        projectsApi.list().catch(() => null),
        u.user.role !== 'client' ? leadsApi.list().catch(() => null) : Promise.resolve(null),
        financeApi.list().catch(() => null),
        gatewayApi.txns().catch(() => null),
        chatApi.channels().catch(() => ({ channels: [] })),
      ]);

      if (projs) setProjects(projs.projects);
      if (lds) setLeads(lds.leads);
      if (fin) setFinance(fin);
      if (gtwy) setGateway(gtwy);

      if (chs && chs.channels) {
        setChannels(chs.channels);
        const msgsList: Array<{ msg: Message; channelName: string }> = [];
        for (const ch of chs.channels.slice(0, 3)) {
          try {
            const m = await chatApi.messages(ch.id);
            m.messages.slice(-2).forEach((msg) => {
              msgsList.push({ msg, channelName: ch.name });
            });
          } catch {
            // ignore
          }
        }
        setRecentMessages(msgsList.sort((a, b) => new Date(b.msg.createdAt).getTime() - new Date(a.msg.createdAt).getTime()));
      }

      if (u.user.role === 'owner' || u.user.role === 'admin') {
        const usr = await usersApi.list().catch(() => null);
        if (usr) setAllUsers(usr.users);
      }
    } catch {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#F4F3EF] flex flex-col items-center justify-center font-mono">
        <div className="flex items-center gap-2 text-xs font-black tracking-widest text-neutral-900 uppercase">
          <div className="w-2 h-2 rounded-full bg-electric-blue animate-ping" />
          <span>INITIALIZING COMMAND DECK...</span>
        </div>
      </div>
    );
  }

  // Navigation Items Definition
  const navItems: Array<{ id: Tab; label: string; icon: any; count?: number; hide?: boolean }> = [
    { id: 'OVERVIEW', label: 'MAIN DECK', icon: LayoutDashboard },
    { id: 'TASKS', label: 'MY TASKS', icon: CheckCircle2, count: (() => { const t = collectTasks(projects || [], user.email); return t.filter((x) => !x.done && x.isMine).length; })(), hide: user.role === 'client' },
    { id: 'OPS', label: 'PIPELINE', icon: Layers, count: (projects || []).filter((p) => p.phase !== 'LIVE').length },
    { id: 'CHAT', label: 'COMMS', icon: MessageSquare, count: recentMessages.length },
    { id: 'TEAM', label: 'SQUAD', icon: Users, hide: user.role === 'client' },
    { id: 'FINANCE', label: 'TREASURY', icon: Wallet, hide: user.role === 'client' },
    { id: 'GATEWAY', label: 'PAYGATE', icon: QrCode, count: gateway?.summary.pending || 0 },
    { id: 'CLIENT', label: 'PORTAL', icon: Target, hide: user.role !== 'client' },
    { id: 'ADMIN', label: 'LEADS & ACCESS', icon: ShieldAlert, count: (leads || []).filter((l) => l.status === 'NEW').length, hide: user.role === 'client' },
    { id: 'SITEOPS', label: 'SITE OPS', icon: Globe, hide: user.role === 'client' },
    { id: 'CREW_TOOLS', label: 'CREW TOOLS', icon: Wrench, hide: user.role === 'client' },
    { id: 'SETTINGS', label: 'CONFIG', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F4F3EF] text-neutral-900 flex flex-col font-mono selection:bg-electric-blue selection:text-white">
      {/* 1. TOP UTILITY TELEMETRY BAR */}
      <header className="border-b-2 border-neutral-900 bg-white sticky top-0 z-40">
        <div className="px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="bg-neutral-900 text-white px-2 py-0.5 text-xs font-black tracking-tighter group-hover:bg-electric-blue transition-colors">
                DGT.LZ
              </span>
              <span className="text-[11px] font-black tracking-widest text-neutral-900 hidden sm:inline">
                COMMAND DECK // v2.6
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-2 border-l border-neutral-300 pl-4 text-[10px] text-neutral-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>NODE_01 BALI</span>
              <span className="text-neutral-300">|</span>
              <span className="text-neutral-700 font-bold"><LiveClock /></span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search */}
            <div className="relative hidden md:block">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="DIRECTIVE SEARCH..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs border border-neutral-300 bg-neutral-50 focus:bg-white focus:border-neutral-900 outline-none w-48 transition-all"
              />
            </div>

            {/* Customizer Toggle Button */}
            {activeTab === 'OVERVIEW' && (
              <button
                onClick={() => setShowConfigModal(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs border-2 border-neutral-900 bg-[#F4F3EF] hover:bg-neutral-900 hover:text-white transition-colors"
                title="Customize Main Overview"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-bold">DECK CONTROLS</span>
              </button>
            )}

            {/* User Capsule */}
            <div className="flex items-center gap-2 border-2 border-neutral-900 bg-[#F4F3EF] px-2.5 py-1 text-xs">
              <span className="w-2 h-2 rounded-full bg-electric-blue" />
              <span className="font-bold truncate max-w-[120px]">{user.name || user.email.split('@')[0]}</span>
              <span className="text-[9px] bg-neutral-900 text-white px-1 font-bold uppercase">{user.role}</span>
            </div>

            <button
              onClick={async () => {
                await auth.logout().catch(() => {});
                navigate('/login');
              }}
              className="border-2 border-neutral-900 p-1.5 hover:bg-red-600 hover:text-white transition-colors"
              title="Terminate Session"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. COMMAND NAVIGATION RAIL (HORIZONTAL BAR) */}
        <nav className="flex items-center overflow-x-auto border-t border-neutral-200 bg-[#F4F3EF] scrollbar-none px-2">
          {navItems
            .filter((item) => !item.hide)
            .map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
                    isActive
                      ? 'border-electric-blue text-electric-blue bg-white'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                        isActive ? 'bg-electric-blue text-white' : 'bg-neutral-300 text-neutral-800'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
        </nav>
      </header>

      {/* 3. DECK CONTROLS MODAL */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-neutral-900 w-full max-w-lg shadow-[8px_8px_0px_rgba(0,0,0,1)] p-6 space-y-6">
            <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-3">
              <div className="flex items-center gap-2 font-black text-sm">
                <Sliders className="w-4 h-4 text-electric-blue" />
                <span>MAIN DECK CUSTOMIZER & CONTROLS</span>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-xs font-black border border-neutral-900 px-2 py-0.5 hover:bg-neutral-900 hover:text-white"
              >
                CLOSE [ESC]
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-black text-neutral-500 text-[10px] uppercase tracking-wider block mb-2">
                  MODULE VISIBILITY TOGGLES
                </span>
                <div className="mb-3">
                  <span className="font-black text-neutral-500 text-[10px] uppercase tracking-wider block mb-2">
                    Landing Mode — layar pertama saat buka deck
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { id: 'DECK', label: 'MAIN DECK (Project-First)', desc: 'Overview modular & pipeline' },
                      { id: 'TASKS', label: 'TASK BOARD (Task-First)', desc: 'Daftar tugas personal' },
                    ] as const).map((m) => {
                      const active = deckConfig.defaultLanding === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => updateConfig({ defaultLanding: m.id })}
                          className={`p-2.5 border text-left transition-all ${
                            active
                              ? 'border-electric-blue bg-blue-50/50 text-electric-blue'
                              : 'border-neutral-300 bg-neutral-50 text-neutral-400 hover:border-neutral-900'
                          }`}
                        >
                          <span className="block text-[11px] font-black font-mono">{m.label}</span>
                          <span className="block text-[9px] mt-0.5 font-mono">{m.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'showToday', label: 'Today Dock (Due Tasks)' },
                    { key: 'showTelemetry', label: 'Top Telemetry Strip' },
                    { key: 'showPipeline', label: 'Pipeline Radar' },
                    { key: 'showComms', label: 'Live Comms Feed' },
                    { key: 'showPaygate', label: 'PayGate Terminal' },
                    { key: 'showLeads', label: 'Inbound Leads Buffer' },
                    { key: 'showTeam', label: 'Squad Capacity Matrix' },
                  ].map((m) => {
                    const active = (deckConfig as any)[m.key];
                    return (
                      <button
                        key={m.key}
                        onClick={() => updateConfig({ [m.key]: !active } as any)}
                        className={`p-2.5 border text-left flex items-center justify-between ${
                          active
                            ? 'border-electric-blue bg-blue-50/50 text-electric-blue font-bold'
                            : 'border-neutral-300 bg-neutral-50 text-neutral-400'
                        }`}
                      >
                        <span>{m.label}</span>
                        {active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-3">
                <span className="font-black text-neutral-500 text-[10px] uppercase tracking-wider block mb-2">
                  AUTOMATION & DENSITY MODES
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold block">Layout Density</label>
                    <div className="flex border border-neutral-900">
                      <button
                        onClick={() => updateConfig({ density: 'compact' })}
                        className={`flex-1 py-1 text-center font-bold ${
                          deckConfig.density === 'compact' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-600'
                        }`}
                      >
                        COMPACT
                      </button>
                      <button
                        onClick={() => updateConfig({ density: 'standard' })}
                        className={`flex-1 py-1 text-center font-bold ${
                          deckConfig.density === 'standard' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-600'
                        }`}
                      >
                        STANDARD
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold block">Auto-Sync Progress</label>
                    <button
                      onClick={() => updateConfig({ autoProgress: !deckConfig.autoProgress })}
                      className={`w-full py-1 text-center font-bold border border-neutral-900 ${
                        deckConfig.autoProgress ? 'bg-emerald-600 text-white' : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {deckConfig.autoProgress ? 'AUTO PROGRESS: ON' : 'MANUAL PROGRESS'}
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-neutral-500 mt-2">
                  Auto-sync menghitung persentase progres proyek secara otomatis berdasarkan deliverable yang telah disetujui (Approved).
                </p>
              </div>

              {/* Quick Presets */}
              <div className="border-t border-neutral-200 pt-3 flex items-center justify-between">
                <button
                  onClick={resetConfig}
                  className="flex items-center gap-1 text-[10px] text-neutral-500 hover:text-neutral-900"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>RESET DEFAULT</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateConfig({
                        showToday: true,
                        showTelemetry: true,
                        showPipeline: true,
                        showComms: true,
                        showPaygate: true,
                        showLeads: true,
                        showTeam: true,
                      })
                    }
                    className="px-2 py-1 bg-neutral-900 text-white text-[10px] font-bold"
                  >
                    SHOW ALL
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MAIN WORKSPACE VIEWPORT */}
      <main className="flex-1 p-4 md:p-6 max-w-[1600px] w-full mx-auto">
        {activeTab === 'OVERVIEW' && (
          <OverviewDeck
            user={user}
            projects={projects}
            leads={leads}
            finance={finance}
            gateway={gateway}
            recentMessages={recentMessages}
            config={deckConfig}
            onNavigate={(t) => setActiveTab(t)}
            onReload={loadData}
          />
        )}

        {activeTab === 'TASKS' && user.role !== 'client' && (
          <TasksPage
            projects={projects || []}
            meEmail={user.email}
            onNavigateProject={() => setActiveTab('OPS')}
            onReload={loadData}
          />
        )}
        {activeTab === 'OPS' && (
          <OpsPanel
            user={user}
            projects={projects}
            leads={leads}
            allUsers={allUsers}
            searchQuery={searchQuery}
            onReload={loadData}
          />
        )}

        {activeTab === 'CHAT' && <ChatPanel me={user} projects={projects || []} />}
        {activeTab === 'TEAM' && <TeamPanel me={user} projects={projects || []} onMutate={loadData} />}
        {activeTab === 'FINANCE' && <FinancePanel projects={projects || []} />}
        {activeTab === 'GATEWAY' && <GatewayPanel me={user} projects={projects || []} />}
        {activeTab === 'SITEOPS' && <SiteOpsPanel user={user} />}
        {activeTab === 'CREW_TOOLS' && <CrewToolsPanel />}
        {activeTab === 'CLIENT' && <ClientPanel me={user} projects={projects || []} onReload={loadData} />}
        {activeTab === 'ADMIN' && (
          <AdminPanel leads={leads} allUsers={allUsers} searchQuery={searchQuery} onReload={loadData} />
        )}
        {activeTab === 'SETTINGS' && <SettingsPanel me={user} />}
      </main>
    </div>
  );
}

// =============================================================
// OVERVIEW DECK MODULE: Customizable Executive Control Matrix
// =============================================================
// ---- TODAY DOCK: deliverable jatuh tempo hari ini lintas proyek ----
function TodayDock({
  projects,
  onToggle,
  busyProject,
}: {
  projects: Project[];
  onToggle: (projectId: string, idx: number, next: boolean) => void;
  busyProject: string | null;
}) {
  const items: Array<{ p: Project; d: DeckDeliverable; idx: number }> = [];
  for (const p of projects) {
    (p.deliverables || []).forEach((d, idx) => {
      if (isDueToday(d as DeckDeliverable)) items.push({ p, d: d as DeckDeliverable, idx });
    });
  }
  items.sort((a, b) => {
    const pr = { HIGH: 0, MEDIUM: 1, LOW: 2 } as Record<Priority, number>;
    return pr[getPriority(a.d)] - pr[getPriority(b.d)];
  });

  return (
    <section className="border-2 border-neutral-900 bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center justify-between border-b-2 border-neutral-900 bg-amber-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          <h2 className="font-mono text-xs font-black tracking-widest uppercase text-neutral-900">TODAY DOCK</h2>
          <span className="text-[10px] font-mono text-neutral-500">DELIVERABLES JATUH TEMPO HARI INI</span>
        </div>
        <span className="text-xs font-black bg-neutral-900 text-white px-2 py-0.5">{items.length}</span>
      </div>
      <div className="p-4">
        {items.length === 0 ? (
          <div className="py-6 text-center text-neutral-400 text-xs font-mono">CLEAR. TIDAK ADA TASK JATUH TEMPO HARI INI.</div>
        ) : (
          <div className="space-y-2">
            {items.map(({ p, d, idx }) => {
              const isApproved = d.done || d.approval === 'APPROVED';
              return (
                <div
                  key={p.id + '-' + idx}
                  className={`flex items-center justify-between gap-3 border p-2.5 ${
                    isApproved ? 'border-emerald-300 bg-emerald-50' : 'bg-white border-neutral-300 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      type="button"
                      disabled={isApproved || busyProject === p.id}
                      onClick={() => onToggle(p.id, idx, !isApproved)}
                      className={`w-5 h-5 flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
                        isApproved ? 'bg-emerald-600 border-emerald-600' : 'border-neutral-400 bg-white hover:border-emerald-600'
                      } ${busyProject === p.id ? 'opacity-50' : ''}`}
                      title={isApproved ? 'Selesai' : 'Tandai selesai'}
                    >
                      {isApproved && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </button>
                    <div className="min-w-0">
                      <div className="text-xs font-black truncate">{d.name}</div>
                      <div className="text-[10px] font-mono text-neutral-500 truncate">
                        {p.title} {d.dueDate ? '- ' + new Date(d.dueDate + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : ''}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[8px] font-black px-1.5 py-0.5 border flex-shrink-0 ${PRIORITY_STYLES[getPriority(d)]}`}>
                    {PRIORITY_LABEL[getPriority(d)]}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function OverviewDeck({
  user,
  projects,
  leads,
  finance,
  gateway,
  recentMessages,
  config,
  onNavigate,
  onReload,
}: {
  user: PublicUser;
  projects: Project[] | null;
  leads: any[] | null;
  finance: { transactions: Transaction[]; summary: { income: number; expense: number; net: number } } | null;
  gateway: { transactions: GatewayTxn[]; summary: GatewaySummary } | null;
  recentMessages: Array<{ msg: Message; channelName: string }>;
  config: DeckConfig;
  onNavigate: (tab: Tab) => void;
  onReload: () => void;
}) {
  const [busyProject, setBusyProject] = useState<string | null>(null);

  const toggleToday = async (projectId: string, idx: number, next: boolean) => {
    setBusyProject(projectId);
    try {
      const proj = (projects || []).find((x) => x.id === projectId);
      if (!proj) return;
      const nextDeliverables = proj.deliverables.map((d, i) => (i === idx ? { ...d, done: next } : d));
      await projectsApi.update(projectId, { deliverables: nextDeliverables });
      onReload();
    } catch {
      // silent
    } finally {
      setBusyProject(null);
    }
  };
  const rp = (n: number) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
  const activeProjects = (projects || []).filter((p) => p.phase !== 'LIVE');
  const newLeads = (leads || []).filter((l) => l.status === 'NEW');

  // Helper untuk hitung progress otomatis
  const calculateAutoProgress = (p: Project) => {
    if (!p.deliverables || p.deliverables.length === 0) return 0;
    const completed = p.deliverables.filter((d) => d.done || d.approval === 'APPROVED').length;
    return Math.round((completed / p.deliverables.length) * 100);
  };

  return (
    <div className={`space-y-6 ${config.density === 'compact' ? 'text-xs' : 'text-sm'}`}>
      {/* 0. TODAY DOCK — deliverables jatuh tempo hari ini */}
      {config.showToday && (projects || []).length > 0 && (
        <TodayDock projects={projects || []} onToggle={toggleToday} busyProject={busyProject} />
      )}
      {/* 1. TOP MODULE TELEMETRY STRIP */}
      {config.showTelemetry && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
          <div
            onClick={() => onNavigate('OPS')}
            className="border-2 border-neutral-900 bg-white p-4 cursor-pointer hover:border-electric-blue transition-all group border-l-4 border-l-electric-blue"
          >
            <div className="flex justify-between items-center text-neutral-500 text-[10px] font-bold">
              <span>PIPELINE RADAR</span>
              <Layers className="w-3.5 h-3.5 text-electric-blue" />
            </div>
            <div className="mt-2 text-2xl font-black text-neutral-900 group-hover:text-electric-blue transition-colors">
              {activeProjects.length} <span className="text-xs font-normal text-neutral-500">ACTIVE</span>
            </div>
            <div className="text-[10px] text-neutral-400 mt-1 uppercase">TOTAL {projects?.length || 0} UNITS LOGGED</div>
          </div>

          <div
            onClick={() => onNavigate('CHAT')}
            className="border-2 border-neutral-900 bg-white p-4 cursor-pointer hover:border-electric-blue transition-all group border-l-4 border-l-neutral-900"
          >
            <div className="flex justify-between items-center text-neutral-500 text-[10px] font-bold">
              <span>COMMS STREAM</span>
              <MessageSquare className="w-3.5 h-3.5 text-neutral-700" />
            </div>
            <div className="mt-2 text-2xl font-black text-neutral-900 group-hover:text-electric-blue transition-colors">
              {recentMessages.length} <span className="text-xs font-normal text-neutral-500">RECENT</span>
            </div>
            <div className="text-[10px] text-neutral-400 mt-1 uppercase">REALTIME DISPATCHES</div>
          </div>

          <div
            onClick={() => onNavigate('GATEWAY')}
            className="border-2 border-neutral-900 bg-white p-4 cursor-pointer hover:border-electric-blue transition-all group border-l-4 border-l-amber-500"
          >
            <div className="flex justify-between items-center text-neutral-500 text-[10px] font-bold">
              <span>PAYGATE QRIS</span>
              <QrCode className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-amber-900">
              {gateway?.summary.pending || 0} <span className="text-xs font-normal text-neutral-500">PENDING</span>
            </div>
            <div className="text-[10px] text-emerald-700 font-bold mt-1 uppercase">
              SETTLED {rp(gateway?.summary.volume || 0)}
            </div>
          </div>

          <div
            onClick={() => onNavigate('FINANCE')}
            className="border-2 border-neutral-900 bg-white p-4 cursor-pointer hover:border-electric-blue transition-all group border-l-4 border-l-emerald-600"
          >
            <div className="flex justify-between items-center text-neutral-500 text-[10px] font-bold">
              <span>NET CASH FLOW</span>
              <Wallet className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className={`mt-2 text-xl font-black ${(finance?.summary.net || 0) >= 0 ? 'text-emerald-900' : 'text-red-600'}`}>
              {rp(finance?.summary.net || 0)}
            </div>
            <div className="text-[10px] text-neutral-400 mt-1 uppercase">REVENUE BALANCE</div>
          </div>
        </div>
      )}

      {/* 2. MAIN ASYMMETRICAL TILES MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: PIPELINE VITAL MONITOR */}
        <div className="lg:col-span-7 space-y-6">
          {config.showPipeline && (
            <div className="border-2 border-neutral-900 bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <div className="bg-[#F4F3EF] border-b-2 border-neutral-900 px-4 py-2.5 flex justify-between items-center font-mono">
                <span className="text-xs font-black tracking-widest text-neutral-900 uppercase flex items-center gap-2">
                  <Layers className="w-4 h-4 text-electric-blue" />
                  ACTIVE PIPELINE UNITS [{activeProjects.length}]
                </span>
                <button
                  onClick={() => onNavigate('OPS')}
                  className="text-[10px] font-bold text-electric-blue hover:underline flex items-center gap-1"
                >
                  <span>OPEN FULL PIPELINE</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="p-4 space-y-3 font-mono">
                {activeProjects.length === 0 ? (
                  <div className="p-6 text-center text-neutral-400 text-xs">NO ACTIVE PROJECTS IN PROGRESS.</div>
                ) : (
                  activeProjects.slice(0, 4).map((p) => {
                    const autoP = calculateAutoProgress(p);
                    return (
                      <div
                        key={p.id}
                        className="border-2 border-neutral-200 p-3 bg-white hover:border-neutral-900 transition-all space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-neutral-900 uppercase">{p.title}</span>
                              <span className="text-[9px] bg-neutral-100 text-neutral-700 px-1.5 py-0.2 border border-neutral-300 font-bold uppercase">
                                {p.phase}
                              </span>
                            </div>
                            <span className="text-[10px] text-neutral-500 block mt-0.5">{p.clientEmail}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-electric-blue">{autoP}%</span>
                            <span className="block text-[8px] text-neutral-400">AUTO-PROGRESS</span>
                          </div>
                        </div>

                        {/* Progress Stepper Bar */}
                        <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden border border-neutral-300">
                          <div
                            className="bg-electric-blue h-full transition-all duration-500"
                            style={{ width: `${autoP}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1 border-t border-neutral-100">
                          <span>DELIVERABLES: {p.deliverables?.filter((d) => d.done || d.approval === 'APPROVED').length || 0}/{p.deliverables?.length || 0} APPROVED</span>
                          {p.deadline && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-neutral-400" />
                              DUE: {new Date(p.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* PayGate Terminal Radar */}
          {config.showPaygate && (
            <div className="border-2 border-neutral-900 bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <div className="bg-[#F4F3EF] border-b-2 border-neutral-900 px-4 py-2.5 flex justify-between items-center font-mono">
                <span className="text-xs font-black tracking-widest text-neutral-900 uppercase flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-amber-600" />
                  PAYGATE QRIS SETTLEMENT TERMINAL
                </span>
                <button
                  onClick={() => onNavigate('GATEWAY')}
                  className="text-[10px] font-bold text-amber-700 hover:underline flex items-center gap-1"
                >
                  <span>LAUNCH TERMINAL</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="p-4 font-mono text-xs space-y-3">
                <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                  <div className="p-2 border border-neutral-300 bg-emerald-50 text-emerald-900">
                    <span className="text-[9px] block text-emerald-700 font-bold">SETTLED TRANSACTIONS</span>
                    <span className="font-black text-sm">{gateway?.summary.success || 0} SUCCESS</span>
                  </div>
                  <div className="p-2 border border-neutral-300 bg-amber-50 text-amber-900">
                    <span className="text-[9px] block text-amber-700 font-bold">AWAITING SCAN</span>
                    <span className="font-black text-sm">{gateway?.summary.pending || 0} PENDING</span>
                  </div>
                </div>

                <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">RECENT QRIS ACTIVITY</div>
                <div className="space-y-1.5">
                  {(gateway?.transactions || []).slice(0, 3).map((t) => (
                    <div key={t.id} className="flex justify-between items-center p-2 border border-neutral-200 text-[11px] bg-neutral-50">
                      <div>
                        <span className="font-bold block text-neutral-900">{t.description || 'QRIS Payment'}</span>
                        <span className="text-[9px] text-neutral-400">{new Date(t.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-neutral-900 block">{rp(t.amount)}</span>
                        <span className={`text-[9px] font-bold uppercase ${t.status === 'SUCCESS' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {t.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: COMMS & LEADS DOCK */}
        <div className="lg:col-span-5 space-y-6">
          {/* COMMS REALTIME DISPATCH STREAM */}
          {config.showComms && (
            <div className="border-2 border-neutral-900 bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <div className="bg-[#F4F3EF] border-b-2 border-neutral-900 px-4 py-2.5 flex justify-between items-center font-mono">
                <span className="text-xs font-black tracking-widest text-neutral-900 uppercase flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-neutral-800" />
                  TACTICAL COMMS STREAM
                </span>
                <button
                  onClick={() => onNavigate('CHAT')}
                  className="text-[10px] font-bold text-electric-blue hover:underline flex items-center gap-1"
                >
                  <span>COMMS HUB</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="p-4 space-y-2.5 font-mono">
                {recentMessages.length === 0 ? (
                  <div className="p-6 text-center text-neutral-400 text-xs">NO DISPATCH TRANSMISSIONS RECORDED.</div>
                ) : (
                  recentMessages.map(({ msg, channelName }) => (
                    <div key={msg.id} className="border-2 border-neutral-200 p-2.5 bg-white space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-electric-blue">#{channelName}</span>
                        <span className="text-neutral-400">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="text-xs text-neutral-900 font-bold">{msg.userName}</div>
                      <div className="text-[11px] text-neutral-600 truncate">{msg.text}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* INBOUND LEADS BUFFER */}
          {config.showLeads && user.role !== 'client' && (
            <div className="border-2 border-neutral-900 bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <div className="bg-[#F4F3EF] border-b-2 border-neutral-900 px-4 py-2.5 flex justify-between items-center font-mono">
                <span className="text-xs font-black tracking-widest text-neutral-900 uppercase flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-electric-blue" />
                  INBOUND LEADS BUFFER [{newLeads.length}]
                </span>
                <button
                  onClick={() => onNavigate('ADMIN')}
                  className="text-[10px] font-bold text-electric-blue hover:underline flex items-center gap-1"
                >
                  <span>LEADS QUEUE</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="p-4 space-y-2 font-mono">
                {newLeads.length === 0 ? (
                  <div className="p-6 text-center text-neutral-400 text-xs">NO UNANSWERED INBOUND LEADS.</div>
                ) : (
                  newLeads.slice(0, 3).map((lead) => (
                    <div key={lead.id} className="border-l-4 border-l-electric-blue border border-neutral-200 p-2.5 bg-white flex justify-between items-center">
                      <div>
                        <div className="text-xs font-black text-neutral-900">{lead.name || lead.email}</div>
                        <span className="text-[10px] text-neutral-500 block">{lead.service || 'General Inquiry'}</span>
                      </div>
                      {lead.phone && (
                        <a
                          href={`https://wa.me/${lead.phone.replace(/^0/, '62').replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-1 flex items-center gap-1 hover:bg-emerald-700"
                        >
                          <Send className="w-3 h-3" />
                          <span>WA DIRECT</span>
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================
// OPS PANEL: Pipeline Management & Project Provisioning
// =============================================================
// -------------------------------------------------------------
// TASKS PAGE: task-first hybrid page wrapper (state owner)
// -------------------------------------------------------------
function TasksPage({
  projects,
  meEmail,
  onNavigateProject,
  onReload,
}: {
  projects: Project[];
  meEmail?: string;
  onNavigateProject: () => void;
  onReload: () => void;
}) {
  const [detailTask, setDetailTask] = useState<TaskItem | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const toggleDone = async (t: TaskItem, next: boolean) => {
    const proj = projects.find((x) => x.id === t.projectId);
    if (!proj) return;
    setBusyKey(t.key);
    try {
      const nextDeliverables = proj.deliverables.map((d, i) => (i === t.index ? { ...d, done: next } : d));
      await projectsApi.update(proj.id, { deliverables: nextDeliverables });
      onReload();
      if (detailTask && detailTask.key === t.key) {
        setDetailTask({ ...t, done: next });
      }
    } catch {
      // silent
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="font-mono text-lg font-black tracking-widest uppercase text-neutral-900">TASK BOARD</h1>
          <p className="font-mono text-[11px] text-neutral-500 mt-0.5">
            Task-first command view — semua deliverable lintas proyek dalam satu alur kerja.
          </p>
        </div>
        <button
          onClick={onNavigateProject}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border-2 border-neutral-900 bg-white hover:bg-[#F4F3EF] transition-colors font-mono"
        >
          <Layers className="w-3.5 h-3.5" /> PROJECT VIEW
        </button>
      </div>
      <TaskBoard
        tasks={collectTasks(projects, meEmail)}
        meEmail={meEmail}
        busyKey={busyKey}
        onToggleDone={toggleDone}
        onOpenDetail={(t) => setDetailTask(t)}
        onNavigateProject={onNavigateProject}
      />
      {detailTask && (
        <DetailTaskOverlay
          task={{ project: projects.find((x) => x.id === detailTask.projectId) || ({} as Project), index: detailTask.index }}
          onClose={() => setDetailTask(null)}
          busy={busyKey === detailTask.key}
          onToggleDone={(next) => toggleDone(detailTask, next)}
        />
      )}
    </div>
  );
}

// -------------------------------------------------------------
// TASK BOARD: task-first hybrid view (MINE / ALL / DONE)
// -------------------------------------------------------------
function TaskBoard({
  tasks,
  meEmail,
  busyKey,
  onToggleDone,
  onOpenDetail,
  onNavigateProject,
}: {
  tasks: TaskItem[];
  meEmail?: string;
  busyKey: string | null;
  onToggleDone: (t: TaskItem, next: boolean) => void;
  onOpenDetail: (t: TaskItem) => void;
  onNavigateProject: () => void;
}) {
  const [filter, setFilter] = useState<TaskFilter>(meEmail ? 'MINE' : 'ALL');
  const [sort, setSort] = useState<TaskSort>('PRIORITY');

  const pending = tasks.filter((t) => !t.done);
  const minePending = pending.filter((t) => t.isMine);

  const visible = (() => {
    let list = filter === 'DONE' ? tasks.filter((t) => t.done) : pending;
    if (filter === 'MINE') list = list.filter((t) => t.isMine);
    if (sort === 'PRIORITY') list = [...list].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    if (sort === 'DEADLINE') list = [...list].sort((a, b) => {
      const da = a.dueDate || a.projectDeadline;
      const db = b.dueDate || b.projectDeadline;
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return da.localeCompare(db);
    });
    if (sort === 'PROJECT') list = [...list].sort((a, b) => a.projectTitle.localeCompare(b.projectTitle));
    return list;
  })();

  const FILTERS: Array<{ id: TaskFilter; label: string; count: number }> = [
    { id: 'MINE', label: 'TUGAS SAYA', count: minePending.length },
    { id: 'ALL', label: 'SEMUA', count: pending.length },
    { id: 'DONE', label: 'SELESAI', count: tasks.filter((t) => t.done).length },
  ];

  return (
    <div className="space-y-4">
      {/* Filter + sort bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 text-xs font-black border-2 font-mono transition-all ${
                filter === f.id
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-500 border-neutral-300 hover:border-neutral-900 hover:text-neutral-900'
              }`}
            >
              {f.label}
              <span className={`ml-1.5 text-[9px] px-1 py-px rounded-full ${filter === f.id ? 'bg-electric-blue text-white' : 'bg-neutral-200 text-neutral-600'}`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider font-mono">SORT</span>
          {(['PRIORITY', 'DEADLINE', 'PROJECT'] as TaskSort[]).map((sv) => (
            <button
              key={sv}
              onClick={() => setSort(sv)}
              className={`px-2 py-1 text-[10px] font-bold border font-mono transition-all ${
                sort === sv ? 'bg-electric-blue text-white border-electric-blue' : 'bg-white text-neutral-500 border-neutral-300 hover:border-electric-blue'
              }`}
            >
              {sv}
            </button>
          ))}
        </div>
      </div>

      {/* Task list */}
      {visible.length === 0 ? (
        <div className="border-2 border-dashed border-neutral-300 bg-white p-10 text-center font-mono">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
          <div className="text-sm font-black text-neutral-900 uppercase tracking-wider">
            {filter === 'DONE' ? 'BELUM ADA TUGAS SELESAI' : filter === 'MINE' ? 'TIDAK ADA TUGAS UNTUKMU' : 'SEMUA TUGAS CLEAR'}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            {filter === 'MINE' ? 'Kamu belum jadi member di proyek mana pun, atau semua tugasmu sudah selesai.' : 'Semua deliverable proyek sudah done. Kerja bagus.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map((t) => {
            const busy = busyKey === t.key;
            const dd = dayDiff(t.dueDate || t.projectDeadline);
            const catStyle = t.category ? CATEGORY_STYLES[t.category] : null;
            return (
              <div
                key={t.key}
                className={`border-2 bg-white flex items-stretch transition-all ${
                  t.priority === 'OVERDUE' ? 'border-red-400' : t.priority === 'TODAY' ? 'border-amber-400' : 'border-neutral-900'
                } ${busy ? 'opacity-60' : ''}`}
              >
                {/* Checkbox toggle */}
                <button
                  type="button"
                  disabled={busy}
                  title={t.done ? 'Buka tanda selesai' : 'Tandai selesai'}
                  onClick={() => onToggleDone(t, !t.done)}
                  className={`w-11 flex-shrink-0 border-r-2 flex items-center justify-center transition-colors ${
                    t.done ? 'bg-emerald-600 border-emerald-700 text-white' : 'bg-[#F4F3EF] border-neutral-900 hover:bg-emerald-50'
                  }`}
                >
                  {t.done ? <CheckCircle2 className="w-4 h-4" /> : <span className="w-3.5 h-3.5 border-2 border-neutral-400" />}
                </button>

                {/* Body */}
                <button
                  type="button"
                  onClick={() => onOpenDetail(t)}
                  className="flex-1 min-w-0 p-3 text-left group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className={`text-sm font-black truncate ${t.done ? 'text-neutral-400 line-through' : 'text-neutral-900 group-hover:text-electric-blue'}`}>
                        {t.name}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap text-[9px] font-bold font-mono">
                        <span className="text-neutral-400 uppercase tracking-wider">PROYEK:</span>
                        <span className="text-electric-blue">{t.projectTitle}</span>
                        <span className="text-neutral-300">|</span>
                        <span className="text-neutral-500">{t.projectPhase}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className={`text-[9px] font-black px-1.5 py-0.5 border font-mono ${TASK_PRIORITY_STYLES[t.priority]}`}>
                        {t.done ? 'DONE' : t.priority}
                      </span>
                      {catStyle && <span className={`w-2 h-2 border ${catStyle}`} title={t.category?.toUpperCase()} />}
                    </div>
                  </div>
                  {/* Assignees + due */}
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <div className="flex items-center -space-x-1">
                      {t.assignees.slice(0, 5).map((e) => (
                        <span key={e} className="w-5 h-5 rounded-full bg-electric-blue text-white text-[8px] font-black flex items-center justify-center border border-white" title={e}>
                          {e.slice(0, 2).toUpperCase()}
                        </span>
                      ))}
                      {t.assignees.length === 0 && <span className="text-[9px] text-neutral-400 font-mono">UNASSIGNED</span>}
                    </div>
                    <span className={`text-[10px] font-bold font-mono ${dd !== null && dd < 0 && !t.done ? 'text-red-600' : dd === 0 && !t.done ? 'text-amber-600' : 'text-neutral-400'}`}>
                      {(() => {
                        const dstr = t.dueDate || t.projectDeadline;
                        if (!dstr) return 'NO DEADLINE';
                        if (dd === 0) return 'HARI INI';
                        if (dd !== null && dd < 0) return `${Math.abs(dd)} HARI TERLAMBAT`;
                        if (dd !== null) return `${dd} HARI LAGI`;
                        return new Date(dstr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
                      })()}
                    </span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// DETAIL TASK OVERVIEW: single-CTA tactical task detail overlay
// -------------------------------------------------------------
function DetailTaskOverlay({
  task,
  onClose,
  busy,
  onToggleDone,
}: {
  task: { project: Project; index: number };
  onClose: () => void;
  busy: boolean;
  onToggleDone: (next: boolean) => void;
}) {
  const { project, index } = task;
  const d = (project.deliverables || [])[index] as DeckDeliverable | undefined;
  if (!d) return null;

  const isApproved = d.done || d.approval === 'APPROVED';
  const prio = getPriority(d);
  const cat = d.category;
  const catStyle = cat ? CATEGORY_STYLES[cat] : null;
  const due = d.dueDate;
  const overdue = isDueToday(d);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg border-2 border-neutral-900 bg-[#F4F3EF] shadow-[10px_10px_0px_rgba(0,0,0,1)] max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b-2 border-neutral-900 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2 min-w-0">
            <Target className="w-4 h-4 text-electric-blue flex-shrink-0" />
            <h3 className="font-mono text-xs font-black tracking-widest uppercase text-neutral-900 truncate">TASK DETAIL</h3>
          </div>
          <button onClick={onClose} className="text-xs font-bold text-neutral-400 hover:text-neutral-900 font-mono">
            ESC / CLOSE
          </button>
        </div>

        <div className="p-4 space-y-4 font-mono">
          {/* Nama tugas */}
          <div className="border-2 border-neutral-900 bg-white p-4">
            <span className="text-[9px] font-black text-neutral-400 uppercase tracking-wider block mb-1">NAMA TUGAS</span>
            <div className="text-lg font-black text-neutral-900 leading-tight">{d.name}</div>
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className={`text-[9px] font-black px-1.5 py-0.5 border ${PRIORITY_STYLES[prio]}`}>{prio}</span>
              {catStyle && <span className={`text-[9px] font-black px-1.5 py-0.5 border ${catStyle}`}>{cat?.toUpperCase()}</span>}
              {isApproved && <span className="text-[9px] font-black px-1.5 py-0.5 bg-emerald-600 text-white border border-emerald-700">SELESAI</span>}
              {overdue && !isApproved && <span className="text-[9px] font-black px-1.5 py-0.5 bg-amber-500 text-white border border-amber-600">DUE TODAY</span>}
            </div>
          </div>

          {/* Meta grid: proyek induk, deadline, assignee */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="border border-neutral-300 bg-white p-3">
              <span className="text-[8px] font-black text-neutral-400 uppercase block">PROYEK INDUK</span>
              <span className="text-xs font-bold text-neutral-900 mt-1 block truncate" title={project.title}>{project.title}</span>
            </div>
            <div className="border border-neutral-300 bg-white p-3">
              <span className="text-[8px] font-black text-neutral-400 uppercase block">DEADLINE PROYEK</span>
              <span className="text-xs font-bold text-neutral-900 mt-1 block">
                {project.deadline ? new Date(project.deadline).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : 'BELUM DITETAPKAN'}
              </span>
            </div>
            <div className="border border-neutral-300 bg-white p-3">
              <span className="text-[8px] font-black text-neutral-400 uppercase block">DITUGASKAN KEPADA</span>
              <div className="flex items-center gap-1 mt-1 flex-wrap">
                {(project.memberEmails || []).slice(0, 4).map((e) => (
                  <span key={e} className="w-6 h-6 rounded-full bg-electric-blue text-white text-[8px] font-black flex items-center justify-center" title={e}>
                    {e.slice(0, 2).toUpperCase()}
                  </span>
                ))}
                {(project.memberEmails || []).length === 0 && <span className="text-[10px] text-neutral-400">UNASSIGNED</span>}
              </div>
            </div>
          </div>

          {/* Approval status client (jika ada) */}
          {d.approval && (
            <div className={`border-2 p-3 ${d.approval === 'APPROVED' ? 'border-emerald-300 bg-emerald-50' : 'border-amber-300 bg-amber-50'}`}>
              <span className="text-[8px] font-black uppercase block mb-1">STATUS CLIENT</span>
              <span className="text-xs font-bold">{d.approval === 'APPROVED' ? 'APPROVED OLEH CLIENT' : 'REVISI DIMINTA CLIENT'}</span>
              {d.approvalNote && <p className="text-[11px] text-neutral-600 mt-1 italic">"{d.approvalNote}"</p>}
            </div>
          )}

          {/* Single CTA utama */}
          <button
            type="button"
            disabled={busy || isApproved}
            onClick={() => onToggleDone(true)}
            className={`w-full border-2 border-neutral-900 p-3.5 font-mono text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${
              isApproved
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-electric-blue text-white hover:bg-blue-700 disabled:opacity-50'
            }`}
          >
            {isApproved ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> TUGAS SELESAI
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> TANDAI SELESAI
              </>
            )}
          </button>
          {!isApproved && (
            <p className="text-[10px] text-neutral-400 text-center font-mono">Satu aksi utama — progres proyek otomatis ter-update.</p>
          )}
        </div>
      </div>
    </div>
  );
}


// -------------------------------------------------------------
// SITE OPS: Traffic Radar + Page Control + Vitals
// -------------------------------------------------------------
const SITE_PAGE_LIST = [
  { path: '/', label: 'MAIN PAGE' },
  { path: '/route', label: 'ROUTE' },
  { path: '/paygate', label: 'PAYGATE' },
  { path: '/agent', label: 'AGENT' },
  { path: '/rampung', label: 'RAMPUNG' },
  { path: '/gallery', label: 'GALLERY' },
  { path: '/partners', label: 'PARTNERS' },
  { path: '/systems', label: 'SYSTEMS' },
];

type SiteCfg = { pages: Record<string, { status: 'LIVE' | 'MAINTENANCE'; nav: boolean }>; updatedAt: string | null };
type TrafficData = {
  summary: { views24: number; sessions24: number; devices: Record<string, number>; total: number };
  pages: Array<{ path: string; day: number; week: number; all: number }>;
  recent: Array<{ path: string; sid: string; ref: string; device: string; ts: string }>;
  funnel: { home: number; login: number; register: number };
};

// =============================================================
// GALLERY MANAGER: tambah/edit/hapus item gallery publik
// =============================================================
function GalleryManagerPanel({ onMsg }: { onMsg?: (m: string) => void }) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState({ id: '', title: '', story: '', image: '', imageUploading: false });

  const load = useCallback(() => {
    galleryApi.list().then((r) => setItems(r.items)).catch(() => setMsg('Gagal memuat gallery'));
  }, []);
  useEffect(() => { load(); }, [load]);

  const resetForm = () => { setEditing(null); setForm({ id: '', title: '', story: '', image: '', imageUploading: false }); };

  const openEdit = (item: GalleryItem) => {
    setEditing(item);
    setForm({ id: item.id, title: item.title, story: item.story || '', image: item.image, imageUploading: false });
  };

  const handleFile = async (file: File) => {
    if (file.size > 8 * 1024 * 1024) { setMsg('Maks 8MB'); return; }
    setForm((f) => ({ ...f, imageUploading: true }));
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const r = await galleryApi.upload(String(reader.result));
        setForm((f) => ({ ...f, image: r.url, imageUploading: false }));
      } catch (e: any) {
        setMsg(e.message || 'Upload gagal');
        setForm((f) => ({ ...f, imageUploading: false }));
      }
    };
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    setMsg(''); setBusy('save');
    try {
      if (editing) {
        await galleryApi.update(editing.id, { title: form.title, story: form.story, image: form.image });
        setMsg(`${editing.id} diperbarui`);
      } else {
        if (!form.id.trim() || !form.title.trim()) { setMsg('ID & judul wajib'); setBusy(''); return; }
        await galleryApi.create({ id: form.id, title: form.title, story: form.story, image: form.image });
        setMsg(`${form.id.toUpperCase()} ditambahkan`);
      }
      resetForm();
      load();
      onMsg?.('Gallery diperbarui');
    } catch (e: any) {
      setMsg(e.message || 'Gagal menyimpan');
    } finally { setBusy(''); }
  };

  const remove = async (id: string) => {
    setBusy(id); setMsg('');
    try {
      await galleryApi.remove(id);
      setMsg(`${id} dihapus`);
      if (editing?.id === id) resetForm();
      load();
    } catch (e: any) { setMsg(e.message || 'Gagal menghapus'); }
    finally { setBusy(''); }
  };

  const inputCls = 'w-full border-2 border-neutral-900 bg-white p-2 font-mono text-xs outline-none focus:border-electric-blue';

  return (
    <div className="border-2 border-neutral-900 bg-white">
      <div className="flex items-center justify-between border-b-2 border-neutral-900 bg-[#F4F3EF] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-electric-blue" />
          <h2 className="font-mono text-xs font-black tracking-widest uppercase">Gallery Manager</h2>
          <span className="font-mono text-[10px] text-neutral-400">{items.length} ITEM</span>
        </div>
        {editing && (
          <button onClick={resetForm} className="font-mono text-[10px] font-bold text-neutral-500 hover:text-neutral-900">
            BATALKAN EDIT
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {msg && <div className="border border-electric-blue bg-blue-50 px-3 py-1.5 font-mono text-[10px] font-bold text-electric-blue">{msg}</div>}

        {/* Form tambah/edit */}
        <div className={`border-2 p-3 space-y-2.5 ${editing ? 'border-electric-blue bg-blue-50/40' : 'border-neutral-300 bg-neutral-50'}`}>
          <span className="font-mono text-[10px] font-black tracking-widest text-neutral-500 uppercase">
            {editing ? `EDIT // ${editing.id}` : 'ITEM BARU'}
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value.toUpperCase() })}
              placeholder="ID (mis. POS-06)" disabled={!!editing} className={inputCls} />
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Judul karya" className={`${inputCls} md:col-span-2`} />
          </div>
          <textarea value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })}
            placeholder="Cerita / deskripsi karya" rows={3} className={inputCls} />
          <div className="flex flex-wrap items-center gap-2">
            <label className={`flex cursor-pointer items-center gap-1.5 border-2 border-neutral-900 bg-white px-3 py-1.5 font-mono text-xs font-bold hover:bg-neutral-900 hover:text-white transition-colors ${form.imageUploading ? 'opacity-50 pointer-events-none' : ''}`}>
              {form.imageUploading ? 'MENGUNGGAH...' : 'UNGGAH GAMBAR'}
              <input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
            </label>
            {form.image && (
              <div className="flex items-center gap-2 border border-neutral-300 bg-white p-1 pr-2">
                <img src={form.image} alt="preview" className="h-8 w-12 object-cover" />
                <span className="font-mono text-[9px] text-neutral-500">{form.image}</span>
              </div>
            )}
            <button onClick={submit} disabled={busy === 'save' || form.imageUploading}
              className="ml-auto flex items-center gap-1.5 bg-neutral-900 px-4 py-1.5 font-mono text-xs font-bold text-white hover:bg-electric-blue disabled:opacity-40 transition-colors">
              {editing ? 'SIMPAN PERUBAHAN' : 'TAMBAH ITEM'}
            </button>
          </div>
          {!form.image && <p className="font-mono text-[9px] text-neutral-400">Karya tanpa gambar: kartu akan tampil polos (masih valid untuk teks).</p>}
        </div>

        {/* Daftar item */}
        <div className="space-y-1.5">
          {items.map((it) => (
            <div key={it.id} className={`flex items-center gap-3 border p-2 ${editing?.id === it.id ? 'border-electric-blue bg-blue-50/40' : 'border-neutral-300 bg-white'}`}>
              {it.image ? (
                <img src={it.image} alt={it.title} className="h-10 w-14 flex-shrink-0 border border-neutral-300 object-cover" />
              ) : (
                <div className="flex h-10 w-14 flex-shrink-0 items-center justify-center border border-neutral-300 bg-neutral-100">
                  <ImageIcon className="h-4 w-4 text-neutral-300" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[9px] text-neutral-400">{it.id}</div>
                <div className="truncate font-mono text-xs font-bold">{it.title}</div>
              </div>
              <button onClick={() => openEdit(it)} className="border border-neutral-300 p-1.5 text-neutral-500 hover:border-electric-blue hover:text-electric-blue" title="Edit">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => remove(it.id)} disabled={busy === it.id}
                className="border border-neutral-300 p-1.5 text-neutral-500 hover:border-red-500 hover:text-red-500 disabled:opacity-40" title="Hapus">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {!items.length && <div className="border border-neutral-200 p-4 text-center font-mono text-[10px] text-neutral-400">MEMUAT ATAU KOSONG.</div>}
        </div>
      </div>
    </div>
  );
}

// =============================================================
// EVENTS MANAGER: tambah/edit/hapus agenda/event publik
// =============================================================
function EventsManagerPanel({ onMsg }: { onMsg?: (m: string) => void }) {
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [form, setForm] = useState<{ id: string; date: string; title: string; location: string; status: 'OPEN' | 'CLOSED' | 'INVITE ONLY'; description: string }>({
    id: '',
    date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
    title: '',
    location: 'ONLINE',
    status: 'OPEN',
    description: '',
  });

  const load = useCallback(() => {
    eventsApi.list().then((r) => setEventsList(r.items)).catch(() => setMsg('Gagal memuat events'));
  }, []);
  useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setEditing(null);
    setForm({
      id: '',
      date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      title: '',
      location: 'ONLINE',
      status: 'OPEN',
      description: '',
    });
  };

  const openEdit = (item: EventItem) => {
    setEditing(item);
    setForm({
      id: item.id,
      date: item.date,
      title: item.title,
      location: item.location || 'ONLINE',
      status: item.status || 'OPEN',
      description: item.description || '',
    });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setMsg('Judul event wajib diisi'); return; }
    setBusy('saving');
    setMsg('');
    try {
      if (editing) {
        const r = await eventsApi.update(editing.id, {
          title: form.title,
          date: form.date,
          location: form.location,
          status: form.status,
          description: form.description,
        });
        setEventsList((prev) => prev.map((it) => (it.id === editing.id ? r.item : it)));
        setMsg(`Event ${editing.id} berhasil diperbarui`);
        if (onMsg) onMsg(`Event ${editing.id} diperbarui`);
      } else {
        const r = await eventsApi.create({
          id: form.id.trim() || undefined,
          title: form.title,
          date: form.date,
          location: form.location,
          status: form.status,
          description: form.description,
        });
        setEventsList((prev) => [...prev, r.item]);
        setMsg(`Event ${r.item.id} berhasil ditambahkan`);
        if (onMsg) onMsg(`Event ${r.item.id} ditambahkan`);
      }
      resetForm();
    } catch (err: any) {
      setMsg(err.message || 'Gagal menyimpan event');
    } finally {
      setBusy('');
    }
  };

  const remove = async (id: string) => {
    if (!confirm(`Hapus event ${id}?`)) return;
    setBusy(id);
    try {
      await eventsApi.remove(id);
      setEventsList((prev) => prev.filter((it) => it.id !== id));
      setMsg(`Event ${id} dihapus`);
      if (onMsg) onMsg(`Event ${id} dihapus`);
    } catch (err: any) {
      setMsg(err.message || 'Gagal menghapus event');
    } finally {
      setBusy('');
    }
  };

  return (
    <div className="border-2 border-neutral-900 bg-white p-5 space-y-4">
      <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-electric-blue" />
          <h2 className="font-mono text-sm font-black tracking-tight uppercase">EVENT & ACTIVITY MANAGER</h2>
          <span className="border border-neutral-300 px-1.5 py-0.5 text-[9px] font-bold text-neutral-500">
            {eventsList.length} AGENDA
          </span>
        </div>
        <button onClick={load} className="text-[10px] font-bold text-neutral-500 hover:text-electric-blue flex items-center gap-1">
          <RotateCcw className="w-3 h-3" /> REFRESH
        </button>
      </div>

      {msg && <div className="border border-electric-blue bg-blue-50 px-3 py-1.5 text-[10px] font-bold text-electric-blue">{msg}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <form onSubmit={save} className="lg:col-span-5 border border-neutral-900 p-4 space-y-3 bg-[#FDFBF7]">
          <div className="flex items-center justify-between border-b border-neutral-300 pb-2">
            <span className="font-mono text-[11px] font-black text-electric-blue uppercase">
              {editing ? `EDIT EVENT: ${editing.id}` : '+ TAMBAH EVENT REAL'}
            </span>
            {editing && (
              <button type="button" onClick={resetForm} className="text-[10px] text-neutral-500 hover:text-neutral-900 underline">
                BATAL
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[9px] font-bold text-neutral-500 uppercase mb-0.5">ID (OPSIONAL)</label>
              <input
                type="text"
                placeholder="EVT-04"
                disabled={!!editing}
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value.toUpperCase() })}
                className="w-full border border-neutral-400 bg-white px-2 py-1 text-xs font-mono disabled:bg-neutral-100 uppercase"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-neutral-500 uppercase mb-0.5">TANGGAL (YYYY.MM.DD)</label>
              <input
                type="text"
                placeholder="2026.10.15"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border border-neutral-400 bg-white px-2 py-1 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-bold text-neutral-500 uppercase mb-0.5">JUDUL EVENT *</label>
            <input
              type="text"
              placeholder="BALI CREATIVE SYMPOSIUM"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value.toUpperCase() })}
              className="w-full border border-neutral-400 bg-white px-2 py-1 text-xs font-mono uppercase font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[9px] font-bold text-neutral-500 uppercase mb-0.5">LOKASI</label>
              <input
                type="text"
                placeholder="DENPASAR / ONLINE"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value.toUpperCase() })}
                className="w-full border border-neutral-400 bg-white px-2 py-1 text-xs font-mono uppercase"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-neutral-500 uppercase mb-0.5">STATUS</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full border border-neutral-400 bg-white px-2 py-1 text-xs font-mono font-bold"
              >
                <option value="OPEN">OPEN</option>
                <option value="INVITE ONLY">INVITE ONLY</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-bold text-neutral-500 uppercase mb-0.5">DESKRIPSI / AGENDA</label>
            <textarea
              rows={2}
              placeholder="Diskusi mendalam arsitektur digital dan ekosistem bisnis..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-neutral-400 bg-white px-2 py-1 text-xs font-mono"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={busy === 'saving'}
              className="flex-1 bg-electric-blue text-white py-2 text-xs font-black tracking-wider uppercase hover:bg-blue-700 disabled:opacity-50"
            >
              {busy === 'saving' ? 'MENYIMPAN...' : editing ? 'SIMPAN PERUBAHAN' : 'PUBLIKASIKAN EVENT'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="border border-neutral-400 px-3 py-2 text-xs font-bold hover:bg-neutral-100 uppercase"
              >
                BATAL
              </button>
            )}
          </div>
        </form>

        <div className="lg:col-span-7 space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {eventsList.map((ev) => (
            <div
              key={ev.id}
              className={`border p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors ${
                editing?.id === ev.id ? 'border-electric-blue bg-blue-50/40' : 'border-neutral-300 hover:border-neutral-900 bg-white'
              }`}
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[9px] font-black bg-neutral-900 text-white px-1.5 py-0.5">{ev.id}</span>
                  <span className="font-mono text-[10px] text-neutral-500 font-bold">{ev.date}</span>
                  <span
                    className={`font-mono text-[9px] font-bold px-1.5 py-0.2 border ${
                      ev.status === 'OPEN'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : ev.status === 'INVITE ONLY'
                        ? 'bg-purple-50 text-purple-700 border-purple-300'
                        : 'bg-neutral-100 text-neutral-500 border-neutral-300'
                    }`}
                  >
                    {ev.status}
                  </span>
                  <span className="font-mono text-[10px] text-neutral-400">📍 {ev.location}</span>
                </div>
                <h4 className="font-mono text-xs font-black uppercase truncate">{ev.title}</h4>
                {ev.description && <p className="font-mono text-[10px] text-neutral-600 line-clamp-1">{ev.description}</p>}
              </div>
              <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                <button
                  onClick={() => openEdit(ev)}
                  className="border border-neutral-300 p-1.5 text-neutral-700 hover:border-electric-blue hover:text-electric-blue"
                  title="Edit Event"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => remove(ev.id)}
                  disabled={busy === ev.id}
                  className="border border-neutral-300 p-1.5 text-neutral-500 hover:border-red-500 hover:text-red-500 disabled:opacity-40"
                  title="Hapus Event"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {!eventsList.length && (
            <div className="border border-neutral-200 p-6 text-center font-mono text-[10px] text-neutral-400">
              BELUM ADA EVENT. SILAKAN TAMBAHKAN EVENT PERTAMA ANDA.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SiteOpsPanel({ user }: { user: PublicUser }) {
  const [cfg, setCfg] = useState<SiteCfg | null>(null);
  const [traffic, setTraffic] = useState<TrafficData | null>(null);
  const [busyPage, setBusyPage] = useState('');
  const [msg, setMsg] = useState('');

  const loadAll = useCallback(() => {
    siteOps.config().then((r) => setCfg(r.site)).catch(() => setMsg('Gagal memuat site config'));
    siteOps.traffic().then(setTraffic).catch(() => {});
  }, []);
  useEffect(() => { loadAll(); }, [loadAll]);

  const setPage = async (path: string, patch: { status?: 'LIVE' | 'MAINTENANCE'; nav?: boolean }) => {
    if (!cfg) return;
    setBusyPage(path);
    setMsg('');
    try {
      const pages: Record<string, { status?: string; nav?: boolean }> = {
        [path]: { ...(cfg.pages[path] || { status: 'LIVE', nav: true }), ...patch },
      };
      const r = await siteOps.saveConfig(pages as any);
      setCfg(r.site);
      setMsg(`${path} diperbarui`);
    } catch (e: any) {
      setMsg(e.message || 'Gagal menyimpan');
    } finally {
      setBusyPage('');
    }
  };

  const maxDay = Math.max(1, ...(traffic?.pages || []).map((pg) => pg.day));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-mono text-xl font-black tracking-tighter">SITE OPS</h1>
          <p className="font-mono text-xs text-neutral-500">Kendali halaman publik & traffic DGTLZ.</p>
        </div>
        <button onClick={loadAll} className="flex items-center gap-1.5 border-2 border-neutral-900 bg-white px-3 py-1.5 text-xs font-bold hover:bg-electric-blue hover:text-white transition-colors">
          <RotateCcw className="w-3 h-3" /> REFRESH
        </button>
      </div>
      {msg && <div className="border-2 border-neutral-900 bg-white px-3 py-2 font-mono text-[11px] font-bold">{msg}</div>}

      {/* VITALS KPI STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
        {[
          { label: 'VIEWS / 24H', value: traffic ? String(traffic.summary.views24) : '...' },
          { label: 'VISITORS / 24H', value: traffic ? String(traffic.summary.sessions24) : '...' },
          { label: 'TOTAL PAGEVIEWS', value: traffic ? String(traffic.summary.total) : '...' },
          { label: 'PAGES LIVE', value: cfg ? `${Object.values(cfg.pages).filter((pg: any) => pg.status === 'LIVE').length}/${SITE_PAGE_LIST.length}` : '...' },
        ].map((k) => (
          <div key={k.label} className="border-2 border-neutral-900 bg-white p-3">
            <div className="flex justify-between items-center text-neutral-500 text-[10px] font-bold">
              <span>{k.label}</span>
              <Activity className="w-3 h-3 text-electric-blue" />
            </div>
            <div className="text-2xl font-black mt-1">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PAGE CONTROL */}
        <section className="border-2 border-neutral-900 bg-white">
          <div className="flex items-center justify-between border-b-2 border-neutral-900 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-electric-blue" />
              <h2 className="font-mono text-xs font-black tracking-widest uppercase">PAGE CONTROL</h2>
            </div>
            <span className="font-mono text-[10px] text-neutral-400">STATUS + NAV</span>
          </div>
          <div className="divide-y divide-neutral-200">
            {SITE_PAGE_LIST.map((pg) => {
              const st = cfg?.pages[pg.path];
              const live = st?.status !== 'MAINTENANCE';
              const navOn = st?.nav !== false;
              return (
                <div key={pg.path} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <div className="min-w-0">
                    <div className="font-mono text-xs font-bold truncate">{pg.label} <span className="text-neutral-400 font-normal">{pg.path}</span></div>
                    <div className="font-mono text-[10px] text-neutral-400">{live ? 'PUBLIC' : 'UNDER RECONSTRUCTION'}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setPage(pg.path, { nav: !navOn })}
                      disabled={busyPage === pg.path}
                      title={navOn ? 'Sembunyikan dari navbar' : 'Tampilkan di navbar'}
                      className={`font-mono text-[10px] font-black px-2 py-1 border-2 transition-colors disabled:opacity-40 ${navOn ? 'border-neutral-900 text-neutral-900' : 'border-neutral-300 text-neutral-400'}`}
                    >
                      {navOn ? 'NAV ON' : 'NAV OFF'}
                    </button>
                    <button
                      onClick={() => setPage(pg.path, { status: live ? 'MAINTENANCE' : 'LIVE' })}
                      disabled={busyPage === pg.path}
                      className={`font-mono text-[10px] font-black px-2 py-1 border-2 transition-colors disabled:opacity-40 ${live ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-amber-500 text-white border-amber-500'}`}
                    >
                      {busyPage === pg.path ? '...' : live ? 'LIVE' : 'MAINT'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {cfg?.updatedAt && (
            <div className="border-t border-neutral-200 px-4 py-2 font-mono text-[10px] text-neutral-400">
              LAST UPDATE: {new Date(cfg.updatedAt).toLocaleString('id-ID')}
            </div>
          )}
        </section>

        {/* TRAFFIC RADAR */}
        <section className="border-2 border-neutral-900 bg-white">
          <div className="flex items-center justify-between border-b-2 border-neutral-900 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-electric-blue" />
              <h2 className="font-mono text-xs font-black tracking-widest uppercase">TRAFFIC RADAR</h2>
            </div>
            <span className="font-mono text-[10px] text-neutral-400">VIEWS 24H / 7D / ALL</span>
          </div>
          <div className="divide-y divide-neutral-200">
            {(traffic?.pages || []).length === 0 && (
              <div className="px-4 py-6 font-mono text-xs text-neutral-400">BELUM ADA DATA TRAFFIC — TERKUMPUL OTOMATIS SAAT PENGUNJUNG BUKA SITE.</div>
            )}
            {(traffic?.pages || []).slice(0, 9).map((pg) => (
              <div key={pg.path} className="px-4 py-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold truncate">{pg.path}</span>
                  <span className="text-neutral-500 flex-shrink-0 ml-2">
                    <b className="text-neutral-900">{pg.day}</b> / {pg.week} / {pg.all}
                  </span>
                </div>
                <div className="h-1.5 bg-neutral-100 mt-1">
                  <div className="h-full bg-electric-blue" style={{ width: `${Math.round((pg.day / maxDay) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
          {traffic?.funnel && (
            <div className="border-t-2 border-neutral-900 px-4 py-3">
              <div className="font-mono text-[10px] font-black text-neutral-500 tracking-wider mb-2">FUNNEL HARI INI</div>
              <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
                <span className="border border-neutral-300 px-2 py-1">HOME <b>{traffic.funnel.home}</b></span>
                <span className="text-neutral-400">→</span>
                <span className="border border-neutral-300 px-2 py-1">LOGIN <b>{traffic.funnel.login}</b></span>
                <span className="text-neutral-400">→</span>
                <span className="border border-neutral-300 px-2 py-1">REGISTER <b>{traffic.funnel.register}</b></span>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* LIVE VISIT FEED */}
      <section className="border-2 border-neutral-900 bg-white">
        <div className="flex items-center justify-between border-b-2 border-neutral-900 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-electric-blue" />
            <h2 className="font-mono text-xs font-black tracking-widest uppercase">LIVE VISIT FEED</h2>
          </div>
          <span className="font-mono text-[10px] text-neutral-400">12 TERAKHIR / 24H</span>
        </div>
        <div className="divide-y divide-neutral-200 max-h-72 overflow-y-auto">
          {(traffic?.recent || []).length === 0 && (
            <div className="px-4 py-4 font-mono text-xs text-neutral-400">BELUM ADA KUNJUNGAN.</div>
          )}
          {(traffic?.recent || []).map((r, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-1.5 font-mono text-[11px]">
              <span className="font-bold">{r.path}</span>
              <span className="text-neutral-400 flex gap-3">
                <span className="uppercase">{r.device}</span>
                <span>{new Date(r.ts).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function OpsPanel({
  user,
  projects,
  leads,
  allUsers,
  searchQuery,
  onReload,
}: {
  user: PublicUser;
  projects: Project[] | null;
  leads: any[] | null;
  allUsers: PublicUser[] | null;
  searchQuery: string;
  onReload: () => void;
}) {
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [title, setTitle] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [phase, setPhase] = useState<'DISCOVERY' | 'BUILD' | 'REVIEW' | 'LIVE'>('DISCOVERY');
  const [targetAudience, setTargetAudience] = useState('UMKM Bali');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [rawDeliverables, setDeliverables] = useState('Brand Blueprint, High-Conv Landing Page, Payment Gateway Wire');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const [busyProject, setBusyProject] = useState<string | null>(null);
  const [detailTask, setDetailTask] = useState<{ project: Project; index: number } | null>(null);

  const toggleDeliverable = async (projectId: string, idx: number, next: boolean) => {
    setBusyProject(projectId);
    try {
      const proj = (projects || []).find((x) => x.id === projectId);
      if (!proj) return;
      const nextDeliverables = proj.deliverables.map((d, i) => (i === idx ? { ...d, done: next } : d));
      await projectsApi.update(projectId, { deliverables: nextDeliverables });
      onReload();
    } catch {
      // silent
    } finally {
      setBusyProject(null);
    }
  };

  const rp = (n: number) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');

  const filteredProjects = (projects || []).filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.clientEmail.toLowerCase().includes(q) || p.phase.toLowerCase().includes(q);
  });

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !clientEmail) return;
    setSubmitting(true);
    setMsg('');

    try {
      const items = rawDeliverables
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean)
        .map((entry) => {
          // Format: Nama | HIGH | DEVELOPMENT | 2026-09-25  (opsional setelah nama)
          const parts = entry.split('|').map((x) => x.trim());
          const name = parts[0];
          const priority = (['HIGH', 'MEDIUM', 'LOW'].includes(parts[1]) ? parts[1] : 'MEDIUM') as Priority;
          const category = (['DEVELOPMENT', 'DESIGN', 'MARKETING', 'ADMIN'].includes(parts[2]) ? parts[2] : undefined) as DeliverableCategory | undefined;
          const dueDate = /^\d{4}-\d{2}-\d{2}$/.test(parts[3] || '') ? parts[3] : undefined;
          return { name, priority, category, dueDate };
        })
        .map((name) => ({ name, done: false }));

      const deliverableNames = rawDeliverables.split(',').map(d => d.trim()).filter(Boolean);
      await projectsApi.create({
        title,
        clientEmail,
        budget: budget ? Number(budget) : undefined,
        deadline: deadline || undefined,
        deliverables: deliverableNames,
      });

      setTitle('');
      setClientEmail('');
      setBudget('');
      setDeadline('');
      setShowProvisionModal(false);
      onReload();
    } catch (err: any) {
      setMsg(err.message || 'Failed to provision project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePhase = async (id: string, newPhase: string) => {
    try {
      await projectsApi.update(id, { phase: newPhase });
      onReload();
    } catch {
      // ignore
    }
  };

  const calculateAutoProgress = (p: Project) => {
    if (!p.deliverables || p.deliverables.length === 0) return 0;
    const completed = p.deliverables.filter((d) => d.done || d.approval === 'APPROVED').length;
    return Math.round((completed / p.deliverables.length) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-neutral-900 pb-4">
        <div>
          <h1 className="text-xl font-black tracking-tight text-neutral-900 uppercase">
            OPERATIONAL PIPELINE & PROVISIONING
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-1">
            Realtime project tracking, client milestones, and automated deliverable progress.
          </p>
        </div>

        {user.role !== 'client' && (
          <button
            onClick={() => setShowProvisionModal(!showProvisionModal)}
            className="border-2 border-neutral-900 bg-electric-blue text-white px-4 py-2 text-xs font-bold font-mono hover:bg-neutral-900 transition-colors flex items-center gap-2 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
          >
            <Plus className="w-4 h-4" />
            <span>PROVISION NEW PROJECT</span>
          </button>
        )}
      </div>

      {/* Provisioning Drawer / Form */}
      {showProvisionModal && (
        <form onSubmit={handleCreate} className="border-2 border-neutral-900 bg-white p-5 space-y-4 font-mono shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
            <span className="text-xs font-black uppercase text-electric-blue">NEW PIPELINE UNIT PROVISIONING</span>
            <button type="button" onClick={() => setShowProvisionModal(false)} className="text-xs font-bold text-neutral-400 hover:text-neutral-900">
              CLOSE
            </button>
          </div>

          {msg && <div className="p-2 border border-red-500 bg-red-50 text-red-700 text-xs">{msg}</div>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-neutral-700 block mb-1">PROJECT TITLE *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Clinic Estetika Website & App"
                className="w-full border-2 border-neutral-900 p-2 outline-none focus:border-electric-blue"
              />
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">CLIENT EMAIL *</label>
              <input
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="client@company.com"
                className="w-full border-2 border-neutral-900 p-2 outline-none focus:border-electric-blue"
              />
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">TARGET AUDIENCE / SEGMENT</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full border-2 border-neutral-900 p-2 outline-none focus:border-electric-blue bg-white font-bold"
              >
                <option value="UMKM Bali">UMKM Bali / F&B Local</option>
                <option value="Klinik Estetika">Klinik Estetika & Health</option>
                <option value="Agency B2B">B2B Enterprise / Agency</option>
                <option value="Fintech & Gateway">Fintech / E-Commerce</option>
                <option value="General Public">General Consumer</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-neutral-700 block mb-1">INITIAL PHASE</label>
              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value as any)}
                className="w-full border-2 border-neutral-900 p-2 outline-none focus:border-electric-blue bg-white font-bold"
              >
                <option value="DISCOVERY">DISCOVERY</option>
                <option value="BUILD">BUILD</option>
                <option value="REVIEW">REVIEW</option>
                <option value="LIVE">LIVE</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">PROJECT BUDGET (IDR)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 25000000"
                className="w-full border-2 border-neutral-900 p-2 outline-none focus:border-electric-blue"
              />
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">TARGET DEADLINE</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full border-2 border-neutral-900 p-2 outline-none focus:border-electric-blue"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="font-bold text-neutral-700 block mb-1">
              DELIVERABLE MILESTONES (KOMMA SEPARATED)
            </label>
            <input
              type="text"
              value={rawDeliverables}
              onChange={(e) => setDeliverables(e.target.value)}
              className="w-full border-2 border-neutral-900 p-2 outline-none focus:border-electric-blue"
            />
            <p className="text-[10px] text-neutral-500 mt-1">
              Persentase progres proyek otomatis diupdate saat deliverable dicentang atau di-approve oleh klien.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowProvisionModal(false)}
              className="px-4 py-2 border-2 border-neutral-900 text-xs font-bold hover:bg-neutral-100"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-neutral-900 text-white text-xs font-bold hover:bg-electric-blue transition-colors disabled:opacity-50"
            >
              {submitting ? 'PROVISIONING...' : 'CONFIRM PROVISIONING'}
            </button>
          </div>
        </form>
      )}

      {/* Projects Pipeline Cards */}
      <div className="space-y-4 font-mono">
        {filteredProjects.length === 0 ? (
          <div className="border-2 border-neutral-900 bg-white p-12 text-center text-neutral-400 text-xs">
            NO PROJECTS MATCH CURRENT DIRECTIVE.
          </div>
        ) : (
          filteredProjects.map((p) => {
            const autoP = calculateAutoProgress(p);
            return (
              <div
                key={p.id}
                className="border-2 border-neutral-900 bg-white p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-neutral-900 uppercase">{p.title}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-neutral-900 text-white font-bold">{p.phase}</span>
                    </div>
                    <div className="text-xs text-neutral-500 mt-1 flex flex-wrap items-center gap-3">
                      <span>CLIENT: <strong className="text-neutral-800">{p.clientEmail}</strong></span>
                      {p.budget && <span>BUDGET: <strong className="text-emerald-700">{rp(p.budget)}</strong></span>}
                      {p.deadline && <span>DUE: <strong className="text-neutral-800">{new Date(p.deadline).toLocaleDateString()}</strong></span>}
                    </div>
                  </div>

                  {user.role !== 'client' && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-neutral-400">PHASE:</span>
                      <select
                        value={p.phase}
                        onChange={(e) => handleUpdatePhase(p.id, e.target.value)}
                        className="border-2 border-neutral-900 px-2 py-1 text-xs bg-[#F4F3EF] font-bold outline-none"
                      >
                        <option value="DISCOVERY">DISCOVERY</option>
                        <option value="BUILD">BUILD</option>
                        <option value="REVIEW">REVIEW</option>
                        <option value="LIVE">LIVE</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Automated Progress Bar with Label */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-neutral-500 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      MILESTONE DELIVERABLES PROGRESS
                    </span>
                    <span className="text-electric-blue font-black">{autoP}% COMPLETED</span>
                  </div>
                  <div className="w-full bg-neutral-100 border border-neutral-300 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-electric-blue h-full transition-all duration-500"
                      style={{ width: `${autoP}%` }}
                    />
                  </div>
                </div>

                {/* Deliverable Items Checklist */}
                <div className="border border-neutral-200 bg-neutral-50 p-3 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                    DELIVERABLES & APPROVAL STATUS:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {(p.deliverables || []).map((d, idx) => {
                      const isApproved = d.done || d.approval === 'APPROVED';
                      const prio = getPriority(d as DeckDeliverable);
                      const cat = (d as DeckDeliverable).category;
                      const catStyle = cat ? CATEGORY_STYLES[cat] : null;
                      const due = (d as DeckDeliverable).dueDate;
                      const overdue = isDueToday(d as DeckDeliverable);
                      return (
                        <div
                          key={idx}
                          className={`p-2 border flex items-start justify-between gap-2 ${
                            isApproved ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : overdue ? 'bg-amber-50 border-amber-400' : 'bg-white border-neutral-300 text-neutral-800'
                          }`}
                        >
                          <div className="flex items-start gap-2 min-w-0">
                            <button
                              type="button"
                              title={isApproved ? 'Sudah selesai' : 'Tandai selesai'}
                              disabled={isApproved || busyProject === p.id}
                              onClick={() => toggleDeliverable(p.id, idx, !isApproved)}
                              className={`mt-0.5 w-4 h-4 flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
                                isApproved
                                  ? 'bg-emerald-600 border-emerald-600'
                                  : 'border-neutral-400 bg-white hover:border-electric-blue'
                              } ${busyProject === p.id ? 'opacity-50' : ''}`}
                            >
                              {isApproved && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </button>
                            <div className="min-w-0">
                              <button
                                type="button"
                                onClick={() => setDetailTask({ project: p, index: idx })}
                                className="truncate font-bold text-left block hover:text-electric-blue hover:underline"
                                title="Buka detail tugas"
                              >
                                {d.name}
                              </button>
                              <div className="flex flex-wrap items-center gap-1 mt-1">
                                <span className={`text-[8px] font-black px-1 py-px border ${PRIORITY_STYLES[prio]}`}>
                                  {prio === 'HIGH' ? 'HIGH' : prio}
                                </span>
                                {catStyle && (
                                  <span className={`text-[8px] font-black px-1 py-px border ${catStyle}`}>{cat}</span>
                                )}
                                {overdue && (
                                  <span className="text-[8px] font-black px-1 py-px border bg-amber-100 text-amber-900 border-amber-500">
                                    DUE {new Date(due as string).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                  </span>
                                )}
                                {due && !overdue && !isApproved && (
                                  <span className="text-[8px] font-black px-1 py-px border bg-neutral-100 text-neutral-500 border-neutral-300">
                                    {new Date(due).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className="text-[9px] font-black uppercase flex-shrink-0">
                            {d.approval ? d.approval : d.done ? 'DONE' : 'PENDING'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {detailTask && (
        <DetailTaskOverlay
          task={{ project: detailTask.project, index: detailTask.index }}
          onClose={() => setDetailTask(null)}
          busy={busyProject === detailTask.project.id}
          onToggleDone={async (next) => {
            const proj = detailTask.project;
            setBusyProject(proj.id);
            try {
              const nextDeliverables = proj.deliverables.map((d, i) => (i === detailTask.index ? { ...d, done: next } : d));
              await projectsApi.update(proj.id, { deliverables: nextDeliverables });
              onReload();
              setDetailTask(null);
            } catch {
              // silent
            } finally {
              setBusyProject(null);
            }
          }}
        />
      )}
    </div>
  );
}

// =============================================================
// CLIENT PORTAL: Review & Approval Center
// =============================================================
function ClientPanel({
  me,
  projects,
  onReload,
}: {
  me: PublicUser;
  projects: Project[];
  onReload: () => void;
}) {
  const [revisionNote, setRevisionNote] = useState('');
  const [activeItem, setActiveItem] = useState<{ projectId: string; index: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const myProjects = projects.filter((p) => p.clientEmail.toLowerCase() === me.email.toLowerCase());

  const handleApprove = async (projectId: string, index: number) => {
    setSubmitting(true);
    try {
      const p = projects.find(proj => proj.id === projectId); if (p) { const delivs = [...p.deliverables]; delivs[index] = { ...delivs[index], done: true, approval: 'APPROVED' }; await projectsApi.update(projectId, { deliverables: delivs }); }
      onReload();
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (e: FormEvent) => {
    e.preventDefault();
    if (!activeItem || !revisionNote) return;
    setSubmitting(true);
    try {
      const p = myProjects.find(proj => proj.id === activeItem.projectId); if (p) { const delivs = [...p.deliverables]; delivs[activeItem.index] = { ...delivs[activeItem.index], done: false, approval: 'REVISI', approvalNote: revisionNote }; await projectsApi.update(activeItem.projectId, { deliverables: delivs }); }
      setActiveItem(null);
      setRevisionNote('');
      onReload();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="border-b-2 border-neutral-900 pb-4">
        <h1 className="text-xl font-black uppercase">CLIENT ACCESS PORTAL // DELIVERABLE REVIEW</h1>
        <p className="text-xs text-neutral-500 mt-1">Review live deliverables, sign off completed work, or request revisions.</p>
      </div>

      {myProjects.length === 0 ? (
        <div className="border-2 border-neutral-900 bg-white p-8 text-center text-xs text-neutral-500">
          NO PROJECTS REGISTERED UNDER THIS CLIENT ACCOUNT.
        </div>
      ) : (
        myProjects.map((p) => (
          <div key={p.id} className="border-2 border-neutral-900 bg-white p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-black uppercase">{p.title}</span>
              <span className="text-xs px-2 py-0.5 bg-neutral-900 text-white font-bold uppercase">{p.phase}</span>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-neutral-400 uppercase">DELIVERABLES APPROVAL QUEUE:</span>
              {p.deliverables?.map((d, idx) => (
                <div key={idx} className="border-2 border-neutral-200 p-3 bg-neutral-50 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-neutral-900 block">{d.name}</span>
                    {d.approvalNote && <span className="text-[10px] text-red-600 block mt-0.5">Catatan: {d.approvalNote}</span>}
                  </div>

                  <div className="flex items-center gap-2">
                    {d.approval === 'APPROVED' ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> APPROVED
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleApprove(p.id, idx)}
                          disabled={submitting}
                          className="px-3 py-1 bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
                        >
                          SETUJU ✓
                        </button>
                        <button
                          onClick={() => setActiveItem({ projectId: p.id, index: idx })}
                          className="px-3 py-1 border border-neutral-900 font-bold hover:bg-neutral-900 hover:text-white transition-colors"
                        >
                          MOHON REVISI
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Inline Revision Form Modal */}
            {activeItem && (
              <form onSubmit={handleReject} className="border-2 border-red-500 bg-red-50/50 p-4 space-y-2 text-xs">
                <span className="font-bold text-red-900 block">CATATAN PERBAIKAN / REVISI:</span>
                <textarea
                  required
                  value={revisionNote}
                  onChange={(e) => setRevisionNote(e.target.value)}
                  placeholder="Jelaskan bagian mana yang perlu diperbaiki tim..."
                  className="w-full border border-red-400 p-2 bg-white outline-none"
                  rows={2}
                />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setActiveItem(null)} className="px-2 py-1 text-neutral-600">BATAL</button>
                  <button type="submit" disabled={submitting} className="px-3 py-1 bg-red-600 text-white font-bold">KIRIM CATATAN</button>
                </div>
              </form>
            )}
          </div>
        ))
      )}
    </div>
  );
}

// =============================================================
// ADMIN PANEL: Leads & User Management
// =============================================================
function AdminPanel({
  leads,
  allUsers,
  searchQuery,
  onReload,
}: {
  leads: any[] | null;
  allUsers: PublicUser[] | null;
  searchQuery: string;
  onReload: () => void;
}) {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'NEW'>('NEW');

  const filteredLeads = (leads || []).filter((l) => {
    if (activeFilter === 'NEW' && l.status !== 'NEW') return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (l.name || '').toLowerCase().includes(q) ||
      (l.email || '').toLowerCase().includes(q) ||
      (l.service || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-mono">
      <div className="flex justify-between items-center border-b-2 border-neutral-900 pb-4">
        <div>
          <h1 className="text-xl font-black uppercase">INBOUND LEADS & ACCESS DIRECTORY</h1>
          <p className="text-xs text-neutral-500 mt-1">Manage marketing leads and team system directory.</p>
        </div>

        <div className="flex border-2 border-neutral-900">
          <button
            onClick={() => setActiveFilter('NEW')}
            className={`px-3 py-1 text-xs font-bold ${activeFilter === 'NEW' ? 'bg-neutral-900 text-white' : 'bg-white'}`}
          >
            NEW LEADS
          </button>
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1 text-xs font-bold ${activeFilter === 'ALL' ? 'bg-neutral-900 text-white' : 'bg-white'}`}
          >
            ALL LEADS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLeads.map((l) => (
          <div key={l.id} className="border-2 border-neutral-900 bg-white p-4 space-y-2 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-black text-neutral-900 block">{l.name || l.email}</span>
                <span className="text-[10px] text-neutral-500">{l.email}</span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.2 font-bold uppercase ${l.status === 'NEW' ? 'bg-electric-blue text-white' : 'bg-neutral-200 text-neutral-800'}`}>
                {l.status}
              </span>
            </div>

            <div className="text-xs bg-[#F4F3EF] p-2 border border-neutral-200">
              <span className="text-[9px] text-neutral-400 block uppercase">SERVICE REQUESTED:</span>
              <span className="font-bold">{l.service || 'General Inquiry'}</span>
              {l.notes && <p className="text-neutral-600 mt-1 text-[11px]">{l.notes}</p>}
            </div>

            {l.phone && (
              <a
                href={`https://wa.me/${l.phone.replace(/^0/, '62').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="block text-center py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              >
                RESPONS VIA WHATSAPP ({l.phone})
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
