/**
 * DGTLZ Sound Engine
 *
 * All sounds are synthesized at runtime with the Web Audio API — no audio files,
 * no network requests, no bundle weight. This is a "terminal / brutalist machine"
 * palette: short, dry, mechanical. Deliberately no melodic content.
 *
 * Browsers block audio until a user gesture. `unlock()` is called from the first
 * pointer/key event on the document (see SoundProvider) so the context is warm
 * before the user ever triggers a UI sound.
 */

export type SoundName =
  | 'hover'        // tiny tick — pointer entering an interactive element
  | 'press'        // pointer down — the physical "contact"
  | 'release'      // pointer up — switch returning
  | 'click'        // full mechanical click (press + release combined)
  | 'nav'          // ascending two-note — navigation accepted
  | 'success'      // resolved major third — action completed
  | 'error'        // descending flat second — validation failed
  | 'whoosh'       // filtered noise sweep — section reveal
  | 'open'         // panel / modal expand
  | 'close'        // panel / modal collapse
  | 'toggle-on'    // boolean switched to true
  | 'toggle-off'   // boolean switched to false
  | 'filter'       // segment / chip selected
  | 'tick'         // scroll milestone / counter settle
  | 'type';        // typewriter keypress (very quiet, throttled)

type Synth = (ctx: AudioContext, out: AudioNode, now: number) => void;

const MASTER_VOLUME = 0.32;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let dry: GainNode | null = null;
let wet: GainNode | null = null;
let muted = false;
let noiseBuffer: AudioBuffer | null = null;
const lastPlayed = new Map<SoundName, number>();

/** Minimum ms between two plays of the same sound — stops hover spam. */
const THROTTLE: Partial<Record<SoundName, number>> = {
  hover: 55,
  type: 28,
  tick: 90,
  press: 40,
  release: 40,
  whoosh: 180,
};

function readMutedPref(): boolean {
  try {
    return localStorage.getItem('dgtlz_sound') === 'off';
  } catch {
    return false;
  }
}

muted = readMutedPref();

/**
 * A short synthesized plate reverb: decaying filtered noise. One buffer, built
 * once. It gives every cue a sense of physical space, which is most of what
 * separates "beep" from "machine in a room".
 */
function buildReverb(context: AudioContext): ConvolverNode {
  const seconds = 0.45;
  const len = Math.floor(context.sampleRate * seconds);
  const impulse = context.createBuffer(2, len, context.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
  }
  const conv = context.createConvolver();
  conv.buffer = impulse;
  return conv;
}

function ensureCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (ctx) return ctx;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();

  master = ctx.createGain();
  master.gain.value = muted ? 0 : MASTER_VOLUME;
  master.connect(ctx.destination);

  dry = ctx.createGain();
  dry.gain.value = 1;
  dry.connect(master);

  wet = ctx.createGain();
  wet.gain.value = 0.14;
  wet.connect(buildReverb(ctx));
  wet.connect(master);

  return ctx;
}

function getNoise(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer) return noiseBuffer;
  const len = Math.floor(ctx.sampleRate * 1.2);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  noiseBuffer = buf;
  return buf;
}

/** Attach a sound's output to the dry bus and the reverb send, with optional pan. */
function route(context: AudioContext, g: GainNode, pan = 0): void {
  if (!dry || !wet) return;
  if (pan !== 0 && typeof context.createStereoPanner === 'function') {
    const p = context.createStereoPanner();
    p.pan.value = Math.max(-1, Math.min(1, pan));
    g.connect(p);
    p.connect(dry);
    p.connect(wet);
  } else {
    g.connect(dry);
    g.connect(wet);
  }
}

/** Short attack / exponential decay envelope, wired to the dry + reverb buses. */
function envelope(
  ctx: AudioContext,
  now: number,
  peak: number,
  attack: number,
  decay: number,
  pan = 0,
): GainNode {
  const g = ctx.createGain();
  const safePeak = Math.max(peak, 0.0001);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(safePeak, now + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);
  route(ctx, g, pan);
  return g;
}

