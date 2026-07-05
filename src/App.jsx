import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DecksPage from "./pages/DecksPage";
import DeckDetailPage from "./pages/DeckDetailPage";
import QuizPage from "./pages/QuizPage";
import SearchPage from "./pages/SearchPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/decks"
            element={
              <ProtectedRoute>
                <DecksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/decks/:deckId"
            element={
              <ProtectedRoute>
                <DeckDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/decks/:deckId/quiz"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/decks" replace />} />
          <Route path="*" element={<Navigate to="/decks" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
