import { useState, useEffect } from 'react';

export function Gallery() {
  const [selectedItem, setSelectedItem] = useState<{ id: string; title: string; image: string; story: string } | null>(null);
  const [items, setItems] = useState<typeof galleryItems>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d.items) && d.items.length) { setItems(d.items); } setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedItem(null);
      }
    };
    
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedItem]);

  const galleryItems: Array<{ id: string; title: string; image: string; story: string }> = [
    {
      id: "LOG-01",
      title: "IDENTITY_KIT: THE MARK AND ITS VARIANTS",
      image: "/gallery/logo-pack.png",
      story: "The complete logo architecture of DGTLZ.AGENCY — every lockup, ratio, and compression state locked into a single archival sheet. A mark engineered for both the width of a building banner and the constraint of a 16px favicon. Not decoration. Infrastructure."
    },
    {
      id: "HER-02",
      title: "BUILD_THE_NEXT: FLAGSHIP POSTER",
      image: "/gallery/poster-build-the-next.jpg",
      story: "The manifesto rendered as a future artifact — a classical bust corrupted by Klein Blue scanlines, as if excavated from an architectural archive that doesn't exist yet. It is the agency's core position in one frame: old enough to have authority, new enough to feel dangerous."
    },
    {
      id: "GRO-03",
      title: "GROWTH_DOCTRINE: AN AGENCY THAT GROWS WITH YOU",
      image: "/gallery/poster-agency-that-grows-with-you.jpg",
      story: "A statement of structural partnership. Not a vendor slide — a load-bearing contract translated into ink and grid. The design argues that growth is not a service rendered, but a system both parties build and are built by."
    },
    {
      id: "REC-04",
      title: "RECRUITMENT_SIGNAL: KENDALIKAN OPERASIONAL",
      image: "/gallery/poster-rekrutmen-kendalikan-operasional.png",
      story: "An open transmission to future operators. 'Kendalikan Operasional' — take control of operations. The poster treats hiring the way brutalism treats concrete: honest about the weight, explicit about the function, no facade."
    },
    {
      id: "STK-05",
      title: "ANALOG_ARTIFACTS: THE STICKER PACK",
      image: "/gallery/sticker-pack.png",
      story: "The identity forced into its most hostile environment — laptops, street poles, shipping crates. If the mark survives at 3cm on a curved surface beside a barcode, it survives anywhere. Stress-testing the brand by making it physical."
    }
  ];

  return (
    <>
      <header className="grid grid-cols-1 md:grid-cols-12 border-b border-electric-blue">
        <div className="col-span-12 md:col-span-12 p-margin flex flex-col justify-end min-h-[300px] bg-electric-blue text-white">
          <span className="font-label-caps mb-4">ARCHIVE // GRAPHIC EXPLORATIONS</span>
          <h1 className="font-display-xl leading-none uppercase">
            GALLERY
          </h1>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 bg-off-white">
        {(items.length ? items : galleryItems).map((item, index) => (
          <article 
            key={item.id} 
            onClick={() => setSelectedItem(item)}
            className={`group cursor-pointer border-b border-electric-blue flex flex-col ${index % 2 === 0 ? 'md:border-r' : ''}`}
          >
            <div className="dither-container aspect-[4/3] w-full border-b border-electric-blue relative overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 dither-pattern opacity-20 pointer-events-none"></div>
              <div className="absolute inset-0 flex items-center justify-center bg-electric-blue/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 backdrop-blur-sm">
                <p className="font-label-caps text-center text-[#39FF14] text-sm sm:text-lg px-6 py-3 border border-[#39FF14] mx-4 max-w-[90%] md:max-w-sm">
                  [ CLICK TO INITIALIZE FULL ANALYSIS ]
                </p>
              </div>
            </div>
            <div className="p-margin flex flex-col flex-grow bg-white group-hover:bg-electric-blue group-hover:text-white transition-colors duration-300">
              <span className="font-label-caps opacity-60 mb-6">REF: {item.id}</span>
              <h2 className="font-headline-md mb-6 uppercase">{item.title}</h2>
            </div>
          </article>
        ))}
      </section>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col overflow-y-auto animate-in fade-in duration-200">
          <div className="sticky top-0 bg-white z-10 flex justify-between items-center px-margin py-4 border-b border-electric-blue">
            <span className="font-label-caps text-electric-blue">VIEWER // {selectedItem.id}</span>
            <button 
              onClick={() => setSelectedItem(null)}
              className="font-label-caps text-electric-blue border border-electric-blue px-6 py-2 hover:bg-electric-blue hover:text-white transition-colors uppercase cursor-pointer"
            >
              TERMINATE [ESC]
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 flex-grow">
            <div className="col-span-12 lg:col-span-7 border-b md:border-b-0 lg:border-r border-electric-blue p-margin flex flex-col">
              <h2 className="font-display-md leading-none uppercase mb-12">
                {selectedItem.title}
              </h2>
              
              <div className="mt-auto">
                <span className="font-label-caps block mb-6 border-b border-electric-blue pb-4 text-electric-blue">
                  ANALYSIS // MEANING
                </span>
                <p className="font-body-lg md:text-lg leading-relaxed text-justify text-electric-blue">
                  {selectedItem.story}
                </p>
              </div>
            </div>
            
            <div className="col-span-12 lg:col-span-5 h-[50vh] lg:h-auto dither-container bg-electric-blue border-electric-blue relative">
              <img 
                src={selectedItem.image} 
                alt={selectedItem.title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 dither-pattern opacity-20 pointer-events-none"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
