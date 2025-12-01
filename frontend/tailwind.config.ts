import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", "string"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        ok: {
          DEFAULT: "var(--ok)",
          foreground: "var(--ok-foreground)",
        },
        nok: {
          DEFAULT: "var(--nok)",
          foreground: "var(--nok-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        // Login/Signup Animation - Draw Line
        "draw-line": {
          "0%": {
            strokeDasharray: "100",
            strokeDashoffset: "100",
          },
          "100%": {
            strokeDasharray: "100",
            strokeDashoffset: "0",
          },
        },
        // Sparkle Animations for Signup
        "sparkle-1": {
          "0%, 100%": {
            opacity: "0.6",
            transform: "scale(1) rotate(0deg)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.1) rotate(180deg)",
          },
        },
        "sparkle-2": {
          "0%, 100%": {
            opacity: "0.6",
            transform: "scale(1) rotate(0deg)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.1) rotate(180deg)",
          },
        },
        "sparkle-3": {
          "0%, 100%": {
            opacity: "0.5",
            transform: "scale(1) rotate(0deg)",
          },
          "50%": {
            opacity: "0.9",
            transform: "scale(1.2) rotate(-180deg)",
          },
        },
        "sparkle-4": {
          "0%, 100%": {
            opacity: "0.5",
            transform: "scale(1) rotate(0deg)",
          },
          "50%": {
            opacity: "0.9",
            transform: "scale(1.2) rotate(-180deg)",
          },
        },
        // Slide Down for Error Messages
        "slide-down": {
          from: {
            transform: "translateY(-10px)",
            opacity: "0",
          },
          to: {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        // Accordion animations (from shadcn)
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        // Custom animations for login/signup
        "draw-line": "draw-line 2s ease-in-out infinite",
        "sparkle-1": "sparkle-1 2s ease-in-out infinite",
        "sparkle-2": "sparkle-2 2s ease-in-out infinite 0.5s",
        "sparkle-3": "sparkle-3 3s ease-in-out infinite",
        "sparkle-4": "sparkle-4 3s ease-in-out infinite 0.7s",
        "slide-down": "slide-down 0.3s ease-out",
        // Shadcn animations
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;