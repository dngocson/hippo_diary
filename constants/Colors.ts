const tintColorLight = "#A06D4A";
const tintColorDark = "#C49A7A";

export const Colors = {
  light: {
    // Base
    text: "#3B2F2A",
    background: "#F8F5F1",
    tint: tintColorLight,

    // Icons & Tabs
    icon: "#9D7E6B",
    tabIconDefault: "#B9AAA0",
    tabIconSelected: tintColorLight,

    // Diary UI
    card: "#F3E7DB", // quote card / recent entry
    calendar: "#F7F4F1", // calendar panel
    primary: "#6D5145", // title / heading
    secondaryText: "#9B8B81",
    button: "#C9A185", // floating action button
    border: "#ECE3DA",

    // Extra
    input: "#FFFFFF",
    shadow: "rgba(80, 50, 30, 0.08)",
  },

  dark: {
    // Base
    text: "#F2EEE9",
    background: "#0C0D11",
    tint: tintColorDark,

    // Icons & Tabs
    icon: "#B79B87",
    tabIconDefault: "#706862",
    tabIconSelected: tintColorDark,

    // Diary UI Dark
    card: "#17181D", // card tối có blur
    calendar: "#14151A", // bottom sheet calendar
    primary: "#E7D6C9", // text title sáng be
    secondaryText: "#B4A89F",
    button: "#9A6C4D", // FAB brown
    border: "#2A2A30",

    // Extra
    input: "#1B1C21",
    shadow: "rgba(0,0,0,0.45)",
  },
};
