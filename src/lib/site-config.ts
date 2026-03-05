export const siteConfig = {
	name: "TS Challenge Playground",
	title: "TypeScript Challenge Playground",
	description:
		"Solve type-level TypeScript challenges in your browser with real-time type checking",
	url: "https://ts-challenges.vercel.app",
	github: {
		owner: "https://github.com/ananjaemin",
		source: "https://github.com/type-challenges/type-challenges",
	},
	author: {
		name: "ananjaemin",
		url: "https://github.com/ananjaemin",
	},
	keywords: [
		"typescript",
		"type challenges",
		"type-level programming",
		"typescript playground",
		"typescript exercises",
		"type system",
		"generics",
		"conditional types",
		"mapped types",
		"template literal types",
	],
} as const satisfies { keywords: string[] } & Record<string, unknown>;
