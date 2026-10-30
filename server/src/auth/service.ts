import {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
} from "./users.ts";
import { hashPassword, verifyPassword } from "../lib/password.ts";
import {
  createSession,
  findSessionWithUser,
  deleteSession,
  deleteSessionsByUserId,
} from "./sessions.ts";
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

export async function changeName(userId: number, name: string) {
  const user = await updateUser(userId, { name });
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isDemo: user.isDemo,
  };
}

type ProfileResult =
  | { ok: true }
  | { ok: false; error: "demo_user" | "wrong_password" };

export async function changePassword(
  userId: number,
  input: { currentPassword: string; newPassword: string },
): Promise<ProfileResult> {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("user not found");
  }
  if (user.isDemo) {
    return { ok: false, error: "demo_user" };
  }

  const valid = await verifyPassword(user.passwordHash, input.currentPassword);
  if (!valid) {
    return { ok: false, error: "wrong_password" };
  }

  const passwordHash = await hashPassword(input.newPassword);
  await updateUser(userId, { passwordHash });
  await deleteSessionsByUserId(userId);
  return { ok: true };
}

export async function deleteAccount(
  userId: number,
  password: string,
): Promise<ProfileResult> {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("user not found");
  }
  if (user.isDemo) {
    return { ok: false, error: "demo_user" };
  }

  const valid = await verifyPassword(user.passwordHash, password);
  if (!valid) {
    return { ok: false, error: "wrong_password" };
  }

  await deleteUser(userId);
  return { ok: true };
}
