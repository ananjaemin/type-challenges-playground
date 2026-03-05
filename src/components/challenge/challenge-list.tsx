"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type ChallengeMeta, DIFFICULTY_ORDER, type Difficulty } from "@/types/challenge";
import { ChallengeCard } from "./challenge-card";

const DIFFICULTIES: Difficulty[] = ["warm", "easy", "medium", "hard", "extreme"];

const FILTER_COLORS: Record<Difficulty, string> = {
	warm: "data-[active=true]:bg-teal-500/15 data-[active=true]:text-teal-700 dark:data-[active=true]:text-teal-400 data-[active=true]:border-teal-500/30",
	easy: "data-[active=true]:bg-green-500/15 data-[active=true]:text-green-700 dark:data-[active=true]:text-green-400 data-[active=true]:border-green-500/30",
	medium:
		"data-[active=true]:bg-amber-500/15 data-[active=true]:text-amber-700 dark:data-[active=true]:text-amber-400 data-[active=true]:border-amber-500/30",
	hard: "data-[active=true]:bg-red-500/15 data-[active=true]:text-red-700 dark:data-[active=true]:text-red-400 data-[active=true]:border-red-500/30",
	extreme:
		"data-[active=true]:bg-purple-500/15 data-[active=true]:text-purple-700 dark:data-[active=true]:text-purple-400 data-[active=true]:border-purple-500/30",
};

export function ChallengeList({ challenges }: { challenges: ChallengeMeta[] }) {
	const [search, setSearch] = useState("");
	const [selectedDifficulties, setSelectedDifficulties] = useState<Set<Difficulty>>(new Set());

	const toggleDifficulty = (d: Difficulty) => {
		setSelectedDifficulties((prev) => {
			const next = new Set(prev);
			if (next.has(d)) next.delete(d);
			else next.add(d);
			return next;
		});
	};

	const filtered = useMemo(() => {
		let result = challenges;

		if (selectedDifficulties.size > 0) {
			result = result.filter((c) => selectedDifficulties.has(c.difficulty));
		}

		if (search.trim()) {
			const q = search.toLowerCase();
			result = result.filter(
				(c) =>
					c.title.toLowerCase().includes(q) ||
					c.id.toString().includes(q) ||
					c.tags?.some((t) => t.toLowerCase().includes(q)),
			);
		}

		return result.sort(
			(a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty] || a.id - b.id,
		);
	}, [challenges, selectedDifficulties, search]);

	const countByDifficulty = useMemo(() => {
		const counts: Record<string, number> = {};
		for (const c of challenges) {
			counts[c.difficulty] = (counts[c.difficulty] ?? 0) + 1;
		}
		return counts;
	}, [challenges]);

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search challenges..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-9"
					/>
				</div>
			</div>

			<div className="flex flex-wrap gap-2">
				{DIFFICULTIES.map((d) => (
					<Button
						key={d}
						variant="outline"
						size="sm"
						data-active={selectedDifficulties.has(d)}
						onClick={() => toggleDifficulty(d)}
						className={cn("capitalize", FILTER_COLORS[d])}
					>
						{d}
						<span className="ml-1 text-[10px] opacity-60">{countByDifficulty[d] ?? 0}</span>
					</Button>
				))}
			</div>

			<p className="text-sm text-muted-foreground">
				{filtered.length} challenge{filtered.length !== 1 && "s"}
			</p>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{filtered.map((c) => (
					<ChallengeCard key={c.slug} challenge={c} />
				))}
			</div>
		</div>
	);
}
