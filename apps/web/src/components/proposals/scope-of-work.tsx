"use client";

import { motion } from "framer-motion";

type ScopeItem = {
  name: string;
  timeline: string;
};

const DEFAULT_SCOPE: ScopeItem[] = [
  { name: "Brand Strategy", timeline: "5-7 days" },
  { name: "Visual Identity", timeline: "7-10 days" },
  { name: "Brand Assets", timeline: "3-5 days" },
  { name: "Brand Guidelines", timeline: "2-3 days" },
];

type ScopeOfWorkProps = {
  items?: ScopeItem[];
};

export function ScopeOfWork({ items = DEFAULT_SCOPE }: ScopeOfWorkProps) {
  return (
    <section id="scope" className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px flex-1 bg-zinc-800" />
        <h2 className="text-2xl font-display font-medium text-zinc-100">
          Scope of Work
        </h2>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>

      <p className="text-zinc-400 text-center max-w-2xl mx-auto mb-12">
        This scope details the branding elements delivered as part of this
        project.
      </p>

      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_auto] gap-4 p-4 border-b border-zinc-800/50 bg-zinc-900/80 text-xs font-medium uppercase tracking-wider text-zinc-500">
          <div>Brand Identity</div>
          <div>Timeline</div>
        </div>
        <div className="divide-y divide-zinc-800/50">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="grid grid-cols-[1fr_auto] gap-4 p-4 hover:bg-zinc-800/30 transition-colors duration-200"
            >
              <div className="flex items-center gap-3 text-zinc-300">
                <span className="text-zinc-600">↳</span>
                {item.name}
              </div>
              <div className="text-zinc-400 font-mono text-sm">
                {item.timeline}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
