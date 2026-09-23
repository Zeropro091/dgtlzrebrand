import { useEffect } from 'react';
import { SystemItem } from '../systemsData';

interface SystemModalProps {
  system: SystemItem | null;
  onClose: () => void;
}

export function SystemModal({ system, onClose }: SystemModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (system) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [system, onClose]);

  if (!system) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col overflow-y-auto animate-in fade-in duration-200">
      <div className="sticky top-0 bg-white z-10 flex justify-between items-center px-margin py-4 border-b border-electric-blue">
        <span className="font-label-caps text-electric-blue font-bold">SYSTEM SPECIFICATION // {system.id}</span>
        <button
          onClick={onClose}
          className="font-label-caps text-electric-blue border border-electric-blue px-6 py-2 hover:bg-electric-blue hover:text-white transition-colors uppercase cursor-pointer"
        >
          TERMINATE [ESC]
        </button>
      </div>

      <div className="flex flex-col flex-grow max-w-3xl mx-auto w-full p-margin justify-center">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="font-label-caps text-xs text-white bg-electric-blue px-3 py-1 font-bold">
              {system.id}
            </span>
          </div>

          <h2 className="font-display-md leading-none uppercase text-electric-blue">
            {system.name}
          </h2>

          <div className="space-y-6">
            <div>
              <span className="font-label-caps block mb-2 border-b border-electric-blue pb-2 text-electric-blue font-bold">
                SYSTEM TITLE
              </span>
              <p className="font-body-lg text-electric-blue leading-relaxed text-justify">
                {system.description}
              </p>
            </div>

            {system.originalTitle && (
              <div>
                <span className="font-label-caps block mb-2 border-b border-electric-blue pb-2 text-electric-blue font-bold">
                  SHORT SPECIFICATION
                </span>
                <h4 className="font-mono font-bold text-sm text-electric-blue uppercase">
                  {system.originalTitle}
                </h4>
              </div>
            )}

            {system.originalDescription && (
              <div>
                <span className="font-label-caps block mb-2 border-b border-electric-blue pb-2 text-electric-blue font-bold">
                  DESCRIPTION
                </span>
                <p className="font-body-sm text-electric-blue leading-relaxed text-justify opacity-80">
                  {system.originalDescription}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
