"use client";

import { motion } from "framer-motion";
import { StarIcon } from "@heroicons/react/20/solid";
import { BlurInHeading } from "../ui/blur-in-heading";

type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "The process was structured, thoughtful, and incredibly clear. They truly understood our vision and elevated it beyond what we imagined.",
    author: "John Doe",
    role: "CEO at Company",
  },
  {
    quote:
      "We've worked with many agencies, but none have delivered this level of quality and strategic thinking. Highly recommended.",
    author: "Jane Smith",
    role: "Marketing Director at TechCorp",
  },
  {
    quote:
      "Their attention to detail and ability to translate complex requirements into simple, beautiful designs is unmatched.",
    author: "Michael Brown",
    role: "Product Manager at SoftSol",
  },
  {
    quote:
      "A game-changer for our brand. The team was responsive, creative, and delivered exactly what we needed on time.",
    author: "Sarah Wilson",
    role: "Head of Design at CreativeCo",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="scroll-mt-24">
      <BlurInHeading className="text-[24px] font-sans font-medium text-zinc-900 mb-2">
        Testimonials
      </BlurInHeading>

      <p className="text-sm text-zinc-600 text-left w-full mb-8">
        Don't just take our word for it. Here's what our clients have to say.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEFAULT_TESTIMONIALS.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
            className="bg-white border border-zinc-100 rounded-2xl p-6 flex flex-col justify-between"
          >
            <p className="text-sm text-zinc-600 leading-relaxed mb-6">
              “{testimonial.quote}”
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-zinc-200">
                  <div className="absolute inset-0 bg-black" />
                </div>
                <div>
                  <div className="text-sm font-sans font-medium text-zinc-900">
                    {testimonial.author}
                  </div>
                  <div className="text-xs text-zinc-500">{testimonial.role}</div>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
