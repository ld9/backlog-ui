import { useState } from "react";
import MediaItem from "../types/MediaItem";

import "../styles/components/VideoThumb.css";
import { IconLock } from "@tabler/icons";

export default function VideoThumb({
  video,
  setMediaModal,
}: {
  video: MediaItem;
  setMediaModal: any;
}) {
  const tmdbImage = () => {
    if (video.meta.tmdb) {
      if (video.meta.tmdb.backdrop_path) {
        return `https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces/${video.meta.tmdb.backdrop_path}`;
      }
    }

    return undefined;
  };

  return (
    <div className="video-thumb-behind">
      <div
        className="video-thumb-bgparent"
        style={{ backgroundImage: `url(${tmdbImage()})` }}
      >
        <div
          className="video-thumb"
          onClick={() => {
            setMediaModal(video);
          }}
        >
          {video.previewOnly ? (
            <div className="video-thumb-locked">
              <IconLock size={32}></IconLock>
            </div>
          ) : null}
          <div className="video-thumb-text">
            <div className="video-thumb-title">{video.meta.title}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
