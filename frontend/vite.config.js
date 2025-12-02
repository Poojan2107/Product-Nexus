import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // base: "/ProductNexus/", // Commented out for local development
  clearScreen: false,
  logLevel: 'info', // 'warn' hides the local url which we want
  server: {
    open: true,
  }
});
