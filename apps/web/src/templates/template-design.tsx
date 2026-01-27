"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon } from "@heroicons/react/24/outline";
import { ProposalNavbarS37 } from "@/components/proposals/proposal-navbar-s37";
import { FAQItem } from "@/components/proposals/faq-item";
import { highlightKeywords } from "@/lib/highlight-keywords";

const LOGOS = [
  { src: "/logos/67c82bc2a862e940b17cb6a7_flex-ai 1.svg", alt: "Flex AI" },
  { src: "/logos/Group 641.svg", alt: "Client Logo" },
  { src: "/logos/Group 642.svg", alt: "Client Logo" },
  { src: "/logos/new_logo_white_chataigne.svg", alt: "Chataigne" },
  { src: "/logos/o-communication-logo 1.svg", alt: "O Communication" },
  { src: "/logos/ost logo.svg", alt: "OST" },
];

const DEFAULT_DESIGN_SHOTS = [
  "/design-shots/shot-4.webp",
  "/design-shots/shot-5.webp",
  "/design-shots/shot-6.webp",
  "/design-shots/after-screen.webp",
  "/design-shots/daniel-dalen.webp",
  "/design-shots/frame-1.webp",
  "/design-shots/featuresvote-after.webp",
  "/design-shots/jenni-after.webp",
  "/design-shots/shot-2.webp",
  "/design-shots/shot-1.webp",
  "/design-shots/shot-3.webp",
  "/design-shots/whop-redesign.webp",
];

const DEFAULT_PROCESS_STEPS = [
  {
    step: "01",
    title: "Discovery & Strategy",
    description:
      "We start by understanding your business goals, target audience, and project requirements to create a solid foundation.",
  },
  {
    step: "02",
    title: "Design & Prototyping",
    description:
      "Our design team creates stunning visual concepts and interactive prototypes that bring your brand to life.",
  },
  {
    step: "03",
    title: "Development & Testing",
    description:
      "We build your website with clean code, ensuring it's fast, responsive, and works flawlessly across all devices.",
  },
  {
    step: "04",
    title: "Launch & Support",
    description:
      "After thorough testing, we launch your site and provide ongoing support to ensure continued success.",
  },
];

const DEFAULT_CASE_STUDIES = [
  {
    slug: "flex-ai",
    title: "Flex AI",
    description:
      "We helped Flex AI redefine their brand identity from the ground up, creating a visual language that resonates with modern tech audiences. The project culminated in the launch of a high-converting landing page that increased sign-ups by 65% within the first 4 weeks.",
    keywords: [
      "brand identity",
      "visual language",
      "modern tech audiences",
      "high-converting",
      "landing page",
      "increased sign-ups",
      "65%",
      "4 weeks",
    ],
    tags: ["Startup", "GTM"],
    image: "/case-studies/flex-logo.webp",
  },
  {
    slug: "chataigne",
    title: "Chataigne",
    description:
      "Chataigne required a custom internal management tool to streamline their complex logistics operations. We developed a full-stack application that centralizes their data, automates repetitive tasks, and has resulted in a 40% measurable increase in overall team productivity.",
    keywords: [
      "custom",
      "internal management tool",
      "streamline",
      "complex logistics",
      "full-stack application",
      "centralizes",
      "automates repetitive tasks",
      "40%",
      "team productivity",
    ],
    tags: ["Startup", "Design"],
    image: "/case-studies/chataigne.webp",
  },
  {
    slug: "o-communication",
    title: "O Communication",
    description:
      "For O Communication, we built a robust, scalable communication platform designed for global teams. The solution features real-time collaboration tools, end-to-end encryption, and an intuitive dashboard that has significantly reduced operational overhead for their 10,000+ users.",
    keywords: [
      "robust",
      "scalable",
      "communication platform",
      "global teams",
      "real-time collaboration",
      "end-to-end encryption",
      "intuitive dashboard",
      "reduced operational overhead",
      "10,000+ users",
    ],
    tags: ["Agency", "GTM"],
    image: "/case-studies/ocom.webp",
  },
];

