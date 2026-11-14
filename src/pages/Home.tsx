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
    <h1 className="font-hero-headline leading-[0.88] uppercase text-black select-none tracking-[-0.035em]">
      {HERO_WORDS.map((word, i) => (
        <span key={word} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={reduceMotion ? { opacity: 0 } : { y: '105%', opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { y: '0%', opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.1 + i * 0.08,
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
    <div className="overflow-hidden border-y border-black bg-electric-blue text-white py-2">
      <div className="marquee-track" style={{ ['--marquee-duration' as string]: '38s' }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {TICKER_ITEMS.map((item) => (
              <span
                key={`${copy}-${item}`}
                className="font-label-caps whitespace-nowrap px-6 flex items-center gap-6 font-bold"
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

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
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
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
    >
      <motion.img
        alt="Knight riding Pegasus towards electric blue digital portal"
        className={`w-full h-full object-contain md:object-cover lg:object-contain object-right-bottom md:object-right transition-filter duration-300 ${
          glitching ? 'glitch-active' : ''
        }`}
        style={reduceMotion ? undefined : { y }}
        src="/hero-knight.webp"
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
      />
      {/* Mobile / tablet readability guard */}
      <div className="absolute inset-y-0 left-0 w-full sm:w-[60%] md:w-[45%] bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-none lg:hidden" />
    </div>
  );
}

export function Home() {
  const { play } = useSound();

  return (
    <>
      <header className="relative w-full bg-white border-b-2 border-black overflow-hidden min-h-[540px] md:min-h-[640px] lg:min-h-[740px] xl:min-h-[810px] flex flex-col justify-center">
        {/* Background Visual: Knight, Pegasus, Portal & Clouds */}
        <HeroVisual />

        {/* Content Layer: Left-aligned typography and CTAs */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 py-12 md:py-16 flex flex-col justify-center pointer-events-auto">
          <motion.span
            className="font-label-caps mb-4 sm:mb-6 inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-neutral-800"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <span className="inline-block h-2 w-2 bg-electric-blue hard-blink" />
            DGT.LZ STUDIO // DIGITAL ECOSYSTEM ARCHITECTS
          </motion.span>

          <HeroHeadline />

          <motion.div
            className="flex flex-wrap items-center gap-3 mt-8 sm:mt-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
          >
            <Magnetic strength={0.18} max={6}>
              <Pressable
                as="a"
                href="#contact"
                cue="mechanical"
                ripple
                className="font-label-caps bg-black text-white hover:bg-electric-blue px-7 py-3.5 transition-colors duration-200 inline-block font-bold tracking-wider shadow-sm"
              >
                MULAI PROYEK →
              </Pressable>
            </Magnetic>
            <Pressable
              as="a"
              href="#work"
              cue="click"
              ripple
              className="font-label-caps border-2 border-black px-7 py-3.5 hover:border-electric-blue hover:text-electric-blue transition-colors duration-200 inline-block font-bold tracking-wider bg-white/70 backdrop-blur-xs"
            >
              LIHAT KARYA
            </Pressable>
          </motion.div>
        </div>
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
