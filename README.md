# Tarjeta de 15 anos - Brasil 2027

Experiencia web animada creada con Vite, JavaScript y Supabase, pensada para GitHub Pages.

## Arquitectura

- `index.html`: estructura visual.
- `src/main.js`: interacciones, animaciones y renderizado.
- `src/styles.css`: diseno responsive y animaciones.
- `src/data/defaultCard.js`: respaldo local si Supabase no esta configurado o falla.
- `src/services/cardRepository.js`: unica capa que consulta Supabase.
- `supabase/schema.sql`: tabla, RLS, permisos y contenido inicial.

## 1. Abrir en Visual Studio Code

```bash
npm install
npm run dev
```

## 2. Configurar Supabase

1. Abre tu proyecto en Supabase.
2. Ve a SQL Editor.
3. Ejecuta `supabase/schema.sql`.
4. Copia `.env.example` a `.env`.
5. Completa tu URL y Publishable key.

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=TU_PUBLISHABLE_KEY
```

Nunca pongas una secret key o `service_role` en GitHub Pages.

## 3. Personalizar el nombre

En Supabase:

```sql
update public.gift_cards
set recipient_name = 'NOMBRE_REAL',
    updated_at = now()
where slug = 'hermanita-15-brasil';
```

## 4. Agregar fotografias

El campo `photos` recibe un arreglo JSON de objetos con `url`, `alt` y `caption`.

```sql
update public.gift_cards
set photos = '[
  {"url":"URL_FOTO_1","alt":"Descripcion de la foto","caption":"Nuestro recuerdo"}
]'::jsonb,
updated_at = now()
where slug = 'hermanita-15-brasil';
```

Si no hay fotos, la galeria no aparece y la tarjeta sigue viendose terminada.

## 5. GitHub Pages

En `vite.config.js`, si el repositorio se llama `Tarjeta-15-Brasil`, usa:

```js
base: "/Tarjeta-15-Brasil/"
```

Luego:

```bash
npm run build
```

La salida queda en `dist/`.

## Seguridad

- RLS esta activo.
- `anon` y `authenticated` tienen solamente `SELECT`.
- No se usa `SECURITY DEFINER`.
- La tabla debe contener solamente informacion que pueda ser publica.
- Nunca publiques `service_role`, secret keys o datos privados.
- El slug no funciona como contrasena: quien tenga el enlace puede ver la tarjeta.
