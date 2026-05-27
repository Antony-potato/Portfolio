# DESIGN.md — Línea visual del portafolio

> **Versión:** 1.0 — 2026-05-27
> **Tono:** editorial-brutalista con calidez lo-fi.
> **Inspiración directa:** ChainGPT Labs (estructura), Teenage Engineering TP-7 (tipografía y metadata), WorldQuant Foundry (animaciones), arte lo-fi anime (atmósfera del hero).
> Cualquier decisión visual nueva se compara contra este documento antes de mergear.

---

## 1. Concepto

**"Workstation editorial"** — el sitio se siente como una hoja técnica de producto + un escritorio de ingeniero. Combinamos:

- **Brutalismo técnico**: bordes visibles, etiquetas tipo packaging, grids explícitos, datos tabulares, numeración 01–09.
- **Calidez lo-fi**: una sola capa de atmósfera (WebGL ambiental o ilustración en hero) que rompe la frialdad y le da personalidad.
- **Acento naranja**: una sola voz cromática que dirige la atención. Todo lo demás es neutro.

No es minimalismo plano ni cyberpunk recargado. Es **editorial técnico con un guiño humano**.

---

## 2. Paleta de color

### 2.1 Tokens base

```css
@theme {
  /* Neutrales — base del 90 % de la UI */
  --color-ink-950: #0a0a0b;   /* fondo dark / texto sobre claro */
  --color-ink-900: #111114;
  --color-ink-800: #1a1a1f;
  --color-ink-700: #26262d;
  --color-ink-500: #6b6b75;   /* texto secundario */
  --color-ink-300: #b8b8be;
  --color-ink-100: #e8e6e1;   /* "cream" base */
  --color-ink-50:  #f4f2ed;   /* fondo light / "paper" */

  /* Acento — naranja TE / ChainGPT */
  --color-accent-500: #ff6a1a;  /* principal */
  --color-accent-600: #e25510;  /* hover */
  --color-accent-400: #ff8a4d;  /* highlight suave */
  --color-accent-100: #ffe1cf;  /* fondos sutiles */

  /* Acento secundario — solo para piezas WebGL / glow del hero */
  --color-glow-cyan: #4cc9ff;
  --color-glow-magenta: #ff3d8a;

  /* Semánticos */
  --color-success: #2fbf71;
  --color-warning: #f2b134;
  --color-danger:  #ef4444;
}
```

### 2.2 Regla del 60-30-10

- **60 %** neutros (`ink-50` / `ink-950` según modo).
- **30 %** un segundo neutro de soporte (`ink-100` cards, `ink-900` paneles).
- **10 %** naranja. Cualquier elemento naranja debe responder a una intención: CTA, badge, número, link activo.

> Si un mock tiene tres elementos naranja en el mismo viewport sin jerarquía, **falla**.

### 2.3 Modo claro vs oscuro

- **Default:** respeta `prefers-color-scheme`. Toggle persistente en `localStorage`.
- **Light:** fondo `--color-ink-50` (cream/paper), texto `--color-ink-950`. Mood: hoja técnica / packaging TE.
- **Dark:** fondo `--color-ink-950`, texto `--color-ink-100`. Mood: workstation lo-fi.
- El naranja **no cambia** entre modos.
- Los WebGL ambientales se ven mejor en dark — bajar opacidad en light.

---

## 3. Tipografía

### 3.1 Familias

| Rol | Fuente | Peso | Fallback |
|---|---|---|---|
| **Display** (H1–H2, eyebrow) | **Geist** o **Inter Display** | 700–900 | `system-ui, sans-serif` |
| **Body** (párrafos, UI) | **Geist** o **Inter** | 400–600 | `system-ui, sans-serif` |
| **Mono** (eyebrows, labels, metadata, números 01/02/, código) | **JetBrains Mono** o **Geist Mono** | 400–600 | `ui-monospace, SFMono-Regular, monospace` |

Se sirven con la **Fonts API de Astro 6** (autohospedaje, sin Google Fonts en runtime).

### 3.2 Escala (mobile-first)

```css
--text-eyebrow:  0.75rem  / 1.2  / mono  / +0.08em
--text-body-sm:  0.875rem / 1.5  / sans  / 0
--text-body:     1rem     / 1.6  / sans  / 0
--text-body-lg:  1.125rem / 1.6  / sans  / 0
--text-h4:       1.25rem  / 1.3  / sans 600
--text-h3:       1.75rem  / 1.2  / sans 700
--text-h2:       2.5rem   / 1.1  / sans 800
--text-h1:       4rem     / 0.95 / sans 800 / -0.02em
--text-display:  clamp(4rem, 12vw, 9rem) / 0.9 / sans 900 / -0.04em
```

### 3.3 Reglas de uso

