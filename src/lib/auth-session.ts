import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "fathom_session";

export interface AuthSession {
  readonly email: string;
  readonly name: string;
  readonly issuedAt: string;
}

function getSessionSecret() {
  return process.env.SESSION_SECRET ?? process.env.AUTH_SECRET ?? "fathom-local-session-secret";
}

function encodePayload(session: AuthSession) {
  return Buffer.from(JSON.stringify(session)).toString("base64url");
}

function decodePayload(value: string) {
  try {
    const decoded = Buffer.from(value, "base64url").toString("utf8");
    return JSON.parse(decoded) as AuthSession;
  } catch {
    return null;
  }
}

function sign(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

export function createSessionToken(session: AuthSession) {
  const payload = encodePayload(session);
  return `${payload}.${sign(payload)}`;
}

export function readSessionToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expected = sign(payload);
  const isMatch =
    expected.length === signature.length &&
    timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

  if (!isMatch) {
    return null;
  }

  return decodePayload(payload);
}

export async function getAuthSession() {
  const cookieStore = await cookies();
  return readSessionToken(cookieStore.get(AUTH_COOKIE_NAME)?.value);
}
