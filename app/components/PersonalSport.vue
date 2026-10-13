<script setup lang="ts">
import {
  SPORT_CHAPTERS,
  drawSportScene,
  sportChapterOpacity,
  sportLayout,
} from "~/utils/sport-scene";

/**
 * The sport block of "À côté du code": a tall track whose stage stays pinned while the
 * scroll scrubs the canvas scene (app/utils/sport-scene.ts) like a 600-frame image
 * sequence. The page scrolls natively; nothing is hijacked. Once the scroll settles, an
 * idle loop keeps the current discipline moving, and the next scroll resumes from that
 * pose. Reduced motion (and no JavaScript) gets one still per discipline instead, switched
 * by CSS so the server-rendered markup never changes.
 */
const { tm, rt } = useI18n();

const chapters = computed(() =>
  (
    tm("home.personal.sport.chapters") as Array<{
      tag: string;
      title: string;
      accent: string;
      text: string;
    }>
  ).map((c) => ({ tag: rt(c.tag), title: rt(c.title), accent: rt(c.accent), text: rt(c.text) }))
);

const track = ref<HTMLElement>();
const canvas = ref<HTMLCanvasElement>();
const copyEls = ref<HTMLElement[]>([]);
const railEls = ref<HTMLElement[]>([]);
const railFill = ref<HTMLElement>();
const stills = ref<HTMLCanvasElement[]>([]);

const FRAMES = 600;
// The displayed position catches up with the scroll at this rate, counts as settled within
// a fraction of a frame, and the idle loop starts IDLE_AFTER ms later, fading in quickly.
const CATCH_UP = 14;
const SETTLED = 1e-3;
const IDLE_AFTER = 120;
const FADE_IN = 7;
/** Timeline positions shown as stills: the side kick, mid-stroke, mid-stride, pedalling. */
const STILLS = [0.48, 1.3, 2.3, 3.3];

let reduce: MediaQueryList | undefined;
let observer: IntersectionObserver | undefined;
let frameId = 0;
let visible = false;
let shown = 0; // displayed progress, 0..1
let prevU = 0;
let vel = 0;
let idleClock = 0;
let idleWeight = 0;
let lastMove = 0;
let last = 0;

function fit(el: HTMLCanvasElement) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const W = el.clientWidth;
  const H = el.clientHeight;
  if (el.width !== Math.round(W * dpr) || el.height !== Math.round(H * dpr)) {
    el.width = Math.round(W * dpr);
    el.height = Math.round(H * dpr);
  }
  const ctx = el.getContext("2d");
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, W, H };
}

function progress() {
  const rect = track.value!.getBoundingClientRect();
  const span = rect.height - window.innerHeight;
  return span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
}

function updateCopy(u: number) {
  copyEls.value.forEach((el, j) => {
    const o = sportChapterOpacity(u, j);
    el.style.opacity = o.toFixed(3);
    el.style.translate = `0 ${((1 - o) * 24).toFixed(1)}px`;
    el.setAttribute("aria-hidden", String(o < 0.5));
  });
  const active = Math.min(SPORT_CHAPTERS - 1, Math.floor(u + 0.2));
  railEls.value.forEach((el, j) => el.toggleAttribute("data-active", j === active));
  if (railFill.value) railFill.value.style.height = `${(shown * 100).toFixed(2)}%`;
}

function tick(now: number) {
  if (!visible || reduce?.matches || !canvas.value) {
    frameId = 0;
    return;
  }
  frameId = requestAnimationFrame(tick);
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  const target = progress();
  shown += (target - shown) * (1 - Math.exp(-dt * CATCH_UP));
  if (Math.abs(target - shown) > SETTLED) lastMove = now;
  // Quantised to FRAMES steps, exactly as an image sequence would be.
  const u = (Math.round(shown * (FRAMES - 1)) / (FRAMES - 1)) * SPORT_CHAPTERS;
  vel += ((u - prevU) / Math.max(dt, 0.001) - vel) * 0.25;
  prevU = u;
  const idle = now - lastMove > IDLE_AFTER;
  idleWeight += ((idle ? 1 : 0) - idleWeight) * (1 - Math.exp(-dt * (idle ? FADE_IN : 14)));
  idleClock += dt * idleWeight;
  const { ctx, W, H } = fit(canvas.value);
  if (ctx) drawSportScene(ctx, W, H, u, idleClock, idleWeight, vel, sportLayout(W, H));
  updateCopy(u);
}

