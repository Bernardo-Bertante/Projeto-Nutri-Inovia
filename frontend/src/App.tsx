import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Login } from "./components/Login";
import MainApp from "./MainApp";
import type { JSX } from "react";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { signed, loading } = useAuth();

  if (loading) return null;

  if (!signed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/appointments"
            element={
              <PrivateRoute>
                <MainApp />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/appointments" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
