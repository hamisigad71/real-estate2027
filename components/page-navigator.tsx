"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import { useAuth } from "@/components/auth-provider";
import { FloatingPageNav } from "@/components/floating-page-nav";

export function PageNavigator() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  // Determine if we should show the nav
  const isAuthPage = pathname === "/" && !user;

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleForward = useCallback(() => {
    router.forward();
  }, [router]);

  return !isAuthPage ? (
    <FloatingPageNav
      onPrevious={handleBack}
      onNext={handleForward}
      canGoPrev={true}
      canGoNext={true}
    />
  ) : null;
}
