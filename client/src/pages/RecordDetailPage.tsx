import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";

type CoffeeRecord = {
  id: number;
  name: string;
  drankOn: string;
  place: "home" | "cafe";
  rating: number | null;
  notes: string | null;
};

export function RecordDetailPage() {
  // 1. 道具と値を用意する
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [record, setRecord] = useState<CoffeeRecord | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/records/${id}`);
      if (res.status === 401) {
        navigate("/login");
        return;
      }
      if (!res.ok) {
        setNotFound(true);
        return;
      }
      setRecord(await res.json());
    }
    load();
  }, [id, navigate]);

  // 2. ボタンなどを押したときの処理
  async function handleDelete() {
    if (!confirm(t("detail.confirmDelete"))) return;

    const res = await fetch(`/api/records/${id}`, { method: "DELETE" });
    if (res.status === 401) {
      navigate("/login");
      return;
    }
    navigate("/records");
  }

  // 3. 画面の形を返す
  if (notFound) return <p>{t("detail.notFound")}</p>;
  if (!record) return <p>{t("detail.loading")}</p>;

  return (
    <div>
      <h1>{record.name}</h1>
      <p>{record.drankOn}</p>
      <p>{t(`detail.place.${record.place}`)}</p>
      {record.rating && <p>{record.rating}/10</p>}
      {record.notes && <p>{record.notes}</p>}
      <Link to={`/records/${record.id}/edit`}>{t("detail.edit")}</Link>
      <button onClick={handleDelete}>{t("detail.delete")}</button>
    </div>
  );
}
