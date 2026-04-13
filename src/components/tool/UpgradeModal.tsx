"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function UpgradeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-slate-900">Upgrade to Pro</h2>
        <p className="mt-2 text-sm text-slate-600">
          "You’ve reached your monthly generation limit. Please upgrade your plan or wait for your credits to reset."
        </p>
        <div className="mt-5 flex gap-3">
          <Link href="/upgrade" className="flex-1">
            <Button className="w-full" zone="navy">
              Upgrade
            </Button>
          </Link>
          <Button className="flex-1" variant="secondary" onClick={onClose}>
            Not now
          </Button>
        </div>
      </Card>
    </div>
  );
}

