import { useState } from "react";
import MediaItem from "../types/MediaItem";

import "../styles/components/VideoThumb.css";
import { IconLock } from "@tabler/icons";

export default function VideoThumb({
  video,
  setMediaModal,
  time = -1,
}: {
  video: MediaItem;
  setMediaModal: any;
  time?: number;
}) {
  const tmdbImage = () => {
    if (video.meta.tmdb) {
      if (video.meta.tmdb.backdrop_path) {
        return `https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces/${video.meta.tmdb.backdrop_path}`;
      }
    }

    return undefined;
  };

  const formatTime = (time: number): string => {
    return new Date(time * 1000).toISOString().substr(14, 5);
  };

  return (
    <div className="video-thumb-behind">
      <div
        className="video-thumb-bgparent"
        style={{ backgroundImage: `url(${tmdbImage()})` }}
      >
        <div
          className="video-thumb"
          tabIndex={0} 
          onClick={() => {
            setMediaModal(video);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setMediaModal(video);
            }
          }}
          >
          {video.previewOnly ? (
            <div className="video-thumb-locked">
              <IconLock size={32}></IconLock>
            </div>
          ) : null}
          <div className="video-thumb-text">
            <div className="video-thumb-title">{video.meta.title}</div>
            {time != -1 ? (
              <div className="video-thumb-time">{formatTime(time)}</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
