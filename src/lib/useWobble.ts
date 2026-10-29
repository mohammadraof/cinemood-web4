import { useEffect, type RefObject } from "react";

export function useWobble(
  ref: RefObject<HTMLElement | null>,
  radius = 160,
  strength = 14
) {
  useEffect(() => {
    const root = ref.current;
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const words = Array.from(root.querySelectorAll<HTMLElement>(".wobble-word"));
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        words.forEach((el, i) => {
          const r = el.getBoundingClientRect();
          const d = Math.hypot(
            e.clientX - (r.left + r.width / 2),
            e.clientY - (r.top + r.height / 2)
          );
          const f = Math.max(0, 1 - d / radius);
          const dir = i % 2 ? 1 : -1;
          el.style.transform = f
            ? `translateY(${dir * f * strength}px) rotate(${-dir * f * 6}deg) scale(${1 + f * 0.08})`
            : "";
        });
      });
    };
    const onLeave = () => words.forEach((el) => (el.style.transform = ""));

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [ref, radius, strength]);
}