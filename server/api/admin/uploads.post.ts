import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import sharp from "sharp";

const MAX_BYTES = 10 * 1024 * 1024;
const MAX_WIDTH = 2400;

/** Output options per accepted format; PNG stays lossless (sharp's `quality` would palettise it). */
const FORMATS = {
  jpeg: { ext: "jpg", options: { quality: 85, mozjpeg: true } },
  png: { ext: "png", options: { compressionLevel: 9 } },
  webp: { ext: "webp", options: { quality: 85 } },
} as const;

type Format = keyof typeof FORMATS;

/**
 * Where uploads live: `public/uploads` under the app root. That is the directory IPX
 * (`@nuxt/image`) reads at runtime in both dev and production, so `<NuxtImg
 * src="/uploads/…">` serves AVIF/WebP variants with no extra configuration. On Coolify it
 * is a persistent volume mounted at /app/public/uploads — see DEPLOY.md. The process is
 * started from the app root in every environment (Nixpacks WORKDIR, `npm run dev`), which
 * is what `resolve` relies on.
 */
const UPLOADS_DIR = resolve("public/uploads");

/**
 * Stores one image for the project form and returns its URL.
 *
 * The format comes from the bytes (sharp), never from the extension or the declared MIME
 * type, and the image is re-encoded: that applies the EXIF orientation, then drops EXIF
 * (GPS, device) and anything else riding along in the container. Nothing is deleted here —
 * ponytail: orphaned files are cheap at portfolio scale; add a sweep if the volume grows.
 */
export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  if (Number(getRequestHeader(event, "content-length") ?? 0) > MAX_BYTES) {
    throw createError({ statusCode: 413, statusMessage: "Image trop volumineuse (10 Mo max)." });
  }

  const parts = await readMultipartFormData(event);
  const file = parts?.find((part) => part.name === "file" && part.data.length > 0);
  if (!file) throw createError({ statusCode: 400, statusMessage: "Aucun fichier reçu." });
  if (file.data.length > MAX_BYTES) {
    throw createError({ statusCode: 413, statusMessage: "Image trop volumineuse (10 Mo max)." });
  }

  const image = sharp(file.data);
  const format = (await image.metadata().catch(() => null))?.format as Format | undefined;
  if (!format || !(format in FORMATS)) {
    throw createError({
      statusCode: 415,
      statusMessage: "Format non pris en charge (JPEG, PNG ou WebP).",
    });
  }

  const { data, info } = await image
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .toFormat(format, FORMATS[format].options)
    .toBuffer({ resolveWithObject: true });

  // Server-chosen name: the client's filename never touches the filesystem.
  const name = `${Date.now().toString(36)}-${randomBytes(4).toString("hex")}.${FORMATS[format].ext}`;

  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(join(UPLOADS_DIR, name), data);

  setResponseStatus(event, 201);
  return { url: `/uploads/${name}`, width: info.width, height: info.height, bytes: info.size };
});
