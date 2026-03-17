"use client";

import { useState } from "react";
import { ProposalLayout } from "@/components/proposals/proposal-layout";
import { IntroSection } from "@/components/proposals/intro-section";
import { ProjectGoals } from "@/components/proposals/project-goals";
import { ScopeOfWork } from "@/components/proposals/scope-of-work";
import { ProcessSection } from "@/components/proposals/process-section";
import { CaseStudiesSection } from "@/components/proposals/case-studies-section";
import { TestimonialsSection } from "@/components/proposals/testimonials-section";
import { PricingSection } from "@/components/proposals/pricing-section";
import { TeamSection } from "@/components/proposals/team-section";
import { FAQItem } from "@/components/proposals/faq-item";
import { BlurInHeading } from "@/components/ui/blur-in-heading";

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
    price?: number;
    pricingTitle?: string;
    pricingDescription?: string;
    pricingFeatures?: string[];
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
    { id: "testimonials", label: "Testimonials" },
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
        title={introTitle || `Go-to-Market Strategy – ${brandName}`}
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
      <CaseStudiesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Team Section */}
      {teamMembers.length > 0 && (
        <TeamSection
          teamMembers={teamMembers}
          title={teamTitle}
          description={teamDescription}
        />
      )}

      {/* Pricing Section */}
      <PricingSection
        item={data.price !== undefined ? {
          title: data.pricingTitle || "Project Investment",
          description: data.pricingDescription || "Fixed price for the complete project scope.",
          price: `€${data.price.toLocaleString("fr-FR")}`,
          features: data.pricingFeatures || [
            "Complete project delivery",
            "All revisions included",
            "Source files included",
            "Post-launch support",
          ],
        } : undefined}
      />

      {/* FAQ Section */}
      <section id="faq" className="scroll-mt-24">
        <BlurInHeading className="text-[24px] font-sans font-medium text-zinc-900 mb-2">
          Frequently Asked Questions
        </BlurInHeading>

        <p className="text-sm text-zinc-600 text-left w-full mb-8">
          Everything you need to know before getting started.
        </p>

        <div className="w-full space-y-4">
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
