import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import "./QuizPage.css";

// Simple, forgiving match: trims whitespace and ignores case, so
// "Ookii" and "ookii " both count as correct. This is a reasonable
// default for typed guesses, not a guarantee it matches every backend
// answer format exactly (e.g. it won't understand synonyms).
function isCorrectGuess(guess, answer) {
  return guess.trim().toLowerCase() === String(answer).trim().toLowerCase();
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function QuizPage() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);

  useEffect(() => {
    loadQuiz();
  }, [deckId]);

  async function loadQuiz() {
    setLoading(true);
    setError(null);
    try {
      const [deckData, cardData] = await Promise.all([
        api.getDeck(deckId).catch(() => null),
        api.getFlashcards(deckId),
      ]);
      setDeck(deckData);
      setCards(shuffle(Array.isArray(cardData) ? cardData : []));
      setCurrentIndex(0);
      setScore(0);
      setAnswered(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const currentCard = cards[currentIndex];
  const isLastCard = currentIndex >= cards.length - 1;
  const quizComplete = cards.length > 0 && currentIndex >= cards.length;

  function handleGuessSubmit(e) {
    e.preventDefault();
    if (revealed || !currentCard) return;
    const correct = isCorrectGuess(guess, currentCard.answer);
    setWasCorrect(correct);
    setRevealed(true);
    setAnswered((a) => a + 1);
    if (correct) setScore((s) => s + 1);
  }

  function handleNext() {
    setGuess("");
    setRevealed(false);
    setWasCorrect(false);
    setCurrentIndex((i) => i + 1);
  }

  function handleRestart() {
    setCards((prev) => shuffle(prev));
    setCurrentIndex(0);
    setScore(0);
    setAnswered(0);
    setGuess("");
    setRevealed(false);
    setWasCorrect(false);
  }

  return (
    <div className="container">
      <Link to={`/decks/${deckId}`} className="back-link">
        ← Back to deck
      </Link>
      <h1>Quiz{deck?.title ? `: ${deck.title}` : ""}</h1>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p className="empty-state">Loading cards…</p>
      ) : cards.length === 0 ? (
        <p className="empty-state">
          This deck has no flashcards yet, so there's nothing to quiz on.
        </p>
      ) : quizComplete ? (
        <div className="card quiz-summary">
          <h2>Quiz complete</h2>
          <p className="quiz-score-final">
            {score} / {answered} correct
          </p>
          <button className="btn btn-primary" onClick={handleRestart}>
            Restart quiz
          </button>
        </div>
      ) : (
        <>
          <div className="quiz-progress">
            <span>
              Card {currentIndex + 1} of {cards.length}
            </span>
            <span className="quiz-score">Score: {score}</span>
          </div>

          <div className="card quiz-card">
            <p className="quiz-question">{currentCard.question}</p>
            {currentCard.category && (
              <span className="flashcard-item-category">{currentCard.category}</span>
            )}

            {!revealed ? (
              <form className="quiz-guess-form" onSubmit={handleGuessSubmit}>
                <input
                  type="text"
                  autoFocus
                  placeholder="Type your answer…"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                />
                <button className="btn btn-primary" type="submit">
                  Check
                </button>
              </form>
            ) : (
              <div className="quiz-result">
                <p className={wasCorrect ? "quiz-feedback-correct" : "quiz-feedback-wrong"}>
                  {wasCorrect ? "Correct!" : "Not quite."}
                </p>
                <p className="quiz-answer">
                  Answer: <strong>{currentCard.answer}</strong>
                </p>
                {guess.trim() && !wasCorrect && (
                  <p className="quiz-your-guess">Your guess: {guess}</p>
                )}
                <button className="btn btn-primary" onClick={handleNext}>
                  {isLastCard ? "Finish quiz" : "Next card"}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
