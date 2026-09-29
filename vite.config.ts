import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import molcssPlugin from "molcss/vite-plugin"
import pagesPlugin from 'vite-plugin-pages'

export default defineConfig(() => {
  return {
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
    esbuild: {
      define: {
        APP_NAME: `"toast_playlist"`,
        APP_USED_STACK: `"solid-js@1.9.5 golang@1.27.0 palette@catpucchin_mocha libquackity@1.0.0"`
      }
    }
  }
})
