import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "pickup_admin_session";

function getSecret() {
  return new TextEncoder().encode(
    process.env.ADMIN_JWT_SECRET || "dev-secret-change-this"
  );
}

export async function createSession(remember: boolean) {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(remember ? "30d" : "12h")
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 12,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function verifySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return false;

  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}