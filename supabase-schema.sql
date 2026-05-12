-- ══════════════════════════════════════════════════
-- FACTOR LABORAL HUMANO — Supabase Schema
-- Corre esto en: supabase.com → SQL Editor → New query
-- ══════════════════════════════════════════════════

-- 1. CANDIDATOS
create table if not exists public.candidatos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  nombre text,
  apellido text,
  telefono text,
  departamento text,
  profesion text,
  experiencia text,
  estudios text,
  habilidades text,
  sobre_mi text,
  cv_url text,
  cv_filename text,
  ia_score integer,
  ia_skills text[],
  ia_resumen text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. VACANTES
create table if not exists public.vacantes (
  id serial primary key,
  titulo text not null,
  sector text,
  salario text,
  tipo text,        -- Presencial / Híbrido / Remoto
  jornada text,     -- Tiempo completo / Medio tiempo
  icon text,
  experiencia text,
  tags text[],
  descripcion text,
  activa boolean default true,
  created_at timestamptz default now()
);

-- 3. APLICACIONES
create table if not exists public.aplicaciones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  vacante_id integer references public.vacantes(id) on delete cascade not null,
  estado text default 'En revisión',  -- En revisión | Preseleccionado | Entrevista programada | Contratado | Rechazado
  created_at timestamptz default now(),
  unique(user_id, vacante_id)
);

-- ── ROW LEVEL SECURITY ──────────────────────────

alter table public.candidatos enable row level security;
alter table public.vacantes enable row level security;
alter table public.aplicaciones enable row level security;

-- Candidatos: cada usuario ve/edita solo su perfil
create policy "candidatos_select_own" on public.candidatos for select using (auth.uid() = user_id);
create policy "candidatos_insert_own" on public.candidatos for insert with check (auth.uid() = user_id);
create policy "candidatos_update_own" on public.candidatos for update using (auth.uid() = user_id);

-- Vacantes: todos pueden ver las activas
create policy "vacantes_public_read" on public.vacantes for select using (activa = true);

-- Aplicaciones: cada usuario ve/crea sus propias
create policy "aplicaciones_select_own" on public.aplicaciones for select using (auth.uid() = user_id);
create policy "aplicaciones_insert_own" on public.aplicaciones for insert with check (auth.uid() = user_id);

-- ── VACANTES INICIALES ──────────────────────────

insert into public.vacantes (titulo, sector, salario, tipo, jornada, icon, experiencia, tags, descripcion) values
  ('Desarrollador Full Stack · Node.js + React', 'Tecnología', 'Q14,000–Q18,000', 'Presencial/Híbrido', 'Tiempo completo', '💻', '3+ años', array['JavaScript','Node.js','React'], 'Buscamos desarrollador con experiencia en aplicaciones web modernas para empresa de tecnología en Guatemala City.'),
  ('Gerente de Finanzas', 'Finanzas', 'Q22,000–Q28,000', 'Presencial', 'Tiempo completo', '📊', '5+ años', array['CPA preferido','Excel avanzado','SAP'], 'Liderar el área financiera de empresa del sector retail. Experiencia en consolidación de estados financieros requerida.'),
  ('Supervisor de Producción', 'Manufactura', 'Q9,000–Q13,000', 'Presencial', 'Tiempo completo', '🏭', '3+ años', array['Ing. Industrial','Manufactura','Lean'], 'Supervisar línea de producción en planta ubicada en Escuintla. Disponibilidad para rotar turnos.'),
  ('Ejecutivo de Ventas Corporativas', 'Comercial', 'Q7,500 + comisiones', 'Híbrido', 'Tiempo completo', '🛒', '2+ años', array['Ventas B2B','CRM','Negociación'], 'Desarrollar cartera de clientes corporativos para empresa de servicios. Vehículo propio requerido.'),
  ('Coordinador de Logística', 'Operaciones', 'Q10,000–Q14,000', 'Presencial', 'Tiempo completo', '🚛', '4+ años', array['Supply Chain','SAP','WMS'], 'Coordinar operaciones de distribución y almacén. Experiencia en manejo de proveedores y KPIs logísticos.'),
  ('Especialista de Recursos Humanos', 'RRHH', 'Q7,000–Q9,500', 'Híbrido', 'Tiempo completo', '🎓', '2+ años', array['Psicología','Nómina','Reclutamiento'], 'Gestión de procesos de selección, nómina y bienestar del colaborador. Licenciatura en Psicología o RRHH.');

-- ── TRIGGER: updated_at en candidatos ───────────

create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger candidatos_updated_at
  before update on public.candidatos
  for each row execute procedure public.handle_updated_at();
