/**
 * Build script: Fetches all challenges from type-challenges/type-challenges repo
 * and generates a local JSON data file for SSG.
 *
 * Usage: pnpm tsx scripts/fetch-challenges.ts
 */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";

const REPO = "type-challenges/type-challenges";
const BRANCH = "main";
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`;
const API_BASE = `https://api.github.com/repos/${REPO}`;

interface RawInfoYml {
	title: string;
	author:
		| {
				name?: string;
				email?: string;
				github?: string;
		  }
		| string;
	difficulty: string;
	tags?: string | string[];
	related?: number | number[];
}

interface ChallengeData {
	id: number;
	slug: string;
	title: string;
	difficulty: string;
	author: { name: string; email?: string; github?: string };
	tags: string[];
	related: number[];
	readmes: { en: string; ko?: string; ja?: string };
	template: string;
	testCases: string;
}

async function fetchText(url: string): Promise<string> {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
	return res.text();
}

async function fetchTextOptional(url: string): Promise<string | undefined> {
	try {
		const res = await fetch(url);
		if (!res.ok) return undefined;
		return res.text();
	} catch {
		return undefined;
	}
}

async function fetchQuestionList(): Promise<string[]> {
	const res = await fetch(`${API_BASE}/contents/questions`, {
		headers: {
			Accept: "application/vnd.github.v3+json",
			...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
		},
	});
	if (!res.ok) throw new Error(`Failed to fetch question list: ${res.status}`);
	const items: { name: string; type: string }[] = await res.json();
	return items.filter((i) => i.type === "dir").map((i) => i.name);
}

function parseSlug(folderName: string): {
	id: number;
	difficulty: string;
} | null {
	// Pattern: 00013-warm-hello-world → id=13, difficulty extracted from info.yml
	const match = folderName.match(/^(\d+)-(\w+)/);
	if (!match) return null;
	return { id: parseInt(match[1], 10), difficulty: match[2] };
}

async function fetchChallenge(folderName: string): Promise<ChallengeData | null> {
	const parsed = parseSlug(folderName);
	if (!parsed) return null;

	const base = `${RAW_BASE}/questions/${folderName}`;

	try {
		const [infoText, readmeEn, readmeKo, readmeJa, template, testCases] = await Promise.all([
			fetchText(`${base}/info.yml`),
			fetchText(`${base}/README.md`),
			fetchTextOptional(`${base}/README.ko.md`),
			fetchTextOptional(`${base}/README.ja.md`),
			fetchText(`${base}/template.ts`),
			fetchText(`${base}/test-cases.ts`),
		]);

		const info: RawInfoYml = parseYaml(infoText);

		const author =
			typeof info.author === "string"
				? { name: info.author }
				: {
						name: info.author?.name ?? "Unknown",
						email: info.author?.email,
						github: info.author?.github,
					};

		const tags = Array.isArray(info.tags) ? info.tags : info.tags ? [info.tags] : [];

		const rawRelated = Array.isArray(info.related)
			? info.related
			: info.related
				? [info.related]
				: [];
		const related = rawRelated
			.flatMap((r) => String(r).split(","))
			.map((s) => Number.parseInt(String(s).trim(), 10))
			.filter((n) => !Number.isNaN(n));

		const readmes: ChallengeData["readmes"] = { en: readmeEn };
		if (readmeKo) readmes.ko = readmeKo;
		if (readmeJa) readmes.ja = readmeJa;

		return {
			id: parsed.id,
			slug: folderName,
			title: info.title,
			difficulty: info.difficulty,
			author,
			tags,
			related,
			readmes,
			template,
			testCases,
		};
	} catch (err) {
		console.warn(`Skipping ${folderName}:`, (err as Error).message);
		return null;
	}
}

async function main() {
	console.log("Fetching challenge list from GitHub...");
	const folders = await fetchQuestionList();
	console.log(`Found ${folders.length} challenge folders.`);

	const BATCH_SIZE = 10;
	const challenges: ChallengeData[] = [];

	for (let i = 0; i < folders.length; i += BATCH_SIZE) {
		const batch = folders.slice(i, i + BATCH_SIZE);
		const results = await Promise.all(batch.map(fetchChallenge));
		for (const r of results) {
			if (r) challenges.push(r);
		}
		console.log(`Processed ${Math.min(i + BATCH_SIZE, folders.length)}/${folders.length}...`);
	}

	const diffOrder: Record<string, number> = {
		warm: 0,
		easy: 1,
		medium: 2,
		hard: 3,
		extreme: 4,
	};
	challenges.sort(
		(a, b) => (diffOrder[a.difficulty] ?? 99) - (diffOrder[b.difficulty] ?? 99) || a.id - b.id,
	);

	const outDir = path.join(process.cwd(), "src", "data");
	mkdirSync(outDir, { recursive: true });

	writeFileSync(path.join(outDir, "challenges.json"), JSON.stringify(challenges, null, 2));

	const index = challenges.map(({ id, slug, title, difficulty, author, tags }) => ({
		id,
		slug,
		title,
		difficulty,
		author,
		tags,
	}));
	writeFileSync(path.join(outDir, "challenges-index.json"), JSON.stringify(index, null, 2));

	console.log(`\nDone! Generated ${challenges.length} challenges.`);
	console.log(`  - ${outDir}/challenges.json`);
	console.log(`  - ${outDir}/challenges-index.json`);
}

main().catch((err) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
