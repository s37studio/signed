"use client";

import { useEffect, useState, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProposalNavbarS37 } from "./proposal-navbar-s37";

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
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[280px] flex-col border-r border-zinc-800/50 bg-[#0E0E11] z-50">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-zinc-900"
              >
                <path
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-zinc-100 tracking-tight font-display">
              {brandName}
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4 px-2">
                Proposal Content
              </h3>
              <nav className="flex flex-col space-y-1">
                {sections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => handleClick(section.id)}
                      className={cn(
                        "relative w-full text-left px-3 py-2 text-sm transition-all duration-200 rounded-lg group flex items-center",
                        isActive
                          ? "text-zinc-100 bg-zinc-800/50 font-medium"
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 w-1 h-4 bg-zinc-100 rounded-r-full"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                      <span className={cn("ml-2", isActive && "ml-3")}>
                        {section.label}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
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
