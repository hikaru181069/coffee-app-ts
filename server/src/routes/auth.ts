import { Hono } from "hono";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import { register, login, logout } from "../services/auth.ts";
import { requireAuth } from "../middleware/auth.ts";

export const authRoutes = new Hono();

authRoutes.get("/me", requireAuth, (c) => {
  return c.json(c.get("user"));
});

authRoutes.post("/register", async (c) => {
  const body = await c.req.json();
  const result = await register(body);

  if (!result.ok) {
    return c.json({ error: "このメールアドレスはすでに使われています" }, 409);
  }
  return c.json(result.user, 201);
});

authRoutes.post("/login", async (c) => {
  const body = await c.req.json();
  const result = await login(body);

  if (!result.ok) {
    return c.json({ error: "メールアドレスかパスワードがちがいます" }, 401);
  }

  setCookie(c, "session", result.sessionId, {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: result.expireAt,
  });
  return c.json(result.user);
});

authRoutes.post("/logout", async (c) => {
  const sessionId = getCookie(c, "session");
  if (sessionId) {
    await logout(sessionId);
  }

  deleteCookie(c, "session", { path: "/" });
  return c.body(null, 204);
});
