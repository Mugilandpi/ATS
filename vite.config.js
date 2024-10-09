import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
 
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    port: 1313,
    cors: true,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        // target: "http://vms.makonissoft.com:1919/", //server
        // target: "http://192.168.1.8:5000", // my local
        // target: 'http://192.168.1.14:1919', // Ganesh local
       //  target: 'http://144.126.254.255', // VenkatTeja
        //  target: 'https://ats-6ofx.onrender.com',
        target:'http://144.126.254.255',
        // target: "http://192.168.1.6:5000",
        // my local
        changeOrigin: true,
        // secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})