import { createServerSupabase } from '@/lib/supabase-server';
import type { Sede, Clase, Plan } from '@/lib/types';
import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { Marquee } from '@/components/landing/marquee';
import { About } from '@/components/landing/about';
import { Schedule } from '@/components/landing/schedule';
import { Plans } from '@/components/landing/plans';
import { Location } from '@/components/landing/location';
import { CTA } from '@/components/landing/cta';
import { Footer } from '@/components/landing/footer';
import { WhatsAppFloat } from '@/components/landing/whatsapp-float';
import { ScrollReveal } from '@/components/landing/scroll-reveal';

export const revalidate = 60; // ISR: revalida cada 60s

export default async function Home() {
  const supabase = createServerSupabase();

  // Fetch primera sede activa con sus clases y planes
  const { data: sedes } = await supabase
    .from('sedes')
    .select('*')
    .eq('activa', true)
    .order('orden');

  const sede = sedes?.[0] as Sede | undefined;

  let clases: Clase[] = [];
  let planes: Plan[] = [];

  if (sede) {
    const [clasesRes, planesRes] = await Promise.all([
      supabase
        .from('clases')
        .select('*, horarios(*)')
        .eq('sede_id', sede.id)
        .eq('activa', true)
        .order('orden'),
      supabase
        .from('planes')
        .select('*')
        .eq('sede_id', sede.id)
        .eq('activo', true)
        .order('orden'),
    ]);
    clases = (clasesRes.data as Clase[]) || [];
    planes = (planesRes.data as Plan[]) || [];
  }

  const whatsapp = sede?.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_DEFAULT || '';

  return (
    <>
      <Navbar whatsapp={whatsapp} />
      <Hero whatsapp={whatsapp} />
      <Marquee />
      <ScrollReveal>
        <About />
      </ScrollReveal>
      <ScrollReveal>
        <Schedule clases={clases} />
      </ScrollReveal>
      <ScrollReveal>
        <Plans planes={planes} whatsapp={whatsapp} />
      </ScrollReveal>
      <ScrollReveal>
        <Location sede={sede} />
      </ScrollReveal>
      <CTA whatsapp={whatsapp} />
      <Footer whatsapp={whatsapp} />
      <WhatsAppFloat whatsapp={whatsapp} />
    </>
  );
}
