# Plan de Portafolio — Antonio Cortazar Jimenez

> **Versión:** 1.0 — 2026-05-27
> **Objetivo doble:** (1) mostrar capacidad técnica para reclutadores y (2) capturar leads hacia los servicios comerciales (CRZR).
> **Estado del repo:** workspace vacío, scaffold anterior descartado. Partimos desde `npm create astro@latest`.

---

## 1. Resumen del perfil que vamos a vender

| Campo | Valor |
|---|---|
| Nombre | Antonio Cortazar Jimenez |
| Título | Ingeniero en Desarrollo de Software (estudiante, Tecmilenio) |
| Pitch corto | "Construyo productos web y móviles que cierran el bucle entre diseño, código e infraestructura." |
| Stack frontend | Astro, Next.js, Vue 3, React 19, TypeScript, Tailwind |
| Stack backend / infra | Node, Laravel, Spring Boot, AWS, Docker, Kubernetes, CI/CD |
| Diferenciador | Mezcla rara de soporte técnico + diseño + ventas + ingeniería |
| Proyectos reales | Aldea Savia, Koa Towers (inmobiliario), Pocky (PWA Firebase), OnixDashTI |
| Contacto | hola@antoniocortazar.dev · 81 3511 2848 · github.com/Antony-potato · linkedin.com/in/antoniocortazar |

Fuente del perfil: https://antony-potato.github.io/banco-de-ideas/perfil-profesional.html

---

## 2. Decisión de stack

### 2.1 Núcleo (sin discusión) — versiones actuales mayo 2026
- **Astro 6.3.8** (SSG) — Fonts API integrada, CSP API, Live Content Collections, build pipeline sobre Vite 7. Requiere **Node 22+**.
- **Tailwind CSS v4.3** — instalación vía `@tailwindcss/vite` (la integración nueva, ya no `@astrojs/tailwind`). Builds full ~5× más rápidos, incrementales 100× más rápidos. Configuración en CSS (`@theme`) en lugar de `tailwind.config.js`.
- **TypeScript** en `strict` — exigido por Content Collections.
- **Content Collections (Live)** — proyectos en `.md`/`.mdx` con frontmatter tipado vía `zod`.
- **Astro View Transitions** (`<ClientRouter />`) — navegación SPA-like entre proyectos.
- **Fonts API nativa de Astro 6** — autohospedaje de fuentes sin servicios externos.

### 2.2 Interactividad — recomendación sobre Framer Motion vs Lenis

**Diagnóstico:** Framer Motion y Lenis no son alternativas, resuelven problemas distintos.
- **Lenis** (~3 KB): solo smooth scroll. Cambia la sensación de scroll en toda la página.
- **Framer Motion** (~50 KB+, requiere React): animaciones declarativas de componentes (`<motion.div>`), gestures, layout transitions.

**Recomendación actualizada** (tras decidir el lenguaje visual estilo WorldQuant Foundry + ReactBits):

| Capa | Librería | Peso | Por qué |
|---|---|---|---|
| Smooth scroll global | **Lenis** | ~3 KB | Sensación premium sin acoplar a React |
| Animaciones on-scroll (text reveal, fade staggered, counters) | **GSAP 3 + ScrollTrigger** | ~35 KB | Lo que usa WorldQuant Foundry; control milimétrico y agnóstico de framework |
| Componentes WebGL ambientales (MetaBalls hero, beams, aurora) | **ReactBits** (`@appletosolutions/reactbits`) + **OGL** o **three** | 15–60 KB según efecto | El user pidió MetaBalls; cargar solo en islas `client:visible` |
| Micro-interacciones (hover, parallax suave, transitions) | **Tailwind v4 + CSS** puro | 0 KB | Lo más barato posible |
| Transiciones entre páginas | **Astro View Transitions** | 0 KB extra | Ya viene con Astro |
| Framer Motion / `motion` | **NO** (descartado) | — | GSAP cubre lo mismo agnóstico y ReactBits ya pesa lo suyo |

**Reglas duras sobre WebGL:**
1. MetaBalls y similares solo en islas `client:visible` o `client:idle` — nunca `client:load`.
2. Una sola escena WebGL activa por viewport (no dos canvas a la vez).
3. Si `prefers-reduced-motion`, sustituir por gradiente estático.
4. Si el dispositivo es de gama baja (DPR > 2 o GPU débil detectada), bajar resolución o saltar a fallback.

