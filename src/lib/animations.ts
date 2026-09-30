import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const EASE = "expo.out";
const q = <T extends Element = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel);

let mm: gsap.MatchMedia | null = null;
let glCleanup: (() => void) | null = null;

export function initAnimations(): void {
  const canvas = document.querySelector<HTMLCanvasElement>("[data-gl]");
  // isConnected: si el usuario navegó antes de que cargara el chunk, no arrancar sobre un canvas huérfano
  if (canvas) import("./hero-gl").then((m) => canvas.isConnected && (glCleanup = m.initHeroGL(canvas)));

  mm = gsap.matchMedia();
  mm.add(
    { motion: "(prefers-reduced-motion: no-preference)", fine: "(hover: hover) and (pointer: fine)" },
    (ctx) => {
      const { motion, fine } = ctx.conditions as { motion: boolean; fine: boolean };
      document.documentElement.classList.add("intro-ready");
      if (!motion) return;

      intro();
      reveals();
      scrubs();
      stackCards();
      if (fine) return pointerFx();
    },
  );
}

export function teardownAnimations(): void {
  mm?.revert();
  mm = null;
  glCleanup?.();
  glCleanup = null;
}

/* ── Intro del hero: caracteres suben desde su máscara ─────────────── */
function intro() {
  const hero = document.querySelector("[data-hero]");
  if (!hero) return;
  const $ = (sel: string) => hero.querySelectorAll(sel);
  const split = SplitText.create($("[data-hero-line]"), { type: "chars,lines", mask: "lines", linesClass: "line" });
  const tl = gsap.timeline({ defaults: { ease: EASE } }).set($("[data-intro]"), { opacity: 1 });
  tl.from(split.chars, { yPercent: 135, duration: 1.3, stagger: 0.03 }, 0.15);
  if ($("[data-gl]").length) tl.from($("[data-gl]"), { opacity: 0, scale: 1.1, duration: 2.2 }, 0);
  if ($("[data-intro-up]").length)
    tl.from($("[data-intro-up]"), { y: 24, opacity: 0, duration: 1, stagger: 0.07 }, 0.55);
  if ($("[data-intro-line]").length)
    tl.from($("[data-intro-line]"), { scaleX: 0, transformOrigin: "left", duration: 1.4, stagger: 0.1 }, 0.35);

  // Salida: el contenido se hunde y el canvas crece al hacer scroll
  const st = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
  if ($("[data-hero-inner]").length)
    gsap.to($("[data-hero-inner]"), { yPercent: 16, opacity: 0.15, ease: "none", scrollTrigger: st });
  if ($("[data-gl-wrap]").length) gsap.to($("[data-gl-wrap]"), { scale: 1.18, ease: "none", scrollTrigger: st });
}

/* ── Reveals al entrar en viewport ─────────────────────────────────── */
function reveals() {
  const onEnter = (trigger: Element, start = "top 88%") => ({ trigger, start, once: true });

  q("[data-reveal='lines']").forEach((el) =>
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "line",
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 135,
          duration: 1.2,
          ease: EASE,
          stagger: 0.09,
          scrollTrigger: onEnter(el),
        }),
    }),
  );

  q("[data-reveal='up']").forEach((el) =>
    gsap.from(el, { y: 48, opacity: 0, duration: 1.2, ease: EASE, scrollTrigger: onEnter(el, "top 92%") }),
  );

  q("[data-stagger]").forEach((parent) =>
    gsap.from(parent.children, {
      y: 36,
      opacity: 0,
      duration: 1,
      ease: EASE,
      stagger: 0.08,
      scrollTrigger: onEnter(parent),
    }),
  );

  q("[data-line]").forEach((el) =>
    gsap.from(el, {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 1.6,
      ease: "expo.inOut",
      scrollTrigger: onEnter(el, "top 95%"),
    }),
  );

  q("[data-clip]").forEach((el) => {
    const tl = gsap.timeline({ scrollTrigger: onEnter(el, "top 85%"), defaults: { duration: 1.5, ease: "expo.inOut" } });
    tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)" });
    const img = el.querySelector("img");
    if (img) tl.from(img, { scale: 1.3, duration: 1.8, ease: EASE }, 0);
  });

  q("[data-count]").forEach((el) => {
    const end = Number(el.dataset.count);
    const pad = el.textContent?.trim().length ?? 2;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: end,
      duration: 1.6,
      ease: "power3.out",
      scrollTrigger: onEnter(el),
      onUpdate: () => (el.textContent = String(Math.round(obj.v)).padStart(pad, "0")),
    });
  });
}

