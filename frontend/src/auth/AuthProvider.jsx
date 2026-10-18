import { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { authConfigured, getAuthClient } from "./firebase";
import { AuthContext } from "./context";

let initialClient = null;
let initializationFailed = false;
try {
  initialClient = getAuthClient();
} catch {
  initializationFailed = true;
}

/** Owns the Firebase session and account dialog visibility. */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(initialClient));
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [providerError, setProviderError] = useState(
    initializationFailed ? "Sign-in is temporarily unavailable." : "",
  );
  const openAuth = useCallback(() => setAuthOpen(true), []);
  const closeAuth = useCallback(() => setAuthOpen(false), []);
  useEffect(() => {
    if (!initialClient) return;
    return onAuthStateChanged(
      initialClient,
      (nextUser) => {
        setUser(nextUser);
        setLoading(false);
      },
      () => {
        setLoading(false);
        setProviderError("Sign-in is temporarily unavailable.");
      },
    );
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        configured: authConfigured,
        isAuthOpen,
        providerError,
        openAuth,
        closeAuth,
        signOut: async () => {
          try {
            await firebaseSignOut(getAuthClient());
          } catch {
            setProviderError("Unable to sign out. Try again.");
            setAuthOpen(true);
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
