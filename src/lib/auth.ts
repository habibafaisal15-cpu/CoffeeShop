import crypto from "crypto";
import {
  SESSION_MAX_AGE,
  adminCredentials,
  sessionSecret,
} from "@/lib/auth-session";

export {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  adminCredentials,
  sessionSecret,
} from "@/lib/auth-session";
export { verifySessionToken } from "@/lib/auth-session";

export function createSessionToken(): string {
  const payload = {
    role: "admin",
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", sessionSecret())
    .update(data)
    .digest("base64url");
  return `${data}.${sig}`;
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyAdminCredentials(
  username: string,
  password: string
): boolean {
  const creds = adminCredentials();
  return (
    safeEqual(username, creds.username) && safeEqual(password, creds.password)
  );
}
