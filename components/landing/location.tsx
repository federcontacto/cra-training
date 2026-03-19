import type { Sede } from '@/lib/types';

export function Location({ sede }: { sede?: Sede }) {
  const direccion = sede ? `${sede.direccion}${sede.piso ? `, ${sede.piso}` : ''}` : 'Av. Corrientes 6131, 2do Piso';
  const mapsUrl = sede?.google_maps_url || `https://maps.google.com/?q=${encodeURIComponent(direccion + ' Buenos Aires')}`;

  return (
    <section id="location" className="py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="section-tag">Dónde estamos</div>
            <h2 className="section-title">VENÍ A<br />ENTRENAR</h2>
            <p className="text-cra-gray leading-relaxed">
              Estamos en pleno Almagro, sobre Av. Corrientes. Fácil acceso en subte, bondi o bici.
            </p>
            <p className="font-barlow-condensed text-base font-semibold tracking-wider text-white mt-4">
              📍 {direccion}<br />CABA, Buenos Aires
            </p>
            <div className="mt-6">
              <a href={mapsUrl} target="_blank" className="btn-cra">
                Cómo llegar →
              </a>
            </div>
          </div>
          <div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.5!2d-58.455!3d-34.604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM2JzE0LjQiUyA1OMKwMjcnMTguMCJX!5e0!3m2!1ses!2sar!4v1"
              className="w-full h-[350px] border border-cra-green/15 grayscale hover:grayscale-[0.3] contrast-[1.1] transition-all duration-400"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
