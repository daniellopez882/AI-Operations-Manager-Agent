/* The `lint` script existed; this file did not, so it could never run. */
module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
    ],
    ignorePatterns: ['dist', 'coverage', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh'],
    rules: {
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
    overrides: [
        {
            // Context modules export a provider and a hook together on purpose.
            files: ['src/lib/**/*.tsx', 'src/**/*.test.tsx'],
            rules: { 'react-refresh/only-export-components': 'off' },
        },
    ],
};
