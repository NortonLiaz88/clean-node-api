module.exports = {
  extends: 'standard-with-typescript',
  parserOptions: {
    project: './tsconfig.eslint.json'
  },
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 'off',
    'no-unreachable-loop': 'off'
  }
}
