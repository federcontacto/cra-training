export function About() {
  const features = [
    { icon: '⚡', title: 'Alta intensidad', desc: 'WODs diseñados para maximizar resultados' },
    { icon: '🎯', title: 'Coaching real', desc: 'Correcciones técnicas en cada clase' },
    { icon: '🔥', title: 'Comunidad', desc: 'Competimos juntos, crecemos juntos' },
    { icon: '📊', title: 'Programación', desc: 'Periodización y tracking de progreso' },
  ];

  return (
    <section id="about" className="py-24 px-6 md:px-12 bg-cra-dark-mid">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="section-tag">Quiénes somos</div>
          <h2 className="section-title">MÁS QUE UN<br />ENTRENAMIENTO</h2>
          <p className="text-cra-gray leading-relaxed mb-3">
            C.R.A Training es un espacio de entrenamiento funcional y CrossFit donde la intensidad, la disciplina y la comunidad se cruzan. No buscamos clientes, buscamos atletas comprometidos.
          </p>
          <p className="text-cra-gray leading-relaxed">
            Cada clase está diseñada para llevarte al siguiente nivel — con coaching personalizado, programación inteligente y un grupo que te empuja cuando más lo necesitás.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-8">
            {features.map((f) => (
              <div key={f.title} className="group bg-cra-green/[0.04] border border-cra-green/10 p-5 relative overflow-hidden transition-all hover:border-cra-green/30 hover:-translate-y-0.5">
                <div className="absolute top-0 left-0 w-[3px] h-full bg-cra-green scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                <div className="text-xl mb-2">{f.icon}</div>
                <h4 className="font-barlow-condensed font-bold text-sm tracking-wider uppercase mb-1">{f.title}</h4>
                <p className="text-xs text-cra-gray leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Visual: bolt */}
        <div className="hidden md:flex items-center justify-center h-[500px]">
          <svg viewBox="0 0 300 500" className="w-full h-full">
            <polygon points="200,0 60,230 150,230 40,500 280,200 170,200 300,0" fill="#a3d44a" opacity="0.15" />
            <polygon points="200,0 60,230 150,230 40,500 280,200 170,200 300,0" fill="none" stroke="#a3d44a" strokeWidth="2" opacity="0.4" />
          </svg>
        </div>
      </div>
    </section>
  );
}
