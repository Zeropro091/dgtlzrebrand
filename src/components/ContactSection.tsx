import { useState, type FormEvent } from 'react';
import { submitLead } from '../lib/deckApi';

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!name || !email) return;
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
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="border-b-2 border-electric-blue bg-transparent outline-none py-2 font-body-sm focus:border-opacity-50 transition-colors" placeholder="Tulis nama kamu" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label-caps">EMAIL</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="border-b-2 border-electric-blue bg-transparent outline-none py-2 font-body-sm focus:border-opacity-50 transition-colors" placeholder="Tulis email kamu" />
            </div>
            <div className="flex flex-col gap-2 flex-grow">
              <label className="font-label-caps">PESAN</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="border-b-2 border-electric-blue bg-transparent outline-none py-2 font-body-sm focus:border-opacity-50 transition-colors flex-grow resize-none min-h-[150px]" placeholder="Ceritakan kebutuhan kamu..."></textarea>
            </div>
            {state === 'sent' && (
              <p className="font-label-caps text-sm border-2 border-[#39FF14] px-4 py-3" style={{ color: '#0a8a0a' }}>
                ✓ Pesan terkirim — kami balas dalam 24 jam.
              </p>
            )}
            {state === 'error' && (
              <p className="font-label-caps text-sm border-2 border-red-600 text-red-600 px-4 py-3">
                ✕ Gagal mengirim — coba lagi atau hubungi via WhatsApp.
              </p>
            )}
            <button
              type="submit"
              disabled={state === 'sending'}
              className="bg-electric-blue text-white px-8 py-4 font-label-caps hover:bg-transparent hover:text-electric-blue border-2 border-electric-blue transition-all mt-auto cursor-pointer disabled:opacity-50"
            >
              {state === 'sending' ? 'MENGIRIM…' : 'KIRIM PESAN'}
            </button>
          </form>
       </div>
    </section>
  );
}
