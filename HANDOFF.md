# Traspaso de sesión — Portafolio Antonio Cortazar

Fecha: 2026-11-10. Resume todo lo hecho para que otra sesión siga sin releer la conversación.

## 1. Proyecto

- Repo: `https://github.com/Antony-potato/Portfolio.git`. Cuenta de `gh`: `Antony-potato`.
- Dos máquinas:
  - **Windows** (donde se hizo esto): `C:\Users\anton\Desktop\proyectos\personal\portfolio_personal\Portfolio`
  - **Mac**: `/Users/andiani/Desktop/proyectos/personal/portafolio`
- Stack: Astro 7, Tailwind 4, TypeScript estricto, GSAP + ScrollTrigger + SplitText, Lenis, WebGL puro (`src/lib/hero-gl.ts`). Sin React. Español en `/`, inglés en `/en`.
- Reglas: leer `AGENTS.md` (obligatorio) y `DESIGN.md` (ver §0.1 y §0.2, lo más nuevo). Antes de dar algo por hecho: `npx astro check` + `npm run build` + revisar escritorio y móvil. No cambiar paleta ni tipografía base sin preguntar. No commitear sin que el usuario lo pida.
- Local: `npm run dev` → `http://localhost:4321`. Sin `.env`: el formulario cae a WhatsApp y no carga analítica (esperado).

## 2. Estado de git

- Rama: **`feat/limpieza-home`**, en GitHub. Historia:
  - `5068e12` CV descargable por idioma (venía de `feat/cv-download`, solo estaba en Windows).
  - `a0f4e7c` contenido de Pocky actualizado (es/en).
  - `d3921a8` escaparate + loader + menú (Windows).
  - `fe25ff7` limpieza v2.1 (Mac), fusionada con un merge commit.
- En la fusión: hero, SectionTitle, Sobre mí, certificaciones y footer quedaron con la **versión de la Mac** (la que el usuario ya aprobó), con Sobre mí adaptado a la API del CV de esta rama (`cvPath(lang)`). Menú, escaparate, `ProjectCard`, loader y `global.css` quedaron con la versión de Windows (`global.css` usa la máscara del hero de la Mac).
- Sin subir a propósito: `.claude/settings.local.json` (configuración local de Windows).
- **En la Mac**: la rama local ya tiene `fe25ff7`; basta con `git pull` (fast-forward). Si quedó algo sin commitear allá, guardarlo antes con `git stash -u`.

## 3. Hecho

### 3.1 Limpieza del home (v2.1, `DESIGN.md §0.1`)
- Home con 4 secciones: `Hero → Proyectos → Sobre mí → Contacto`.
- Sin números 01–06 en secciones, nav ni contacto. `SectionTitle` ya no tiene prop `index`; título `clamp(2rem,4.5vw,4rem)`.
- Hero: un solo CTA ("Ver proyectos"); sin eyebrow `// 00`, sin franja Rol/Base/Enfoque, sin "Scroll", sin WhatsApp. Metaballs al 32 % (50 % en oscuro) con `mask-image` hacia abajo (`global.css`, `[data-gl]` / `[data-gl-wrap]`).
- Sobre mí compacto (versión de la Mac): foto, título, cuerpo, botón de CV, 4 cifras pequeñas y certificaciones como lista con ícono. Datos en `getCertifications()` de `src/lib/certifications.ts` (todas con `url: "#"` = placeholders).
- Se borró `Certifications.astro`. Clientes se movió a `/servicios` y `/en/services`. Servicios ya no está en el home.
- Footer: sin wordmark gigante, sin "Astro 7 · GSAP · WebGL", sin WhatsApp repetido.
- `animations.ts`: se quitaron `stackCards()` y `data-wordmark`.

### 3.2 Escaparate, loader y menú (v2.2, `DESIGN.md §0.2`)
El usuario aclaró el alcance: de **ksenpanchenko.com** solo le gustó **cómo muestra los proyectos**; de **douglus.co**, la **animación de carga e inicio** y el **menú**. Se copió la mecánica, no el aspecto.

