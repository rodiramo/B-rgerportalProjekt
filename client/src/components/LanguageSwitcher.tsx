import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  return (
    <select
      aria-label="Language"
      className="border rounded-md p-1"
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
    >
      <option value="de">DE</option>
      <option value="en">EN</option>
    </select>
  );
}
