# 15 Años Hermanita · Brasil 2027

Tarjeta web animada construida con Vite + JavaScript + Supabase y desplegada automáticamente en GitHub Pages.

## Stack

- Vite
- JavaScript ES Modules
- Supabase
- GitHub Pages
- GitHub Actions

## Proyecto Supabase

Proyecto: `Proyecto Quince V`

La aplicación usa la Publishable Key del proyecto en el frontend. No usa `service_role` ni claves secretas.
La tabla `gift_cards` tiene RLS habilitado y acceso público únicamente de lectura para tarjetas activas.

## Desarrollo local

```bash
npm ci
npm run dev
```

## Validar build antes de publicar

```bash
npm run build
```

El resultado se genera en `dist/`.

## GitHub Pages

Repositorio esperado:

`MrProgramer1997/15-A-os-Hermanita`

URL pública:

`https://mrprogramer1997.github.io/15-A-os-Hermanita/`

El archivo `.github/workflows/deploy-pages.yml` hace el build y deploy automáticamente cuando hay un push a `main`.

En GitHub debe estar configurado:

`Settings > Pages > Source: GitHub Actions`
