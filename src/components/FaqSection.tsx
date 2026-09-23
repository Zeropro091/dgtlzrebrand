import { useState } from 'react';
import { faqs } from '../data';

export function FaqSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get unique categories in order
  const categories = Array.from(new Set(faqs.map(f => f.category)));
  
  // Display first 2 categories (01 and 02) by default, show all if expanded
  const visibleCategories = isExpanded ? categories : categories.slice(0, 2);

  return (
    <section id="faq" className="grid grid-cols-1 md:grid-cols-12 border-b border-electric-blue bg-white">
      <div className="col-span-12 md:col-span-4 p-margin border-b md:border-b-0 md:border-r border-electric-blue flex flex-col justify-between bg-off-white">
        <div>
          <h2 className="font-display-lg leading-none uppercase">FAQ</h2>
          <div className="mt-8 font-label-caps opacity-60">OPERATIONAL FAQS & KNOWLEDGEBASE</div>
        </div>
      </div>
      <div className="col-span-12 md:col-span-8 flex flex-col">
        {visibleCategories.map((cat) => {
          const catFaqs = faqs.filter(f => f.category === cat);
          return (
            <div key={cat} className="border-b border-electric-blue last:border-b-0">
              <div className="bg-off-white border-b border-electric-blue px-margin py-3 font-label-caps font-bold text-electric-blue text-sm tracking-wider">
                {cat}
              </div>
              <div className="flex flex-col">
                {catFaqs.map((faq, i) => (
                  <div 
                    key={i} 
                    className="p-margin border-b border-electric-blue last:border-b-0 hover:bg-electric-blue hover:text-white transition-colors group"
                  >
                    <div className="font-label-caps text-sm tracking-wider opacity-50 group-hover:opacity-70 mb-2">
                      {String(i + 1).padStart(2, '0')} / {faq.topic}
                    </div>
                    <h3 className="font-label-caps font-bold mb-4">
                      <span className="opacity-50 mr-2">Q /</span>{faq.q}
                    </h3>
                    <p className="font-body-sm opacity-80 pl-4 border-l-2 border-electric-blue group-hover:border-white whitespace-pre-line text-justify leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {categories.length > 2 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-margin font-label-caps bg-off-white text-electric-blue hover:bg-electric-blue hover:text-white transition-colors duration-150 cursor-pointer w-full text-center border-t border-electric-blue md:border-t-0"
          >
            {isExpanded ? 'COLLAPSE KNOWLEDGEBASE [-]' : 'ACCESS FULL KNOWLEDGEBASE [+]'}
          </button>
        )}
      </div>
    </section>
  );
}
