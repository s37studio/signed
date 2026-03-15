"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type NavSection = {
  id: string;
  label: string;
};

type ProposalSidebarNavProps = {
  sections: NavSection[];
  activeSection: string;
  onSectionClick: (id: string) => void;
};

export function ProposalSidebarNav({
  sections,
  activeSection,
  onSectionClick,
}: ProposalSidebarNavProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="fixed left-4 top-1/2 -translate-y-1/2 z-50 flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discrete Indicators (Always visible) */}
      <div className="flex flex-col gap-1.5 p-2">
        {sections.map((section) => (
          <div
            key={section.id}
            className={cn(
              "h-[2px] rounded-full transition-all duration-300",
              activeSection === section.id
                ? "bg-zinc-900 w-6"
                : "bg-zinc-300 w-3 hover:bg-zinc-400 hover:w-4"
            )}
          />
        ))}
      </div>

      {/* Expanded Modal (Visible on hover) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-full ml-2 bg-white border border-zinc-200 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-2 min-w-[180px]"
          >
            <nav className="flex flex-col gap-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => onSectionClick(section.id)}
                  className={cn(
                    "text-left text-sm px-2 py-1.5 rounded-lg transition-colors",
                    activeSection === section.id
                      ? "text-zinc-900 font-medium"
                      : "text-zinc-500 hover:text-zinc-900"
                  )}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
