import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

const config = [
  {
    ignores: [
      'legacy-ai-studio/**',
      '.next/**',
      'node_modules/**',
      'next-env.d.ts',
      'playwright-report/**',
      'test-results/**',
      '.lighthouseci/**',
    ],
  },
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      // Copy lives in content/locales. Hard-coded JSX text is how invented copy sneaks in.
      'react/jsx-no-literals': [
        'error',
        {
          noStrings: false,
          ignoreProps: true,
          allowedStrings: ['·', '→', '←', '×', '+91', '|', '/', '₹'],
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/legacy-ai-studio/**'],
              message: 'The AI Studio prototype is reference only.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['scripts/**', 'tests/**', '**/*.test.ts', '**/*.test.tsx', 'app/**/design-system/**'],
    rules: { 'react/jsx-no-literals': 'off' },
  },
];

export default config;
