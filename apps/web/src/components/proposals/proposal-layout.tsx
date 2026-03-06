"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProposalNavbarS37 } from "./proposal-navbar-s37";

function S37Logo({
  className,
  "aria-label": ariaLabel,
}: {
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <div
      role="img"
      className={cn("shrink-0 bg-zinc-100", className)}
      style={{
        maskImage: "url('/s37_new_logo.svg')",
        WebkitMaskImage: "url('/s37_new_logo.svg')",
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
      }}
      aria-hidden={!ariaLabel}
      {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
    />
  );
}

type NavSection = {
  id: string;
  label: string;
};

type ProposalLayoutProps = {
  children: ReactNode;
  sections: NavSection[];
  brandName?: string;
  acceptUrl?: string;
};

export function ProposalLayout({
  children,
  sections,
  brandName = "Propal",
  acceptUrl = "#contact",
}: ProposalLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -50% 0px",
        threshold: 0.1,
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E11] flex flex-col lg:flex-row">
      {/* Mobile Navigation (Floating Pill) */}
      <div className="lg:hidden">
        <ProposalNavbarS37
          brandName={brandName}
          acceptUrl={acceptUrl}
          showNavLinks={false}
        />
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[280px] flex-col bg-[#0E0E11] z-50">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-12">
            <S37Logo className="h-16 w-16 bg-zinc-600/50" aria-label={brandName} />
          </div>

          <div className="space-y-6">
            <nav className="flex flex-col space-y-1">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => handleClick(section.id)}
                    className={cn(
                      "w-full text-left text-[13px] rounded-full px-3 py-2 transition-colors duration-200",
                      isActive
                        ? "text-zinc-100 font-medium"
                        : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[280px] w-full min-h-screen relative">
        <div className="w-full max-w-[1200px] mx-auto p-4 md:p-8 lg:p-12 space-y-24 pb-32">
          {children}
        </div>
      </main>
    </div>
  );
}
