-- ═══════════════════════════════════════════════════════
-- FACTOR LABORAL HUMANO — Configuración Supabase
-- Ejecuta este SQL en: supabase.com > SQL Editor
-- ═══════════════════════════════════════════════════════

-- 1. Tabla de perfiles de candidatos
CREATE TABLE IF NOT EXISTS candidatos (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email         TEXT,
  rol           TEXT DEFAULT 'candidato',
  nombre        TEXT,
  apellido      TEXT,
  telefono      TEXT,
  departamento  TEXT,
  profesion     TEXT,
  experiencia   TEXT,
  estudios      TEXT,
  habilidades   TEXT,
  sobre_mi      TEXT,
  cv_url        TEXT,
  cv_filename   TEXT,
  ia_skills     JSONB,
  ia_score      INTEGER,
  activo        BOOLEAN DEFAULT TRUE,
  ultimo_acceso TIMESTAMPTZ DEFAULT NOW(),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de vacantes
CREATE TABLE IF NOT EXISTS vacantes (
  id          SERIAL PRIMARY KEY,
  titulo      TEXT NOT NULL,
  sector      TEXT,
  descripcion TEXT,
  salario     TEXT,
  tipo        TEXT,
  jornada     TEXT,
  exp_requerida TEXT,
  departamento  TEXT,
  icon        TEXT DEFAULT '💼',
  tags        TEXT[],
  activa      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de aplicaciones
CREATE TABLE IF NOT EXISTS aplicaciones (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vacante_id   INTEGER REFERENCES vacantes(id),
  estado       TEXT DEFAULT 'En revisión',
  notas_admin  TEXT,
  ia_match_pct INTEGER,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, vacante_id)
);

-- 4. Insertar vacantes iniciales
INSERT INTO vacantes (titulo, sector, salario, tipo, jornada, exp_requerida, tags) VALUES
('Desarrollador Full Stack · Node.js + React', 'Tecnología', 'Q14,000–Q18,000', 'Presencial/Híbrido', 'Tiempo completo', '3+ años', ARRAY['JavaScript','React','Node.js']),
('Gerente de Finanzas', 'Finanzas', 'Q22,000–Q28,000', 'Presencial', 'Tiempo completo', '5+ años', ARRAY['CPA preferido','Excel avanzado']),
('Supervisor de Producción', 'Manufactura', 'Q9,000–Q13,000', 'Presencial', 'Tiempo completo', '3+ años', ARRAY['Ing. Industrial']),
('Ejecutivo de Ventas Corporativas', 'Comercial', 'Q7,500 + comisiones', 'Híbrido', 'Tiempo completo', '2+ años', ARRAY['Ventas B2B','CRM']),
('Coordinador de Logística', 'Operaciones', 'Q10,000–Q14,000', 'Presencial', 'Tiempo completo', '4+ años', ARRAY['Supply Chain','SAP']),
('Especialista de RRHH', 'Operaciones', 'Q7,000–Q9,500', 'Híbrido', 'Tiempo completo', '2+ años', ARRAY['Psicología','Nómina'])
ON CONFLICT DO NOTHING;

-- 5. Row Level Security (RLS) — Seguridad
ALTER TABLE candidatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE aplicaciones ENABLE ROW LEVEL SECURITY;

-- Candidatos solo ven/editan su propio perfil
CREATE POLICY "candidato_propio" ON candidatos
  FOR ALL USING (auth.uid() = user_id);

-- Candidatos solo ven sus propias aplicaciones
CREATE POLICY "aplicaciones_propias" ON aplicaciones
  FOR ALL USING (auth.uid() = user_id);

-- Vacantes son públicas (solo lectura)
ALTER TABLE vacantes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vacantes_publicas" ON vacantes
  FOR SELECT USING (activa = TRUE);

-- 6. Función para desactivar cuentas inactivas (+90 días)
CREATE OR REPLACE FUNCTION desactivar_inactivos()
RETURNS void AS $$
  UPDATE candidatos
  SET activo = FALSE
  WHERE ultimo_acceso < NOW() - INTERVAL '90 days'
    AND activo = TRUE;
$$ LANGUAGE SQL;

-- 7. Storage bucket para CVs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cvs', 'cvs', FALSE)
ON CONFLICT DO NOTHING;

-- Política: candidatos pueden subir/leer solo su propio CV
CREATE POLICY "cv_propio_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "cv_propio_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ═══════════════════════════════════════════════════════
-- PASOS PARA ACTIVAR:
-- 1. Ve a supabase.com y crea un proyecto nuevo
-- 2. Ve a SQL Editor y pega todo este archivo
-- 3. Copia tu Project URL y anon key
-- 4. Reemplaza en candidatos.html y admin.html:
--    const SUPABASE_URL = 'https://TU_PROYECTO.supabase.co'
--    const SUPABASE_KEY = 'TU_ANON_KEY'
-- 5. En Authentication > Providers activa Google OAuth
-- 6. En Authentication > URL Configuration agrega tu dominio
-- ═══════════════════════════════════════════════════════

-- MIGRACIÓN: Agregar columnas nuevas si ya tienes la tabla
ALTER TABLE vacantes ADD COLUMN IF NOT EXISTS departamento TEXT;
ALTER TABLE vacantes ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '💼';
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS rol TEXT DEFAULT 'candidato';

-- ═══ TABLA APLICACIONES (si no existe) ═══
CREATE TABLE IF NOT EXISTS aplicaciones (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vacante_id    UUID REFERENCES vacantes(id) ON DELETE CASCADE,
  vacante_titulo TEXT,
  vacante_sector TEXT,
  estado        TEXT DEFAULT 'revision',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, vacante_id)
);
ALTER TABLE aplicaciones DISABLE ROW LEVEL SECURITY;

-- ═══ STORAGE BUCKETS ═══
-- Corre esto en Supabase Dashboard > Storage > New bucket:
-- 1. Bucket: "cvs"           → Private (usa signed URLs)
-- 2. Bucket: "candidatos-media" → Public (fotos de perfil)
-- O crea los buckets via SQL:
INSERT INTO storage.buckets (id, name, public) VALUES ('cvs', 'cvs', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('candidatos-media', 'candidatos-media', true) ON CONFLICT DO NOTHING;

-- Políticas de storage para que candidatos puedan subir sus archivos
CREATE POLICY "candidatos upload cv" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id='cvs');
CREATE POLICY "candidatos read own cv" ON storage.objects FOR SELECT TO authenticated USING (bucket_id='cvs');
CREATE POLICY "candidatos upload foto" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id='candidatos-media');
CREATE POLICY "public read fotos" ON storage.objects FOR SELECT TO public USING (bucket_id='candidatos-media');

-- Columna cv_url en candidatos
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS cv_url TEXT;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS ia_score INTEGER;
ALTER TABLE candidatos ADD COLUMN IF NOT EXISTS ia_resumen TEXT;
