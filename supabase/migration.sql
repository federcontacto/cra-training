-- ============================================
-- C.R.A TRAINING — Schema completo
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- SEDES
create table public.sedes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  direccion text not null,
  piso text,
  whatsapp text not null,
  google_maps_url text,
  lat numeric,
  lng numeric,
  activa boolean default true,
  orden int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- CLASES (pertenecen a una sede)
create table public.clases (
  id uuid primary key default gen_random_uuid(),
  sede_id uuid not null references public.sedes(id) on delete cascade,
  nombre text not null,
  descripcion text,
  tag text, -- ej: "Lunes a Viernes", "Sábados"
  color text default '#a3d44a',
  activa boolean default true,
  orden int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- HORARIOS (pertenecen a una clase)
create table public.horarios (
  id uuid primary key default gen_random_uuid(),
  clase_id uuid not null references public.clases(id) on delete cascade,
  dia_semana int not null check (dia_semana between 0 and 6), -- 0=Domingo, 1=Lunes...
  hora_inicio time not null,
  hora_fin time not null,
  cupo_max int,
  activo boolean default true,
  created_at timestamptz default now()
);

-- PLANES (pertenecen a una sede)
create table public.planes (
  id uuid primary key default gen_random_uuid(),
  sede_id uuid not null references public.sedes(id) on delete cascade,
  nombre text not null,
  precio numeric not null,
  moneda text default 'ARS',
  frecuencia text not null, -- 'mensual', 'por clase', 'trimestral'
  descripcion text, -- ej: "3 veces por semana"
  features jsonb default '[]'::jsonb, -- ["Acceso a clases", "Open Box", ...]
  destacado boolean default false,
  activo boolean default true,
  orden int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ÍNDICES
create index idx_clases_sede on public.clases(sede_id);
create index idx_horarios_clase on public.horarios(clase_id);
create index idx_planes_sede on public.planes(sede_id);

-- FUNCIÓN para updated_at automático
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger sedes_updated_at before update on public.sedes
  for each row execute function public.handle_updated_at();
create trigger clases_updated_at before update on public.clases
  for each row execute function public.handle_updated_at();
create trigger planes_updated_at before update on public.planes
  for each row execute function public.handle_updated_at();

-- RLS: lectura pública, escritura solo autenticados
alter table public.sedes enable row level security;
alter table public.clases enable row level security;
alter table public.horarios enable row level security;
alter table public.planes enable row level security;

-- Lectura pública (para la landing)
create policy "sedes_read" on public.sedes for select using (true);
create policy "clases_read" on public.clases for select using (true);
create policy "horarios_read" on public.horarios for select using (true);
create policy "planes_read" on public.planes for select using (true);

-- Escritura solo auth (para el admin)
create policy "sedes_write" on public.sedes for all using (auth.role() = 'authenticated');
create policy "clases_write" on public.clases for all using (auth.role() = 'authenticated');
create policy "horarios_write" on public.horarios for all using (auth.role() = 'authenticated');
create policy "planes_write" on public.planes for all using (auth.role() = 'authenticated');

-- ============================================
-- SEED DATA (sede inicial)
-- ============================================
insert into public.sedes (nombre, direccion, piso, whatsapp, activa, orden) values
  ('CRA Almagro', 'Av. Corrientes 6131', '2do Piso', '5491100000000', true, 1);

-- Clases de ejemplo para la sede
with sede as (select id from public.sedes where nombre = 'CRA Almagro')
insert into public.clases (sede_id, nombre, descripcion, tag, orden) values
  ((select id from sede), 'CrossFit — Turno Mañana', 'Arrancá el día con todo. WOD + técnica. Ideal para los que entrenan antes de laburar.', 'Lunes a Viernes', 1),
  ((select id from sede), 'Funcional', 'Entrenamiento funcional para todos los niveles. Trabajo con peso corporal, kettlebells y más.', 'Lunes a Viernes', 2),
  ((select id from sede), 'Open Box', 'Espacio libre para practicar skills, levantar o hacer el WOD a tu ritmo con supervisión.', 'Lun / Mié / Vie', 3),
  ((select id from sede), 'CrossFit — Turno Tarde', 'La clase más intensa del día. Warm-up, skill work, WOD y finisher.', 'Lunes a Viernes', 4),
  ((select id from sede), 'CrossFit — Turno Noche', 'El horario más popular. Vení a vaciarlo todo después del día.', 'Lunes a Viernes', 5),
  ((select id from sede), 'Sábado CRA', 'Clase especial de fin de semana. Team WODs, competencias internas y buena onda.', 'Sábados', 6);

-- Planes de ejemplo
with sede as (select id from public.sedes where nombre = 'CRA Almagro')
insert into public.planes (sede_id, nombre, precio, frecuencia, descripcion, features, destacado, orden) values
  ((select id from sede), 'Básico', 25000, 'mensual', '3 veces por semana', '["Acceso a clases de CrossFit", "3 días a elección", "Seguimiento básico", "Comunidad CRA"]'::jsonb, false, 1),
  ((select id from sede), 'Full', 35000, 'mensual', 'Acceso ilimitado', '["Todas las clases disponibles", "Open Box incluido", "Programación personalizada", "Seguimiento de progreso", "Comunidad CRA"]'::jsonb, true, 2),
  ((select id from sede), 'Clase suelta', 5000, 'por clase', 'Sin compromiso', '["1 clase a elección", "Probá sin comprometerte", "Ideal para visitantes"]'::jsonb, false, 3);
