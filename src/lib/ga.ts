"use client";

export function gaEvent(action: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gtag = (window as any).gtag as undefined | ((...args: any[]) => void);
  if (!gtag) return;
  gtag("event", action, params ?? {});
}

