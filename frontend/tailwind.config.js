/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        police: {
          navy: '#0B132B',       // Immersive Deep Navy Blue
          blue: '#1C2541',       // Dark Blue Accent
          accent: '#3A506B',     // Slate Accent
          saffron: '#F26419',    // Vibrant Saffron Orange
          saffronLight: '#F68E5F', // Light Saffron
          gold: '#E0A96D',       // Premium Gold Tone
          light: '#F8F9FA',      // Admin Dashboard Crisp Background
          adminNavy: '#1E293B',  // Slate Admin Color
        }
      }
    },
  },
  plugins: [],
}
