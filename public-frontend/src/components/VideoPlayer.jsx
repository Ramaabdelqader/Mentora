export default function VideoPlayer({ url, title }) {
  if (!url) return null;

  const isYouTube =
    url.includes("youtube.com/watch") || url.includes("youtu.be/");
  const isVimeo = url.includes("vimeo.com/");
  const isMp4 = url.endsWith(".mp4") || url.includes(".mp4?");

  if (isMp4) {
    return (
      <div className="aspect-video w-full rounded-2xl ring-1 ring-gray-200 overflow-hidden">
        <video controls src={url} className="w-full h-full" />
      </div>
    );
  }

  // Normalize YouTube/Vimeo to embed URLs
  const embedUrl = isYouTube
    ? url.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/")
    : isVimeo
    ? url.replace("vimeo.com/", "player.vimeo.com/video/")
    : url;

  return (
    <div className="aspect-video w-full rounded-2xl ring-1 ring-gray-200 overflow-hidden">
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
