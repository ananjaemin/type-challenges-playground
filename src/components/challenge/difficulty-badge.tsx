import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DIFFICULTY_COLORS, type Difficulty } from "@/types/challenge";

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
	return (
		<Badge variant="ghost" className={cn("text-xs", DIFFICULTY_COLORS[difficulty])}>
			{difficulty}
		</Badge>
	);
}
