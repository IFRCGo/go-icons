module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: ['airbnb-base', 'airbnb-typescript/base'],
    root: true,
    parserOptions: {
        ecmaVersion: 'latest',
        project: './tsconfig.json',
    },
    ignorePatterns: ['gh-pages/'],
    rules: {
        indent: ['error', 4],
        '@typescript-eslint/indent': ['error', 4],
    },
};
