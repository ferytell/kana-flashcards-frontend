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

    if (!values || (!values.question?.trim() && !values.answer?.trim())) {
      setError("Question and answer cannot be empty");
      return;
    }

    try {
      const updated = await api.updateFlashcard(deckId, cardId, values);

      const normalizedUpdate = {
        id: updated.id ?? updated.cardId ?? cardId,
        question: updated.question ?? values.question,
        answer: updated.answer ?? values.answer,
        deckId: updated.deckId ?? deckId,
        ...updated,
      };

      setCards((prev) =>
        prev.map((c) => {
          if (c.id == cardId) {
            return { ...c, ...normalizedUpdate };
          }
          return c;
        }),
      );
    } catch (err) {
      setError(err.message || "Failed to update flashcard");
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
      <div className="deck-detail-header">
        <h1>{deck?.title || "Deck"}</h1>
        {cards.length > 0 && (
          <Link to={`/decks/${deckId}/quiz`} className="btn btn-primary btn-sm">
            Start quiz
          </Link>
        )}
      </div>
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
