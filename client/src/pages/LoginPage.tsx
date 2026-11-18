import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error.code);
      return;
    }
    navigate("/home");
  }

  async function handleDemo() {
    await fetch("/api/auth/demo", { method: "POST" });
    navigate("/records");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>{t("pages.login")}</h1>
      <label>
        {t("login.email")}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        {t("login.password")}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {error && <p>{t(`errors.${error}`)}</p>}
      <button type="submit">{t("login.submit")}</button>
      <Link to="/register">{t("login.toRegister")}</Link>
      <button type="button" onClick={handleDemo}>
        {t("login.demo")}
      </button>
    </form>
  );
}
