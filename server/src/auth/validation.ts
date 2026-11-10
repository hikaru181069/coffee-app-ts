import { z } from "zod";

const email = z.string().trim().toLowerCase().pipe(z.email());
const newPassword = z.string().min(8).max(128);
const password = z.string().min(1).max(128);
const name = z.string().trim().min(1).max(50);

export const registerSchema = z.object({ email, password: newPassword, name });
export const loginSchema = z.object({ email, password });
export const changeNameSchema = z.object({ name });
export const changePasswordSchema = z.object({
  currentPassword: password,
  newPassword,
});
export const deleteAccountSchema = z.object({ password });
