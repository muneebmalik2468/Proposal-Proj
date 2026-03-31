export type ToolColor = "green" | "blue" | "red";

export type ToolConfig = {
  id: string;
  label: string;
  icon: string;
  color: ToolColor;
  accentHex: string;
  path: string;
  phase: number;
  active: boolean;
};

// Frontend-safe registry (no secrets). Adding a tool should be additive-only.
export const TOOLS: ToolConfig[] = [
  {
    id: "upwork-proposal",
    label: "Upwork Proposal",
    icon: "📋",
    color: "green",
    accentHex: "#14A800",
    path: "/app/upwork",
    phase: 1,
    active: true,
  },
  {
    id: "linkedin-inmail",
    label: "LinkedIn InMail",
    icon: "✉️",
    color: "blue",
    accentHex: "#0A66C2",
    path: "/app/linkedin-inmail",
    phase: 1,
    active: true,
  },
  {
    id: "linkedin-connection",
    label: "Connection Note",
    icon: "🤝",
    color: "blue",
    accentHex: "#0A66C2",
    path: "/app/linkedin-connection",
    phase: 1,
    active: true,
  },
  {
    id: "cold-email",
    label: "Cold Email",
    icon: "📨",
    color: "red",
    accentHex: "#DC2626",
    path: "/app/cold-email",
    phase: 1,
    active: true,
  },
  // Phase 2+ (listed for planning only; must remain inactive in MVP)
  { id: "email-sender", label: "Email Sender", icon: "📤", color: "red", accentHex: "#DC2626", path: "/app/email-sender", phase: 2, active: false },
  { id: "cv-writer", label: "CV Writer", icon: "🧾", color: "green", accentHex: "#14A800", path: "/app/cv-writer", phase: 2, active: false },
  { id: "cover-letter", label: "Cover Letter", icon: "📝", color: "green", accentHex: "#14A800", path: "/app/cover-letter", phase: 2, active: false },
  { id: "twitter-dm", label: "Twitter DM", icon: "💬", color: "blue", accentHex: "#0A66C2", path: "/app/twitter-dm", phase: 3, active: false },
];

