import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "https://mdn.github.io/todo-react/",

  server: {
    host: '0.0.0.0’,
    port: 3000 // or any other port
    }
  })
