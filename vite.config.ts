import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "SAMUDRA",
        short_name: "SAMUDRA",
        description: "Sistem Aplikasi Monitoring Diseminasi dan Informasi Kebencanaan",
        theme_color: "#0077ffff",
        background_color: "#155bffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      // peringatan dini cuaca proxy bmkg
      "/bmkg": {
        target: "https://www.bmkg.go.id",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/bmkg/, ""),
      },
      // Prakiraan cuaca API proxy bmkg
      "/bmkg-api": {
        target: "https://api.bmkg.go.id",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/bmkg-api/, ""),
      },
    },
  },
})
