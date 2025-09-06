import json from '@eslint/json';
import markdown from '@eslint/markdown';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  tseslint.configs.strict,
  {
    ignores: ['*.config.cjs', 'build', 'coverage', 'dist', 'node_modules', 'package-lock.json'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    // @ts-expect-error https://github.com/jsx-eslint/eslint-plugin-react/issues/3878
    ...react.configs.flat.recommended,
    languageOptions: {
      // @ts-expect-error https://github.com/jsx-eslint/eslint-plugin-react/issues/3878
      ...react.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
        chrome: 'readable',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },
  reactHooks.configs['recommended-latest'],
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.md'],
    // @ts-expect-error following the docs 🤷🏽
    plugins: { markdown },
    language: 'markdown/gfm',
    extends: ['markdown/recommended'],
  },
  eslintConfigPrettier,
]);
