import js from "@eslint/js";
import globals from "globals";

export default [
	js.configs.recommended,
	{
		files: ["**/*.{js,mjs,cjs}"],
		languageOptions: {
			globals: {
				...globals.node,
				...globals.es2021,
			},
		},
		rules: {
			"no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_", // Allow unused parameters starting with _
					varsIgnorePattern: "^_",
				},
			],
		},
	},
];
