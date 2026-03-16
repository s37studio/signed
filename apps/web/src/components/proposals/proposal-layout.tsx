"use client";

import {
  useEffect,
  useState,
  type ReactNode,
  Children,
  isValidElement,
} from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProposalNavbarS37 } from "./proposal-navbar-s37";

import { ProposalSidebarNav } from "./proposal-sidebar-nav";

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
      },
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

  const firstItemVariants = {
    hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-white font-sans relative">
      {/* Mobile Navigation (Floating Pill) */}
      <div className="lg:hidden">
        <ProposalNavbarS37
          brandName={brandName}
          acceptUrl={acceptUrl}
          showNavLinks={false}
        />
      </div>

      {/* Desktop Sidebar Navigation */}
      <div className="hidden lg:block">
        <ProposalSidebarNav
          sections={sections}
          activeSection={activeSection}
          onSectionClick={handleClick}
        />
      </div>

      {/* Main Content */}
      <main className="w-full min-h-screen relative">
        <div className="w-full max-w-[1200px] mx-auto pt-2 px-4 pb-36 md:pt-4 md:px-8 md:pb-36 lg:pt-6 lg:px-12 lg:pb-36 space-y-24 text-left">
          {Children.map(children, (child, index) => {
            if (isValidElement(child)) {
              // Only the first section (index 0) animates immediately on load
              // Subsequent sections animate when they come into view
              if (index === 0) {
                return (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={firstItemVariants}
                  >
                    {child}
                  </motion.div>
                );
              }
              return (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={itemVariants}
                >
                  {child}
                </motion.div>
              );
            }
            return child;
          })}
        </div>
      </main>
    </div>
  );
}
