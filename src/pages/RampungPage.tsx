import React, { useEffect, useState } from 'react';
import {
  Smartphone,
  Github,
  CheckCircle2,
  Calendar,
  Layers,
  Users,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Clock,
  Check,
  Sparkles,
  ArrowLeft,
  Circle,
  Tag,
} from 'lucide-react';

interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface Task {
  id: string;
  title: string;
  projectName: string;
  priority: 'HIGH' | 'NORMAL' | 'REVIEW';
  category: 'DEV' | 'DESIGN' | 'CONTENT' | 'QA';
  dueDate: string;
  assigneeName: string;
  assigneeRole: string;
  isCompleted: boolean;
  subtasks: Subtask[];
}

interface Project {
  id: string;
  title: string;
  clientName: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  statusType: 'ON_TRACK' | 'FOKUS_HARI_INI' | 'SPRINT';
  statusBadge: string;
  deadline: string;
  team: string[];
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Aesthetic Clinic Booking App',
    clientName: 'Sema Studio / Aethers',
    progress: 75,
    completedTasks: 9,
    totalTasks: 12,
    statusType: 'FOKUS_HARI_INI',
    statusBadge: 'Sprint 03',
    deadline: '25 Sep 2026',
    team: ['Ari', 'Rian', 'Dewi'],
  },
  {
    id: 'p2',
    title: 'Digital Brutalism E-Commerce',
    clientName: 'DGTLZ Store',
    progress: 40,
    completedTasks: 4,
    totalTasks: 10,
    statusType: 'ON_TRACK',
    statusBadge: 'Architecture',
    deadline: '02 Oct 2026',
    team: ['Ari', 'Rio'],
  },
  {
    id: 'p3',
    title: 'BuatQris Payment Aggregator',
    clientName: 'Bali UMKM Ecosystem',
    progress: 90,
    completedTasks: 9,
    totalTasks: 10,
    statusType: 'SPRINT',
    statusBadge: 'Final QA',
    deadline: '22 Sep 2026',
    team: ['Ari', 'Dewi'],
  },
];

const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Implementasi Haptic Feedback & Audio Cue Selesai',
    projectName: 'Aesthetic Clinic Booking App',
    priority: 'HIGH',
    category: 'DEV',
    dueDate: 'Hari Ini, 17:00',
    assigneeName: 'Ari',
    assigneeRole: 'Lead Architect',
    isCompleted: false,
    subtasks: [
      { id: 'st1', title: 'Setup Vibrator effect di Android Compose', isCompleted: true },
      { id: 'st2', title: 'Tambahkan sound asset click & success tone', isCompleted: false },
      { id: 'st3', title: 'Test performa latency di device uji', isCompleted: false },
    ],
  },
  {
    id: 't2',
    title: 'Integrasi Room Database Migration Schema v2',
    projectName: 'Aesthetic Clinic Booking App',
    priority: 'HIGH',
    category: 'DEV',
    dueDate: 'Hari Ini, 19:30',
    assigneeName: 'Rian',
    assigneeRole: 'Android Dev',
    isCompleted: false,
    subtasks: [
      { id: 'st4', title: 'Backup local sqlite file', isCompleted: true },
      { id: 'st5', title: 'Jalankan autoincrement schema index', isCompleted: false },
    ],
  },
  {
    id: 't3',
    title: 'Review Visual Hierarki & Typography Warm Sand',
    projectName: 'Digital Brutalism E-Commerce',
    priority: 'NORMAL',
    category: 'DESIGN',
    dueDate: 'Besok, 12:00',
    assigneeName: 'Dewi',
    assigneeRole: 'UI/UX Designer',
    isCompleted: false,
    subtasks: [
      { id: 'st6', title: 'Validasi kontras warna SurfaceWarm (#FCF9F3)', isCompleted: true },
      { id: 'st7', title: 'Cek typography scale di layar 6.1 inci', isCompleted: true },
    ],
  },
  {
    id: 't4',
    title: 'Audit Webhook Callback HMAC Security',
    projectName: 'BuatQris Payment Aggregator',
    priority: 'HIGH',
    category: 'QA',
    dueDate: '22 Sep 2026',
    assigneeName: 'Ari',
    assigneeRole: 'Lead Architect',
    isCompleted: true,
    subtasks: [
      { id: 'st8', title: 'Simulasi replay attack 100 req/sec', isCompleted: true },
      { id: 'st9', title: 'Verifikasi SHA256 timing attack protection', isCompleted: true },
    ],
  },
];

