/**
 * Stateless, HMAC-signed admin session tokens for the private /admin area.
 *
 * There is no database in this prototype, so instead of a server-side
 * session store we sign a short-lived expiry timestamp with
 * WAGTI_ADMIN_CODE (a server-only environment variable — never bundled to
 * the client, never committed to the repo, see .env.example). The cookie
 * therefore proves "this request was issued a session by the login route
 * handler, which itself checked WAGTI_ADMIN_CODE", without ever putting the
 * admin code itself in the cookie or in client-side JavaScript.
 *
 * Runs in both the Node.js route handler and the Edge middleware runtime,
 * so it only uses Web Crypto (`crypto.subtle`), not Node's `crypto` module.
 *
 * Production replacement: real auth (magic link / SSO) issuing signed JWTs
 * or server-side sessions backed by a users/salon_members table with a
 * PLATFORM_OWNER role, instead of a single shared code.
 */

export const ADMIN_SESSION_COOKIE = "wagti_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function getSecret(): string {
  const code = process.env.WAGTI_ADMIN_CODE;
  if (!code) {
    throw new Error(
      "WAGTI_ADMIN_CODE is not set. Configure it as a server-side environment variable (see .env.example)."
    );
  }
  return code;
}

function toBase64Url(bytes: ArrayBuffer): string {
  const view = new Uint8Array(bytes);
  let binary = "";
  for (const byte of view) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmacSign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return toBase64Url(signature);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/** Verifies a submitted code against WAGTI_ADMIN_CODE. */
export function isValidAdminCode(submitted: string): boolean {
  const expected = getSecret();
  return submitted.length > 0 && timingSafeEqual(submitted, expected);
}

export async function createAdminSessionToken(): Promise<{ token: string; maxAge: number }> {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const signature = await hmacSign(String(expiresAt));
  return { token: `${expiresAt}.${signature}`, maxAge: Math.floor(SESSION_TTL_MS / 1000) };
}

export async function verifyAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [expiresAtStr, signature] = token.split(".");
  if (!expiresAtStr || !signature) return false;

  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

  try {
    const expectedSignature = await hmacSign(expiresAtStr);
    return timingSafeEqual(signature, expectedSignature);
  } catch {
    return false;
  }
}
