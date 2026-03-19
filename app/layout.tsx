import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'C.R.A Training — El que abandona, no tiene premio',
  description: 'Entrenamiento funcional y CrossFit en CABA. Sumate a C.R.A Training.',
  openGraph: {
    title: 'C.R.A Training',
    description: 'Entrenamiento funcional y CrossFit en CABA',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="antialiased overflow-x-hidden">{children}</body>
    </html>
  );
}
