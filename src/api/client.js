// Single place that knows how to talk to the Spring Boot backend.
// If an endpoint path changes on the backend, this is the only file you edit.

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ENDPOINTS = {
  login: "/auth/login",
  register: "/auth/register",
  decks: "/decks",
  deck: (id) => `/decks/${id}`,
  flashcards: (deckId) => `/decks/${deckId}/cards`,
  flashcard: (deckId, cardId) => `/decks/${deckId}/cards/${cardId}`,
  //flashcard: (id) => `/decks/${id}/cards`,
  // Not built on the backend yet — see search() below.
  search: "/search",
};

function getToken() {
  console.log("getToken called, token:", localStorage.getItem("token"));
  return localStorage.getItem("token");
}

function setToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  console.log(`Requesting ${method} ${BASE_URL}${path} with body:`, body);
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    console.log(`Requesting ${method} ${BASE_URL}${path} with body:`, body);
    console.error("Network error while making request:", networkErr);
    throw new Error(
      "Could not reach the server. Is the backend running at " + BASE_URL + "?",
    );
  }

  if (response.status === 401) {
    setToken(null);
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch {
      // response had no JSON body — keep the generic message
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json().catch(() => null);
}

export const api = {
  // --- auth ---

  login: (credentials) => {
    console.log("BASE_URL:", BASE_URL);
    return request(ENDPOINTS.login, {
      method: "POST",
      body: credentials,
      auth: false,
    });
  },
  register: (details) =>
    request(ENDPOINTS.register, { method: "POST", body: details, auth: false }),

  // --- decks ---
  getDecks: () => request(ENDPOINTS.decks),
  getDeck: (id) => request(ENDPOINTS.deck(id)),
  createDeck: (deck) =>
    request(ENDPOINTS.decks, { method: "POST", body: deck }),
  updateDeck: (id, deck) =>
    request(ENDPOINTS.deck(id), { method: "PUT", body: deck }),
  deleteDeck: (id) => request(ENDPOINTS.deck(id), { method: "DELETE" }),

  // --- flashcards ---
  getFlashcards: (deckId) => request(ENDPOINTS.flashcards(deckId)),
  createFlashcard: (deckId, card) =>
    request(ENDPOINTS.flashcards(deckId), { method: "POST", body: card }),
  updateFlashcard: (deckId, cardId, card) =>
    request(ENDPOINTS.flashcard(deckId, cardId), { method: "PUT", body: card }),
  deleteFlashcard: (deckId, cardId) =>
    request(ENDPOINTS.flashcard(deckId, cardId), { method: "DELETE" }),

  // --- search ---
  // (`${ENDPOINTS.search}?q=${encodeURIComponent(query)}`)
  search: async (query) => {
    throw new Error("NOT_IMPLEMENTED");
  },
};

export { getToken, setToken, BASE_URL };