const DEFAULT_FAQS = [
  {
    question: "What's your typical project timeline?",
    answer:
      "Most projects take 4-8 weeks depending on scope. We'll provide a detailed timeline during our discovery call and keep you updated throughout the process.",
  },
  {
    question: "How does the retainer model work?",
    answer:
      "Our retainer gives you ongoing access to our team for a fixed monthly fee. Submit requests anytime, and we'll prioritize and deliver them with a 48-hour average turnaround. You can pause or cancel anytime.",
  },
  {
    question: "Do you work with early-stage startups?",
    answer:
      "Absolutely! We love working with founders at all stages. Our project-based pricing makes it accessible for early-stage companies, and we can scale our engagement as you grow.",
  },
  {
    question: "What technologies do you specialize in?",
    answer:
      "We're experts in React, Next.js, React Native, Node.js, and modern cloud infrastructure. For design, we use Figma and work closely with your brand guidelines.",
  },
  {
    question: "How do we communicate during a project?",
    answer:
      "We use Slack for day-to-day communication and Notion for project documentation. You'll have direct access to your project team and weekly check-ins to review progress.",
  },
];

type TemplateDesignProps = {
  data: {
    projectTitle?: string;
    projectDescription?: string;
    brandName?: string;
    processSteps?: Array<{
      step: string;
      title: string;
      description: string;
    }>;
    designShots?: string[];
    caseStudies?: Array<{
      slug: string;
      title: string;
      description: string;
      keywords?: string[];
      tags: string[];
      image: string;
    }>;
    faqs?: Array<{
      question: string;
      answer: string;
    }>;
    ctaText?: string;
    acceptUrl?: string;
  };
};

