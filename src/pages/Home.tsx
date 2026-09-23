import { TeamSection } from '../components/TeamSection';
import { ServicesSection } from '../components/ServicesSection';
import { WorkSection } from '../components/WorkSection';
import { WorkflowSection } from '../components/WorkflowSection';
import { LabSection } from '../components/LabSection';
import { YouthSection } from '../components/YouthSection';
import { CloudSection } from '../components/CloudSection';
import { AgentSection } from '../components/AgentSection';
import { SystemsTeaserSection } from '../components/SystemsTeaserSection';
import { EventsSection } from '../components/EventsSection';
import { PhilosophySection } from '../components/PhilosophySection';
import { DoctrineSection } from '../components/DoctrineSection';
import { FaqSection } from '../components/FaqSection';
import { ContactSection } from '../components/ContactSection';

export function Home() {
  return (
    <>
      {/* Hero Section */}
      <header className="grid grid-cols-1 md:grid-cols-12 border-b border-electric-blue">
        <div className="col-span-12 md:col-span-8 p-margin flex flex-col justify-end border-b md:border-b-0 md:border-r border-electric-blue min-h-[400px] md:min-h-[614px]">
          <span className="font-label-caps mb-4">DGTLZ COLLECTIVE — V.05</span>
          <h1 className="font-display-xl leading-none uppercase">
            WE BUILD <br />
            DIGITAL <br />
            ECOSYSTEMS
          </h1>
          <p className="font-mono text-xs md:text-sm tracking-widest mt-6 opacity-70">
            DARI LANDING PAGE → WEB APP → OTOMASI → AI AGENT YANG MENJALANKAN BISNIS KAMU.
          </p>
        </div>
        <div className="col-span-12 md:col-span-4 dither-container bg-electric-blue/10 flex items-center justify-center p-gutter overflow-hidden relative min-h-[300px]">
          <img 
            alt="Classical marble statue fragmented with geometric glitched lines" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvUPdixQwvdJ3wBIOP7YLvN8lB57-NYU17msPPWS21zjCs5Eixg34vPWGJVDsUaXRpqJJ_o_FZWk9rd5e4M9UMUxe_1eMyZp-XPIPXONCarxZdqPjbaeJ2nYqM17ijhBjuabLU_Pa5jtc7a_gEXH1YYsvt4uCqPbH_aELPrhVqyPTdCIXbV84LulrmO1SVlqlsbfkm_XffTPkMAxeudrS5b_xlEQw5VkqDTe4Pmsggk9fxTaU6xjwB6g" 
          />
          <div className="absolute inset-0 dither-pattern opacity-20 pointer-events-none"></div>
        </div>
      </header>

      <WorkSection />
      <WorkflowSection />
      <AgentSection />
      <LabSection />
      <YouthSection />
      <CloudSection />
      <SystemsTeaserSection />
      <EventsSection />
      <TeamSection />
      <ServicesSection />
      <PhilosophySection />
      <DoctrineSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}