const SYNTHS: Record<SoundName, Synth> = {
  // 1.8 kHz sine blip, 18 ms. Barely audible — just enough to feel the hover.
  hover: (ctx, _out, now) => {
    const g = envelope(ctx, now, 0.05, 0.002, 0.018);
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(1800, now);
    o.connect(g);
    o.start(now);
    o.stop(now + 0.03);
  },

  // Square click with a fast downward pitch drop = mechanical switch.
  click: (ctx, _out, now) => {
    const g = envelope(ctx, now, 0.13, 0.001, 0.045);
    const o = ctx.createOscillator();
    o.type = 'square';
    o.frequency.setValueAtTime(520, now);
    o.frequency.exponentialRampToValueAtTime(140, now + 0.04);
    o.connect(g);
    o.start(now);
    o.stop(now + 0.06);

    // Transient noise tick on top for the "contact" feel
    const n = ctx.createBufferSource();
    n.buffer = getNoise(ctx);
    const ng = envelope(ctx, now, 0.09, 0.001, 0.012);
    const nf = ctx.createBiquadFilter();
    nf.type = 'highpass';
    nf.frequency.value = 2400;
    n.connect(nf).connect(ng);
    n.start(now);
    n.stop(now + 0.02);
  },

  // Two triangle notes, perfect fifth apart. Panned outward as they rise.
  nav: (ctx, _out, now) => {
    [660, 990].forEach((freq, i) => {
      const t = now + i * 0.055;
      const g = envelope(ctx, t, 0.075, 0.003, 0.09, i === 0 ? -0.18 : 0.18);
      const o = ctx.createOscillator();
      o.type = 'triangle';
      o.frequency.setValueAtTime(freq, t);
      o.connect(g);
      o.start(t);
      o.stop(t + 0.11);
    });
  },

  // Major triad arpeggio — unambiguous "it worked". Widens as it climbs.
  success: (ctx, _out, now) => {
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const t = now + i * 0.07;
      const g = envelope(ctx, t, 0.085, 0.004, 0.22, (i - 1) * 0.22);
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(freq, t);
      o.connect(g);
      o.start(t);
      o.stop(t + 0.26);
    });
  },

  // Flat second = dissonance = wrong.
  error: (ctx, _out, now) => {
    [311, 294].forEach((freq, i) => {
      const t = now + i * 0.1;
      const g = envelope(ctx, t, 0.1, 0.004, 0.14);
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(freq, t);
      o.connect(g);
      o.start(t);
      o.stop(t + 0.18);
    });
  },

  // Bandpass noise sweep. The signature "section arrived" sound.
  whoosh: (ctx, _out, now) => {
    const n = ctx.createBufferSource();
    n.buffer = getNoise(ctx);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 1.4;
    bp.frequency.setValueAtTime(280, now);
    bp.frequency.exponentialRampToValueAtTime(3400, now + 0.32);
    const g = envelope(ctx, now, 0.1, 0.06, 0.3);
    n.connect(bp).connect(g);
    n.start(now);
    n.stop(now + 0.4);
  },

  open: (ctx, _out, now) => {
    const g = envelope(ctx, now, 0.09, 0.005, 0.16);
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.setValueAtTime(320, now);
    o.frequency.exponentialRampToValueAtTime(760, now + 0.15);
    o.connect(g);
    o.start(now);
    o.stop(now + 0.2);
  },

  close: (ctx, _out, now) => {
    const g = envelope(ctx, now, 0.09, 0.005, 0.14);
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.setValueAtTime(760, now);
    o.frequency.exponentialRampToValueAtTime(300, now + 0.13);
    o.connect(g);
    o.start(now);
    o.stop(now + 0.18);
  },

  // The "finger touches the switch" half of a click: low thud + high contact noise.
  press: (ctx, _out, now) => {
    const g = envelope(ctx, now, 0.1, 0.001, 0.028);
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.setValueAtTime(240, now);
    o.frequency.exponentialRampToValueAtTime(90, now + 0.025);
    o.connect(g);
    o.start(now);
    o.stop(now + 0.04);

    const n = ctx.createBufferSource();
    n.buffer = getNoise(ctx);
    const nf = ctx.createBiquadFilter();
    nf.type = 'highpass';
    nf.frequency.value = 3200;
    const ng = envelope(ctx, now, 0.05, 0.001, 0.009);
    n.connect(nf).connect(ng);
    n.start(now);
    n.stop(now + 0.015);
  },

  // The "switch springs back" half: lower, softer, a beat behind press.
  release: (ctx, _out, now) => {
    const g = envelope(ctx, now, 0.055, 0.001, 0.04);
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.setValueAtTime(150, now);
    o.frequency.exponentialRampToValueAtTime(72, now + 0.035);
    o.connect(g);
    o.start(now);
    o.stop(now + 0.05);
  },

  'toggle-on': (ctx, _out, now) => {
    const g = envelope(ctx, now, 0.08, 0.002, 0.07);
    const o = ctx.createOscillator();
    o.type = 'square';
    o.frequency.setValueAtTime(880, now);
    o.frequency.setValueAtTime(1320, now + 0.028);
    o.connect(g);
    o.start(now);
    o.stop(now + 0.1);
  },

  'toggle-off': (ctx, _out, now) => {
    const g = envelope(ctx, now, 0.08, 0.002, 0.07);
    const o = ctx.createOscillator();
    o.type = 'square';
    o.frequency.setValueAtTime(1320, now);
    o.frequency.setValueAtTime(880, now + 0.028);
    o.connect(g);
    o.start(now);
    o.stop(now + 0.1);
  },

  // Two quick ticks an octave apart — a selector snapping into a detent.
  filter: (ctx, _out, now) => {
    [2100, 2600].forEach((freq, i) => {
      const t = now + i * 0.032;
      const g = envelope(ctx, t, 0.05, 0.001, 0.02);
      const o = ctx.createOscillator();
      o.type = 'square';
      o.frequency.setValueAtTime(freq, t);
      o.connect(g);
      o.start(t);
      o.stop(t + 0.026);
    });
  },

  tick: (ctx, _out, now) => {
    const g = envelope(ctx, now, 0.06, 0.001, 0.03);
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(1400, now);
    o.connect(g);
    o.start(now);
    o.stop(now + 0.04);
  },

  // Very quiet square tick. Throttled hard so a full paragraph doesn't machine-gun.
  type: (ctx, _out, now) => {
    const g = envelope(ctx, now, 0.028, 0.001, 0.014);
    const o = ctx.createOscillator();
    o.type = 'square';
    o.frequency.setValueAtTime(1150 + Math.random() * 320, now);
    o.connect(g);
    o.start(now);
    o.stop(now + 0.02);
  },
};

