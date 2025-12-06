import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  // ⚠️ CRITICAL STEP FOR GITHUB PAGES ⚠️
  // Set the base path to your repository name, enclosed in forward slashes.
  const base = mode === 'production' ? '/smart-aid-kit-number1/' : '/';

  return {
    // --- ADDED/MODIFIED FOR GITHUB PAGES ---
    base: base,
    // --------------------------------------

    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});