- **Proyectos** (`src/components/sections/Projects.astro`, script incluido en el componente):
  - Escritorio (`lg+`): contenedor de `100svh + n × 75svh` con bloque `sticky`. Izquierda: título, lista 01–05 (botones; clic = scroll a la mitad del tramo de ese proyecto, usa `window.__lenis.scrollTo`), detalle del activo (meta, resumen, stack, "Ver caso") y contador gigante que rueda (`--i`). Derecha: portadas apiladas; la activa se revela con `clip-path` según dirección (`data-dir`), paneo leve con `--p`. Curva `cubic-bezier(0.87,0,0.13,1)`. Los inactivos llevan `inert`.
  - Va fuera de `gsap.matchMedia`: con reduced-motion también cambia el proyecto (sin transición). Se inicia en `astro:page-load` y se limpia en `astro:before-swap`.
  - Móvil/tablet: carrusel horizontal con `scroll-snap` usando `ProjectCard` compacta (props `href, title, summary, category, year, client, cover`).
- **Loader** (`src/components/layout/Loader.astro`, se activa con `<BaseLayout loader>` solo en `index.astro` y `en/index.astro`):
  - Un script inline, antes del markup, pone `html[data-loader]` solo si: carga completa (`document.readyState === "loading"`; el ClientRouter lo re-ejecuta al navegar y ahí no aplica), primera vez en la sesión (`sessionStorage.intro`) y sin reduced-motion. Red de seguridad: se quita solo a los 9 s.
  - Pantalla `.inverse` con el logo AC (`/logo-ac.svg` como `mask`) partido en 6 franjas que entran desfasadas y "titilan", nombre que sube desde máscara, barra + % (mínimo 1,5 s, espera en 90 % a `document.fonts.ready`). Sale con una banda del color de la página: línea horizontal → se abre en vertical (WAAPI, sin GSAP).
  - Mientras dura (`global.css`): sin scroll, intro CSS del hero en pausa (`animation-play-state`), nav oculto. `lenis.ts` hace `stop()` si hay loader; el loader hace `start()` al terminar.
  - Excepción consciente al anti-patrón de loaders (§6.3): retrasa el LCP en la primera visita.
- **Menú** (`src/components/layout/Navbar.astro`):
  - El nav ya no tiene enlaces sueltos: logo, idioma, tema, "Hablemos" y botón "Menú" (centrado en escritorio, a la derecha en móvil). Líneas que se cruzan + etiqueta que rueda a "Cerrar".
  - `<dialog>` modal (focus trap, Esc, clic fuera cierra). Animado con la clase `.is-open` (transiciones = cierre gratis; `close()` a los 800 ms). Dentro hay una copia del botón en la misma posición exacta, que hace de "Cerrar".
  - Fondo `ink-950/90`, panel siempre claro (clase `.paper` en `global.css`) a la derecha con enlaces gigantes que suben escalonados, punto en la página actual, pie con email/WhatsApp/LinkedIn, reloj de Cancún e idioma.
  - Escritorio: a la izquierda, vista previa por enlace (hover/foco): imagen en gris que se abre desde el centro + 3 palabras con entrada 3D. Imágenes: Proyectos = portada de Aldea Savia, Sobre mí = retrato, Servicios = portada de cRZR tech, Contacto = bloque naranja. Palabras en `src/i18n/ui.ts` → `menu.words.*` (es/en; **las inventé, validar con el usuario**).

### 3.3 Verificación hecha
- Tras la fusión se repitieron `astro check` y `build`, más capturas del hero y de Sobre mí.
- `astro check`: 0 errores. `npm run build`: OK (los avisos `MODULE_LEVEL_DIRECTIVE` vienen de los `.mdx`, no se tocaron). JS de `/` muy por debajo de 80 KB.
- Capturas con Chrome headless por CDP (no había herramienta de navegador en la sesión; script de Node sin dependencias): escritorio 1440×900 en claro y oscuro, móvil 390×844 (sin scroll horizontal; botones Menú/Cerrar alineados al píxel), `/en`, `/servicios`, reduced-motion (sin loader, el escaparate sí cambia), navegación con el ClientRouter (sin loader, el escaparate se reinicia), clic en la lista, foco en el menú y Esc. Sin errores en consola.

### 3.4 Una sola página, hero nuevo, blanco y Switzer (v2.3, `DESIGN.md §0.3`, 2026-11-11, Mac)
Feedback del usuario al ver v2.2 en local: el loader tardaba y no decía "Bienvenido a mi portafolio" (sí le gustó que se abra desde el centro), al terminar "seguía cargando", las secciones en páginas aparte se sentían raras, las imágenes del menú/escaparate no cargaban, quería de vuelta la banda de certificaciones y "Gracias por su confianza", y no le gustaban el fondo beige ni la fuente. Referencia nueva para hero y fuente: paulkalkbrenner.net.

