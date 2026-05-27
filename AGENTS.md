# AGENTS.md — Guías de infraestructura para agentes

> Este archivo es de lectura obligatoria para cualquier agente (Claude Code, Codex, otros) que trabaje en este repositorio.
> Define el stack, comandos, convenciones, restricciones y criterios de aceptación.
> Si entra en conflicto con instrucciones puntuales del usuario, gana el usuario — pero documentarlo aquí después.

---

## 1. Identidad del proyecto

- **Nombre:** Portafolio personal de Antonio Cortázar Jiménez.
- **Propósito:** mostrar trabajo + canalizar leads hacia CRZR (marca de servicios).
- **Dominio target:** por definir (ver PLAN.md §12).
- **Hosting:** Vercel (preferido) con preview deploys por PR.
- **Documentación viva:**
  - [PLAN.md](PLAN.md) — alcance, secciones, roadmap.
  - [DESIGN.md](DESIGN.md) — sistema visual y reglas de animación.
  - **AGENTS.md** (este archivo) — infraestructura y proceso.

---

## 2. Stack obligatorio (versiones — mayo 2026)

| Capa | Tecnología | Versión mínima |
|---|---|---|
| Runtime | **Node.js** | **22 LTS** (Astro 6 lo exige) |
| Package manager | **npm** | 10+ |
| Framework | **Astro** | **6.3.x** |
| Estilos | **Tailwind CSS** | **4.3.x** (via `@tailwindcss/vite`) |
| Lenguaje | **TypeScript** | 5.6+ en modo `strict` |
| Contenido | Astro Content Collections (`zod`) | nativo |
| Islas | **React 19** (solo donde se necesita estado de cliente) | — |
| Smooth scroll | **lenis** | última estable |
| Animación on-scroll | **gsap** + ScrollTrigger | 3.13+ |
| WebGL ambiental | **@appletosolutions/reactbits** + **ogl** | última |
| Iconos | **astro-icon** + `@iconify-json/lucide`, `@iconify-json/simple-icons` | — |
| MDX | **@astrojs/mdx** | última |
| SEO | **@astrojs/sitemap** | última |

### Prohibido sin justificación documentada
- jQuery, Bootstrap, Material UI.
- Cualquier UI kit pesado (Chakra, MUI, Ant Design).
- Framer Motion (GSAP cubre el caso de uso).
- Google Fonts en runtime — usar Fonts API de Astro 6 con autohospedaje.
- CSS-in-JS (styled-components, emotion).
- Analytics invasivo (Google Analytics, FB Pixel). Si se requiere, usar **Plausible** o **Umami**.

---

## 3. Estructura del repositorio

Ver [PLAN.md §3](PLAN.md). Resumen de carpetas críticas:

```
src/
├── content.config.ts        ← schema de Content Collections (TS estricto)
├── content/projects/        ← .mdx por proyecto, source of truth
├── layouts/                 ← BaseLayout + ProjectLayout
├── components/
│   ├── ui/                  ← primitivos (.astro)
│   ├── layout/              ← Navbar, Footer, LanguageSwitcher
│   ├── sections/            ← Hero, About, Stack, Projects, ...
│   └── islands/             ← .tsx con `client:*` directive
├── i18n/                    ← ui.ts + utils.ts (sin librería externa)
├── lib/                     ← lenis init, seo helpers
├── pages/                   ← ruteo. `/` (es) y `/en/` (en)
└── styles/global.css        ← @import "tailwindcss"; @theme { ... }
```

---

## 4. Comandos canónicos

| Acción | Comando |
|---|---|
| Instalar dependencias | `npm install` |
| Dev server | `npm run dev` (puerto 4321 por defecto) |
| Type-check + lint Astro | `npm run astro check` |
| Build producción | `npm run build` |
| Preview build local | `npm run preview` |
| Lint | `npm run lint` (ESLint, si configurado) |
| Format | `npm run format` (Prettier) |
| Analizar bundle | `npm run build -- --analyze` (o herramienta equivalente) |

Antes de declarar una tarea como completa, agente debe correr **`npm run astro check` + `npm run build`** y reportar ambos exitosos. Si el cambio toca UI, además debe abrirse el dev server y verificar visualmente (golden path + un edge case).

---

## 5. Convenciones de código

