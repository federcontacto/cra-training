import { whatsappUrl } from '@/lib/utils';

export function CTA({ whatsapp }: { whatsapp: string }) {
  return (
    <section className="py-32 px-6 md:px-12 text-center relative overflow-hidden bg-gradient-to-br from-cra-dark via-cra-dark-mid to-cra-dark">
      <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(163,212,74,0.08)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="relative z-10">
        <div className="section-tag text-center">Empezá hoy</div>
        <h2 className="section-title text-center">
          EL QUE ABANDONA,<br />
          <span className="text-cra-green">NO TIENE PREMIO</span>
        </h2>
        <p className="text-cra-gray max-w-md mx-auto mt-4 mb-8 leading-relaxed">
          Tu primera clase de prueba es gratis. Escribinos por WhatsApp y reservá tu lugar.
        </p>
        <a
          href={whatsappUrl(whatsapp, 'Quiero hacer mi clase de prueba!')}
          target="_blank"
          className="btn-cra inline-flex"
        >
          Quiero mi clase gratis →
        </a>
      </div>
    </section>
  );
}
