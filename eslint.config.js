import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

/**
 * Config plana do ESLint. Substitui o `.eslintrc.cjs`, formato descontinuado no
 * ESLint 9.
 */
export default [
    { ignores: ["dist/**", "pipeline/**", "node_modules/**"] },

    js.configs.recommended,

    {
        files: ["**/*.{js,jsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: { ...globals.browser, ...globals.es2021 },
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
        settings: { react: { version: "detect" } },
        plugins: {
            react,
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...react.configs.recommended.rules,
            ...react.configs["jsx-runtime"].rules,
            ...reactHooks.configs.recommended.rules,

            // O projeto é JS puro e não declara PropTypes: a regra só produziria
            // ruído em cada componente.
            "react/prop-types": "off",

            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
        },
    },

    {
        // Primitivos gerados por `npx shadcn add`. A forma dos arquivos é
        // decidida pelo gerador — inclusive exportar as `variants` do cva ao
        // lado dos componentes. Reescrevê-los para agradar o lint faria cada
        // atualização de componente voltar a quebrar aqui.
        files: ["src/components/ui/**/*.jsx"],
        rules: {
            "react-refresh/only-export-components": "off",
        },
    },

    {
        // Scripts de build rodam em Node, não no navegador.
        files: ["scripts/**/*.mjs", "*.config.js"],
        languageOptions: { globals: { ...globals.node } },
    },
];
