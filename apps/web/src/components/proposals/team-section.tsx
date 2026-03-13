"use client";

import Image from "next/image";

type TeamMember = {
  name: string;
  role: string;
  description: string;
  image: string;
};

type TeamSectionProps = {
  teamMembers: TeamMember[];
  title?: string;
  description?: string;
};

export function TeamSection({
  teamMembers,
  title = "Our Team",
  description = "A senior, focused team specialized in strategy and design.",
}: TeamSectionProps) {
  if (!teamMembers || teamMembers.length === 0) {
    return null;
  }

  return (
    <section
      id="team"
      className="w-[98%] flex flex-col items-center py-12 md:py-16"
    >
      <div className="w-full max-w-[1200px] px-6">
        <h2 className="text-xl md:text-2xl font-sans font-medium leading-tight tracking-tight text-zinc-900 mb-3 text-center">
          {title}
        </h2>
        <p className="text-sm text-zinc-600 leading-relaxed mb-12 max-w-[650px] mx-auto text-center">
          {description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 group">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden transition-all duration-300 group-hover:opacity-50 hover:!opacity-100 focus-within:!opacity-100"
            >
              {/* Team Member Image */}
              <div className="relative w-full aspect-[16/10] bg-zinc-100 overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  quality={85}
                  sizes="(max-width: 768px) 100vw, 600px"
                  loading={index < 2 ? "eager" : "lazy"}
                />
              </div>

              {/* Team Member Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-sans font-medium text-zinc-900">
                    {member.name}
                  </h3>
                  <span className="text-sm text-zinc-600 font-sans">
                    {member.role}
                  </span>
                </div>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
