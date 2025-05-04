import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  server: {
    open: true,//自动浏览
    port: 8088
  },
  resolve:{
    alias:{
      '@':path.resolve(__dirname,'src')
    }
  },
  plugins: [vue()],
})
