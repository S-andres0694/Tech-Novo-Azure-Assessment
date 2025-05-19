import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginReact from "eslint-plugin-react";
export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  // @ts-expect-error: This is a recommended config by the documentation followed in: https://eslint.org/docs/latest/use/getting-started
  // I just added the specific react version to avoid warnings issued by the VSCode Server.
  tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    rules: {
      "react/react-in-jsx-scope": "off", // Avoids issues with the linter because I am using React 19.1.0
    },
    settings: {
      react: {
        version: "19.1.0",
      },
    },
  },
  eslintConfigPrettier,
]);
