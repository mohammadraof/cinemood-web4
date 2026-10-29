
import { useEffect, type RefObject } from "react";

export function useWobble(
  ref: RefObject<HTMLElement | null>,
  radius = 160,
  strength = 14,
) {
  useEffect(() => {
    const root = ref.current;

    if (
      !root ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const words = Array.from(
      root.querySelectorAll<HTMLElement>(".wobble-word"),
    );

    let raf = 0;
    let centers: Array<{ x: number; y: number }> = [];

    const measure = () => {
      centers = words.map((el) => {
        const rect = el.getBoundingClientRect();

        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      });
    };

    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);

      raf = requestAnimationFrame(() => {
        words.forEach((el, i) => {
          const center = centers[i];
          if (!center) return;

          const d = Math.hypot(
            e.clientX - center.x,
            e.clientY - center.y,
          );

          const f = Math.max(0, 1 - d / radius);
          const dir = i % 2 ? 1 : -1;

          el.style.transform = f
            ? `translateY(${dir * f * strength}px) rotate(${-dir * f * 6}deg) scale(${1 + f * 0.08})`
            : "";
        });
      });
    };

    const onEnter = () => measure();

    const onLeave = () => {
      cancelAnimationFrame(raf);
      words.forEach((el) => {
        el.style.transform = "";
      });
      centers = [];
    };

    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", measure);
    };
  }, [ref, radius, strength]);
}
