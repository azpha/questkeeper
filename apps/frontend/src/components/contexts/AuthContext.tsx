import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useMemo,
} from "react";
import api from "../../utils/api";
import type { User } from "@/utils/types";

const AuthContext = createContext<{
  currentUser: User | null;
  hasAuthLoaded: boolean;
  isUserAuthenticated: boolean;
  invalidateAuth: () => void;
  loadUserAuth: () => void;
} | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hasAuthLoaded, setHasAuthLoaded] = useState<boolean>(false);

  const loadUserAuth = async () => {
    api
      .fetchCurrentUser()
      .then((res) => setCurrentUser(res))
      .catch(() => setCurrentUser(null));

    setHasAuthLoaded(true);
  };

  useEffect(() => {
    loadUserAuth();
  }, []);

  const isUserAuthenticated = useMemo(() => !!currentUser, [currentUser]);
  const invalidateAuth = async () => {
    setCurrentUser(null);
    await api.logUserOut();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        hasAuthLoaded,
        isUserAuthenticated,
        invalidateAuth,
        loadUserAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthContext must be used in an AuthProvider");
  }
  return context;
};
