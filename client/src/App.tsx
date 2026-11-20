import { Route, Routes } from "react-router";
import { useTranslation } from "react-i18next";
import { LoginPage } from "./pages/LoginPage.tsx";
import { RegisterPage } from "./pages/RegisterPage.tsx";
import { RecordsPage } from "./pages/RecordsPage.tsx";
import { RecordDetailPage } from "./pages/RecordDetailPage.tsx";
import { NewRecordPage } from "./pages/NewRecordPage.tsx";
import { Menu } from "./components/Menu.tsx";

function App() {
  const { t } = useTranslation();

  return (
    <>
      <Menu />
      <Routes>
        <Route path="/" element={<p>{t("pages.top")}</p>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<p>{t("pages.home")}</p>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/records" element={<RecordsPage />} />
        <Route path="/records/new" element={<NewRecordPage />} />
        <Route path="/records/:id" element={<RecordDetailPage />} />
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
