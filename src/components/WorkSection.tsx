import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { workItems, WorkItem } from '../data';
import { useSound } from '../lib/useSound';
import { Pressable } from './Pressable';
import { Tilt3D } from './Magnetic';

export function WorkSection() {
  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dgt:work-collapsed') === '1';
    } catch {
      return false;
    }
  });
  const { play } = useSound();

  const openCase = (item: WorkItem) => {
    setSelectedWork(item);
    play('open');
  };

  const closeCase = () => {
    setSelectedWork(null);
    play('close');
  };

  const stepImage = (dir: 1 | -1) => {
    if (!selectedWork?.images) return;
    const len = selectedWork.images.length;
    setActiveImageIndex((prev) => (prev + dir + len) % len);
    play('tick');
  };

  useEffect(() => {
    if (selectedWork) {
      setActiveImageIndex(0);
    }
  }, [selectedWork]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedWork(null);
        play('close');
      }
    };

    if (selectedWork) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedWork, play]);

  return (
    <>
      <section id="work" className="bg-white">
        <div className="flex items-center justify-between gap-4 px-margin py-6 border-b border-electric-blue bg-electric-blue text-white">
          <h2 className="font-headline-md leading-none uppercase">SELECTED WORK</h2>
          <button
            type="button"
            onClick={() => {
              const next = !collapsed;
              setCollapsed(next);
              play(next ? 'close' : 'open');
              try {
                localStorage.setItem('dgt:work-collapsed', next ? '1' : '0');
              } catch {
                /* private mode */
              }
            }}
            aria-expanded={!collapsed}
            aria-controls="work-grid"
            className="font-label-caps shrink-0 border border-white/70 px-4 py-2 hover:bg-white hover:text-electric-blue transition-colors duration-200"
          >
            {collapsed ? '[ SHOW ]' : '[ MINIMIZE ]'}
          </button>
        </div>
        <motion.div
          id="work-grid"
          initial={false}
          animate={{ height: collapsed ? 0 : 'auto', opacity: collapsed ? 0 : 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ overflow: 'hidden' }}
          aria-hidden={collapsed}
        >
        <div className="grid grid-cols-1 md:grid-cols-12 items-start">
          {workItems.map((item, index) => (
            <div
              key={item.id}
              className={`${item.span} border-b ${index % 2 === 0 ? 'md:border-r' : ''} border-electric-blue group relative bg-white`}
            >
              <div
                role="button"
                tabIndex={0}
                aria-label={`Baca case study ${item.title}`}
                onClick={() => openCase(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openCase(item);
                  }
                }}
                onMouseEnter={() => play('hover')}
                className="tilt-shine flex flex-col cursor-pointer h-full focus-machine"
              >
                <Tilt3D maxTilt={3} className="flex flex-col">
                  <div className={`dither-container w-full ${item.span.includes('col-span-12') ? 'aspect-[16/9] md:aspect-[3/1]' : 'aspect-[4/3] md:aspect-[16/10]'} overflow-hidden border-b border-electric-blue relative`}>
                    {item.videoUrl ? (
                      <video
                        src={item.videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 dither-pattern opacity-20 pointer-events-none"></div>
                    <div className="absolute inset-0 flex items-center justify-center bg-electric-blue/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 backdrop-blur-sm">
                      <p className="font-label-caps text-center text-[#39FF14] text-xs sm:text-sm px-4 py-2 border border-[#39FF14] mx-4 max-w-[90%] md:max-w-sm translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        [ KLIK UNTUK BACA CASE STUDY ]
                      </p>
                    </div>
                  </div>
                </Tilt3D>
                <div className="px-margin py-4 bg-white group-hover:bg-electric-blue group-hover:text-white transition-colors duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-label-caps opacity-60">KLIEN · {item.client}</span>
                    <span className="font-label-caps opacity-60">{item.status ?? item.category}</span>
                  </div>
                  <h3 className="font-headline-md uppercase text-lg md:text-xl leading-tight">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
        </motion.div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedWork && (
          <motion.div
            key="case-study"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col overflow-y-auto"
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 12, opacity: 0 }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col flex-grow"
            >
          <div className="sticky top-0 bg-white z-10 flex justify-between items-center px-margin py-4 border-b border-electric-blue">
            <span className="font-label-caps text-electric-blue">STUDI KASUS · {selectedWork.id}</span>
            <div className="flex items-center gap-4">
              {selectedWork.status && (
                <span className="font-label-caps text-electric-blue border border-electric-blue border-dashed px-3 py-1 animate-pulse">
                  {selectedWork.status}
                </span>
              )}
              <Pressable
                onClick={closeCase}
                cue={"none"}
                ripple={false}
                className="font-label-caps text-electric-blue border border-electric-blue px-6 py-2 hover:bg-electric-blue hover:text-white transition-colors uppercase"
              >
                TERMINATE [ESC]
              </Pressable>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-grow">
            <div className="col-span-12 lg:col-span-7 border-b lg:border-b-0 lg:border-r border-electric-blue p-margin flex flex-col">
              <span className="font-label-caps mb-4 text-electric-blue opacity-80">CLIENT: {selectedWork.client}</span>
              <h2 className="font-display-md leading-none uppercase mb-12 text-electric-blue">
                {selectedWork.title}
              </h2>
              
              <div className="mt-auto space-y-8">
                {selectedWork.status && (
                  <div className="border border-dashed border-electric-blue p-4 flex items-start gap-4 bg-electric-blue/5">
                    <span className="font-label-caps border border-electric-blue px-2 py-1 shrink-0">{selectedWork.status}</span>
                    <p className="font-body-sm text-electric-blue leading-relaxed">
                      This project is real and already in motion: the research, architecture, and regulatory analysis are complete and peer-review formatted; the MVP build is currently in progress. The published artifact below is the full research paper.
                    </p>
                  </div>
                )}
                <div>
                  <span className="font-label-caps block mb-4 border-b border-electric-blue pb-2 text-electric-blue">
                    LATAR
                  </span>
                  <p className="font-body-lg text-electric-blue leading-relaxed text-justify">
                    {selectedWork.story}
                  </p>
                </div>
                
                <div>
                  <span className="font-label-caps block mb-4 border-b border-electric-blue pb-2 text-electric-blue">
                    MASALAH
                  </span>
                  <p className="font-body-lg text-electric-blue leading-relaxed text-justify opacity-90">
                    {selectedWork.problem}
                  </p>
                </div>
                
                <div>
                  <span className="font-label-caps block mb-4 border-b border-electric-blue pb-2 text-electric-blue">
                    SOLUSI
                  </span>
                  <p className="font-body-lg text-electric-blue leading-relaxed text-justify opacity-90">
                    {selectedWork.solve}
                  </p>
                </div>

                {(selectedWork.pdfUrl || selectedWork.slidesUrl || selectedWork.igCarouselUrl) && (
                  <div className="pt-6 flex flex-wrap gap-4">
                    {selectedWork.pdfUrl && (
                      <a 
                        href={selectedWork.pdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block font-label-caps text-white bg-electric-blue border border-electric-blue px-8 py-4 hover:bg-white hover:text-electric-blue transition-all duration-300 uppercase text-xs sm:text-sm font-bold tracking-wider text-center"
                      >
                          [ ACCESS FULL RESEARCH PAPER PDF ]
                      </a>
                    )}
                    {selectedWork.id === 'w7' && (
                      <a 
                        href="https://wa.me/6281237729115?text=Halo%20DGTLZ%20Fintech%20Team%2C%20kami%20ingin%20request%20akses%20dan%20onboarding%20DGTLZ%20PayGate." 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block font-label-caps text-black bg-[#39FF14] border border-[#39FF14] px-8 py-4 hover:bg-transparent hover:text-white transition-all duration-300 uppercase text-xs sm:text-sm font-bold tracking-wider text-center"
                      >
                        [ REQUEST API ACCESS & ONBOARDING ]
                      </a>
                    )}
                    {selectedWork.slidesUrl && (
                      <a 
                        href={selectedWork.slidesUrl} 
                        download
                        className="inline-block font-label-caps text-white bg-electric-blue border border-electric-blue px-8 py-4 hover:bg-white hover:text-electric-blue transition-all duration-300 uppercase text-xs sm:text-sm font-bold tracking-wider text-center"
                      >
                        [ DOWNLOAD PRESENTATION SLIDES ]
                      </a>
                    )}
                    {selectedWork.igCarouselUrl && (
                      <a 
                        href={selectedWork.igCarouselUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block font-label-caps text-white bg-electric-blue border border-electric-blue px-8 py-4 hover:bg-white hover:text-electric-blue transition-all duration-300 uppercase text-xs sm:text-sm font-bold tracking-wider text-center"
                      >
                        [ ACCESS IG CAROUSEL CREATOR ]
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="col-span-12 lg:col-span-5 h-[50vh] lg:h-auto bg-neutral-900 border-l border-electric-blue relative flex flex-col justify-center">
              {selectedWork.videoUrl ? (
                <video 
                  src={selectedWork.videoUrl} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover" 
                />
              ) : selectedWork.images && selectedWork.images.length > 0 ? (
                <div className="relative w-full h-full flex flex-col justify-between">
                  <div className="flex-grow overflow-hidden relative w-full h-full">
                    <img 
                      src={selectedWork.images[activeImageIndex]} 
                      alt={`${selectedWork.title} - ${activeImageIndex + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  {selectedWork.images.length > 1 && (
                    <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-center bg-white border border-electric-blue p-2">
                      <button 
                        onClick={() => stepImage(-1)}
                        className="font-label-caps text-electric-blue border border-electric-blue px-3 py-1 hover:bg-electric-blue hover:text-white transition-colors cursor-pointer text-xs uppercase"
                      >
                        [ PREV ]
                      </button>
                      <span className="font-label-caps text-electric-blue text-xs font-semibold">
                        {activeImageIndex + 1} / {selectedWork.images.length}
                      </span>
                      <button 
                        onClick={() => stepImage(1)}
                        className="font-label-caps text-electric-blue border border-electric-blue px-3 py-1 hover:bg-electric-blue hover:text-white transition-colors cursor-pointer text-xs uppercase"
                      >
                        [ NEXT ]
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <img 
                  src={selectedWork.imageUrl} 
                  alt={selectedWork.title} 
                  className="w-full h-full object-cover" 
                />
              )}
            </div>
          </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