### 5.1 Astro
- Componentes `.astro` por defecto.
- Usar `<Image />` (de `astro:assets`) para todas las imágenes locales. Nunca `<img>` salvo en MDX para imágenes remotas.
- `Astro.url`, `Astro.site`, `Astro.params` — preferir sobre runtime hacks.
- Frontmatter de páginas: imports primero, lógica después, return implícito de markup.

### 5.2 TypeScript
- `strict: true`, `noUncheckedIndexedAccess: true`.
- Tipos en `src/types/` si son compartidos.
- Sin `any`. Si es inevitable, comentar con `// reason: ...`.
- Schemas con `zod`, no interfaces sueltas.

### 5.3 Islas (React 19)
- Archivos `.tsx` en `src/components/islands/`.
- Directiva mínima viable: `client:visible` por defecto, `client:idle` si es preload aceptable, `client:load` solo si bloquea el renderizado inicial (raro).
- Props serializables (sin funciones, sin clases).

### 5.4 Tailwind v4
- Tokens en `src/styles/global.css` bajo `@theme { ... }` (ver [DESIGN.md §2.1](DESIGN.md)).
- Sin `tailwind.config.js`.
- Clases utilitarias inline. Si un patrón se repite ≥ 3 veces, extraer a componente, no a `@apply`.
- Evitar `@apply` salvo en `global.css` para resets.
- Orden de clases sugerido: layout → box → typography → color → state. Usar `prettier-plugin-tailwindcss` para ordenar automático.

### 5.5 CSS personalizado
- Solo cuando Tailwind no alcanza (keyframes, clip-paths complejos, masks).
- Vive en el bloque `<style>` del componente o en `global.css`.
- Variables CSS para valores compartidos entre JS y CSS (ej. duraciones de animación).

### 5.6 Animación (GSAP)
- Importar selectivo: `import gsap from "gsap"; import { ScrollTrigger } from "gsap/ScrollTrigger";`.
- Registrar plugins una sola vez en `lib/animations.ts`.
- Toda animación scroll-triggered debe respetar `prefers-reduced-motion`:
  ```ts
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  ```
- Cleanup en `astro:before-swap` para que View Transitions no acumulen triggers.

### 5.7 Lenis
- Init una sola vez en `BaseLayout.astro` con `lerp: 0.1`.
- Pausar si reduced-motion.
- Reconectar GSAP ScrollTrigger con `lenis.on('scroll', ScrollTrigger.update)`.

---

## 6. Contenido (Content Collections)

- Source of truth: `src/content/projects/*.mdx`.
- Schema en `src/content.config.ts` (ver PLAN.md §5).
- Cada proyecto **debe** tener: `title`, `summary`, `role`, `year`, `stack`, `cover`, `featured`, `order`, `lang`.
- Imágenes referenciadas desde el `.mdx` con paths relativos a `src/assets/`.
- Locales: campo `lang: "es" | "en"`. Listados filtran por idioma de la ruta.

---

## 7. Performance — presupuestos duros

| Métrica | Target |
|---|---|
| Lighthouse Performance (mobile) | ≥ 95 |
| Lighthouse Accessibility | 100 |
| Lighthouse SEO | 100 |
| JS total en `/` | **< 80 KB** (compresión incluida) |
| JS por página de proyecto | **< 60 KB** |
| LCP | < 2.0 s |
| CLS | < 0.05 |
| INP | < 200 ms |

Si un cambio rompe estos presupuestos, el PR no se mergea hasta justificar o revertir.

Herramientas: Lighthouse CI en preview deploys, `astro build --analyze`, WebPageTest spot-check.

---

## 8. Accesibilidad — no-negociables

- Contraste AA mínimo (4.5:1 texto, 3:1 títulos grandes).
- `:focus-visible` siempre visible y consistente (ver DESIGN.md §5.4).
- `aria-label` en links/botones con solo icono.
- `alt` descriptivo en imágenes informativas, `alt=""` en decorativas.
- `prefers-reduced-motion` respetado en GSAP, Lenis y WebGL.
- Skip-to-content link en Navbar.
- Estructura semántica: una sola `<h1>` por página, jerarquía sin saltos.
- Formularios con `<label>` asociado.

---

## 9. SEO — checklist por página

- `<title>` único, < 60 caracteres.
- `<meta name="description">` único, 140–160 caracteres.
- Open Graph: `og:title`, `og:description`, `og:image` (1200×630), `og:url`.
- Twitter card `summary_large_image`.
- Canonical URL.
- `hreflang` alternates entre `/` y `/en/`.
- Schema.org JSON-LD: `Person` en home, `CreativeWork` en proyectos.
- Sitemap generado automáticamente.
- `robots.txt` con sitemap declarado.

