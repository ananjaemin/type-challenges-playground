"use client";

import { ArrowRight, ExternalLink, Home, PartyPopper } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { DifficultyBadge } from "@/components/challenge/difficulty-badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Difficulty } from "@/types/challenge";

interface CelebrationModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	challenge: { id: number; title: string; difficulty: Difficulty };
	nextChallengeSlug: string | null;
}

async function fireConfetti() {
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

	const { default: confetti } = await import("canvas-confetti");

	confetti({
		particleCount: 80,
		spread: 70,
		origin: { x: 0.25, y: 0.6 },
	});
	confetti({
		particleCount: 80,
		spread: 70,
		origin: { x: 0.75, y: 0.6 },
	});
}

export function CelebrationModal({
	open,
	onOpenChange,
	challenge,
	nextChallengeSlug,
}: CelebrationModalProps) {
	useEffect(() => {
		if (open) {
			fireConfetti();
		}
	}, [open]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader className="items-center text-center">
					<div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/15">
						<PartyPopper className="h-6 w-6 text-green-500" />
					</div>
					<DialogTitle className="text-xl">Challenge Solved!</DialogTitle>
					<DialogDescription className="flex flex-col items-center gap-2">
						<span>
							You solved <strong>{challenge.title}</strong>!
						</span>
						<DifficultyBadge difficulty={challenge.difficulty} />
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className="flex-col gap-2 sm:flex-col">
					{nextChallengeSlug && (
						<Button asChild className="w-full">
							<Link href={`/challenges/${nextChallengeSlug}`}>
								Next Challenge
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					)}
					<Button variant="outline" className="w-full" asChild>
						<a
							href={`https://tsch.js.org/${challenge.id}/answer`}
							target="_blank"
							rel="noopener noreferrer"
						>
							Share Solution
							<ExternalLink className="ml-2 h-4 w-4" />
						</a>
					</Button>
					<Button variant="ghost" className="w-full" asChild>
						<Link href="/">
							<Home className="mr-2 h-4 w-4" />
							Back to Challenges
						</Link>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
