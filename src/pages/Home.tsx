import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { TeamSection } from '../components/TeamSection';
import { ServicesSection } from '../components/ServicesSection';
import { WorkSection } from '../components/WorkSection';
import { WorkflowSection } from '../components/WorkflowSection';
import { LabSection } from '../components/LabSection';
import { YouthSection } from '../components/YouthSection';
import { CloudSection } from '../components/CloudSection';
import { AgentSection } from '../components/AgentSection';
import { SystemsTeaserSection } from '../components/SystemsTeaserSection';
import { EventsSection } from '../components/EventsSection';
import { PhilosophySection } from '../components/PhilosophySection';
import { DoctrineSection } from '../components/DoctrineSection';
import { FaqSection } from '../components/FaqSection';
import { ContactSection } from '../components/ContactSection';
import { Typewriter } from '../components/Typewriter';
import { Reveal } from '../components/Reveal';
import { Pressable } from '../components/Pressable';
import { Magnetic } from '../components/Magnetic';
import { useSound } from '../lib/useSound';

const HERO_WORDS = ['WE', 'BUILD', 'DIGITAL', 'ECOSYSTEMS'];

const TICKER_ITEMS = [
  'LANDING PAGE',
  'WEB APP',
  'OTOMASI OPERASIONAL',
  'AI AGENT',
  'PAYMENT ORCHESTRATION',
  'CUSTOM ROUTING',
  'DEPLOY & MAINTAIN',
];

function HeroHeadline() {
  const reduceMotion = useReducedMotion();

  return (
    <h1 className="font-display-xl leading-none uppercase">
      {HERO_WORDS.map((word, i) => (
        <span key={word} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={reduceMotion ? { opacity: 0 } : { y: '110%', opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { y: '0%', opacity: 1 }}
            transition={{
              duration: 0.85,
              delay: 0.12 + i * 0.09,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {i === HERO_WORDS.length - 1 && (
              <span className="text-electric-blue hard-blink">.</span>
            )}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

function HeroTicker() {
  return (
    <div className="overflow-hidden border-y border-electric-blue bg-electric-blue text-white py-2">
      <div className="marquee-track" style={{ ['--marquee-duration' as string]: '38s' }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {TICKER_ITEMS.map((item) => (
              <span
                key={`${copy}-${item}`}
                className="font-label-caps whitespace-nowrap px-6 flex items-center gap-6"
              >
                {item}
                <span className="opacity-50">/</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const [glitching, setGlitching] = useState(false);

  const triggerGlitch = () => {
    if (reduceMotion) return;
    setGlitching(true);
    window.setTimeout(() => setGlitching(false), 460);
  };

  return (
    <div
      ref={ref}
      onMouseEnter={triggerGlitch}
      className="col-span-12 md:col-span-4 dither-container scanlines bg-electric-blue/10 flex items-center justify-center p-gutter overflow-hidden relative min-h-[300px]"
    >
      <motion.img
        alt="Classical marble statue fragmented with geometric glitched lines"
        className={`w-full h-full object-cover ${glitching ? 'glitch-active' : ''}`}
        style={reduceMotion ? undefined : { y, scale }}
        src="/statue.png"
        initial={{ opacity: 0, filter: 'blur(12px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.1, delay: 0.2, ease: 'easeOut' }}
      />
      <div className="absolute inset-0 dither-pattern opacity-20 pointer-events-none" />
      <motion.div
        className="absolute inset-0 bg-electric-blue pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      />
    </div>
  );
}

export function Home() {
  const { play } = useSound();

  return (
    <>
      <header className="grid grid-cols-1 md:grid-cols-12 border-b border-electric-blue">
        <div className="col-span-12 md:col-span-8 p-margin flex flex-col justify-end border-b md:border-b-0 md:border-r border-electric-blue min-h-[400px] md:min-h-[614px]">
          <motion.span
            className="font-label-caps mb-4 inline-flex items-center gap-2"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <span className="inline-block h-1.5 w-1.5 bg-electric-blue hard-blink" />
            DGT.LZ STUDIO
          </motion.span>

          <HeroHeadline />

          <p className="font-mono text-xs md:text-sm tracking-widest mt-6 opacity-70 min-h-[3.5em]">
            <Typewriter
              text="DARI LANDING PAGE → WEB APP → OTOMASI → AI AGENT YANG MENJALANKAN BISNIS KAMU."
              speed={22}
              startDelay={620}
              linePause={300}
            />
          </p>

          <motion.div
            className="flex flex-wrap items-center gap-3 mt-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <Magnetic strength={0.18} max={6}>
              <Pressable
                as="a"
                href="#contact"
                cue="mechanical"
                ripple
                className="font-label-caps bg-electric-blue text-white px-6 py-3 hover:bg-black transition-colors duration-200 inline-block"
              >
                MULAI PROYEK →
              </Pressable>
            </Magnetic>
            <Pressable
              as="a"
              href="#work"
              cue="click"
              ripple
              className="font-label-caps border border-electric-blue px-6 py-3 draw-underline hover:text-electric-blue transition-colors duration-200 inline-block"
            >
              LIHAT KARYA
            </Pressable>
          </motion.div>
        </div>

        <HeroVisual />
      </header>

      <HeroTicker />

      <Reveal sound>
        <WorkSection />
      </Reveal>
      <Reveal sound>
        <WorkflowSection />
      </Reveal>
      <Reveal sound>
        <AgentSection />
      </Reveal>
      <Reveal sound>
        <LabSection />
      </Reveal>
      <Reveal sound>
        <YouthSection />
      </Reveal>
      <Reveal sound>
        <CloudSection />
      </Reveal>
      <Reveal sound>
        <SystemsTeaserSection />
      </Reveal>
      <Reveal sound>
        <EventsSection />
      </Reveal>
      <Reveal sound>
        <TeamSection />
      </Reveal>
      <Reveal sound>
        <ServicesSection />
      </Reveal>
      <Reveal sound>
        <PhilosophySection />
      </Reveal>
      <Reveal sound>
        <DoctrineSection />
      </Reveal>
      <Reveal sound>
        <FaqSection />
      </Reveal>
      <Reveal sound>
        <ContactSection />
      </Reveal>
    </>
  );
}
