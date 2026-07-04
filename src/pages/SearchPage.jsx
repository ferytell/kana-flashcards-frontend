import { useState } from "react";
import { api } from "../api/client";
import "./SearchPage.css";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notImplemented, setNotImplemented] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setNotImplemented(false);
    try {
      const data = await api.search(query.trim());
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.message === "NOT_IMPLEMENTED") {
        setNotImplemented(true);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>Search</h1>
      <p className="search-hint">
        Search across your decks and flashcards.
      </p>

      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="search"
          placeholder="Search flashcards…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {notImplemented && (
        <div className="empty-state search-placeholder">
          Search isn't available yet — the backend endpoint hasn't been
          built. This page is wired up and ready to go as soon as it is.
        </div>
      )}

      {error && <div className="error-banner">{error}</div>}

      {results && results.length === 0 && !notImplemented && (
        <p className="empty-state">No matches for "{query}".</p>
      )}

      {results && results.length > 0 && (
        <ul className="search-results">
          {results.map((card) => (
            <li key={card.id} className="card search-result-item">
              <span className="flashcard-item-front">{card.front}</span>
              <span className="flashcard-item-back">{card.back}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
