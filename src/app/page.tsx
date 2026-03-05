import { ChallengeList } from "@/components/challenge/challenge-list";
import { getAllChallengesMeta } from "@/lib/challenges";

export default function HomePage() {
	const challenges = getAllChallengesMeta();

	return (
		<div className="flex flex-1 flex-col overflow-y-auto [scrollbar-gutter:stable]">
			<div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
				<div className="mb-8 space-y-2">
					<h1 className="text-3xl font-bold tracking-tight">TypeScript Type Challenges</h1>
					<p className="text-muted-foreground">
						Solve type-level challenges to sharpen your TypeScript skills. Pick a challenge and make
						all type assertions pass.
					</p>
				</div>
				<ChallengeList challenges={challenges} />
			</div>
			<footer className="border-t py-4 text-center text-xs text-muted-foreground">
				<p>
					Challenges sourced from{" "}
					<a
						href="https://github.com/type-challenges/type-challenges"
						target="_blank"
						rel="noopener noreferrer"
						className="underline underline-offset-2 hover:text-foreground"
					>
						type-challenges
					</a>{" "}
					by{" "}
					<a
						href="https://github.com/antfu"
						target="_blank"
						rel="noopener noreferrer"
						className="underline underline-offset-2 hover:text-foreground"
					>
						Anthony Fu
					</a>{" "}
					&middot; Licensed under MIT
				</p>
			</footer>
		</div>
	);
}
