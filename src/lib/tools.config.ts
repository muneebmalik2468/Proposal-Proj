export type ToolColor = "green" | "blue" | "red";
export type ToolType = "proposal" | "linkedin" | "email";
export type InputKind = "text" | "textarea";

export type ToolStyleOption = {
  key: string;
  label: string;
};

export type ToolInputField = {
  key: string;
  label: string;
  required: boolean;
  kind: InputKind;
};

export type ToolOutputFormat = {
  structure: string;
  textFormat: "plain_text";
  limits: Record<string, number>;
};

export type ToolConfig = {
  id: string;
  label: string;
  name: string;
  type: ToolType;
  icon: string;
  color: ToolColor;
  accentHex: string;
  path: string;
  phase: number;
  active: boolean;
  styles: ToolStyleOption[];
  tones: string[];
  inputFields: ToolInputField[];
  outputFormat: ToolOutputFormat;
};

// Frontend-safe registry (no secrets). Adding a tool should be additive-only.
export const TOOLS: ToolConfig[] = [
  {
    id: "upwork-proposal",
    label: "Upwork Proposal",
    name: "Upwork Proposal Writer",
    type: "proposal",
    icon: "📋",
    color: "green",
    accentHex: "#14A800",
    path: "/app/upwork",
    phase: 1,
    active: true,
    styles: [
      { key: "mirror", label: "Problem Mirror" },
      { key: "proof", label: "Proof Closer" },
      { key: "diagnostic", label: "Diagnostic Hook" },
    ],
    tones: ["Professional", "Warm", "Direct"],
    inputFields: [
      { key: "jobPostText", label: "Job Post Text", required: true, kind: "textarea" },
      { key: "yourSkills", label: "Your Skills", required: false, kind: "textarea" },
    ],
    outputFormat: {
      structure: "Single proposal body",
      textFormat: "plain_text",
      limits: { minWords: 150, maxWords: 220 },
    },
  },
  {
    id: "linkedin-inmail",
    label: "LinkedIn InMail",
    name: "LinkedIn InMail",
    type: "linkedin",
    icon: "✉️",
    color: "blue",
    accentHex: "#0A66C2",
    path: "/app/linkedin-inmail",
    phase: 1,
    active: true,
    styles: [
      { key: "value_sniper", label: "Value Sniper" },
      { key: "curiosity_gap", label: "Curiosity Gap" },
      { key: "consultant_frame", label: "Consultant Frame" },
    ],
    tones: [],
    inputFields: [
      { key: "prospectName", label: "Prospect Name", required: true, kind: "text" },
      { key: "myService", label: "My Service", required: true, kind: "text" },
      { key: "jobTitle", label: "Job Title", required: false, kind: "text" },
      { key: "company", label: "Company", required: false, kind: "text" },
      { key: "industry", label: "Industry", required: false, kind: "text" },
      { key: "researchNote", label: "Research Note", required: false, kind: "textarea" },
    ],
    outputFormat: {
      structure: "Subject line + InMail body",
      textFormat: "plain_text",
      limits: { bodyMinWords: 100, bodyMaxWords: 160 },
    },
  },
  {
    id: "linkedin-connection",
    label: "Connection Note",
    name: "LinkedIn Connection Note",
    type: "linkedin",
    icon: "🤝",
    color: "blue",
    accentHex: "#0A66C2",
    path: "/app/linkedin-connection",
    phase: 1,
    active: true,
    styles: [
      { key: "shared_context", label: "Shared Context" },
      { key: "value_drop", label: "Value Drop" },
      { key: "sharp_question", label: "Sharp Question" },
    ],
    tones: [],
    inputFields: [
      { key: "prospectName", label: "Prospect Name", required: true, kind: "text" },
      { key: "myService", label: "My Service", required: true, kind: "text" },
      { key: "jobTitle", label: "Job Title", required: false, kind: "text" },
      { key: "company", label: "Company", required: false, kind: "text" },
      { key: "industry", label: "Industry", required: false, kind: "text" },
      { key: "sharedContext", label: "Shared Context", required: false, kind: "textarea" },
    ],
    outputFormat: {
      structure: "Single connection note",
      textFormat: "plain_text",
      limits: { maxCharacters: 300 },
    },
  },
  {
    id: "cold-email",
    label: "Cold Email",
    name: "Cold Email Generator",
    type: "email",
    icon: "📨",
    color: "red",
    accentHex: "#DC2626",
    path: "/app/cold-email",
    phase: 1,
    active: true,
    styles: [
      { key: "email_value", label: "Value Approach" },
      { key: "email_curiosity", label: "Curiosity Approach" },
      { key: "email_diagnostic", label: "Diagnostic Approach" },
    ],
    tones: [],
    inputFields: [
      { key: "prospectName", label: "Prospect Name", required: true, kind: "text" },
      { key: "company", label: "Company", required: true, kind: "text" },
      { key: "myService", label: "My Service", required: true, kind: "text" },
      { key: "industry", label: "Industry", required: false, kind: "text" },
    ],
    outputFormat: {
      structure: "3 subject lines + body + PS",
      textFormat: "plain_text",
      limits: { bodyMinWords: 120, bodyMaxWords: 160 },
    },
  },
  // Phase 2+ (listed for planning only; must remain inactive in MVP)
  { id: "email-sender", label: "Email Sender", name: "Email Sender", type: "email", icon: "📤", color: "red", accentHex: "#DC2626", path: "/app/email-sender", phase: 2, active: false, styles: [], tones: [], inputFields: [], outputFormat: { structure: "N/A", textFormat: "plain_text", limits: {} } },
  { id: "cv-writer", label: "CV Writer", name: "CV Writer", type: "proposal", icon: "🧾", color: "green", accentHex: "#14A800", path: "/app/cv-writer", phase: 2, active: false, styles: [], tones: [], inputFields: [], outputFormat: { structure: "N/A", textFormat: "plain_text", limits: {} } },
  { id: "cover-letter", label: "Cover Letter", name: "Cover Letter", type: "proposal", icon: "📝", color: "green", accentHex: "#14A800", path: "/app/cover-letter", phase: 2, active: false, styles: [], tones: [], inputFields: [], outputFormat: { structure: "N/A", textFormat: "plain_text", limits: {} } },
  { id: "twitter-dm", label: "Twitter DM", name: "Twitter DM", type: "linkedin", icon: "💬", color: "blue", accentHex: "#0A66C2", path: "/app/twitter-dm", phase: 3, active: false, styles: [], tones: [], inputFields: [], outputFormat: { structure: "N/A", textFormat: "plain_text", limits: {} } },
];

// Alias for requested naming while keeping existing `TOOLS` consumers intact.
export const TOOL_REGISTRY = TOOLS;

export function getToolById(toolId: string) {
  return TOOLS.find((tool) => tool.id === toolId) ?? null;
}

