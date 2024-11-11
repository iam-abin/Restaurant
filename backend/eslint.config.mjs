import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ['**/*.ts'],
        rules: {
            'no-unused-vars': 'off',
            'prefer-const': 'error',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_|req|res|next' }],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-namespace': [
                'error',
                { allowDeclarations: true }, // Allow namespaces in declaration contexts
            ],
        },
    },
    { files: ['**/*.js'], languageOptions: { sourceType: 'script' } },
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
];
