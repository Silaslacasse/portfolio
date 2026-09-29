import { mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import mongoose from "mongoose";
import sharp from "sharp";
import Project from "../server/models/project.model.ts";

/**
 * Fills the local database with six sample projects so the redesigned pages can be looked
 * at before real content exists: lorem copy in both languages, gradient images written to
 * public/uploads/demo (gitignored — the same directory the admin uploads to, so IPX serves
 * them like real uploads). Development only; never run against production.
 *
 *   npm run seed:demo             # refuses a database that already holds projects
 *   npm run seed:demo -- --force  # replaces the demo projects (slugs starting with demo-)
 */
// From the script's own location, so it lands in public/uploads (the served, mounted
// directory) whatever the working directory.
const UPLOADS_DIR = resolve(import.meta.dirname, "../public/uploads/demo");
const force = process.argv.includes("--force");

const LOREM_FR = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Le client avait besoin d’une plateforme fiable, rapide et simple à administrer, avec une mise en ligne en quelques semaines.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. J’ai conçu l’architecture, développé le front et l’API, puis déployé l’ensemble sur Coolify avec une CI complète.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Résultat : un score Lighthouse de 100 en performance et un back-office que l’équipe utilise au quotidien.",
].join("\n\n");

const LOREM_EN = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. The client needed a reliable, fast platform that was simple to administer, live within a few weeks.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. I designed the architecture, built the front end and the API, then deployed everything on Coolify with a full CI.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Outcome: a Lighthouse performance score of 100 and a back office the team uses every day.",
].join("\n\n");

interface Demo {
  slug: string;
  title: [string, string];
  summary: [string, string];
  technologies: string[];
  client: string;
  year: number;
  colors: [string, string];
}

const DEMOS: Demo[] = [
  {
    slug: "demo-atlas",
    title: ["Atlas — plateforme de réservation", "Atlas — booking platform"],
    summary: [
      "Réservation en ligne pour un réseau de salles, paiement et rappels automatiques.",
      "Online booking for a network of venues, with payment and automatic reminders.",
    ],
    technologies: ["Nuxt", "MongoDB", "Tailwind"],
    client: "Lumen",
    year: 2025,
    colors: ["#5700ef", "#2e2e42"],
  },
  {
    slug: "demo-nebula",
    title: ["Nébula — tableau de bord analytics", "Nebula — analytics dashboard"],
    summary: [
      "Visualisation temps réel des ventes d’une marketplace, exports et alertes.",
      "Real-time sales visualisation for a marketplace, with exports and alerts.",
    ],
    technologies: ["Symfony", "Vue.js", "SQL"],
    client: "Novatek",
    year: 2024,
    colors: ["#ff6315", "#2e2e42"],
  },
  {
    slug: "demo-kiosque",
    title: ["Kiosque — boutique en ligne", "Kiosque — online store"],
    summary: [
      "Boutique headless pour un éditeur indépendant, catalogue et abonnements.",
      "Headless store for an independent publisher, with catalogue and subscriptions.",
    ],
    technologies: ["React", "Node", "MongoDB"],
    client: "Orbis",
    year: 2024,
    colors: ["#2e2e42", "#5700ef"],
  },
  {
    slug: "demo-relais",
    title: ["Relais — intranet associatif", "Relais — community intranet"],
    summary: [
      "Espace membres, agenda partagé et documents pour une fédération de 40 clubs.",
      "Member area, shared calendar and documents for a federation of 40 clubs.",
    ],
    technologies: ["PHP", "Vue.js", "SQL"],
    client: "Fédération Relais",
    year: 2023,
    colors: ["#9b00ff", "#ff4500"],
  },
  {
    slug: "demo-pulse",
    title: ["Pulse — application mobile fitness", "Pulse — fitness mobile app"],
    summary: [
      "Suivi d’entraînement hors-ligne, synchronisation et programmes personnalisés.",
      "Offline workout tracking, synchronisation and personalised programmes.",
    ],
    technologies: ["Node", "TypeScript", "MongoDB"],
    client: "Pulse Studio",
    year: 2023,
    colors: ["#27272a", "#ff6315"],
  },
  {
    slug: "demo-cartes",
    title: ["Cartes — SIG pour une collectivité", "Cartes — GIS for a local authority"],
    summary: [
      "Cartographie interactive des équipements publics, éditable par les services.",
      "Interactive map of public facilities, editable by the council’s departments.",
    ],
    technologies: ["Symfony", "React", "SQL"],
    client: "Ville de Lorem",
    year: 2022,
    colors: ["#5700ef", "#9b00ff"],
  },
];

/** A gradient with a few soft shapes and a label: a fake image that reads as one. */
const placeholder = (label: string, [from, to]: [string, string], width: number, height: number) =>
  Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${from}" />
          <stop offset="1" stop-color="${to}" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)" />
      <circle cx="${width * 0.78}" cy="${height * 0.28}" r="${height * 0.22}" fill="#ffffff" fill-opacity="0.12" />
      <circle cx="${width * 0.2}" cy="${height * 0.8}" r="${height * 0.3}" fill="#000000" fill-opacity="0.18" />
      <text x="50%" y="52%" text-anchor="middle" font-family="sans-serif" font-size="${height * 0.08}"
        font-weight="700" fill="#ffffff" fill-opacity="0.85" letter-spacing="4">${label}</text>
    </svg>
  `);

const writeImage = async (
  name: string,
  label: string,
  colors: [string, string],
  width: number,
  height: number
) => {
  await sharp(placeholder(label, colors, width, height))
    .webp({ quality: 80 })
    .toFile(join(UPLOADS_DIR, name));
  return `/uploads/demo/${name}`;
};

const uri = process.env.NUXT_MONGO_URI;
if (!uri) {
  console.error("NUXT_MONGO_URI is not set (in .env locally, in the environment on a server)");
  process.exit(1);
}

await mongoose.connect(uri);

try {
  if (!force && (await Project.countDocuments()) > 0) {
    console.error("The database already holds projects. Use --force to replace the demo ones.");
    process.exit(1);
  }

  await Project.deleteMany({ slug: /^demo-/ });
  await mkdir(UPLOADS_DIR, { recursive: true });

  for (const [index, demo] of DEMOS.entries()) {
    const label = demo.title[1].split(" — ")[0]!.toUpperCase();
    const coverImage = await writeImage(`${demo.slug}-cover.webp`, label, demo.colors, 1600, 1000);
    const gallery = await Promise.all([
      writeImage(`${demo.slug}-1.webp`, `${label} · 01`, demo.colors, 1200, 750),
      writeImage(
        `${demo.slug}-2.webp`,
        `${label} · 02`,
        [demo.colors[1], demo.colors[0]],
        1200,
        750
      ),
    ]);

    await Project.create({
      slug: demo.slug,
      title: { fr: demo.title[0], en: demo.title[1] },
      summary: { fr: demo.summary[0], en: demo.summary[1] },
      description: { fr: LOREM_FR, en: LOREM_EN },
      coverImage,
      gallery,
      technologies: demo.technologies,
      role: index % 2 ? "Développeur front-end" : "Développeur full-stack",
      client: demo.client,
      year: demo.year,
      url: "https://example.com",
      repoUrl: index < 3 ? "https://github.com/example/demo" : "",
      featured: index < 2,
      order: index,
      status: "published",
    });
    console.log(`✓ ${demo.slug}`);
  }

  console.log(`${DEMOS.length} demo projects written. Images in ${UPLOADS_DIR}.`);
} finally {
  await mongoose.disconnect();
}
