"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckIcon } from "@heroicons/react/24/outline";
import { ProposalLayout } from "@/components/proposals/proposal-layout";
import { IntroSection } from "@/components/proposals/intro-section";
import { ProjectGoals } from "@/components/proposals/project-goals";
import { ScopeOfWork } from "@/components/proposals/scope-of-work";
import { ProcessSection } from "@/components/proposals/process-section";
import { PricingSection } from "@/components/proposals/pricing-section";
import { TeamSection } from "@/components/proposals/team-section";
import { FAQItem } from "@/components/proposals/faq-item";
import { highlightKeywords } from "@/lib/highlight-keywords";

const DEFAULT_GOALS = [
  {
    title: "Accelerate Pipeline Generation",
    description:
      "Implement a multi-channel outreach strategy to consistently generate high-quality leads.",
  },
  {
    title: "Optimize Conversion Rates",
    description:
      "Refine messaging and targeting to improve response rates and meeting bookings.",
  },
  {
    title: "Scale Revenue Operations",
    description:
      "Build a repeatable, data-driven sales engine that grows with your team.",
  },
];

const DEFAULT_SCOPE = [
  { name: "ICP & Persona Definition", timeline: "Week 1" },
  { name: "Tech Stack Setup", timeline: "Week 1-2" },
  { name: "Campaign Launch", timeline: "Week 3" },
  { name: "Optimization & Scaling", timeline: "Ongoing" },
];

const DEFAULT_PROCESS_PHASES = [
  {
    step: "01",
    title: "Strategy & Setup",
    description:
      "We define your Ideal Customer Profile (ICP) and set up the necessary tools and domains.",
  },
  {
    step: "02",
    title: "Campaign Execution",
    description:
      "We launch targeted email and LinkedIn campaigns to engage your prospects.",
  },
  {
    step: "03",
    title: "Analysis & Iteration",
    description:
      "We track performance metrics and refine our approach to maximize results.",
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

type TeamMember = {
  name: string;
  role: string;
  description: string;
  image: string;
};

type TemplateGTMProps = {
  data: {
    projectTitle?: string;
    projectDescription?: string;
    brandName?: string;
    videoUrl?: string;
    introTitle?: string;
    introDescription?: string;
    designImages?: string[];
    designCarouselTitle?: string;
    designCarouselDescription?: string;
    processPhases?: Array<{
      step: string;
      title: string;
      description: string;
    }>;
    caseStudies?: Array<{
      slug: string;
      title: string;
      description: string;
      keywords?: string[];
      tags: string[];
      image: string;
    }>;
    teamMembers?: TeamMember[];
    teamTitle?: string;
    teamDescription?: string;
    faqs?: Array<{
      question: string;
      answer: string;
    }>;
    ctaText?: string;
    acceptUrl?: string;
  };
};

export function TemplateGTM({ data }: TemplateGTMProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const brandName = data.brandName || "S37™";
  const videoUrl = data.videoUrl;
  const introTitle = data.introTitle || "Welcome to Propal!";
  const introDescription =
    data.introDescription ||
    "Learn how to use our builder by watching this video.";
  const caseStudies = data.caseStudies || DEFAULT_CASE_STUDIES;
  const teamMembers = data.teamMembers || [];
  const teamTitle = data.teamTitle || "Our Team";
  const teamDescription =
    data.teamDescription ||
    "A senior, focused team specialized in strategy and design.";
  const faqs = data.faqs || DEFAULT_FAQS;
  const ctaText = data.ctaText || "Ready to get started?";
  const acceptUrl = data.acceptUrl || "#contact";

  const sidebarSections = [
    { id: "intro", label: "Overview" },
    { id: "goals", label: "Project Goals" },
    { id: "scope", label: "Scope of Work" },
    { id: "process", label: "Process" },
    { id: "case-studies", label: "Case Studies" },
    ...(teamMembers.length > 0 ? [{ id: "team", label: "Our Team" }] : []),
    { id: "pricing", label: "Pricing" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <ProposalLayout
      sections={sidebarSections}
      brandName={brandName}
      acceptUrl={acceptUrl}
    >
      {/* Intro / Loom Video Section */}
      <IntroSection
        videoUrl={videoUrl}
        title={
          introTitle ||
          `Go-to-Market Strategy – ${brandName}`
        }
        description={
          introDescription ||
          "This proposal outlines a strategic approach to accelerate your pipeline, optimize conversions, and scale your revenue operations."
        }
        showPlaceholder={!videoUrl}
      />

      {/* Project Goals */}
      <ProjectGoals goals={DEFAULT_GOALS} />

      {/* Scope of Work */}
      <ScopeOfWork items={DEFAULT_SCOPE} />

      {/* Process Section */}
      <ProcessSection steps={DEFAULT_PROCESS_PHASES} />

      {/* Case Studies Section */}
      <section id="case-studies" className="scroll-mt-24">
        <h2 className="text-2xl font-sans font-medium text-zinc-900 mb-8">
          Case Studies
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {caseStudies.map((study, index) => (
            <a
              key={index}
              href={`/work/${study.slug}`}
              className="group block bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden hover:bg-zinc-100 transition-colors duration-300"
            >
              <div className="flex flex-col md:flex-row gap-6 p-6">
                <div className="w-full md:w-[200px] shrink-0 aspect-video md:aspect-[4/3] relative rounded-lg overflow-hidden bg-zinc-200">
                  <Image
                    src={study.image}
                    alt={study.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-xl font-sans font-medium text-zinc-900">
                      {study.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {study.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-zinc-600 bg-zinc-200 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-zinc-600 text-sm leading-relaxed mb-6 flex-grow">
                    {highlightKeywords(
                      study.description.substring(0, 150) + "...",
                      study.keywords || []
                    )}
                  </p>
                  <div className="flex items-center text-sm font-medium text-zinc-700 group-hover:text-zinc-900 transition-colors">
                    View Case Study
                    <svg
                      className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Team Section */}
      {teamMembers.length > 0 && (
        <TeamSection
          teamMembers={teamMembers}
          title={teamTitle}
          description={teamDescription}
        />
      )}

      {/* Pricing Section */}
      <PricingSection />

      {/* FAQ Section */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-sans font-medium text-zinc-900 mb-8">
          Frequently Asked Questions
        </h2>

        <p className="text-zinc-600 text-left max-w-2xl mb-12">
          Everything you need to know before getting started.
        </p>

        <div className="w-full max-w-4xl space-y-4">
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
      </section>
    </ProposalLayout>
  );
}
