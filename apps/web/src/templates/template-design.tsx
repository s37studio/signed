"use client";

import { useState } from "react";
import { ProposalLayout } from "@/components/proposals/proposal-layout";
import { IntroSection } from "@/components/proposals/intro-section";
import { DesignCarousel } from "@/components/proposals/design-carousel";
import { ProjectGoals } from "@/components/proposals/project-goals";
import { ScopeOfWork } from "@/components/proposals/scope-of-work";
import { ProcessSection } from "@/components/proposals/process-section";
import { CaseStudiesSection } from "@/components/proposals/case-studies-section";
import { TestimonialsSection } from "@/components/proposals/testimonials-section";
import { PricingSection } from "@/components/proposals/pricing-section";
import { TeamSection } from "@/components/proposals/team-section";
import { FAQItem } from "@/components/proposals/faq-item";
import { BlurInHeading } from "@/components/ui/blur-in-heading";

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
    title?: string;
    price?: number;
    pricingTitle?: string;
    pricingDescription?: string;
    pricingFeatures?: string[];
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
    data.title ||
    `Website Design & Development – ${data.brandName || "Your Company"}`;
  const designCarouselDescription =
    data.designCarouselDescription ||
    "This proposal outlines a strategic branding process designed to clarify your positioning, strengthen your identity, and create a brand that drives long-term growth.";
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
