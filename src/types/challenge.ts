export type Difficulty = "warm" | "easy" | "medium" | "hard" | "extreme";

export interface ChallengeAuthor {
	name: string;
	email?: string;
	github?: string;
}

export interface ChallengeMeta {
	/** Numeric ID from folder name, e.g. 13 */
	id: number;
	/** Full folder slug, e.g. "00013-warm-hello-world" */
	slug: string;
	/** Human-readable title from info.yml */
	title: string;
	difficulty: Difficulty;
	author: ChallengeAuthor;
	tags?: string[];
	related?: number[];
}

export type Locale = "en" | "ko" | "ja";

export const LOCALE_LABELS: Record<Locale, string> = {
	en: "English",
	ko: "한국어",
	ja: "日本語",
};

export interface Challenge extends ChallengeMeta {
	/** Problem descriptions keyed by locale (en always present, ko/ja optional) */
	readmes: Record<"en", string> & Partial<Record<"ko" | "ja", string>>;
	/** Skeleton code the user starts with (template.ts) */
	template: string;
	/** Type-level test cases (test-cases.ts) */
	testCases: string;
}

export const DIFFICULTY_ORDER: Record<Difficulty, number> = {
	warm: 0,
	easy: 1,
	medium: 2,
	hard: 3,
	extreme: 4,
};

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
	warm: "bg-teal-500/15 text-teal-700 dark:text-teal-400",
	easy: "bg-green-500/15 text-green-700 dark:text-green-400",
	medium: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
	hard: "bg-red-500/15 text-red-700 dark:text-red-400",
	extreme: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
};
