"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Scroll to top immediately and with a small delay to ensure DOM is ready
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Instant scroll
    scrollToTop();
    
    // Also try with a small delay in case DOM needs to render
    const timeoutId = setTimeout(scrollToTop, 0);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  // Also run on initial mount to catch page reloads
  useEffect(() => {
    if (isFirstRender.current) {
      const scrollToTop = () => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      };

      scrollToTop();
      const timeoutId = setTimeout(scrollToTop, 100);
      
      isFirstRender.current = false;
      return () => clearTimeout(timeoutId);
    }
  }, []);

  return null;
}
