// Configure Firebase with encrypted native persistence and in-memory web sessions.
import { getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  inMemoryPersistence,
  initializeAuth,
} from "firebase/auth";
import { Platform } from "react-native";
import { securePersistence } from "./securePersistence";

const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};
export const authConfigured = Object.values(config).every(Boolean);

export function getAuthClient() {
  if (!authConfigured) return null;
  const existing = getApps().find((app) => app.name === "redband-mobile");
  if (existing) return getAuth(existing);
  const app = initializeApp(config, "redband-mobile");
  return initializeAuth(app, {
    persistence:
      Platform.OS === "web"
        ? inMemoryPersistence
        : getReactNativePersistence(securePersistence),
  });
}

export async function getAccessToken() {
  const client = getAuthClient();
  if (!client)
    throw Object.assign(new Error("Sign-in is not configured yet."), {
      status: 503,
    });
  await client.authStateReady();
  if (!client.currentUser)
    throw Object.assign(new Error("Sign in to manage reservations."), {
      status: 401,
    });
  return client.currentUser.getIdToken();
}

export function authErrorMessage(error) {
  const messages = {
    "auth/invalid-credential": "The email or password is incorrect.",
    "auth/invalid-login-credentials": "The email or password is incorrect.",
    "auth/user-not-found": "The email or password is incorrect.",
    "auth/wrong-password": "The email or password is incorrect.",
    "auth/email-already-in-use":
      "Unable to create this account. Try signing in or resetting your password.",
    "auth/weak-password":
      "Use a stronger password that meets the account policy.",
    "auth/password-does-not-meet-requirements":
      "Your password does not meet the account policy.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/network-request-failed": "Check your connection and try again.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/operation-not-allowed":
      "Email and password sign-in is not enabled yet.",
    "auth/user-disabled":
      "This account is unavailable. Contact the service operator.",
  };
  return (
    messages[error?.code] ||
    "Sign-in is temporarily unavailable. Please try again."
  );
}
