"use client";

import { motion } from "framer-motion";

type ProcessStep = {
  step: string;
  title: string;
  description: string;
};

const DEFAULT_PROCESS: ProcessStep[] = [
  {
    step: "01",
    title: "Discovery & Alignment",
    description: "We explore your vision, audience, and competition.",
  },
  {
    step: "02",
    title: "Strategy & Direction",
    description: "We define positioning and creative direction.",
  },
  {
    step: "03",
    title: "Design & Refinement",
    description: "We create, test, and refine the brand system.",
  },
];

type ProcessSectionProps = {
  steps?: ProcessStep[];
};

export function ProcessSection({ steps = DEFAULT_PROCESS }: ProcessSectionProps) {
  const colors = [
    "bg-orange-500/10 text-orange-400",
    "bg-purple-500/10 text-purple-400",
    "bg-blue-500/10 text-blue-400",
  ];

  return (
    <section id="process" className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px flex-1 bg-zinc-800" />
        <h2 className="text-2xl font-display font-medium text-zinc-100">
          Process
        </h2>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>

      <p className="text-zinc-400 text-center max-w-2xl mx-auto mb-12">
        A structured process focused on clarity, collaboration, and execution.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 hover:bg-zinc-900 transition-colors duration-300 flex flex-col items-start"
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold mb-4 ${
                colors[index % colors.length]
              }`}
            >
              {step.step}
            </div>
            <h3 className="text-lg font-medium text-zinc-100 mb-2">
              {step.title}
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
