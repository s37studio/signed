"use client";

type IntroSectionProps = {
  videoUrl?: string;
  title?: string;
  description?: string;
  showPlaceholder?: boolean;
};

export function IntroSection({
  videoUrl,
  title = "Introduction",
  description,
  showPlaceholder = false,
}: IntroSectionProps) {
  const isLoomVideo = videoUrl?.includes("loom.com");
  const isYouTubeVideo =
    videoUrl?.includes("youtube.com") || videoUrl?.includes("youtu.be");
  const isVimeoVideo = videoUrl?.includes("vimeo.com");

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

  const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : null;
  const hasVideo = !!videoUrl && !!embedUrl;

  if (!hasVideo && !showPlaceholder) {
    return null;
  }

  return (
    <section
      id="intro"
      className="w-[98%] flex flex-col items-center py-12 md:py-16"
    >
      <div className="w-full max-w-[1200px] px-6">
        <h2 className="text-xl md:text-2xl font-display font-medium leading-tight tracking-tight text-zinc-100 mb-3 text-left">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-zinc-400 leading-relaxed mb-12 max-w-[650px] text-left">
            {description}
          </p>
        )}

        <div className="relative w-full overflow-hidden rounded-xl bg-[#0E0E10] flex items-center justify-center">
          <div className="relative w-full h-[min(55vh,552px)]">
            {hasVideo ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <iframe
                  src={embedUrl}
                  className="w-full h-full rounded-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Introduction video"
                />
              </div>
            ) : showPlaceholder ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-3 text-zinc-500">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                  <p className="text-sm font-medium">Loom video placeholder</p>
                  <p className="text-xs text-zinc-600">
                    Add your Loom video URL in the template settings
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