**Solo si una sección lo justifica** (filtro complejo de proyectos, formulario reactivo, toggle de tema) montamos una isla con **React 19**. No globalmente.

> **Regla:** que cada KB de JS justifique su existencia. El portafolio debe sacar ≥ 95 Lighthouse en mobile.

### 2.3 Otras dependencias
- **`astro-icon`** + sets de Iconify (`lucide`, `simple-icons`) — iconos sin instalar fuentes pesadas.
- **`@astrojs/sitemap`** + **`@astrojs/rss`** (si añades blog).
- **`@astrojs/mdx`** — para escribir casos de estudio con componentes embebidos.
- **`sharp`** (incluido en Astro) — optimización de imágenes vía `<Image />`.
- **`zod`** (incluido por Astro) — schema de Content Collections.

### 2.4 Hosting
- **Vercel** (preferido) o **Netlify** — CI/CD automático en `git push`, preview deploys por PR.
- Dominio personalizado: comprar `antoniocortazar.dev` o `antonycj.dev` (más memorable que el subdominio `*.vercel.app`).

---

## 3. Arquitectura de archivos propuesta

```
Portafolio/
├── astro.config.mjs
├── tsconfig.json
├── package.json
├── PLAN.md                     ← este archivo
├── README.md
│
├── public/
│   ├── favicon.svg
│   ├── og-default.png          ← imagen 1200×630 para Open Graph
│   ├── cv-antonio-cortazar.pdf ← descargable desde el hero
│   └── fonts/                  ← si self-hosting de fuentes
│
└── src/
    ├── content.config.ts       ← schema de Content Collections (Astro 5)
    │
    ├── content/
    │   ├── projects/
    │   │   ├── aldea-savia.mdx
    │   │   ├── koa-towers.mdx
    │   │   └── pocky.mdx
    │   └── (futuro) blog/
    │
    ├── layouts/
    │   ├── BaseLayout.astro    ← <head>, SEO, View Transitions, Lenis init
    │   └── ProjectLayout.astro ← layout para cada caso de estudio
    │
    ├── components/
    │   ├── ui/                 ← primitivos (Button, Badge, Card)
    │   │   ├── Button.astro
    │   │   ├── Badge.astro
    │   │   └── SectionTitle.astro
    │   ├── layout/
    │   │   ├── Navbar.astro
    │   │   ├── Footer.astro
    │   │   └── LanguageSwitcher.astro
    │   ├── sections/
    │   │   ├── Hero.astro
    │   │   ├── About.astro
    │   │   ├── Stack.astro
    │   │   ├── Projects.astro
    │   │   ├── Experience.astro
    │   │   ├── Services.astro      ← bloque CTA hacia CRZR
    │   │   ├── Testimonials.astro  ← opcional, alto impacto en venta
    │   │   └── Contact.astro
    │   └── islands/            ← solo lo que necesita JS de cliente
    │       ├── ThemeToggle.tsx
    │       ├── ContactForm.tsx
    │       └── ProjectFilter.tsx
    │
    ├── i18n/
    │   ├── ui.ts               ← strings es / en
    │   └── utils.ts            ← getLangFromUrl, useTranslations
    │
    ├── lib/
    │   ├── lenis.ts            ← init smooth scroll
    │   └── seo.ts              ← helpers de meta tags
    │
    ├── pages/
    │   ├── index.astro                 ← home en español (default)
    │   ├── proyectos/
    │   │   ├── index.astro             ← listado completo
    │   │   └── [slug].astro            ← detalle dinámico (Content Collections)
    │   ├── servicios.astro             ← landing puente hacia CRZR
    │   ├── contacto.astro
    │   ├── en/
    │   │   ├── index.astro
    │   │   ├── projects/index.astro
    │   │   ├── projects/[slug].astro
    │   │   └── services.astro
    │   ├── 404.astro
    │   └── rss.xml.ts                  ← si hay blog
    │
    ├── styles/
    │   └── global.css                  ← @import "tailwindcss"; tokens de tema
    │
    └── assets/                         ← imágenes optimizadas por Astro
        ├── projects/
        │   ├── aldea-savia/
        │   ├── koa-towers/
        │   └── pocky/
        ├── og/                         ← Open Graph por proyecto
        └── profile/
```

