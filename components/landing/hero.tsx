'use client';

import { useState, useEffect, useCallback } from 'react';
import { whatsappUrl } from '@/lib/utils';

const IMAGES = [
  { src: '/gallery/foto1.jpg', alt: 'Entrenamiento en CRA Training' },
  { src: '/gallery/foto2.jpg', alt: 'Clase de CrossFit' },
  { src: '/gallery/foto3.jpg', alt: 'Box de CRA Training' },
  { src: '/gallery/foto4.jpg', alt: 'Atletas entrenando' },
  { src: '/gallery/foto5.jpg', alt: 'Comunidad CRA' },
  { src: '/gallery/foto6.jpg', alt: 'WOD del día' },
];

export function Hero({ whatsapp }: { whatsapp: string }) {
  const [current, setCurrent] = useState(0);
  const total = IMAGES.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  useEffect(() => {
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden px-6 md:px-12 pt-24 pb-12">
      {/* Background bolt sutil */}
      <svg className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[55vw] h-[120vh] opacity-[0.03] pointer-events-none" viewBox="0 0 400 900">
        <polygon points="250,0 100,400 220,400 80,900 380,350 230,350 400,0" fill="#a3d44a" />
      </svg>

      <div className="relative z-10 w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left: texto */}
        <div>
          <div className="inline-block font-barlow-condensed text-xs font-semibold tracking-[3px] uppercase text-cra-green border border-cra-green/30 px-4 py-1.5 mb-6 animate-[fadeSlideUp_0.8s_ease-out]">
            ⚡ Entrenamiento Funcional &amp; CrossFit
          </div>

          <h1 className="font-bebas text-[clamp(3.5rem,8vw,8rem)] leading-[0.9] tracking-wider animate-[fadeSlideUp_0.8s_ease-out_0.15s_both]">
            <span className="text-cra-green">C.R.A</span><br />TRAINING
          </h1>

          <p className="text-lg text-cra-gray mt-6 max-w-lg leading-relaxed animate-[fadeSlideUp_0.8s_ease-out_0.3s_both]">
            El que abandona, no tiene premio. Superá tus límites con entrenamiento funcional de alta intensidad en el corazón de CABA.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-[fadeSlideUp_0.8s_ease-out_0.45s_both]">
            <a href={whatsappUrl(whatsapp, 'Hola! Quiero info sobre CRA Training')} target="_blank" className="btn-cra">
              <WhatsAppIcon /> Escribinos
            </a>
            <a href="#plans" className="btn-cra-outline">Ver planes ↓</a>
          </div>

          <div className="flex gap-12 mt-16 pt-8 border-t border-white/[0.06] animate-[fadeSlideUp_0.8s_ease-out_0.6s_both]">
            {[
              ['500+', 'Atletas activos'],
              ['6', 'Clases por día'],
              ['100%', 'Compromiso'],
            ].map(([num, label]) => (
              <div key={label}>
                <div className="font-bebas text-4xl text-cra-green leading-none">{num}</div>
                <div className="text-[0.7rem] tracking-widest uppercase text-cra-gray mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: carrusel de fotos */}
        <div className="relative hidden md:block animate-[fadeSlideUp_0.8s_ease-out_0.3s_both]">
          <div className="relative aspect-[4/5] overflow-hidden">
            <div className="absolute -inset-[1px] border border-cra-green/20 z-20 pointer-events-none" />
            <div className="absolute top-3 left-3 right-3 bottom-3 border border-cra-green/10 z-20 pointer-events-none" />

            {IMAGES.map((img, i) => (
              <img
                key={i}
                src={img.src}
                alt={img.alt}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  i === current
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-105'
                }`}
                draggable={false}
              />
            ))}

            <div className="absolute inset-0 bg-gradient-to-t from-cra-dark/50 via-transparent to-cra-dark/30 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-cra-dark/40 via-transparent to-transparent z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cra-green via-cra-green/50 to-transparent z-20" />

            <div className="absolute top-4 right-4 z-20 bg-cra-dark/70 backdrop-blur border border-cra-green/20 px-3 py-1">
              <span className="font-barlow-condensed text-[0.65rem] font-bold tracking-widest uppercase text-cra-green">
                {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            {IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-[3px] rounded-full transition-all duration-500 ${
                  i === current
                    ? 'w-8 bg-cra-green'
                    : 'w-3 bg-white/10 hover:bg-white/25'
                }`}
                aria-label={`Foto ${i + 1}`}
              />
            ))}
          </div>

          <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r border-b border-cra-green/15 pointer-events-none" />
          <div className="absolute -top-4 -left-4 w-16 h-16 border-l border-t border-cra-green/15 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.616l4.535-1.456A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.37 0-4.567-.697-6.417-1.892l-.45-.287-2.866.921.957-2.816-.313-.472A9.958 9.958 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
    </svg>
  );
}
