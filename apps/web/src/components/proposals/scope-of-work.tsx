"use client";

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
      <h2 className="text-2xl font-display font-medium text-zinc-100 mb-4">
        Scope of Work
      </h2>

      <p className="text-zinc-400 text-left max-w-2xl mb-12">
        This scope details the branding elements delivered as part of this
        project.
      </p>

      <div className="bg-zinc-900/50 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_auto] gap-4 p-4 bg-zinc-900/80 text-xs font-medium uppercase tracking-wider text-zinc-500">
          <div>Brand Identity</div>
          <div>Timeline</div>
        </div>
        <div>
          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_auto] gap-4 p-4"
            >
              <div className="flex items-center gap-3 text-zinc-300">
                <span className="text-zinc-600">↳</span>
                {item.name}
              </div>
              <div className="text-zinc-400 font-mono text-sm">
                {item.timeline}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
