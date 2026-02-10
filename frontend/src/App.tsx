import { useState, useEffect } from "react";
import { rewriteMessage } from "./api";
import "./App.css";
import {
  translations,
  languageOptions,
  countriesByLang,
  languageNames,
  localizedCountries,
} from "./i18n";


function App() {
  const [message, setMessage] = useState("");
  const [rewritten, setRewritten] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<"en" | "ja" | "zh" | "de" | "fr" | "es">("en");
  const [country, setCountry] = useState<string>(countriesByLang.en[0]);
  const [targetLang, setTargetLang] = useState<"en" | "ja" | "zh" | "de" | "fr" | "es">("en");
  
  const flagByLang: Record<string, string> = {
    en: "🇺🇸",
    ja: "🇯🇵",
    zh: "🇨🇳",
    de: "🇩🇪",
    fr: "🇫🇷",
    es: "🇪🇸",
  };

  const countryFlag: Record<string, string> = {
    "United States": "🇺🇸",
    "United Kingdom": "🇬🇧",
    Canada: "🇨🇦",
    Australia: "🇦🇺",
    Japan: "🇯🇵",
    China: "🇨🇳",
    Taiwan: "🇹🇼",
    Singapore: "🇸🇬",
    Germany: "🇩🇪",
    Austria: "🇦🇹",
    Switzerland: "🇨🇭",
    France: "🇫🇷",
    Belgium: "🇧🇪",
    Spain: "🇪🇸",
    Mexico: "🇲🇽",
    Colombia: "🇨🇴",
    Argentina: "🇦🇷",
  };

  
  const handleRewrite = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setRewritten(null);

    try {
      const res = await rewriteMessage(
        message,
        "Foreigner",
        `${targetLang}${country ? ` - ${country}` : ""}`
      );
      setRewritten(res.rewritten);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const defaultCountry = countriesByLang[targetLang] && countriesByLang[targetLang][0];
    if (defaultCountry) setCountry(defaultCountry);
  }, [targetLang]);

  return (
    <div className="app-root">
      <div className="app-card">
        <header className="app-header">
          <div>
            <h1>{translations[lang].title}</h1>
            <p>{translations[lang].subtitle}</p>
          </div>
        </header>

        <div className="steps">
          <ol>
            <li>{translations[lang].step1}</li>
            <li>{translations[lang].step2}</li>
            <li>{translations[lang].step3}</li>
          </ol>
        </div>

        <div className="lang-row">
          <div className="lang-column">
            <label style={{ display: "block", marginBottom: 6 }}>{translations[lang].uiLanguageLabel}</label>
            <select value={lang} onChange={(e) => setLang(e.target.value as any)}>
              {languageOptions.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {flagByLang[opt.code]} {languageNames[lang][opt.code]}
                </option>
              ))}
            </select>
          </div>

          <div className="lang-column">
            <label style={{ display: "block", marginBottom: 6 }}>{translations[lang].targetLanguageLabel}</label>
            <select value={targetLang} onChange={(e) => setTargetLang(e.target.value as any)}>
              {languageOptions.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {flagByLang[opt.code]} {languageNames[lang][opt.code]}
                </option>
              ))}
            </select>
          </div>

          <div className="lang-column country-select">
            <label style={{ display: "block", marginBottom: 6 }}>{translations[lang].countryLabel}</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)}>
              {(countriesByLang[targetLang] || []).map((c, idx) => (
                <option key={c} value={c}>
                  {countryFlag[c] ? `${countryFlag[c]} ` : ""}{(localizedCountries[lang] && localizedCountries[lang][targetLang]) ? localizedCountries[lang][targetLang][idx] : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        

        <section className="input-section">
          <label>{translations[lang].yourMessage}</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder={translations[lang].placeholder}
          />
        </section>

        <button
          className="primary-button"
          onClick={handleRewrite}
          disabled={loading || !message.trim()}
        >
          {loading ? translations[lang].refining : translations[lang].improveButton}
        </button>

        {rewritten && (
          <section className="result-section">
            <div className="result-header">
              {translations[lang].aiSuggested}
            </div>
            <div className="result-bubble">
              {rewritten}
            </div>
          </section>
        )}
      </div>

      <footer className="app-footer">
        {translations[lang].footer}
      </footer>
    </div>
  );
}

export default App;
