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
  // isConnected: si el usuario ya navegó a otra página, no arrancar sobre un canvas huérfano
  if (canvas) import("./hero-gl").then((m) => canvas.isConnected && (glCleanup = m.initHeroGL(canvas)));

  mm = gsap.matchMedia();
  mm.add(
    { motion: "(prefers-reduced-motion: no-preference)", fine: "(hover: hover) and (pointer: fine)" },
    (ctx) => {
      const { motion, fine } = ctx.conditions as { motion: boolean; fine: boolean };
      if (!motion) return;

      heroScroll();
      reveals();
      scrubs();
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

/* ── Hero al hacer scroll (el intro de entrada es CSS: ver global.css) ── */
function heroScroll() {
  const hero = document.querySelector("[data-hero]");
  if (!hero) return;
  const $ = (sel: string) => hero.querySelectorAll(sel);

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
      aria: "none",
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
      aria: "none",
      autoSplit: true,
      onSplit: (self) =>
        gsap.fromTo(
          self.words,
          { opacity: 0.45 },
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
