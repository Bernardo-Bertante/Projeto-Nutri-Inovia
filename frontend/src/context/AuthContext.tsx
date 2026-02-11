import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import { api } from "../services/api";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response, // Se sucesso, não faz nada
      (error) => {
        if (error.response?.status === 401) {
          if (!error.config.url.includes("/auth/login")) {
            confirm("Token de acesso expirado. Realize login novamente.");
            clearAuthData();
          }
        }
        return Promise.reject(error);
      },
    );
    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, []);

  useEffect(() => {
    const storagedUser = localStorage.getItem("@NutriApp:user");
    const storagedToken = localStorage.getItem("@NutriApp:token");

    if (storagedToken && storagedUser) {
      try {
        const decoded = jwtDecode(storagedToken);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
          // --- TOKEN EXPIRADO ---
          confirm("Token de acesso expirado. Realize login novamente.");
          clearAuthData();
        } else {
          // --- TOKEN VÁLIDO ---
          api.defaults.headers.common["Authorization"] =
            `Bearer ${storagedToken}`;
          setUser(JSON.parse(storagedUser));
        }
      } catch (error) {
        console.error("Token inválido no storage:", error);
        clearAuthData();
      }
    }

    setLoading(false);
  }, []);

  async function signIn(email: string, pass: string) {
    try {
      const response = await api.post("/auth/login", {
        email,
        password: pass,
      });

      const { access_token, user } = response.data;

      // salva no navegador
      localStorage.setItem("@NutriApp:user", JSON.stringify(user));
      localStorage.setItem("@NutriApp:token", access_token);

      // configura o token para as próximas requisições
      api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      setUser(user);
    } catch (error) {
      console.error("Erro ao logar", error);
      throw new Error("E-mail ou senha inválidos");
    }
  }

  function signOut() {
    if (!confirm("Tem certeza que deseja sair do sistema?")) return;
    localStorage.clear();
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
  }

  function clearAuthData() {
    localStorage.removeItem("@NutriApp:user");
    localStorage.removeItem("@NutriApp:token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, signIn, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
