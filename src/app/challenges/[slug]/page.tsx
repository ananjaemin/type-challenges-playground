import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
	getAllSlugs,
	getChallengeBySlug,
	getNextChallengeSlug,
	getRelatedChallenges,
} from "@/lib/challenges";
import { siteConfig } from "@/lib/site-config";
import { ChallengeWorkspace } from "./challenge-workspace";

export function generateStaticParams() {
	return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const challenge = getChallengeBySlug(slug);
	if (!challenge) return { title: "Challenge Not Found" };

	const title = challenge.title;
	const description = `Solve the "${title}" type challenge — ${challenge.difficulty} difficulty. Practice type-level TypeScript with real-time type checking.`;
	const url = `${siteConfig.url}/challenges/${slug}`;
	const tags = challenge.tags ?? [];
	const keywords = [...siteConfig.keywords, challenge.difficulty, ...tags];

	return {
		title,
		description,
		keywords,
		openGraph: {
			title: `${title} | ${siteConfig.name}`,
			description,
			url,
			type: "article",
			tags: [challenge.difficulty, ...tags],
		},
		twitter: {
			card: "summary",
			title: `${title} | ${siteConfig.name}`,
			description,
		},
		alternates: {
			canonical: url,
		},
	};
}

export default async function ChallengePage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const challenge = getChallengeBySlug(slug);

	if (!challenge) notFound();

	const nextChallengeSlug = getNextChallengeSlug(slug);
	const relatedChallenges = getRelatedChallenges(challenge.related ?? []);

	return (
		<ChallengeWorkspace
			challenge={challenge}
			nextChallengeSlug={nextChallengeSlug}
			relatedChallenges={relatedChallenges}
		/>
	);
}
