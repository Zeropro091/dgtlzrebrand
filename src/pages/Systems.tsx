import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { modulesData, SystemItem } from '../systemsData';
import { getModuleStyle } from '../moduleStyles';
import { SystemModal } from '../components/SystemModal';

const slugify = (code: string) => code.replace('DGT.LZ-', '').toLowerCase();

export function Systems() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModuleCode, setSelectedModuleCode] = useState<string>(
    searchParams.get('module') ?? 'ALL'
  );
  const [selectedSystem, setSelectedSystem] = useState<SystemItem | null>(null);

  // Sync filter state to URL query param
  const applyModuleFilter = (code: string) => {
    setSelectedModuleCode(code);
    if (code === 'ALL') {
      searchParams.delete('module');
    } else {
      searchParams.set('module', code);
    }
    setSearchParams(searchParams, { replace: true });
  };

  // React to back/forward navigation
  useEffect(() => {
    setSelectedModuleCode(searchParams.get('module') ?? 'ALL');
  }, [searchParams]);

  // Filter modules and systems based on search and selected module filter
  const filteredModules = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    return modulesData
      .map((mod) => {
        // Filter systems inside the module
        const filteredSystems = mod.systems.filter((sys) => {
          const matchesSearch = 
            sys.id.toLowerCase().includes(query) ||
            sys.name.toLowerCase().includes(query) ||
            sys.description.toLowerCase().includes(query) ||
            (sys.originalName && sys.originalName.toLowerCase().includes(query)) ||
            (sys.originalTitle && sys.originalTitle.toLowerCase().includes(query));
          return matchesSearch;
        });

        return {
          ...mod,
          systems: filteredSystems,
        };
      })
      .filter((mod) => {
        // Keep module if it matches the selected code (if not ALL)
        if (selectedModuleCode !== 'ALL' && mod.code !== selectedModuleCode) {
          return false;
        }
        // Keep module if it has at least one system matching search
        return mod.systems.length > 0;
      });
  }, [searchQuery, selectedModuleCode]);

  // List of all module codes for the filter buttons
  const allModuleCodes = useMemo(() => {
    return ['ALL', ...modulesData.map(m => m.code)];
  }, []);

  // Total systems count in filtered view
  const totalFilteredCount = useMemo(() => {
    return filteredModules.reduce((sum, m) => sum + m.systems.length, 0);
  }, [filteredModules]);

  return (
    <div className="bg-off-white min-h-screen">
      {/* Grand Brutalist Header */}
      <header className="grid grid-cols-1 md:grid-cols-12 border-b border-electric-blue">
        <div className="col-span-12 p-margin flex flex-col justify-end min-h-[300px] bg-electric-blue text-white relative overflow-hidden">
          <span className="font-label-caps mb-4 z-10">CLASSIFICATION // SYSTEM INDEX & DESCRIPTIONS</span>
          <h1 className="font-display-xl leading-none uppercase z-10">
            SYSTEM TAXONOMY
          </h1>
          <div className="absolute inset-0 dither-pattern opacity-10 pointer-events-none"></div>
        </div>
      </header>

      {/* Sticky Search & Filter Controls */}
      <div className="sticky top-16 z-40 bg-white border-b border-electric-blue shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Search Bar */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-electric-blue flex">
            <span className="font-label-caps bg-off-white text-electric-blue px-6 py-4 flex items-center border-r border-electric-blue select-none font-bold">
              SEARCH
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="FILTER BY ID, NAME, KEYWORDS..."
              className="w-full px-6 py-4 font-mono text-sm focus:outline-none bg-white text-electric-blue placeholder-electric-blue/45 uppercase"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="px-4 text-electric-blue hover:text-red-500 font-mono text-sm cursor-pointer"
              >
                [X]
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="lg:col-span-8 flex items-center overflow-x-auto no-scrollbar py-2 px-margin gap-2 bg-off-white/40">
            <span className="font-label-caps text-[10px] opacity-60 mr-2 shrink-0">MODULE:</span>
            {allModuleCodes.map((code) => (
              <button
                key={code}
                onClick={() => applyModuleFilter(code)}
                className={`font-label-caps px-3 py-1 border text-[11px] font-bold transition-all duration-150 shrink-0 cursor-pointer ${
                  selectedModuleCode === code
                    ? 'bg-electric-blue text-white border-electric-blue'
                    : 'border-electric-blue/40 text-electric-blue/70 hover:border-electric-blue hover:text-electric-blue'
                }`}
              >
                {code === 'ALL' ? 'ALL' : code.replace('DGT.LZ-', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Telemetry Counter */}
        <div className="bg-electric-blue/5 border-t border-electric-blue px-margin py-2 flex justify-between items-center text-xs font-mono text-electric-blue font-semibold">
          <span>ACTIVE TELEMETRY LOADED</span>
          <span>{totalFilteredCount} / 301 SYSTEM SPECIFICATIONS</span>
        </div>
      </div>

      {/* Main Content Section */}
      <main className="p-margin max-w-7xl mx-auto space-y-16 py-12">
        {filteredModules.length === 0 ? (
          <div className="border border-dashed border-electric-blue p-16 text-center text-electric-blue">
            <div className="font-label-caps text-lg font-bold mb-4">[ NO SYSTEM BLUEPRINTS MATCH SEARCH PROTOCOL ]</div>
            <button 
              onClick={() => { setSearchQuery(''); applyModuleFilter('ALL'); }}
              className="font-label-caps border border-electric-blue px-6 py-2 hover:bg-electric-blue hover:text-white transition-colors cursor-pointer"
            >
              RESET ENGINE FILTER
            </button>
          </div>
        ) : (
          filteredModules.map((mod) => {
            const style = getModuleStyle(mod.code);
            return (
              <section key={mod.id} className="scroll-mt-48 flex flex-col">
                
                {/* Module Group Brutalist Banner */}
                <div className={`relative overflow-hidden border border-electric-blue ${style.bg} p-8 flex flex-col justify-between min-h-[140px] md:min-h-[180px] shadow-sm`}>
                  <div className="absolute inset-0 opacity-10 pointer-events-none select-none overflow-hidden">
                    <div className={`w-full h-full ${style.dotClass}`}></div>
                  </div>
                  
                  {/* Top line of banner */}
                  <div className="flex justify-between items-start z-10">
                    <span className="font-label-caps text-xs opacity-80 tracking-wider">
                      DGT.LZ SYSTEM DIRECTORY // MODULE {mod.id}
                    </span>
                    <span className={`font-mono text-3xl md:text-5xl font-extrabold ${style.accentText}`}>
                      {mod.id}
                    </span>
                  </div>

                  {/* Title and Code */}
                  <div className="z-10 mt-6">
                    <h2 className="font-label-caps text-xl md:text-2xl font-bold tracking-normal uppercase">
                      {mod.code}
                    </h2>
                    <p className="font-body-sm text-xs opacity-90 mt-1 uppercase max-w-2xl">
                      {mod.name}
                    </p>
                  </div>
                </div>

                {/* Grid list of systems inside the group */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-x border-b border-electric-blue bg-white divide-y md:divide-y-0 md:divide-x border-t border-t-electric-blue/30">
                  {mod.systems.map((sys) => (
                    <div 
                      key={sys.id}
                      onClick={() => setSelectedSystem(sys)}
                      className="p-6 flex flex-col justify-between group hover:bg-electric-blue hover:text-white transition-all duration-300 relative overflow-hidden cursor-pointer"
                    >
                      {/* Subtle hover dither trigger */}
                      <div className="absolute inset-0 dither-pattern opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-300"></div>
                      
                      <div>
                        {/* System Header */}
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-label-caps text-xs font-bold text-electric-blue group-hover:text-[#39FF14] bg-electric-blue/5 group-hover:bg-white/10 px-2 py-0.5 transition-colors border border-electric-blue/10">
                            {sys.id}
                          </span>
                        </div>

                        {/* System Title */}
                        <h3 className="font-mono font-bold text-base leading-snug uppercase mb-2 group-hover:translate-x-1 transition-transform duration-200">
                          {sys.name}
                        </h3>
                      </div>

                      {/* System Description */}
                      <p className="font-body-sm text-[12px] opacity-75 mt-4 leading-relaxed text-justify border-t border-dashed border-electric-blue/20 group-hover:border-white/20 pt-4">
                        {sys.description}
                      </p>
                    </div>
                  ))}
                </div>

              </section>
            );
          })
        )}
      </main>

      {/* Lightbox Modal showing only name & description */}
      {selectedSystem && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col overflow-y-auto animate-in fade-in duration-200">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white z-10 flex justify-between items-center px-margin py-4 border-b border-electric-blue">
            <span className="font-label-caps text-electric-blue font-bold">SYSTEM SPECIFICATION // {selectedSystem.id}</span>
            <button 
              onClick={() => setSelectedSystem(null)}
              className="font-label-caps text-electric-blue border border-electric-blue px-6 py-2 hover:bg-electric-blue hover:text-white transition-colors uppercase cursor-pointer"
            >
              TERMINATE [ESC]
            </button>
          </div>
          
          {/* Modal Body (Single Pane layout) */}
          <div className="flex flex-col flex-grow max-w-3xl mx-auto w-full p-margin justify-center">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="font-label-caps text-xs text-white bg-electric-blue px-3 py-1 font-bold">
                  {selectedSystem.id}
                </span>
              </div>

              <h2 className="font-display-md leading-none uppercase text-electric-blue">
                {selectedSystem.name}
              </h2>

              <div className="space-y-6">
                <div>
                  <span className="font-label-caps block mb-2 border-b border-electric-blue pb-2 text-electric-blue font-bold">
                    SYSTEM TITLE
                  </span>
                  <p className="font-body-lg text-electric-blue leading-relaxed text-justify">
                    {selectedSystem.description}
                  </p>
                </div>

                {selectedSystem.originalTitle && (
                  <div>
                    <span className="font-label-caps block mb-2 border-b border-electric-blue pb-2 text-electric-blue font-bold">
                      SHORT SPECIFICATION
                    </span>
                    <h4 className="font-mono font-bold text-sm text-electric-blue uppercase">
                      {selectedSystem.originalTitle}
                    </h4>
                  </div>
                )}

                {selectedSystem.originalDescription && (
                  <div>
                    <span className="font-label-caps block mb-2 border-b border-electric-blue pb-2 text-electric-blue font-bold">
                      DESCRIPTION
                    </span>
                    <p className="font-body-sm text-electric-blue leading-relaxed text-justify opacity-80">
                      {selectedSystem.originalDescription}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
