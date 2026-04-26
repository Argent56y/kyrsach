export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'stitch_setup_summary_page/**'
    ]
  },
  {
    files: [
      'src/**/*.js',
      'src/**/*.jsx',
      'scripts/**/*.js',
      'vite.config.js'
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        console: 'readonly',
        document: 'readonly',
        DOMParser: 'readonly',
        fetch: 'readonly',
        localStorage: 'readonly',
        React: 'readonly',
        window: 'readonly'
      }
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['error', { varsIgnorePattern: '^React$' }]
    }
  }
];
