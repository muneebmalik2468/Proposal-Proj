import { Suspense } from "react";
import { ResetPasswordContent } from "./content";
import { Spinner } from "@/components/ui/spinner";

function LoadingSpinner() {
  return (
    <div className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-12">
      <Spinner />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
