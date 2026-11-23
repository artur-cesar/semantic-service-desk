import eslint from '@eslint/js'
import prettier from 'eslint-config-prettier'
import perfectionist from 'eslint-plugin-perfectionist'
import tseslint from 'typescript-eslint'

const typeScriptFiles = ['prisma/**/*.ts', 'src/**/*.ts', 'test/**/*.ts']

export default tseslint.config(
  {
    ignores: ['dist/', 'node_modules/', 'src/generated/prisma/'],
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
    ...perfectionist.configs['recommended-natural'],
    files: typeScriptFiles,
  },
  {
    ...prettier,
    files: typeScriptFiles,
  },
)
