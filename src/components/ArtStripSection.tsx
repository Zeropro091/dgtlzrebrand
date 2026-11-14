import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';

// Art strip — theme matches AI AGENT UNTUK BISNIS (AgentSection):
// dark #121212 canvas, monochrome white/grey accents, mono labels.

// Pixel canvas: putih → #121212 dissolve pakai per-pixel dither (Bayer 4x4),
// piksel dekat cursor "menyala" putih. Canvas = satu elemen, murah.
const PX = 4; // ukuran piksel
const BAYER = [
  [15, 8, 11, 2],
  [3, 13, 6, 9],
  [10, 5, 14, 7],
  [1, 4, 12, 0],
];

function DitherBand() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef<{ x: number; y: number } | null>(null);
  const hoverRef = useRef(false);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let t = 0;
    let cols = 0;
    let rows = 0;
    let visible = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Satu frame statis: dither gradient tanpa animasi. Dipakai saat idle.
    const paint = (animate: boolean) => {
      const rect = cv.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const H = Math.max(1, Math.floor(rect.height));
      if (cv.width !== w * dpr || cv.height !== H * dpr) {
        cv.width = w * dpr;
        cv.height = H * dpr;
      }
      // selalu hitung ulang grid — jangan bergantung pada perubahan ukuran canvas
      cols = Math.ceil(w / PX);
      rows = Math.ceil(H / PX);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, H);

      const m = mouse.current;
      // koordinat mouse relatif canvas (rect sudah viewport-relative)
      const mx = m ? m.x - rect.left : -1e4;
      const my = m ? m.y - rect.top : -1e4;

      // batch per warna supaya fillRect tidak diganti style tiap piksel
      for (let ry = 0; ry < rows; ry++) {
        const p = ry / Math.max(1, rows - 1);
        const eased = p * p * (3 - 2 * p);
        for (let cx = 0; cx < cols; cx++) {
          const b = BAYER[ry & 3][cx & 3] / 16;
          const on = eased > b;
          let glow = 0;
          if (animate && hoverRef.current && m) {
            const dx = cx * PX + PX / 2 - mx;
            const dy = ry * PX + PX / 2 - my;
            const dist = Math.hypot(dx, dy);
            if (dist < 90) {
              glow = (1 - dist / 90) * (0.72 + 0.28 * Math.sin(t * 6 + dist * 0.08));
            }
          }
          if (glow > 0.08) {
            // Monokrom: piksel di sekitar kursor cuma digeser ke putih/abu,
            // bukan warna neon. Tetap konsisten sama tema hitam-putih.
            const g = Math.min(1, glow);
            if (on) {
              const v = Math.round(18 + 237 * g);
              ctx.fillStyle = `rgb(${v},${v},${v})`;
            } else {
              const v = Math.round(255 - 46 * g);
              ctx.fillStyle = `rgb(${v},${v},${v})`;
            }
            ctx.fillRect(cx * PX, ry * PX, PX, PX);
          } else if (on) {
            ctx.fillStyle = '#121212';
            ctx.fillRect(cx * PX, ry * PX, PX, PX);
          }
        }
      }
    };

    // Loop hanya jalan saat hover + terlihat. Idle = 0 biaya CPU.
    const loop = () => {
      t += 0.016;
      paint(true);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (raf || reduce) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      paint(false);
    };

    const onMove = (e: PointerEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const parent = cv.parentElement as HTMLElement;
    parent.addEventListener('pointermove', onMove);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) stop();
      else if (!hoverRef.current) paint(false);
    }, { threshold: 0.01 });
    io.observe(cv);

    // hover masuk/keluar ditangani di sini (bukan state React) supaya tidak stale closure
    const onEnter = () => {
      hoverRef.current = true;
      if (visible) start();
    };
    const onLeave = () => {
      hoverRef.current = false;
      mouse.current = null;
      stop();
    };
    parent.addEventListener('pointerenter', onEnter);
    parent.addEventListener('pointerleave', onLeave);

    paint(false);

    const onResize = () => paint(false);
    window.addEventListener('resize', onResize);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
      parent.removeEventListener('pointermove', onMove);
      parent.removeEventListener('pointerenter', onEnter);
      parent.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="relative w-full h-[128px] overflow-hidden cursor-crosshair"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}

type Art = {
  src: string;
  label: string;
  note: string;
};

const artworks: Art[] = [
  { src: '/art-hermes-agent.jpg', label: 'THE AGENT', note: 'MATA BIRU — AI YANG MEMANTAU 24/7' },
  { src: '/art-figure.jpg', label: 'THE OPERATOR', note: 'SILUET — EKSEKUTOR DI BALIK SISTEM' },
  { src: '/art-shade.jpg', label: 'THE SHADE', note: 'BAYANGAN — OTOMASI TANPA TERLIHAT' },
];

export function ArtStripSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="art-strip" className="border-b border-white/15 bg-[#121212] text-white">
      {/* Pixel dissolve band — putih "bocor" jadi gradasi smooth; cursor meng-geterkan piksel */}
      <DitherBand />

      {/* Header bar — mirrors AgentSection header pattern */}
      <div className="p-margin border-b border-white/15 flex items-end justify-between gap-4">
        <span className="font-label-caps block text-white">ARSIP VISUAL</span>
        <span className="font-mono text-[11px] opacity-70 tracking-widest">
          03 ARTIFACTS · DEPLOYED
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3">
        {artworks.map((art, i) => (
          <motion.figure
            key={art.src}
            className={`relative overflow-hidden group hover:bg-white/5 transition-colors duration-300 ${
              i < artworks.length - 1 ? 'border-b md:border-b-0 md:border-r border-white/15' : ''
            }`}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={art.src}
                alt={art.label}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-[filter,transform] duration-500 group-hover:scale-[1.03]"
              />
              {/* terminal overlay: dark base + LIVE status */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#121212]/70 via-transparent to-transparent" />
              <span className="absolute top-3 right-3 flex items-center gap-2 font-mono text-[10px] text-white tracking-widest opacity-90">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                LIVE
              </span>
            </div>
            <figcaption className="border-t border-white/15 px-4 py-3 flex flex-col gap-1">
              <span className="font-mono text-[11px] font-bold text-white tracking-widest">
                ▸ {String(i + 1).padStart(2, '0')} — {art.label}
              </span>
              <span className="font-mono text-[10px] opacity-70 tracking-wider">
                {art.note}
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>

      <div className="border-t border-white/15 p-margin flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <span className="font-mono text-[11px] opacity-70 tracking-widest">
          VISUAL SYSTEM: THE AGENT · THE OPERATOR · THE SHADE
        </span>
        <a
          href="#agent"
          className="font-label-caps bg-white text-[#121212] px-6 py-3 text-center hover:bg-[#121212] hover:text-white border border-white transition-colors"
        >
          LIHAT AGENT →
        </a>
      </div>
    </section>
  );
}
