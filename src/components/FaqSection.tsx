import { useState } from 'react';
import { motion } from 'motion/react';
import { faqs } from '../data';
import { useSound } from '../lib/useSound';
import { Pressable } from './Pressable';

export function FaqSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const { play } = useSound();

  const categories = Array.from(new Set(faqs.map((f) => f.category)));
  const visibleCategories = isExpanded ? categories : categories.slice(0, 2);

  const toggleFaq = (key: string) => {
    const opening = openFaq !== key;
    setOpenFaq(opening ? key : null);
    play(opening ? 'open' : 'close');
  };

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
          const catFaqs = faqs.filter((f) => f.category === cat);
          return (
            <div key={cat} className="border-b border-electric-blue last:border-b-0">
              <div className="bg-off-white border-b border-electric-blue px-margin py-3 font-label-caps font-bold text-electric-blue text-sm tracking-wider">
                {cat}
              </div>
              <div className="flex flex-col">
                {catFaqs.map((faq, i) => {
                  const key = `${cat}-${i}`;
                  const open = openFaq === key;
                  return (
                    <div
                      key={key}
                      className={`border-b border-electric-blue last:border-b-0 transition-colors duration-200 ${
                        open ? 'bg-electric-blue text-white' : 'hover:bg-electric-blue/5'
                      }`}
                    >
                      <button
                        type="button"
                        aria-expanded={open}
                        onClick={() => toggleFaq(key)}
                        onMouseEnter={() => play('hover')}
                        className="w-full text-left p-margin pb-4 cursor-pointer focus-machine group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-grow">
                            <div className={`font-label-caps text-sm tracking-wider mb-2 transition-opacity ${open ? 'opacity-70' : 'opacity-50 group-hover:opacity-70'}`}>
                              {String(i + 1).padStart(2, '0')} / {faq.topic}
                            </div>
                            <h3 className="font-label-caps font-bold">
                              <span className="opacity-50 mr-2">Q /</span>
                              {faq.q}
                            </h3>
                          </div>
                          <motion.span
                            aria-hidden="true"
                            animate={{ rotate: open ? 45 : 0 }}
                            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                            className="font-label-caps text-lg leading-none mt-1 shrink-0"
                          >
                            +
                          </motion.span>
                        </div>
                      </button>

                      <div className="accordion-body" data-open={open}>
                        <div>
                          <motion.p
                            initial={false}
                            animate={{ opacity: open ? 1 : 0, y: open ? 0 : -6 }}
                            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                            className={`font-body-sm pl-4 pb-margin mr-margin ml-4 border-l-2 whitespace-pre-line text-justify leading-relaxed ${
                              open ? 'border-white opacity-90' : 'border-electric-blue opacity-80'
                            }`}
                          >
                            {faq.a}
                          </motion.p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {categories.length > 2 && (
          <Pressable
            onClick={() => setIsExpanded((v) => !v)}
            cue="none"
            ripple={false}
            press={false}
            className="p-margin font-label-caps bg-off-white text-electric-blue hover:bg-electric-blue hover:text-white transition-colors duration-150 w-full text-center border-t border-electric-blue md:border-t-0"
          >
            <motion.span
              key={isExpanded ? 'collapse' : 'expand'}
              initial={{ opacity: 0, x: isExpanded ? 8 : -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.22 }}
              className="inline-block w-full"
            >
              {isExpanded ? 'COLLAPSE KNOWLEDGEBASE [-]' : 'ACCESS FULL KNOWLEDGEBASE [+]'}
            </motion.span>
          </Pressable>
        )}
      </div>
    </section>
  );
}
