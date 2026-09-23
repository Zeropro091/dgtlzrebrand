import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Layers,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  Network,
  Terminal,
  Search,
  SlidersHorizontal,
  Activity,
  ArrowRight,
  ChevronDown,
  Globe,
  Radio,
  Server,
  Maximize2,
  Filter,
  CheckCheck,
  Flame,
  KeyRound,
  ExternalLink,
  Code2,
  Database,
  Gauge,
  CornerDownRight
} from 'lucide-react';

import { RoutePayg } from '../components/RoutePayg';

interface RoutePlan {
  id: string;
  name: string;
  category: 'featured' | 'claude' | 'china';
  price: string;
  priceNum: number;
  period: 'hari' | 'minggu' | 'bulan';
  token: string;
  tokenNum: number;
  mainModel: string;
  availableModelsCount: number;
  slot?: number | string;
  notes?: string;
  isPopular?: boolean;
  isPromo?: boolean;
  isNew?: boolean;
  isActive?: boolean;
  unlimitedRequest: boolean;
  prioritySupport: boolean;
  modelTags?: string[];
  latency?: string;
  contextWindow?: string;
  reliability?: string;
}

const PLANS_DATA: RoutePlan[] = [
  // Featured Plan
  {
    id: 'combo-harian-85m',
    name: 'Combo Harian 85M',
    category: 'featured',
    price: 'Rp 9.900',
    priceNum: 9900,
    period: 'hari',
    token: '85M',
    tokenNum: 85,
    mainModel: 'DeepSeek V4.1 Flash, Gemini 3.8 Flash High',
    availableModelsCount: 6,
    notes: 'Akses instan multi-model harian seimbang',
    unlimitedRequest: false,
    prioritySupport: true,
    modelTags: ['DeepSeek V4.1', 'Gemini 3.8', 'GLM-5.3', 'Qwen-3.8'],
    latency: '< 180ms',
    contextWindow: '128K - 1M',
    reliability: '99.9%'
  },
  {
    id: 'combo-lite-30m',
    name: 'Combo Lite 30M',
    category: 'featured',
    price: 'Rp 4.900',
    priceNum: 4900,
    period: 'hari',
    token: '30M',
    tokenNum: 30,
    mainModel: 'DeepSeek V4.1 Flash, Gemini 3.8 Flash High',
    availableModelsCount: 6,
    notes: 'Pilihan paling hemat untuk testing & kebutuhan ringan',
    unlimitedRequest: false,
    prioritySupport: true,
    modelTags: ['DeepSeek Lite', 'Gemini Flash', 'Qwen'],
    latency: '< 140ms',
    contextWindow: '64K - 128K',
    reliability: '99.8%'
  },
  {
    id: 'combo-murah-250m',
    name: 'Combo Murah 250M',
    category: 'featured',
    price: 'Rp 34.900',
    priceNum: 34900,
    period: 'minggu',
    token: '250M',
    tokenNum: 250,
    mainModel: 'DeepSeek V4.1 Flash, Gemini 3.8 Flash High',
    availableModelsCount: 6,
    notes: 'Paling Populer, Aktif',
    isPopular: true,
    isActive: true,
    unlimitedRequest: true,
    prioritySupport: true,
    modelTags: ['High Volume', 'DeepSeek V4.1', 'Gemini High', 'Auto Failover'],
    latency: '< 160ms',
    contextWindow: '128K - 1M',
    reliability: '99.95%'
  },
  {
    id: 'deepseek-v41-100m',
    name: 'DeepSeek V4.1 Flash 100M',
    category: 'featured',
    price: 'Rp 9.900',
    priceNum: 9900,
    period: 'hari',
    token: '100M',
    tokenNum: 100,
    mainModel: 'DeepSeek V4.1 Flash',
    availableModelsCount: 5,
    notes: 'Paling Populer, Promo',
    isPopular: true,
    isPromo: true,
    unlimitedRequest: true,
    prioritySupport: true,
    modelTags: ['DeepSeek Pure', 'Code Optimized', 'JSON Mode'],
    latency: '< 120ms',
    contextWindow: '128K',
    reliability: '99.9%'
  },

  // Claude Model
  {
    id: 'claude-opus-5',
    name: 'Claude Opus 5',
    category: 'claude',
    price: 'Rp 19.900',
    priceNum: 19900,
    period: 'hari',
    token: '10M',
    tokenNum: 10,
    mainModel: 'Claude Opus 5 (Fast Latency)',
    availableModelsCount: 5,
    notes: 'Paling Populer, New',
    isPopular: true,
    isNew: true,
    unlimitedRequest: true,
    prioritySupport: true,
    modelTags: ['Frontier Reasoning', 'Deep Architectural Logic', 'Anthropic Protocol'],
    latency: '< 290ms',
    contextWindow: '200K',
    reliability: '99.9%'
  },
  {
    id: 'claude-opus-5-30m',
    name: 'Claude Opus 5 30M',
    category: 'claude',
    price: 'Rp 47.000',
    priceNum: 47000,
    period: 'hari',
    token: '30M',
    tokenNum: 30,
    mainModel: 'Claude Opus 5 (Fast Latency)',
    availableModelsCount: 5,
    notes: 'High volume reasoning untuk coding & technical specs',
    isNew: true,
    unlimitedRequest: true,
    prioritySupport: true,
    modelTags: ['Heavy Coding', 'Architect Spec', 'Full Context'],
    latency: '< 280ms',
    contextWindow: '200K',
    reliability: '99.95%'
  },

  // China Model
  {
    id: 'kimi-k3-20m',
    name: 'Kimi K3 20M',
    category: 'china',
    price: 'Rp 9.900',
    priceNum: 9900,
    period: 'hari',
    token: '20M',
    tokenNum: 20,
    mainModel: 'Kimi K3 (Moonshot Architecture)',
    availableModelsCount: 8,
    slot: '16 (Promo)',
    isPromo: true,
    unlimitedRequest: true,
    prioritySupport: true,
    modelTags: ['Ultra Long Context', 'Document Extraction', 'Moonshot API'],
    latency: '< 210ms',
    contextWindow: '2M Tokens',
    reliability: '99.8%'
  },
  {
    id: 'kimi-k3-40m',
    name: 'Kimi K3 40M',
    category: 'china',
    price: 'Rp 19.900',
    priceNum: 19900,
    period: 'hari',
    token: '40M',
    tokenNum: 40,
    mainModel: 'Kimi K3 (Moonshot Architecture)',
    availableModelsCount: 8,
    slot: '18',
    unlimitedRequest: true,
    prioritySupport: true,
    modelTags: ['Book Processing', 'Massive PDF Parsing', 'Multi-file RAG'],
    latency: '< 200ms',
    contextWindow: '2M Tokens',
    reliability: '99.85%'
  },
  {
    id: 'qwen-38-max-50m',
    name: 'Qwen 3.8 Max 50M',
    category: 'china',
    price: 'Rp 19.900',
    priceNum: 19900,
    period: 'hari',
    token: '50M',
    tokenNum: 50,
    mainModel: 'Qwen 3.8 Max',
    availableModelsCount: 9,
    slot: '10 (Promo)',
    isPromo: true,
    unlimitedRequest: true,
    prioritySupport: true,
    modelTags: ['Alibaba Cloud Engine', 'Multilingual Master', 'Math & Code'],
    latency: '< 150ms',
    contextWindow: '128K',
    reliability: '99.9%'
  },
  {
    id: 'deepseek-v4-vision-exp',
    name: 'DeepSeek V4 Flash Vision Exp',
    category: 'china',
    price: 'Rp 9.900',
    priceNum: 9900,
    period: 'hari',
    token: '20M',
    tokenNum: 20,
    mainModel: 'DeepSeek V4 Flash 0731 + Vision Exp',
    availableModelsCount: 5,
    notes: 'Paling Populer, New',
    isPopular: true,
    isNew: true,
    unlimitedRequest: true,
    prioritySupport: true,
    modelTags: ['OCR & Vision', 'UI Screenshot Parsing', 'Spatial Recognition'],
    latency: '< 190ms',
    contextWindow: '128K',
    reliability: '99.7%'
  },
  {
    id: 'qwen-38-max-20m',
    name: 'Qwen 3.8 Max',
    category: 'china',
    price: 'Rp 9.900',
    priceNum: 9900,
    period: 'hari',
    token: '20M',
    tokenNum: 20,
    mainModel: 'Qwen 3.8 Max',
    availableModelsCount: 9,
    notes: 'Paling Populer, Promo',
    isPopular: true,
    isPromo: true,
    unlimitedRequest: true,
    prioritySupport: true,
    modelTags: ['Alibaba Qwen', 'General Reasoning', 'Ultra Fast'],
    latency: '< 140ms',
    contextWindow: '128K',
    reliability: '99.9%'
  },
  {
    id: 'glm-53-harian',
    name: 'GLM 5.3 Harian',
    category: 'china',
    price: 'Rp 11.900',
    priceNum: 11900,
    period: 'hari',
    token: '20M',
    tokenNum: 20,
    mainModel: 'GLM 5.3, Qwen3.6 Plus (Vision)',
    availableModelsCount: 6,
    slot: '20',
    notes: 'Paling Populer, New',
    isPopular: true,
    isNew: true,
    unlimitedRequest: true,
    prioritySupport: true,
    modelTags: ['Zhipu AI Frontier', 'Function Calling', 'GLM-Reasoning'],
    latency: '< 175ms',
    contextWindow: '128K',
    reliability: '99.85%'
  },
  {
    id: 'glm-53-40m',
    name: 'GLM 5.3 40M',
    category: 'china',
    price: 'Rp 19.900',
    priceNum: 19900,
    period: 'hari',
    token: '40M',
    tokenNum: 40,
    mainModel: 'GLM 5.3, Qwen3.6 Plus (Vision)',
    availableModelsCount: 6,
    slot: '18',
    unlimitedRequest: true,
    prioritySupport: true,
    modelTags: ['Zhipu AI 40M Pool', 'Vision Dual Routing', 'High Concurrency'],
    latency: '< 165ms',
    contextWindow: '128K',
    reliability: '99.9%'
  },
  {
    id: 'deepseek-v4-pro-0813',
    name: 'DeepSeek V4 Pro 0813',
    category: 'china',
    price: 'Rp 12.900',
    priceNum: 12900,
    period: 'hari',
    token: '20M',
    tokenNum: 20,
    mainModel: 'DeepSeek V4 Pro 0813 + Flash 0731 + Vision Exp',
    availableModelsCount: 5,
    slot: '28',
    notes: 'Paling Populer, New',
    isPopular: true,
    isNew: true,
    unlimitedRequest: true,
    prioritySupport: true,
    modelTags: ['Pro Architecture', 'Deep Thinking', 'Vision Exp Module'],
    latency: '< 220ms',
    contextWindow: '128K',
    reliability: '99.9%'
  },
];

