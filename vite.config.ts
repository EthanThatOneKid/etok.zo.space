import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'treat-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/routes\/.*\.ts$/)) return null

        return transformWithEsbuild(code, id, {
          loader: 'tsx',
          jsx: 'automatic',
        })
      },
    },
  ],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.ts': 'tsx',
      },
    },
  },
  esbuild: {
    loader: 'tsx',
    include: /.*\.[tj]sx?$/,
  },
  server: {
    port: 5173,
    open: true
  }
})
