'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  src: string;
  alt: string;
}

// Imágenes de la galería — reemplazá los paths por las fotos reales
const IMAGES: GalleryImage[] = [
  { src: '/gallery/logocra.jpeg', alt: 'Entrenamiento en CRA Training' },
  { src: '/gallery/foto2.jpg', alt: 'Clase de CrossFit' },
  { src: '/gallery/foto3.jpg', alt: 'Box de CRA Training' },
  { src: '/gallery/foto4.jpg', alt: 'Atletas entrenando' },
  { src: '/gallery/foto5.jpg', alt: 'Comunidad CRA' },
  { src: '/gallery/foto6.jpg', alt: 'WOD del día' },
];

export function Gallery() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const total = IMAGES.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-scroll
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [isHovered, next]);

  // Touch/drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    isDragging.current = true;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = startX.current - e.clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-cra-dark-mid overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="font-barlow-condensed text-xs font-semibold tracking-[3px] uppercase text-cra-green mb-3">
            Galería
          </div>
          <h2 className="font-bebas text-4xl md:text-6xl tracking-wider leading-none mb-4">
            ASÍ SE VIVE<br /><span className="text-cra-green">C.R.A</span>
          </h2>
        </div>

        {/* Carousel container */}
        <div
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main image area */}
          <div
            className="relative overflow-hidden aspect-[16/9] md:aspect-[21/9] cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            {/* Track */}
            <div
              ref={trackRef}
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] h-full"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {IMAGES.map((img, i) => (
                <div key={i} className="min-w-full h-full relative">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-cra-dark/60 via-transparent to-cra-dark/20" />
                </div>
              ))}
            </div>

            {/* Side gradients */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-cra-dark-mid to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-cra-dark-mid to-transparent z-10 pointer-events-none" />

            {/* Green accent line bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-cra-green to-transparent z-20" />
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-cra-dark/70 backdrop-blur border border-white/10 flex items-center justify-center text-white/60 hover:text-cra-green hover:border-cra-green/30 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-cra-dark/70 backdrop-blur border border-white/10 flex items-center justify-center text-white/60 hover:text-cra-green hover:border-cra-green/30 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === current
                    ? 'w-8 bg-cra-green'
                    : 'w-3 bg-white/15 hover:bg-white/30'
                }`}
                aria-label={`Foto ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
