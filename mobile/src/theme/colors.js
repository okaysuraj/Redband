import { Platform } from "react-native";

export const COLORS = {
  // Paper & Surfaces
  paper: "#f7f4ee",
  paperLight: "#fcfbf8",
  paperDim: "#ede6dc",
  paperMuted: "#e5dfd4",

  // Inks
  ink: "#141311",
  inkSecondary: "#38342e",
  inkMuted: "#6e675d",
  inkFaint: "#999084",

  // Hairlines & Borders
  border: "rgba(20, 19, 17, 0.08)",
  borderStrong: "rgba(20, 19, 17, 0.16)",
  borderDotted: "rgba(20, 19, 17, 0.22)",

  // Signature Accent
  accentRed: "#9e261f",
  accentRedMuted: "rgba(158, 38, 31, 0.12)",
  accentRedText: "#851e18",

  // Midnight Obsidian Chapter (Dark)
  darkBg: "#12110f",
  darkCard: "#1c1a17",
  darkCardHover: "#25231f",
  darkBorder: "rgba(247, 244, 238, 0.10)",
  darkBorderStrong: "rgba(247, 244, 238, 0.22)",
  darkText: "#f7f4ee",
  darkTextMuted: "#a29b90",
  darkTextFaint: "#736c62",

  // Status & Badges
  statusGreen: "#2d6a4f",
  statusGreenBg: "rgba(45, 106, 79, 0.1)",
  statusAmber: "#b5651d",
  statusAmberBg: "rgba(181, 101, 29, 0.1)",
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
