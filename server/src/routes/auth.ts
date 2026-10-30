import { Hono } from "hono";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import {
  register,
  login,
  logout,
  changeName,
  changePassword,
  deleteAccount,
} from "../services/auth.ts";
import { requireAuth } from "../middleware/auth.ts";

export const authRoutes = new Hono();

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

authRoutes.get("/me", requireAuth, (c) => {
  return c.json(c.get("user"));
});

authRoutes.patch("/me", requireAuth, async (c) => {
  const body = await c.req.json();
  const user = await changeName(c.get("user").id, body.name);
  return c.json(user);
});

authRoutes.patch("/password", requireAuth, async (c) => {
  const body = await c.req.json();
  const result = await changePassword(c.get("user").id, body);

  if (!result.ok) {
    if (result.error === "demo_user") {
      return c.json(
        { error: "お試し用アカウントではパスワードを変えられません" },
        403,
      );
    }
    return c.json({ error: "今のパスワードがちがいます" }, 400);
  }

  deleteCookie(c, "session", { path: "/" });
  return c.body(null, 204);
});

authRoutes.delete("/me", requireAuth, async (c) => {
  const body = await c.req.json();
  const result = await deleteAccount(c.get("user").id, body.password);

  if (!result.ok) {
    if (result.error === "demo_user") {
      return c.json({ error: "お試し用アカウントは退会できません" }, 403);
    }
    return c.json({ error: "パスワードがちがいます" }, 400);
  }

  deleteCookie(c, "session", { path: "/" });
  return c.body(null, 204);
});
