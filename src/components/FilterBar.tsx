import { useState } from 'react';

export function FilterBar() {
  const [activeFilter, setActiveFilter] = useState('ALL_ITEMS');
  const filters = ['ALL_ITEMS', 'SEATING', 'LIGHTING', 'MODULAR', 'PROTOTYPES'];

  return (
    <section className="bg-electric-blue text-white px-margin py-6 border-b border-white sticky top-16 z-40">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-gutter font-body-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <span className="opacity-60">dgt@catalog:~$</span>
          <span className="font-bold">ls --filter</span>
          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {filters.map((filter) => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`cursor-pointer transition-all ${activeFilter === filter ? 'underline underline-offset-4 decoration-2' : 'opacity-60 hover:opacity-100 hover:underline'}`}
              >
                {filter}
              </button>
            ))}
          </div>
          <span className="terminal-cursor"></span>
        </div>
        <div className="hidden md:block opacity-40 text-[10px] tracking-widest font-label-caps">
          BUILD_ID: 2024.AR.09 // LATENCY: 24MS
        </div>
      </div>
    </section>
  );
}
