"use client";

import { motion } from "framer-motion";
import { BlurInHeading } from "../ui/blur-in-heading";

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
  return (
    <section id="process" className="scroll-mt-24">
      <BlurInHeading className="text-[24px] font-sans font-medium text-zinc-900 mb-2">
        Process
      </BlurInHeading>

      <p className="text-sm text-zinc-600 text-left w-full mb-8">
        A structured process focused on clarity, collaboration, and execution.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
            className="bg-white border border-zinc-100 rounded-2xl p-6 flex flex-col items-start"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg text-sm font-sans font-bold mb-4 bg-zinc-50 text-zinc-700">
              {step.step}
            </div>
            <h3 className="text-lg font-sans font-medium text-zinc-900 mb-2">
              {step.title}
            </h3>
            <p className="text-zinc-600 text-sm leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
