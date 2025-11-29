
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, firebase } from '../firebaseConfig';

// Define User type as any to avoid importing types from the raw module which causes runtime errors in this setup
type User = any;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Compat style subscription
    const unsubscribe = auth.onAuthStateChanged((currentUser: any) => {
      console.log("[Auth] User state changed:", currentUser?.email);
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    // Use the firebase instance exported from config
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      // Explicitly set persistence to LOCAL using Compat API
      await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      // Compat style sign in
      await auth.signInWithPopup(provider);
    } catch (error) {
      console.error("[Auth] Error signing in with Google", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Compat style sign out
      await auth.signOut();
    } catch (error) {
      console.error("[Auth] Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