---

## 10. Internacionalización

- Default: español (`/`).
- Inglés: `/en/`.
- Sin librería externa — usar `src/i18n/ui.ts` + `utils.ts`.
- Cada `.mdx` de proyecto puede tener variante con sufijo: `aldea-savia.mdx` (es) + `aldea-savia.en.mdx` (en) **o** un solo archivo con campo `lang` y dos por proyecto. Decidir y mantener consistencia.
- `<LanguageSwitcher />` cambia entre rutas equivalentes, no redirige a home si falta traducción — muestra fallback con aviso.

---

## 11. Git y proceso

### 11.1 Branches
- `main` — estable, deployable. Protegido (idealmente).
- `feat/<scope>` — features nuevas.
- `fix/<scope>` — bugs.
- `chore/<scope>` — infra, deps, configs.
- `docs/<scope>` — solo documentación.

### 11.2 Commits — Conventional Commits

```
feat(hero): add MetaBalls WebGL background with reduced-motion fallback
fix(seo): correct hreflang on /en/ project pages
chore(deps): bump astro to 6.3.8
docs(design): document button variants
```

### 11.3 Pull Requests
- Título: el mismo formato del commit principal.
- Descripción debe incluir:
  - **What** — qué cambia.
  - **Why** — por qué (link a sección de PLAN/DESIGN si aplica).
  - **Test plan** — qué se probó (manual + automático).
  - Screenshots/GIFs si es UI.
- No mergear sin: `astro check` ok + `build` ok + Lighthouse preview ok (si UI).

### 11.4 Operaciones destructivas
- **Prohibido sin pedir confirmación al usuario:**
  - `git push --force` a `main`.
  - `git reset --hard`.
  - Borrar branches con cambios sin mergear.
  - Modificar `git config` global.
  - `npm install` que actualice major versions sin discutirlo.

### 11.5 Secretos
- Nunca commitear `.env`, `*.key`, credenciales.
- Variables sensibles en `.env` (gitignored) y en Vercel.
- Si por error se commitea un secreto: rotar inmediatamente + `git filter-repo` o equivalente.

---

## 12. Seguridad

- CSP via Astro 6 CSP API — política inicial estricta, permitir solo lo necesario.
- Sin scripts inline excepto los firmados por Astro.
- Formulario de contacto: validar input + protección antispam (honeypot + rate limit). Si usa un servicio externo (Formspree, Resend), documentar key en `.env`.
- Dependencias: `npm audit` antes de cada deploy. Vulnerabilidades high/critical bloquean merge.

---

## 13. Criterios de aceptación para "hecho"

Una tarea se considera completa cuando **todas** se cumplen:

1. `npm run astro check` pasa sin errores.
2. `npm run build` pasa sin errores ni warnings nuevos.
3. Cambio visualmente verificado en dev server (al menos un viewport mobile + desktop).
4. Lighthouse mobile en preview deploy ≥ 95 perf / 100 a11y / 100 SEO (si tocó páginas reales).
5. Documentación actualizada si cambió comportamiento (PLAN, DESIGN o este archivo).
6. Sin TODOs nuevos sin issue asociado.
7. PR con descripción completa y test plan.

---

## 14. Cuándo NO actuar sin consultar al usuario

- Cambiar el dominio del sitio.
- Cambiar el hosting (Vercel ↔ Netlify ↔ Cloudflare).
- Agregar dependencias > 30 KB minified.
- Romper compatibilidad de URLs públicas (redirects necesarios).
- Cambios en la paleta o tipografía base.
- Subir contenido real de clientes (logos, screenshots, métricas) sin permiso confirmado.
- Borrar `.mdx` de proyectos.
- Cambiar versión major de Astro, Tailwind, Node o React.

---

## 15. Glosario rápido

- **Isla:** componente con JS de cliente, renderizado fuera del flujo estático de Astro.
- **Eyebrow:** etiqueta pequeña sobre un título (ej. `// 03 — PROYECTOS`).
- **CRZR:** marca paralela de servicios. No es proyecto de portafolio. Aparece como CTA.
- **Workstation editorial:** concepto visual del sitio (ver [DESIGN.md §1](DESIGN.md)).
- **`prefers-reduced-motion`:** media query que indica que el usuario pidió menos animación. Respetarla siempre.
