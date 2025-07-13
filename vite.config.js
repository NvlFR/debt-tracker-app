import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths'; 



export default defineConfig({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  plugins: [
    react(),
    tsconfigPaths(),
 
  ],
});