**Convenciones:**
- Componentes `.astro` por defecto. Solo `.tsx`/`.jsx` si **necesita** estado de cliente.
- Cada isla declara su directiva: `client:load` (rara), `client:idle`, `client:visible` (preferida), `client:media`.
- `content/projects/*.mdx` es la única fuente de verdad de cada proyecto — el listado y el detalle se generan desde ahí.

---

## 4. Secciones del home (orden + intención)

| # | Sección | Objetivo | Bloque de venta |
|---|---|---|---|
| 1 | **Hero** | Nombre + título + pitch + CTA primario (Ver proyectos) y secundario (Contacto / CV) | "Primera impresión" — debe cargar < 1 s |
| 2 | **About** | Quién soy, qué hago, qué busco. Foto profesional. | Construye confianza |
| 3 | **Stack** | Grid de tecnologías agrupado (Frontend / Backend / Infra / Especialidades) | Demuestra amplitud |
| 4 | **Proyectos destacados** | 3 casos: Aldea Savia, Koa Towers, Pocky. Cada uno como `<ProjectCard>` con thumbnail, stack, link a detalle | Núcleo del portafolio |
| 5 | **Experiencia** | Onix Living, Office Depot — bullet de logros, no de tareas | Validación social |
| 6 | **Servicios (CRZR)** | Banner / sección que dice: "¿Necesitas soporte técnico o un sitio web? Trabaja conmigo." → link externo a CRZR | **Conversión comercial** |
| 7 | **Certificaciones** | Lista compacta (AWS, IBM, EF SET, Figma) | Credibilidad |
| 8 | **Contacto** | Formulario corto + enlaces directos (email, LinkedIn, GitHub) | Captura final |
| 9 | **Footer** | Repetir contacto, copyright, link a fuente del perfil | — |

### 4.1 Detalle de cada proyecto (página individual)

Estructura del `.mdx`:
```yaml
---
title: "Aldea Savia"
slug: "aldea-savia"
summary: "Landing inmobiliaria para desarrollo residencial."
role: "Frontend Developer"
year: 2025
client: "Onix Living"
stack: ["Astro", "Tailwind", "Vercel"]
liveUrl: "https://aldeasavia.mx"
repoUrl: null
cover: "../../assets/projects/aldea-savia/cover.jpg"
gallery:
  - "../../assets/projects/aldea-savia/01.jpg"
  - "../../assets/projects/aldea-savia/02.jpg"
featured: true
order: 1
---

## Contexto
...

## Reto
...

## Solución
...

## Resultados
- Métrica 1
- Métrica 2
```

Componentes que ofrece la página de detalle: hero del proyecto con cover, metadatos (stack, año, rol, links), galería responsive, contenido MDX, navegación a anterior/siguiente proyecto, CTA al final.

---

## 5. Schema de Content Collections (`src/content.config.ts`)

```ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    summary: z.string().max(160),
    role: z.string(),
    year: z.number().int().min(2020).max(2100),
    client: z.string().optional(),
    stack: z.array(z.string()).min(1),
    liveUrl: z.string().url().nullable().optional(),
    repoUrl: z.string().url().nullable().optional(),
    cover: image(),
    gallery: z.array(image()).optional(),
    featured: z.boolean().default(false),
    order: z.number().int().default(99),
    lang: z.enum(["es", "en"]).default("es"),
  }),
});

export const collections = { projects };
```

> Validación en build time — si olvidas un campo o pones URL mal escrita, Astro falla la build.

---

## 6. Los 4 proyectos: tratamiento individual

### 6.1 ALDEA SAVIA — landing inmobiliaria
- **Tipo:** caso de estudio en `/proyectos/aldea-savia`.
- **Stack mostrado:** Astro, Tailwind, Vercel.
- **Ángulo de venta:** SEO + performance para captar leads inmobiliarios.
- **Activos a preparar:** cover 16:9, 3-4 screenshots desktop + 2 mobile, métrica (Lighthouse, tiempo de carga, leads/mes si se tiene).

### 6.2 KOA TOWERS — landing inmobiliaria
- **Tipo:** caso de estudio en `/proyectos/koa-towers`.
- **Ángulo de venta:** mismo cliente (Onix Living), demuestra capacidad de entregar múltiples activos. Diferenciador visual respecto a Aldea Savia para no parecer la misma plantilla.

