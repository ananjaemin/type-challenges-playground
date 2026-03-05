"use client";

import {
	ArrowLeft,
	ArrowRight,
	CheckCircle2,
	Code2,
	ExternalLink,
	FileText,
	Info,
	Loader2,
	Tag,
	XCircle,
} from "lucide-react";
import { marked } from "marked";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CelebrationModal } from "@/components/challenge/celebration-modal";
import { DifficultyBadge } from "@/components/challenge/difficulty-badge";
import type { DiagnosticInfo } from "@/components/editor/monaco-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { type Challenge, type ChallengeMeta, LOCALE_LABELS, type Locale } from "@/types/challenge";

const LOCALES: Locale[] = ["en", "ko", "ja"];

const TypeChallengeEditor = dynamic(
	() => import("@/components/editor/monaco-editor").then((m) => m.TypeChallengeEditor),
	{
		ssr: false,
		loading: () => (
			<div className="flex h-full items-center justify-center bg-[#1e1e1e]">
				<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
			</div>
		),
	},
);

marked.setOptions({
	gfm: true,
	breaks: false,
});

export function ChallengeWorkspace({
	challenge,
	nextChallengeSlug,
	relatedChallenges,
}: {
	challenge: Challenge;
	nextChallengeSlug: string | null;
	relatedChallenges: ChallengeMeta[];
}) {
	const [diagnostics, setDiagnostics] = useState<DiagnosticInfo[] | null>(null);
	const [celebrationOpen, setCelebrationOpen] = useState(false);
	const prevPassingRef = useRef(false);
	const [mobileView, setMobileView] = useState<"description" | "editor">("editor");

	const [locale, setLocale] = useState<Locale>("en");

	useEffect(() => {
		const saved = localStorage.getItem("ts-challenges-locale") as Locale | null;
		if (saved && saved !== "en") setLocale(saved);
	}, []);

	useEffect(() => {
		localStorage.setItem("ts-challenges-locale", locale);
	}, [locale]);

	const handleDiagnosticsChange = useCallback((errors: DiagnosticInfo[]) => {
		setDiagnostics(errors);
	}, []);

	const currentReadme = challenge.readmes[locale] ?? challenge.readmes.en;
	const [readmeHtml, setReadmeHtml] = useState("");

	useEffect(() => {
		const cleaned = currentReadme
			.replace(/<!--info-header-start-->[\s\S]*?<!--info-header-end-->/g, "")
			.replace(/<!--info-footer-start-->[\s\S]*?<!--info-footer-end-->/g, "")
			.replace(/^<!--[\s\S]*?-->\n*/gm, "");
		setReadmeHtml(marked.parse(cleaned) as string);
	}, [currentReadme]);

	const errors = diagnostics?.filter((d) => d.severity === "error") ?? [];
	const isPassing = diagnostics !== null && errors.length === 0;

	useEffect(() => {
		if (isPassing && !prevPassingRef.current) {
			setCelebrationOpen(true);
		}
		prevPassingRef.current = isPassing;
	}, [isPassing]);

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<div className="flex items-center gap-2 border-b px-3 py-2 md:gap-3 md:px-4">
				<Link href="/">
					<Button variant="ghost" size="sm">
						<ArrowLeft className="mr-1 h-4 w-4" />
						<span className="hidden sm:inline">Back</span>
					</Button>
				</Link>

				<div className="flex min-w-0 items-center gap-2">
					<span className="hidden text-xs text-muted-foreground sm:inline">#{challenge.id}</span>
					<h1 className="truncate font-semibold text-sm md:text-base">{challenge.title}</h1>
					<DifficultyBadge difficulty={challenge.difficulty} />
				</div>

				<div className="flex-1" />

				<div className="flex items-center gap-2 md:hidden">
					<Button
						size="sm"
						variant={mobileView === "description" ? "default" : "outline"}
						onClick={() => setMobileView("description")}
						className="h-7 px-2 text-xs"
					>
						<FileText className="mr-1 h-3 w-3" />
						Desc
					</Button>
					<Button
						size="sm"
						variant={mobileView === "editor" ? "default" : "outline"}
						onClick={() => setMobileView("editor")}
						className="h-7 px-2 text-xs"
					>
						<Code2 className="mr-1 h-3 w-3" />
						Editor
					</Button>
				</div>

				<StatusIndicator
					diagnostics={diagnostics}
					isPassing={isPassing}
					errorCount={errors.length}
				/>
			</div>

			<div className="flex min-h-0 flex-1">
				<div
					className={cn(
						"flex min-h-0 w-full flex-col border-r md:w-[480px] md:min-w-[380px]",
						mobileView !== "description" && "hidden md:flex",
					)}
				>
					<Tabs defaultValue="description" className="flex min-h-0 flex-1 flex-col">
						<TabsList className="w-full justify-start rounded-none border-b bg-transparent px-4">
							<TabsTrigger value="description">Description</TabsTrigger>
							<TabsTrigger value="diagnostics">
								Diagnostics
								{diagnostics !== null && (
									<Badge
										variant={isPassing ? "default" : "destructive"}
										className="ml-1.5 h-5 px-1.5 text-[10px]"
									>
										{errors.length}
									</Badge>
								)}
							</TabsTrigger>
						</TabsList>

						<TabsContent value="description" className="mt-0 min-h-0 flex-1 overflow-hidden">
							<ScrollArea className="h-full">
								<div className="max-w-full space-y-0 overflow-hidden">
									<div className="space-y-3 border-b bg-muted/30 p-4">
										<div className="space-y-1">
											<span className="text-xs font-medium text-muted-foreground">
												#{challenge.id}
											</span>
											<div className="flex items-center gap-2">
												<h2 className="text-lg font-bold">{challenge.title}</h2>
												<DifficultyBadge difficulty={challenge.difficulty} />
											</div>
										</div>

										{challenge.author && (
											<div className="flex items-center gap-1.5 text-sm text-muted-foreground">
												<span>by</span>
												{challenge.author.github ? (
													<a
														href={`https://github.com/${challenge.author.github}`}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex items-center gap-1 font-medium text-foreground hover:underline"
													>
														{challenge.author.name}
														<ExternalLink className="h-3 w-3" />
													</a>
												) : (
													<span className="font-medium text-foreground">
														{challenge.author.name}
													</span>
												)}
											</div>
										)}

										{challenge.tags && challenge.tags.length > 0 && (
											<div className="flex flex-wrap items-center gap-1.5">
												<Tag className="h-3 w-3 text-muted-foreground" />
												{challenge.tags.map((tag) => (
													<Badge key={tag} variant="secondary" className="text-[10px] font-normal">
														{tag}
													</Badge>
												))}
											</div>
										)}

										<Separator />

										<div className="flex items-center gap-1">
											{LOCALES.map((l) => {
												const available = challenge.readmes[l] !== undefined;
												const active = locale === l;
												return (
													<Button
														key={l}
														size="sm"
														variant={active ? "default" : "outline"}
														disabled={!available}
														onClick={() => setLocale(l)}
														className={cn("h-7 px-2.5 text-xs", !available && "opacity-40")}
													>
														{LOCALE_LABELS[l]}
													</Button>
												);
											})}
										</div>
									</div>

									<div className="p-4">
										<div
											className="prose prose-sm prose-invert max-w-none [&_pre]:overflow-x-auto"
											dangerouslySetInnerHTML={{ __html: readmeHtml }}
										/>
									</div>

									{relatedChallenges.length > 0 && (
										<div className="border-t p-4">
											<h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
												<ArrowRight className="h-3.5 w-3.5" />
												Related Challenges
											</h3>
											<div className="space-y-1.5">
												{relatedChallenges.map((rc) => (
													<Link
														key={rc.slug}
														href={`/challenges/${rc.slug}`}
														className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted/50"
													>
														<span className="text-xs text-muted-foreground">#{rc.id}</span>
														<span className="flex-1 truncate font-medium">{rc.title}</span>
														<DifficultyBadge difficulty={rc.difficulty} />
													</Link>
												))}
											</div>
										</div>
									)}
								</div>
							</ScrollArea>
						</TabsContent>

						<TabsContent value="diagnostics" className="mt-0 min-h-0 flex-1 overflow-hidden">
							<ScrollArea className="h-full">
								<div className="space-y-2 p-4">
									{diagnostics === null ? (
										<p className="text-sm text-muted-foreground">Loading...</p>
									) : errors.length === 0 ? (
										<div className="flex items-center gap-2 text-green-500">
											<CheckCircle2 className="h-4 w-4" />
											<span className="text-sm font-medium">All type checks pass!</span>
										</div>
									) : (
										<>
											<div className="flex gap-2 rounded-md border border-blue-500/20 bg-blue-500/5 p-3 text-blue-400">
												<Info className="mt-0.5 h-4 w-4 shrink-0" />
												<p className="text-sm">
													These errors are expected — solve the type puzzle in the editor to make
													them disappear!
												</p>
											</div>
											{errors.map((d) => (
												<div
													key={`${d.startLineNumber}:${d.startColumn}:${d.message}`}
													className="rounded-md border border-red-500/20 bg-red-500/5 p-3"
												>
													<p className="text-xs text-muted-foreground">
														Line {d.startLineNumber}, Col {d.startColumn}
													</p>
													<p className="mt-1 text-sm text-red-400">{d.message}</p>
												</div>
											))}
										</>
									)}
								</div>
							</ScrollArea>
						</TabsContent>
					</Tabs>
				</div>

				<div className={cn("flex-1", mobileView !== "editor" && "hidden md:block")}>
					<TypeChallengeEditor
						template={challenge.template}
						testCases={challenge.testCases}
						onDiagnosticsChange={handleDiagnosticsChange}
					/>
				</div>
			</div>

			<CelebrationModal
				open={celebrationOpen}
				onOpenChange={setCelebrationOpen}
				challenge={challenge}
				nextChallengeSlug={nextChallengeSlug}
			/>
		</div>
	);
}

function StatusIndicator({
	diagnostics,
	isPassing,
	errorCount,
}: {
	diagnostics: DiagnosticInfo[] | null;
	isPassing: boolean;
	errorCount: number;
}) {
	if (diagnostics === null) {
		return (
			<div className="flex items-center gap-1.5 text-muted-foreground">
				<Loader2 className="h-4 w-4 animate-spin" />
				<span className="text-sm">Checking...</span>
			</div>
		);
	}

	if (isPassing) {
		return (
			<div className="flex items-center gap-1.5 text-green-500">
				<CheckCircle2 className="h-4 w-4" />
				<span className="text-sm font-medium">Passing</span>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-1.5 text-red-400">
			<XCircle className="h-4 w-4" />
			<span className="text-sm font-medium">
				{errorCount} error{errorCount !== 1 && "s"}
			</span>
		</div>
	);
}
