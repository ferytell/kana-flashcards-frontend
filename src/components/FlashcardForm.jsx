import { useState } from "react";
import "./FlashcardForm.css";

export default function FlashcardForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}) {
  const [question, setQuestion] = useState(initial?.question || "");
  const [answer, setAnswer] = useState(initial?.answer || "");
  const [category, setCategory] = useState(initial?.category || "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    setSaving(true);
    await onSubmit({
      question: question.trim(),
      answer: answer.trim(),
      category: category.trim(),
    });
    setSaving(false);
  }

  return (
    <form className="flashcard-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="question">Question</label>
        <textarea
          id="question"
          rows={2}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="大きい"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="answer">Answer</label>
        <textarea
          id="answer"
          rows={2}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Ookii (Big)"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="category">Category</label>
        <input
          id="category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Japanese"
        />
      </div>
      <div className="flashcard-form-actions">
        <button
          className="btn btn-primary btn-sm"
          type="submit"
          disabled={saving}
        >
          {saving ? "Saving…" : submitLabel || "Save"}
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
