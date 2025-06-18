import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ...js.configs.recommended,
    ignores: ['migrations_old/**'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: { ...globals.node, vi: 'readonly' }
    },
    linterOptions: { reportUnusedDisableDirectives: false }
  }
];