function start() {
  if (frameId || reduce?.matches) return;
  // Entering from far away (an anchor jump) should not sweep through every frame.
  shown = progress();
  prevU = shown * SPORT_CHAPTERS;
  last = performance.now();
  frameId = requestAnimationFrame(tick);
}

function drawStills() {
  if (!reduce?.matches) return;
  stills.value.forEach((el, j) => {
    const { ctx, W, H } = fit(el);
    if (ctx) {
      drawSportScene(ctx, W, H, STILLS[j]!, 0, 0, 0, {
        S: Math.min(H * 0.22, W * 0.15),
        ox: W * 0.5,
        oy: H * 0.72,
      });
    }
  });
}

const onScroll = () => {
  lastMove = performance.now();
};
const onMotionChange = () => {
  drawStills();
  if (visible) start();
};

onMounted(() => {
  reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  reduce.addEventListener("change", onMotionChange);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", drawStills);
  observer = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting;
    if (visible) start();
  });
  if (track.value) observer.observe(track.value);
  drawStills();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId);
  observer?.disconnect();
  reduce?.removeEventListener("change", onMotionChange);
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", drawStills);
});
</script>

<template>
  <div>
    <div
      ref="track"
      class="relative h-[520svh] motion-reduce:hidden [@media(scripting:none)]:hidden"
    >
      <div class="sticky top-0 h-svh">
        <!-- Full-bleed, so the water and the road reach the screen edges; the layout's
             overflow-x: clip absorbs the scrollbar width that 100vw includes. -->
        <canvas
          ref="canvas"
          class="absolute inset-y-0 left-1/2 h-full w-screen -translate-x-1/2"
          role="img"
          :aria-label="$t('home.personal.sport.label')"
        />
        <div
          class="absolute inset-x-0 top-28 grid md:top-1/2 md:w-[min(34rem,38%)] md:-translate-y-[62%]"
        >
          <article
            v-for="(chapter, i) in chapters"
            :key="chapter.tag"
            ref="copyEls"
            class="col-start-1 row-start-1 grid content-start gap-3.5"
            :style="i ? { opacity: 0 } : undefined"
            :aria-hidden="i ? 'true' : undefined"
          >
            <p class="text-small font-medium tracking-[0.14em] text-accent uppercase">
              {{ chapter.tag }}
            </p>
            <h3
              class="font-display text-display leading-[0.96] font-extrabold tracking-[-0.03em] text-balance text-white"
            >
              {{ chapter.title }} <span class="text-gradient">{{ chapter.accent }}</span>
            </h3>
            <p class="max-w-[36ch] text-lead text-muted">{{ chapter.text }}</p>
          </article>
        </div>
        <div
          class="absolute top-1/2 right-0 hidden -translate-y-1/2 grid-cols-[2px_auto] gap-x-4 md:grid"
          aria-hidden="true"
        >
          <div class="relative row-span-4 rounded-full bg-white/12">
            <div
              ref="railFill"
              class="bg-brand-gradient absolute inset-x-0 top-0 h-0 rounded-full"
            />
          </div>
          <span
            v-for="chapter in chapters"
            :key="chapter.tag"
            ref="railEls"
            class="py-1.5 text-small text-muted transition-colors data-active:text-white"
          >
            {{ chapter.tag }}
          </span>
        </div>
      </div>
    </div>

    <ol class="hidden gap-14 motion-reduce:grid [@media(scripting:none)]:grid">
      <li
        v-for="chapter in chapters"
        :key="chapter.tag"
        class="grid items-center gap-8 md:grid-cols-[1fr_1.3fr]"
      >
        <div class="grid content-start gap-3.5">
          <p class="text-small font-medium tracking-[0.14em] text-accent uppercase">
            {{ chapter.tag }}
          </p>
          <h3
            class="font-display text-display leading-[0.96] font-extrabold tracking-[-0.03em] text-balance text-white"
          >
            {{ chapter.title }} <span class="text-gradient">{{ chapter.accent }}</span>
          </h3>
          <p class="max-w-[36ch] text-lead text-muted">{{ chapter.text }}</p>
        </div>
        <canvas
          ref="stills"
          class="aspect-[16/10] w-full rounded-panel bg-surface"
          aria-hidden="true"
        />
      </li>
    </ol>
  </div>
</template>
