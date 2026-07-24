import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@/lib/utils': path.resolve(__dirname, './src/utils/cn.js'),
      '@/components/auth/AuthLayout': path.resolve(__dirname, './src/layouts/AuthLayout.jsx'),
      '@/components/auth/FormField': path.resolve(__dirname, './src/components/common/Input.jsx'),
      '@/components/auth/SubmitButton': path.resolve(__dirname, './src/components/common/Button.jsx'),
      '@/lib/api': path.resolve(__dirname, './src/services/api.js'),
      '@tanstack/react-router': path.resolve(__dirname, './src/routes/compat.jsx'),
      '@': path.resolve(__dirname, './src'),
    },
  },
})