/* ── Efectos ligados al scroll (scrub) ─────────────────────────────── */
function scrubs() {
  // Palabras que se "encienden" conforme se lee
  q("[data-scrub-words]").forEach((el) =>
    SplitText.create(el, {
      type: "words",
      autoSplit: true,
      onSplit: (self) =>
        gsap.fromTo(
          self.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 50%", scrub: true },
          },
        ),
    }),
  );

  q("[data-parallax]").forEach((el) => {
    const amount = Number(el.dataset.parallax || 12);
    gsap.fromTo(
      el,
      { yPercent: -amount },
      {
        yPercent: amount,
        ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });

  // Wordmark gigante del footer sube desde el borde
  q("[data-wordmark]").forEach((el) =>
    gsap.from(el, {
      yPercent: 60,
      ease: "none",
      scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom bottom", scrub: true },
    }),
  );
}

/* ── Cards apiladas: la de abajo se encoge cuando la siguiente la cubre ── */
function stackCards() {
  const cards = q("[data-stack-card]");

  // Barra sticky: línea de progreso + título/contador del proyecto visible
  const bar = document.querySelector<HTMLElement>("[data-stack-bar]");
  if (bar && cards.length) {
    const title = bar.querySelector("[data-stack-title]");
    const count = bar.querySelector("[data-stack-count]");
    let current = -1;
    gsap.to(bar.querySelector("[data-stack-progress]"), {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: bar.parentElement,
        start: "top top",
        end: "bottom 70%",
        scrub: true,
        onUpdate: ({ progress }) => {
          const i = Math.round(progress * (cards.length - 1)); // cambia cuando la siguiente card domina el viewport
          if (i === current || !title || !count) return;
          current = i;
          title.textContent = cards[i]?.dataset.title ?? "";
          count.textContent = String(i + 1).padStart(2, "0");
          gsap.fromTo([title, count], { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: EASE });
        },
      },
    });
  }

  cards.forEach((card, i) => {
    const next = cards[i + 1];
    if (!next) return;
    const shade = card.querySelector("[data-shade]");
    const st = { trigger: next, start: "top bottom", end: "top 20%", scrub: true };
    gsap.to(card.firstElementChild, { scale: 0.92, ease: "none", scrollTrigger: st });
    if (shade) gsap.to(shade, { opacity: 0.55, ease: "none", scrollTrigger: st });
  });
}

/* ── Solo con mouse: botones magnéticos y preview que sigue al cursor ── */
function pointerFx() {
  const offs: Array<() => void> = [];
  const on = <K extends keyof HTMLElementEventMap>(
    el: HTMLElement,
    type: K,
    fn: (e: HTMLElementEventMap[K]) => void,
  ) => {
    el.addEventListener(type, fn);
    offs.push(() => el.removeEventListener(type, fn));
  };

  q("[data-magnetic]").forEach((el) => {
    const x = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3" });
    const k = Number(el.dataset.magnetic || 0.3);
    on(el, "pointermove", (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * k);
      y((e.clientY - r.top - r.height / 2) * k);
    });
    on(el, "pointerleave", () => {
      x(0);
      y(0);
    });
  });

  // Índice de proyectos: la portada flota junto al cursor
  const list = document.querySelector<HTMLElement>("[data-hover-list]");
  const preview = document.querySelector<HTMLElement>("[data-hover-preview]");
  const img = preview?.querySelector("img");
  if (list && preview && img) {
    const x = gsap.quickTo(preview, "x", { duration: 0.6, ease: "power3" });
    const y = gsap.quickTo(preview, "y", { duration: 0.6, ease: "power3" });
    const r = gsap.quickTo(preview, "rotation", { duration: 0.8, ease: "power3" });
    let lastX = 0;
    on(list, "pointermove", (e) => {
      x(e.clientX);
      y(e.clientY);
      r(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.6));
      lastX = e.clientX;
    });
    on(list, "pointerleave", () => gsap.to(preview, { opacity: 0, scale: 0.85, duration: 0.4, ease: "power3" }));
    list.querySelectorAll<HTMLElement>("[data-cover]").forEach((row) =>
      on(row, "pointerenter", () => {
        img.src = row.dataset.cover ?? "";
        gsap.to(preview, { opacity: 1, scale: 1, duration: 0.5, ease: "power3" });
      }),
    );
  }

  return () => offs.forEach((off) => off());
}
