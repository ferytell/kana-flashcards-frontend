import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import "./SearchPage.css";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const data = await api.search(query.trim());
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>Search</h1>
      <p className="search-hint">Search across your decks and flashcards.</p>

      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="search"
          placeholder="Search decks by title…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {error && <div className="error-banner">{error}</div>}

      {results && results.length === 0 && (
        <p className="empty-state">No decks found for "{query}".</p>
      )}

      {results && results.length > 0 && (
        <div className="search-results">
          {results.map((deck) => (
            <div key={deck.id} className="card search-result-item">
              <h3>
                <Link to={`/decks/${deck.id}`}>{deck.title}</Link>
              </h3>
              {deck.description && (
                <p className="deck-description">{deck.description}</p>
              )}
              <p className="flashcard-count">
                {deck.flashcards?.length || 0} flashcards
              </p>
              {deck.flashcards && deck.flashcards.length > 0 && (
                <ul className="flashcard-preview-list">
                  {deck.flashcards.slice(0, 3).map((card) => (
                    <li key={card.id} className="flashcard-preview">
                      <span className="question">{card.question}</span>
                      <span className="answer">{card.answer}</span>
                    </li>
                  ))}
                  {deck.flashcards.length > 3 && (
                    <li className="more-cards">
                      +{deck.flashcards.length - 3} more…
                    </li>
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
