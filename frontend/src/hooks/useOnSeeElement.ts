import { RefObject, useEffect, useRef, useState } from "react";

function useOnSeeElement(target: RefObject<HTMLElement | null>, onSee: () => void) {
  const observer = useRef<IntersectionObserver>();

  useEffect(() => {
    if (target === null) return;

    observer.current = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onSee();
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    if (target.current) observer.current.observe(target.current);
  }, [target.current]);
}

export default useOnSeeElement;
