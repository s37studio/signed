"use client";

type Goal = {
  title: string;
  description: string;
};

const DEFAULT_GOALS: Goal[] = [
  {
    title: "Clarify positioning",
    description:
      "Define who you are, what you stand for, and why your brand matters in your market.",
  },
  {
    title: "Create a strong visual identity",
    description:
      "Design a brand system that is recognizable, consistent, and flexible.",
  },
  {
    title: "Enable long-term consistency",
    description:
      "Provide assets and guidelines that your team can confidently use and scale.",
  },
];

type ProjectGoalsProps = {
  goals?: Goal[];
};

export function ProjectGoals({ goals = DEFAULT_GOALS }: ProjectGoalsProps) {
  return (
    <section id="goals" className="scroll-mt-24">
      <h2 className="text-2xl font-display font-medium text-zinc-100 mb-4">
        Project Goals
      </h2>

      <p className="text-zinc-400 text-left max-w-2xl mb-12">
        The goal of this project is to build a clear, cohesive, and scalable
        brand foundation aligned with your business strategy.
      </p>

      <div className="grid grid-cols-1 gap-6">
        {goals.map((goal, index) => (
          <div
            key={index}
            className="group relative bg-zinc-900/50 rounded-2xl p-6"
          >
            <div className="flex items-start gap-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl text-lg font-display font-bold bg-zinc-800/50 text-zinc-300">
                0{index + 1}
              </div>
              <div>
                <h3 className="text-lg font-display font-medium text-zinc-100 mb-2">
                  {goal.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {goal.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
