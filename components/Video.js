import { getVideos } from "@/lib/content";
import { VIDEO_CATEGORIES } from "@/lib/data";
import VideoList from "./VideoList";
import Reveal from "./Reveal";

export default async function Video() {
  const videos = await getVideos();
  return (
    <section id="video" className="pd-section">
      <div className="pd-container">
        <Reveal>
          <div style={{ maxWidth: 640, marginBottom: 30 }}>
            <span className="pd-eyebrow">Video</span>
            <h2 className="pd-h2">Konten dari YouTube</h2>
          </div>
        </Reveal>
        <VideoList videos={videos} categories={VIDEO_CATEGORIES} />
      </div>
    </section>
  );
}
