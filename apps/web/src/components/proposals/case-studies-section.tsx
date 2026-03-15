"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BlurInHeading } from "../ui/blur-in-heading";

type CaseStudy = {
  title: string;
  description: string;
  testimonial: string;
  author: string;
  role: string;
  image: string;
};

const CASE_STUDIES: CaseStudy[] = [
  {
    title: "Brand Identity for a SaaS Product",
    description:
      "We helped define a clear positioning and created a brand identity aligned with product clarity and trust.",
    testimonial:
      "We moved from manual workflows to a clean internal system our whole team uses daily.",
    author: "Axel Vion",
    role: "CTO at Keystone Labs",
    image: "/case-studies/flex-ai.webp",
  },
  {
    title: "E-commerce Redesign for Fashion Brand",
    description:
      "A complete overhaul of the shopping experience, focusing on mobile conversion and brand storytelling.",
    testimonial:
      "Our conversion rate doubled within the first month of launch. The design is simply stunning.",
    author: "Sarah Chen",
    role: "Founder at Moda",
    image: "/case-studies/chataigne.webp",
  },
  {
    title: "Corporate Website for FinTech",
    description:
      "Modernizing a legacy financial institution with a fresh, approachable, and secure digital presence.",
    testimonial:
      "The new site perfectly balances our heritage with our future-forward vision.",
    author: "James Wilson",
    role: "VP Marketing at FinCorp",
    image: "/case-studies/ocom.webp",
  },
];

const RESULTS = [
  {
    value: "+70",
    label: "Brands Launched",
  },
  {
    value: "+120",
    label: "Rebrands",
  },
  {
    value: "100%",
    label: "Designed for clarity",
  },
];

export function CaseStudiesSection() {
  return (
    <section id="case-studies" className="scroll-mt-24">
      <BlurInHeading className="text-[24px] font-sans font-medium text-zinc-900 mb-2">
        Case Studies
      </BlurInHeading>

      <p className="text-sm text-zinc-600 text-left w-full mb-8">
        See how we've helped other companies achieve their goals through
        strategic design and development.
      </p>

      <div className="space-y-6 mb-6">
        {CASE_STUDIES.map((study, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
            className="group relative bg-white border border-zinc-100 rounded-2xl p-8 overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-xl font-sans font-medium text-zinc-900 mb-4">
                    {study.title}
                  </h3>
                  <p className="text-zinc-600 leading-relaxed mb-8">
                    {study.description}
                  </p>
                </div>

                <div className="bg-zinc-50 rounded-xl p-6">
                  <p className="text-zinc-800 font-medium italic mb-4">
                    "{study.testimonial}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-zinc-200 overflow-hidden relative">
                       {/* Placeholder avatar */}
                       <div className="absolute inset-0 bg-black" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-zinc-900">
                        {study.author}
                      </div>
                      <div className="text-xs text-zinc-500">{study.role}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-zinc-900">
                <Image
                  src={study.image}
                  alt={study.title}
                  fill
                  className="object-cover opacity-90"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {RESULTS.map((result, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
            className="bg-white border border-zinc-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center"
          >
            <div className="text-[34px] font-sans font-semibold text-zinc-900 mb-2">
              {result.value}
            </div>
            <div className="text-sm text-zinc-600 font-medium">
              {result.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
