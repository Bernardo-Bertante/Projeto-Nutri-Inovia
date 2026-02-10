import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import { api } from "../services/api";

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
    // verifica se já tem token salvo
    const storagedUser = localStorage.getItem("@NutriApp:user");
    const storagedToken = localStorage.getItem("@NutriApp:token");

    if (storagedToken && storagedUser) {
      // Se tiver, injeta ele em todas as requisições futuras
      api.defaults.headers.common["Authorization"] = `Bearer ${storagedToken}`;
      setUser(JSON.parse(storagedUser));
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
