"use client";

import { motion } from "framer-motion";

type IntroSectionProps = {
  videoUrl?: string;
  title?: string;
  description?: string;
};

export function IntroSection({
  videoUrl,
  title = "Introduction",
  description,
}: IntroSectionProps) {
  if (!videoUrl) {
    return null;
  }

  const isLoomVideo = videoUrl.includes("loom.com");
  const isYouTubeVideo =
    videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
  const isVimeoVideo = videoUrl.includes("vimeo.com");

  const getEmbedUrl = (url: string) => {
    if (isLoomVideo) {
      const match = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
      return match ? `https://www.loom.com/embed/${match[1]}` : url;
    }
    if (isYouTubeVideo) {
      const match =
        url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/) ||
        url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : url;
    }
    if (isVimeoVideo) {
      const match = url.match(/vimeo\.com\/(\d+)/);
      return match ? `https://player.vimeo.com/video/${match[1]}` : url;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <motion.section
      id="intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-[98%] bg-[#0C0C0E] rounded-2xl flex flex-col items-center py-12 md:py-16"
    >
      <div className="w-full max-w-[1200px] px-6">
        {(title || description) && (
          <div className="mb-8 text-center">
            {title && (
              <h2 className="text-xl md:text-2xl font-medium leading-tight tracking-tight text-zinc-100 mb-3">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-zinc-400 leading-relaxed max-w-[650px] mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="relative w-full">
          <div className="aspect-video bg-zinc-900/50 rounded-xl overflow-hidden">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Introduction video"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
