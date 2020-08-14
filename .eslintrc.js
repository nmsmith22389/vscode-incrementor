/**
 * @typedef {import('@nmsmith22389/eslint-config/types/eslint').Linter.Config<Rules>} Config
 * @template {import('@nmsmith22389/eslint-config/types/eslint').Linter.RulesRecord} Rules
 */

/**
 * @typedef {import('@nmsmith22389/eslint-config/types/eslint').ESLintRules} ESLintRules
 * @typedef {import('@nmsmith22389/eslint-config/types/import').ImportRules} ImportRules
 * @typedef {import('@nmsmith22389/eslint-config/types/typescript').TypescriptRules} TypescriptRules
 */

/**
 * @type {Config<ESLintRules & ImportRules & TypescriptRules>}
 */
module.exports = {
    root: true,
    extends: ['@nmsmith22389/eslint-config'],
    parserOptions: {
        project: './tsconfig.eslint.json',
    },
    rules: {
        'import/max-dependencies': ['warn', { max: 15 }],
        'import/no-nodejs-modules': ['off'],
    },
    overrides: [
        {
            files: ['webpack.mix.js'],
            rules: {},
        },
        {
            files: ['**/*.js'],
            rules: {
                '@typescript-eslint/no-unsafe-assignment': ['off'],
                '@typescript-eslint/no-unsafe-call': ['off'],
                '@typescript-eslint/no-unsafe-member-access': ['off'],
                '@typescript-eslint/no-unsafe-return': ['off'],
            },
        },
    ],
};
