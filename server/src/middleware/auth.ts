import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { getCurrentUser } from "../services/auth.ts";

type AuthUser = { id: number; email: string; name: string; isDemo: boolean };

export const requireAuth = createMiddleware<{ Variables: { user: AuthUser } }>(
  async (c, next) => {
    const sessionId = getCookie(c, "session");
    if (!sessionId) {
      return c.json({ error: "ログインしてください" }, 401);
    }

    const user = await getCurrentUser(sessionId);
    if (!user) {
      return c.json({ error: "ログインしてください" }, 401);
    }

    c.set("user", user);
    await next();
  },
);
