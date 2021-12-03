import { useEffect, useState } from "react";
import { useGlobalState } from "../../state";
import { BASE_API_URL } from "../../variables";
import { socket } from "../../socket";

import VideoThumb from "../VideoThumb";
import MediaItem from "../../types/MediaItem";
import { SocketBeaconMessageType } from "../../types/SocketInfoMessage";
import { ToastType } from "../../types/ToastType";

export default function ContinueWatching() {
  const [user, setUser] = useGlobalState("user");
  const [stage, setStage] = useGlobalState("stage");
  const [toasts, setToasts] = useGlobalState("toasts");

  const [vidCache, setVidCache] = useState<Record<string, MediaItem>>({});
  const [update, setUpdate] = useState(0);
  const [mediaAdapter, setMediaAdapter] = useState<MediaItem>();

  useEffect(() => {
    let lvc = vidCache;

    user.recent.video.forEach(
      async (video: { mediaId: any; time: number }, i) => {
        console.log(video.mediaId);

        const fetchResult = await fetch(
          `${BASE_API_URL}/api/media/${video.mediaId}`
        );
        const fetchJson = await fetchResult.json();

        let obtainedJson = await fetchJson;

        // Only list recent videos in the continue watching field
        if ((obtainedJson as MediaItem).type.includes("video")) {
          lvc[video.mediaId] = obtainedJson;
        }

        setVidCache(lvc);
        // Forces a re-render
        setUpdate(i);
      }
    );
  }, [user]);

  const addToQueueEnd = (rawMedia: MediaItem, time: number) => {
    if (rawMedia !== null) {
      const media: MediaItem = {
        ...rawMedia,
        startsAt: time,
      };

      fetch(`${BASE_API_URL}/user/recent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user._id,
          media: media._id,
          payload: {
            mediaId: media._id,
            time: 0,
          },
          type: "video",
        }),
      });

      setToasts([
        ...toasts,
        {
          until: Date.now() + 2000,
          type: ToastType.GOOD,
          content: `Added "${media.meta.title}" to queue`,
        },
      ]);

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
    <div className="dash-continue-list">
      {user.recent.video.map((video: { mediaId: any; time: number }, idx) => {
        if (!vidCache[video.mediaId]) {
          return null;
        }

        return (
          <div className="dash-continue-item" key={idx}>
            <VideoThumb
              setMediaModal={function () {
                addToQueueEnd(vidCache[video.mediaId], video.time);
              }}
              video={vidCache[video.mediaId]}
              time={video.time}
            ></VideoThumb>
          </div>
        );
      })}
    </div>
  );
}
