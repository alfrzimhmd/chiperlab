import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [react(), tailwindcss()],

    // Base path untuk GitHub Pages
    // - Untuk repo 'chiperlab' di github.com/alfrzimhmd/chiperlab:
    //   base harus '/chiperlab/'
    // - Kalau pakai custom domain, ganti jadi '/'
    // - Di development (localhost), Vite otomatis handle
    base: isProduction ? '/chiperlab/' : '/',

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    build: {
      outDir: 'dist',
      sourcemap: false,
      // Optional: meningkatkan performa build untuk project besar
      chunkSizeWarningLimit: 1000,
    },

    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify — file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});