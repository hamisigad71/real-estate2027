"use client"

import { ChevronLeft, ChevronRight, Home, Zap } from "lucide-react"
import { useState, useEffect } from "react"

interface FloatingPageNavProps {
  onPrevious?: () => void
  onNext?: () => void
  canGoPrev?: boolean
  canGoNext?: boolean
  currentPage?: number
  totalPages?: number
}

export function FloatingPageNav({
  onPrevious,
  onNext,
  canGoPrev = true,
  canGoNext = true,
  currentPage,
  totalPages,
}: FloatingPageNavProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [hoveredButton, setHoveredButton] = useState<"prev" | "next" | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show nav when scrolling UP (negative delta) from a position
      if (currentScrollY < lastScrollY && currentScrollY > 100) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY + 50 || currentScrollY < 50) {
        // Hide when scrolling DOWN significantly or at top
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && canGoPrev) {
        onPrevious?.()
      } else if (e.key === "ArrowRight" && canGoNext) {
        onNext?.()
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("keydown", handleKeyDown)
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [lastScrollY, canGoPrev, canGoNext, onPrevious, onNext])

  return (
    <div
      className={`fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 transition-all duration-500 ease-out z-50 w-full sm:w-auto px-4 sm:px-0 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20 pointer-events-none"
      }`}
    >
      <div className="relative">
        {/* Main container */}
        <div className="relative flex items-center gap-0.5 sm:gap-1 bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-xl rounded-full shadow-2xl border border-white/50 px-1.5 sm:px-2 py-1.5 sm:py-2 ring-1 ring-white/20">
          {/* Previous Button */}
          <button
            onClick={onPrevious}
            disabled={!canGoPrev}
            suppressHydrationWarning={true}
            onMouseEnter={() => setHoveredButton("prev")}
            onMouseLeave={() => setHoveredButton(null)}
            className={`relative p-2 sm:p-3 rounded-full transition-all duration-200 flex items-center justify-center group overflow-hidden ${
              canGoPrev
                ? "cursor-pointer hover:bg-gradient-to-br hover:from-[#C59DD9]/20 hover:to-[#7A3F91]/20"
                : "opacity-30 cursor-not-allowed"
            }`}
            aria-label="Previous project"
          >
            {/* Ripple effect */}
            {hoveredButton === "prev" && canGoPrev && (
              <div className="absolute inset-0 bg-[#C59DD9]/10 rounded-full animate-pulse"></div>
            )}
            <div className="relative">
              <ChevronLeft
                size={20}
                className={`sm:h-6 sm:w-6 transition-all duration-200 ${
                  hoveredButton === "prev" && canGoPrev
                    ? "text-[#7A3F91] scale-110"
                    : "text-slate-600"
                }`}
                strokeWidth={2.5}
              />
            </div>
          </button>

          {/* Divider */}
          <div className="w-px h-5 sm:h-6 bg-gradient-to-b from-transparent via-slate-300 to-transparent opacity-40 mx-0.5 sm:mx-1"></div>

          {/* Home Button */}
          <a
            href="/"
            className="relative p-2 sm:p-3 rounded-full transition-all duration-200 flex items-center justify-center group overflow-hidden cursor-pointer hover:bg-gradient-to-br hover:from-[#C59DD9]/20 hover:to-[#7A3F91]/20"
            aria-label="Go to home"
          >
            {/* Ripple effect */}
            <div className="absolute inset-0 bg-[#C59DD9]/10 rounded-full animate-pulse opacity-0 group-hover:opacity-100"></div>
            <div className="relative">
              <Home
                size={20}
                className="sm:h-6 sm:w-6 transition-all duration-200 text-slate-600 group-hover:text-[#7A3F91] group-hover:scale-110"
                strokeWidth={2.5}
              />
            </div>
          </a>

          {/* Divider */}
          <div className="w-px h-5 sm:h-6 bg-gradient-to-b from-transparent via-slate-300 to-transparent opacity-40 mx-0.5 sm:mx-1"></div>

          {/* Page Indicator - Enhanced */}
          {currentPage !== undefined && totalPages !== undefined && (
            <div className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold tracking-wider">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#7A3F91] to-[#2B0D3E]">
                  {currentPage}
                </div>
                <span className="text-slate-400 text-[10px] sm:text-xs font-normal">/</span>
                <div className="text-slate-500 text-xs sm:text-sm">{totalPages}</div>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="w-px h-5 sm:h-6 bg-gradient-to-b from-transparent via-slate-300 to-transparent opacity-40 mx-0.5 sm:mx-1"></div>

          {/* Next Button */}
          <button
            onClick={onNext}
            disabled={!canGoNext}
            suppressHydrationWarning={true}
            onMouseEnter={() => setHoveredButton("next")}
            onMouseLeave={() => setHoveredButton(null)}
            className={`relative p-2 sm:p-3 rounded-full transition-all duration-200 flex items-center justify-center group overflow-hidden ${
              canGoNext
                ? "cursor-pointer hover:bg-gradient-to-br hover:from-[#C59DD9]/20 hover:to-[#2B0D3E]/20"
                : "opacity-30 cursor-not-allowed"
            }`}
            aria-label="Next project"
          >
            {/* Ripple effect */}
            {hoveredButton === "next" && canGoNext && (
              <div className="absolute inset-0 bg-[#C59DD9]/10 rounded-full animate-pulse"></div>
            )}
            <div className="relative">
              <ChevronRight
                size={20}
                className={`sm:h-6 sm:w-6 transition-all duration-200 ${
                  hoveredButton === "next" && canGoNext
                    ? "text-[#2B0D3E] scale-110"
                    : "text-slate-600"
                }`}
                strokeWidth={2.5}
              />
            </div>
          </button>

          {/* Status indicator dots */}
          {currentPage !== undefined && totalPages !== undefined && (
            <div className="hidden sm:flex ml-1 sm:ml-2 pl-1 sm:pl-2 border-l border-slate-200 gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                    i < currentPage
                      ? "bg-gradient-to-r from-[#7A3F91] to-[#2B0D3E] w-1.5 sm:w-2"
                      : "bg-slate-300 w-1 sm:w-1.5"
                  }`}
                ></div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Keyboard shortcut hint */}
      <div className="hidden sm:block mt-3 text-center text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Use ← → to navigate
      </div>
    </div>
  )
}
