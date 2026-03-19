import type { Clase } from '@/lib/types';
import { formatTime } from '@/lib/utils';

export function Schedule({ clases }: { clases: Clase[] }) {
  return (
    <section id="schedule" className="py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="section-tag">Horarios</div>
          <h2 className="section-title">CLASES DISPONIBLES</h2>
          <p className="text-cra-gray text-sm mt-2">
            Consultá disponibilidad actualizada por WhatsApp
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {clases.map((clase) => {
            // Si tiene horarios, mostrar el primero como hora principal
            const primerHorario = clase.horarios?.[0];
            const hora = primerHorario ? formatTime(primerHorario.hora_inicio) : '';

            return (
              <div
                key={clase.id}
                className="group bg-white/[0.02] border border-white/[0.06] p-6 relative overflow-hidden transition-all duration-400 hover:border-cra-green hover:bg-cra-green/[0.03]"
              >
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-cra-green to-transparent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-400" />
                
                {hora && (
                  <div className="font-bebas text-4xl text-cra-green leading-none">{hora}</div>
                )}
                <div className="font-barlow-condensed text-lg font-bold tracking-wider uppercase mt-2">
                  {clase.nombre}
                </div>
                {clase.descripcion && (
                  <p className="text-xs text-cra-gray mt-3 leading-relaxed">{clase.descripcion}</p>
                )}
                {clase.tag && (
                  <span className="inline-block text-[0.65rem] font-bold tracking-widest uppercase text-cra-green border border-cra-green/30 px-2 py-0.5 mt-4">
                    {clase.tag}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {clases.length === 0 && (
          <p className="text-center text-cra-gray mt-8">
            Los horarios se actualizan próximamente. Consultá por WhatsApp.
          </p>
        )}
      </div>
    </section>
  );
}
