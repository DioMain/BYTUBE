import { useEffect, useRef, useState } from "react";

function useOnSeeElement(target: HTMLElement | null, onSee: () => void) {
  const [, setOnSee] = useState<() => void>(() => {});

  const observer = useRef<IntersectionObserver>();

  useEffect(() => {
    if (target === null) return;

    observer.current = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log("See");

            onSee();
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    observer.current.observe(target);
  }, [target]);

  return { setOnSee };
}

export default useOnSeeElement;
