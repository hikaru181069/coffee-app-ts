import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

export function Menu() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  function switchLanguage() {
    i18n.changeLanguage(i18n.language === "ja" ? "en" : "ja");
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    navigate("/login");
  }

  return (
    <nav>
      <Link to="/home">{t("pages.home")}</Link>
      <Link to="/records">{t("pages.records")}</Link>
      <Link to="/records/new">{t("pages.newRecord")}</Link>
      <Link to="/profile">{t("pages.profile")}</Link>
      <button onClick={switchLanguage}>{t("switchLanguage")}</button>
      <button onClick={handleLogout}>{t("menu.logout")}</button>
    </nav>
  );
}
