import type { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabase";

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  loginAsGuest: (testMode?: boolean) => Promise<void>;
  isTestMode: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTestMode, setIsTestMode] = useState(false);
  const userRef = useRef<User | null>(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);



  useEffect(() => {
    // Check on mount
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
      }
      setLoading(false);
    });

    // Listen to changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        // Check current user from ref to avoid stale closure
        const currentUser = userRef.current;
        if (!currentUser || currentUser.id !== 'guest') {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const loginAsGuest = async (testMode = false) => {
    setIsTestMode(testMode);
    // For guest login, we can just set a mock user or use anonymous auth if configured.
    // For this demo, we'll just set a local user state to bypass the check.
    // In a real app, you'd use supabase.auth.signInAnonymously()
    setUser({ id: 'guest', email: 'guest@example.com' } as any);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, loginAsGuest, isTestMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
