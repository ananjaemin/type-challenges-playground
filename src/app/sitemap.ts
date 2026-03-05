import type { MetadataRoute } from "next";
import { getAllChallengesMeta } from "@/lib/challenges";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
	const challenges = getAllChallengesMeta();

	const challengeEntries: MetadataRoute.Sitemap = challenges.map((c) => ({
		url: `${siteConfig.url}/challenges/${c.slug}`,
		lastModified: new Date(),
		changeFrequency: "monthly",
		priority: 0.8,
	}));

	return [
		{
			url: siteConfig.url,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		...challengeEntries,
	];
}
