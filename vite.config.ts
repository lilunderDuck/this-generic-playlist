import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import molcssPlugin from "molcss/vite-plugin"
import pagesPlugin from 'vite-plugin-pages'

export default defineConfig({
  plugins: [
    solidPlugin(),
    molcssPlugin({
      content: 'frontend/**/*.{js,jsx,ts,tsx}',
    }),
    pagesPlugin({
      dirs: ['./frontend/pages'],
    })
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
})
