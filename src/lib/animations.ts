import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function initAnimations(): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
    return;
  }

  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }

  document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => el.classList.add("is-visible"),
    });
  });

  document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((parent) => {
    const children = parent.querySelectorAll<HTMLElement>("[data-stagger-child]");
    if (children.length === 0) return;
    gsap.fromTo(
      children,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: parent,
          start: "top 80%",
          once: true,
        },
      },
    );
  });
}

export function teardownAnimations(): void {
  ScrollTrigger.getAll().forEach((st) => st.kill());
}
