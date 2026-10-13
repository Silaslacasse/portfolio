/**
 * The "À côté du code" sport scene: a pictogram figure that goes through kung fu, swimming
 * and running, then rides off on a bike. Drawn on a canvas from a timeline position, so the
 * scroll can scrub it like an image sequence (PersonalSport owns the scroll and idle loop).
 *
 * Units: one unit is S pixels, the ground is y = 0 and y grows downwards. A pose is the hip
 * position, the torso angle (0 = upright) and four limbs; a limb is its upper bone angle u
 * (0 points down, +PI/2 points forward) and its lower bone angle f relative to it.
 */

type Limb = { u: number; f: number };
type Pose = { x: number; y: number; a: number; lF: Limb; lB: Limb; aF: Limb; aB: Limb };
type Point = [number, number];
export type SportLayout = { S: number; ox: number; oy: number };

/** Kung fu, swimming, running, cycling. */
export const SPORT_CHAPTERS = 4;

const TAU = Math.PI * 2;
const L = { th: 0.5, sh: 0.5, to: 0.72, ua: 0.4, fa: 0.38, hr: 0.17, nk: 0.1 };
const C = { violet: "#5700ef", orange: "#ff6315", back: "#43318f", frame: "rgba(255,255,255,.8)" };

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (t: number) => {
  t = clamp(t);
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

const lerpLimb = (A: Limb, B: Limb, t: number): Limb => ({
  u: A.u + wrap(B.u - A.u) * t,
  f: lerp(A.f, B.f, t),
});
const lerpPose = (A: Pose, B: Pose, t: number): Pose => ({
  x: lerp(A.x, B.x, t),
  y: lerp(A.y, B.y, t),
  a: lerp(A.a, B.a, t),
  lF: lerpLimb(A.lF, B.lF, t),
  lB: lerpLimb(A.lB, B.lB, t),
  aF: lerpLimb(A.aF, B.aF, t),
  aB: lerpLimb(A.aB, B.aB, t),
});

/** Two-bone inverse kinematics from a to b; s picks the side the joint bends to. */
function ik(a: Point, b: Point, l1: number, l2: number, s: 1 | -1): Limb {
  const d = clamp(Math.hypot(b[0] - a[0], b[1] - a[1]), Math.abs(l1 - l2) + 1e-3, l1 + l2 - 1e-3);
  const t1 =
    Math.atan2(b[0] - a[0], b[1] - a[1]) +
    s * Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
  const j: Point = [a[0] + l1 * Math.sin(t1), a[1] + l1 * Math.cos(t1)];
  return { u: t1, f: Math.atan2(b[0] - j[0], b[1] - j[1]) - t1 };
}

// Kung fu keyframes: guard, horse stance, punch, horse stance, side kick, bow stance with a
// palm strike, guard again.
const guard: Pose = {
  x: 0,
  y: -1,
  a: 0.02,
  lF: { u: 0.14, f: 0 },
  lB: { u: -0.14, f: 0 },
  aF: { u: 0.5, f: 1.9 },
  aB: { u: 0.15, f: 2.1 },
};
const horse: Pose = {
  x: 0,
  y: -0.8,
  a: 0,
  lF: { u: 0.8, f: -0.8 },
  lB: { u: -0.8, f: 0.8 },
  aF: { u: -0.35, f: 2.3 },
  aB: { u: -0.45, f: 2.3 },
};
const punch: Pose = { ...horse, a: 0.08, aF: { u: Math.PI / 2, f: 0 }, aB: { u: -0.5, f: 2.4 } };
const kick: Pose = {
  x: -0.1,
  y: -1,
  a: -0.5,
  lF: { u: 1.75, f: 0 },
  lB: { u: -0.05, f: 0 },
  aF: { u: 1.1, f: 0.9 },
  aB: { u: -0.9, f: 1.6 },
};
const bow: Pose = {
  x: 0.05,
  y: -0.84,
  a: 0.12,
  lF: { u: 0.95, f: -0.95 },
  lB: { u: -0.57, f: 0 },
  aF: { u: 1.6, f: -0.15 },
  aB: { u: -0.8, f: 0.7 },
};
const KATA = [guard, horse, punch, horse, kick, bow, guard];

// The hold part of a chapter ends at 0.72; the rest is the transition into the next one.
const HOLD = 0.72;

const kungfu = (_phi: number, t: number, ph: number, iw: number): Pose => {
  const q = clamp(t / HOLD) * (KATA.length - 1);
  const i = Math.min(KATA.length - 2, Math.floor(q));
  const p = lerpPose(KATA[i]!, KATA[i + 1]!, smooth((q - i - 0.15) / 0.7));
  // Idle: breathing in the stance.
  const b = Math.sin(TAU * ph * 0.45) * iw;
  p.a += 0.035 * b;
  p.y += 0.02 * Math.sin(TAU * ph * 0.9) * iw;
  p.aF.u += 0.08 * b;
  p.aB.u -= 0.05 * b;
  return p;
};

const swim = (phi: number): Pose => {
  const s = TAU * phi * 0.8;
  return {
    x: -0.15,
    y: -0.22 + 0.025 * Math.sin(2 * s),
    a: Math.PI / 2 - 0.1,
    lF: { u: -1.45 + 0.2 * Math.sin(4 * s), f: -0.12 },
    lB: { u: -1.45 - 0.2 * Math.sin(4 * s), f: -0.12 },
    aF: { u: Math.PI / 2 - s, f: 0.25 },
    aB: { u: Math.PI / 2 - s + Math.PI, f: 0.25 },
  };
};

const run = (phi: number): Pose => {
  const s = TAU * phi;
  const sn = Math.sin(s);
  const c = Math.cos(s);
  return {
    x: 0,
    y: -0.93 - 0.05 * Math.abs(sn),
    a: 0.22,
    lF: { u: 0.62 * sn, f: -(0.2 + 1.2 * Math.max(0, c)) },
    lB: { u: -0.62 * sn, f: -(0.2 + 1.2 * Math.max(0, -c)) },
    aF: { u: -0.75 * sn, f: 1.5 },
    aB: { u: 0.75 * sn, f: 1.5 },
  };
};

const BB: Point = [0.04, -0.32]; // bottom bracket
const CRANK = 0.17;
const SEAT: Point = [-0.16, -1.04];
const BAR: Point = [0.7, -1.1];
const pedal = (c: number, side: 1 | -1): Point => [
  BB[0] + side * CRANK * Math.cos(c),
  BB[1] + side * CRANK * Math.sin(c),
];

const bike = (phi: number): Pose => {
  const c = TAU * phi;
  const a = 0.85;
  const shoulder: Point = [SEAT[0] + L.to * Math.sin(a), SEAT[1] - L.to * Math.cos(a)];
  const arm = ik(shoulder, BAR, L.ua, L.fa, -1);
  return {
    x: SEAT[0],
    y: SEAT[1],
    a,
    lF: ik(SEAT, pedal(c, 1), L.th, L.sh, 1),
    lB: ik(SEAT, pedal(c, -1), L.th, L.sh, 1),
    aF: arm,
    aB: { u: arm.u - 0.04, f: arm.f },
  };
};

const POSES = [kungfu, swim, run, bike];

/**
 * The scene at timeline position u (0..SPORT_CHAPTERS). ph is the idle loop's own clock
 * and iw its weight (0 while scrolling, 1 once settled), so the loop moves the figure
 * without moving the timeline.
 */
export function sportState(u: number, ph = 0, iw = 0) {
  u = clamp(u, 0, SPORT_CHAPTERS - 1e-4);
  const i = Math.floor(u);
  const t = u - i;
  const phi = u * 3 + ph;
  const k = i < SPORT_CHAPTERS - 1 ? smooth((t - HOLD) / (1 - HOLD)) : 0;
  let pose = POSES[i]!(phi, Math.min(t, HOLD), ph, iw);
  if (k > 0) pose = lerpPose(pose, POSES[i + 1]!(phi, 0, ph, iw), k);
  const w = [0, 0, 0, 0];
  w[i] = 1 - k;
  if (i < SPORT_CHAPTERS - 1) w[i + 1]! += k;
  // The last chapter ends with the cyclist riding off the right edge.
  let bx = 0;
  if (i === SPORT_CHAPTERS - 1) {
    const r = clamp((t - 0.6) / 0.4);
    bx = 9 * r * r;
    pose.x += bx;
  }
  return { pose, w, phi, bx, dist: phi * 1.6 };
}

/** How visible chapter j's copy is at timeline position u: a crossfade around each change. */
export function sportChapterOpacity(u: number, j: number) {
  const fadeIn = j ? smooth((u - (j - 0.22)) / 0.2) : 1;
  const fadeOut = j < SPORT_CHAPTERS - 1 ? 1 - smooth((u - (j + 0.7)) / 0.18) : 1;
  return Math.min(fadeIn, fadeOut);
}

/** Figure placement: right of the copy on desktop, under it on phones. */
export function sportLayout(W: number, H: number): SportLayout {
  return W < 768
    ? { S: Math.min(H * 0.13, W * 0.2), ox: W * 0.5, oy: H * 0.78 }
    : { S: Math.min(H * 0.17, W * 0.11), ox: W * 0.64, oy: H * 0.68 };
}

const limbPoints = (s: Point, l: Limb, a: number, b: number): Point[] => {
  const m: Point = [s[0] + a * Math.sin(l.u), s[1] + a * Math.cos(l.u)];
  return [s, m, [m[0] + b * Math.sin(l.u + l.f), m[1] + b * Math.cos(l.u + l.f)]];
};

function drawFigure(
  ctx: CanvasRenderingContext2D,
  p: Pose,
  S: number,
  X: (q: Point) => number,
  Y: (q: Point) => number,
  alpha: number
) {
  const hip: Point = [p.x, p.y];
  const sh: Point = [p.x + L.to * Math.sin(p.a), p.y - L.to * Math.cos(p.a)];
  const head: Point = [
    sh[0] + (L.nk + L.hr) * Math.sin(p.a),
    sh[1] - (L.nk + L.hr) * Math.cos(p.a),
  ];
  const poly = (pts: Point[]) => {
    ctx.beginPath();
    pts.forEach((q, j) => (j ? ctx.lineTo(X(q), Y(q)) : ctx.moveTo(X(q), Y(q))));
    ctx.stroke();
  };
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const g = ctx.createLinearGradient(X(hip) - S, Y(hip) + S, X(hip) + S, Y(hip) - 1.8 * S);
  g.addColorStop(0, C.violet);
  g.addColorStop(1, C.orange);
  ctx.lineWidth = 0.15 * S;
  ctx.strokeStyle = C.back;
  poly(limbPoints(sh, p.aB, L.ua, L.fa));
  poly(limbPoints(hip, p.lB, L.th, L.sh));
  ctx.strokeStyle = g;
  ctx.lineWidth = 0.24 * S;
  poly([hip, sh]);
  ctx.lineWidth = 0.15 * S;
  poly(limbPoints(hip, p.lF, L.th, L.sh));
  poly(limbPoints(sh, p.aF, L.ua, L.fa));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(X(head), Y(head), L.hr * S, 0, TAU);
  ctx.fill();
  ctx.restore();
}

/** The bike draws itself in as k goes 0 -> 1: wheels as growing arcs, tubes as growing lines. */
function drawBike(
  ctx: CanvasRenderingContext2D,
  k: number,
  phi: number,
  dist: number,
  bx: number,
  S: number,
  X0: (q: Point) => number,
  Y: (q: Point) => number
) {
  if (k < 0.01) return;
  const X = (q: Point) => X0([q[0] + bx, q[1]]);
  const seg = (a: Point, b: Point, width: number) => {
    const e: Point = [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
    ctx.lineWidth = width * S;
    ctx.beginPath();
    ctx.moveTo(X(a), Y(a));
    ctx.lineTo(X(e), Y(e));
    ctx.stroke();
  };
  const rot = dist / 0.34;
  const rear: Point = [-0.62, -0.34];
  const front: Point = [0.8, -0.34];
  const seatTube: Point = [-0.14, -0.98];
  const headTop: Point = [0.6, -1];
  const headBottom: Point = [0.65, -0.84];
  ctx.save();
  ctx.lineCap = "round";
  ctx.globalAlpha = Math.min(1, k * 1.5);
  for (const c of [rear, front]) {
    const cx = X(c);
    const cy = Y(c);
    ctx.strokeStyle = C.frame;
    ctx.lineWidth = 0.045 * S;
    ctx.beginPath();
    ctx.arc(cx, cy, 0.34 * S, rot, rot + TAU * k);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.3)";
    ctx.lineWidth = 0.012 * S;
    for (let j = 0; j < 6; j++) {
      const a = rot + (j * TAU) / 6;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * 0.32 * S * k, cy + Math.sin(a) * 0.32 * S * k);
      ctx.stroke();
    }
  }
  ctx.strokeStyle = C.frame;
  const tubes: Array<[Point, Point]> = [
    [rear, BB],
    [BB, seatTube],
    [seatTube, rear],
    [seatTube, headTop],
    [BB, headBottom],
    [headBottom, front],
    [headTop, headBottom],
    [headTop, BAR],
  ];
  for (const [a, b] of tubes) seg(a, b, 0.05);
  seg([-0.27, -1], [-0.03, -1], 0.07);
  const c = TAU * phi;
  seg(BB, pedal(c, 1), 0.04);
  seg(BB, pedal(c, -1), 0.04);
  ctx.restore();
}

