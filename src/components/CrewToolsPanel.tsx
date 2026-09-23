import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Copy,
  Download,
  Trash2,
  Clock,
  FileText,
  Sparkles,
  Wrench,
  RotateCcw,
  Check,
  AlertCircle,
  Calculator,
  Volume2,
} from 'lucide-react';

interface Segment {
  t: number;
  text: string;
}

const DRAFT_KEY = 'dgtlz_transkrip_draft';

// Declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function CrewToolsPanel() {
  const [activeSubTab, setActiveSubTab] = useState<'TRANSCRIPT' | 'CALCULATOR'>('TRANSCRIPT');

  return (
    <div className="space-y-6 font-mono">
      {/* HEADER BAR */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-neutral-900 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-neutral-900 text-white px-2 py-0.5 text-xs font-black">CREW // UTILITIES</span>
            <span className="text-xs text-electric-blue font-bold">V1.0</span>
          </div>
          <h1 className="text-2xl font-black tracking-tighter mt-1">CREW TOOLS & AUTOMATION</h1>
          <p className="text-xs text-neutral-500">Perakas kerja internal tim DGTLZ — Transkripsi Rapat Live & Kalkulator Token Route.</p>
        </div>

        {/* SUB TAB SWITCHER */}
        <div className="flex items-center gap-1 border-2 border-neutral-900 bg-white p-1">
          <button
            onClick={() => setActiveSubTab('TRANSCRIPT')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold transition-all ${
              activeSubTab === 'TRANSCRIPT'
                ? 'bg-electric-blue text-white font-black'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>TRANSKRIP RAPAT</span>
          </button>
          <button
            onClick={() => setActiveSubTab('CALCULATOR')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold transition-all ${
              activeSubTab === 'CALCULATOR'
                ? 'bg-electric-blue text-white font-black'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>ROUTE COST CALCULATOR</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'TRANSCRIPT' && <TranskripRapatTool />}
      {activeSubTab === 'CALCULATOR' && <RouteCostCalculatorTool />}
    </div>
  );
}

// ============================================================================
// TOOL 1: TRANSKRIP RAPAT LIVE (Web Speech API)
// ============================================================================
function TranskripRapatTool() {
  const [recording, setRecording] = useState(false);
  const [lang, setLang] = useState('id-ID');
  const [segments, setSegments] = useState<Segment[]>([]);
  const [interim, setInterim] = useState('');
  const [totalMs, setTotalMs] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Draft restore state
  const [draft, setDraft] = useState<{ segs: Segment[]; savedAt: number } | null>(null);

  const recRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const startTsRef = useRef<number>(0);
  const panelRef = useRef<HTMLDivElement>(null);

  // Format helpers
  const pad = (n: number) => (n < 10 ? '0' : '') + n;
  const clock = (t: number) => {
    const d = new Date(t);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };
  const formatDuration = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h > 0 ? h + ':' : ''}${pad(m)}:${pad(sec)}`;
  };
  const wordCount = segments.reduce((acc, s) => acc + s.text.split(/\s+/).filter(Boolean).length, 0);

  // Auto scroll panel
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [segments, interim]);

  // Load draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.segs) && parsed.segs.length > 0) {
          setDraft(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save draft whenever segments change
  useEffect(() => {
    if (segments.length > 0) {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ segs: segments, savedAt: Date.now() }));
      } catch {
        // ignore
      }
    }
  }, [segments]);

  // Handle timer
  useEffect(() => {
    if (recording) {
      startTsRef.current = Date.now() - totalMs;
      timerRef.current = setInterval(() => {
        setTotalMs(Date.now() - startTsRef.current);
      }, 500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [recording]);

  const stopRecording = useCallback(() => {
    setRecording(false);
    if (recRef.current) {
      try {
        recRef.current.onend = null;
        recRef.current.stop();
      } catch {
        // ignore
      }
      recRef.current = null;
    }
    setInterim('');
  }, []);

  const startRecording = useCallback(() => {
    setErrorMsg('');
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setErrorMsg('Browser ini tidak mendukung Speech Recognition (Web Speech API). Gunakan Chrome/Edge.');
      return;
    }

    try {
      const rec = new SR();
      rec.lang = lang;
      rec.continuous = true;
      rec.interimResults = true;

      rec.onresult = (e: any) => {
        let interimText = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const res = e.results[i];
          if (res.isFinal) {
            const text = res[0].transcript.trim();
            if (text) {
              setSegments((prev) => [...prev, { t: Date.now(), text }]);
            }
          } else {
            interimText += res[0].transcript;
          }
        }
        setInterim(interimText);
      };

      rec.onerror = (e: any) => {
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          stopRecording();
          setErrorMsg('Izin mikrofon ditolak. Berikan izin di browser Anda, lalu coba lagi.');
        } else if (e.error !== 'no-speech') {
          console.warn('SpeechRec error:', e.error);
        }
      };

      rec.onend = () => {
        // Auto reconnect if recording state is still active (Chrome times out after few mins)
        if (recRef.current) {
          try {
            recRef.current.start();
          } catch {
            stopRecording();
          }
        }
      };

      rec.start();
      recRef.current = rec;
      setRecording(true);
    } catch (err: any) {
      setErrorMsg(`Gagal memulai rekam: ${err.message || 'Unknown error'}`);
      stopRecording();
    }
  }, [lang, stopRecording]);

  const toggleRecording = () => {
    if (recording) stopRecording();
    else startRecording();
  };

  const handleCopy = () => {
    if (segments.length === 0) return;
    const text = segments.map((s) => `[${clock(s.t)}] ${s.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (segments.length === 0) return;
    const d = new Date();
    const head = `TRANSKRIP RAPAT // DGTLZ CREW
Tanggal: ${d.toLocaleDateString('id-ID')}
Durasi : ${formatDuration(totalMs)}
Bahasa : ${lang === 'id-ID' ? 'Indonesia' : 'English (US)'}

==================================================\n\n`;
    const body = segments.map((s) => `[${clock(s.t)}] ${s.text}`).join('\n');
    const blob = new Blob([head + body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transkrip-rapat-${d.toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm('Bersihkan seluruh transkrip saat ini?')) {
      setSegments([]);
      setInterim('');
      setTotalMs(0);
      localStorage.removeItem(DRAFT_KEY);
      setDraft(null);
    }
  };

  const restoreDraft = () => {
    if (draft) {
      setSegments(draft.segs);
      setDraft(null);
    }
  };

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setDraft(null);
  };

  return (
    <div className="space-y-4">
      {/* DRAFT RESTORE BANNER */}
      {draft && (
        <div className="border-2 border-amber-500 bg-amber-50 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-900 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>
              DRAF TERSIMPAN: {draft.segs.length} baris, tersimpan jam {clock(draft.savedAt)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={restoreDraft}
              className="bg-amber-500 text-white px-3 py-1 font-bold hover:bg-amber-600 transition-colors"
            >
              LANJUTKAN DRAF
            </button>
            <button
              onClick={discardDraft}
              className="border border-neutral-400 text-neutral-700 px-3 py-1 font-bold hover:bg-neutral-200 transition-colors"
            >
              HAPUS DRAF
            </button>
          </div>
        </div>
      )}

      {/* CONTROL BAR */}
      <div className="border-2 border-neutral-900 bg-white p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Language Selector */}
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              disabled={recording}
              className="border-2 border-neutral-900 bg-[#F4F3EF] px-3 py-2 text-xs font-bold outline-none focus:border-electric-blue disabled:opacity-50"
            >
              <option value="id-ID">🇮🇩 Bahasa Indonesia</option>
              <option value="en-US">🇺🇸 English (US)</option>
            </select>

            {/* Record Toggle Button */}
            <button
              onClick={toggleRecording}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-black tracking-wider transition-all border-2 border-neutral-900 ${
                recording
                  ? 'bg-red-600 text-white animate-pulse shadow-lg'
                  : 'bg-electric-blue text-white hover:bg-blue-700'
              }`}
            >
              {recording ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>BERHENTI MEREKAM</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>MULAI MEREKAM</span>
                </>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={segments.length === 0}
              className="flex items-center gap-1.5 border-2 border-neutral-900 bg-[#F4F3EF] px-3 py-2 text-xs font-bold hover:bg-neutral-200 disabled:opacity-40 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'TERSALIN' : 'SALIN'}</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={segments.length === 0}
              className="flex items-center gap-1.5 border-2 border-neutral-900 bg-[#F4F3EF] px-3 py-2 text-xs font-bold hover:bg-neutral-200 disabled:opacity-40 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>UNDUH .TXT</span>
            </button>
            <button
              onClick={handleClear}
              disabled={segments.length === 0}
              className="flex items-center gap-1.5 border-2 border-neutral-900 bg-red-50 text-red-700 px-3 py-2 text-xs font-bold hover:bg-red-100 disabled:opacity-40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>BERSIHKAN</span>
            </button>
          </div>
        </div>

        {/* STATUS TELEMETRY BAR */}
        <div className="flex items-center justify-between border-t border-neutral-200 pt-2 text-xs text-neutral-500 font-bold">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                recording ? 'bg-red-600 animate-ping' : 'bg-neutral-400'
              }`}
            />
            <span className="text-neutral-900">
              {recording ? 'MENDENGARKAN SUARA RAPAT...' : 'STANDBY (SIAP MEREKAM)'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-electric-blue font-black">
              <Clock className="w-3.5 h-3.5" /> {formatDuration(totalMs)}
            </span>
            <span>
              {wordCount} KATA // {segments.length} BARIS
            </span>
          </div>
        </div>
      </div>

      {/* ERROR BOX */}
      {errorMsg && (
        <div className="border-2 border-red-600 bg-red-50 p-3 text-xs font-bold text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* TRANSCRIPT DISPLAY PANEL */}
      <div className="border-2 border-neutral-900 bg-white">
        <div className="bg-[#F4F3EF] border-b-2 border-neutral-900 px-4 py-2 flex items-center justify-between text-xs font-bold text-neutral-700">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-electric-blue" />
            <span>TRANSKRIP RAPAT LIVE LOG</span>
          </div>
          <span className="text-[10px] text-neutral-500">AUTO-SAVED LOCAL</span>
        </div>

        <div
          ref={panelRef}
          className="p-4 min-h-[320px] max-h-[500px] overflow-y-auto space-y-2.5 bg-neutral-50/50 selection:bg-electric-blue selection:text-white"
        >
          {segments.length === 0 && !interim && (
            <div className="h-64 flex flex-col items-center justify-center text-center text-neutral-400 p-8 space-y-2">
              <Volume2 className="w-8 h-8 opacity-40" />
              <p className="text-xs font-bold text-neutral-500">BELUM ADA TRANSKRIP RAPAT</p>
              <p className="text-[11px] text-neutral-400 max-w-sm">
                Tekan <strong className="text-neutral-700">Mulai Merekam</strong> di atas, lalu biarkan audio rapat lewat speaker atau mikrofon Anda.
              </p>
            </div>
          )}

          {segments.map((seg, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs leading-relaxed group">
              <span className="text-[10px] font-bold text-neutral-400 bg-neutral-200 px-1.5 py-0.5 rounded flex-shrink-0 font-mono">
                [{clock(seg.t)}]
              </span>
              <p className="text-neutral-900 font-medium">{seg.text}</p>
            </div>
          ))}

          {interim && (
            <div className="flex items-start gap-3 text-xs leading-relaxed opacity-70 animate-pulse bg-blue-50/50 p-2 border-l-2 border-electric-blue">
              <span className="text-[10px] font-bold text-electric-blue bg-blue-100 px-1.5 py-0.5 rounded flex-shrink-0">
                [LIVE]
              </span>
              <p className="text-electric-blue italic font-medium">{interim}...</p>
            </div>
          )}
        </div>
      </div>

      {/* USAGE HELP FOOTER */}
      <div className="border border-neutral-300 bg-neutral-100 p-3 text-[11px] text-neutral-600 space-y-1">
        <span className="font-bold text-neutral-800">💡 TIPS PENGGUNAAN CREW:</span>
        <ul className="list-disc list-inside space-y-0.5 text-neutral-600">
          <li>Transkripsi berjalan di browser tanpa mengirim audio ke server internal DGTLZ.</li>
          <li>Gunakan speaker laptop/komputer jika rapat dilakukan via Zoom/Google Meet.</li>
          <li>Hasil transkrip otomatis tersimpan di draf browser. Jangan lupa menyalin ke Catatan Proyek jika rapat selesai.</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// TOOL 2: ROUTE COST & TOKEN CALCULATOR (Quick Crew Utility)
// ============================================================================
const MODEL_PRICING: Array<{
  name: string;
  provider: string;
  inputPer1M: number;
  outputPer1M: number;
  cachePer1M?: number;
}> = [
  { name: 'claude-haiku-4-5', provider: 'anthropic', inputPer1M: 1.0, outputPer1M: 5.0, cachePer1M: 0.1 },
  { name: 'claude-sonnet-5', provider: 'anthropic', inputPer1M: 2.0, outputPer1M: 10.0, cachePer1M: 0.2 },
  { name: 'claude-opus-4-8', provider: 'anthropic', inputPer1M: 5.0, outputPer1M: 25.0, cachePer1M: 0.5 },
  { name: 'deepseek-v4-flash', provider: 'deepseek', inputPer1M: 0.15, outputPer1M: 0.6, cachePer1M: 0.003 },
  { name: 'deepseek-v4-pro', provider: 'deepseek', inputPer1M: 0.66, outputPer1M: 1.98, cachePer1M: 0.022 },
  { name: 'gemini-3.8-flash', provider: 'gemini', inputPer1M: 0.75, outputPer1M: 3.75, cachePer1M: 0.075 },
  { name: 'gemini-3.1-pro-preview', provider: 'gemini', inputPer1M: 2.0, outputPer1M: 12.0, cachePer1M: 0.2 },
  { name: 'glm-5.3-flash', provider: 'z.ai', inputPer1M: 0.015, outputPer1M: 0.25, cachePer1M: 0.015 },
  { name: 'glm-5.2', provider: 'z.ai', inputPer1M: 1.05, outputPer1M: 3.3, cachePer1M: 0.195 },
  { name: 'gpt-4.1-mini', provider: 'openai', inputPer1M: 0.4, outputPer1M: 1.6, cachePer1M: 0.1 },
  { name: 'gpt-5.4-mini', provider: 'openai', inputPer1M: 0.75, outputPer1M: 4.5, cachePer1M: 0.075 },
  { name: 'kimi-k2.7', provider: 'moonshoot', inputPer1M: 0.95, outputPer1M: 4.0, cachePer1M: 0.19 },
];

function RouteCostCalculatorTool() {
  const [selectedModel, setSelectedModel] = useState(MODEL_PRICING[7].name); // glm-5.3-flash
  const [inputTokens, setInputTokens] = useState<number>(100000);
  const [outputTokens, setOutputTokens] = useState<number>(20000);
  const [requestsPerDay, setRequestsPerDay] = useState<number>(100);

  const model = MODEL_PRICING.find((m) => m.name === selectedModel) || MODEL_PRICING[0];

  const costPerReq =
    (inputTokens / 1000000) * model.inputPer1M + (outputTokens / 1000000) * model.outputPer1M;
  const costDaily = costPerReq * requestsPerDay;
  const costMonthly = costDaily * 30;

  return (
    <div className="space-y-4">
      <div className="border-2 border-neutral-900 bg-white p-4 space-y-4">
        <div className="flex items-center gap-2 border-b-2 border-neutral-900 pb-2">
          <Calculator className="w-4 h-4 text-electric-blue" />
          <h2 className="font-bold text-xs uppercase tracking-wider">ROUTE PAY-AS-YOU-GO ESTIMATOR</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Inputs */}
          <div className="space-y-3 bg-neutral-50 p-3 border border-neutral-300">
            <div>
              <label className="block text-[11px] font-bold text-neutral-600 mb-1">PILIH MODEL ROUTE</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full border-2 border-neutral-900 bg-white p-2 font-bold outline-none"
              >
                {MODEL_PRICING.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name} ({m.provider}) - ${m.inputPer1M}/1M in, ${m.outputPer1M}/1M out
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                INPUT TOKENS PER REQUEST ({inputTokens.toLocaleString()})
              </label>
              <input
                type="range"
                min="1000"
                max="1000000"
                step="5000"
                value={inputTokens}
                onChange={(e) => setInputTokens(Number(e.target.value))}
                className="w-full accent-electric-blue"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                OUTPUT TOKENS PER REQUEST ({outputTokens.toLocaleString()})
              </label>
              <input
                type="range"
                min="500"
                max="200000"
                step="1000"
                value={outputTokens}
                onChange={(e) => setOutputTokens(Number(e.target.value))}
                className="w-full accent-electric-blue"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                REQUESTS / HARI ({requestsPerDay})
              </label>
              <input
                type="range"
                min="1"
                max="5000"
                step="10"
                value={requestsPerDay}
                onChange={(e) => setRequestsPerDay(Number(e.target.value))}
                className="w-full accent-electric-blue"
              />
            </div>
          </div>

          {/* Results Card */}
          <div className="bg-electric-blue text-white p-4 border-2 border-neutral-900 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">ESTIMASI BIAYA ROUTE</span>
              <h3 className="text-xl font-black mt-1">{model.name}</h3>
              <p className="text-[11px] text-blue-100 opacity-80">{model.provider.toUpperCase()} ENGINE</p>

              <div className="mt-6 space-y-2 border-t border-blue-400/40 pt-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-blue-100">Per Request:</span>
                  <span className="font-mono font-black">${costPerReq.toFixed(4)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-blue-100">Per Hari ({requestsPerDay} req):</span>
                  <span className="font-mono font-black">${costDaily.toFixed(3)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-black border-t border-blue-400/40 pt-2">
                  <span>Per Bulan (30 Hari):</span>
                  <span className="text-yellow-300 font-mono text-base">${costMonthly.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-blue-400/40 text-[10px] text-blue-200">
              * Perhitungan berdasarkan skema pricing Pay-As-You-Go DGTLZ Route.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
