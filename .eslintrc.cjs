module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['plugin:react/recommended', 'airbnb', 'plugin:react/jsx-runtime', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react'],
  rules: {
    'import/no-extraneous-dependencies': 0,
    'no-plusplus': 0
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['#', './src']],
        extensions: ['.js', '.jsx']
      }
    }
  }
};
