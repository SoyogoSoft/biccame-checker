import eslint from '@eslint/js';
import parser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import-x';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import tslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';

export default [
  {
    ignores: ['.github/**', '.idea/**', 'dist/**', 'node_modules/**', '**.yml', '**.yaml'],
  },
  eslint.configs.recommended,
  ...tslint.configs.stylistic,
  ...pluginVue.configs['flat/recommended'],
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    files: ['**/*.{ts,tsx,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parser: parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 'latest',
        extraFileExtensions: ['.vue'],
      },
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: 'tsconfig.json',
        },
      },
    },
    rules: {
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: 'enumMember',
          format: ['UPPER_CASE'],
        },
      ],
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],
      'import-x/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
          },
        },
      ],
      'import-x/no-named-as-default-member': ['off'],
      '@typescript-eslint/consistent-type-imports': ['error'],
      '@typescript-eslint/no-inferrable-types': ['warn'],
      'vue/attributes-order': ['error', { alphabetical: true }],
      'vue/static-class-names-order': ['error'],
      'vue/singleline-html-element-content-newline': ['off'],
      'vue/html-indent': ['off'],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
          },
        },
      ],
    },
  },
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: tslint.parser, sourceType: 'module' },
    },
  },
];
