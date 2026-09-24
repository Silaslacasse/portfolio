// @ts-check
import withNuxt from "./node_modules/.cache/nuxt/.nuxt/eslint.config.mjs";
import prettier from "eslint-config-prettier";

export default withNuxt(
  // Prettier owns formatting; this switches off the ESLint rules that would fight it.
  prettier,
  {
    rules: {
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    // Generated and build output.
    ignores: ["node_modules/.cache/**", ".nuxt/**", ".output/**", "dist/**", "node_modules/**"],
  }
);
