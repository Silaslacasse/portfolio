<script setup lang="ts">
import { NuxtLink } from "#components";

/**
 * The one button primitive. Renders a real link when given a destination — the v1
 * `Button.vue` rendered `<button>` + `window.open` for links, which broke middle-click,
 * keyboard and screen-reader semantics and hid every link from crawlers.
 *
 * `to` is an internal route (already localized by the caller), `href` an external URL.
 */
const props = withDefaults(
  defineProps<{
    to?: string;
    href?: string;
    variant?: "primary" | "outline" | "ghost";
    size?: "md" | "lg";
    type?: "button" | "submit";
    disabled?: boolean;
  }>(),
  {
    to: undefined,
    href: undefined,
    variant: "primary",
    size: "md",
    type: "button",
    disabled: false,
  }
);

const tag = computed(() => (props.to ? NuxtLink : props.href ? "a" : "button"));

const attrs = computed(() => {
  if (props.to) return { to: props.to };
  if (props.href) return { href: props.href, target: "_blank", rel: "noopener" };
  return { type: props.type, disabled: props.disabled };
});

const padding = computed(() => (props.size === "lg" ? "px-6 py-3" : "px-5 py-2"));

// `outline` draws the gradient as a 2px frame: gradient on the outer element, ink inside.
const outer = computed(
  () =>
    ({
      primary: `bg-brand-gradient text-white ${padding.value}`,
      outline: "bg-brand-gradient p-0.5 text-accent",
      ghost: `text-body hover:text-accent ${padding.value}`,
    })[props.variant]
);

const inner = computed(() =>
  props.variant === "outline" ? `rounded-pill bg-ink ${padding.value}` : ""
);
</script>

<template>
  <component
    :is="tag"
    v-bind="attrs"
    class="inline-flex rounded-pill font-body text-base font-light transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
    :class="outer"
  >
    <span class="inline-flex w-full items-center justify-center gap-2" :class="inner">
      <slot />
    </span>
  </component>
</template>
