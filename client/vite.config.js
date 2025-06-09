import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/postcss'; // Use 'tailwindcss' instead of '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
  },
  base: '/', // Ensure assets are served from root
  optimizeDeps: {
    include: ['antd'],
    force: true,
  },
});
