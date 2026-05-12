# Factor Laboral Humano — v2

## Cambios en esta versión

### 🔒 Seguridad
- **API key de Claude ya no está expuesta en el frontend.** Todas las llamadas a la IA pasan por el proxy `api/claude.js`.
- El login del admin ya no guarda la contraseña en texto plano en el JS. Usa hash SHA-256.

### 🤖 Funcionalidad nueva
- **Chat widget flotante con IA** en todas las páginas públicas (excepto admin y portal candidatos).  
  El chat usa Claude para responder preguntas sobre FLH en tiempo real.
- **Botón WhatsApp flotante** siempre visible en todas las páginas.

### 🎨 Diseño
- Sección "Tech Highlight" del home convertida de 80+ líneas de inline styles a clases CSS reutilizables.
- Mejoras menores de consistencia en CSS.

---

## Configuración en Vercel (requerida)

### 1. Variable de entorno (OBLIGATORIO)
En tu proyecto de Vercel → Settings → Environment Variables:

```
GROQ_API_KEY = gsk_...
```

Sin esto, la IA del chat y el análisis de CV no funcionarán.

### 2. Supabase (para portal de candidatos)
En `pages/candidatos.html` y `pages/admin.html`, reemplaza:
```js
const SUPABASE_URL = 'https://TU_PROYECTO.supabase.co';
const SUPABASE_KEY = 'TU_ANON_KEY';
```
Con tus credenciales reales de [supabase.com](https://supabase.com).

### 3. Admin — cambiar credenciales
El admin ahora usa hashes SHA-256. Para personalizar:

1. Abre la consola del browser (F12)
2. Ejecuta: `hashCredentials('tu@email.com','tuContraseña').then(h=>console.log(h))`
3. Copia el hash resultante
4. Pégalo en `ADMIN_HASH` en `pages/admin.html`

---

## Estructura del proyecto
```
factor-laboral/
├── api/
│   └── claude.js          ← Proxy seguro (Vercel serverless)
├── assets/
│   └── logo.png
├── css/
│   └── main.css           ← Estilos globales + chat widget + tech section
├── js/
│   ├── components.js      ← Nav, Footer, Modal, Chat Widget
│   └── main.js            ← Comportamientos + lógica del chat
├── pages/
│   ├── admin.html
│   ├── candidatos.html
│   ├── contacto.html
│   ├── nosotros.html
│   ├── sectores.html
│   ├── servicios.html
│   ├── tecnologia.html
│   └── vacantes.html
├── index.html
└── vercel.json
```
