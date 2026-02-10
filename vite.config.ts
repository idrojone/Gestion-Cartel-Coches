import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwdindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwdindcss(),

  ],
  server: {
    host: true, 
    port: 5173,
    watch: {
      usePolling: true, 
    }
  }
})