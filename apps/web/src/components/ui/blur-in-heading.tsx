"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type BlurInHeadingProps = {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

export function BlurInHeading({
  children,
  className,
  as: Component = "h2",
}: BlurInHeadingProps) {
  const words = children.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 90,
      },
    },
    hidden: {
      opacity: 0,
      y: 10,
      filter: "blur(8px)",
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 90,
      },
    },
  };

  return (
    <motion.div
      style={{ display: "inline-block", overflow: "hidden" }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={cn("flex flex-wrap gap-x-[0.3em]", className)}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block mr-[0.25em] last:mr-0"
          // Render Component as a span visually but maintain semantic structure if needed
          // For simplicity in framer motion context, we just use span for words
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
