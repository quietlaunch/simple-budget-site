module.exports = {
  content: ["./**/*.html"],
  theme: {
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#10b981",
          dark: "#059669",
          light: "#d1fae5",
        },
      },
      borderRadius: {
        card: "1.25rem",
      },
      boxShadow: {
        soft: "0 8px 24px -6px rgba(0,0,0,0.08)",
        card: "0 16px 32px -6px rgba(0,0,0,0.12)",
        banner: "0 12px 32px -8px rgba(15,23,42,0.06)",
      },
      spacing: {
        section: "5rem",
      }
    }
  },
  plugins: [],
};
