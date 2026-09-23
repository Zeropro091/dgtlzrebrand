import { useState, useEffect } from 'react';
import { workItems, WorkItem } from '../data';

export function WorkSection() {
  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  useEffect(() => {
    if (selectedWork) {
      setActiveImageIndex(0);
    }
  }, [selectedWork]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedWork(null);
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
  }, [selectedWork]);

  return (
    <>
      <section id="work" className="bg-white">
        <div className="p-margin border-b border-electric-blue bg-electric-blue text-white">
          <h2 className="font-display-lg leading-none uppercase">SELECTED WORK</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12">
          {workItems.map((item, index) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedWork(item)}
              className={`${item.span} border-b ${index % 2 === 0 ? 'md:border-r' : ''} border-electric-blue group relative flex flex-col cursor-pointer`}
            >
              <div className="dither-container w-full min-h-[300px] md:min-h-[400px] overflow-hidden flex-grow border-b border-electric-blue relative">
                {item.videoUrl ? (
                  <video 
                    src={item.videoUrl} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 dither-pattern opacity-20 pointer-events-none"></div>
                <div className="absolute inset-0 flex items-center justify-center bg-electric-blue/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 backdrop-blur-sm">
                  <p className="font-label-caps text-center text-[#39FF14] text-sm sm:text-lg px-6 py-3 border border-[#39FF14] mx-4 max-w-[90%] md:max-w-sm">
                    [ KLIK UNTUK BACA CASE STUDY ]
                  </p>
                </div>
              </div>
              <div className="p-margin bg-white group-hover:bg-electric-blue group-hover:text-white transition-colors duration-300">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-label-caps opacity-60">CLIENT // {item.client}</span>
                  <span className="font-label-caps opacity-60">{item.status ?? item.category}</span>
                </div>
                <h3 className="font-headline-md uppercase">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedWork && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col overflow-y-auto animate-in fade-in duration-200">
          <div className="sticky top-0 bg-white z-10 flex justify-between items-center px-margin py-4 border-b border-electric-blue">
            <span className="font-label-caps text-electric-blue">CASE STUDY // {selectedWork.id}</span>
            <div className="flex items-center gap-4">
              {selectedWork.status && (
                <span className="font-label-caps text-electric-blue border border-electric-blue border-dashed px-3 py-1 animate-pulse">
                  {selectedWork.status}
                </span>
              )}
              <button 
                onClick={() => setSelectedWork(null)}
                className="font-label-caps text-electric-blue border border-electric-blue px-6 py-2 hover:bg-electric-blue hover:text-white transition-colors uppercase cursor-pointer"
              >
                TERMINATE [ESC]
              </button>
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
                    ANALYSIS // THE STORY
                  </span>
                  <p className="font-body-lg text-electric-blue leading-relaxed text-justify">
                    {selectedWork.story}
                  </p>
                </div>
                
                <div>
                  <span className="font-label-caps block mb-4 border-b border-electric-blue pb-2 text-electric-blue">
                    DIAGNOSIS // THE PROBLEM
                  </span>
                  <p className="font-body-lg text-electric-blue leading-relaxed text-justify opacity-90">
                    {selectedWork.problem}
                  </p>
                </div>
                
                <div>
                  <span className="font-label-caps block mb-4 border-b border-electric-blue pb-2 text-electric-blue">
                    EXECUTION // THE SOLVE
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
                        onClick={() => setActiveImageIndex((prev) => (prev === 0 ? selectedWork.images!.length - 1 : prev - 1))}
                        className="font-label-caps text-electric-blue border border-electric-blue px-3 py-1 hover:bg-electric-blue hover:text-white transition-colors cursor-pointer text-xs uppercase"
                      >
                        [ PREV ]
                      </button>
                      <span className="font-label-caps text-electric-blue text-xs font-semibold">
                        {activeImageIndex + 1} / {selectedWork.images.length}
                      </span>
                      <button 
                        onClick={() => setActiveImageIndex((prev) => (prev === selectedWork.images!.length - 1 ? 0 : prev + 1))}
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
        </div>
      )}
    </>
  );
}