- **Display** siempre con `letter-spacing: -0.02em` o más cerrado. Inspiración: el "PORT_FOLIO" pixel-stretched de ChainGPT y el "TP-7" cortado por el producto.
- **Eyebrows** (etiquetas pequeñas tipo `// 01 — PROYECTOS`) en mono, uppercase, tracking `+0.08em`, color `ink-500`.
- **Body** nunca por encima de **70ch** de medida.
- Números grandes (estadísticas, contadores) siempre en **sans 800** con tabular-nums.
- Subrayado solo en links de párrafo. Botones sin subrayado.

---

## 4. Grid y espaciado

### 4.1 Grid

- **12 columnas** desktop, **6** tablet, **4** mobile.
- **Gutter:** 24 px desktop, 16 px mobile.
- **Container:** `max-width: 1440px`, padding lateral `clamp(1rem, 4vw, 4rem)`.
- **Bordes visibles** (estilo ChainGPT): cada sección puede dibujar líneas guía sutiles en `--color-ink-300` con opacidad 0.4. Activarlas como decoración, no como ruido.

### 4.2 Espaciado vertical entre secciones

| Contexto | Spacing |
|---|---|
| Mobile | 80 px |
| Tablet | 120 px |
| Desktop | 160 px |

### 4.3 Escala de espaciado (Tailwind tokens)

Usar la escala estándar de Tailwind v4 (4 px base). Evitar valores arbitrarios excepto en secciones hero.

---

## 5. Componentes — patrones visuales

### 5.1 Card de proyecto (estilo ChainGPT)

```
┌─────────────────────────────────────┐
│ [TAG: INMOBILIARIO]                 │
│                                     │
│        LOGO / COVER                 │
│                                     │
├──────────┬──────────────────────────┤
│ Stack    │ Año                      │
│ Astro    │ 2025                     │
├──────────┼──────────────────────────┤
│ Rol      │ Cliente                  │
│ Frontend │ Onix Living           →  │
└──────────┴──────────────────────────┘
```

- Borde 1 px `--color-ink-300` (light) / `--color-ink-700` (dark).
- Divisores internos del mismo color.
- Hover: borde pasa a `--color-accent-500`, flecha `→` se desplaza 4 px a la derecha, cover hace zoom 1.03 con `transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1)`.
- Sin sombras pesadas. Como mucho `0 1px 0` para definir el borde inferior en hover.

### 5.2 Hero

- **Layout:** título display ocupando 2/3 del ancho + bloque de metadatos a la derecha (rol, ubicación, año en mono).
- **Fondo:** uno de estos tres modos, configurable:
  - `metaballs` — canvas WebGL con `MetaBalls` de ReactBits, baja opacidad (0.4–0.6), color `accent-500` y `glow-cyan`.
  - `aurora` — gradiente animado CSS (alternativa ligera).
  - `static` — imagen lo-fi anime estilo workstation, blur sutil, fallback siempre disponible.
- **CTA dual:** "Ver proyectos" (primario filled naranja) + "Hablemos" (secundario outline).
- **Eyebrow numerada:** `// 00 — PORTFOLIO 2026`.

### 5.3 Strip de metadata (estilo TP-7)

Línea horizontal con etiquetas pequeñas separadas por divisores:

```
$AVAILABLE    NOW HIRING    DESIGNED    OF A KIND    CDMX    DEV
```

Mono, uppercase, `--color-ink-500`. Se usa debajo del hero y en footers de proyecto.

### 5.4 Botones

| Variante | Fondo | Texto | Borde |
|---|---|---|---|
| Primary | `accent-500` | `ink-950` | — |
| Primary hover | `accent-600` | `ink-950` | — |
| Secondary | transparente | `ink-950` (light) / `ink-100` (dark) | `ink-300` / `ink-700` |
| Secondary hover | `ink-100` | `ink-950` | `ink-950` |
| Ghost | transparente | actual | — |

- Radio: **4 px** (esquinas casi rectas, brutalista).
- Padding: `0.875rem 1.5rem` (desktop), `0.75rem 1.25rem` (mobile).
- Sin sombras. Foco: ring `2px` `--color-accent-500` con offset 2.

### 5.5 Badges

- Pill `radius: 9999px`, `padding: 0.25rem 0.75rem`.
- Mono, uppercase, tracking `+0.06em`.
- Fondo `ink-100` / `ink-800`, texto `ink-700` / `ink-300`.
- Variante "destacado": fondo `accent-100`, texto `accent-600`.

### 5.6 Section title

```
// 03 — PROYECTOS
Trabajo seleccionado
```

- Eyebrow mono uppercase numerada arriba.
- Título sans bold debajo.
- Opcional: descripción `body-lg` `ink-500` a la derecha o debajo.

---

## 6. Animación — principios

### 6.1 Reglas

1. **Una animación por intención.** Si no aporta jerarquía, ritmo o feedback, fuera.
2. **Easings consistentes.** Usar 2 curvas:
   - `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)` — entradas, reveals.
   - `--ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1)` — transitions, hovers.
