import { whatsappUrl } from '@/lib/utils';

export function Footer({ whatsapp }: { whatsapp: string }) {
  return (
    <footer className="px-6 md:px-12 py-8 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="font-bebas text-lg tracking-[3px]">
        <span className="text-cra-green">C.R.A</span> TRAINING
      </div>
      <div className="flex gap-6">
        <a href="https://www.instagram.com/cra.training/" target="_blank"
          className="text-cra-gray text-xs tracking-wider hover:text-cra-green transition-colors">
          Instagram
        </a>
        <a href={whatsappUrl(whatsapp)} target="_blank"
          className="text-cra-gray text-xs tracking-wider hover:text-cra-green transition-colors">
          WhatsApp
        </a>
        <a href="#plans"
          className="text-cra-gray text-xs tracking-wider hover:text-cra-green transition-colors">
          Planes
        </a>
      </div>
      <div className="text-[0.7rem] text-white/20">
        © {new Date().getFullYear()} C.R.A Training — Todos los derechos reservados
      </div>
    </footer>
  );
}
