import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import "./DecksPage.css";

export default function DecksPage() {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [newDeckDescription, setNewDeckDescription] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadDecks();
  }, []);

  async function loadDecks() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDecks();
      setDecks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!newDeckTitle.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const deck = await api.createDeck({
        title: newDeckTitle.trim(),
        description: newDeckDescription.trim(),
      });
      setDecks((prev) => [...prev, deck]);
      setNewDeckTitle("");
      setNewDeckDescription("");
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this deck and all its flashcards?")) return;
    setError(null);
    try {
      await api.deleteDeck(id);
      setDecks((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container">
      <h1>Your decks</h1>

      {error && <div className="error-banner">{error}</div>}

      <form className="deck-create" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Deck title (e.g. N5 Kana, Element Symbols)"
          value={newDeckTitle}
          onChange={(e) => setNewDeckTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={newDeckDescription}
          onChange={(e) => setNewDeckDescription(e.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={creating}>
          {creating ? "Adding…" : "Add deck"}
        </button>
      </form>

      {loading ? (
        <p className="empty-state">Loading decks…</p>
      ) : decks.length === 0 ? (
        <p className="empty-state">
          No decks yet. Create one above to start adding flashcards.
        </p>
      ) : (
        <ul className="deck-list">
          {decks.map((deck) => (
            <li key={deck.id} className="card deck-item">
              <Link to={`/decks/${deck.id}`} className="deck-item-name">
                {deck.title}
                {deck.description && (
                  <span className="deck-item-description">
                    {deck.description}
                  </span>
                )}
              </Link>
              <div className="deck-item-actions">
                <Link
                  to={`/decks/${deck.id}`}
                  className="btn btn-secondary btn-sm"
                >
                  Edit cards
                </Link>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(deck.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