export function RampungPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [deviceTab, setDeviceTab] = useState<'TODAY' | 'PROJECTS' | 'TEAM'>('TODAY');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskFilter, setTaskFilter] = useState<'ALL' | 'HIGH' | 'REVIEW'>('ALL');
  const [toastMsg, setToastMsg] = useState('');

  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 240);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Selesaikan / Tandai Selesai Subtask
  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const newSubtasks = t.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, isCompleted: !st.isCompleted } : st
        );
        const allDone = newSubtasks.length > 0 && newSubtasks.every((st) => st.isCompleted);
        const updated = { ...t, subtasks: newSubtasks, isCompleted: allDone };
        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask(updated);
        }
        return updated;
      })
    );
  };

  // Tandai seluruh task selesai (Single primary CTA)
  const completeEntireTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const allSubtasksDone = t.subtasks.map((st) => ({ ...st, isCompleted: true }));
        const updated = { ...t, isCompleted: true, subtasks: allSubtasksDone };
        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask(updated);
        }
        return updated;
      })
    );

    // Update progress proyek secara otomatis
    const targetTask = tasks.find((t) => t.id === taskId);
    if (targetTask) {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.title === targetTask.projectName) {
            const nextDone = Math.min(p.totalTasks, p.completedTasks + 1);
            return {
              ...p,
              completedTasks: nextDone,
              progress: Math.round((nextDone / p.totalTasks) * 100),
            };
          }
          return p;
        })
      );
    }

    setToastMsg('🎉 Tugas selesai! Progres proyek otomatis ter-update.');
    setTimeout(() => setToastMsg(''), 3000);
  };

  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'HIGH') return t.priority === 'HIGH';
    if (taskFilter === 'REVIEW') return t.priority === 'REVIEW';
    return true;
  });

  const activeTasksCount = tasks.filter((t) => !t.isCompleted).length;
  const completedTasksCount = tasks.filter((t) => t.isCompleted).length;

  return (
    <div className="bg-[#F4F3EF] min-h-screen text-neutral-900 font-mono selection:bg-electric-blue selection:text-white">
      {/* 1. HERO ARCHIVE BANNER */}
      <header className="border-b-2 border-neutral-900 bg-electric-blue text-white px-margin py-12 md:py-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-neutral-900 text-[#BDEDDC] text-xs font-black px-2.5 py-1">
                APP REPO // OPEN ARTIFACT
              </span>
              <span className="text-xs font-bold text-blue-200">KOTLIN • JETPACK COMPOSE • ROOM</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              RAMPUNG
            </h1>
            <p className="mt-3 text-sm md:text-base text-blue-100 max-w-xl font-normal">
              Aplikasi manajemen tugas & ritme proyek digital studio Aethers. Menghadirkan visibilitas cepat
              founder dan fokus kerja tim kecil (5–15 orang) tanpa distraksi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#interactive-demo"
              className="flex items-center gap-2 bg-rampung text-white border-2 border-white px-5 py-3 text-xs font-black uppercase tracking-wider hover:bg-rampung-dark transition-all shadow-[4px_4px_0_0_#fff]"
            >
              <Smartphone className="w-4 h-4" />
              <span>TEST LIVE DEMO ↓</span>
            </a>
            <a
              href="https://github.com/Zeropro091/rampung.git"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-white text-neutral-900 border-2 border-neutral-950 px-5 py-3 text-xs font-black uppercase tracking-wider hover:bg-neutral-100 transition-all shadow-[4px_4px_0_0_#000]"
            >
              <Github className="w-4 h-4" />
              <span>GITHUB REPO →</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. SPECIFICATION TELEMETRY STRIP */}
      <section className="border-b-2 border-neutral-900 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x-2 divide-y-2 md:divide-y-0 divide-neutral-900 text-xs">
          <div className="p-4">
            <span className="text-[10px] text-neutral-400 font-bold block mb-1">TARGET PENGGUNA</span>
            <span className="font-bold text-neutral-900">Studio Agency (5-15 Pax)</span>
          </div>
          <div className="p-4">
            <span className="text-[10px] text-neutral-400 font-bold block mb-1">CORE ARCHITECTURE</span>
            <span className="font-bold text-neutral-900">Task-First & Project Sync</span>
          </div>
          <div className="p-4">
            <span className="text-[10px] text-neutral-400 font-bold block mb-1">DESIGN LANGUAGE</span>
            <span className="font-bold text-neutral-900">Warm Sand & Editorial Paper</span>
          </div>
          <div className="p-4">
            <span className="text-[10px] text-neutral-400 font-bold block mb-1">CAPABILITIES</span>
            <span className="font-bold text-neutral-900">Offline Room + Server Gemini</span>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE DEVICE MOCKUP & LIVE PREVIEW */}
      <main id="interactive-demo" className="max-w-6xl mx-auto px-margin py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: MOCKUP DEVICE FRAME (ANDROID DEVICE INTERFACE) */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full max-w-[390px] border-4 border-neutral-900 rounded-[38px] bg-neutral-900 p-3 shadow-[8px_8px_0_0_rgba(0,0,0,0.9)]">
              {/* Phone Outer Shell */}
              <div className="w-full bg-[#FCF9F3] text-[#1C1C18] rounded-[28px] overflow-hidden flex flex-col min-h-[660px] max-h-[720px] relative border border-neutral-300">
                {/* Android Status Bar */}
                <div className="bg-[#FCF9F3] px-6 pt-3 pb-1 flex justify-between items-center text-[10px] font-bold text-neutral-600 border-b border-neutral-200/50">
                  <span>09:41</span>
                  {/* Dynamic Punch-hole / Island */}
                  <div className="w-16 h-3.5 bg-neutral-900 rounded-full mx-auto" />
                  <div className="flex items-center gap-1.5">
                    <span>5G</span>
                    <span>98%</span>
                  </div>
                </div>

                {/* APP HEADER */}
                <div className="bg-[#FCF9F3] px-5 py-3 border-b border-neutral-200 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-rampung uppercase tracking-widest block">
                      AETHERS STUDIO // RAMPUNG
                    </span>
                    <h2 className="text-base font-black tracking-tight text-[#080C12]">
                      {deviceTab === 'TODAY' && 'Hari Ini'}
                      {deviceTab === 'PROJECTS' && 'Daftar Proyek'}
                      {deviceTab === 'TEAM' && 'Aktivitas Tim'}
                    </h2>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-rampung text-white flex items-center justify-center text-xs font-black">
                    A
                  </div>
                </div>

                {/* TOAST CELEBRATION */}
                {toastMsg && (
                  <div className="absolute top-16 left-3 right-3 bg-[#080C12] text-white p-2.5 rounded-lg text-[10px] font-bold z-30 shadow-lg flex items-center gap-2 border border-neutral-700 animate-in fade-in">
                    <Sparkles className="w-3.5 h-3.5 text-[#BDEDDC] flex-shrink-0" />
                    <span>{toastMsg}</span>
                  </div>
                )}

                {/* SCREEN CONTENT AREA */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {/* SCREEN 1: TODAY (HARI INI) */}
                  {deviceTab === 'TODAY' && !selectedTask && (
                    <div className="space-y-3">
                      {/* Summary Banner */}
                      <div className="bg-gradient-to-r from-[#3B675A] to-[#2e5247] text-white rounded-xl p-3 flex justify-between items-center shadow-sm">
                        <div>
                          <span className="text-[10px] text-white/80 font-bold block">FOKUS HARI INI</span>
                          <span className="text-sm font-black">
                            {activeTasksCount} Tugas Menunggu
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-[#BDEDDC] font-bold block">SELESAI</span>
                          <span className="text-sm font-black text-[#BDEDDC]">
                            {completedTasksCount} / {tasks.length}
                          </span>
                        </div>
                      </div>

                      {/* Filter Pills */}
                      <div className="flex gap-1.5 overflow-x-auto pb-1">
                        {(['ALL', 'HIGH', 'REVIEW'] as const).map((flt) => (
                          <button
                            key={flt}
                            onClick={() => setTaskFilter(flt)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                              taskFilter === flt
                                ? 'bg-rampung text-white'
                                : 'bg-[#E5E2DC] text-neutral-600 hover:bg-[#d8d5ce]'
                            }`}
                          >
                            {flt === 'ALL' && 'Semua'}
                            {flt === 'HIGH' && 'Prioritas Tinggi'}
                            {flt === 'REVIEW' && 'Review'}
                          </button>
                        ))}
                      </div>

                      {/* Task List */}
                      <div className="space-y-2">
                        {filteredTasks.map((t) => (
                          <div
                            key={t.id}
                            onClick={() => setSelectedTask(t)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer ${
                              t.isCompleted
                                ? 'bg-[#F0EEE8]/60 border-neutral-200 opacity-60'
                                : 'bg-white border-neutral-300 hover:border-[#3B675A] shadow-sm'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <span
                                className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                  t.priority === 'HIGH'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-neutral-100 text-neutral-600'
                                }`}
                              >
                                {t.priority === 'HIGH' ? 'Prioritas Tinggi' : 'Normal'}
                              </span>
                              <span className="text-[9px] text-neutral-400 font-bold">{t.dueDate}</span>
                            </div>

                            <h3
                              className={`text-xs font-bold leading-tight ${
                                t.isCompleted ? 'line-through text-neutral-400' : 'text-neutral-900'
                              }`}
                            >
                              {t.title}
                            </h3>

                            <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-500 pt-1.5 border-t border-neutral-100">
                              <span className="truncate max-w-[170px]">{t.projectName}</span>
                              <span className="font-bold text-[#3B675A]">
                                {t.subtasks.filter((s) => s.isCompleted).length}/{t.subtasks.length} Subtask
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SCREEN 2: DETAIL TUGAS (POPUP OVERLAY) */}
                  {selectedTask && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <button
                        onClick={() => setSelectedTask(null)}
                        className="flex items-center gap-1 text-[11px] font-bold text-[#3B675A] hover:underline"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Kembali ke Tugas</span>
                      </button>

                      <div className="bg-white p-3.5 rounded-xl border border-neutral-300 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded font-bold">
                            {selectedTask.category}
                          </span>
                          <span className="text-[10px] text-neutral-400">{selectedTask.dueDate}</span>
                        </div>

                        <h3 className="text-sm font-black text-neutral-900 leading-snug">
                          {selectedTask.title}
                        </h3>

                        <div className="text-[10px] text-neutral-500 bg-[#F6F3ED] p-2 rounded">
                          <span className="block font-bold text-neutral-700">Proyek Induk:</span>
                          <span>{selectedTask.projectName}</span>
                        </div>

                        {/* Assignee Avatar Info */}
                        <div className="flex items-center gap-2 border-t border-neutral-100 pt-2">
                          <div className="w-6 h-6 rounded-full bg-[#3B675A] text-white flex items-center justify-center text-[10px] font-bold">
                            {selectedTask.assigneeName[0]}
                          </div>
                          <div className="text-[10px]">
                            <span className="font-bold text-neutral-900 block">{selectedTask.assigneeName}</span>
                            <span className="text-neutral-400">{selectedTask.assigneeRole}</span>
                          </div>
                        </div>

                        {/* Checklist Sub-Tugas */}
                        <div className="space-y-2 border-t border-neutral-100 pt-2">
                          <span className="text-[10px] font-bold text-neutral-700 block uppercase">
                            Checklist Sub-Tugas:
                          </span>
                          <div className="space-y-1.5">
                            {selectedTask.subtasks.map((st) => (
                              <label
                                key={st.id}
                                onClick={(e) => {
                                  e.preventDefault();
                                  toggleSubtask(selectedTask.id, st.id);
                                }}
                                className="flex items-center gap-2 p-1.5 bg-[#FCF9F3] border border-neutral-200 rounded cursor-pointer hover:bg-neutral-100 transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={st.isCompleted}
                                  readOnly
                                  className="accent-[#3B675A] w-3.5 h-3.5"
                                />
                                <span
                                  className={`text-[10px] leading-tight ${
                                    st.isCompleted ? 'line-through text-neutral-400' : 'text-neutral-800'
                                  }`}
                                >
                                  {st.title}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Single Primary Action: Tandai Selesai */}
                        <button
                          onClick={() => completeEntireTask(selectedTask.id)}
                          className={`w-full py-2.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                            selectedTask.isCompleted
                              ? 'bg-[#2E7D32] text-white'
                              : 'bg-[#3B675A] text-white hover:bg-[#2e5247]'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{selectedTask.isCompleted ? 'SUDAH SELESAI' : 'TANDAI SELESAI'}</span>
                        </button>
                        <p className="text-[9px] text-neutral-400 text-center">
                          Satu aksi utama — progres proyek otomatis ter-update.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* SCREEN 3: PROJECTS (DAFTAR PROYEK) */}
                  {deviceTab === 'PROJECTS' && !selectedTask && (
                    <div className="space-y-2.5">
                      {projects.map((proj) => (
                        <div key={proj.id} className="bg-white p-3 rounded-xl border border-neutral-300 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[9px] text-[#3B675A] font-bold block">{proj.clientName}</span>
                              <h3 className="text-xs font-black text-neutral-900">{proj.title}</h3>
                            </div>
                            <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-[#BDEDDC] text-[#224E42]">
                              {proj.statusBadge}
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div>
                            <div className="flex justify-between text-[10px] font-bold mb-1">
                              <span className="text-neutral-500">Penyelesaian</span>
                              <span className="text-[#3B675A]">{proj.progress}%</span>
                            </div>
                            <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-[#3B675A] h-full transition-all duration-500"
                                style={{ width: `${proj.progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-[9px] text-neutral-400 pt-1 border-t border-neutral-100">
                            <span>Deadline: {proj.deadline}</span>
                            <span>{proj.completedTasks}/{proj.totalTasks} Selesai</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* SCREEN 4: TEAM (AKTIVITAS TIM) */}
                  {deviceTab === 'TEAM' && !selectedTask && (
                    <div className="space-y-2">
                      {[
                        { name: 'Ari', role: 'Lead Architect', status: 'Focus Sprint', task: 'Rampung Compose UI' },
                        { name: 'Rian', role: 'Android Dev', status: 'Active', task: 'Room Schema Migration' },
                        { name: 'Dewi', role: 'UI/UX Designer', status: 'Active', task: 'Color Hierarchy Review' },
                        { name: 'Rio', role: 'Ops Partner', status: 'In Meeting', task: 'Ecosystem Alignment' },
                      ].map((tm, idx) => (
                        <div key={idx} className="bg-white p-2.5 rounded-xl border border-neutral-300 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#3B675A] text-white flex items-center justify-center text-xs font-bold">
                              {tm.name[0]}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-neutral-900 leading-none">{tm.name}</h4>
                              <span className="text-[9px] text-neutral-400">{tm.role}</span>
                              <span className="block text-[9px] text-[#3B675A] mt-0.5 truncate max-w-[150px]">
                                {tm.task}
                              </span>
                            </div>
                          </div>
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-[#E5E2DC] text-neutral-700">
                            {tm.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* BOTTOM NAVIGATION (JETPACK COMPOSE RAMPUNG STYLE) */}
                <div className="bg-[#FCF9F3] border-t border-neutral-300 px-4 py-2 flex justify-around items-center">
                  <button
                    onClick={() => {
                      setSelectedTask(null);
                      setDeviceTab('TODAY');
                    }}
                    className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${
                      deviceTab === 'TODAY' && !selectedTask ? 'text-[#3B675A]' : 'text-neutral-400'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Hari Ini</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTask(null);
                      setDeviceTab('PROJECTS');
                    }}
                    className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${
                      deviceTab === 'PROJECTS' ? 'text-[#3B675A]' : 'text-neutral-400'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Proyek</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTask(null);
                      setDeviceTab('TEAM');
                    }}
                    className={`flex flex-col items-center gap-0.5 text-[9px] font-bold ${
                      deviceTab === 'TEAM' ? 'text-[#3B675A]' : 'text-neutral-400'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Aktivitas</span>
                  </button>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-neutral-500 font-mono text-center">
              ▲ <strong className="text-neutral-900">Interaktif:</strong> Klik task, checklist sub-tugas, atau tombol "Tandai Selesai" di dalam frame.
            </p>
          </div>

          {/* RIGHT: DETAILED BREAKDOWN & ARCHITECTURAL SPECS */}
          <div className="lg:col-span-6 space-y-6">
            <div className="border-2 border-neutral-900 bg-white p-6 shadow-[4px_4px_0_0_rgba(0,0,0,0.9)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-electric-blue text-white px-2 py-0.5 text-xs font-black">
                  PRODUCT BLUEPRINT
                </span>
                <span className="text-xs text-neutral-400 font-bold">ALUR & VISIBILITAS</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight uppercase">
                ALUR PENGGUNAAN UTAMA
              </h2>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Dirancang untuk founder dan lead yang butuh update cepat tanpa harus membuka detail spreadsheet
                atau Jira yang berat.
              </p>

              {/* Step Sequence */}
              <div className="mt-6 space-y-4">
                {[
                  {
                    step: '01',
                    title: 'Dashboard Harian (Layar Pertama)',
                    desc: 'Ringkasan instan: jumlah tugas hari ini, berapa yang selesai, dan status proyek aktif. Scan cepat dengan tag warna prioritas.',
                  },
                  {
                    step: '02',
                    title: 'Detail Tugas & Checklist Sub-Tugas',
                    desc: 'Buka tugas prioritas untuk melihat proyek induk, deadline, avatar PIC, dan sub-tugas terstruktur. Satu aksi utama jelas: Tandai Selesai.',
                  },
                  {
                    step: '03',
                    title: 'Daftar Proyek & Progress Bar Real-Time',
                    desc: 'Semua proyek studio terpantau dengan progress bar persentase penyelesaian otomatis saat subtask dicentang.',
                  },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4 p-3 border border-neutral-300 bg-[#F4F3EF]">
                    <span className="text-sm font-black text-electric-blue bg-white border border-neutral-900 px-2 py-1">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="text-xs font-black text-neutral-900 uppercase">{item.title}</h3>
                      <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* REPOSITORY & CODE SPECS */}
            <div className="border-2 border-neutral-900 bg-white p-6 shadow-[4px_4px_0_0_rgba(0,0,0,0.9)] space-y-4">
              <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-3">
                <div className="flex items-center gap-2">
                  <Github className="w-5 h-5 text-neutral-900" />
                  <span className="font-black text-sm">Zeropro091/rampung</span>
                </div>
                <a
                  href="https://github.com/Zeropro091/rampung.git"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-electric-blue hover:underline flex items-center gap-1"
                >
                  <span>VIEW REPO</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] text-neutral-400 font-bold block">PACKAGE</span>
                  <span className="font-bold text-neutral-800">com.example.rampung</span>
                </div>
                <div className="p-3 bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] text-neutral-400 font-bold block">FRAMEWORK</span>
                  <span className="font-bold text-neutral-800">Android Jetpack Compose</span>
                </div>
                <div className="p-3 bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] text-neutral-400 font-bold block">DATABASE</span>
                  <span className="font-bold text-neutral-800">Android Room (SQLite)</span>
                </div>
                <div className="p-3 bg-neutral-50 border border-neutral-200">
                  <span className="text-[10px] text-neutral-400 font-bold block">AI CAPABILITY</span>
                  <span className="font-bold text-neutral-800">Server Gemini API</span>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-3">
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Clone & Build: Jalankan <code className="bg-neutral-100 px-1 py-0.5 text-neutral-800 border">./gradlew assembleDebug</code> pada root project.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* STICKY MOBILE CTA */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 border-t-2 border-neutral-900 bg-[#FCF9F3] px-4 py-3 md:hidden transition-transform duration-300 ${showSticky ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex items-center gap-3">
          <a
            href="#interactive-demo"
            className="flex-1 bg-[#3B675A] text-white text-center py-3 text-xs font-black uppercase tracking-wider border-2 border-neutral-900 shadow-[3px_3px_0_0_#000]"
          >
            Coba Live Demo
          </a>
          <a
            href="https://github.com/Zeropro091/rampung.git"
            target="_blank"
            rel="noreferrer"
            className="flex-1 bg-white text-neutral-900 text-center py-3 text-xs font-black uppercase tracking-wider border-2 border-neutral-900 shadow-[3px_3px_0_0_#000]"
          >
            View Repo
          </a>
        </div>
      </div>
    </div>
  );
}
