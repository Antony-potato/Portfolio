// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://antoniocortazar.dev",
  trailingSlash: "never",
  prefetch: true,

  // CSS inline en cada página: quita la petición que bloqueaba el render (~1 s en móvil)
  build: { inlineStylesheets: "always" },

  // Todo vive en el home: las páginas sueltas de antes redirigen a su sección
  redirects: {
    "/servicios": "/#services",
    "/contacto": "/#contact",
    "/en/services": "/en#services",
    "/en/contact": "/en#contact",
  },

  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  fonts: [
    {
      // Neo-grotesca libre (Fontshare), lo más cercano a la ABC Diatype de la referencia (de pago)
      provider: fontProviders.fontshare(),
      name: "Switzer",
      cssVariable: "--font-sans",
      weights: [400, 500, 600, 700],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["system-ui", "sans-serif"],
      optimizedFallbacks: true,
    },
    {
      provider: fontProviders.google(),
      name: "Geist Mono",
      cssVariable: "--font-mono",
      weights: [400, 500, 600],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["ui-monospace", "SFMono-Regular", "monospace"],
      optimizedFallbacks: true,
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    mdx(),
    sitemap({
      // La tarjeta de contacto va con noindex: fuera del sitemap
      filter: (page) => !/\/(tarjeta|card)\/?$/.test(page),
      i18n: {
        defaultLocale: "es",
        locales: { es: "es-MX", en: "en-US" },
      },
    }),
    icon({
      include: {
        lucide: ["*"],
        "simple-icons": ["*"],
      },
    }),
  ],
});
