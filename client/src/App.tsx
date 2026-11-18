import { Route, Routes } from "react-router";
import { useTranslation } from "react-i18next";
import { LoginPage } from "./pages/LoginPage.tsx";
import { RegisterPage } from "./pages/RegisterPage.tsx";

function App() {
  const { t, i18n } = useTranslation();

  function switchLanguage() {
    i18n.changeLanguage(i18n.language === "ja" ? "en" : "ja");
  }

  return (
    <>
      <button onClick={switchLanguage}>{t("switchLanguage")}</button>
      <Routes>
        <Route path="/" element={<p>{t("pages.top")}</p>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<p>{t("pages.home")}</p>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/records" element={<p>{t("pages.records")}</p>} />
        <Route path="/records/new" element={<p>{t("pages.newRecord")}</p>} />
        <Route path="/records/:id" element={<p>{t("pages.recordDetail")}</p>} />
        <Route
          path="/records/:id/edit"
          element={<p>{t("pages.editRecord")}</p>}
        />
        <Route path="/profile" element={<p>{t("pages.profile")}</p>} />
      </Routes>
    </>
  );
}

export default App;
