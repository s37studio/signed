"use client";

import { CheckIcon } from "@heroicons/react/24/outline";

type ProposalNavbarS37Props = {
  brandName?: string;
  acceptUrl?: string;
  showNavLinks?: boolean;
};

export function ProposalNavbarS37({
  brandName = "S37™",
  acceptUrl = "#contact",
  showNavLinks = true,
}: ProposalNavbarS37Props) {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] w-fit">
      <div className="w-full flex justify-center">
        <div className="flex items-center flex-nowrap gap-1 px-2 py-1.5 bg-zinc-800/30 backdrop-blur-xl rounded-full w-auto whitespace-nowrap group transition-all duration-300 group-hover:bg-zinc-800/10 group-hover:backdrop-blur-sm">
          <div className="flex items-center px-3.5 py-1.5 bg-white/[0.02] backdrop-blur-md rounded-full mr-1 flex-shrink-0 transition-all duration-300 group-hover:opacity-50 hover:!opacity-100">
            <span className="text-[15px] font-medium text-zinc-300 tracking-tight font-display">
              {brandName}
            </span>
          </div>
          {showNavLinks && (
            <div className="hidden md:flex items-center gap-0.5 pr-1 flex-shrink-0">
              {[
                { label: "Process", href: "#process" },
                { label: "Work", href: "#work" },
                { label: "Case Studies", href: "#case-studies" },
                { label: "FAQ", href: "#faq" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-3.5 py-1.5 text-[13px] font-medium text-white/50 transition-all duration-300 rounded-full hover:bg-white/5 group-hover:opacity-50 hover:!opacity-100 focus:outline-none"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
          <a
            href={acceptUrl}
            className="px-3.5 py-2 text-[13px] font-medium bg-white text-zinc-900 rounded-full transition-all duration-300 active:scale-95 w-auto flex items-center justify-center gap-1.5 flex-shrink-0 group-hover:opacity-50 hover:!opacity-100 focus:outline-none"
          >
            Accept proposal
            <CheckIcon className="w-3.5 h-3.5" strokeWidth={2} />
          </a>
        </div>
      </div>
    </nav>
  );
}
