"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function LogoutConfirmationModal({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-slate-900">Confirm Logout</h2>
        <p className="mt-2 text-sm text-slate-600">
          Are you sure you want to logout? You'll need to login again to access your account.
        </p>
        <div className="mt-5 flex gap-3">
          <Button className="flex-1" zone="navy" onClick={onConfirm}>
            Logout
          </Button>
          <Button className="flex-1" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
