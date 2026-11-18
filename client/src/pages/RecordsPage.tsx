import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

type CoffeeRecord = {
  id: number;
  name: string;
  drankOn: string;
  rating: number;
};

export function RecordsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [records, setRecords] = useState<CoffeeRecord[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/records");
      if (res.status === 401) {
        navigate("/login");
        return;
      }
      setRecords(await res.json());
    }
    load();
  }, [navigate]);

  return (
    <div>
      <h1>{t("pages.records")}</h1>
      <ul>
        {records.map((record) => (
          <li key={record.id}>
            <Link to={`/records/${record.id}`}>{record.name}</Link>
            {record.drankOn} {record.rating}/10
          </li>
        ))}
      </ul>
    </div>
  );
}
