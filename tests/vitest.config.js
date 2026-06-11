import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test_*.js', '**/*.test.js', '**/*.spec.js'],
    testTimeout: 120000,
  },
});
