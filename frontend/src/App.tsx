import { useState, useEffect } from "react";
import { rewriteMessage } from "./api";
import "./App.css";
import {
  translations,
  languageOptions,
  countriesByLang,
} from "./i18n";


function App() {
  const [message, setMessage] = useState("");
  const [rewritten, setRewritten] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<"en" | "ja" | "zh" | "de" | "fr" | "es">("en");
  const [country, setCountry] = useState<string>(countriesByLang.en[0]);

  
  const handleRewrite = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setRewritten(null);

    try {
      const res = await rewriteMessage(
        message,
        "Foreigner",
        `${lang}${country ? ` - ${country}` : ""}`
      );
      setRewritten(res.rewritten);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const defaultCountry = countriesByLang[lang] && countriesByLang[lang][0];
    if (defaultCountry) setCountry(defaultCountry);
  }, [lang]);

  return (
    <div className="app-root">
      <div className="app-card">
        <header className="app-header">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1>{translations[lang].title}</h1>
              <p>{translations[lang].subtitle}</p>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <label style={{ fontSize: 12 }}>{translations[lang].languageLabel}:</label>
              <select value={lang} onChange={(e) => setLang(e.target.value as any)}>
                {languageOptions.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <section style={{ marginTop: 12, marginBottom: 8 }}>
          <label style={{ display: "block", marginBottom: 6 }}>{translations[lang].countryLabel}</label>
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            {(countriesByLang[lang] || []).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </section>

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
        Built to help foreigners and Japanese users communicate comfortably
      </footer>
    </div>
  );
}

export default App;
