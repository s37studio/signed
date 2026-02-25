"use client";

import { motion } from "framer-motion";
import { CheckIcon } from "@heroicons/react/24/outline";

type PricingItem = {
  title: string;
  description: string;
  price: string;
  features: string[];
};

const DEFAULT_PRICING: PricingItem = {
  title: "FULL BRAND SYSTEM",
  description: "For teams building a long-term brand.",
  price: "$8,000",
  features: [
    "Everything in Brand Foundation",
    "Extended visual system",
    "Brand assets (social, pitch, website)",
    "Complete brand guidelines",
  ],
};

type PricingSectionProps = {
  item?: PricingItem;
  onAccept?: () => void;
};

export function PricingSection({
  item = DEFAULT_PRICING,
  onAccept,
}: PricingSectionProps) {
  return (
    <section id="pricing" className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px flex-1 bg-zinc-800" />
        <h2 className="text-2xl font-display font-medium text-zinc-100">
          Pricing
        </h2>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>

      <p className="text-zinc-400 text-center max-w-2xl mx-auto mb-12">
        Transparent pricing based on scope and complexity.
      </p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-800 via-zinc-500 to-zinc-800 opacity-50" />

        <div className="mb-8">
          <h3 className="text-lg font-medium text-zinc-100 uppercase tracking-wide mb-2">
            {item.title}
          </h3>
          <p className="text-zinc-400 text-sm">{item.description}</p>
        </div>

        <div className="mb-8 pb-8 border-b border-zinc-800">
          <span className="text-4xl font-display font-bold text-zinc-100">
            {item.price}
          </span>
        </div>

        <ul className="space-y-4 mb-10">
          {item.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-zinc-100 shrink-0 mt-0.5" />
              <span className="text-zinc-300 text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={onAccept}
          className="w-full py-3 bg-zinc-100 text-zinc-900 font-medium rounded-lg hover:bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-100 focus:ring-offset-2 focus:ring-offset-zinc-950"
        >
          Get Started
        </button>
      </motion.div>
    </section>
  );
}
