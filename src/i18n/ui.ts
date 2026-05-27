export const languages = {
  es: "ES",
  en: "EN",
} as const;

export const defaultLang = "es";

export type Lang = keyof typeof languages;

export const ui = {
  es: {
    "nav.home": "Inicio",
    "nav.projects": "Proyectos",
    "nav.about": "Sobre mí",
    "nav.services": "Servicios",
    "nav.contact": "Contacto",

    "hero.eyebrow": "// 00 — PORTFOLIO 2026",
    "hero.title": "Construyo productos web que cierran el bucle entre diseño, código e infraestructura.",
    "hero.subtitle": "Ingeniero en desarrollo de software — Frontend, PWA, DevOps. Basado en México.",
    "hero.cta.primary": "Ver proyectos",
    "hero.cta.secondary": "Hablemos",

    "strip.available": "DISPONIBLE",
    "strip.location": "MÉXICO",
    "strip.year": "2026",
    "strip.role": "FULLSTACK DEV",
    "strip.signal": "BUILD MODE",

    "about.eyebrow": "// 01 — SOBRE MÍ",
    "about.title": "Diseño y construyo, no solo programo.",
    "about.body": "Soy Antonio Cortázar — estudiante de Ingeniería en Desarrollo de Software (Tecmilenio) con experiencia mezclando soporte técnico, diseño, ventas e ingeniería. Construyo dashboards internos, landings inmobiliarias y PWAs en producción.",
    "about.cta": "Descargar CV",

    "stack.eyebrow": "// 02 — STACK",
    "stack.title": "Tecnologías con las que trabajo.",
    "stack.frontend": "Frontend",
    "stack.backend": "Backend",
    "stack.infra": "Infraestructura",
    "stack.specialty": "Especialidades",

    "projects.eyebrow": "// 03 — TRABAJO",
    "projects.title": "Proyectos seleccionados.",
    "projects.subtitle": "Tres piezas que muestran el rango: inmobiliario, producto y experimentación.",
    "projects.all": "Ver todos los proyectos",
    "projects.role": "Rol",
    "projects.year": "Año",
    "projects.stack": "Stack",
    "projects.client": "Cliente",
    "projects.live": "Ver en vivo",
    "projects.repo": "Repositorio",
    "projects.next": "Siguiente proyecto",

    "experience.eyebrow": "// 04 — EXPERIENCIA",
    "experience.title": "Dónde he trabajado.",
    "experience.current": "actual",

    "services.eyebrow": "// 05 — SERVICIOS",
    "services.title": "¿Necesitas soporte técnico o desarrollo web?",
    "services.body": "CRZR es mi marca paralela para PyMEs y particulares. Soporte de TI, desarrollo a medida y mantenimiento.",
    "services.cta": "Ver servicios en CRZR",
    "services.cta.secondary": "Cotizar por correo",
    "services.item.1.title": "Soporte de TI",
    "services.item.1.body": "Resolución de incidencias, optimización de infraestructura, automatización con Snipe-IT.",
    "services.item.2.title": "Desarrollo web a medida",
    "services.item.2.body": "Landings, dashboards, PWAs. Astro, Next, React, Vue. SEO y performance.",
    "services.item.3.title": "Mantenimiento",
    "services.item.3.body": "Actualizaciones, monitoreo, mejoras continuas para sitios ya publicados.",

    "certs.eyebrow": "// 06 — CREDENCIALES",
    "certs.title": "Certificaciones.",

    "contact.eyebrow": "// 07 — CONTACTO",
    "contact.title": "¿Construimos algo juntos?",
    "contact.body": "Disponible para freelance, prácticas y proyectos remunerados. Respondo en menos de 24 h.",
    "contact.email": "Escribir correo",
    "contact.linkedin": "LinkedIn",
    "contact.github": "GitHub",

    "footer.rights": "Todos los derechos reservados.",
    "footer.tagline": "Hecho con Astro y demasiado café.",
    "footer.source": "Fuente del perfil",

    "404.title": "Ruta no encontrada.",
    "404.body": "La página que buscas no existe o se movió. Vuelve al inicio.",
    "404.cta": "Volver al inicio",
  },
  en: {
    "nav.home": "Home",
    "nav.projects": "Projects",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.contact": "Contact",

    "hero.eyebrow": "// 00 — PORTFOLIO 2026",
    "hero.title": "I build web products that close the loop between design, code and infrastructure.",
    "hero.subtitle": "Software engineer — Frontend, PWA, DevOps. Based in Mexico.",
    "hero.cta.primary": "View projects",
    "hero.cta.secondary": "Let's talk",

    "strip.available": "AVAILABLE",
    "strip.location": "MEXICO",
    "strip.year": "2026",
    "strip.role": "FULLSTACK DEV",
    "strip.signal": "BUILD MODE",

    "about.eyebrow": "// 01 — ABOUT",
    "about.title": "I design and build, not just code.",
    "about.body": "I'm Antonio Cortázar — software engineering student (Tecmilenio) blending tech support, design, sales and engineering. I build internal dashboards, real-estate landings and PWAs in production.",
    "about.cta": "Download CV",

    "stack.eyebrow": "// 02 — STACK",
    "stack.title": "Technologies I work with.",
    "stack.frontend": "Frontend",
    "stack.backend": "Backend",
    "stack.infra": "Infrastructure",
    "stack.specialty": "Specialties",

    "projects.eyebrow": "// 03 — WORK",
    "projects.title": "Selected projects.",
    "projects.subtitle": "Three pieces showing the range: real-estate, product and experimentation.",
    "projects.all": "View all projects",
    "projects.role": "Role",
    "projects.year": "Year",
    "projects.stack": "Stack",
    "projects.client": "Client",
    "projects.live": "Visit live",
    "projects.repo": "Repository",
    "projects.next": "Next project",

    "experience.eyebrow": "// 04 — EXPERIENCE",
    "experience.title": "Where I've worked.",
    "experience.current": "present",

    "services.eyebrow": "// 05 — SERVICES",
    "services.title": "Need IT support or web development?",
    "services.body": "CRZR is my parallel brand for SMBs and individuals. IT support, custom development and maintenance.",
    "services.cta": "View services on CRZR",
    "services.cta.secondary": "Email a quote",
    "services.item.1.title": "IT Support",
    "services.item.1.body": "Incident resolution, infrastructure tuning, Snipe-IT automation.",
    "services.item.2.title": "Custom web dev",
    "services.item.2.body": "Landings, dashboards, PWAs. Astro, Next, React, Vue. SEO + performance.",
    "services.item.3.title": "Maintenance",
    "services.item.3.body": "Updates, monitoring, continuous improvement for live sites.",

    "certs.eyebrow": "// 06 — CREDENTIALS",
    "certs.title": "Certifications.",

    "contact.eyebrow": "// 07 — CONTACT",
    "contact.title": "Should we build something?",
    "contact.body": "Open to freelance, internships and paid projects. I reply within 24h.",
    "contact.email": "Send email",
    "contact.linkedin": "LinkedIn",
    "contact.github": "GitHub",

    "footer.rights": "All rights reserved.",
    "footer.tagline": "Built with Astro and too much coffee.",
    "footer.source": "Profile source",

    "404.title": "Route not found.",
    "404.body": "The page you're looking for doesn't exist or has moved. Back to home.",
    "404.cta": "Back to home",
  },
} as const;

export type TranslationKey = keyof (typeof ui)["es"];
