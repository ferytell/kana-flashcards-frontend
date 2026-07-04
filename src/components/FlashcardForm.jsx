import { useState } from "react";
import "./FlashcardForm.css";

// Generic "front / back" flashcard, deliberately not kana-specific,
// so the same deck/card model works for any subject the user wants
// to memorize later.
export default function FlashcardForm({ initial, onSubmit, onCancel, submitLabel }) {
  const [front, setFront] = useState(initial?.front || "");
  const [back, setBack] = useState(initial?.back || "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;
    setSaving(true);
    await onSubmit({ front: front.trim(), back: back.trim() });
    setSaving(false);
  }

  return (
    <form className="flashcard-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="front">Front</label>
        <textarea
          id="front"
          rows={2}
          value={front}
          onChange={(e) => setFront(e.target.value)}
          placeholder="あ"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="back">Back</label>
        <textarea
          id="back"
          rows={2}
          value={back}
          onChange={(e) => setBack(e.target.value)}
          placeholder="a"
          required
        />
      </div>
      <div className="flashcard-form-actions">
        <button className="btn btn-primary btn-sm" type="submit" disabled={saving}>
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
