import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#070b12",
        panel: "#0f1624",
        line: "#1f2a3d",
        text: "#e9eef9",
        muted: "#9aa8bf",
        accent: "#3aa0ff",
        success: "#33c274",
        danger: "#ff6b6b"
      }
    }
  },
  plugins: []
} satisfies Config;
