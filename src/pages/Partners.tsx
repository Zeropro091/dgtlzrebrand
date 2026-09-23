import { JSX } from 'react';

interface Partner {
  id: string;
  name: string;
  url: string;
  desc: string;
  colorClass: string;
  logoSvg: JSX.Element;
}

export function Partners() {
  const partners: Partner[] = [
    {
      id: "aethers",
      name: "AETHERS STUDIO",
      url: "https://aethers.studio",
      desc: "Specialized in advanced digital experiences, brutalist interface engineering, and system design.",
      colorClass: "border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white",
      logoSvg: (
        <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="80" height="80" stroke="currentColor" strokeWidth="4" />
          <path d="M50 20 L80 80 H20 Z" fill="none" stroke="currentColor" strokeWidth="4" />
          <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="4" />
        </svg>
      )
    },
    {
      id: "madzilla",
      name: "MADZILLA 3D STUDIO",
      url: "https://madzilla3d.com",
      desc: "Expert 3D printing laboratory specializing in architectural structural scale prints and composite polymers.",
      colorClass: "border-[#ff3b30] text-[#ff3b30] hover:bg-[#ff3b30] hover:text-white",
      logoSvg: (
        <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="80" height="80" stroke="currentColor" strokeWidth="4" />
          <path d="M20 20 L50 50 L80 20 V80 H20 Z" fill="none" stroke="currentColor" strokeWidth="4" />
          <path d="M50 50 V80" stroke="currentColor" strokeWidth="4" />
        </svg>
      )
    },
    {
      id: "insignia",
      name: "INSIGNIA CREATIVE",
      url: "https://insigniacreative.com",
      desc: "Creative agency focusing on brand positioning, monospaced typography, and structural identity.",
      colorClass: "border-[#8e8e93] text-[#8e8e93] hover:bg-[#8e8e93] hover:text-white",
      logoSvg: (
        <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="80" height="80" stroke="currentColor" strokeWidth="4" />
          <line x1="30" y1="20" x2="70" y2="20" stroke="currentColor" strokeWidth="4" />
          <line x1="30" y1="80" x2="70" y2="80" stroke="currentColor" strokeWidth="4" />
          <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="4" />
          <line x1="35" y1="50" x2="65" y2="50" stroke="currentColor" strokeWidth="4" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-off-white min-h-screen flex flex-col">
      <header className="grid grid-cols-1 md:grid-cols-12 border-b border-electric-blue">
        <div className="col-span-12 p-margin flex flex-col justify-end min-h-[250px] bg-electric-blue text-white">
          <span className="font-label-caps mb-4">OUR TRUSTED NETWORK</span>
          <h1 className="font-display-xl leading-none uppercase">PARTNERS</h1>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 flex-grow">
        {partners.map((partner) => (
          <a
            key={partner.id}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`border-b md:border-b-0 md:border-r border-electric-blue last:border-r-0 flex flex-col items-center justify-between p-12 text-center transition-all duration-300 ${partner.colorClass}`}
          >
            <div className="flex-grow flex items-center justify-center mb-8">
              {partner.logoSvg}
            </div>
            
            <div className="space-y-4">
              <h2 className="font-headline-md uppercase tracking-tight">{partner.name}</h2>
              <p className="font-body-md max-w-xs mx-auto opacity-80">{partner.desc}</p>
              <div className="pt-4">
                <span className="font-label-caps border border-current px-4 py-2 hover:bg-current hover:text-white transition-colors duration-150 inline-block">
                  VISIT WEBSITE →
                </span>
              </div>
            </div>
          </a>
        ))}
      </section>
    </div>
  );
}
