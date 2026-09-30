import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenis: Lenis | null = null;
const tick = (time: number) => lenis?.raf(time * 1000);

export function initLenis(): void {
  if (lenis || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger);

  lenis = new Lenis({ lerp: 0.1, anchors: { offset: -80 } });
  // Un solo reloj: GSAP maneja el raf de Lenis y ScrollTrigger lee su scroll.
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
}

export function destroyLenis(): void {
  gsap.ticker.remove(tick);
  lenis?.destroy();
  lenis = null;
}

export const getLenis = () => lenis;
