import MediaItem from "../types/MediaItem";

import "../styles/components/MovieModal.css";
import { ArrowUpRight, Cross } from "akar-icons";
import React from "react";
import { strings } from "../strings";

export default function MovieModal({
  media,
  setShowMedia,
}: {
  media: MediaItem | null;
  setShowMedia: any;
}) {
  return (
    <div className="media-modal">
      <div
        className="modal-image"
        style={{ backgroundImage: `url(${media?.meta.thumb})` }}
      >
        <div
          className="media-modal-exit"
          onClick={() => {
            setShowMedia(false);
          }}
        >
          <Cross />
        </div>
      </div>
      <div className="modal-content">
        <div className="modal-content-head">
          <div className="modal-content-title">{media?.meta.title || "?"}</div>
          <div className="modal-content-play">
            <span>{strings.movies_popup_watch}</span>
            <ArrowUpRight />
          </div>
        </div>
        <div className="modal-content-block">
          <div className="modal-content-little">
            <div className="modal-content-genre">{media?.meta.genre}</div>
            <div className="modal-content-released">{media?.meta.released}</div>
            <div className="modal-content-tags">{media?.tags.toString()}</div>
          </div>
          <div className="modal-content-description">
            {media?.meta.description || strings.movies_popup_defaultDescription}
          </div>
        </div>
      </div>
    </div>
  );
}
