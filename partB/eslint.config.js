// ESLint v9 flat config — F.CSM311 Бие даалт 13
// CLAUDE.md §5 conventions: ES modules, ES2022+, async/await

const nodeGlobals = {
  console: 'readonly',
  process: 'readonly',
  Buffer: 'readonly',
  __dirname: 'readonly',
  __filename: 'readonly',
  setTimeout: 'readonly',
  setInterval: 'readonly',
  clearTimeout: 'readonly',
  clearInterval: 'readonly',
  setImmediate: 'readonly',
  clearImmediate: 'readonly',
  global: 'readonly',
  URL: 'readonly',
  URLSearchParams: 'readonly',
  fetch: 'readonly',
};

const jestGlobals = {
  describe: 'readonly',
  it: 'readonly',
  test: 'readonly',
  expect: 'readonly',
  beforeAll: 'readonly',
  afterAll: 'readonly',
  beforeEach: 'readonly',
  afterEach: 'readonly',
  jest: 'readonly',
};

export default [
  {
    ignores: ['node_modules/**', 'coverage/**', 'dist/**'],
  },
  {
    files: ['src/**/*.js', 'tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: nodeGlobals,
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-console': 'off',
      'no-var': 'error',
      'prefer-const': 'warn',
      eqeqeq: ['error', 'always'],
      'no-implicit-coercion': 'warn',
      'no-throw-literal': 'error',
      'no-return-await': 'warn',
      'require-await': 'warn',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
    },
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: { ...nodeGlobals, ...jestGlobals },
    },
    rules: {
      'require-await': 'off',
    },
  },
];
