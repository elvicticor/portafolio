import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function PointerEffects() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion || !dotRef.current || !ringRef.current || !cursorRef.current) return;

    document.documentElement.classList.add("has-cursor");
    const dotX = gsap.quickTo(dotRef.current, "x", { duration: 0.08, ease: "power2.out" });
    const dotY = gsap.quickTo(dotRef.current, "y", { duration: 0.08, ease: "power2.out" });
    const ringX = gsap.quickTo(ringRef.current, "x", { duration: 0.35, ease: "power3.out" });
    const ringY = gsap.quickTo(ringRef.current, "y", { duration: 0.35, ease: "power3.out" });
    let activeMagnetic: HTMLElement | null = null;
    let activeTilt: HTMLElement | null = null;

    const onPointerMove = (event: PointerEvent) => {
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);

      const target = event.target instanceof Element ? event.target : null;
      const interactive = target?.closest<HTMLElement>("a, button");
      const view = target?.closest<HTMLElement>("[data-view]");
      cursorRef.current?.classList.toggle("is-hover", Boolean(interactive && !view));
      cursorRef.current?.classList.toggle("is-view", Boolean(view));

      const magnetic = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (activeMagnetic && activeMagnetic !== magnetic) gsap.to(activeMagnetic, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });
      activeMagnetic = magnetic;
      if (magnetic) {
        const bounds = magnetic.getBoundingClientRect();
        gsap.to(magnetic, { x: (event.clientX - bounds.left - bounds.width / 2) * 0.3, y: (event.clientY - bounds.top - bounds.height / 2) * 0.35, duration: 0.35, ease: "power3.out", overwrite: "auto" });
      }

      const tilt = target?.closest<HTMLElement>("[data-tilt]") ?? null;
      if (activeTilt && activeTilt !== tilt) {
        gsap.to(activeTilt, { rotateX: 0, rotateY: 0, duration: 0.65, ease: "power3.out" });
        activeTilt.classList.remove("is-tilting");
      }
      activeTilt = tilt;
      if (tilt) {
        const bounds = tilt.getBoundingClientRect();
        const px = (event.clientX - bounds.left) / bounds.width;
        const py = (event.clientY - bounds.top) / bounds.height;
        const max = tilt.matches(".project") ? 4 : 9;
        tilt.classList.add("is-tilting");
        tilt.style.setProperty("--mx", `${px * 100}%`);
        tilt.style.setProperty("--my", `${py * 100}%`);
        gsap.to(tilt, { rotateX: (0.5 - py) * max * 2, rotateY: (px - 0.5) * max * 2, transformPerspective: tilt.matches(".project") ? 1400 : 1000, duration: 0.25, ease: "power2.out", overwrite: "auto" });
      }

      const repository = target?.closest<HTMLElement>(".repo");
      if (repository) {
        const bounds = repository.getBoundingClientRect();
        repository.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
        repository.style.setProperty("--my", `${event.clientY - bounds.top}px`);
      }
    };

    const onPointerLeave = () => { if (cursorRef.current) cursorRef.current.style.opacity = "0"; };
    const onPointerEnter = () => { if (cursorRef.current) cursorRef.current.style.opacity = "1"; };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("pointerenter", onPointerEnter);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("pointerenter", onPointerEnter);
    };
  }, []);

  return <div className="cursor" ref={cursorRef} aria-hidden="true"><div className="cursor__dot" ref={dotRef} /><div className="cursor__ring" ref={ringRef} /></div>;
}
