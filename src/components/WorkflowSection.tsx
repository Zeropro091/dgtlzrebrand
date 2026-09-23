export function WorkflowSection() {
  const phases = [
    {
      id: "01",
      title: "Blueprint (Audit & Rencana)",
      desc: "Konsultasi awal 100% tanpa biaya. Kami bedah cara bisnis kamu jalan, lalu rancang ecosystem digitalnya: landing page, web app, otomasi, sampai AI agent."
    },
    {
      id: "02",
      title: "Build (4-8 Minggu)",
      desc: "Membangun landing page, web app, dan integrasi sistem secara bertahap. Setiap fase ada hasil nyata yang bisa langsung dipakai."
    },
    {
      id: "03",
      title: "AI Agents & Otomasi",
      desc: "Deploy Hermes Agent, OpenClaw, atau custom agent: layani chat, follow-up lead, terima booking & pembayaran — jalan 24/7, terhubung web app, WhatsApp, dan PayGate."
    },
    {
      id: "04",
      title: "Ecosystem Management (CTO)",
      desc: "Skema retainer bulanan: kami jaga dan kembangkan seluruh ecosystem kamu sebagai CTO eksternal — server, API, keamanan, pemeliharaan."
    }
  ];

  return (
    <section id="workflow" className="grid grid-cols-1 md:grid-cols-12 border-b border-electric-blue bg-off-white">
      <div className="col-span-12 md:col-span-4 p-margin border-b md:border-b-0 md:border-r border-electric-blue flex flex-col min-h-[400px]">
        <span className="font-label-caps block mb-4">OPERATIONAL PROTOCOL</span>
        <h2 className="font-display-lg leading-none uppercase mb-8">Cara Kami<br />Membangun Ecosystem.</h2>
        <p className="font-body-sm opacity-80 max-w-sm mt-auto">
          Kami memadukan konsultasi tanpa biaya dengan pengembangan tangkas untuk menjamin nilai ekonomis nyata.
        </p>
      </div>
      <div className="col-span-12 md:col-span-8 flex flex-col">
        {phases.map((phase, i) => (
          <div key={phase.id} className={`p-margin flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center ${i !== phases.length - 1 ? 'border-b border-electric-blue' : ''} group hover:bg-electric-blue hover:text-white transition-colors duration-300`}>
            <div className="font-display-xl leading-none opacity-20 group-hover:opacity-100 transition-opacity">
              {phase.id}
            </div>
            <div className="flex-grow">
              <span className="font-label-caps opacity-60 mb-2 block">// PHASE</span>
              <h3 className="font-headline-md uppercase mb-4">{phase.title}</h3>
              <p className="font-body-sm opacity-80 max-w-lg">{phase.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
