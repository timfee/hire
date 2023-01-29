// @ts-check
/** @type {import("prettier").Config} */
module.exports = {
  semi: false,
  singleQuote: true,
  bracketSameLine: true,
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
}
