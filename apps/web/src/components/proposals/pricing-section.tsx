"use client";

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
      <h2 className="text-[26px] font-sans font-medium text-zinc-900 mb-2">
        Pricing
      </h2>

      <p className="text-sm text-zinc-600 text-left w-full mb-8">
        Transparent pricing based on scope and complexity.
      </p>

      <div className="w-full bg-zinc-50 rounded-2xl p-8 relative overflow-hidden group">
        <div className="mb-8">
          <h3 className="text-lg font-sans font-medium text-zinc-900 uppercase tracking-wide mb-2">
            {item.title}
          </h3>
          <p className="text-zinc-600 text-sm">{item.description}</p>
        </div>

        <div className="mb-4 pb-4">
          <span className="text-4xl font-sans font-bold text-zinc-900">
            {item.price}
          </span>
        </div>

        <ul className="space-y-4 mb-10">
          {item.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-zinc-900 shrink-0 mt-0.5" />
              <span className="text-zinc-700 text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={onAccept}
          className="w-full py-3 bg-zinc-900 text-white font-medium rounded-full hover:bg-zinc-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:ring-offset-white"
        >
          Get Started
        </button>
      </div>
    </section>
  );
}
