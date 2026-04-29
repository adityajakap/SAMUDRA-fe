import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      includeAssets: ["favicon.svg", "favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "SAMUDRA",
        short_name: "SAMUDRA",
        description: "Sistem Aplikasi Monitoring Diseminasi dan Informasi Kebencanaan",
        theme_color: "#F9F9F9",
        background_color: "#F9F9F9",
        display: "standalone",
        orientation: "portrait",
        categories: ["weather", "utilities"],
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
        shortcuts: [
          {
            name: "Lapor Tanda Alam",
            short_name: "Lapor",
            description: "Buat laporan tanda alam baru",
            url: "/report",
            icons: [{ src: "/192x192.png", sizes: "192x192" }]
          },
          {
            name: "Prakiraan Cuaca",
            short_name: "Prakiraan",
            description: "Lihat prakiraan cuaca per jam",
            url: "/forecast",
            icons: [{ src: "/192x192.png", sizes: "192x192" }]
          }
        ]
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
