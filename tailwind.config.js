export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          light: "#3B82F6",
          dark: "#1D4ED8",
        },
        secondary: "#1E293B",
        background: "#F8FAFC",
        card: "#FFFFFF",
        text: "#0F172A",
        muted: "#64748B",
        border: "#E2E8F0",
        success: "#22C55E",
        error: "#EF4444",
      },

      fontFamily: {
  sans: ['PT Sans', 'sans-serif'], 
  nunito: ['Nunito', 'sans-serif'],
},
      
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },

      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};