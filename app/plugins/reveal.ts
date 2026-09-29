/**
 * `v-reveal`: fades and lifts an element in the first time it scrolls into view.
 *
 * Registered on both sides so SSR renders the `data-reveal` attribute (the hidden start
 * state lives in main.css) and hydration has nothing to reconcile: the class is only added
 * after mount. Users who asked for reduced motion get the element shown at once, and the
 * observer is never created for them.
 */
export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null;

  const observe = (el: HTMLElement) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible");
      return;
    }

    observer ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer?.unobserve(entry.target);
        }
      },
      // Fire a little before the element reaches the bottom edge, so the rise is seen.
      { rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
  };

  nuxtApp.vueApp.directive<HTMLElement>("reveal", {
    getSSRProps: () => ({ "data-reveal": "" }),
    mounted(el) {
      el.dataset.reveal = "";
      observe(el);
    },
    unmounted(el) {
      observer?.unobserve(el);
    },
  });
});
