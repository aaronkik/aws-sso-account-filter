import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    clearMocks: true,
    coverage: {
      exclude: ['**/*.test.{ts,tsx}', '__mocks__/**/*', 'tests/**/*'],
      reporter: ['text', 'html', 'json', 'lcov'],
    },
    environment: 'jsdom',
    setupFiles: ['./tests/setUpGlobals.ts', './tests/setupTestingLibrary.ts'],
  },
});
