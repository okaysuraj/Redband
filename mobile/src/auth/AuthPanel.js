import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { authErrorMessage, getAuthClient } from "./firebase";
import { COLORS, FONTS } from "../theme/colors";

import { useAuth } from "./context";

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
  const requestVersion = useRef(0);
  const submitting = useRef(false);
  const emailRef = useRef(null);
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
  async function submit() {
    if (submitting.current || !configured) return;
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (mode !== "reset" && !password) {
      setError("Enter your password.");
      return;
    }
    if (mode === "signup" && password.length < 12) {
      setError("Use at least 12 characters for your password.");
      return;
    }
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
  return (
    <Modal
      visible
      transparent
      animationType="none"
      onRequestClose={closeAuth}
      onShow={() => emailRef.current?.focus()}
    >
      <SafeAreaView style={styles.backdrop} accessibilityViewIsModal>
        <KeyboardAvoidingView
          style={styles.keyboard}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.panel}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close sign in"
              onPress={closeAuth}
              style={styles.close}
            >
              <Text style={styles.closeText}>×</Text>
            </Pressable>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.content}
            >
              <Text accessibilityRole="header" style={styles.title}>
                {title}
              </Text>
              {!configured ? (
                <Text style={styles.copy}>
                  Account access is not configured yet. Please try again later.
                </Text>
              ) : (
                <>
                  <Text style={styles.label}>Email address</Text>
                  <TextInput
                    ref={emailRef}
                    style={styles.input}
                    accessibilityLabel="Email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    textContentType="emailAddress"
                    maxLength={254}
                    value={email}
                    onChangeText={setEmail}
                    editable={!busy}
                  />
                  {mode !== "reset" && (
                    <>
                      <Text style={styles.label}>Password</Text>
                      <TextInput
                        style={styles.input}
                        accessibilityLabel="Password"
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete={
                          mode === "signup"
                            ? "new-password"
                            : "current-password"
                        }
                        textContentType={
                          mode === "signup" ? "newPassword" : "password"
                        }
                        maxLength={128}
                        value={password}
                        onChangeText={setPassword}
                        editable={!busy}
                      />
                    </>
                  )}
                  {mode === "signup" && (
                    <>
                      <Text style={styles.copy}>
                        Use at least 12 characters.
                      </Text>
                      <Text style={styles.label}>Confirm password</Text>
                      <TextInput
                        style={styles.input}
                        accessibilityLabel="Confirm password"
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="new-password"
                        textContentType="newPassword"
                        maxLength={128}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        editable={!busy}
                      />
                    </>
                  )}
                  {error || providerError ? (
                    <Text
                      accessibilityRole="alert"
                      accessibilityLiveRegion="assertive"
                      style={styles.error}
                    >
                      {error || providerError}
                    </Text>
                  ) : null}
                  {notice ? (
                    <Text accessibilityLiveRegion="polite" style={styles.copy}>
                      {notice}
                    </Text>
                  ) : null}
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ disabled: busy, busy }}
                    disabled={busy}
                    style={({ pressed }) => [
                      styles.submit,
                      pressed && styles.pressed,
                    ]}
                    onPress={submit}
                  >
                    {busy ? (
                      <ActivityIndicator color={COLORS.paper} />
                    ) : (
                      <Text style={styles.submitText}>
                        {mode === "reset" ? "Send reset instructions" : title}
                      </Text>
                    )}
                  </Pressable>
                  {mode !== "signin" ? (
                    <Pressable
                      accessibilityRole="button"
                      disabled={busy}
                      onPress={() => changeMode("signin")}
                      style={styles.link}
                    >
                      <Text style={styles.linkText}>Back to sign in</Text>
                    </Pressable>
                  ) : (
                    <>
                      <Pressable
                        accessibilityRole="button"
                        disabled={busy}
                        onPress={() => changeMode("signup")}
                        style={styles.link}
                      >
                        <Text style={styles.linkText}>Create account</Text>
                      </Pressable>
                      <Pressable
                        accessibilityRole="button"
                        disabled={busy}
                        onPress={() => changeMode("reset")}
                        style={styles.link}
                      >
                        <Text style={styles.linkText}>Forgot password?</Text>
                      </Pressable>
                    </>
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(20,19,17,0.5)",
    justifyContent: "center",
  },
  keyboard: { flex: 1, justifyContent: "center", padding: 20 },
  panel: {
    maxHeight: "100%",
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
  },
  content: { padding: 24, paddingTop: 54 },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 30,
    color: COLORS.ink,
    marginBottom: 16,
  },
  copy: {
    fontSize: 15,
    color: COLORS.inkSecondary,
    lineHeight: 23,
    marginTop: 12,
  },
  label: { fontSize: 14, color: COLORS.ink, marginTop: 16, marginBottom: 6 },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORS.inkMuted,
    padding: 12,
    fontSize: 16,
    color: COLORS.ink,
    backgroundColor: COLORS.paperLight,
  },
  close: {
    position: "absolute",
    right: 8,
    top: 8,
    zIndex: 1,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: { fontSize: 26, color: COLORS.ink },
  error: {
    color: COLORS.accentRedText,
    fontSize: 15,
    marginTop: 16,
    lineHeight: 22,
  },
  submit: {
    minHeight: 48,
    padding: 14,
    backgroundColor: COLORS.ink,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  submitText: { color: COLORS.paper, fontSize: 16 },
  pressed: { opacity: 0.75 },
  link: { minHeight: 48, padding: 12, justifyContent: "center" },
  linkText: {
    color: COLORS.ink,
    textDecorationLine: "underline",
    fontSize: 15,
  },
});
