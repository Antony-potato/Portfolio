// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://antoniocortazar.dev",
  trailingSlash: "never",
  prefetch: true,

  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  fonts: [
    {
      provider: fontProviders.google(),
      name: "Geist",
      cssVariable: "--font-sans",
      weights: [400, 500, 600, 700, 800],
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
    react(),
    sitemap({
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
