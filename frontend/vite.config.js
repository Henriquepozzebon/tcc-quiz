import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/", // Garante que o caminho base funcione em produção
  server: {
    port: 5173, // Porta local para desenvolvimento
  },
  build: {
    outDir: "dist", // Diretório de saída do build
  },
});
