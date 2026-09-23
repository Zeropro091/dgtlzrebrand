import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'motion/react';

const ANCHOR_LINKS = [
  { label: 'WORK', href: '/#work' },
  { label: 'WORKFLOW', href: '/#workflow' },
  { label: 'EVENTS', href: '/#events' },
  { label: 'TEAM', href: '/#team' },
  { label: 'SERVICES', href: '/#services' },
  { label: 'PHILOSOPHY', href: '/#philosophy' },
  { label: 'DOCTRINE', href: '/#doctrine' },
  { label: 'FAQ', href: '/#faq' },
];

const PAGE_LINKS = [
  { label: 'YOUTH', to: '/youth' },
  { label: 'ROUTE', to: '/route' },
  { label: 'PAYGATE', to: '/paygate' },
  { label: 'AGENT', to: '/agent' },
  { label: 'RAMPUNG', to: '/rampung' },
  { label: 'GALLERY', to: '/gallery' },
  { label: 'PARTNERS', to: '/partners' },
  { label: 'SYSTEMS', to: '/systems' },
];

// Half of the navbar height (h-16 = 64px) — used to build the cube faces
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
  // Each face sits at 90° around the X axis; translateZ pushes it to the cube surface.
  // With the cube rotated by -90°*i, face i faces the viewer.
  const transform = useTransform(
    rotate,
    (r) => `rotateX(${index * 90}deg) translateZ(${HALF_H}px)`,
  );
  // Visible only while its side faces the viewer (±45° window around index*90)
  const opacity = useTransform(rotate, (r) => {
    const delta = Math.abs((((r + index * 90) % 360) + 540) % 360 - 180);
    return delta < 45 ? 1 : 0;
  });

  return (
    <motion.div
      className="absolute inset-0 flex justify-between items-center w-full px-margin backface-hidden"
      style={{ transform, opacity }}
    >
      {children}
    </motion.div>
  );
}

export function Navbar() {
  const reduceMotion = useReducedMotion();

  // Global page scroll drives the die rotation: 3 face transitions over ~300px
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, [0, 300], [0, -270]);
  const rotateStyle = reduceMotion ? undefined : { rotateX: rotate, transformPerspective: 900 };

  const linkCls =
    'font-label-caps opacity-80 hover:bg-on-primary hover:text-electric-blue transition-colors duration-150 px-2 py-1';

  return (
    <nav className="fixed top-0 z-50 w-full h-16 bg-electric-blue border-b border-on-primary text-on-primary overflow-hidden">
      {/* 3D die — 4 faces, rotates on scroll like a rolling block */}
      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d]"
        style={rotateStyle}
      >
        {/* Face 1 — default: logo left, menu right */}
        <Face index={0} rotate={rotate}>
          <Link to="/" className="font-headline-md font-bold tracking-tighter">
            DGTLZ.AGENCY
          </Link>
          <div className="hidden md:flex gap-8 items-center h-full">
            {ANCHOR_LINKS.map((l) => (
              <a key={l.label} className={linkCls} href={l.href}>
                {l.label}
              </a>
            ))}
            {PAGE_LINKS.map((l) => (
              <Link key={l.label} className={linkCls} to={l.to}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="font-label-caps opacity-80 hover:bg-on-primary hover:text-electric-blue transition-colors duration-150 px-2 py-1"
            >
              DECK →
            </Link>
            <a
              href="/#contact"
              className="font-label-caps px-4 py-1 border border-on-primary hover:bg-on-primary hover:text-electric-blue transition-all cursor-pointer"
            >
              CONTACT
            </a>
          </div>
        </Face>

        {/* Face 2 — DGTLZ alone, centered */}
        <Face index={1} rotate={rotate}>
          <div className="flex-1 flex justify-center">
            <Link to="/" className="font-headline-md font-bold tracking-tighter">
              DGTLZ.AGENCY
            </Link>
          </div>
        </Face>

        {/* Face 3 — doctrine line */}
        <Face index={2} rotate={rotate}>
          <div className="flex-1 flex justify-center items-center gap-4">
            <span className="font-label-caps opacity-60">[</span>
            <span className="font-headline-md font-bold uppercase">After Intelligence</span>
            <span className="font-label-caps opacity-60">]</span>
          </div>
        </Face>

        {/* Face 4 — contact CTA alone, centered */}
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
  );
}
