/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: ["class", "class"],
	theme: {
		extend: {
			colors: {
				// Primary palette - Indigo/Violet
				primary: {
					50: "#f0f4ff",
					100: "#e0e7ff",
					200: "#c7d2fe",
					300: "#a5b4fc",
					400: "#818cf8",
					500: "#6366f1",
					600: "#4f46e5",
					700: "#4338ca",
					800: "#3730a3",
					900: "#312e81",
				},
				// Secondary - Cyan/Teal
				secondary: {
					50: "#ecf8ff",
					100: "#d1f0ff",
					200: "#a6e8ff",
					300: "#67d8ff",
					400: "#22d3ee",
					500: "#06b6d4",
					600: "#0891b2",
					700: "#0e7490",
					800: "#155e75",
					900: "#164e63",
				},
				// Accent - Violet
				accent: {
					50: "#fdf5ff",
					100: "#fae8ff",
					200: "#f5d0fe",
					300: "#f0abfc",
					400: "#e879f9",
					500: "#d946ef",
					600: "#c026d3",
					700: "#a21caf",
					800: "#86198f",
					900: "#701a75",
				},
				// Neutral - Modern grays
				neutral: {
					50: "#f9fafb",
					100: "#f3f4f6",
					200: "#e5e7eb",
					300: "#d1d5db",
					400: "#9ca3af",
					500: "#6b7280",
					600: "#4b5563",
					700: "#374151",
					800: "#1f2937",
					900: "#111827",
				},
				// Dark mode background
				dark: {
					bg: "#0f172a",
					surface: "#1e293b",
					card: "#334155",
					border: "#475569",
				},
			},
			typography: {
				DEFAULT: {
					css: {
						color: "var(--tw-prose-body)",
					},
				},
			},
			fontFamily: {
				sans: ["Inter", "system-ui", "sans-serif"],
				display: ["Poppins", "system-ui", "sans-serif"],
			},
			fontSize: {
				xs: ["0.75rem", { lineHeight: "1rem" }],
				sm: ["0.875rem", { lineHeight: "1.25rem" }],
				base: ["1rem", { lineHeight: "1.5rem" }],
				lg: ["1.125rem", { lineHeight: "1.75rem" }],
				xl: ["1.25rem", { lineHeight: "1.75rem" }],
				"2xl": ["1.5rem", { lineHeight: "2rem" }],
				"3xl": ["1.875rem", { lineHeight: "2.25rem" }],
				"4xl": ["2.25rem", { lineHeight: "2.5rem" }],
			},
			boxShadow: {
				sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
				base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
				md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
				lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
				xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
				"2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
				glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
			},
			backdropBlur: {
				xs: "2px",
				sm: "4px",
				md: "8px",
				lg: "12px",
				xl: "16px",
			},
			animation: {
				"fade-in": "fadeIn 0.3s ease-in-out",
				"slide-in-top": "slideInTop 0.3s ease-out",
				"slide-in-bottom": "slideInBottom 0.3s ease-out",
				"slide-in-left": "slideInLeft 0.3s ease-out",
				"pulse-subtle": "pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
				"bounce-slow": "bounceSlow 2s infinite",
				"shimmer": "shimmer 2s infinite",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				slideInTop: {
					"0%": { transform: "translateY(-10px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
				slideInBottom: {
					"0%": { transform: "translateY(10px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
				slideInLeft: {
					"0%": { transform: "translateX(-10px)", opacity: "0" },
					"100%": { transform: "translateX(0)", opacity: "1" },
				},
				pulseSubtle: {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.5" },
				},
				bounceSlow: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-4px)" },
				},
				shimmer: {
					"0%": { backgroundPosition: "-1000px 0" },
					"100%": { backgroundPosition: "1000px 0" },
				},
			},
			transitionTimingFunction: {
				"smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
			},
		},
	},
	plugins: [],
};
