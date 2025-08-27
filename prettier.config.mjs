/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
    experimentalTernaries: true,
    printWidth: 120,
    trailingComma: 'none',
    tabWidth: 4,
    semi: false,
    singleQuote: true,
    plugins: ['@prettier/plugin-oxc']
}
export default config
