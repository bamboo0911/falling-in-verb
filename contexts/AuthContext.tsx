
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, firebase } from '../firebaseConfig';
import { logService } from '../services/logService';

// Define User type as any to avoid importing types from the raw module which causes runtime errors in this setup
type User = any;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set persistence to LOCAL on mount to avoid async delays during login click
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => logService.log("[Auth] Persistence set to LOCAL"))
      .catch((err) => logService.error("[Auth] Failed to set persistence", err));

    // Compat style subscription
    const unsubscribe = auth.onAuthStateChanged((currentUser: any) => {
      logService.log("[Auth] User state changed", { email: currentUser?.email, uid: currentUser?.uid });
      setUser(currentUser);
      setLoading(false);
    });

    // Handle redirect result (for mobile login)
    auth.getRedirectResult().then((result: any) => {
      if (result.user) {
        logService.log("[Auth] Redirect login successful", { email: result.user.email });
        setUser(result.user);
      } else {
        logService.log("[Auth] Redirect result null (no redirect happened or already handled)");
      }
    }).catch((err: any) => {
      logService.error("[Auth] Redirect login error", err);
      setError(err.message || "Login failed during redirect.");
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    logService.log("[Auth] Starting Google Sign In...");

    // Use the firebase instance exported from config
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      logService.log("[Auth] Attempting signInWithPopup...");

      // Try Popup first
      const result = await auth.signInWithPopup(provider);

      if (result.user) {
        logService.log("[Auth] Popup login successful", { email: result.user.email, uid: result.user.uid });
        setUser(result.user);
      } else {
        logService.warn("[Auth] Popup finished but no user returned");
      }
    } catch (err: any) {
      logService.error("[Auth] Popup error", err);

      // Check for popup blocked or closed
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
        logService.warn("[Auth] Popup blocked or closed. Falling back to Redirect...");
        try {
          await auth.signInWithRedirect(provider);
        } catch (redirectErr: any) {
          logService.error("[Auth] Redirect fallback failed", redirectErr);
          setError(redirectErr.message || "Login failed.");
          throw redirectErr;
        }
      } else {
        setError(err.message || "Login failed.");
        throw err;
      }
    }
  };

  const logout = async () => {
    try {
      // Compat style sign out
      await auth.signOut();
      setError(null);
    } catch (err: any) {
      console.error("[Auth] Error signing out", err);
      setError(err.message || "Logout failed.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signInWithGoogle, logout }}>
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
