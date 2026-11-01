import { useState, useEffect, useRef, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { submitLead } from '../lib/deckApi';
import { useSound } from '../lib/useSound';
import { Pressable } from './Pressable';

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const { play } = useSound();
  const soundedFor = useRef<string>('idle');

  useEffect(() => {
    if (soundedFor.current === state) return;
    soundedFor.current = state;
    if (state === 'sent') play('success');
    else if (state === 'error') play('error');
  }, [state, play]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!name || !email) {
      play('error');
      return;
    }
    setState('sending');
    try {
      await submitLead({ name, contact: email, message });
      setState('sent');
      setName(''); setEmail(''); setMessage('');
    } catch {
      setState('error');
    }
  }

  return (
    <section id="contact" className="grid grid-cols-1 md:grid-cols-12 border-b border-electric-blue bg-off-white">
       <div className="col-span-12 md:col-span-6 p-margin border-b md:border-b-0 md:border-r border-electric-blue flex flex-col justify-between">
          <div>
            <h2 className="font-display-lg leading-none uppercase mb-8">INITIATE<br/>CONTACT</h2>
            <p className="font-body-sm max-w-sm mb-6">Ceritakan kebutuhan bisnis kamu. Tim kami akan membalas dalam 24 jam.</p>
            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <a 
                href="https://wa.me/6281237729115" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border-2 border-electric-blue text-electric-blue px-6 py-3 font-label-caps hover:bg-electric-blue hover:text-white transition-all cursor-pointer text-xs"
              >
                CHAT ON WHATSAPP: 081237729115
              </a>
              <a 
                href="https://wa.me/6281237729115?text=Halo%20DGTLZ%20Team%2C%20saya%20ingin%20akses%20dan%20onboarding%20DGTLZ%20PayGate." 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border-2 border-black bg-black text-[#39FF14] px-6 py-3 font-label-caps hover:bg-transparent hover:text-black transition-all cursor-pointer text-xs font-bold"
              >
                [ REQUEST PAYGATE ACCESS ]
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8 border-t border-electric-blue pt-8 mt-12 md:mt-0">
            <div>
              <div className="font-label-caps opacity-60 mb-2">TERMINAL_01</div>
              <div className="font-body-sm">JAKARTA, INDONESIA</div>
            </div>
            <div>
              <div className="font-label-caps opacity-60 mb-2">TERMINAL_02</div>
              <div className="font-body-sm">DENPASAR, INDONESIA</div>
            </div>
          </div>
       </div>
       <div className="col-span-12 md:col-span-6 p-margin bg-white">
          <form onSubmit={submit} className="flex flex-col gap-8 h-full">
            <div className="flex flex-col gap-2">
              <label className="font-label-caps">NAMA</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} onFocus={() => play('tick')} required className="border-b-2 border-electric-blue bg-transparent outline-none py-2 font-body-sm focus:border-blue-400 transition-colors focus-machine" placeholder="Tulis nama kamu" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-caps">EMAIL</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => play('tick')} required className="border-b-2 border-electric-blue bg-transparent outline-none py-2 font-body-sm focus:border-blue-400 transition-colors focus-machine" placeholder="Tulis email kamu" />
            </div>
            <div className="flex flex-col gap-2 flex-grow">
              <label className="font-label-caps">PESAN</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} onFocus={() => play('tick')} className="border-b-2 border-electric-blue bg-transparent outline-none py-2 font-body-sm focus:border-blue-400 transition-colors flex-grow resize-none min-h-[150px] focus-machine" placeholder="Ceritakan kebutuhan kamu..."></textarea>
            </div>
            <AnimatePresence mode="wait">
              {state === 'sent' && (
                <motion.p
                  key="sent"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="font-label-caps text-sm border-2 border-[#39FF14] px-4 py-3"
                  style={{ color: '#0a8a0a' }}
                >
                  ✓ Pesan terkirim — kami balas dalam 24 jam.
                </motion.p>
              )}
              {state === 'error' && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: [0, -5, 5, -3, 3, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.42 }}
                  className="font-label-caps text-sm border-2 border-red-600 text-red-600 px-4 py-3"
                >
                  ✕ Gagal mengirim — coba lagi atau hubungi via WhatsApp.
                </motion.p>
              )}
            </AnimatePresence>
            <Pressable
              type="submit"
              disabled={state === 'sending'}
              cue="mechanical"
              ripple
              className="bg-electric-blue text-white px-8 py-4 font-label-caps hover:bg-transparent hover:text-electric-blue border-2 border-electric-blue transition-all mt-auto disabled:opacity-50"
            >
              <span className="w-full text-center">
                {state === 'sending' ? (
                  <span className="inline-flex items-center gap-2 justify-center">
                    MENGIRIM
                    <span className="inline-flex gap-1" aria-hidden="true">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="inline-block w-1 h-1 bg-current rounded-full"
                          style={{ animation: `eq-bounce 0.7s ${i * 0.12}s ease-in-out infinite alternate` }}
                        />
                      ))}
                    </span>
                  </span>
                ) : (
                  'KIRIM PESAN'
                )}
              </span>
            </Pressable>
          </form>
       </div>
    </section>
  );
}
