import { defineConfig } from 'vitest/config'

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
      '@': './src',
      '@env': './src/__tests__/mocks/env.ts',
    },
  },
})
