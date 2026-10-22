import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Images go through our own <Picture> with pre-built srcsets (static export).
      "@next/next/no-img-element": "off",
    },
  },
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "dist/**", ".tmp-assets/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
