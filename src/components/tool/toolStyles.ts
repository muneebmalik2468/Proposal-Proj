import type { PromptKey } from "@/lib/server/prompts";

export const UpworkStyles = [
  { key: "mirror" as const, label: "Problem Mirror" },
  { key: "proof" as const, label: "Proof Closer" },
  { key: "diagnostic" as const, label: "Diagnostic Hook" },
] satisfies { key: PromptKey; label: string }[];

export const InMailStyles = [
  { key: "value_sniper" as const, label: "Value Sniper" },
  { key: "curiosity_gap" as const, label: "Curiosity Gap" },
  { key: "consultant_frame" as const, label: "Consultant Frame" },
] satisfies { key: PromptKey; label: string }[];

export const ConnectionNoteStyles = [
  { key: "shared_context" as const, label: "Shared Context" },
  { key: "value_drop" as const, label: "Value Drop" },
  { key: "sharp_question" as const, label: "Sharp Question" },
] satisfies { key: PromptKey; label: string }[];

export const ColdEmailStyles = [
  { key: "email_value" as const, label: "Value Approach" },
  { key: "email_curiosity" as const, label: "Curiosity Approach" },
  { key: "email_diagnostic" as const, label: "Diagnostic Approach" },
] satisfies { key: PromptKey; label: string }[];

