import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

type PasswordHash = {
  alg: "scrypt";
  salt: string;
  hash: string;
};

function encode(hash: PasswordHash): string {
  return `${hash.alg}$${hash.salt}$${hash.hash}`;
}

function decode(encoded: string): PasswordHash | null {
  const [alg, salt, hash] = encoded.split("$");
  if (alg !== "scrypt" || !salt || !hash) return null;
  return { alg: "scrypt", salt, hash };
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return encode({ alg: "scrypt", salt, hash });
}

export function verifyPassword(password: string, encodedHash: string): boolean {
  const parsed = decode(encodedHash);
  if (!parsed) return false;

  const computed = scryptSync(password, parsed.salt, 64);
  const expected = Buffer.from(parsed.hash, "hex");
  if (expected.length !== computed.length) return false;
  return timingSafeEqual(expected, computed);
}
