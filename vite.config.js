import { defineConfig } from "vite";

export default defineConfig({
  // Base relativa: funciona localmente y evita tener que conocer de antemano
  // el nombre final del repositorio de GitHub Pages.
  base: "./"
});
