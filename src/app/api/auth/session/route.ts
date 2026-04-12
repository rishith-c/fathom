import { NextResponse } from "next/server";
import { z } from "zod";
import { AUTH_COOKIE_NAME, createSessionToken } from "@/lib/auth-session";

const authSchema = z.object({
  mode: z.enum(["signin", "signup"]),
  name: z.string().trim().min(2).max(60).optional(),
  email: z.string().trim().email(),
  password: z.string().min(8).max(120),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = authSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  }

  const { mode, name, email } = parsed.data;
  const normalizedName =
    name?.trim() || email.split("@")[0]?.replace(/[._-]+/g, " ") || "Fathom user";

  const response = NextResponse.json({
    ok: true,
    user: {
      name: normalizedName,
      email,
      mode,
    },
  });

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: createSessionToken({
      email,
      name: normalizedName,
      issuedAt: new Date().toISOString(),
    }),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    path: "/",
    maxAge: 0,
  });
  return response;
}
