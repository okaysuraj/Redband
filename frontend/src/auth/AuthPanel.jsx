import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { authErrorMessage, getAuthClient } from "./firebase";
import { useAuth } from "./context";
import useModalFocus from "../components/useModalFocus";
import "./styles.css";

/** Sign-in, account creation, and password reset forms. */
export function AuthPanel() {
  const { isAuthOpen } = useAuth();
  return isAuthOpen ? <AuthDialog /> : null;
}

function AuthDialog() {
  const { configured, closeAuth, providerError } = useAuth();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const dialog = useRef(null);
  const requestVersion = useRef(0);
  const submitting = useRef(false);
  useModalFocus(dialog, closeAuth);
  useEffect(
    () => () => {
      requestVersion.current += 1;
    },
    [],
  );
  const title =
    mode === "signup"
      ? "Create account"
      : mode === "reset"
        ? "Reset password"
        : "Sign in";
  async function submit(event) {
    event.preventDefault();
    if (submitting.current || !configured) return;
    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    submitting.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    const version = requestVersion.current;
    try {
      const client = getAuthClient();
      if (mode === "reset") {
        try {
          await sendPasswordResetEmail(client, email.trim());
        } catch (issue) {
          if (issue.code !== "auth/user-not-found") throw issue;
        }
        if (version === requestVersion.current)
          setNotice(
            "If an account exists for this email, you will receive password reset instructions.",
          );
      } else {
        if (mode === "signup")
          await createUserWithEmailAndPassword(client, email.trim(), password);
        else await signInWithEmailAndPassword(client, email.trim(), password);
        if (version === requestVersion.current) closeAuth();
      }
    } catch (issue) {
      if (version === requestVersion.current) setError(authErrorMessage(issue));
    } finally {
      submitting.current = false;
      if (version === requestVersion.current) setBusy(false);
    }
  }
  function changeMode(next) {
    setMode(next);
    setError("");
    setNotice("");
    setPassword("");
    setConfirmPassword("");
  }
  return createPortal(
    <div
      className="auth-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) closeAuth();
      }}
    >
      <section
        ref={dialog}
        className="auth-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
      >
        <button
          className="auth-close"
          type="button"
          aria-label="Close sign in"
          onClick={closeAuth}
        >
          ×
        </button>
        <h2 id="auth-title">{title}</h2>
        {!configured ? (
          <p role="status">
            Account access is not configured yet. Please try again later.
          </p>
        ) : (
          <form onSubmit={submit}>
            <label htmlFor="auth-email">Email address</label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={busy}
            />
            {mode !== "reset" && (
              <>
                <label htmlFor="auth-password">Password</label>
                <input
                  id="auth-password"
                  type="password"
                  autoComplete={
                    mode === "signup" ? "new-password" : "current-password"
                  }
                  minLength={mode === "signup" ? 12 : undefined}
                  maxLength={128}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  disabled={busy}
                />
              </>
            )}
            {mode === "signup" && (
              <>
                <p className="auth-help">Use at least 12 characters.</p>
                <label htmlFor="auth-confirm">Confirm password</label>
                <input
                  id="auth-confirm"
                  type="password"
                  autoComplete="new-password"
                  minLength={12}
                  maxLength={128}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  disabled={busy}
                />
              </>
            )}
            {(error || providerError) && (
              <p className="auth-error" role="alert">
                {error || providerError}
              </p>
            )}
            {notice && <p role="status">{notice}</p>}
            <button className="auth-submit" type="submit" disabled={busy}>
              {busy
                ? "Please wait…"
                : mode === "reset"
                  ? "Send reset instructions"
                  : title}
            </button>
            <div className="auth-actions">
              {mode !== "signin" && (
                <button
                  type="button"
                  onClick={() => changeMode("signin")}
                  disabled={busy}
                >
                  Back to sign in
                </button>
              )}
              {mode === "signin" && (
                <>
                  <button
                    type="button"
                    onClick={() => changeMode("signup")}
                    disabled={busy}
                  >
                    Create account
                  </button>
                  <button
                    type="button"
                    onClick={() => changeMode("reset")}
                    disabled={busy}
                  >
                    Forgot password?
                  </button>
                </>
              )}
            </div>
          </form>
        )}
      </section>
    </div>,
    document.body,
  );
}
