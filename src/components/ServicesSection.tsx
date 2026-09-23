import { useState } from 'react';
import { Link } from 'react-router-dom';
import { services } from '../data';

export function ServicesSection() {
  const [activeService, setActiveService] = useState<string | null>(null);

  // Group services for asymmetric brutalist layout
  const coreServices = services.slice(0, 2); // s1, s2
  const infraServices = services.slice(2, 4); // s3, s4
  const flagshipServices = services.slice(4, 6); // s5 (PayGate), s6 (Route)

  return (
    <section id="services" className="border-b border-electric-blue bg-white">
      {/* Top Banner / Ticker Header */}
      <div className="bg-electric-blue text-white p-margin border-b border-electric-blue flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="font-label-caps opacity-75 block text-[10px] tracking-widest">
            // DGTLZ SYSTEM CAPABILITIES ARCHITECTURE
          </span>
          <h2 className="font-display-lg leading-none uppercase mt-1">
            SERVICE OPERATIONS<span className="text-[#39FF14]">.</span>
          </h2>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs bg-black/40 px-3 py-2 border border-white/20 self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse"></span>
          <span className="tracking-wider">06 ENGINES ACTIVE</span>
          <span className="opacity-40">|</span>
          <span className="opacity-75">STATUS: OPTIMAL</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Left Interactive Index Sidebar */}
        <div className="col-span-12 md:col-span-4 p-margin border-b md:border-b-0 md:border-r border-electric-blue bg-off-white flex flex-col justify-between">
          <div>
            <span className="font-label-caps text-xs text-electric-blue font-bold block mb-4">
              [ PROTOCOL INDEX ]
            </span>
            <p className="font-body-sm opacity-80 mb-6 leading-relaxed">
              Kami tidak menawarkan paket generik. Setiap kapabilitas dirancang sebagai infrastruktur taktis untuk memperkuat posisi pasar dan otonomi operasional bisnis Anda.
            </p>

            {/* Quick Index List */}
            <div className="space-y-2 border-t border-b border-electric-blue/30 py-4">
              {services.map((s, idx) => (
                <div
                  key={s.id}
                  onMouseEnter={() => setActiveService(s.id)}
                  onMouseLeave={() => setActiveService(null)}
                  className={`flex items-center justify-between font-mono text-xs p-2 transition-colors cursor-pointer ${
                    activeService === s.id
                      ? 'bg-electric-blue text-white font-bold'
                      : 'hover:bg-electric-blue/10 text-neutral-800'
                  }`}
                >
                  <span className="font-label-caps">
                    0{idx + 1}. {s.title}
                  </span>
                  <span className="text-[10px] opacity-60">
                    {s.id === 's5' || s.id === 's6' ? 'FLAGSHIP' : 'CORE'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-electric-blue/20">
            <div className="font-label-caps text-[10px] opacity-60 mb-1">DEPLOYMENT SPEC</div>
            <div className="font-mono text-xs font-semibold text-electric-blue">
              ZERO SLOP • DIRECT INTEGRATION • HIGH RESILIENCE
            </div>
          </div>
        </div>

        {/* Right Asymmetric Grid */}
        <div className="col-span-12 md:col-span-8">
          {/* TIER 1: CORE ARCHITECTURE (2 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-electric-blue">
            {coreServices.map((service, index) => {
              const isHovered = activeService === service.id;
              return (
                <div
                  key={service.id}
                  onMouseEnter={() => setActiveService(service.id)}
                  onMouseLeave={() => setActiveService(null)}
                  className={`p-margin ${
                    index === 0 ? 'sm:border-r border-electric-blue' : ''
                  } transition-colors duration-300 flex flex-col justify-between ${
                    isHovered ? 'bg-electric-blue text-white' : 'bg-white text-black'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-label-caps text-[10px] opacity-60">
                        OP_0{index + 1} // TIER_1
                      </span>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 border border-current opacity-40">
                        DESIGN SCIENCE
                      </span>
                    </div>
                    <h3 className="font-headline-md mb-3">{service.title}</h3>
                    <p className="font-body-sm opacity-80 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-current/20 flex items-center justify-between font-mono text-[11px] opacity-75">
                    <span>STATUS: ACTIVE</span>
                    <span>READY &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* TIER 2: INFRASTRUCTURE & SPATIAL (Asymmetric 7/5 split on sm) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-electric-blue">
            {infraServices.map((service, index) => {
              const isHovered = activeService === service.id;
              const colSpan = index === 0 ? 'sm:col-span-7' : 'sm:col-span-5';
              const borderRight = index === 0 ? 'sm:border-r border-electric-blue' : '';
              return (
                <div
                  key={service.id}
                  onMouseEnter={() => setActiveService(service.id)}
                  onMouseLeave={() => setActiveService(null)}
                  className={`${colSpan} p-margin ${borderRight} transition-colors duration-300 flex flex-col justify-between ${
                    isHovered ? 'bg-electric-blue text-white' : 'bg-off-white text-black'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-label-caps text-[10px] opacity-60">
                        OP_0{index + 3} // TIER_2
                      </span>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 border border-current opacity-40">
                        INFRASTRUCTURE
                      </span>
                    </div>
                    <h3 className="font-headline-md mb-3">{service.title}</h3>
                    <p className="font-body-sm opacity-80 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-current/20 flex items-center justify-between font-mono text-[11px] opacity-75">
                    <span>SPEC: OPERATIONAL</span>
                    <span>DEPLOY &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* TIER 3: FLAGSHIP PROPRIETARY ENGINES (Dark Industrial Theme) */}
          <div className="bg-neutral-950 text-white p-margin relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#39FF14] rounded-full animate-pulse"></span>
                <span className="font-label-caps text-xs text-[#39FF14] tracking-widest font-bold">
                  FLAGSHIP PROPRIETARY ENGINES
                </span>
              </div>
              <span className="font-mono text-[10px] text-neutral-400 border border-neutral-800 px-2 py-0.5">
                TIER_3 // HIGH VELOCITY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {flagshipServices.map((service, index) => {
                const isPayGate = service.id === 's5';
                const isRoute = service.id === 's6';

                return (
                  <div
                    key={service.id}
                    onMouseEnter={() => setActiveService(service.id)}
                    onMouseLeave={() => setActiveService(null)}
                    className="border border-neutral-800 bg-neutral-900/80 p-5 flex flex-col justify-between hover:border-[#39FF14] transition-all duration-300 relative group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-[10px] text-[#39FF14]">
                          OP_0{index + 5}
                        </span>
                        {isPayGate && (
                          <span className="font-mono text-[9px] bg-[#39FF14]/10 text-[#39FF14] px-2 py-0.5 border border-[#39FF14]/30">
                            WHITE-LABEL PAYGATE
                          </span>
                        )}
                        {isRoute && (
                          <span className="font-mono text-[9px] bg-electric-blue/40 text-white px-2 py-0.5 border border-electric-blue">
                            AI ROUTER GATEWAY
                          </span>
                        )}
                      </div>

                      <h3 className="font-headline-md text-white mb-3 group-hover:text-[#39FF14] transition-colors">
                        {service.title}
                      </h3>
                      <p className="font-body-sm text-neutral-300 leading-relaxed mb-4">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-neutral-800">
                      {isPayGate && (
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-neutral-400">
                            MANAGED ONBOARDING
                          </span>
                          <div className="flex items-center gap-3">
                            <Link
                              to="/paygate"
                              className="font-label-caps text-xs text-[#39FF14] underline hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-bold"
                            >
                              EXPLORE PAYGATE &rarr;
                            </Link>
                          </div>
                        </div>
                      )}

                      {isRoute && (
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-neutral-400">
                            LIVE ROUTE INFRA
                          </span>
                          <Link
                            to="/route"
                            className="font-label-caps text-xs text-[#39FF14] underline hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-bold"
                          >
                            EXPLORE GATEWAY &rarr;
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}