### 6.3 POCKY — PWA con Firebase
- **Tipo:** caso de estudio en `/proyectos/pocky`.
- **Ángulo de venta:** muestra perfil técnico fuerte (PWA, sincronización Firebase, iOS/Android desde web, manifest, service workers).
- **Diferenciador:** único proyecto con producto interactivo — incluir demo en vivo o GIF / video corto autoplay muted.

### 6.4 CRZR — **no es proyecto, es la oferta de servicios**
- **Tratamiento:** sección `Servicios` en el home + página dedicada `/servicios` (y `/en/services`) que actúa de puente. **No aparece en la grilla de proyectos.**
- **Contenido de la sección:**
  - Título: "¿Necesitas soporte técnico o desarrollo web?"
  - Sub: "CRZR es mi marca de servicios para PyMEs y particulares."
  - 3 bullets de servicios (Soporte TI, Desarrollo web a medida, Mantenimiento).
  - Botón primario: "Ver servicios en CRZR" → link externo.
  - Botón secundario: "Cotizar por correo".
- **Por qué separarlo:** mantener el portafolio enfocado en credibilidad técnica; CRZR vende. Mezclarlos diluye ambos.

---

## 7. Estrategia de conversión / venta

| Principio | Aplicación concreta |
|---|---|
| **CTA por encima del fold** | Hero con dos botones: "Ver proyectos" + "Hablemos" (mailto o anchor a contacto) |
| **Prueba social temprana** | Logos de Onix Living / Office Depot debajo del hero (sección "Where I've worked") |
| **Jerarquía visual clara** | 1 acción primaria por sección. Botones primarios filled, secundarios outline |
| **Reducir fricción de contacto** | Email visible en footer + form corto (nombre, correo, mensaje). No pedir teléfono salvo en `/servicios` |
| **Especificidad** | En cada proyecto poner **resultados medibles**, no solo "hice un landing" |
| **Llamada final en cada página** | Detalle de proyecto termina con: "¿Te gustó? Cuéntame de tu proyecto →" |
| **Mobile-first** | 70 %+ del tráfico de reclutadores entra por móvil al click en LinkedIn |
| **Tiempo de carga** | Cada 100 ms de delay = ~7 % menos conversión. Lighthouse mobile ≥ 95 |

---

## 8. SEO, accesibilidad y performance — checklist

### SEO
- `<title>` y `<meta description>` únicos por página (component `<SEO>` reutilizable).
- Open Graph + Twitter cards con imagen 1200×630 por proyecto.
- Sitemap automático con `@astrojs/sitemap`.
- Schema.org `Person` en home, `CreativeWork` en cada proyecto.
- URLs limpias: `/proyectos/aldea-savia`, no `?id=1`.
- `hreflang` entre `/` y `/en/` para i18n.
- `robots.txt` permitiendo todo + ruta del sitemap.

### Accesibilidad
- Contraste mínimo AA (4.5:1 texto normal, 3:1 títulos grandes).
- Focus visible siempre — no eliminar `outline` sin sustituto.
- `aria-label` en links que solo tienen icono.
- `prefers-reduced-motion`: Lenis y animaciones deben respetarlo (desactivar smooth scroll si está activo).
- Skip-to-content link en navbar.
- Imágenes con `alt` descriptivo, decorativas con `alt=""`.

### Performance
- `<Image />` de Astro con `format="avif"` y `loading="lazy"` (excepto hero).
- Self-host de fuentes con `font-display: swap` o usar fuentes del sistema.
- CSS crítico inline (Astro lo hace por defecto).
- Sin Google Analytics tradicional → usar **Plausible** o **Umami** (privacidad + ligero).
- Bundle de JS objetivo: **< 50 KB** total en home.
- Lighthouse mobile objetivo: Performance ≥ 95, A11y 100, SEO 100.

### Calidad de código
- ESLint + Prettier configurados.
- `astro check` en CI (type-checking de plantillas).
- Husky + lint-staged opcional, pero útil.
- Conventional Commits.

---

## 9. Internacionalización (i18n)

Decisión: **enrutamiento por carpeta** (`/` español por defecto, `/en/` inglés). Sin librería externa.

- `src/i18n/ui.ts` con diccionarios `es` / `en`.
- Helpers `getLangFromUrl(url)` y `useTranslations(lang)` en `src/i18n/utils.ts`.
- `<LanguageSwitcher />` en navbar que cambia entre rutas equivalentes.
- Content Collections: campo `lang` en frontmatter; filtrar al listar.

