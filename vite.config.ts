
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Define environment variable defaults
  define: {
    'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify('AIzaSyBA57PYkdqzaAiC1pLMxG6i4fb2kEVGbcE'),
    'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify('lms-project-8884d.firebaseapp.com'),
    'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify('lms-project-8884d'),
    'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify('lms-project-8884d.firebasestorage.app'),
    'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify('621122371885'),
    'import.meta.env.VITE_FIREBASE_APP_ID': JSON.stringify('1:621122371885:web:468f1191ffe532efd793a4'),
  },
}));
