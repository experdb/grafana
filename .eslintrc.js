const rulesDirPlugin = require('eslint-plugin-rulesdir');
rulesDirPlugin.RULES_DIR = 'eslint-local-rules';

module.exports = {
  extends: ['@grafana/eslint-config'],
  root: true,
  plugins: ['@emotion', 'lodash', 'jest', 'import', 'jsx-a11y', '@grafana', 'rulesdir'],
  settings: {
    'import/internal-regex': '^(app/)|(@grafana)',
    'import/external-module-folders': ['node_modules', '.yarn'],
  },
  rules: {
    'react/prop-types': 'off',
    // need to ignore emotion's `css` prop, see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unknown-property.md#rule-options
    'react/no-unknown-property': ['error', { ignore: ['css'] }],
    '@emotion/jsx-import': 'error',
    'lodash/import-scope': [2, 'member'],
    'jest/no-focused-tests': 'error',
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external'], 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'react-redux',
            importNames: ['useDispatch', 'useSelector'],
            message: 'Please import from app/types instead.',
          },
          {
            name: 'react-i18next',
            importNames: ['Trans', 't'],
            message: 'Please import from app/core/internationalization instead',
          },
        ],
      },
    ],

    // Use typescript's no-redeclare for compatibility with overrides
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': ['error'],
    // custom local rules
    'rulesdir/check-border-radius-tokens': 'error',
  },
  overrides: [
    {
      files: ['packages/grafana-ui/src/components/uPlot/**/*.{ts,tsx}'],
      rules: {
        'react-hooks/rules-of-hooks': 'off',
        'react-hooks/exhaustive-deps': 'off',
      },
    },
    {
      files: ['packages/grafana-ui/src/components/ThemeDemos/**/*.{ts,tsx}'],
      rules: {
        '@emotion/jsx-import': 'off',
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
      },
    },
    {
      files: ['public/dashboards/scripted*.js'],
      rules: {
        'no-redeclare': 'error',
        '@typescript-eslint/no-redeclare': 'off',
      },
    },
    {
      extends: ['plugin:jsx-a11y/recommended'],
      files: ['**/*.tsx'],
      excludedFiles: ['**/*.{spec,test}.tsx'],
      rules: {
        // rules marked "off" are those left in the recommended preset we need to fix
        // we should remove the corresponding line and fix them one by one
        // any marked "error" contain specific overrides we'll need to keep
        'jsx-a11y/no-autofocus': [
          'error',
          {
            ignoreNonDOM: true,
          },
        ],
        'jsx-a11y/label-has-associated-control': [
          'error',
          {
            controlComponents: ['NumberInput'],
            depth: 2,
          },
        ],
      },
    },
  ],
};
