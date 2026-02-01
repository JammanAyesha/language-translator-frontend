import { useState } from "react";
import API from "../services/api";
import LogoutButton from "../components/LogoutButton";

function TranslatePage() {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");

  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // 🔹 Translate
  const handleTranslate = async () => {
    setLoading(true);
    setError("");
    setSaved(false);
    setCopied(false);

    try {
      const response = await API.post("translate/", {
        source: sourceLang,
        target: targetLang,
        text: text,
      });

      setTranslatedText(response.data.translatedText || "");
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else if (err.response?.status === 503) {
        setError("Translation service unavailable.");
      } else {
        setError("Something went wrong.");
      }

      setTranslatedText("");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Swap languages
  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setText(translatedText);
    setTranslatedText(text);
    setSaved(false);
    setCopied(false);
  };

  // 🔹 Add to favorites
  const handleFavorite = async () => {
    try {
      await API.post("favorites/", {
        original_text: text,
        translated_text: translatedText,
        source_lang: sourceLang,
        target_lang: targetLang,
      });

      setSaved(true);
    } catch (err) {
      console.error(err);
      alert("Could not save favorite");
    }
  };

  // 🔹 Copy translated text
  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mt-4">

      {/* Logout */}
      <div className="d-flex justify-content-end mb-3">
        <LogoutButton />
      </div>

      <h4 className="mb-3">Translate</h4>

      {/* Language selectors */}
      <div className="row mb-2">
        <div className="col">
          <select
            className="form-select"
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ur">Urdu</option>
          </select>
        </div>

        <div className="col-auto d-flex align-items-center">
          <button
            className="btn btn-secondary"
            onClick={handleSwap}
            disabled={!translatedText}
            title="Swap languages"
          >
            🔄
          </button>
        </div>

        <div className="col">
          <select
            className="form-select"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
          >
            <option value="hi">Hindi</option>
            <option value="ur">Urdu</option>
          </select>
        </div>
      </div>

      {/* Input */}
      <textarea
        className="form-control"
        rows="4"
        placeholder="Enter text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* Translate button */}
      <button
        className="btn btn-primary mt-3"
        onClick={handleTranslate}
        disabled={loading || !text.trim()}
      >
        {loading ? "Translating..." : "Translate"}
      </button>

      {/* Error */}
      {error && (
        <div className="alert alert-danger mt-3">
          {error}
        </div>
      )}

      {/* Result */}
      {translatedText && (
        <div className="alert alert-success mt-3">

          <div className="d-flex justify-content-between align-items-center">
            <span>{translatedText}</span>

            <div>
              {/* Copy */}
              <button
                className="btn btn-outline-secondary me-2"
                onClick={handleCopy}
                title="Copy"
              >
                {copied ? "✅" : "📋"}
              </button>

              {/* Favorite */}
              <button
                className="btn btn-outline-warning"
                onClick={handleFavorite}
                disabled={saved}
                title="Add to favorites"
              >
                {saved ? "✅" : "⭐"}
              </button>
            </div>
          </div>

          {/* Toast */}
          {saved && (
            <div className="mt-2 text-success">
              Added to favorites ⭐
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default TranslatePage;
