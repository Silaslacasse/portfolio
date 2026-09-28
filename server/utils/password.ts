import { Buffer } from "node:buffer";
import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";

/**
 * scrypt from the standard library rather than argon2: nothing to install and no native
 * module to compile in the Nixpacks build. N=2^15, r=8, p=3 is one of the parameter sets
 * OWASP lists as adequate. The parameters travel with the hash, so they can be raised
 * later without invalidating stored values — verification reads them from the string.
 *
 * No Nitro auto-imports in this file: `scripts/hash-password.ts` imports it directly.
 */
const N = 2 ** 15;
const R = 8;
const P = 3;
const KEY_LENGTH = 64;

const derive = (password: string, salt: Buffer, n: number, r: number, p: number) =>
  new Promise<Buffer>((resolve, reject) =>
    // scrypt needs about 128·N·r bytes; the default maxmem (32 MiB) is below that for N=2^15.
    scrypt(password, salt, KEY_LENGTH, { N: n, r, p, maxmem: 256 * n * r }, (error, key) =>
      error ? reject(error) : resolve(key)
    )
  );

/**
 * Produces `scrypt:N:r:p:salt:hash`, salt and hash in base64.
 *
 * `:` rather than the PHC-style `$`: the value is pasted into .env files, Compose and
 * shells, all of which treat `$word` as a variable to interpolate. Base64 never contains `:`.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(16);
  const key = await derive(password, salt, N, R, P);
  return ["scrypt", N, R, P, salt.toString("base64"), key.toString("base64")].join(":");
};

export const verifyPassword = async (password: string, stored: string): Promise<boolean> => {
  const [scheme, n, r, p, salt, hash] = stored.split(":");
  if (scheme !== "scrypt" || !n || !r || !p || !salt || !hash) return false;

  const expected = Buffer.from(hash, "base64");
  const key = await derive(password, Buffer.from(salt, "base64"), Number(n), Number(r), Number(p));
  return key.length === expected.length && timingSafeEqual(key, expected);
};

/**
 * Constant-time string comparison via fixed-length digests, so neither the result nor
 * the *length* of the secret leaks through timing. `timingSafeEqual` throws on mismatched
 * lengths, which would otherwise reveal how long the real value is.
 */
export const safeEqual = (candidate: string, expected: string): boolean =>
  timingSafeEqual(
    createHash("sha256").update(candidate).digest(),
    createHash("sha256").update(expected).digest()
  );
