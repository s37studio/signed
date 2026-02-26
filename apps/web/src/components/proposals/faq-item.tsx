"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

type FAQItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  isDimmed: boolean;
};

export function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
  isDimmed,
}: FAQItemProps) {
  return (
    <div
      className={`py-2 transition-all duration-300 ${
        isDimmed ? "opacity-50" : "opacity-100"
      } group-hover/faq-list:opacity-50 hover:!opacity-100`}
    >
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-4 px-4 text-left group focus:outline-none rounded-full cursor-pointer"
      >
        <span className="text-base font-display font-medium text-zinc-100">{question}</span>
        <div className="relative w-5 h-5 text-zinc-500">
          <motion.span
            animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <PlusIcon className="w-5 h-5" />
          </motion.span>
          <motion.span
            animate={{ rotate: isOpen ? 0 : -90, opacity: isOpen ? 1 : 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <MinusIcon className="w-5 h-5" />
          </motion.span>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-zinc-400 leading-relaxed text-sm md:text-base">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
