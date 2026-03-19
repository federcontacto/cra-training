# C.R.A Training — Sitio Web + Panel Admin

Sitio web y panel de administración para C.R.A Training.  
Stack: **Next.js 14 + Supabase + Tailwind CSS**

## Estructura

```
/                    → Landing pública (datos de Supabase)
/admin/login         → Login del admin
/admin/sedes         → ABM de sedes
/admin/clases        → ABM de clases por sede
/admin/horarios      → ABM de horarios por clase
/admin/planes        → ABM de planes y precios
```

## Setup

### 1. Clonar y dependencias

```bash
git clone <repo>
cd cra-training
npm install
```

### 2. Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ir a **SQL Editor** y ejecutar el contenido de `supabase/migration.sql`
3. Crear un usuario admin: **Authentication > Users > Add User** (email + password)
4. Copiar URL y anon key desde **Settings > API**

### 3. Variables de entorno

```bash
cp .env.example .env.local
```

Editar `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://tu-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
NEXT_PUBLIC_WHATSAPP_DEFAULT=5491100000000
```

### 4. Correr

```bash
npm run dev
```

- Landing: http://localhost:3000
- Admin: http://localhost:3000/admin

### 5. Deploy

```bash
# Vercel (recomendado)
npx vercel

# O build manual
npm run build && npm start
```

## Personalización

- **Colores**: `tailwind.config.js` → `theme.extend.colors.cra`
- **Fonts**: `app/globals.css` → Google Fonts import
- **Logo**: Reemplazar el SVG del rayo en los componentes por un `<Image>` con tu logo
- **WhatsApp**: Reemplazar `5491100000000` en el seed y en `.env.local`

## Notas

- La landing usa **ISR** (`revalidate = 60`), se actualiza cada 60 segundos sin rebuild
- RLS habilitado: lectura pública, escritura solo autenticados
- El seed incluye datos de ejemplo (sede Almagro, 6 clases, 3 planes)
