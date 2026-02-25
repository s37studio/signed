"use client";

import { motion } from "framer-motion";

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
  const colors = [
    "bg-orange-500/10 text-orange-400 border-orange-500/20",
    "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "bg-blue-500/10 text-blue-400 border-blue-500/20",
  ];

  return (
    <section id="goals" className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px flex-1 bg-zinc-800" />
        <h2 className="text-2xl font-display font-medium text-zinc-100">
          Project Goals
        </h2>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>

      <p className="text-zinc-400 text-center max-w-2xl mx-auto mb-12">
        The goal of this project is to build a clear, cohesive, and scalable
        brand foundation aligned with your business strategy.
      </p>

      <div className="grid grid-cols-1 gap-6">
        {goals.map((goal, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 hover:bg-zinc-900 transition-colors duration-300"
          >
            <div className="flex items-start gap-6">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-xl text-lg font-bold border ${
                  colors[index % colors.length]
                }`}
              >
                0{index + 1}
              </div>
              <div>
                <h3 className="text-lg font-medium text-zinc-100 mb-2">
                  {goal.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {goal.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
