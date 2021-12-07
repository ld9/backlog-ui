import AudioFile from "../types/AudioFile";

import "../styles/components/AudioThumb.css";
import MediaItem from "../types/MediaItem";

export default function AudioThumb({
  track,
  setMediaModal,
}: {
  track: MediaItem;
  setMediaModal: any;
}) {
  return (
    <div className="audio-thumb-behind" data-testid="audio-thumb">
      <div
        className="audio-thumb-bgparent"
        style={{ backgroundImage: `url(${track.meta.thumb})` }}
      >
        <div
          className="audio-thumb"
          tabIndex={0}
          onClick={setMediaModal}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setMediaModal();
            }
          }}
        >
          <div className="audio-thumb-text">
            <div className="audio-thumb-title">{track.meta.title}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
