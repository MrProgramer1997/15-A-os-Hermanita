# Tarjeta de 15 anos - Brasil 2027

Experiencia web animada creada con Vite, JavaScript y Supabase, preparada para GitHub Pages.

## Estado actual

El frontend ya esta conectado al proyecto Supabase `Proyecto Quince V`.

- Project ref: `fretmqeznyofqakcsfyb`
- Tarjeta: `hermanita-15-brasil`
- Vigencia: hasta el 30 de septiembre de 2027
- Base de datos: una sola tabla `gift_cards`
- Seguridad: RLS activo; el navegador solo tiene SELECT sobre tarjetas activas

La URL y la Publishable key estan incluidas en `src/config/supabase.js`. Esto es correcto para una aplicacion frontend: la Publishable key es publica y la seguridad real la aplican RLS y los permisos SQL. Nunca uses una secret key o `service_role` en el navegador.

## Ejecutar en Visual Studio Code

```bash
npm install
npm run dev
```

## Build de produccion

```bash
npm run build
```

La salida queda en `dist/`.

`vite.config.js` usa `base: "./"`, por lo que el build funciona tanto en GitHub Pages como en hosting estatico sin tener que cambiar el nombre del repositorio.

## Personalizar el nombre

La tarjeta sigue usando `Hermanita` como nombre temporal. Cuando tengamos el nombre real:

```sql
update public.gift_cards
set recipient_name = 'NOMBRE_REAL',
    updated_at = now()
where slug = 'hermanita-15-brasil';
```

## Fotografias

El campo `photos` recibe un arreglo JSON con `url`, `alt` y `caption`. Si queda vacio, la galeria no se muestra.

```sql
update public.gift_cards
set photos = '[
  {"url":"URL_FOTO_1","alt":"Descripcion de la foto","caption":"Nuestro recuerdo"}
]'::jsonb,
updated_at = now()
where slug = 'hermanita-15-brasil';
```

## Seguridad

- RLS activo.
- `anon` y `authenticated` tienen solamente `SELECT`.
- Solo las filas con `active = true` pueden leerse desde el frontend.
- No se usa `SECURITY DEFINER`.
- No hay credenciales privadas en el proyecto.
- La Publishable key puede estar en el cliente; no equivale a una contrasena.
- La tabla contiene solo informacion destinada a mostrarse publicamente en la tarjeta.

## Publicacion automatica en GitHub Pages

El proyecto ya incluye `.github/workflows/deploy-pages.yml`.

1. Crea un repositorio en GitHub.
2. Sube todo el contenido de esta carpeta a la rama `main`.
3. En GitHub abre `Settings > Pages`.
4. En `Build and deployment > Source`, selecciona `GitHub Actions`.
5. Haz un nuevo push a `main` o ejecuta manualmente el workflow `Deploy GitHub Pages` desde `Actions`.

GitHub instalara las dependencias, ejecutara `npm run build` y publicara la carpeta `dist` automaticamente.
