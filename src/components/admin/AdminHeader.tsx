"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AdminLogoutConfirmationModal } from "@/components/admin/AdminLogoutConfirmationModal";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AdminHeader() {
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex min-h-14 max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="flex items-center">
              <Image
                src="/desktophomelogo.png"
                alt="ClientPitcher Admin"
                width={180}
                height={140}
                priority
              />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setShowConfirmation(true)}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <AdminLogoutConfirmationModal
        open={showConfirmation}
        onConfirm={handleLogout}
        onCancel={() => setShowConfirmation(false)}
      />
    </>
  );
}
