import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import FlashcardForm from "../components/FlashcardForm";
import FlashcardItem from "../components/FlashcardItem";
import "./DeckDetailPage.css";

export default function DeckDetailPage() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadDeck();
  }, [deckId]);

  async function loadDeck() {
    setLoading(true);
    setError(null);
    try {
      const [deckData, cardData] = await Promise.all([
        api.getDeck(deckId).catch(() => null),
        api.getFlashcards(deckId),
      ]);
      setDeck(deckData);
      setCards(Array.isArray(cardData) ? cardData : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(values) {
    setError(null);
    try {
      const card = await api.createFlashcard(deckId, values);
      setCards((prev) => [...prev, card]);
      setShowAddForm(false);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdate(cardId, values) {
    setError(null);
    try {
      const updated = await api.updateFlashcard(cardId, values);
      setCards((prev) => prev.map((c) => (c.id === cardId ? updated : c)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(cardId) {
    if (!window.confirm("Delete this flashcard?")) return;
    setError(null);
    try {
      await api.deleteFlashcard(cardId);
      setCards((prev) => prev.filter((c) => c.id !== cardId));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container">
      <Link to="/decks" className="back-link">
        ← All decks
      </Link>
      <h1>{deck?.title || "Deck"}</h1>
      {deck?.description && (
        <p className="deck-description">{deck.description}</p>
      )}

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p className="empty-state">Loading flashcards…</p>
      ) : (
        <>
          {cards.length === 0 && !showAddForm && (
            <p className="empty-state">
              No flashcards yet. Add the first one below.
            </p>
          )}

          <ul className="flashcard-list">
            {cards.map((card) => (
              <FlashcardItem
                key={card.id}
                card={card}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </ul>

          {showAddForm ? (
            <div className="card">
              <FlashcardForm
                submitLabel="Add card"
                onCancel={() => setShowAddForm(false)}
                onSubmit={handleAdd}
              />
            </div>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              + Add flashcard
            </button>
          )}
        </>
      )}
    </div>
  );
}