const ROUTE_ARCHITECTURE_NODES = [
  {
    id: 'node-edge',
    label: 'DGTLZ INGRESS ROUTER',
    sub: 'Geo-DNS & Dynamic Load Balancer',
    type: 'gateway',
    metrics: '99.98% uptime // <15ms gateway overhead'
  },
  {
    id: 'node-failover',
    label: 'INTELLIGENT FAILOVER CORE',
    sub: 'Real-time Circuit Breakers & Token Pool Rotation',
    type: 'core',
    metrics: 'Automatic 429 / 502 fallback in 40ms'
  },
  {
    id: 'node-clusters',
    label: 'FRONTIER MODEL CLUSTERS',
    sub: 'Anthropic Opus / DeepSeek MoE / GLM-5.3 / Qwen / Kimi',
    type: 'endpoints',
    metrics: '14+ Integrated Endpoints'
  }
];

export function DgtlzRoute() {
  const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'claude' | 'china'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<RoutePlan | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTelemetryTab, setActiveTelemetryTab] = useState<'curl' | 'node' | 'python'>('curl');
  const [viewMode, setViewMode] = useState<'cards' | 'dense'>('cards');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Filter and search logic
  const filteredPlans = useMemo(() => {
    return PLANS_DATA.filter((plan) => {
      const matchesTab = activeTab === 'all' || plan.category === activeTab;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        plan.name.toLowerCase().includes(query) ||
        plan.mainModel.toLowerCase().includes(query) ||
        plan.token.toLowerCase().includes(query) ||
        plan.price.toLowerCase().includes(query) ||
        (plan.modelTags && plan.modelTags.some(t => t.toLowerCase().includes(query))) ||
        (plan.notes && plan.notes.toLowerCase().includes(query));

      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  // Pricing stats
  const stats = useMemo(() => {
    return {
      totalPlans: PLANS_DATA.length,
      featuredCount: PLANS_DATA.filter(p => p.category === 'featured').length,
      claudeCount: PLANS_DATA.filter(p => p.category === 'claude').length,
      chinaCount: PLANS_DATA.filter(p => p.category === 'china').length,
      minPrice: 'Rp 4.900',
      maxToken: '250M',
    };
  }, []);

  const getWaLink = (planName: string, price: string) => {
    const text = encodeURIComponent(
      `Halo tim DGTLZ! Saya mau pesan/aktivasi akses DGTLZ Route: "${planName}" (${price}). Mohon diproses.`
    );
    return `https://wa.me/6281237729115?text=${text}`;
  };

  const copyEndpointCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const codeSnippets = {
    curl: `curl https://route.dgtlz.com/v1/chat/completions \
  -H "Authorization: Bearer dgtlz_sk_live_99482..." \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-v4.1-flash",
    "messages": [{"role": "user", "content": "Execute system synthesis."}],
    "stream": true
  }'`,
    node: `import OpenAI from "openai";

const router = new OpenAI({
  apiKey: process.env.DGTLZ_ROUTE_KEY,
  baseURL: "https://route.dgtlz.com/v1"
});

const response = await router.chat.completions.create({
  model: "claude-opus-5",
  messages: [{ role: "user", content: "Optimize architecture." }]
});`,
    python: `import openai

client = openai.OpenAI(
    api_key="dgtlz_sk_live_...",
    base_url="https://route.dgtlz.com/v1"
)

stream = client.chat.completions.create(
    model="glm-5.3-reasoning",
    messages=[{"role": "user", "content": "Analyze token metrics."}],
    stream=True
)`
  };

  return (
    <div className="bg-off-white min-h-screen text-neutral-900 selection:bg-electric-blue selection:text-white">
      
      {/* 1. GRAND DGT.LZ ROUTE HERO BANNER */}
      <header className="border-b border-electric-blue bg-white relative overflow-hidden">
        {/* Top telemetry ticker strip */}
        <div className="bg-electric-blue text-white px-4 md:px-margin py-2 text-[11px] font-mono flex flex-wrap items-center justify-between gap-4 border-b border-electric-blue">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              ROUTER STATUS: OPTIMAL (14/14 ENDPOINTS ACTIVE)
            </span>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="hidden sm:inline text-white/80">LATENCY AVG: 168ms</span>
            <span className="hidden md:inline text-white/40">|</span>
            <span className="hidden md:inline text-white/80">FAILOVER: ZERO-DROP AUTO HEALING</span>
          </div>
          <div className="flex items-center gap-4 text-white/90">
            <span className="font-bold tracking-widest text-[10px] uppercase bg-white/10 px-2 py-0.5 border border-white/20">
              API PROTOCOL V2.4
            </span>
            <span className="text-[10px] text-white/70">OPENAI & ANTHROPIC COMPATIBLE</span>
          </div>
        </div>

        {/* Hero Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Headline & Manifesto */}
          <div className="lg:col-span-8 p-6 md:p-margin lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-electric-blue">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="font-label-caps bg-electric-blue text-white px-3 py-1 font-bold">
                  HIGH-THROUGHPUT AI GATEWAY
                </span>
                <span className="font-label-caps border border-electric-blue text-electric-blue px-3 py-1 font-bold">
                  AFTER INTELLIGENCE INFRASTRUCTURE
                </span>
              </div>

              <h1 className="font-display-xl uppercase leading-none tracking-tight text-neutral-900">
                DGTLZ ROUTE
              </h1>
              
              <p className="font-serif text-xl md:text-2xl lg:text-3xl text-electric-blue italic mt-4 max-w-2xl leading-snug">
                Frontier LLM aggregation engine — Claude Opus 5, DeepSeek V4.1, GLM-5.3, Kimi & Qwen dalam satu unified pipeline.
              </p>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-b border-electric-blue/30 py-4 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block">Total Endpoints</span>
                  <span className="text-xl font-serif font-bold text-electric-blue">{stats.totalPlans}+ Tiers</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block">Starting Price</span>
                  <span className="text-xl font-serif font-bold text-neutral-900">{stats.minPrice}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block">Top Token Pool</span>
                  <span className="text-xl font-serif font-bold text-neutral-900">{stats.maxToken}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block">Integration</span>
                  <span className="text-xl font-serif font-bold text-electric-blue">Drop-in 100%</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 pt-4 items-center font-mono text-xs">
              <a
                href="#catalog-section"
                className="px-8 py-4 bg-electric-blue text-white font-bold uppercase tracking-wider hover:bg-blue-800 transition-colors flex items-center gap-2 shadow-sm"
              >
                PILIH TIKET & PAKET ROUTE <ArrowDownRightIcon />
              </a>
              <a
                href="#interactive-terminal"
                className="px-6 py-4 border border-electric-blue text-electric-blue font-bold uppercase tracking-wider hover:bg-electric-blue/5 transition-colors flex items-center gap-2"
              >
                <Terminal className="w-4 h-4" /> TEST LIVE ROUTER SPEC
              </a>
            </div>
          </div>

          {/* Right Column: Dynamic Architectural HUD */}
          <div className="lg:col-span-4 bg-off-white/80 p-6 md:p-8 flex flex-col justify-between font-mono text-xs relative overflow-hidden">
            <div className="absolute inset-0 dither-pattern opacity-10 pointer-events-none"></div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between border-b border-electric-blue pb-3">
                <span className="font-bold text-electric-blue text-xs uppercase flex items-center gap-2">
                  <Activity className="w-4 h-4 animate-spin text-electric-blue" />
                  GATEWAY TELEMETRY
                </span>
                <span className="text-[10px] bg-electric-blue/10 text-electric-blue px-2 py-0.5 font-bold">
                  2026.09 PROD
                </span>
              </div>

              {/* Node Visualization */}
              <div className="space-y-3">
                {ROUTE_ARCHITECTURE_NODES.map((node, i) => (
                  <div 
                    key={node.id} 
                    className="border border-neutral-300 bg-white p-3 hover:border-electric-blue transition-colors relative"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-electric-blue">0{i + 1} // {node.type.toUpperCase()}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-electric-blue"></span>
                    </div>
                    <div className="font-bold text-neutral-900 text-xs">{node.label}</div>
                    <div className="text-[11px] text-neutral-600 mt-0.5">{node.sub}</div>
                    <div className="mt-2 pt-2 border-t border-dashed border-neutral-200 text-[10px] text-neutral-500 font-mono">
                      {node.metrics}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-neutral-300 bg-white/60 p-3">
              <div className="text-[10px] text-neutral-500 uppercase">Architecture Advantage:</div>
              <div className="text-neutral-800 text-[11px] mt-1 leading-snug">
                Bypass kuota sempit & rate limit individual. Satu API key membuka cluster model dunia dengan pricing mikro-transaksi lokal.
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. SPECIFICATION MATRIX / WHY ROUTE */}
      <section className="border-b border-electric-blue bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-electric-blue font-mono">
          <div className="p-6 md:p-8 flex flex-col justify-between hover:bg-off-white/40 transition-colors">
            <div>
              <div className="flex items-center justify-between text-electric-blue mb-4">
                <span className="text-2xl font-serif font-bold">01/</span>
                <KeyRound className="w-5 h-5 text-electric-blue" />
              </div>
              <h3 className="font-serif font-bold text-lg text-neutral-900 uppercase">
                Single Unified Key
              </h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Tidak perlu mendaftar kartu kredit luar negeri atau mengelola puluhan API console terpisah. Cukup satu base endpoint untuk switch Anthropic, DeepSeek, GLM, dan Qwen.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-neutral-200 text-[10px] text-neutral-500 uppercase tracking-wider">
              PROTOCOL // MULTI-ORIGIN PROXY
            </div>
          </div>

          <div className="p-6 md:p-8 flex flex-col justify-between hover:bg-off-white/40 transition-colors">
            <div>
              <div className="flex items-center justify-between text-electric-blue mb-4">
                <span className="text-2xl font-serif font-bold">02/</span>
                <Flame className="w-5 h-5 text-electric-blue" />
              </div>
              <h3 className="font-serif font-bold text-lg text-neutral-900 uppercase">
                Mikro-Paket Tanpa Overpay
              </h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Mulai dari Rp 4.900/hari atau Rp 34.900/minggu dengan kuota 30M hingga 250M token. Cocok untuk sprint coding cepat, riset AI, testing agent, maupun operasional harian.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-neutral-200 text-[10px] text-neutral-500 uppercase tracking-wider">
              COST EFFICIENCY // ZERO OVERHEAD
            </div>
          </div>

          <div className="p-6 md:p-8 flex flex-col justify-between hover:bg-off-white/40 transition-colors">
            <div>
              <div className="flex items-center justify-between text-electric-blue mb-4">
                <span className="text-2xl font-serif font-bold">03/</span>
                <ShieldCheck className="w-5 h-5 text-electric-blue" />
              </div>
              <h3 className="font-serif font-bold text-lg text-neutral-900 uppercase">
                Production-Grade Stability
              </h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Didukung load balancing cerdas dan auto fallback otomatis. Bila salah satu vendor mengalami downtime atau 429 rate limit, request dialihkan secara mulus ke fallback node.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-neutral-200 text-[10px] text-neutral-500 uppercase tracking-wider">
              RELIABILITY // 99.9% UPTIME SLA
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE TERMINAL / INTEGRATION BENCH */}
      <section id="interactive-terminal" className="border-b border-electric-blue bg-neutral-950 text-white font-mono py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-neutral-800 pb-6">
            <div>
              <div className="flex items-center gap-2 text-electric-blue text-xs uppercase tracking-widest font-bold">
                <Terminal className="w-4 h-4" />
                // DEVELOPER INTEGRATION BENCH
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold uppercase mt-1 text-white">
                Drop-in Replacement SDK
              </h2>
            </div>
            <div className="text-xs text-neutral-400 max-w-md">
              Gunakan library resmi <span className="text-white">openai</span> atau <span className="text-white">@anthropic-ai/sdk</span> yang sudah Anda gunakan. Ubah <code className="text-electric-blue bg-white/10 px-1 py-0.5">baseURL</code> ke DGTLZ Route.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Code Snippet Viewer */}
            <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between bg-neutral-850 px-4 py-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                  <span className="text-xs text-neutral-400 ml-2 font-mono">dgtlz-route-client</span>
                </div>

                <div className="flex items-center gap-1">
                  {(['curl', 'node', 'python'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTelemetryTab(tab)}
                      className={`px-3 py-1 text-[11px] font-bold uppercase transition-all cursor-pointer ${
                        activeTelemetryTab === tab
                          ? 'bg-electric-blue text-white'
                          : 'text-neutral-400 hover:text-white bg-neutral-800/50'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5 font-mono text-xs overflow-x-auto relative">
                <button
                  onClick={() => copyEndpointCode(codeSnippets[activeTelemetryTab])}
                  className="absolute top-4 right-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-1.5 rounded flex items-center gap-1.5 text-[11px] transition-all cursor-pointer border border-neutral-700"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'COPIED!' : 'COPY CODE'}
                </button>
                <pre className="text-emerald-400/90 leading-relaxed font-mono">
                  {codeSnippets[activeTelemetryTab]}
                </pre>
              </div>

              <div className="bg-neutral-950/80 px-4 py-2.5 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                <span>GATEWAY: https://route.dgtlz.com/v1</span>
                <span className="text-emerald-400 font-bold">STREAMING READY (SSE)</span>
              </div>
            </div>

            {/* Right: Live Architectural Pipeline Matrix */}
            <div className="lg:col-span-5 space-y-4">
              <div className="border border-neutral-800 bg-neutral-900/60 p-5 font-mono text-xs">
                <div className="text-xs font-bold text-electric-blue uppercase mb-3 flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  ROUTER METRICS SPEC
                </div>
                <div className="space-y-3 divide-y divide-neutral-800 text-[11px]">
                  <div className="flex justify-between pt-2">
                    <span className="text-neutral-400">Model Fallback Order:</span>
                    <span className="text-neutral-200 font-bold">Primary → Pool Node 2 → Backup</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-neutral-400">Context Window Support:</span>
                    <span className="text-neutral-200 font-bold">Up to 2,000,000 Tokens (Kimi K3)</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-neutral-400">Vision Analysis:</span>
                    <span className="text-neutral-200 font-bold">Native Multimodal Supported</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-neutral-400">Concurrency / Slot:</span>
                    <span className="text-neutral-200 font-bold">Up to 28 Parallel Workers</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-neutral-400">Billing Model:</span>
                    <span className="text-emerald-400 font-bold">Fixed Micro-Ticket (No Surprise Invoices)</span>
                  </div>
                </div>
              </div>

              <div className="border border-electric-blue/40 bg-electric-blue/10 p-4 font-mono text-xs text-neutral-300">
                <span className="text-white font-bold block mb-1">PRO-TIP UNTUK AGENT WORKFLOW:</span>
                Gunakan model ringan (DeepSeek V4.1 / Gemini Flash) untuk routing & data extraction, lalu trigger Claude Opus 5 untuk high-stakes reasoning & architectural decisions.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3.5 PAY-AS-YOU-GO // QUICK START */}
      <RoutePayg />

      {/* 4. CATALOG SECTION // TABS, SEARCH, SWITCH VIEW */}
      <section id="catalog-section" className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Header of catalog */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6 border-b border-electric-blue pb-6">
            <div>
              <div className="flex items-center gap-2 text-electric-blue font-mono text-xs uppercase tracking-widest font-bold">
                <Server className="w-4 h-4" />
                // ACTIVE ROUTE TIER CATALOG
              </div>
              <h2 className="font-serif font-display-md uppercase tracking-tight text-neutral-900 mt-1">
                DAFTAR PAKET & TIKET ROUTER
              </h2>
              <p className="font-mono text-xs text-neutral-600 mt-1 max-w-xl">
                Temukan kapasitas token dan model frontier yang sesuai dengan skala eksperimen dan beban kerja harian Anda.
              </p>
            </div>

            {/* View Switcher & Counter */}
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
              <div className="border border-electric-blue p-1 flex items-center bg-white">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1.5 uppercase font-bold text-[11px] transition-all cursor-pointer ${
                    viewMode === 'cards' ? 'bg-electric-blue text-white' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Visual Cards
                </button>
                <button
                  onClick={() => setViewMode('dense')}
                  className={`px-3 py-1.5 uppercase font-bold text-[11px] transition-all cursor-pointer ${
                    viewMode === 'dense' ? 'bg-electric-blue text-white' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Dense Matrix
                </button>
              </div>

              <div className="bg-electric-blue text-white px-3 py-2 font-bold text-[11px]">
                {filteredPlans.length} OF {PLANS_DATA.length} TIERS ACTIVE
              </div>
            </div>
          </div>

          {/* Controls Bar: Search & Category Tabs */}
          <div className="bg-white border border-electric-blue mb-10 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-electric-blue">
              {/* Search input */}
              <div className="md:col-span-5 flex items-center px-4 py-3 bg-white">
                <Search className="w-4 h-4 text-electric-blue mr-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="CARI NAMA MODEL, TOKEN, ATAU HARGA..."
                  className="w-full font-mono text-xs focus:outline-none uppercase text-neutral-900 placeholder-neutral-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-neutral-400 hover:text-neutral-900 font-mono text-xs px-2 font-bold cursor-pointer"
                  >
                    [CLEAR]
                  </button>
                )}
              </div>

              {/* Filter Tabs */}
              <div className="md:col-span-7 flex flex-wrap items-center overflow-x-auto no-scrollbar font-mono text-xs p-1.5 gap-1.5 bg-off-white/40">
                {[
                  { key: 'all', label: `SEMUA (${stats.totalPlans})` },
                  { key: 'featured', label: `FEATURED COMBO (${stats.featuredCount})` },
                  { key: 'claude', label: `CLAUDE OPUS (${stats.claudeCount})` },
                  { key: 'china', label: `CHINA POWERHOUSE (${stats.chinaCount})` },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-3 py-2 uppercase font-bold tracking-wider text-[11px] transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === tab.key
                        ? 'bg-electric-blue text-white shadow-xs'
                        : 'bg-white border border-neutral-300 text-neutral-700 hover:border-electric-blue hover:text-electric-blue'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* VIEW MODE 1: VISUAL CARDS (DGT.LZ INDUSTRIAL TICKET LAYOUT) */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.map((plan) => {
                const isPromo = plan.isPromo;
                const isPopular = plan.isPopular;
                const isNew = plan.isNew;

                return (
                  <motion.div
                    key={plan.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`relative bg-white flex flex-col justify-between border-2 transition-all group ${
                      isPopular
                        ? 'border-electric-blue shadow-[4px_4px_0px_0px_rgba(11,23,239,1)]'
                        : 'border-neutral-300 hover:border-electric-blue hover:shadow-[3px_3px_0px_0px_rgba(11,23,239,0.4)]'
                    }`}
                  >
                    {/* Top Ticket Punch Header */}
                    <div>
                      <div className="bg-neutral-900 text-white px-4 py-2 font-mono text-[10px] flex items-center justify-between border-b border-neutral-900">
                        <span className="uppercase tracking-widest text-neutral-300 flex items-center gap-1.5">
                          <Radio className="w-3 h-3 text-emerald-400" />
                          TIER // {plan.category.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-1">
                          {isPopular && (
                            <span className="bg-electric-blue text-white px-1.5 py-0.5 font-bold uppercase tracking-wider text-[9px]">
                              POPULER
                            </span>
                          )}
                          {isPromo && (
                            <span className="bg-amber-500 text-neutral-950 px-1.5 py-0.5 font-bold uppercase tracking-wider text-[9px]">
                              PROMO
                            </span>
                          )}
                          {isNew && (
                            <span className="bg-emerald-500 text-neutral-950 px-1.5 py-0.5 font-bold uppercase tracking-wider text-[9px]">
                              NEW
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Content & Pricing Section */}
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-serif font-bold text-xl text-neutral-900 leading-tight group-hover:text-electric-blue transition-colors">
                            {plan.name}
                          </h3>
                        </div>

                        {/* Price Display */}
                        <div className="mt-4 pb-4 border-b border-neutral-200">
                          <div className="flex items-baseline gap-2">
                            <span className="font-serif font-bold text-3xl text-electric-blue">
                              {plan.price}
                            </span>
                            <span className="font-mono text-xs text-neutral-500 uppercase">
                              / {plan.period}
                            </span>
                          </div>
                          {plan.notes && (
                            <p className="font-mono text-[11px] text-neutral-600 mt-1">
                              {plan.notes}
                            </p>
                          )}
                        </div>

                        {/* Specs Matrix */}
                        <div className="mt-4 space-y-2.5 font-mono text-xs">
                          <div className="flex items-center justify-between py-1 border-b border-dashed border-neutral-200">
                            <span className="text-neutral-500 text-[11px] flex items-center gap-1.5">
                              <Database className="w-3.5 h-3.5 text-electric-blue" />
                              Token Pool:
                            </span>
                            <span className="font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 border border-neutral-200">
                              {plan.token}
                            </span>
                          </div>

                          <div className="flex items-start justify-between py-1 border-b border-dashed border-neutral-200">
                            <span className="text-neutral-500 text-[11px] shrink-0 flex items-center gap-1.5">
                              <Cpu className="w-3.5 h-3.5 text-electric-blue" />
                              Model Utama:
                            </span>
                            <span className="font-bold text-neutral-900 text-right text-[11px] ml-2 leading-tight">
                              {plan.mainModel}
                            </span>
                          </div>

                          <div className="flex items-center justify-between py-1 border-b border-dashed border-neutral-200">
                            <span className="text-neutral-500 text-[11px]">Sub-Model Akses:</span>
                            <span className="text-neutral-800 font-bold text-[11px]">
                              {plan.availableModelsCount} Model Siap Pakai
                            </span>
                          </div>

                          {plan.slot && (
                            <div className="flex items-center justify-between py-1 border-b border-dashed border-neutral-200">
                              <span className="text-neutral-500 text-[11px]">Slot Kuota:</span>
                              <span className="text-amber-700 font-bold text-[11px]">
                                {plan.slot} Concurrent
                              </span>
                            </div>
                          )}

                          {plan.latency && (
                            <div className="flex items-center justify-between py-1 border-b border-dashed border-neutral-200">
                              <span className="text-neutral-500 text-[11px]">Latency Overhead:</span>
                              <span className="text-emerald-700 font-bold text-[11px]">
                                {plan.latency}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Model Tags */}
                        {plan.modelTags && plan.modelTags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {plan.modelTags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-off-white text-neutral-600 border border-neutral-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-4 bg-off-white/80 border-t border-neutral-200 flex items-center gap-2 font-mono text-xs">
                      <a
                        href={getWaLink(plan.name, plan.price)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 bg-electric-blue text-white text-center font-bold uppercase tracking-wider hover:bg-blue-800 transition-colors shadow-xs"
                      >
                        AKTIVASI VIA WA →
                      </a>
                      <button
                        onClick={() => setSelectedPlan(plan)}
                        className="p-2.5 bg-white border border-neutral-300 hover:border-electric-blue hover:text-electric-blue text-neutral-700 font-bold uppercase transition-colors cursor-pointer"
                        title="Lihat Detail Spesifikasi"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* VIEW MODE 2: DENSE INDUSTRIAL TABLE MATRIX */}
          {viewMode === 'dense' && (
            <div className="border-2 border-electric-blue bg-white overflow-x-auto shadow-sm">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="bg-electric-blue text-white uppercase text-[11px] tracking-wider border-b border-electric-blue">
                    <th className="p-4 font-bold">Kategori</th>
                    <th className="p-4 font-bold">Nama Paket</th>
                    <th className="p-4 font-bold">Kapasitas Token</th>
                    <th className="p-4 font-bold">Model Utama</th>
                    <th className="p-4 font-bold">Harga / Periode</th>
                    <th className="p-4 font-bold">Concurrency / Slot</th>
                    <th className="p-4 font-bold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredPlans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-off-white/80 transition-colors">
                      <td className="p-4">
                        <span className="text-[10px] font-bold uppercase bg-neutral-100 px-2 py-0.5 border border-neutral-300">
                          {plan.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-serif font-bold text-sm text-neutral-900">{plan.name}</div>
                        {plan.notes && <div className="text-[10px] text-neutral-500 mt-0.5">{plan.notes}</div>}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-electric-blue bg-electric-blue/10 px-2 py-0.5">
                          {plan.token}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-700 text-[11px] max-w-xs">
                        {plan.mainModel}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-neutral-900">{plan.price}</span>
                        <span className="text-neutral-500 text-[10px] block">/{plan.period}</span>
                      </td>
                      <td className="p-4 text-neutral-600">
                        {plan.slot ? plan.slot : `${plan.availableModelsCount} Models`}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedPlan(plan)}
                            className="px-2.5 py-1.5 border border-neutral-300 hover:border-electric-blue text-[11px] uppercase font-bold cursor-pointer"
                          >
                            Detail
                          </button>
                          <a
                            href={getWaLink(plan.name, plan.price)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-electric-blue text-white text-[11px] font-bold uppercase hover:bg-blue-800 transition-colors"
                          >
                            Pesan
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredPlans.length === 0 && (
            <div className="p-12 text-center border-2 border-dashed border-neutral-300 bg-white font-mono">
              <p className="text-sm text-neutral-600 uppercase font-bold">
                Tidak ada paket yang cocok dengan filter atau pencarian "{searchQuery}"
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('all');
                }}
                className="mt-4 px-6 py-2 bg-electric-blue text-white text-xs font-bold uppercase cursor-pointer"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. HOW IT WORKS // 4-STEP ONBOARDING ENGINE */}
      <section className="border-t border-b border-electric-blue bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 font-mono">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-electric-blue pb-6">
            <div>
              <span className="text-xs text-electric-blue font-bold tracking-widest uppercase">
                // SYSTEM PROVISIONING WORKFLOW
              </span>
              <h2 className="font-serif font-display-md uppercase tracking-tight text-neutral-900 mt-1">
                ALUR AKTIVASI 4 MENIT
              </h2>
            </div>
            <div className="text-xs text-neutral-500 max-w-sm">
              Setup instan tanpa verifikasi identitas ribet. Langsung siap digabung ke code atau platform automation Anda.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-xs">
            <div className="border border-neutral-300 p-6 bg-off-white flex flex-col justify-between hover:border-electric-blue transition-colors">
              <div>
                <span className="text-3xl font-serif font-bold text-electric-blue">01</span>
                <h4 className="font-bold text-sm text-neutral-900 mt-3 uppercase">Pilih Paket Token</h4>
                <p className="text-neutral-600 mt-2 leading-relaxed text-[11px]">
                  Tentukan plan harian atau mingguan sesuai volume token dan model frontier yang Anda prioritaskan.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-neutral-200 text-[10px] text-neutral-400 font-bold uppercase">
                STEP 01 — SELECTION
              </div>
            </div>

            <div className="border border-neutral-300 p-6 bg-off-white flex flex-col justify-between hover:border-electric-blue transition-colors">
              <div>
                <span className="text-3xl font-serif font-bold text-electric-blue">02</span>
                <h4 className="font-bold text-sm text-neutral-900 mt-3 uppercase">Konfirmasi WhatsApp</h4>
                <p className="text-neutral-600 mt-2 leading-relaxed text-[11px]">
                  Kirim detail paket terpilih. Admin akan memverifikasi pembayaran instan via QRIS / Transfer lokal.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-neutral-200 text-[10px] text-neutral-400 font-bold uppercase">
                STEP 02 — PROVISIONING
              </div>
            </div>

            <div className="border border-neutral-300 p-6 bg-off-white flex flex-col justify-between hover:border-electric-blue transition-colors">
              <div>
                <span className="text-3xl font-serif font-bold text-electric-blue">03</span>
                <h4 className="font-bold text-sm text-neutral-900 mt-3 uppercase">Terbitkan API Key</h4>
                <p className="text-neutral-600 mt-2 leading-relaxed text-[11px]">
                  Terima endpoint URL beserta Bearer API Token Anda. Langsung masukkan ke config bot, script, atau SDK.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-neutral-200 text-[10px] text-neutral-400 font-bold uppercase">
                STEP 03 — INTEGRATION
              </div>
            </div>

            <div className="border border-neutral-300 p-6 bg-off-white flex flex-col justify-between hover:border-electric-blue transition-colors">
              <div>
                <span className="text-3xl font-serif font-bold text-electric-blue">04</span>
                <h4 className="font-bold text-sm text-neutral-900 mt-3 uppercase">Scale & Automate</h4>
                <p className="text-neutral-600 mt-2 leading-relaxed text-[11px]">
                  Integrasikan dengan n8n, Claude Code, OpenAgentic CLI, atau ekosistem web agent buatan DGT.LZ.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-neutral-200 text-[10px] text-neutral-400 font-bold uppercase">
                STEP 04 — SCALING
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ INTERACTIVE ACCORDION */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-12 font-mono">
          <div className="text-center mb-12">
            <span className="text-xs text-electric-blue font-bold tracking-widest uppercase">
              // FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-serif font-headline-md text-2xl uppercase tracking-tight mt-1 text-neutral-900">
              Pertanyaan Seputar DGTLZ Route
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            {[
              {
                q: 'Apa perbedaan utama DGTLZ Route dibanding langganan resmi OpenAI / Anthropic?',
                a: 'DGTLZ Route bertindak sebagai high-efficiency gateway aggregator. Bila berlangganan resmi per platform, biayanya mencapai $20-$40/bulan per akun (Rp 600rb - Rp 1,2jt/bln) dengan limit kuota kaku. Melalui DGTLZ Route, Anda membayar mikro-paket sesuai token harian/mingguan tanpa komitmen mahal, sekaligus dapat bebas switch ke berbagai model frontier dunia dalam 1 endpoint.'
              },
              {
                q: 'Apakah bisa dipakai untuk coding agents (Claude Code, Cursor, Aider, OpenCode)?',
                a: 'Sangat bisa! DGTLZ Route 100% kompatibel dengan OpenAI API Specification dan Anthropic Wire format. Anda cukup memasukkan Base URL dan API Key DGTLZ Route ke settings tool coding Anda.'
              },
              {
                q: 'Model apa saja yang tersedia di dalam cluster?',
                a: 'Cluster mencakup Claude Opus 5, DeepSeek V4.1 Flash, DeepSeek V4 Pro, Gemini 3.8 Flash High, GLM-5.3 Reasoning, Kimi K3 (Moonshot 2M Context), dan Qwen 3.8 Max.'
              },
              {
                q: 'Bagaimana bila token habis di tengah jalan?',
                a: 'Anda dapat melakukan top-up instan via WhatsApp. Sistem kami akan memperpanjang kuota pada API key Anda yang sudah aktif tanpa perlu setup ulang aplikasi.'
              }
            ].map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-neutral-300 bg-off-white/60 transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between font-bold text-neutral-900 text-sm cursor-pointer hover:text-electric-blue"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-electric-blue' : 'text-neutral-500'}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-neutral-600 leading-relaxed text-xs border-t border-neutral-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA BANNER */}
      <section className="bg-electric-blue text-white py-16 border-t border-white/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center space-y-6">
          <span className="font-mono text-xs uppercase tracking-widest text-white/80">
            DGT.LZ HIGH-EFFICIENCY COMPUTING & AGENT INFRASTRUCTURE
          </span>
          <h2 className="font-display-lg uppercase tracking-tight leading-none text-white max-w-3xl mx-auto">
            Mulai Efisiensi AI Hari Ini
          </h2>
          <p className="font-mono text-xs md:text-sm text-white/90 max-w-xl mx-auto leading-relaxed">
            Konsultasikan paket yang paling pas untuk ritme tim Anda. Setup cepat, token melimpah, dan bebas switch ke frontier model apa pun.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4 font-mono text-xs">
            <a
              href="https://wa.me/6281234567890?text=Halo%20tim%20DGTLZ!%20Saya%20mau%20konsultasi%20mengenai%20DGTLZ%20Route."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white text-electric-blue font-bold tracking-wider uppercase hover:bg-neutral-100 transition-all shadow-md cursor-pointer"
            >
              Hubungi via WhatsApp →
            </a>
            <Link
              to="/systems"
              className="px-8 py-3 border border-white text-white font-bold tracking-wider uppercase hover:bg-white hover:text-electric-blue transition-all"
            >
              Lihat Modul DGT.LZ Lainnya
            </Link>
          </div>
        </div>
      </section>

      {/* 8. DETAIL SPECIFICATION MODAL */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border-2 border-electric-blue max-w-lg w-full p-6 md:p-8 font-mono text-xs space-y-4 shadow-2xl relative"
            >
              <div className="flex justify-between items-start border-b border-neutral-200 pb-3">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest">
                    TIER SPECIFICATION SHEET // {selectedPlan.category.toUpperCase()}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-neutral-900 mt-1">
                    {selectedPlan.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="text-neutral-500 hover:text-neutral-900 text-lg font-bold px-2 py-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="flex justify-between border-b border-neutral-100 py-1.5">
                  <span className="text-neutral-500">Harga Langganan:</span>
                  <span className="font-bold text-electric-blue text-sm">{selectedPlan.price} / {selectedPlan.period}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 py-1.5">
                  <span className="text-neutral-500">Kapasitas Token Pool:</span>
                  <span className="font-bold text-neutral-900">{selectedPlan.token}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 py-1.5">
                  <span className="text-neutral-500">Model Utama:</span>
                  <span className="font-bold text-right text-neutral-900 max-w-[240px]">{selectedPlan.mainModel}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 py-1.5">
                  <span className="text-neutral-500">Akses Model Cluster:</span>
                  <span className="font-bold text-neutral-900">{selectedPlan.availableModelsCount} Model Siap Digunakan</span>
                </div>
                {selectedPlan.slot && (
                  <div className="flex justify-between border-b border-neutral-100 py-1.5">
                    <span className="text-neutral-500">Concurrency Slot:</span>
                    <span className="font-bold text-amber-700">{selectedPlan.slot}</span>
                  </div>
                )}
                {selectedPlan.latency && (
                  <div className="flex justify-between border-b border-neutral-100 py-1.5">
                    <span className="text-neutral-500">Target Latency:</span>
                    <span className="font-bold text-emerald-700">{selectedPlan.latency}</span>
                  </div>
                )}
                {selectedPlan.contextWindow && (
                  <div className="flex justify-between border-b border-neutral-100 py-1.5">
                    <span className="text-neutral-500">Max Context Window:</span>
                    <span className="font-bold text-neutral-900">{selectedPlan.contextWindow}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-neutral-100 py-1.5">
                  <span className="text-neutral-500">Unlimited Request:</span>
                  <span className="font-bold text-neutral-900">{selectedPlan.unlimitedRequest ? 'Ya' : 'Standard Rate'}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 py-1.5">
                  <span className="text-neutral-500">Priority Support:</span>
                  <span className="font-bold text-neutral-900">Direct WhatsApp Assistance</span>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <a
                  href={getWaLink(selectedPlan.name, selectedPlan.price)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-electric-blue text-white text-center font-bold uppercase tracking-wider hover:bg-blue-800 transition-colors shadow-xs"
                >
                  Aktivasi Sekarang via WA
                </a>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="px-4 py-3 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-bold uppercase cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ArrowDownRightIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="7" x2="17" y2="17"></line>
      <polyline points="17 7 17 17 7 17"></polyline>
    </svg>
  );
}
