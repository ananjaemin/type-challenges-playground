import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChallengeMeta } from "@/types/challenge";
import { DifficultyBadge } from "./difficulty-badge";

export function ChallengeCard({ challenge }: { challenge: ChallengeMeta }) {
	return (
		<Link href={`/challenges/${challenge.slug}`}>
			<Card className="h-full transition-colors hover:border-primary/30 hover:shadow-md">
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between gap-2">
						<span className="text-xs text-muted-foreground">#{challenge.id}</span>
						<DifficultyBadge difficulty={challenge.difficulty} />
					</div>
					<CardTitle className="text-base">{challenge.title}</CardTitle>
				</CardHeader>
				{challenge.tags && challenge.tags.length > 0 && (
					<CardContent className="pt-0">
						<div className="flex flex-wrap gap-1">
							{challenge.tags.map((tag) => (
								<span
									key={tag}
									className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
								>
									{tag}
								</span>
							))}
						</div>
					</CardContent>
				)}
			</Card>
		</Link>
	);
}
