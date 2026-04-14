import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        border: "hsl(var(--border))",
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        accent: "hsl(var(--accent))",
        muted: "hsl(var(--muted))",
        destructive: "hsl(var(--destructive))",
        chart: {
          cyan: "#22d3ee",
          blue: "#3b82f6",
          magenta: "#ec4899",
          amber: "#f59e0b",
          green: "#22c55e",
          violet: "#8b5cf6"
        }
      },
      backgroundImage: {
        "space-grid":
          "linear-gradient(rgba(34, 211, 238, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.12) 1px, transparent 1px)",
        nebula:
          "radial-gradient(circle at 20% 20%, rgba(34,211,238,0.18), transparent 24%), radial-gradient(circle at 80% 10%, rgba(236,72,153,0.18), transparent 28%), radial-gradient(circle at 50% 80%, rgba(59,130,246,0.18), transparent 30%)"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(125, 211, 252, 0.12), 0 0 32px rgba(34, 211, 238, 0.16)",
        "glow-strong": "0 0 0 1px rgba(236,72,153,0.18), 0 0 44px rgba(59,130,246,0.24)"
      },
      fontFamily: {
        sans: ["var(--font-space)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-orbitron)", "ui-sans-serif", "system-ui"]
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        pulseRing: "pulseRing 2.6s ease-out infinite",
        drift: "drift 18s linear infinite",
        shimmer: "shimmer 2.4s linear infinite",
        rotateSlow: "rotateSlow 20s linear infinite",
        blink: "blink 1.4s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        pulseRing: {
          "0%": { opacity: "0.7", transform: "scale(0.7)" },
          "100%": { opacity: "0", transform: "scale(1.4)" }
        },
        drift: {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(16px, -24px, 0)" },
          "100%": { transform: "translate3d(0, 0, 0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        rotateSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        blink: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" }
        }
      }
    }
  },
  plugins: []
};

export default config;