/**
 * Draws the scene at timeline position u. vel (timeline units per second) leaves two
 * fading echoes behind the figure on a fast scroll.
 */
export function drawSportScene(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  u: number,
  ph: number,
  iw: number,
  vel: number,
  { S, ox, oy }: SportLayout
) {
  const X = (q: Point) => ox + q[0] * S;
  const Y = (q: Point) => oy + q[1] * S;
  const s = sportState(u, ph, iw);
  const [wKungfu, wSwim, wRun, wBike] = s.w as [number, number, number, number];
  ctx.clearRect(0, 0, W, H);

  const gx = X([s.pose.x, 0]);
  const gy = Y([0, -1.1]);
  const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, S * 2.8);
  glow.addColorStop(0, "rgba(87,0,239,.24)");
  glow.addColorStop(1, "rgba(87,0,239,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Ground, with road dashes that run under the runner and the cyclist; hidden under water.
  const ground = 1 - wSwim;
  if (ground > 0.01) {
    ctx.save();
    ctx.globalAlpha = ground;
    ctx.strokeStyle = "rgba(255,255,255,.12)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, oy);
    ctx.lineTo(W, oy);
    ctx.stroke();
    const dashes = wRun + wBike;
    if (dashes > 0.01) {
      ctx.globalAlpha = ground * dashes;
      ctx.strokeStyle = "rgba(255,255,255,.3)";
      ctx.lineWidth = 3;
      ctx.setLineDash([0.35 * S, 0.55 * S]);
      ctx.lineDashOffset = s.dist * S;
      ctx.beginPath();
      ctx.moveTo(0, oy + 0.08 * S);
      ctx.lineTo(W, oy + 0.08 * S);
      ctx.stroke();
    }
    ctx.restore();
  }
  if (wKungfu > 0.01) {
    ctx.fillStyle = `rgba(255,255,255,${0.06 * wKungfu})`;
    ctx.fillRect(X([-1.7, 0]), oy, 3.4 * S, 0.09 * S);
  }

  drawBike(ctx, wBike, s.phi, s.dist, s.bx, S, X, Y);
  if (Math.abs(vel) > 0.12) {
    [0.05, 0.1].forEach((d, j) => {
      drawFigure(ctx, sportState(u - vel * d, ph, iw).pose, S, X, Y, j ? 0.07 : 0.15);
    });
  }
  drawFigure(ctx, s.pose, S, X, Y, 1);

  // Water rises from below for the swim and drains away after it, tinting what it covers.
  if (wSwim > 0.01) {
    const level = lerp(2, -0.2, smooth(wSwim));
    const surface: Point[] = [];
    for (let px = 0; px <= W + 12; px += 12) {
      const ux = (px - ox) / S;
      surface.push([
        px,
        Y([
          0,
          level +
            0.035 * Math.sin(ux * 2.6 + s.phi * 3.8) +
            0.02 * Math.sin(ux * 5.3 - s.phi * 5.6),
        ]),
      ]);
    }
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (const [x, y] of surface) ctx.lineTo(x, y);
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = "rgba(87,0,239,.26)";
    ctx.fill();
    ctx.beginPath();
    surface.forEach(([x, y], j) => (j ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.strokeStyle = "rgba(255,255,255,.35)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }
}
