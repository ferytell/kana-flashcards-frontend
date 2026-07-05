# Kana Flashcards Frontend

A modern, full-featured flashcard application built with **React + TypeScript + Vite** for learning Japanese Kana (and any other subjects). Create decks, add flashcards, and practice with a quiz mode.

## Features

- **User Authentication** — Register and login
- **Deck Management** — Create, view, edit, and delete decks
- **Flashcard CRUD** — Add, edit, and delete flashcards within decks
- **Quiz Mode** — Practice your cards in a dedicated quiz interface
- **Search** — Global search across your flashcards (UI ready)
- **Responsive Design** — Clean and mobile-friendly UI
- **Protected Routes** — Secure access to user content

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Routing**: React Router DOM v7
- **Styling**: CSS Modules / vanilla CSS
- **State Management**: React Context (Auth)
- **Backend Integration**: REST API (fetch-based client)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A running backend API (see [backend repo](https://github.com/ferytell/kana-flashcards-backend) if available)

### Installation

1. Clone the repository
   git clone https://github.com/ferytell/kana-flashcards-frontend.git
   cd kana-flashcards-frontend

2. Install dependenciesbash
   npm install

3. Configure environment variablesCreate a .env file in the root:env
   VITE_API_BASE_URL=http://localhost:5000/api

4. Run the development server
   npm run dev
   Open http://localhost:5173 in your browser.

## Available Scripts

npm run dev — Start development server
npm run build — Build for production
npm run preview — Preview production build
npm run lint — Run ESLint

## How to Use

- Register / Login to create an account.
- Create a Deck (e.g., "Hiragana", "N5 Vocabulary").
- Add Flashcards with front (question) and back (answer).
- Practice by opening a deck and starting the Quiz.
- Use the Search feature to find cards across all decks.
