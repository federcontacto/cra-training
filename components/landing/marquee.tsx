export function Marquee() {
  const items = [
    'EL QUE ABANDONA NO TIENE PREMIO',
    'FUNCIONAL',
    'CROSSFIT',
    'FUERZA',
    'RESISTENCIA',
  ];

  const bolt = (
    <svg width="20" height="20" viewBox="0 0 24 24" className="inline">
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill="#0d1b2a" />
    </svg>
  );

  return (
    <div className="py-4 bg-cra-green overflow-hidden -rotate-1 scale-[1.02] -my-2 relative z-10">
      <div className="flex animate-marquee w-max">
        {[...items, ...items].map((text, i) => (
          <span key={i} className="font-bebas text-lg tracking-[4px] text-cra-dark whitespace-nowrap px-8 flex items-center gap-6">
            {text} {bolt}
          </span>
        ))}
      </div>
    </div>
  );
}
