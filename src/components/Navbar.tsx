import { type ReactNode, type Key, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion, type MotionValue } from 'motion/react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { SoundToggle } from './SoundToggle';
import { useSound } from '../lib/useSound';

type NavItem = { label: string; href: string };

const PRIMARY: NavItem[] = [
  { label: 'WORK', href: '/#work' },
  { label: 'SERVICES', href: '/#services' },
  { label: 'TEAM', href: '/#team' },
  { label: 'FAQ', href: '/#faq' },
];

const GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: 'COMPANY',
    items: [
      { label: 'WORKFLOW', href: '/#workflow' },
      { label: 'PHILOSOPHY', href: '/#philosophy' },
      { label: 'DOCTRINE', href: '/#doctrine' },
      { label: 'EVENTS', href: '/#events' },
      { label: 'PARTNERS', href: '/partners' },
    ],
  },
  {
    label: 'SYSTEMS',
    items: [
      { label: 'OVERVIEW', href: '/systems' },
      { label: 'ROUTE', href: '/route' },
      { label: 'PAYGATE', href: '/paygate' },
      { label: 'AGENT', href: '/agent' },
      { label: 'RAMPUNG', href: '/rampung' },
      { label: 'GALLERY', href: '/gallery' },
    ],
  },
];

const MOBILE_LINKS: NavItem[] = [
  ...PRIMARY,
  ...GROUPS.flatMap((g) => g.items),
  { label: 'YOUTH', href: '/youth' },
];

const HALF_H = 32;

function Face({
  index,
  rotate,
  children,
}: {
  index: number;
  rotate: MotionValue<number>;
  children: ReactNode;
}) {
  const transform = useTransform(rotate, () => `rotateX(${index * 90}deg) translateZ(${HALF_H}px)`);
  const opacity = useTransform(rotate, (r) => {
    const delta = Math.abs((((r + index * 90) % 360) + 540) % 360 - 180);
    return delta < 45 ? 1 : 0;
  });

  return (
    <motion.div
      className="absolute inset-0 flex justify-between items-center w-full px-4 lg:px-8 backface-hidden"
      style={{ transform, opacity }}
    >
      {children}
    </motion.div>
  );
}

function NavDropdown({
  group,
  linkCls,
}: {
  group: (typeof GROUPS)[number];
  linkCls: string;
  key?: Key;
}) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { play } = useSound();
  const ref = useRef<HTMLDivElement>(null);

  const show = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    setOpen((prev) => {
      if (!prev) play('open');
      return true;
    });
  };

  const hide = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = null;
      setOpen((prev) => {
        if (prev) play('close');
        return false;
      });
    }, 160);
  };

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (timer.current) clearTimeout(timer.current);
        setOpen(false);
        play('close');
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, play]);

  return (
    <div
      ref={ref}
      className="relative h-full flex items-center"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(e) => {
        if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={`${linkCls} inline-flex items-center gap-1`}
      >
        {group.label}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3 h-3" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={show}
        onMouseLeave={hide}
        className="absolute top-full left-1/2 -translate-x-1/2 min-w-[190px] bg-electric-blue border border-on-primary/40 shadow-[0_12px_28px_-8px_rgba(0,0,0,0.55)] py-1 z-[70]"
      >
            {group.items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => {
                  play('nav');
                  setOpen(false);
                }}
                onMouseEnter={() => play('hover')}
                className="block font-label-caps text-[11px] px-4 py-2 bg-electric-blue hover:bg-on-primary hover:text-electric-blue transition-colors whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const { play } = useSound();

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-16 bottom-0 z-40 bg-electric-blue text-on-primary overflow-y-auto lg:hidden"
    >
      <div className="grid grid-cols-2 gap-px bg-on-primary/20">
        {MOBILE_LINKS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={() => {
              play('nav');
              onClose();
            }}
            className="bg-electric-blue font-label-caps text-xs py-4 px-5 active:bg-on-primary active:text-electric-blue"
          >
            {item.label}
          </a>
        ))}
      </div>
      <div className="p-5 flex flex-col gap-3">
        <Link
          to="/login"
          onClick={onClose}
          className="font-label-caps text-xs border border-on-primary py-3 text-center"
        >
          DECK LOGIN
        </Link>
        <a
          href="/#contact"
          onClick={onClose}
          className="font-label-caps text-xs bg-on-primary text-electric-blue py-3 text-center font-bold"
        >
          CONTACT
        </a>
      </div>
    </motion.div>
  );
}

