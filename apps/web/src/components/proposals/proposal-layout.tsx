"use client";

import { useEffect, useState, type ReactNode } from "react";
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
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      {/* Mobile Navigation (Floating Pill) */}
      <div className="lg:hidden">
        <ProposalNavbarS37
          brandName={brandName}
          acceptUrl={acceptUrl}
          showNavLinks={false}
        />
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[280px] flex-col bg-zinc-50 border-r border-zinc-200 z-50">
        <div className="p-8">
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
                        ? "text-zinc-900 font-medium bg-zinc-200"
                        : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
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
