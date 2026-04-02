"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogoutConfirmationModal } from "@/components/auth/LogoutConfirmationModal";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setShowConfirmation(true)}
      >
        Logout
      </Button>
      <LogoutConfirmationModal
        open={showConfirmation}
        onConfirm={handleLogout}
        onCancel={() => setShowConfirmation(false)}
      />
    </>
  );
}