export function play(name: SoundName): void {
  if (muted) return;

  const throttle = THROTTLE[name];
  if (throttle) {
    const last = lastPlayed.get(name) ?? 0;
    const now = performance.now();
    if (now - last < throttle) return;
    lastPlayed.set(name, now);
  }

  const audio = ensureCtx();
  if (!audio || !master) return;

  // Chrome suspends the context until a gesture; resume() is a no-op if running.
  if (audio.state === 'suspended') void audio.resume();

  try {
    SYNTHS[name](audio, master, audio.currentTime);
  } catch {
    // Audio must never break the UI. Swallow and move on.
  }
}

/** Call from the first user gesture so later programmatic sounds are allowed. */
export function unlock(): void {
  const audio = ensureCtx();
  if (!audio) return;
  if (audio.state === 'suspended') {
    // resume() can resolve after the gesture handler returns; retry once on the
    // next tick so we don't get stuck suspended if the first attempt lost the race.
    void audio.resume().then(() => {
      if (audio.state === 'suspended') void audio.resume();
    }).catch(() => {});
  }
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(next: boolean): void {
  muted = next;
  try {
    localStorage.setItem('dgtlz_sound', next ? 'off' : 'on');
  } catch {
    /* private mode — preference simply won't persist */
  }
  if (master && ctx) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(next ? 0 : MASTER_VOLUME, ctx.currentTime, 0.02);
  }
}
