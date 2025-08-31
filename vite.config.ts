import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    svelte(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '$md': path.resolve('./src/markdown/components/markdown.svelte'),
      '$parsers': path.resolve('./src/markdown/parser/blocks'),
      '$stores': path.resolve('./src/stores')
    }
  }
})