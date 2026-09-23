import { teamMembers } from '../data';

export function TeamSection() {
  return (
    <section id="team" className="border-b border-electric-blue">
      <div className="p-margin border-b border-electric-blue bg-electric-blue text-white">
        <h2 className="font-display-lg leading-none uppercase">THE TEAM [{teamMembers.length}]</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5">
        {teamMembers.map((member, i) => {
          const containerClass =
            member.department === 'MADZILLA3D' ? 'dither-container-3d' :
            member.department === 'AETHERS_STUDIO' ? 'dither-container-dev' :
            'dither-container-other';

          const patternClass =
            member.department === 'MADZILLA3D' ? 'dither-pattern-3d' :
            member.department === 'AETHERS_STUDIO' ? 'dither-pattern-dev' :
            'dither-pattern-other';

          const infoHoverClass =
            member.department === 'MADZILLA3D' ? 'group-hover:bg-[#ff3b30] group-hover:text-white group-hover:border-[#ff3b30]' :
            member.department === 'AETHERS_STUDIO' ? 'group-hover:bg-electric-blue group-hover:text-white' :
            'group-hover:bg-[#8e8e93] group-hover:text-white group-hover:border-[#8e8e93]';

          // Initials for brutalist avatar fallback
          const initials = member.name
            .split(/\s+/)
            .map(w => w[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

          return (
            <div key={member.id} className="border-b md:border-b-0 md:border-r border-electric-blue last:border-b-0 group relative flex flex-col">
              <div className={`${containerClass} aspect-square overflow-hidden relative`}>
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-electric-blue">
                    <span className="font-display-lg leading-none text-white select-none">
                      {initials}
                    </span>
                  </div>
                )}
                <div className={`absolute inset-0 ${patternClass} opacity-20 pointer-events-none`}></div>
              </div>
              <div className={`p-4 border-t border-electric-blue bg-off-white ${infoHoverClass} transition-colors duration-300 flex-grow`}>
                <p className="font-label-caps text-[9px] opacity-60 mb-1">0{i + 1} // {member.department.replace('_', ' ')} // {member.role}</p>
                <h3 className="font-label-caps font-bold">{member.name}</h3>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
