import Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function initLenis(): Lenis | null {
  if (typeof window === "undefined") return null;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    lerp: 0.1,
    duration: 1.2,
    smoothWheel: true,
  });

  const raf = (time: number) => {
    lenisInstance?.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  return lenisInstance;
}

export function destroyLenis(): void {
  lenisInstance?.destroy();
  lenisInstance = null;
}
