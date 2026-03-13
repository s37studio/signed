"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckIcon } from "@heroicons/react/24/outline";
import { ProposalLayout } from "@/components/proposals/proposal-layout";
import { IntroSection } from "@/components/proposals/intro-section";
import { DesignCarousel } from "@/components/proposals/design-carousel";
import { ProjectGoals } from "@/components/proposals/project-goals";
import { ScopeOfWork } from "@/components/proposals/scope-of-work";
import { ProcessSection } from "@/components/proposals/process-section";
import { PricingSection } from "@/components/proposals/pricing-section";
import { TeamSection } from "@/components/proposals/team-section";
import { FAQItem } from "@/components/proposals/faq-item";
import { highlightKeywords } from "@/lib/highlight-keywords";

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

const DEFAULT_GOALS = [
  {
    title: "High-Converting Design",
    description:
      "Create a visually stunning website that captures attention and drives conversions.",
  },
  {
    title: "Seamless User Experience",
    description:
      "Ensure intuitive navigation and fast load times for a frictionless user journey.",
  },
  {
    title: "Scalable Architecture",
    description:
      "Build on a robust tech stack that grows with your business needs.",
  },
];

const DEFAULT_SCOPE = [
  { name: "UX/UI Design", timeline: "2-3 weeks" },
  { name: "Frontend Development", timeline: "3-4 weeks" },
  { name: "CMS Integration", timeline: "1-2 weeks" },
  { name: "SEO & Performance", timeline: "1 week" },
];

const DEFAULT_PROCESS_STEPS = [
  {
    step: "01",
    title: "Discovery & Design",
    description:
      "We map out user flows and create high-fidelity mockups for your approval.",
  },
  {
    step: "02",
    title: "Development",
    description:
      "We build your site using modern frameworks, ensuring speed and responsiveness.",
  },
  {
    step: "03",
    title: "Launch & Optimize",
    description:
      "We deploy your site, monitor performance, and make data-driven adjustments.",
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

type TemplateDesignProps = {
  data: {
    projectTitle?: string;
    projectDescription?: string;
    brandName?: string;
    videoUrl?: string;
    introTitle?: string;
    introDescription?: string;
    processSteps?: Array<{
      step: string;
      title: string;
      description: string;
    }>;
    designShots?: string[];
    designCarouselTitle?: string;
    designCarouselDescription?: string;
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

export function TemplateDesign({ data }: TemplateDesignProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const brandName = data.brandName || "S37™";
  const videoUrl = data.videoUrl;
  const introTitle = data.introTitle;
  const introDescription = data.introDescription;
  const processSteps = data.processSteps || DEFAULT_PROCESS_STEPS;
  const designShots = data.designShots || DEFAULT_DESIGN_SHOTS;
  const designCarouselTitle =
    data.designCarouselTitle ||
    `Website Design & Development – ${data.brandName || "Your Company"}`;
  const designCarouselDescription =
    data.designCarouselDescription ||
    "This proposal outlines a strategic branding process designed to clarify your positioning, strengthen your identity, and create a brand that drives long-term growth.";
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
    ...(designShots.length > 0 ? [{ id: "designs", label: "Overview" }] : []),
    ...(videoUrl ? [{ id: "intro", label: "Introduction" }] : []),
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
      {/* Design Carousel Section */}
      {designShots.length > 0 && (
        <DesignCarousel
          images={designShots}
          title={designCarouselTitle}
          description={designCarouselDescription}
        />
      )}

      {/* Intro Video Section */}
      {videoUrl && (
        <IntroSection
          videoUrl={videoUrl}
          title={introTitle}
          description={introDescription}
        />
      )}

      {/* Project Goals */}
      <ProjectGoals goals={DEFAULT_GOALS} />

      {/* Scope of Work */}
      <ScopeOfWork items={DEFAULT_SCOPE} />

      {/* Process Section */}
      <ProcessSection steps={processSteps} />

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
