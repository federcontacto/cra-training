import type { Plan } from '@/lib/types';
import { formatPrice, whatsappUrl } from '@/lib/utils';

export function Plans({ planes, whatsapp }: { planes: Plan[]; whatsapp: string }) {
  return (
    <section id="plans" className="py-24 px-6 md:px-12 bg-cra-dark-mid">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="section-tag">Planes</div>
          <h2 className="section-title">ELEGÍ TU CAMINO</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {planes.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col p-8 relative transition-all duration-400 ${
                plan.destacado
                  ? 'bg-cra-green/[0.04] border border-cra-green'
                  : 'bg-white/[0.02] border border-white/[0.06]'
              }`}
            >
              {plan.destacado && (
                <div className="absolute -top-px right-8 bg-cra-green text-cra-dark font-barlow-condensed text-[0.65rem] font-bold tracking-widest px-3 py-1">
                  MÁS ELEGIDO
                </div>
              )}

              <div className="font-barlow-condensed text-sm font-bold tracking-widest uppercase text-cra-gray">
                {plan.nombre}
              </div>
              <div className="font-bebas text-5xl text-white my-3 leading-none">
                {formatPrice(plan.precio, plan.moneda)}
                <span className="text-base text-cra-gray tracking-wider ml-1">
                  /{plan.frecuencia === 'mensual' ? 'mes' : plan.frecuencia === 'por clase' ? 'clase' : plan.frecuencia}
                </span>
              </div>
              {plan.descripcion && (
                <div className="text-sm text-cra-gray mb-5 pb-5 border-b border-white/[0.06]">
                  {plan.descripcion}
                </div>
              )}

              <ul className="flex-1 mb-6 space-y-2">
                {(plan.features as string[]).map((feat, i) => (
                  <li key={i} className="text-sm text-cra-gray pl-6 relative">
                    <span className="absolute left-0 text-xs">⚡</span>
                    {feat}
                  </li>
                ))}
              </ul>

              <a
                href={whatsappUrl(whatsapp, `Quiero info del plan ${plan.nombre}`)}
                target="_blank"
                className={
                  plan.destacado
                    ? 'btn-cra text-center justify-center'
                    : 'btn-cra-outline text-center justify-center'
                }
              >
                Consultar →
              </a>
            </div>
          ))}
        </div>

        {planes.length === 0 && (
          <p className="text-center text-cra-gray mt-8">
            Los planes se actualizan próximamente. Consultá por WhatsApp.
          </p>
        )}
      </div>
    </section>
  );
}
