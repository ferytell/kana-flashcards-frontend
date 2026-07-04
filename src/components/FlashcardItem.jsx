import { useState } from "react";
import FlashcardForm from "./FlashcardForm";
import "./FlashcardItem.css";

export default function FlashcardItem({ card, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li className="card flashcard-item">
        <FlashcardForm
          initial={card}
          submitLabel="Save changes"
          onCancel={() => setEditing(false)}
          onSubmit={async (values) => {
            await onUpdate(card.id, values);
            setEditing(false);
          }}
        />
      </li>
    );
  }

  return (
    <li className="card flashcard-item">
      <div className="flashcard-item-content">
        <span className="flashcard-item-front">{card.question}</span>
        <span className="flashcard-item-back">{card.answer}</span>
        {card.category && (
          <span className="flashcard-item-category">{card.category}</span>
        )}
      </div>
      <div className="flashcard-item-actions">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setEditing(true)}
        >
          Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(card.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
