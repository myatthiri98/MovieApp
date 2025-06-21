import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.d.ts',
        'babel.config.js',
        'eslint.config.js',
      ],
    },
    server: {
      deps: {
        inline: [
          'react-native',
          '@react-native-async-storage/async-storage',
          '@react-native-community/netinfo',
          '@expo/vector-icons',
        ],
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@env': resolve(__dirname, './src/__tests__/mocks/env.ts'),
    },
  },
})
