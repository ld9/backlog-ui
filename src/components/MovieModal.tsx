import MediaItem from "../types/MediaItem";

import "../styles/components/MovieModal.css";
import { strings } from "../strings";
import { useGlobalState } from "../state";
import {
  IconArrowsMinimize,
  IconArrowUpRight,
  IconPencil,
  IconRowInsertBottom,
} from "@tabler/icons";
import { socket } from "../socket";
import { SocketBeaconMessageType } from "../types/SocketInfoMessage";
import { BASE_API_URL } from "../variables";

export default function MovieModal({
  media,
  setShowMedia,
}: {
  media: MediaItem | null;
  setShowMedia: any;
}) {
  const [user, setUser] = useGlobalState("user");
  const [stage, setStage] = useGlobalState("stage");

  const tmdbImage = () => {
    if (media) {
      if (media.meta.tmdb) {
        if (media.meta.tmdb.backdrop_path) {
          return `https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces/${media.meta.tmdb.backdrop_path}`;
        }
      }
    }

    return undefined;
  };

  const addToQueueEnd = () => {
    if (media !== null) {
      fetch(`${BASE_API_URL}/user/recent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user._id,
          media: media._id,
          type: "video",
        }),
      })
        .then((res) => res.text())
        .then((txt) => console.log(txt));

      setStage({
        ...stage,
        queue: [...stage.queue, media],
      } as any);

      socket.emit(
        "inform-peer",
        JSON.stringify({
          from: socket.id,
          type: SocketBeaconMessageType.QUEUE,
          queue: media,
        })
      );
    }
  };

  return (
    <div className="media-modal">
      <div
        className="modal-image"
        style={{ backgroundImage: `url(${tmdbImage()})` }}
      >
        <div
          className="media-modal-exit"
          onClick={() => {
            setShowMedia(false);
          }}
        >
          <IconArrowsMinimize />
        </div>
      </div>
      <div className="modal-content">
        <div className="modal-content-head">
          <div className="modal-content-title">{media?.meta.title || "?"}</div>
          <div className="modal-content-button-contain">
            {user.permissions.user.admin ? (
              <div className="modal-content-button">
                <span>{strings.movies_popup_edit}</span>
                <IconPencil />
              </div>
            ) : null}
            {media?.previewOnly ? null : stage.queue.length == 0 ? (
              <div className="modal-content-button" onClick={addToQueueEnd}>
                <span>{strings.movies_popup_watch}</span>
                <IconArrowUpRight />
              </div>
            ) : (
              <div className="modal-content-button" onClick={addToQueueEnd}>
                <span>{strings.movies_popup_enqueue}</span>
                <IconRowInsertBottom />
              </div>
            )}
          </div>
        </div>
        <div className="modal-content-block">
          <div className="modal-content-little">
            <div className="modal-content-genre">{media?.meta.genre}</div>
            <div className="modal-content-released">{media?.meta.released}</div>
            <div className="modal-content-tags">
              {media?.tags.map((tag, idx) => {
                return <div key={idx}>{tag}</div>;
              })}
            </div>
          </div>
          <div className="modal-content-description">
            {media?.meta.description || strings.movies_popup_defaultDescription}
          </div>
        </div>
      </div>
    </div>
  );
}
