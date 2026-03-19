'use client';

import { useState } from 'react';
import { whatsappUrl } from '@/lib/utils';

export function Navbar({ whatsapp }: { whatsapp: string }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-4 bg-cra-dark/90 backdrop-blur-xl border-b border-cra-green/10">
      <div className="font-bebas text-xl tracking-[3px]">
        <span className="text-cra-green">C.R.A</span> TRAINING
      </div>

      {/* Desktop links */}
      <ul className="hidden md:flex gap-8 list-none">
        {[
          ['#about', 'Nosotros'],
          ['#schedule', 'Clases'],
          ['#plans', 'Planes'],
          ['#location', 'Ubicación'],
        ].map(([href, label]) => (
          <li key={href}>
            <a href={href} className="text-cra-gray text-xs font-semibold tracking-[1.5px] uppercase hover:text-cra-green transition-colors">
              {label}
            </a>
          </li>
        ))}
      </ul>

      <a
        href={whatsappUrl(whatsapp, 'Hola! Quiero info sobre CRA Training')}
        target="_blank"
        className="hidden md:inline-block btn-cra text-xs py-2 px-5"
      >
        Sumate →
      </a>

      {/* Mobile toggle */}
      <button className="md:hidden flex flex-col gap-1.5" onClick={() => setOpen(!open)} aria-label="Menú">
        <span className={`block w-7 h-0.5 bg-cra-green transition-transform ${open ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block w-7 h-0.5 bg-cra-green transition-opacity ${open ? 'opacity-0' : ''}`} />
        <span className={`block w-7 h-0.5 bg-cra-green transition-transform ${open ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 bg-cra-dark/98 border-b border-cra-green/10 p-6 flex flex-col gap-4 md:hidden">
          {[
            ['#about', 'Nosotros'],
            ['#schedule', 'Clases'],
            ['#plans', 'Planes'],
            ['#location', 'Ubicación'],
          ].map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}
              className="text-cra-gray text-sm font-semibold tracking-wider uppercase hover:text-cra-green transition-colors">
              {label}
            </a>
          ))}
          <a href={whatsappUrl(whatsapp, 'Hola! Quiero info sobre CRA Training')}
            target="_blank" className="btn-cra text-center mt-2">
            Sumate →
          </a>
        </div>
      )}
    </nav>
  );
}
