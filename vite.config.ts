import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
  ],
  assetsInclude: ['**/*.mp4'],
  server: {
    allowedHosts: [
      '03b9-182-76-162-66.ngrok-free.app', 
    ],
  },
});
