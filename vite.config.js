import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        configurator: 'configurator.html',
        summary: 'summary.html'
      }
    }
  }
});
