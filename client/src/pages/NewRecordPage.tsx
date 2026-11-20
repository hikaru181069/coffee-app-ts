import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

type Option = { id: number; name: string; nameEn: string };

type Options = {
  origins: Option[];
  varieties: Option[];
  processes: Option[];
  roastLevels: Option[];
  flavors: Option[];
};

export function NewRecordPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [drankOn, setDrankOn] = useState("");
  const [place, setPlace] = useState("home");
  const [rating, setRating] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [options, setOptions] = useState<Options | null>(null);
  const [originId, setOriginId] = useState("");
  const [processId, setProcessId] = useState("");
  const [roastLevelId, setRoastLevelId] = useState("");
  const [varietyIds, setVarietyIds] = useState<number[]>([]);
  const [flavorIds, setFlavorIds] = useState<number[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/options");
      setOptions(await res.json());
    }
    load();
  }, []);

  function optionName(option: Option) {
    return i18n.language === "en" ? option.nameEn : option.name;
  }

  function toggle(ids: number[], id: number) {
    return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch("/api/records", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name,
        drankOn,
        place,
        rating: rating === "" ? undefined : Number(rating),
        notes: notes === "" ? undefined : notes,
        originId: originId === "" ? undefined : Number(originId),
        processId: processId === "" ? undefined : Number(processId),
        roastLevelId: roastLevelId === "" ? undefined : Number(roastLevelId),
        varietyIds,
        flavorIds,
      }),
    });

    if (res.status === 401) {
      navigate("/login");
      return;
    }
    if (!res.ok) {
      const body = await res.json();
      setError(body.error.code);
      return;
    }
    const record = await res.json();
    navigate(`/records/${record.id}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>{t("pages.newRecord")}</h1>
      <label>
        {t("form.name")}
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        {t("form.drankOn")}
        <input
          type="date"
          value={drankOn}
          onChange={(e) => setDrankOn(e.target.value)}
        />
      </label>
      <label>
        {t("form.place")}
        <select value={place} onChange={(e) => setPlace(e.target.value)}>
          <option value="home">{t("detail.place.home")}</option>
          <option value="cafe">{t("detail.place.cafe")}</option>
        </select>
      </label>
      <label>
        {t("form.origin")}
        <select value={originId} onChange={(e) => setOriginId(e.target.value)}>
          <option value="">{t("form.none")}</option>
          {options?.origins.map((o) => (
            <option key={o.id} value={o.id}>
              {optionName(o)}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t("form.process")}
        <select
          value={processId}
          onChange={(e) => setProcessId(e.target.value)}
        >
          <option value="">{t("form.none")}</option>
          {options?.processes.map((o) => (
            <option key={o.id} value={o.id}>
              {optionName(o)}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t("form.roastLevel")}
        <select
          value={roastLevelId}
          onChange={(e) => setRoastLevelId(e.target.value)}
        >
          <option value="">{t("form.none")}</option>
          {options?.roastLevels.map((o) => (
            <option key={o.id} value={o.id}>
              {optionName(o)}
            </option>
          ))}
        </select>
      </label>
      <fieldset>
        <legend>{t("form.varieties")}</legend>
        {options?.varieties.map((o) => (
          <label key={o.id}>
            <input
              type="checkbox"
              checked={varietyIds.includes(o.id)}
              onChange={() => setVarietyIds(toggle(varietyIds, o.id))}
            />
            {optionName(o)}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>{t("form.flavors")}</legend>
        {options?.flavors.map((o) => (
          <label key={o.id}>
            <input
              type="checkbox"
              checked={flavorIds.includes(o.id)}
              onChange={() => setFlavorIds(toggle(flavorIds, o.id))}
            />
            {optionName(o)}
          </label>
        ))}
      </fieldset>
      <label>
        {t("form.rating")}
        <input
          type="number"
          min={1}
          max={10}
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
      </label>
      <label>
        {t("form.notes")}
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </label>
      {error && <p>{t(`errors.${error}`)}</p>}
      <button type="submit">{t("form.submit")}</button>
    </form>
  );
}
