"use client";

import * as React from "react";

export function useGenerate() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const generate = React.useCallback(
    async (body: unknown) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = (await res.json().catch(() => ({}))) as {
          output?: string;
          error?: string;
        };

        if (!res.ok) {
          const err = json?.error ?? "request_failed";
          setError(err);
          return { ok: false as const, error: err };
        }

        return { ok: true as const, output: json.output ?? "" };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { generate, loading, error };
}