- Home con todo: Hero → Proyectos → Clientes → Servicios → Sobre mí → Certificaciones → Contacto. Menú, footer y "Hablemos" van a anclas; `/servicios`, `/contacto` y sus pares en inglés redirigen (`astro.config.mjs`). Se borraron esas 4 páginas.
- Scroll a secciones: listener único en `BaseLayout.astro`.
- Hero tipográfico centrado con la ficha del pato (`Hero.astro`); sin metaballs.
- Loader corto (~2 s) con el saludo y cortina desde el centro (`Loader.astro`, `data-loader="open"`).
- Fondo blanco y Switzer (Fontshare). La fuente de la referencia (ABC Diatype, Dinamo) es de pago: Switzer es el sustituto libre.
- Banda de certificaciones restaurada (`Certifications.astro`); lista de Sobre mí quitada.
- Portadas del escaparate, retrato y vistas previas del menú se piden antes de mostrarse.
- Verificado: `astro check` 0 errores, `npm run build` OK, capturas de escritorio/móvil/oscuro. **No** se pudo ver el movimiento en vivo (el panel del navegador estaba oculto y congela animaciones): falta que el usuario confirme loader, scroll del menú y transiciones del escaparate.

### 3.5 Color por proyecto, TechText, tarjeta de contacto y Pocky 3D (v2.4, `DESIGN.md §0.4`, 2026-11-11, Mac)
- Escaparate: se corrigió la portada gris (regla `[data-dir=up]` le ganaba a `.is-active`), la revelación pasó a WAAPI con `transform`, y el fondo cambia al color de marca del proyecto activo (`accent`/`accentInk` en los `.mdx`; el nav toma el mismo tema).
- Sin botón "Ver todos los proyectos". Certificaciones dentro de Sobre mí. Foto a color.
- Hero con TechText (`src/lib/tech-text.ts`, port sin React del componente de React Bits).
- Tarjeta de contacto en `/tarjeta` y `/en/card` con vCard (`src/pages/antonio-cortazar.vcf.ts`), QR (`lean-qr`), compartir y NFC. Dependencias nuevas: `lean-qr` y `sharp`.
- Pocky: portada = captura de escritorio que mandó el usuario; `isla-detalle.webp` es un recorte de esa misma captura (el panel del navegador no captura escritorio a buena resolución); `isla-movil.webp` es una captura nueva de pocky-next.vercel.app. **No** se regeneró `public/og/pocky.png` (sigue con la versión 2D).
- Ojo en local: si se cambia `src/content.config.ts` con el dev server corriendo, a veces `.astro/data-store.json` queda con el esquema viejo (los campos nuevos llegan vacíos). Se arregla borrando ese archivo y reiniciando `npm run dev`.
- Sin verificar en vivo (panel oculto): suavidad del scroll, transiciones de color y el efecto del hero en movimiento continuo. NFC y "Guardar contacto" hay que probarlos en un teléfono real.

## 4. Pendiente / ideas no hechas
- El usuario no ha visto el resultado en vivo; esperar su feedback del loader, el menú y el escaparate.
- Validar los textos de `menu.words.*` y la imagen de Contacto en el menú.
- Opcionales que quedaron fuera: cursor con etiqueta "Ver caso" sobre el escaparate; contador dibujado con puntos (Canvas 2D, Bayer); interruptores de movimiento/sonido.
- Del plan anterior, el usuario descartó (solo quería proyectos de ksenpanchenko): franja de datos bajo el hero, frase de pausa, servicios en 3 tarjetas en el home, banda inclinada de clientes.
- Certificaciones: cambiar los `url: "#"` por links reales en `src/lib/certifications.ts`.
- Lighthouse en preview deploy no se corrió (no hay preview); el loader va a bajar el LCP de la primera visita. Si pesa, bajar `MIN` en `Loader.astro`.
- Hacer PR de `feat/limpieza-home` → `main` cuando el usuario lo apruebe.

## 5. Otras notas
- **flow-mcp** (solo en la Mac): fork `https://github.com/Antony-potato/flow-mcp` en `~/flow-mcp`; proyecto de Flow "Portafolio Antonio Cortazar". Imágenes = 0 créditos; video cuesta créditos → decir el costo y pedir OK antes. Faltan `ffmpeg` y `whisper-cpp` (no hay Homebrew). `npm audit` del fork marca 11 vulnerabilidades sin tocar. No editar `~/.claude.json` sin permiso.
- El MCP `shadcn` falla al conectar (timeout); no se usa.
- El plugin ponytail sugiere configurar su statusline; se ofreció y no se ha respondido.
