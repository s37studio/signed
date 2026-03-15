"use client";

import { motion } from "framer-motion";
import { CheckIcon } from "@heroicons/react/24/outline";
import { BlurInHeading } from "../ui/blur-in-heading";

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
      <BlurInHeading className="text-[24px] font-sans font-medium text-zinc-900 mb-2">
        Pricing
      </BlurInHeading>

      <p className="text-sm text-zinc-600 text-left w-full mb-8">
        Transparent pricing based on scope and complexity.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        className="w-full bg-white border border-zinc-100 rounded-2xl p-8 relative overflow-hidden group"
      >
        <div className="mb-4">
          <h3 className="text-lg font-sans font-medium text-zinc-900 mb-2">
            {item.title}
          </h3>
          <p className="text-zinc-600 text-sm">{item.description}</p>
        </div>

        <div className="mb-4 pb-4">
          <span className="text-[34px] font-sans font-semibold text-zinc-900">
            {item.price}
          </span>
        </div>

        <div className="bg-zinc-50 rounded-xl p-6">
          <ul className="space-y-4">
            {item.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-zinc-900 shrink-0 mt-0.5" />
                <span className="text-zinc-700 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

      </motion.div>
    </section>
  );
}
