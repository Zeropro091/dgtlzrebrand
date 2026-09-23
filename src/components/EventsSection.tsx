import { events } from '../data';

export function EventsSection() {
  return (
    <section id="events" className="border-b border-electric-blue bg-white">
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="col-span-12 md:col-span-4 p-margin border-b md:border-b-0 md:border-r border-electric-blue flex flex-col justify-between bg-off-white min-h-[400px]">
          <span className="font-label-caps block mb-4">PUBLIC SCHEDULE</span>
          <div>
            <h2 className="font-display-lg leading-none uppercase mb-8">
              EVENTS & <br />
              ACTIVITIES.
            </h2>
            <p className="font-body-sm opacity-80 max-w-sm mt-auto">
              Our ongoing initiatives to disseminate technical doctrine and operational logic to the wider network.
            </p>
          </div>
        </div>
        
        <div className="col-span-12 md:col-span-8 flex flex-col">
          {events.map((event, index) => (
            <div 
              key={event.id}
              className={`p-margin flex flex-col group transition-colors duration-300 hover:bg-electric-blue hover:text-white ${
                index !== events.length - 1 ? 'border-b border-electric-blue' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <span className="font-label-caps opacity-60">STATUS: {event.status}</span>
                <span className="font-label-caps opacity-60">{event.date}</span>
              </div>
              <h3 className="font-display-md leading-none uppercase mb-4">{event.title}</h3>
              <p className="font-body-lg md:text-lg leading-relaxed text-justify opacity-90 max-w-2xl mb-6">
                {event.description}
              </p>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-auto border-t border-current pt-4">
                <span className="font-label-caps mb-4 md:mb-0">LOC: {event.location}</span>
                <button 
                  className={`font-label-caps px-6 py-3 border-2 transition-all cursor-pointer ${
                    event.status === 'OPEN' 
                      ? 'border-current group-hover:bg-white group-hover:text-electric-blue hover:!bg-black hover:!text-white hover:!border-black' 
                      : 'border-current opacity-50 cursor-not-allowed'
                  }`}
                  disabled={event.status !== 'OPEN'}
                >
                  {event.status === 'OPEN' 
                    ? 'REGISTER [NO COST]' 
                    : event.status === 'CLOSED' 
                      ? 'REGISTRATION CLOSED' 
                      : 'RESTRICTED ACCESS'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
