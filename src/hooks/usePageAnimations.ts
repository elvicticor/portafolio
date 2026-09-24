import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function usePageAnimations(scope: RefObject<HTMLElement | null>, refreshKey: string | number) {
  useLayoutEffect(() => {
    const element = scope.current;
    if (!element) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const context = gsap.context(() => {
      if (reducedMotion) {
        gsap.set("[data-reveal], .char, .langbar span", { clearProps: "all" });
        document.querySelectorAll<HTMLElement>("[data-counter]").forEach((counter) => { counter.textContent = counter.dataset.counter ?? "0"; });
        return;
      }

      const heroTimeline = gsap.timeline({ defaults: { ease: "power4.out" } });
      heroTimeline
        .fromTo(".hero .char", { yPercent: 115, rotate: 2 }, { yPercent: 0, rotate: 0, duration: 1.15, stagger: 0.018 })
        .fromTo(".hero [data-reveal]", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 }, "-=0.72");

      gsap.utils.toArray<HTMLElement>("[data-reveal]:not(.hero [data-reveal])").forEach((target) => {
        gsap.fromTo(target, { autoAlpha: 0, y: 34 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: target, start: "top 88%", once: true },
        });
      });

      document.querySelectorAll<HTMLElement>("[data-counter]").forEach((counter) => {
        const state = { value: 0 };
        const target = Number(counter.dataset.counter ?? 0);
        gsap.to(state, {
          value: target,
          duration: 1.4,
          ease: "power4.out",
          scrollTrigger: { trigger: counter, start: "top 88%", once: true },
          onUpdate: () => { counter.textContent = Math.round(state.value).toString(); },
        });
      });

      gsap.fromTo(".langbar span", { scaleX: 0 }, {
        scaleX: 1,
        transformOrigin: "left center",
        duration: 1.15,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".langbar", start: "top 90%", once: true },
      });

      gsap.to("[data-progress]", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.2 },
      });

      const nav = document.querySelector<HTMLElement>("[data-nav]");
      if (nav) {
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => nav.classList.toggle("is-hidden", self.direction === 1 && self.scroll() > 300),
        });
      }

      document.querySelectorAll<HTMLElement>("main section[id]").forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 52%",
          end: "bottom 48%",
          onToggle: ({ isActive }) => {
            if (!isActive) return;
            document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]").forEach((link) => link.classList.toggle("is-active", link.hash === `#${section.id}`));
          },
        });
      });
    }, element);

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 50);
    return () => {
      window.clearTimeout(refresh);
      context.revert();
    };
  }, [scope, refreshKey]);
}
