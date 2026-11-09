"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

import { auth } from "@/lib/firebase";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  profileVersion: number;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(auth));
  const [profileVersion, setProfileVersion] = useState(0);

  useEffect(() => {
    if (!auth) return;

    return onAuthStateChanged(
      auth,
      (nextUser) => {
        setUser(nextUser);
        setLoading(false);
      },
      (error) => {
        console.error("Firebase auth state listener failed", error);
        setUser(null);
        setLoading(false);
      },
    );
  }, []);

  const refreshUser = async () => {
    const currentUser = auth?.currentUser;
    if (!currentUser) return;
    await currentUser.reload();
    setUser(auth?.currentUser ?? null);
    setProfileVersion((version) => version + 1);
  };

  return (
    <AuthContext.Provider value={{ user, loading, profileVersion, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return value;
}
