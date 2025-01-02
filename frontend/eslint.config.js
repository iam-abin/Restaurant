import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
    { files: ['**/*.js'], languageOptions: { sourceType: 'script' } },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        settings: {
            react: {
                version: 'detect', // Automatically detect React version
            },
        },
        rules: {
            'react/react-in-jsx-scope': 'off', // Disable rule for JSX scope
            'react/prop-types': 'off',
            'no-console': 'error',
            'prefer-const': 'error',
            'no-duplicate-imports': 'error',
            'no-confusing-arrow': 'error',
            'arrow-spacing': 'error',
            'max-lines': ['error', { max: 500 }],
            quotes: ['error', 'single'],
            'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
            eqeqeq: 'error',
            semi: 'error',
            '@typescript-eslint/no-explicit-any': 'warn',
            'no-unused-vars': 'off', // Turn off the base rule as it conflicts with TS-specific rules
        },
    },
];
