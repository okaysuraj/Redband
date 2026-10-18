// Shared native colors and platform font choices.
import { Platform } from "react-native";

export const COLORS = {
  // Paper & Surfaces
  paper: "#f7f4ee",
  paperLight: "#fcfbf8",
  paperDim: "#ede6dc",

  // Inks
  ink: "#141311",
  inkSecondary: "#38342e",
  inkMuted: "#6e675d",

  // Hairlines & Borders
  border: "rgba(20, 19, 17, 0.08)",
  borderStrong: "rgba(20, 19, 17, 0.16)",

  // Accent
  accentRed: "#9e261f",
  accentRedText: "#851e18",

  // Dark sections
  darkBg: "#12110f",
  darkCard: "#1c1a17",
  darkBorder: "rgba(247, 244, 238, 0.10)",
  darkText: "#f7f4ee",
  darkTextMuted: "#a29b90",

  // Status & Badges
};

export const FONTS = {
  serif: Platform.select({
    ios: "Georgia",
    android: "serif",
    default: "serif",
  }),
  sans: Platform.select({
    ios: "System",
    android: "Roboto",
    default: "sans-serif",
  }),
  mono: Platform.select({
    ios: "Menlo",
    android: "monospace",
    default: "monospace",
  }),
};
