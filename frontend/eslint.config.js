import eslint from '@eslint/js'
import prettier from 'eslint-config-prettier'
import perfectionist from 'eslint-plugin-perfectionist'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

const typeScriptFiles = ['src/**/*.{ts,tsx}', 'test/**/*.{ts,tsx}']

export default tseslint.config(
  {
    ignores: ['dist/', 'node_modules/'],
  },
  ...[
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ].map((config) => ({
    ...config,
    files: typeScriptFiles,
  })),
  {
    files: typeScriptFiles,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ...reactHooks.configs.flat.recommended,
    files: typeScriptFiles,
  },
  {
    ...reactRefresh.configs.vite,
    files: ['src/**/*.{ts,tsx}'],
  },
  {
    ...perfectionist.configs['recommended-natural'],
    files: typeScriptFiles,
  },
  {
    ...prettier,
    files: typeScriptFiles,
  },
)
