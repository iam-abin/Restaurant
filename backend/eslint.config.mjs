import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ['**/*.ts'],
        rules: {
            'prefer-const': 'error',
            'no-console': 'error',
            "no-duplicate-imports": "error",
            "no-confusing-arrow": "error",
            "arrow-spacing": "error",
            "max-lines": ["error", { "max": 500 }],
            "quotes": ["error", "single"],
            "no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1 }],
            "eqeqeq": "error",
            "semi": "error",
            '@typescript-eslint/no-explicit-any': 'warn',
            'no-unused-vars': 'off', // Turn off the base rule as it conflicts with TS-specific rules
            '@typescript-eslint/no-unused-vars': ['error', { 
                vars: 'all', // Check all variables, including imports
                args: 'after-used', // Ignore unused arguments if they are after used ones
                ignoreRestSiblings: true, 
                argsIgnorePattern: '^_|req|res|next' 
            }],
            '@typescript-eslint/no-unused-expressions': ['error', {
                allowShortCircuit: true,
                allowTernary: true,
                enforceForJSX: true,
            }],
            
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
