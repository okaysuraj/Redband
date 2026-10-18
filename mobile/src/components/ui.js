// Shared native controls, typography, images, and accessible modal sheets.
import React, { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS } from "../theme/colors";
import { resolveMediaUrl } from "../api/client";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (active) setReduced(value);
      })
      .catch(() => {});
    const listener = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduced,
    );
    return () => {
      active = false;
      listener.remove();
    };
  }, []);
  return reduced;
}
export function Button({
  children,
  onPress,
  disabled,
  loading,
  secondary,
  selected,
  label,
  style,
  accessibilityState,
  ...props
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        label || (typeof children === "string" ? children : undefined)
      }
      accessibilityState={{
        disabled: Boolean(disabled || loading),
        selected: selected === undefined ? undefined : Boolean(selected),
        busy: Boolean(loading),
        ...accessibilityState,
      }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        ui.button,
        secondary && ui.secondary,
        selected && ui.selected,
        (disabled || loading) && ui.disabled,
        pressed && ui.pressed,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? COLORS.ink : COLORS.paper} />
      ) : (
        <Text style={[ui.buttonText, secondary && ui.secondaryText]}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}
export function Heading({ children, style }) {
  return children ? (
    <Text accessibilityRole="header" style={[ui.heading, style]}>
      {children}
    </Text>
  ) : null;
}
export function Copy({ children, style, ...props }) {
  return children === null ||
    children === undefined ||
    children === false ||
    children === "" ? null : (
    <Text style={[ui.copy, style]} {...props}>
      {children}
    </Text>
  );
}
export function Label({ children }) {
  return children ? <Text style={ui.label}>{children}</Text> : null;
}
export function Section({ children, style }) {
  return <View style={[ui.section, style]}>{children}</View>;
}
export function Field({ label, ...props }) {
  return (
    <View style={ui.field}>
      <Label>{label}</Label>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={COLORS.inkMuted}
        style={ui.input}
        {...props}
      />
    </View>
  );
}
export function Status({ loading, error, empty, retry }) {
  return (
    <View style={ui.status} accessibilityLiveRegion="polite">
      {loading && (
        <ActivityIndicator
          color={COLORS.accentRed}
          accessibilityLabel="Loading"
        />
      )}
      <Copy style={error ? ui.error : undefined}>
        {loading ? "Loading live data…" : error || empty}
      </Copy>
      {!loading && retry && (
        <Button secondary onPress={retry}>
          Try again
        </Button>
      )}
    </View>
  );
}
export function Media({ path, alt, caption, style }) {
  const uri = resolveMediaUrl(path);
  const [failedUri, setFailedUri] = useState(null);
  if (!uri) return null;
  if (failedUri === uri)
    return <Copy accessibilityLiveRegion="polite">Image unavailable.</Copy>;
  return (
    <View>
      <Image
        source={{ uri }}
        style={[ui.image, style]}
        contentFit="cover"
        cachePolicy="disk"
        allowDownscaling
        accessibilityLabel={alt || undefined}
        accessible={Boolean(alt)}
        recyclingKey={uri}
        transition={0}
        autoplay={false}
        onError={() => setFailedUri(uri)}
      />
      <Copy style={ui.caption}>{caption}</Copy>
    </View>
  );
}
export function Sheet({ title, onClose, children, footer }) {
  const reducedMotion = useReducedMotion();
  return (
    <Modal
      visible
      transparent
      animationType={reducedMotion ? "none" : "slide"}
      onRequestClose={onClose}
    >
      <SafeAreaView style={ui.backdrop}>
        <KeyboardAvoidingView
          style={ui.sheet}
          accessibilityViewIsModal
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={ui.sheetHeader}>
            <Heading style={ui.sheetTitle}>{title}</Heading>
            <Button secondary onPress={onClose} label="Close dialog">
              ×
            </Button>
          </View>
          <ScrollView
            contentContainerStyle={ui.sheetBody}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            {children}
          </ScrollView>
          {footer && <View style={ui.sheetFooter}>{footer}</View>}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
export async function callPhone(phone) {
  const digits = phone?.replace(/[^\d+]/g, "");
  if (!digits) return;
  try {
    await Linking.openURL(`tel:${digits}`);
  } catch {
    Alert.alert(
      "Cannot open phone",
      "This device cannot open the telephone app.",
    );
  }
}
export const ui = StyleSheet.create({
  section: {
    paddingHorizontal: 22,
    paddingVertical: 32,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  heading: {
    fontFamily: FONTS.serif,
    fontSize: 28,
    lineHeight: 35,
    color: COLORS.ink,
    letterSpacing: -0.5,
  },
  copy: {
    fontFamily: FONTS.sans,
    fontSize: 15,
    lineHeight: 23,
    color: COLORS.inkSecondary,
    flexShrink: 1,
  },
  label: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.accentRed,
    letterSpacing: 0.6,
  },
  button: {
    minHeight: 48,
    minWidth: 48,
    backgroundColor: COLORS.ink,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
  },
  buttonText: {
    fontFamily: FONTS.sans,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    color: COLORS.paper,
    textAlign: "center",
  },
  secondary: {
    backgroundColor: COLORS.paperLight,
    borderColor: COLORS.borderStrong,
    borderWidth: 1,
  },
  secondaryText: { color: COLORS.ink },
  selected: { borderColor: COLORS.accentRed, borderWidth: 2 },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.72 },
  card: {
    backgroundColor: COLORS.paperLight,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: 4,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
  },
  image: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 3,
    backgroundColor: COLORS.paperDim,
  },
  caption: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.inkMuted,
    marginTop: 8,
  },
  field: { gap: 6 },
  input: {
    minHeight: 48,
    backgroundColor: COLORS.paperLight,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    padding: 12,
    borderRadius: 3,
    fontFamily: FONTS.sans,
    fontSize: 16,
    color: COLORS.ink,
  },
  status: { padding: 22, gap: 14, alignItems: "center" },
  error: { color: COLORS.accentRed },
  backdrop: { flex: 1, backgroundColor: "rgba(18,17,15,0.65)" },
  sheet: { flex: 1, backgroundColor: COLORS.paper },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderStrong,
  },
  sheetTitle: { fontSize: 24, flex: 1 },
  sheetBody: { padding: 20, gap: 18 },
  sheetFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderStrong,
    gap: 10,
  },
});
