"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { GlassLoader } from "./glass-loader";

export function PageTransitionLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Show loader for a brief moment on route change
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Show loader for 500ms

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isLoading) return null;

  return <GlassLoader message="Loading page..." fullScreen />;
}