export function Navbar() {
  const reduceMotion = useReducedMotion();
  const { play } = useSound();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, [0, 300], [0, -270]);
  const rotateStyle = reduceMotion ? undefined : { rotateX: rotate, transformPerspective: 900 };

  const linkCls =
    'font-label-caps text-[11px] tracking-wider opacity-85 hover:bg-on-primary hover:text-electric-blue transition-colors duration-150 px-2.5 py-1.5 whitespace-nowrap';

  return (
    <>
      <nav className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[1800px] h-16 bg-electric-blue border-b border-on-primary text-on-primary overflow-visible">
        <ScrollProgress />
        <motion.div
          className="relative w-full h-full [transform-style:preserve-3d]"
          style={menuOpen ? undefined : rotateStyle}
          animate={{ rotateX: menuOpen ? 0 : undefined }}
        >
            <Face index={0} rotate={rotate}>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/"
                  onMouseEnter={() => play('hover')}
                  className="font-headline-md font-bold tracking-tighter whitespace-nowrap leading-none"
                >
                  DGTLZ<span className="hidden sm:inline">.AGENCY</span>
                </Link>
                <SoundToggle compact />
              </div>

              <div className="hidden lg:flex gap-1 items-center h-full">
                {PRIMARY.slice(0, 2).map((l) => (
                  <a
                    key={l.label}
                    className={linkCls}
                    href={l.href}
                    onMouseEnter={() => play('hover')}
                    onClick={() => play('click')}
                  >
                    {l.label}
                  </a>
                ))}
                {GROUPS.map((g) => (
                  <NavDropdown key={g.label} group={g} linkCls={linkCls} />
                ))}
                {PRIMARY.slice(2).map((l) => (
                  <a
                    key={l.label}
                    className={linkCls}
                    href={l.href}
                    onMouseEnter={() => play('hover')}
                    onClick={() => play('click')}
                  >
                    {l.label}
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Link
                  to="/youth"
                  onMouseEnter={() => play('hover')}
                  className="hidden xl:inline-block font-label-caps text-[11px] tracking-wider opacity-85 hover:bg-on-primary hover:text-electric-blue transition-colors px-2.5 py-1.5 whitespace-nowrap"
                >
                  YOUTH
                </Link>
                <Link
                  to="/login"
                  onMouseEnter={() => play('hover')}
                  onClick={() => play('nav')}
                  className="hidden md:inline-block font-label-caps text-[11px] tracking-wider opacity-85 hover:bg-on-primary hover:text-electric-blue transition-colors px-2.5 py-1.5 whitespace-nowrap"
                >
                  DECK
                </Link>
                <a
                  href="/#contact"
                  onMouseEnter={() => play('hover')}
                  onClick={() => play('click')}
                  className="hidden md:inline-block font-label-caps text-[11px] tracking-wider px-3.5 py-1.5 border border-on-primary hover:bg-on-primary hover:text-electric-blue transition-all whitespace-nowrap"
                >
                  CONTACT
                </a>
                <button
                  type="button"
                  aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
                  aria-expanded={menuOpen}
                  onClick={() => {
                    setMenuOpen((v) => !v);
                    play(menuOpen ? 'close' : 'open');
                  }}
                  className="lg:hidden inline-flex items-center justify-center w-9 h-9 border border-on-primary/60 hover:bg-on-primary hover:text-electric-blue transition-colors"
                >
                  {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </div>
            </Face>

            <Face index={1} rotate={rotate}>
              <div className="flex-1 flex justify-center">
                <Link to="/" className="font-headline-md font-bold tracking-tighter">
                  DGTLZ.AGENCY
                </Link>
              </div>
            </Face>

            <Face index={2} rotate={rotate}>
              <div className="flex-1 flex justify-center items-center gap-4">
                <span className="font-label-caps opacity-60">[</span>
                <span className="font-headline-md font-bold uppercase">After Intelligence</span>
                <span className="font-label-caps opacity-60">]</span>
              </div>
            </Face>

            <Face index={3} rotate={rotate}>
              <div className="flex-1 flex justify-center">
                <a
                  href="/#contact"
                  className="font-label-caps px-6 py-1.5 border border-on-primary hover:bg-on-primary hover:text-electric-blue transition-all cursor-pointer"
                >
                  CONTACT →
                </a>
              </div>
            </Face>
        </motion.div>
      </nav>

      <AnimatePresence>
        {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-white/80 z-[60]"
      style={{ scaleX }}
    />
  );
}