export function TemplateDesign({ data }: TemplateDesignProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const projectTitle = data.projectTitle || "Website Proposal";
  const projectDescription =
    data.projectDescription ||
    "A custom proposal crafted specifically for your project needs.";
  const brandName = data.brandName || "S37™";
  const processSteps = data.processSteps || DEFAULT_PROCESS_STEPS;
  const designShots = data.designShots || DEFAULT_DESIGN_SHOTS;
  const caseStudies = data.caseStudies || DEFAULT_CASE_STUDIES;
  const faqs = data.faqs || DEFAULT_FAQS;
  const ctaText = data.ctaText || "Ready to get started?";
  const acceptUrl = data.acceptUrl || "#contact";

  return (
    <div className="min-h-screen bg-[#0E0E11] flex flex-col items-center pt-4 gap-4 pb-0">
      <ProposalNavbarS37 brandName={brandName} acceptUrl={acceptUrl} />

      {/* Hero Section */}
      <section className="relative w-[98%] flex justify-center sticky top-4 z-0 h-[90vh] md:h-[85vh]">
        <div className="w-full max-w-[800px] px-6 h-full flex items-center justify-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={{
              initial: { opacity: 0 },
              animate: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="flex flex-col items-center justify-center text-center"
          >
            <motion.div
              variants={{
                initial: { opacity: 0, filter: "blur(10px)", y: 20 },
                animate: { opacity: 1, filter: "blur(0px)", y: 0 },
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="zinc-svg w-[140px] h-[140px] md:w-[144px] md:h-[144px] mb-8"
              style={{
                maskImage: "url('/s37_new_logo.svg')",
                WebkitMaskImage: "url('/s37_new_logo.svg')",
                backgroundColor: "#3F3F46",
              }}
            />
            <motion.h1
              initial="initial"
              animate="animate"
              variants={{
                initial: {},
                animate: {
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
              className="text-3xl md:text-[36px] font-medium leading-tight tracking-tight text-zinc-100 max-w-[800px] text-center mb-2"
            >
              <motion.span
                variants={{
                  initial: { opacity: 0, filter: "blur(10px)", y: 10 },
                  animate: { opacity: 1, filter: "blur(0px)", y: 0 },
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                {projectTitle}
              </motion.span>
            </motion.h1>
            <motion.div
              variants={{
                initial: { opacity: 0, filter: "blur(10px)", y: 20 },
                animate: { opacity: 1, filter: "blur(0px)", y: 0 },
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-fit flex flex-col items-center"
            >
              <p className="mt-5 text-sm text-zinc-400 leading-[1.7] max-w-[340px] md:max-w-[380px]">
                {projectDescription}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 mt-8 group">
                <a
                  href={acceptUrl}
                  className="px-3.5 py-1.5 text-[13px] font-medium bg-zinc-100 text-zinc-900 rounded-full transition-all duration-300 group-hover:opacity-50 hover:!opacity-100 flex items-center gap-1.5 focus:outline-none"
                >
                  Accept proposal
                  <CheckIcon className="w-3.5 h-3.5" strokeWidth={2} />
                </a>
              </div>

              {/* Logo Carousel */}
              <div className="mt-16 w-full max-w-[550px] mx-auto overflow-hidden relative">
                {/* Gradient Overlays */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0E0E11] via-[#0E0E11]/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0E0E11] via-[#0E0E11]/80 to-transparent z-10 pointer-events-none" />

                <div className="flex items-center w-full">
                  <motion.div
                    className="flex items-center gap-8 md:gap-16 pr-8 md:pr-16"
                    animate={{
                      x: [0, "-50%"],
                    }}
                    transition={{
                      duration: 60,
                      ease: "linear",
                      repeat: Infinity,
                    }}
                  >
                    {[...LOGOS, ...LOGOS].map((logo, i) => {
                      let heightValue = "16px";
                      if (logo.alt === "O Communication") heightValue = "20px";
                      if (logo.src === "/logos/Group 642.svg")
                        heightValue = "14px";

                      return (
                        <div
                          key={i}
                          className="relative flex-none"
                          style={{ height: heightValue }}
                        >
                          <img
                            src={logo.src}
                            alt={logo.alt}
                            className="h-full w-auto opacity-0"
                          />
                          <div
                            className="absolute inset-0 zinc-svg"
                            style={{
                              maskImage: `url('${logo.src}')`,
                              WebkitMaskImage: `url('${logo.src}')`,
                            }}
                          />
                        </div>
                      );
                    })}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Sections Group */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full bg-[#0E0E11] flex flex-col items-center gap-4 relative z-10"
      >
        {/* Process Section */}
        <section
          id="process"
          className="w-[98%] bg-[#0C0C0E] rounded-2xl flex flex-col items-center"
        >
          <div className="w-full max-w-[1000px] px-6 py-24">
            <h2 className="text-xl md:text-2xl font-medium leading-tight tracking-tight text-zinc-100 mb-3 text-center">
              Our Process
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-12 max-w-[650px] mx-auto text-center">
              A structured approach to bring your vision to life.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {processSteps.map((process, index) => (
                <div key={index} className="bg-[#0E0E10] p-6 rounded-xl">
                  <span className="text-zinc-600 text-sm font-medium font-display">
                    {process.step}
                  </span>
                  <h3 className="text-lg font-medium text-zinc-100 mt-2 mb-3">
                    {process.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {process.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Design Shots Section */}
        <section
          id="work"
          className="w-[98%] bg-[#0C0C0E] rounded-2xl flex flex-col items-center py-8 md:py-12"
        >
          <div className="w-[88%] space-y-6 md:space-y-8">
            {designShots.map((src, i) => (
              <div
                key={i}
                className="relative w-full overflow-hidden rounded-lg bg-[#0E0E11] shadow-2xl"
              >
                <Image
                  src={src}
                  alt={`Design project ${i + 1}`}
                  width={1400}
                  height={933}
                  className="w-full h-auto"
                  loading={i < 2 ? "eager" : "lazy"}
                  quality={85}
                  sizes="(max-width: 768px) 100vw, (max-width: 1400px) 88vw, 1400px"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Case Studies Section */}
        <section
          id="case-studies"
          className="w-[98%] bg-[#0C0C0E] rounded-2xl flex flex-col items-center pt-14 md:pt-12 pb-8 md:pb-12"
        >
          <div className="w-full max-w-[750px] px-6 py-6">
            <p className="text-[10px] font-display text-zinc-400 uppercase text-center pt-4 md:pt-8 mb-3 pb-1">
              Case Studies
            </p>
            <motion.h2
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                initial: {},
                animate: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="text-[26px] md:text-[26px] font-medium leading-tight tracking-tight text-zinc-100 mb-3 text-center"
            >
              {["Recent", "case", "studies", "and", "projects"].map(
                (word, index) => {
                  const isLastWordOfTitle = index === 2;
                  return (
                    <motion.span
                      key={index}
                      variants={{
                        initial: { opacity: 0, filter: "blur(10px)", y: 10 },
                        animate: { opacity: 1, filter: "blur(0px)", y: 0 },
                      }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className={index >= 3 ? "text-zinc-100" : ""}
                    >
                      {word}
                      {isLastWordOfTitle ? (
                        <>
                          <br className="md:hidden" />
                          <span className="hidden md:inline"> </span>
                        </>
                      ) : index < 4 ? (
                        " "
                      ) : (
                        ""
                      )}
                    </motion.span>
                  );
                },
              )}
            </motion.h2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-12 max-w-[650px] mx-auto text-center">
              Explore our recent work and the impact{" "}
              <span className="md:hidden">
                <br />
              </span>
              we've made for our clients.
            </p>
            <div className="flex flex-col gap-2 group w-full">
              {caseStudies.map((study, index) => (
                <a
                  key={index}
                  href={`/work/${study.slug}`}
                  className="bg-[#0E0E10] rounded-xl p-3 cursor-pointer transition-all duration-300 group-hover:opacity-50 hover:!opacity-100 focus:outline-none flex flex-col md:flex-row gap-6 w-full group/card"
                >
                  <div className="w-full md:w-[260px] shrink-0 rounded-lg flex items-center justify-center overflow-hidden aspect-[16/10] md:aspect-auto relative">
                    <Image
                      src={study.image}
                      alt={study.title}
                      fill
                      className="object-cover"
                      loading="lazy"
                      quality={85}
                      sizes="(max-width: 768px) 100vw, 260px"
                    />
                  </div>
                  <div className="flex flex-col py-3 px-2 md:px-0 md:pr-4">
                    <p className="text-[15px] text-zinc-500 leading-relaxed mb-6 flex-grow">
                      {highlightKeywords(
                        study.description.substring(0, 120) +
                          (study.description.length > 120 ? "..." : ""),
                        study.keywords || [],
                      )}
                    </p>
                    <div className="flex items-center justify-between gap-4 mt-auto">
                      <div className="flex items-center gap-1 text-white text-[13px] font-medium">
                        View More{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-3.5 h-3.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m8.25 4.5 7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </div>
                      {study.tags && study.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-end">
                          {study.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2.5 py-1 text-[11px] font-medium text-zinc-400 bg-zinc-900/40 rounded-full font-display"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          className="w-[98%] bg-[#0C0C0E] rounded-2xl flex justify-center"
        >
          <div className="w-full max-w-[800px] px-6 py-20">
            <h2 className="text-xl md:text-2xl font-medium leading-tight tracking-tight text-zinc-100 mb-3 text-center">
              Common questions, <span className="text-zinc-100">answered</span>
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-12 max-w-[650px] mx-auto text-center">
              Everything you need to know about working with us.
            </p>
            <div className="max-w-[400px] md:max-w-[550px] mx-auto group/faq-list">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFaqIndex === index}
                  onToggle={() =>
                    setOpenFaqIndex(openFaqIndex === index ? null : index)
                  }
                  isDimmed={openFaqIndex !== null && openFaqIndex !== index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Footer/Contact Section */}
        <section
          id="contact"
          className="w-full h-[400px] bg-[#0E0E11] rounded-2xl flex flex-col items-center -mt-4 relative"
        >
          <div className="w-full max-w-[800px] px-6 pt-8">
            <div className="rounded-2xl p-8 md:p-10 text-center relative overflow-hidden">
              <div className="max-w-sm mx-auto relative z-10 mt-4">
                <motion.h2
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={{
                    initial: {},
                    animate: {
                      transition: {
                        staggerChildren: 0.15,
                      },
                    },
                  }}
                  className="text-2xl md:text-[32px] font-medium leading-tight text-zinc-100"
                >
                  <motion.span
                    variants={{
                      initial: { opacity: 0, filter: "blur(10px)", y: 10 },
                      animate: { opacity: 1, filter: "blur(0px)", y: 0 },
                    }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="block"
                  >
                    {ctaText}
                  </motion.span>
                  <motion.span
                    variants={{
                      initial: { opacity: 0, filter: "blur(10px)", y: 10 },
                      animate: { opacity: 1, filter: "blur(0px)", y: 0 },
                    }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="text-zinc-400 block"
                  >
                    Let&apos;s discuss your project
                  </motion.span>
                </motion.h2>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2 group">
                  <a
                    href={acceptUrl}
                    className="px-3.5 py-1.5 text-[13px] font-medium bg-zinc-100 text-zinc-900 rounded-full transition-all duration-300 group-hover:opacity-50 hover:!opacity-100 inline-flex items-center gap-1.5 focus:outline-none"
                  >
                    Accept proposal
                    <CheckIcon className="w-3.5 h-3.5" strokeWidth={2} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Illustration */}
          <img
            src="/s37_footer_illu.webp"
            alt="Footer illustration"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0 md:top-0 h-full md:h-full object-contain object-bottom md:object-top pointer-events-none z-0"
          />
        </section>
      </motion.div>
    </div>
  );
}
