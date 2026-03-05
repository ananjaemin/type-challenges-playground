"use client";

import Editor, { type BeforeMount, type Monaco, type OnMount } from "@monaco-editor/react";
import { Lock, Pencil } from "lucide-react";
import type { editor } from "monaco-editor";
import { useCallback, useEffect, useRef, useState } from "react";
import { TYPE_CHALLENGE_UTILS_DECLARATION } from "./type-challenge-utils";

const SOLUTION_URI = "file:///solution.tsx";
const TESTS_URI = "file:///tests.tsx";

interface TypeChallengeEditorProps {
	template: string;
	testCases: string;
	onDiagnosticsChange?: (errors: DiagnosticInfo[]) => void;
}

export interface DiagnosticInfo {
	message: string;
	startLineNumber: number;
	startColumn: number;
	severity: "error" | "warning" | "info";
}

function cleanTestCases(testCases: string): string {
	return testCases.replace(/^import\s+.*['"]@type-challenges\/utils['"].*$/gm, "").trim();
}

export function TypeChallengeEditor({
	template,
	testCases,
	onDiagnosticsChange,
}: TypeChallengeEditorProps) {
	const solutionEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
	const monacoRef = useRef<Monaco | null>(null);
	const [isReady, setIsReady] = useState(false);
	const diagnosticsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const testsModelRef = useRef<editor.ITextModel | null>(null);

	const cleanedTests = cleanTestCases(testCases);

	const handleBeforeMount: BeforeMount = useCallback((monaco) => {
		monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
			target: monaco.languages.typescript.ScriptTarget.ESNext,
			module: monaco.languages.typescript.ModuleKind.ESNext,
			strict: true,
			noEmit: true,
			esModuleInterop: true,
			moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
			skipLibCheck: true,
			forceConsistentCasingInFileNames: true,
			jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
		});

		monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
			noSemanticValidation: false,
			noSyntaxValidation: false,
		});

		monaco.languages.typescript.typescriptDefaults.addExtraLib(
			TYPE_CHALLENGE_UTILS_DECLARATION,
			"file:///type-challenge-utils.d.ts",
		);
	}, []);

	const handleSolutionMount: OnMount = useCallback(
		(editorInstance, monaco) => {
			solutionEditorRef.current = editorInstance;
			monacoRef.current = monaco;

			const existingModel = monaco.editor.getModel(monaco.Uri.parse(TESTS_URI));
			if (existingModel) {
				testsModelRef.current = existingModel;
				existingModel.setValue(cleanedTests);
			} else {
				testsModelRef.current = monaco.editor.createModel(
					cleanedTests,
					"typescript",
					monaco.Uri.parse(TESTS_URI),
				);
			}

			setIsReady(true);
		},
		[cleanedTests],
	);

	useEffect(() => {
		return () => {
			testsModelRef.current?.dispose();
			testsModelRef.current = null;
		};
	}, []);

	useEffect(() => {
		if (!isReady || !monacoRef.current || !solutionEditorRef.current) return;

		const monaco = monacoRef.current;
		const solutionModel = solutionEditorRef.current.getModel();
		const testsModel = testsModelRef.current;
		if (!solutionModel || !testsModel) return;

		const checkDiagnostics = async () => {
			try {
				const worker = await monaco.languages.typescript.getTypeScriptWorker();
				const client = await worker(testsModel.uri);

				const [semanticDiag, syntaxDiag] = await Promise.all([
					client.getSemanticDiagnostics(testsModel.uri.toString()),
					client.getSyntacticDiagnostics(testsModel.uri.toString()),
				]);

				const mapped: DiagnosticInfo[] = [...syntaxDiag, ...semanticDiag].map((d) => {
					const start = testsModel.getPositionAt(d.start ?? 0);
					return {
						message: typeof d.messageText === "string" ? d.messageText : d.messageText.messageText,
						startLineNumber: start.lineNumber,
						startColumn: start.column,
						severity: d.category === 1 ? "error" : d.category === 0 ? "warning" : "info",
					};
				});

				onDiagnosticsChange?.(mapped);
			} catch {}
		};

		const debouncedCheck = () => {
			if (diagnosticsTimerRef.current) clearTimeout(diagnosticsTimerRef.current);
			diagnosticsTimerRef.current = setTimeout(checkDiagnostics, 300);
		};

		const disposable = solutionModel.onDidChangeContent(debouncedCheck);
		const initialTimer = setTimeout(checkDiagnostics, 800);

		return () => {
			disposable.dispose();
			clearTimeout(initialTimer);
			if (diagnosticsTimerRef.current) clearTimeout(diagnosticsTimerRef.current);
		};
	}, [isReady, onDiagnosticsChange]);

	const sharedEditorOptions: editor.IStandaloneEditorConstructionOptions = {
		minimap: { enabled: false },
		fontSize: 14,
		fontFamily: "var(--font-geist-mono), monospace",
		lineNumbers: "on",
		scrollBeyondLastLine: false,
		automaticLayout: true,
		tabSize: 2,
		renderValidationDecorations: "on",
	};

	return (
		<div className="flex h-full flex-col">
			<div className="flex items-center gap-1.5 border-b border-[#2d2d2d] bg-[#1e1e1e] px-4 py-1.5">
				<Pencil className="h-3 w-3 text-blue-400" />
				<span className="text-xs font-medium text-zinc-400">Your Solution</span>
			</div>
			<div className="min-h-0 flex-1">
				<Editor
					height="100%"
					defaultLanguage="typescript"
					defaultValue={template}
					path={SOLUTION_URI}
					theme="vs-dark"
					beforeMount={handleBeforeMount}
					onMount={handleSolutionMount}
					options={{
						...sharedEditorOptions,
						padding: { top: 12, bottom: 8 },
					}}
				/>
			</div>

			<div className="flex items-center gap-1.5 border-y border-[#2d2d2d] bg-[#252526] px-4 py-1.5">
				<Lock className="h-3 w-3 text-zinc-500" />
				<span className="text-xs font-medium text-zinc-500">Test Cases</span>
				<span className="text-[10px] text-zinc-600">read-only</span>
			</div>
			<div className="min-h-0 flex-1 opacity-80">
				<Editor
					height="100%"
					defaultLanguage="typescript"
					defaultValue={cleanedTests}
					path={TESTS_URI}
					theme="vs-dark"
					options={{
						...sharedEditorOptions,
						readOnly: true,
						domReadOnly: true,
						padding: { top: 12, bottom: 8 },
						renderValidationDecorations: "on",
						lineNumbers: "on",
						contextmenu: false,
						cursorStyle: "line-thin",
					}}
				/>
			</div>
		</div>
	);
}
