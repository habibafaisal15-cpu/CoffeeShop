export const SESSION_COOKIE = "brewed_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

export function sessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ??
    "brewed-dev-session-secret-change-in-production"
  );
}

export function adminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? "admin",
    password: process.env.ADMIN_PASSWORD ?? "brewed123",
  };
}

function base64UrlToString(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
  return atob(padded);
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function signSessionData(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data)
  );
  return bytesToBase64Url(new Uint8Array(signature));
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function verifySessionToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;

  const dot = token.indexOf(".");
  if (dot === -1) return false;

  const data = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!data || !sig) return false;

  const expected = await signSessionData(data, sessionSecret());
  if (!safeEqual(sig, expected)) return false;

  try {
    const payload = JSON.parse(base64UrlToString(data)) as {
      role?: string;
      exp?: number;
    };
    return payload.role === "admin" && (payload.exp ?? 0) > Date.now();
  } catch {
    return false;
  }
}