---

## 10. Roadmap de implementación (orden sugerido)

| Fase | Entregable | Tiempo estimado |
|---|---|---|
| **0. Setup** | `npm create astro@latest` con template `portfolio`, Tailwind v4, integraciones (`mdx`, `sitemap`, `astro-icon`), tsconfig estricto | 1 h |
| **1. Layout base** | `BaseLayout.astro` con `<head>` SEO, View Transitions, Lenis init, Navbar + Footer + Theme toggle | 3 h |
| **2. Sistema de diseño** | Tokens en `global.css` (colores, espacios, tipografía), componentes `Button`, `Badge`, `SectionTitle` | 2 h |
| **3. Home (sin contenido real)** | Maquetar las 9 secciones con datos placeholder | 4 h |
| **4. Content Collections** | Schema + los 3 `.mdx` con contenido placeholder | 1 h |
| **5. Página de proyecto** | `[slug].astro` con `ProjectLayout`, galería, navegación entre proyectos | 3 h |
| **6. Contenido real** | Redactar y montar Aldea Savia, Koa Towers, Pocky con activos definitivos | 4 h |
| **7. Sección Servicios + página CRZR** | Bloque en home + `/servicios` con CTA al sitio externo | 2 h |
| **8. i18n** | Duplicar rutas en `/en/`, montar `<LanguageSwitcher />` | 3 h |
| **9. Pulido** | Animaciones (Lenis + motion), micro-interacciones, dark mode, 404 personalizado | 4 h |
| **10. SEO + analytics** | OG por proyecto, sitemap, schema.org, Plausible/Umami | 2 h |
| **11. Deploy** | Vercel + dominio personalizado, preview deploys | 1 h |
| **Total** | | **~30 h** distribuidas en 2-3 semanas |

---

## 11. Comando inicial

```bash
# Requiere Node 22+
npm create astro@latest -- --template portfolio
```

Después del scaffold (Astro 6 + Tailwind 4):

```bash
# Integraciones oficiales
npx astro add tailwind mdx sitemap react

# Iconos + utilidades
npm i astro-icon @iconify-json/lucide @iconify-json/simple-icons

# Animación
npm i lenis gsap

# WebGL / ReactBits (islas decorativas)
npm i @appletosolutions/reactbits ogl
```

> Nota Tailwind v4: tras `astro add tailwind` la config vive en `src/styles/global.css` con `@import "tailwindcss";` y bloques `@theme { ... }`. No habrá `tailwind.config.js`.

---

## 12. Decisiones pendientes que necesito confirmes

1. **Dominio:** ¿compras `antoniocortazar.dev` u otro? Esto define metadata OG.
2. **Modo oscuro:** ¿default dark, default light, o respeta sistema? (Recomiendo: respeta sistema + toggle persistente).
3. **Idioma por defecto:** asumí español. ¿Confirmas?
4. **Lenis solo, o Lenis + motion?** Recomiendo Lenis + motion (vanilla). Si quieres bundle 0 extra, solo Lenis y animaciones puras con CSS.
5. **Blog:** ¿lo incluimos en v1 o lo dejamos como `/blog` futuro?
6. **Logos de Onix Living / Office Depot:** ¿tienes permiso para mostrarlos? Si no, omitimos la "prueba social temprana".
7. **CRZR:** ¿ya existe el sitio? Necesito la URL final para el link.
8. **Testimonios:** ¿tienes alguno (cliente, manager, profesor)? Agregan mucho valor de venta.

---

## 13. Riesgos y cómo mitigarlos

| Riesgo | Mitigación |
|---|---|
| Bundle se infla con Framer Motion + React | Solo islas selectivas, medir con `astro build --analyze` |
| Aldea Savia y Koa Towers se ven idénticos | Variar paleta y composición de las cards; usar dos covers visualmente distintas |
| CRZR diluye el mensaje técnico | Una sola sección, claramente etiquetada como "Servicios", no mezclar con proyectos |
| Contenido placeholder se queda en producción | Marcar TODOs visibles + checklist pre-deploy |
| Performance se degrada al agregar animaciones | Presupuesto de JS < 50 KB; revisar Lighthouse en cada PR |

---

**Siguiente paso:** confirmar las 8 decisiones del bloque 12 y dar luz verde para empezar la Fase 0 (setup).