3. **Duraciones:**
   - Micro (hover, focus): 150–250 ms.
   - Medio (reveal, accordion): 400–700 ms.
   - Macro (hero, page transition): 700–1200 ms.
4. **Stagger:** delay entre hijos 60–120 ms. Más de 150 ms se siente lento.
5. **`prefers-reduced-motion`:** sustituir cualquier transform/scroll smooth por aparición instantánea.

### 6.2 Patrones (estilo WorldQuant Foundry)

| Patrón | Implementación | Cuándo |
|---|---|---|
| **Text reveal** línea por línea | GSAP + SplitText (o clip-path en CSS) | Títulos de sección, frase del hero |
| **Fade-up staggered** de cards | GSAP ScrollTrigger + `y: 24, opacity: 0` | Grids de proyectos, stack, certs |
| **Counter animation** | GSAP `to({ value: target })` con `tabular-nums` | Métricas en cards (ej. "+700% growth") |
| **Smooth scroll** | Lenis (`lerp: 0.1`) | Global, toda la página |
| **Parallax sutil** | Lenis `data-speed` + `transform: translateY()` | Imágenes de cover, no en texto |
| **Marquee horizontal** | CSS `@keyframes` puro o `motion-path` | Strip de tecnologías o testimonios |
| **Page transition** | Astro View Transitions con `transition:name` | Click en proyecto → detalle |
| **WebGL ambiental** | MetaBalls ReactBits en isla `client:visible` | Solo hero, una sola escena |

### 6.3 Anti-patrones

- ❌ Animar todo lo que entra en viewport — agota.
- ❌ Parallax en texto largo — rompe lectura.
- ❌ Carrousels autoplay sin pausa.
- ❌ Cursores custom complejos en mobile.
- ❌ Loaders artificiales para sitios estáticos rápidos.

---

## 7. Iconografía

- **Lucide** vía `astro-icon` para UI (flechas, social, controles).
- **Simple Icons** para logos de stack (Astro, React, AWS, etc.).
- Tamaños base: 16, 20, 24 px. `stroke-width: 1.5` por defecto.
- Color: hereda `currentColor`. Activos en `accent-500` solo cuando es ancla visual.

---

## 8. Imágenes y media

### 8.1 Tratamiento

- **Covers de proyecto:** ratio 16:10 desktop, 4:5 mobile. Formato `avif` con fallback `webp`.
- **Galería de proyecto:** masonry o grid 2-col asimétrico.
- **Foto personal:** una sola en About, blanco y negro, contraste alto. Evitar selfie casual.
- **Lo-fi anime art:** solo en hero (modo `static`) o como decoración pequeña en 404. Tratada con blur sutil (`backdrop-filter: blur(20px)` sobre overlay) para que no compita con el texto.

### 8.2 OG images

- 1200×630 px.
- Plantilla: fondo `ink-950` o `ink-50`, título display, eyebrow mono, logo en esquina.
- Generadas con `satori` o manualmente en Figma.

---

## 9. Microcopy y voz

- **Idioma default:** español neutro mexicano. Inglés disponible en `/en/`.
- **Tono:** directo, técnico, sin marketing inflado. Evitar "transformamos negocios", "soluciones disruptivas".
- **Verbos:** primera persona. "Construyo", "Lidero", no "He construido proyectos donde…".
- **Números siempre.** "Reduje el bundle 40 %" > "Optimicé el bundle".
- **CTA:** verbo en imperativo, máx 3 palabras. "Ver proyectos", "Hablemos", "Cotizar ahora".

---

## 10. Checklist visual antes de mergear

- [ ] No hay más de una región con WebGL activa.
- [ ] Naranja solo en CTAs y elementos de jerarquía intencional.
- [ ] Contraste AA en todo el texto (verificar con axe / Lighthouse).
- [ ] Tipografía display tiene tracking negativo y line-height < 1.0.
- [ ] Eyebrows numeradas en mono uppercase.
- [ ] Bordes visibles consistentes (1 px, sin sombras de relleno).
- [ ] Hover de card mueve flecha y cambia borde a naranja.
- [ ] `prefers-reduced-motion` desactiva Lenis y reveals.
- [ ] OG image generada para la página.
- [ ] Mobile no muestra el WebGL en gama baja (fallback estático).

---

## 11. Moodboard — referencias

| Ref | Qué tomar |
|---|---|
| **ChainGPT Labs Portfolio** | Grid de cards con metadata tabular, monospace heading "PORT_FOLIO" estirado, badges de categoría, números grandes |
| **Teenage Engineering TP-7** | Strip horizontal de metadata, display gigante cortado por imagen, paleta cream + orange |
| **WorldQuant Foundry "Why"** | Numeración 01/02/03 + text reveal en scroll + staggered cards |
| **Arte lo-fi anime (workstations)** | Atmósfera del hero, fondo del 404, paleta cyan/magenta como guiño en WebGL |
| **ReactBits MetaBalls** | Componente WebGL ambiental del hero en modo `metaballs` |
