export function parseCookieHeader(
  cookieHeader: string | undefined
): Record<string, string> {
  if (!cookieHeader) return {};

  const out: Record<string, string> = {};
  for (const part of cookieHeader.split(";")) {
    const [rawName, ...rest] = part.trim().split("=");
    if (!rawName) continue;
    const value = rest.join("=");
    out[rawName] = decodeURIComponent(value ?? "");
  }
  return out;
}

export function serializeCookie(args: {
  name: string;
  value: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  path: string;
  maxAgeSeconds: number;
}): string {
  const parts: string[] = [];
  parts.push(`${args.name}=${encodeURIComponent(args.value)}`);
  parts.push(`Path=${args.path}`);
  parts.push(`Max-Age=${Math.floor(args.maxAgeSeconds)}`);
  parts.push(
    `SameSite=${args.sameSite[0]?.toUpperCase()}${args.sameSite.slice(1)}`
  );
  if (args.httpOnly) parts.push("HttpOnly");
  if (args.secure) parts.push("Secure");
  return parts.join("; ");
}
