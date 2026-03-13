"use client";

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
      <h2 className="text-2xl font-sans font-medium text-zinc-900 mb-4">
        Process
      </h2>

      <p className="text-zinc-600 text-left max-w-2xl mb-12">
        A structured process focused on clarity, collaboration, and execution.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 flex flex-col items-start"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg text-sm font-sans font-bold mb-4 bg-zinc-100 text-zinc-700">
              {step.step}
            </div>
            <h3 className="text-lg font-sans font-medium text-zinc-900 mb-2">
              {step.title}
            </h3>
            <p className="text-zinc-600 text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
