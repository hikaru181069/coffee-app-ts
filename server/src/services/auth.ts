import { findUserByEmail, createUser } from "../repositories/users.ts";
import { hashPassword, verifyPassword } from "../lib/password.ts";
import {
  createSession,
  findSessionWithUser,
  deleteSession,
} from "../repositories/sessions.ts";
import { createSessionId } from "../lib/session.ts";

const SESSION_DAYS = 30;

type RegisterResult =
  | { ok: true; user: { id: number; email: string; name: string } }
  | { ok: false; error: "email_taken" };

export async function register(input: {
  email: string;
  password: string;
  name: string;
}): Promise<RegisterResult> {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    return { ok: false, error: "email_taken" };
  }

  const passwordHash = await hashPassword(input.password);
  const user = await createUser({
    email: input.email,
    passwordHash,
    name: input.name,
  });

  return {
    ok: true,
    user: { id: user.id, email: user.email, name: user.name },
  };
}

type LoginResult =
  | {
      ok: true;
      sessionId: string;
      expireAt: Date;
      user: { id: number; email: string; name: string };
    }
  | { ok: false; error: "invalid_credentials" };

export async function login(input: {
  email: string;
  password: string;
}): Promise<LoginResult> {
  const user = await findUserByEmail(input.email);
  if (!user) {
    return { ok: false, error: "invalid_credentials" };
  }

  const valid = await verifyPassword(user.passwordHash, input.password);
  if (!valid) {
    return { ok: false, error: "invalid_credentials" };
  }

  const session = await createSession({
    id: createSessionId(),
    userId: user.id,
    expireAt: new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000),
  });

  return {
    ok: true,
    sessionId: session.id,
    expireAt: session.expireAt,
    user: { id: user.id, email: user.email, name: user.name },
  };
}

export async function getCurrentUser(sessionId: string) {
  const found = await findSessionWithUser(sessionId);
  if (!found) {
    return null;
  }

  if (found.session.expireAt < new Date()) {
    await deleteSession(sessionId);
    return null;
  }

  const { user } = found;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isDemo: user.isDemo,
  };
}

export async function logout(sessionId: string) {
  await deleteSession(sessionId);
}
