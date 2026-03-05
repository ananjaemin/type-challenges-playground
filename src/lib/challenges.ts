import challengesData from "@/data/challenges.json";
import indexData from "@/data/challenges-index.json";
import type { Challenge, ChallengeMeta, Difficulty } from "@/types/challenge";

export function getAllChallengesMeta(): ChallengeMeta[] {
	return indexData as ChallengeMeta[];
}

export function getChallengeBySlug(slug: string): Challenge | undefined {
	return (challengesData as Challenge[]).find((c) => c.slug === slug);
}

export function getChallengesByDifficulty(difficulty: Difficulty): ChallengeMeta[] {
	return (indexData as ChallengeMeta[]).filter((c) => c.difficulty === difficulty);
}

export function getAllSlugs(): string[] {
	return (indexData as ChallengeMeta[]).map((c) => c.slug);
}

export function getRelatedChallenges(ids: number[]): ChallengeMeta[] {
	if (ids.length === 0) return [];
	const metas = indexData as ChallengeMeta[];
	const idSet = new Set(ids);
	return metas.filter((c) => idSet.has(c.id));
}

export function getNextChallengeSlug(currentSlug: string): string | null {
	const metas = indexData as ChallengeMeta[];
	const idx = metas.findIndex((c) => c.slug === currentSlug);
	if (idx === -1 || idx >= metas.length - 1) return null;
	return metas[idx + 1].slug;
}
